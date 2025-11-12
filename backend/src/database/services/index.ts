/**
 * Barrel file for services
 * Auto-generated exports for clean public API
 */

// Consolidated Database Operations (replaces multiple duplicated services)
// Export operations modules (replaces old database-operations.service.ts)
export * from './operations';

// Export query builder modules (replaces old query-builder.service.ts)
export * from './query-builder';

// Audit Services
export * from './association-manager.service';
export * from './audit.service';
export * from './audit-helper.service';
export * from './audit-logging.service';
export * from './audit-query.service';
export * from './audit-statistics.service';
export * from './audit-compliance.service';
export * from './audit-export.service';
export * from './audit-retention.service';

// Other Services
export * from './cache-monitoring.service';
export * from './cache.service';
export * from './connection-monitor.service';
export * from './connection-pooling.service';
export * from './materialized-view.service';
export * from './model-lifecycle-hooks.service';
export * from './model-scope-patterns.service';
export * from './model-factory-generators.service';
export * from './model-association-strategies.service';
export * from './model-audit-helper.service';
export * from './query-cache.service';
export * from './query-optimization-cache.service';
export * from './query-logger.service';
export * from './transaction-coordination.service';
export * from './transaction-utility.service';
export * from './database-optimization-utilities.service';
export * from './isolation-strategies.service';
