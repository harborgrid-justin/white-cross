/**
 * Database Optimization Services - Main Index
 * 
 * Refactored from database-optimization-utilities.service.ts (2883 lines)
 * into focused, maintainable modules
 */

// Core types and interfaces
export * from './types';

// Index management services
export * from './index-management.service';

// Query optimization services  
export * from './query-optimization.service';

// Statistics and analysis services
export * from './statistics-analysis.service';

// Vacuum and maintenance services
export * from './vacuum-maintenance.service';

// Table bloat detection services
export * from './bloat-detection.service';

// Cache optimization services
export * from './cache-optimization.service';

// Main service that combines all functionality
export { DatabaseOptimizationService } from './database-optimization.service';
