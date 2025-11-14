/**
 * @fileoverview SMS Infrastructure Module
 * @module infrastructure/sms
 * @description Provides production-ready SMS service with Twilio integration,
 * queuing, rate limiting, cost tracking, and template support
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { SmsService } from './sms.service';
import { TwilioProvider } from './providers/twilio.provider';
import { PhoneValidatorService } from './services/phone-validator.service';
import { SmsTemplateService } from './services/sms-template.service';
import { RateLimiterService } from './services/rate-limiter.service';
import { CostTrackerService } from './services/cost-tracker.service';
import { SmsSenderService } from './services/sms-sender.service';
import { SMS_QUEUE_NAME, SmsQueueProcessor } from './processors/sms-queue.processor';

@Module({
  imports: [
    ConfigModule,
    // Register SMS queue with BullMQ
    BullModule.registerQueue({
      name: SMS_QUEUE_NAME,
    }),
  ],
  providers: [
    // Main SMS Service
    SmsService,

    // SMS Provider (Twilio)
    TwilioProvider,

    // Supporting Services
    PhoneValidatorService,
    SmsTemplateService,
    RateLimiterService,
    CostTrackerService,
    SmsSenderService,

    // Queue Processor
    SmsQueueProcessor,
  ],
  exports: [
    // Export main service for use in other modules
    SmsService,

    // Export supporting services for direct access if needed
    PhoneValidatorService,
    SmsTemplateService,
    RateLimiterService,
    CostTrackerService,
  ],
})
export class SmsModule {}
