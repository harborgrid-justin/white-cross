/**
 * @fileoverview Email Module
 * @module infrastructure/email
 * @description NestJS module for email infrastructure services
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';

@Module({
  imports: [ConfigModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
