/**
 * @fileoverview Cache Module
 * @module infrastructure/cache
 * @description Global NestJS module providing comprehensive caching services
 *
 * Provides:
 * - Redis-based distributed caching
 * - Multi-tier caching (L1: memory, L2: Redis)
 * - Cache warming strategies
 * - Rate limiting
 * - Statistics and monitoring
 */

import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheService } from './cache.service';
import { CacheConfigService } from './cache.config';
import { CacheConnectionService } from './cache-connection.service';
import { CacheStorageService } from './cache-storage.service';
import { CacheSerializationService } from './cache-serialization.service';
import { CacheInvalidationService } from './cache-invalidation.service';
import { CacheOperationsService } from './cache-operations.service';
import { CacheWarmingService } from './cache-warming.service';
import { RateLimiterService } from './rate-limiter.service';
import { CacheStatisticsService } from './cache-statistics.service';

/**
 * Cache module providing distributed caching services
 * @global - Available throughout the application
 */
@Global()
@Module({
  imports: [
    ConfigModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
  ],
  providers: [
    // Core configuration
    CacheConfigService,

    // Core cache services (order matters for dependency injection)
    CacheSerializationService,
    CacheConnectionService,
    CacheStorageService,
    CacheInvalidationService,
    CacheOperationsService,

    // Main cache service (orchestrator)
    CacheService,

    // Additional services
    CacheWarmingService,
    RateLimiterService,
    CacheStatisticsService,
  ],
  exports: [
    CacheService,
    CacheWarmingService,
    RateLimiterService,
    CacheStatisticsService,
    CacheConfigService,
  ],
})
export class CacheModule {}
