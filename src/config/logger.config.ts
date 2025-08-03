import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export const loggerConfig = {
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike('LumaLite', {
          prettyPrint: true,
          colors: true,
        }),
      ),
    }),

    // Error log file with rotation
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      maxSize: '20m',
      maxFiles: '14d',
    }),

    // Combined log file with rotation
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      maxSize: '20m',
      maxFiles: '14d',
    }),

    // AI interactions log file
    new DailyRotateFile({
      filename: 'logs/ai-interactions-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ],
  level: process.env.LOG_LEVEL || 'info',
}; 