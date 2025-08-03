import { Test, TestingModule } from '@nestjs/testing';
import { BrainDumpService } from './brainDump.service';
import { TaskRepository } from '../repositories/task.repository';

describe('BrainDumpService', () => {
  let service: BrainDumpService;
  let taskRepository: TaskRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrainDumpService,
        {
          provide: TaskRepository,
          useValue: {
            createTaskEntry: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BrainDumpService>(BrainDumpService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveSortedDump', () => {
    it('should successfully save brain dump to database', async () => {
      const sortedData = {
        tasks: ['buy groceries', 'call mom'],
        worries: ['work deadline'],
        ideas: ['start a blog'],
        random: ['remember to water plants'],
      };

      const mockSavedEntry = {
        id: 1,
        type: 'brain_dump',
        ...sortedData,
        createdAt: new Date(),
      };

      (taskRepository.createTaskEntry as jest.Mock).mockResolvedValue(mockSavedEntry);

      const result = await service.saveSortedDump(sortedData);

      expect(taskRepository.createTaskEntry).toHaveBeenCalledWith({
        type: 'brain_dump',
        ...sortedData,
      });
      expect(result).toEqual(mockSavedEntry);
    });

    it('should handle database errors', async () => {
      const sortedData = {
        tasks: ['buy groceries'],
        worries: [],
        ideas: [],
        random: [],
      };

      const error = new Error('Database connection failed');
      (taskRepository.createTaskEntry as jest.Mock).mockRejectedValue(error);

      await expect(service.saveSortedDump(sortedData)).rejects.toThrow('Database connection failed');
    });

    it('should log successful save operation', async () => {
      const sortedData = {
        tasks: ['buy groceries'],
        worries: ['work stress'],
        ideas: ['learn guitar'],
        random: ['remember appointment'],
      };

      const mockSavedEntry = {
        id: 1,
        type: 'brain_dump',
        ...sortedData,
        createdAt: new Date(),
      };

      (taskRepository.createTaskEntry as jest.Mock).mockResolvedValue(mockSavedEntry);
      const logSpy = jest.spyOn(service['logger'], 'log');

      await service.saveSortedDump(sortedData);

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Saving brain dump to database with 4 categories')
      );
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Brain dump saved successfully with ID: 1')
      );
    });

    it('should log error when save fails', async () => {
      const sortedData = {
        tasks: ['buy groceries'],
        worries: [],
        ideas: [],
        random: [],
      };

      const error = new Error('Database error');
      (taskRepository.createTaskEntry as jest.Mock).mockRejectedValue(error);
      const logSpy = jest.spyOn(service['logger'], 'error');

      await expect(service.saveSortedDump(sortedData)).rejects.toThrow('Database error');

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to save brain dump: Database error'),
        error.stack
      );
    });

    it('should handle empty categories', async () => {
      const sortedData = {
        tasks: [],
        worries: [],
        ideas: [],
        random: [],
      };

      const mockSavedEntry = {
        id: 1,
        type: 'brain_dump',
        ...sortedData,
        createdAt: new Date(),
      };

      (taskRepository.createTaskEntry as jest.Mock).mockResolvedValue(mockSavedEntry);
      const logSpy = jest.spyOn(service['logger'], 'log');

      await service.saveSortedDump(sortedData);

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Saving brain dump to database with 4 categories')
      );
    });
  });
}); 