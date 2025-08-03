import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { checkInPrompt } from "../prompts/checkInPrompt";
import { sortBrainDumpPrompt } from "../prompts/sortBrainDumpPrompt";
import { BrainDumpService } from "./brainDump.service";

@Injectable()
export class CompanionAgentService {
  private llm: ChatOpenAI;

  constructor(private brainDumpService: BrainDumpService) {
    this.llm = new ChatOpenAI({
      temperature: 0.7,
      modelName: "gpt-4",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }

  async handleCheckIn(userInput: string): Promise<string> {
    const prompt = checkInPrompt(userInput);

    const response = await this.llm.invoke([
      new HumanMessage(prompt),
    ]);

    return response.text.trim();
  }

  async sortBrainDump(userInput: string): Promise<any> {
    const prompt = sortBrainDumpPrompt(userInput);

    const response = await this.llm.invoke([
      new HumanMessage(prompt),
    ]);

    try {
      const jsonStart = response.text.indexOf("{");
      const jsonStr = response.text.slice(jsonStart);
      const parsed = JSON.parse(jsonStr);

      // Save to DB via service
      await this.brainDumpService.saveSortedDump(parsed);

      return parsed;
    } catch (err) {
      return { error: "Sorry, I couldn't organize that properly.", raw: response.text };
    }
  }
} 