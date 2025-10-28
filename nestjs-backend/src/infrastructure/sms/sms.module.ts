/**
 * @fileoverview SMS Infrastructure Module
 * @module infrastructure/sms
 * @description Provides SMS service for alert notifications and general messaging
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SmsService } from './sms.service';

@Module({
  imports: [ConfigModule],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
