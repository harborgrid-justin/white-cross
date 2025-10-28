import { Module, Global } from '@nestjs/common';
import { LoggingModule } from './logging/logging.module';
import { CacheModule } from './cache/cache.module';
import { LoggerService } from './logging/logger.service';
import { CacheService } from './cache/cache.service';
import { AuthenticationService } from './security/authentication.service';

/**
 * @fileoverview Shared Module - Centralized Utilities and Services
 * @module shared
 * @description Global NestJS module providing shared utilities and services across the application
 *
 * Provides:
 * - LoggerService: Centralized logging with Winston
 * - CacheService: High-performance in-memory caching with LRU eviction
 * - AuthenticationService: JWT authentication and user validation
 * - Utility functions: Array, object, string, date, password, validation utilities
 * - Security utilities: Validation, permissions, rate limiting, SQL sanitization
 * - Type utilities: Type guards and validation
 * - Domain utilities: Healthcare, communication, file handling, time, monitoring
 *
 * @global
 */
@Global()
@Module({
  imports: [LoggingModule, CacheModule],
  providers: [LoggerService, CacheService, AuthenticationService],
  exports: [
    LoggingModule,
    CacheModule,
    LoggerService,
    CacheService,
    AuthenticationService,
  ],
})
export class SharedModule {}

export default SharedModule;
