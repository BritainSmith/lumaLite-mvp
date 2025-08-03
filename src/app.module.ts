import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from './config/logger.config';
import { TaskEntry } from './entities/taskEntry';
import { Reflection } from './entities/reflection';
import { CompanionAgentService } from './services/companionAgent.service';
import { BrainDumpService } from './services/brainDump.service';
import { TaskRepository } from './repositories/task.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    WinstonModule.forRoot(loggerConfig),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/lumalite.db',
      entities: [TaskEntry, Reflection],
      synchronize: true, // Be careful with this in production
    }),
    TypeOrmModule.forFeature([TaskEntry, Reflection]),
  ],
  providers: [CompanionAgentService, BrainDumpService, TaskRepository],
  exports: [CompanionAgentService, BrainDumpService, TaskRepository],
})
export class AppModule {} 