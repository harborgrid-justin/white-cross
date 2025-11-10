/**
 * @fileoverview Service Interface Tokens
 * @module shared/tokens/service.tokens
 * @description Injection tokens for interface-based dependency injection
 *
 * This module provides injection tokens for core services to improve:
 * - Testability (easy mocking with interfaces)
 * - Flexibility (swap implementations)
 * - Decoupling (depend on abstractions, not concrete classes)
 */

/**
 * Logger Service Token
 * Use this token to inject a logger implementation
 *
 * Example:
 * ```typescript
 * constructor(
 *   @Inject(LOGGER_SERVICE) private readonly logger: ILoggerService
 * ) {}
 * ```
 */
export const LOGGER_SERVICE = Symbol('LOGGER_SERVICE');

/**
 * Cache Service Token
 * Use this token to inject a cache implementation
 *
 * Example:
 * ```typescript
 * constructor(
 *   @Inject(CACHE_SERVICE) private readonly cache: ICacheService
 * ) {}
 * ```
 */
export const CACHE_SERVICE = Symbol('CACHE_SERVICE');

/**
 * Config Service Token
 * Use this token to inject a configuration service
 *
 * Example:
 * ```typescript
 * constructor(
 *   @Inject(CONFIG_SERVICE) private readonly config: IConfigService
 * ) {}
 * ```
 */
export const CONFIG_SERVICE = Symbol('CONFIG_SERVICE');

/**
 * Event Emitter Token
 * Use this token to inject an event emitter
 *
 * Example:
 * ```typescript
 * constructor(
 *   @Inject(EVENT_EMITTER) private readonly events: IEventEmitter
 * ) {}
 * ```
 */
export const EVENT_EMITTER = Symbol('EVENT_EMITTER');

/**
 * Database Connection Token
 * Use this token to inject a database connection
 *
 * Example:
 * ```typescript
 * constructor(
 *   @Inject(DATABASE_CONNECTION) private readonly db: IDatabaseConnection
 * ) {}
 * ```
 */
export const DATABASE_CONNECTION = Symbol('DATABASE_CONNECTION');

/**
 * Audit Service Token
 * Use this token to inject an audit logging service
 *
 * Example:
 * ```typescript
 * constructor(
 *   @Inject(AUDIT_SERVICE) private readonly audit: IAuditService
 * ) {}
 * ```
 */
export const AUDIT_SERVICE = Symbol('AUDIT_SERVICE');

/**
 * Encryption Service Token
 * Use this token to inject an encryption service
 *
 * Example:
 * ```typescript
 * constructor(
 *   @Inject(ENCRYPTION_SERVICE) private readonly encryption: IEncryptionService
 * ) {}
 * ```
 */
export const ENCRYPTION_SERVICE = Symbol('ENCRYPTION_SERVICE');

/**
 * Notification Service Token
 * Use this token to inject a notification service
 *
 * Example:
 * ```typescript
 * constructor(
 *   @Inject(NOTIFICATION_SERVICE) private readonly notifications: INotificationService
 * ) {}
 * ```
 */
export const NOTIFICATION_SERVICE = Symbol('NOTIFICATION_SERVICE');
