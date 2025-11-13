/**
 * @fileoverview Logging Module
 * @module shared/logging
 * @description NestJS module for centralized logging functionality
 */

import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';

/**
 * @class LoggingModule
 * @description Global module providing logging services across the application
 * @global
 */
@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggingModule {}

export default LoggingModule;
