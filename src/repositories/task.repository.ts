import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntry } from "../entities/taskEntry";

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(TaskEntry)
    private taskRepository: Repository<TaskEntry>
  ) {}

  async createTaskEntry(data: {
    type: string;
    tasks: string[];
    worries: string[];
    ideas: string[];
    random: string[];
  }) {
    const entry = this.taskRepository.create({
      ...data,
    });
    return await this.taskRepository.save(entry);
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
