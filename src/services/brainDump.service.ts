import { Injectable, Logger } from '@nestjs/common';
import { TaskRepository } from "../repositories/task.repository";

@Injectable()
export class BrainDumpService {
  private readonly logger = new Logger(BrainDumpService.name);

  constructor(private taskRepository: TaskRepository) {
    this.logger.log('BrainDumpService initialized');
  }

  async saveSortedDump(sorted: {
    tasks: string[];
    worries: string[];
    ideas: string[];
    random: string[];
  }) {
    this.logger.log(`Saving brain dump to database with ${Object.keys(sorted).length} categories`);
    
    try {
      const result = await this.taskRepository.createTaskEntry({
        type: "brain_dump",
        ...sorted,
      });
      
      this.logger.log(`Brain dump saved successfully with ID: ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to save brain dump: ${error.message}`, error.stack);
      throw error;
    }
  }
}
