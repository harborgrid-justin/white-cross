/**
 * Database Injection Tokens
 *
 * Symbol-based tokens for dependency injection to avoid string-based injection issues.
 */

export const DATABASE_CONNECTION = Symbol('DATABASE_CONNECTION');
export const REDIS_CLIENT = Symbol('REDIS_CLIENT');
export const CACHE_MANAGER = Symbol('CACHE_MANAGER');
export const LOGGER = Symbol('LOGGER');
export const AUDIT_SERVICE = Symbol('AUDIT_SERVICE');
export const NOTIFICATION_SERVICE = Symbol('NOTIFICATION_SERVICE');
