/**
 * Jobs Module
 *
 * NestJS module for background job processing with BullMQ
 * Migrated from backend/src/infrastructure/jobs
 *
 * Features:
 * - Queue management with Redis backend
 * - Multiple job processors (medication reminders, inventory maintenance, etc.)
 * - Job scheduling with cron patterns
 * - Job monitoring and statistics
 */
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JobType } from './enums/job-type.enum';
import { QueueManagerService } from './services/queue-manager.service';
import { MedicationReminderProcessor, InventoryMaintenanceProcessor } from './processors';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    EmailModule,
    // Import BullModule with Redis configuration
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD'),
          maxRetriesPerRequest: null
        },
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000
          },
          removeOnComplete: {
            count: 100,
            age: 24 * 3600 // 24 hours in seconds
          },
          removeOnFail: {
            count: 1000,
            age: 7 * 24 * 3600 // 7 days in seconds
          }
        }
      }),
      inject: [ConfigService]
    }),
    // Register all queue types
    BullModule.registerQueue(
      { name: JobType.MEDICATION_REMINDER },
      { name: JobType.IMMUNIZATION_ALERT },
      { name: JobType.APPOINTMENT_REMINDER },
      { name: JobType.INVENTORY_MAINTENANCE },
      { name: JobType.REPORT_GENERATION },
      { name: JobType.DATA_EXPORT },
      { name: JobType.NOTIFICATION_BATCH },
      { name: JobType.CLEANUP_TASK }
    )
  ],
  providers: [
    QueueManagerService,
    MedicationReminderProcessor,
    InventoryMaintenanceProcessor
  ],
  exports: [QueueManagerService, BullModule]
})
export class JobsModule {}
