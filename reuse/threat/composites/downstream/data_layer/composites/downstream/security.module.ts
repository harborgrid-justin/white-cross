/**
 * LOC: SECMOD001
 * File: security.module.ts
 * Purpose: Comprehensive Security Module for White Cross Healthcare Platform
 *
 * PRODUCTION-READY SECURITY IMPLEMENTATION
 * Integrates all security components: authentication, authorization, rate limiting,
 * audit logging, HIPAA compliance, and security headers.
 */

import { Module, Global } from '@nestjs/common';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Guards
import { JWTAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { RateLimitGuard } from './guards/rate-limit.guard';

// Filters
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { HIPAAComplianceFilter } from './filters/hipaa-compliance.filter';

// Services
import { RedisRateLimiterService } from './rate-limiting/redis-rate-limiter.service';
import { AuditTrailService } from './audit-trail-services';
import { ConnectionPoolManager } from './services/connection-pool-manager.service';
import { EnhancedCacheManagerService } from './cache-managers';

/**
 * Security Module
 *
 * Provides production-grade security infrastructure:
 * - JWT authentication with token validation
 * - Role-based and permission-based authorization
 * - Redis-backed distributed rate limiting
 * - HIPAA-compliant audit logging with HMAC integrity
 * - Global exception handling
 * - Connection pool management
 * - Multi-tier caching
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [
 *     ConfigModule.forRoot({ isGlobal: true }),
 *     SecurityModule,
 *     // ... other modules
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET') || 'CHANGE_IN_PRODUCTION',
        signOptions: {
          expiresIn: config.get('JWT_EXPIRATION') || '15m',
          issuer: config.get('JWT_ISSUER') || 'white-cross-healthcare',
          audience: config.get('JWT_AUDIENCE') || 'white-cross-api',
          algorithm: 'HS256',
        },
      }),
    }),
  ],
  providers: [
    // Security Services
    RedisRateLimiterService,
    AuditTrailService,
    ConnectionPoolManager,
    EnhancedCacheManagerService,

    // Global Guards (applied in order)
    {
      provide: APP_GUARD,
      useClass: JWTAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },

    // Global Filters (exception handling)
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HIPAAComplianceFilter,
    },
  ],
  exports: [
    JwtModule,
    RedisRateLimiterService,
    AuditTrailService,
    ConnectionPoolManager,
    EnhancedCacheManagerService,
  ],
})
export class SecurityModule {}

export { SecurityModule };
