import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntry } from "../entities/taskEntry";

@Injectable()
export class TaskRepository {
  private readonly logger = new Logger(TaskRepository.name);

  constructor(
    @InjectRepository(TaskEntry)
    private taskRepository: Repository<TaskEntry>
  ) {
    this.logger.log('TaskRepository initialized');
  }

  async createTaskEntry(data: {
    type: string;
    tasks: string[];
    worries: string[];
    ideas: string[];
    random: string[];
  }) {
    this.logger.debug(`Creating task entry with type: ${data.type}`);
    
    try {
      const entry = this.taskRepository.create({
        ...data,
      });
      const savedEntry = await this.taskRepository.save(entry);
      
      this.logger.debug(`Task entry created successfully with ID: ${savedEntry.id}`);
      return savedEntry;
    } catch (error) {
      this.logger.error(`Failed to create task entry: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getAllEntries() {
    return await this.taskRepository.find({
      order: {
        createdAt: "DESC",
      },
    });
  }

  async getLatestEntry() {
    return await this.taskRepository.findOne({
      order: {
        createdAt: "DESC",
      },
    });
  }

  async deleteEntry(id: number) {
    return await this.taskRepository.delete(id);
  }
}
