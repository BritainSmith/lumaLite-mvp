import { Test, TestingModule } from '@nestjs/testing';
import { CompanionAgentService } from './companionAgent.service';
import { BrainDumpService } from './brainDump.service';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

// Mock the LangChain modules
jest.mock('@langchain/openai');
jest.mock('@langchain/core/messages');

describe('CompanionAgentService', () => {
  let service: CompanionAgentService;
  let brainDumpService: BrainDumpService;
  let mockChatOpenAI: jest.Mocked<ChatOpenAI>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanionAgentService,
        {
          provide: BrainDumpService,
          useValue: {
            saveSortedDump: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CompanionAgentService>(CompanionAgentService);
    brainDumpService = module.get<BrainDumpService>(BrainDumpService);
    
    // Mock the ChatOpenAI instance
    mockChatOpenAI = {
      invoke: jest.fn(),
    } as any;
    
    // Replace the private llm property
    (service as any).llm = mockChatOpenAI;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleCheckIn', () => {
    it('should successfully process emotional check-in', async () => {
      const userInput = 'I am feeling anxious today';
      const mockResponse = {
        text: 'I understand you are feeling anxious. Let me help you through this.',
      };

      mockChatOpenAI.invoke.mockResolvedValue(mockResponse);

      const result = await service.handleCheckIn(userInput);

      expect(mockChatOpenAI.invoke).toHaveBeenCalledWith([
        expect.any(HumanMessage),
      ]);
      expect(result).toBe(mockResponse.text.trim());
    });

    it('should handle errors during emotional check-in', async () => {
      const userInput = 'I am feeling anxious today';
      const error = new Error('API Error');

      mockChatOpenAI.invoke.mockRejectedValue(error);

      await expect(service.handleCheckIn(userInput)).rejects.toThrow('API Error');
    });

    it('should log user input and response length', async () => {
      const userInput = 'I am feeling anxious today';
      const mockResponse = {
        text: 'I understand you are feeling anxious. Let me help you through this.',
      };

      mockChatOpenAI.invoke.mockResolvedValue(mockResponse);
      const logSpy = jest.spyOn(service['logger'], 'log');

      await service.handleCheckIn(userInput);

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Starting emotional check-in for user input')
      );
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Emotional check-in completed successfully')
      );
    });
  });

  describe('sortBrainDump', () => {
    it('should successfully organize brain dump', async () => {
      const userInput = 'I need to buy groceries, I have a meeting tomorrow, and I want to learn guitar';
      const mockResponse = {
        text: '{"tasks": ["buy groceries", "prepare for meeting"], "worries": [], "ideas": ["learn guitar"], "random": []}',
      };

      mockChatOpenAI.invoke.mockResolvedValue(mockResponse);
      (brainDumpService.saveSortedDump as jest.Mock).mockResolvedValue({ id: 1 });

      const result = await service.sortBrainDump(userInput);

      expect(mockChatOpenAI.invoke).toHaveBeenCalledWith([
        expect.any(HumanMessage),
      ]);
      expect(brainDumpService.saveSortedDump).toHaveBeenCalledWith({
        tasks: ['buy groceries', 'prepare for meeting'],
        worries: [],
        ideas: ['learn guitar'],
        random: [],
      });
      expect(result).toEqual({
        tasks: ['buy groceries', 'prepare for meeting'],
        worries: [],
        ideas: ['learn guitar'],
        random: [],
      });
    });

    it('should handle JSON parsing errors', async () => {
      const userInput = 'I need to buy groceries';
      const mockResponse = {
        text: 'Invalid JSON response',
      };

      mockChatOpenAI.invoke.mockResolvedValue(mockResponse);

      const result = await service.sortBrainDump(userInput);

      expect(result).toEqual({
        error: "Sorry, I couldn't organize that properly.",
        raw: 'Invalid JSON response',
      });
    });

    it('should handle API errors', async () => {
      const userInput = 'I need to buy groceries';
      const error = new Error('API Error');

      mockChatOpenAI.invoke.mockRejectedValue(error);

      await expect(service.sortBrainDump(userInput)).rejects.toThrow('API Error');
    });

    it('should log brain dump processing steps', async () => {
      const userInput = 'I need to buy groceries';
      const mockResponse = {
        text: '{"tasks": ["buy groceries"], "worries": [], "ideas": [], "random": []}',
      };

      mockChatOpenAI.invoke.mockResolvedValue(mockResponse);
      (brainDumpService.saveSortedDump as jest.Mock).mockResolvedValue({ id: 1 });
      const logSpy = jest.spyOn(service['logger'], 'log');

      await service.sortBrainDump(userInput);

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Starting brain dump organization')
      );
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Successfully parsed brain dump JSON')
      );
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Brain dump saved to database successfully')
      );
    });
  });
}); 