/**
 * @fileoverview GrowthMeasurement repository interface.
 * Auto-generated repository interface for GrowthMeasurement data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * GrowthMeasurement repository interface
 * Extends base repository with GrowthMeasurement-specific operations
 */
export interface IGrowthMeasurementRepository extends IRepository<any, any, any> {
  // Add GrowthMeasurement-specific methods here if needed
}

/**
 * Create GrowthMeasurement DTO
 */
export interface CreateGrowthMeasurementDTO {
  [key: string]: any;
}

/**
 * Update GrowthMeasurement DTO
 */
export interface UpdateGrowthMeasurementDTO {
  [key: string]: any;
}
