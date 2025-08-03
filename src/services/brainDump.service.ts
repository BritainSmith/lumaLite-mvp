import { Injectable } from '@nestjs/common';
import { TaskRepository } from "../repositories/task.repository";

@Injectable()
export class BrainDumpService {
  constructor(private taskRepository: TaskRepository) {}

  async saveSortedDump(sorted: {
    tasks: string[];
    worries: string[];
    ideas: string[];
    random: string[];
  }) {
    return await this.taskRepository.createTaskEntry({
      type: "brain_dump",
      ...sorted,
    });
  }
}
