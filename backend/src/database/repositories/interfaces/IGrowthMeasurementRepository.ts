/**
 * @fileoverview GrowthMeasurement repository interface.
 * Repository interface for GrowthMeasurement data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * GrowthMeasurement repository interface
 * Extends base repository with GrowthMeasurement-specific operations
 */
export interface IGrowthMeasurementRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create GrowthMeasurement DTO
 */
export interface CreateGrowthMeasurementDTO {
  // Properties defined by GrowthMeasurement model
  id?: string;
}

/**
 * Update GrowthMeasurement DTO
 */
export interface UpdateGrowthMeasurementDTO {
  // Properties defined by GrowthMeasurement model  
  id?: string;
}
