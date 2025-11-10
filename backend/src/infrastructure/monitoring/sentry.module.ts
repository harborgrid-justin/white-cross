/**
 * @fileoverview Sentry Module
 * @module infrastructure/monitoring/sentry
 * @description Module for Sentry error tracking integration
 */

import { Global, Module } from '@nestjs/common';
import { SentryService } from './sentry.service';

/**
 * Sentry Module
 *
 * @description Global module providing Sentry error tracking throughout the application
 */
@Global()
@Module({
  providers: [SentryService],
  exports: [SentryService],
})
export class SentryModule {}
