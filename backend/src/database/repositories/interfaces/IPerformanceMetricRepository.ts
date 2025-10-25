/**
 * @fileoverview PerformanceMetric repository interface.
 * Repository interface for PerformanceMetric data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * PerformanceMetric repository interface
 * Extends base repository with PerformanceMetric-specific operations
 */
export interface IPerformanceMetricRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create PerformanceMetric DTO
 */
export interface CreatePerformanceMetricDTO {
  // Properties defined by PerformanceMetric model
  id?: string;
}

/**
 * Update PerformanceMetric DTO
 */
export interface UpdatePerformanceMetricDTO {
  // Properties defined by PerformanceMetric model  
  id?: string;
}
