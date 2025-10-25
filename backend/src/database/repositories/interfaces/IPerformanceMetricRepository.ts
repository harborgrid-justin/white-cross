/**
 * @fileoverview PerformanceMetric repository interface.
 * Auto-generated repository interface for PerformanceMetric data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * PerformanceMetric repository interface
 * Extends base repository with PerformanceMetric-specific operations
 */
export interface IPerformanceMetricRepository extends IRepository<any, any, any> {
  // Add PerformanceMetric-specific methods here if needed
}

/**
 * Create PerformanceMetric DTO
 */
export interface CreatePerformanceMetricDTO {
  [key: string]: any;
}

/**
 * Update PerformanceMetric DTO
 */
export interface UpdatePerformanceMetricDTO {
  [key: string]: any;
}
