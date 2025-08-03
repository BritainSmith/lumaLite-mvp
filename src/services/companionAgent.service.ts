import { Injectable, Logger } from '@nestjs/common';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { checkInPrompt } from "../prompts/checkInPrompt";
import { sortBrainDumpPrompt } from "../prompts/sortBrainDumpPrompt";
import { BrainDumpService } from "./brainDump.service";

@Injectable()
export class CompanionAgentService {
  private readonly logger = new Logger(CompanionAgentService.name);
  private llm: ChatOpenAI;

  constructor(private brainDumpService: BrainDumpService) {
    this.llm = new ChatOpenAI({
      temperature: 0.7,
      modelName: "gpt-4",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    this.logger.log('CompanionAgentService initialized');
  }

  async handleCheckIn(userInput: string): Promise<string> {
    this.logger.log(`Starting emotional check-in for user input: "${userInput.substring(0, 50)}..."`);
    
    try {
      const prompt = checkInPrompt(userInput);
      this.logger.debug('Generated check-in prompt');

      const response = await this.llm.invoke([
        new HumanMessage(prompt),
      ]);

      const responseText = response.text.trim();
      this.logger.log(`Emotional check-in completed successfully. Response length: ${responseText.length} characters`);
      
      // Log AI interaction for analysis
      this.logger.log('AI Interaction - Check-in', {
        type: 'emotional_check_in',
        userInput: userInput.substring(0, 200),
        responseLength: responseText.length,
        timestamp: new Date().toISOString(),
      });

      return responseText;
    } catch (error) {
      this.logger.error(`Error during emotional check-in: ${error.message}`, error.stack);
      throw error;
    }
  }

  async sortBrainDump(userInput: string): Promise<any> {
    this.logger.log(`Starting brain dump organization for user input: "${userInput.substring(0, 50)}..."`);
    
    try {
      const prompt = sortBrainDumpPrompt(userInput);
      this.logger.debug('Generated brain dump prompt');

      const response = await this.llm.invoke([
        new HumanMessage(prompt),
      ]);

      this.logger.debug('Received AI response for brain dump organization');

      try {
        const jsonStart = response.text.indexOf("{");
        const jsonStr = response.text.slice(jsonStart);
        const parsed = JSON.parse(jsonStr);

        this.logger.log(`Successfully parsed brain dump JSON. Categories: ${Object.keys(parsed).join(', ')}`);

        // Save to DB via service
        await this.brainDumpService.saveSortedDump(parsed);
        this.logger.log('Brain dump saved to database successfully');

        // Log AI interaction for analysis
        this.logger.log('AI Interaction - Brain Dump', {
          type: 'brain_dump_organization',
          userInput: userInput.substring(0, 200),
          categories: Object.keys(parsed),
          itemCounts: Object.fromEntries(
            Object.entries(parsed).map(([key, value]) => [key, Array.isArray(value) ? value.length : 0])
          ),
          timestamp: new Date().toISOString(),
        });

        return parsed;
      } catch (parseError) {
        this.logger.error(`Failed to parse AI response as JSON: ${parseError.message}`, parseError.stack);
        this.logger.error(`Raw AI response: ${response.text}`);
        return { error: "Sorry, I couldn't organize that properly.", raw: response.text };
      }
    } catch (error) {
      this.logger.error(`Error during brain dump organization: ${error.message}`, error.stack);
      throw error;
    }
  }
} 