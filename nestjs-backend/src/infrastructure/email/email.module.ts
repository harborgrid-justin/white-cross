/**
 * @fileoverview Email Module - Production Configuration
 * @module infrastructure/email
 * @description NestJS module for email infrastructure services with queue, rate limiting, and templating
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { EmailService } from './email.service';
import { EmailTemplateService } from './email-template.service';
import { EmailQueueService, EMAIL_QUEUE_NAME } from './email-queue.service';
import { EmailRateLimiterService } from './email-rate-limiter.service';

@Module({
  imports: [
    ConfigModule,
    BullModule.registerQueueAsync({
      name: EMAIL_QUEUE_NAME,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
        defaultJobOptions: {
          attempts: configService.get<number>('EMAIL_QUEUE_MAX_RETRIES', 3) + 1,
          backoff: {
            type: 'exponential',
            delay: configService.get<number>('EMAIL_QUEUE_BACKOFF_DELAY', 5000),
          },
          removeOnComplete: {
            age: 86400, // 24 hours
            count: 1000,
          },
          removeOnFail: {
            age: 604800, // 7 days
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    EmailService,
    EmailTemplateService,
    EmailQueueService,
    EmailRateLimiterService,
  ],
  exports: [EmailService],
})
export class EmailModule {}
