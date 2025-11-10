/**
 * LOC: SHARED-INDEX-001
 * File: /reuse/server/health/composites/shared/index.ts
 * Purpose: Centralized exports for shared security and performance infrastructure
 */

// Guards
export * from './guards/jwt-auth.guard';
export * from './guards/rbac.guard';
export * from './guards/phi-access.guard';

// Services
export * from './services/audit-logging.service';
export * from './services/encryption.service';

// Decorators
export * from './decorators/auth.decorators';
export * from './decorators/audit-log.decorator';

// Interceptors
export * from './interceptors/audit-logging.interceptor';

// Pipes
export * from './pipes/validation.pipe';

// DTOs
export * from './dto/common.dto';
export * from './dto/medication.dto';
export * from './dto/clinical.dto';

// Performance Infrastructure
export * from './cache/redis-cache.service';
export * from './cache/cache.decorator';
export * from './utils/rate-limiter.util';
export * from './utils/pagination.util';
export * from './utils/performance-monitor.decorator';
export * from './config/database-pool.config';
