import { Module, Global } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggingModule } from './logging/logging.module';
import { CacheModule } from './cache/cache.module';
import { LoggerService } from './logging/logger.service';
import { CacheService } from './cache/cache.service';
import { AuthenticationService } from './security/authentication.service';
import { RequestContextService } from './context/request-context.service';

/**
 * @fileoverview Shared Module - Centralized Utilities and Services
 * @module shared
 * @description Global NestJS module providing shared utilities and services across the application
 *
 * Provides:
 * - RequestContextService: Request-scoped user context tracking
 * - LoggerService: Centralized logging with Winston
 * - CacheService: High-performance in-memory caching with LRU eviction
 * - AuthenticationService: JWT authentication and user validation
 * - BaseService: Abstract base class for all services
 * - Interface tokens: For dependency injection and testing
 * - EventEmitter: For event-driven architecture
 * - Utility functions: Array, object, string, date, password, validation utilities
 * - Security utilities: Validation, permissions, rate limiting, SQL sanitization
 * - Type utilities: Type guards and validation
 * - Domain utilities: Healthcare, communication, file handling, time, monitoring
 *
 * Architecture:
 * - Global scope for universal access
 * - Request-scoped services auto-injected
 * - Event-driven patterns for loose coupling
 * - Interface-based DI for testability
 *
 * @global
 */
@Global()
@Module({
  imports: [
    LoggingModule,
    CacheModule,
    // Global event emitter for event-driven architecture
    EventEmitterModule.forRoot({
      global: true,
      maxListeners: 20,
      wildcard: false,
      delimiter: '.',
    }),
  ],
  providers: [
    LoggerService,
    CacheService,
    AuthenticationService,
    RequestContextService,
  ],
  exports: [
    LoggingModule,
    CacheModule,
    LoggerService,
    CacheService,
    AuthenticationService,
    RequestContextService,
  ],
})
export class SharedModule {}

export default SharedModule;
