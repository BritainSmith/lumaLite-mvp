import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskRepository } from './task.repository';
import { TaskEntry } from '../entities/taskEntry';

describe('TaskRepository', () => {
  let repository: TaskRepository;
  let typeOrmRepository: Repository<TaskEntry>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskRepository,
        {
          provide: getRepositoryToken(TaskEntry),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<TaskRepository>(TaskRepository);
    typeOrmRepository = module.get<Repository<TaskEntry>>(getRepositoryToken(TaskEntry));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createTaskEntry', () => {
    it('should successfully create a task entry', async () => {
      const taskData = {
        type: 'brain_dump',
        tasks: ['buy groceries'],
        worries: ['work stress'],
        ideas: ['learn guitar'],
        random: ['remember appointment'],
      };

      const mockCreatedEntry = {
        id: 1,
        ...taskData,
        createdAt: new Date(),
      };

      (typeOrmRepository.create as jest.Mock).mockReturnValue(mockCreatedEntry);
      (typeOrmRepository.save as jest.Mock).mockResolvedValue(mockCreatedEntry);

      const result = await repository.createTaskEntry(taskData);

      expect(typeOrmRepository.create).toHaveBeenCalledWith(taskData);
      expect(typeOrmRepository.save).toHaveBeenCalledWith(mockCreatedEntry);
      expect(result).toEqual(mockCreatedEntry);
    });

    it('should handle database errors during creation', async () => {
      const taskData = {
        type: 'brain_dump',
        tasks: ['buy groceries'],
        worries: [],
        ideas: [],
        random: [],
      };

      const error = new Error('Database constraint violation');
      (typeOrmRepository.create as jest.Mock).mockReturnValue({});
      (typeOrmRepository.save as jest.Mock).mockRejectedValue(error);

      await expect(repository.createTaskEntry(taskData)).rejects.toThrow('Database constraint violation');
    });

    it('should log successful creation', async () => {
      const taskData = {
        type: 'brain_dump',
        tasks: ['buy groceries'],
        worries: [],
        ideas: [],
        random: [],
      };

      const mockCreatedEntry = {
        id: 1,
        ...taskData,
        createdAt: new Date(),
      };

      (typeOrmRepository.create as jest.Mock).mockReturnValue(mockCreatedEntry);
      (typeOrmRepository.save as jest.Mock).mockResolvedValue(mockCreatedEntry);
      const logSpy = jest.spyOn(repository['logger'], 'debug');

      await repository.createTaskEntry(taskData);

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Creating task entry with type: brain_dump')
      );
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Task entry created successfully with ID: 1')
      );
    });

    it('should log error when creation fails', async () => {
      const taskData = {
        type: 'brain_dump',
        tasks: ['buy groceries'],
        worries: [],
        ideas: [],
        random: [],
      };

      const error = new Error('Database error');
      (typeOrmRepository.create as jest.Mock).mockReturnValue({});
      (typeOrmRepository.save as jest.Mock).mockRejectedValue(error);
      const logSpy = jest.spyOn(repository['logger'], 'error');

      await expect(repository.createTaskEntry(taskData)).rejects.toThrow('Database error');

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to create task entry: Database error'),
        error.stack
      );
    });
  });

  describe('getAllEntries', () => {
    it('should return all entries ordered by creation date', async () => {
      const mockEntries = [
        { id: 2, type: 'brain_dump', createdAt: new Date('2023-01-02') },
        { id: 1, type: 'brain_dump', createdAt: new Date('2023-01-01') },
      ];

      (typeOrmRepository.find as jest.Mock).mockResolvedValue(mockEntries);

      const result = await repository.getAllEntries();

      expect(typeOrmRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockEntries);
    });
  });

  describe('getLatestEntry', () => {
    it('should return the latest entry', async () => {
      const mockEntry = { id: 1, type: 'brain_dump', createdAt: new Date() };

      (typeOrmRepository.findOne as jest.Mock).mockResolvedValue(mockEntry);

      const result = await repository.getLatestEntry();

      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockEntry);
    });
  });

  describe('deleteEntry', () => {
    it('should successfully delete an entry', async () => {
      const entryId = 1;
      const mockDeleteResult = { affected: 1 };

      (typeOrmRepository.delete as jest.Mock).mockResolvedValue(mockDeleteResult);

      const result = await repository.deleteEntry(entryId);

      expect(typeOrmRepository.delete).toHaveBeenCalledWith(entryId);
      expect(result).toEqual(mockDeleteResult);
    });
  });
}); 