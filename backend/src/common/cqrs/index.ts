/**
 * CQRS Infrastructure for White Cross Healthcare Platform
 *
 * This module provides Command Query Responsibility Segregation (CQRS) pattern implementation
 * with separate command and query buses, healthcare-specific commands and queries,
 * and comprehensive error handling and performance monitoring.
 */

export * from './interfaces';
export * from './command-bus';
export * from './query-bus';
export * from './cqrs.module';
export * from './healthcare/commands';
export * from './healthcare/queries';
