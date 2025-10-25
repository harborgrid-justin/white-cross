/**
 * @fileoverview MaintenanceLog repository interface.
 * Auto-generated repository interface for MaintenanceLog data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * MaintenanceLog repository interface
 * Extends base repository with MaintenanceLog-specific operations
 */
export interface IMaintenanceLogRepository extends IRepository<any, any, any> {
  // Add MaintenanceLog-specific methods here if needed
}

/**
 * Create MaintenanceLog DTO
 */
export interface CreateMaintenanceLogDTO {
  [key: string]: any;
}

/**
 * Update MaintenanceLog DTO
 */
export interface UpdateMaintenanceLogDTO {
  [key: string]: any;
}
