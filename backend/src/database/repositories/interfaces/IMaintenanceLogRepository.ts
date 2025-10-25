/**
 * @fileoverview MaintenanceLog repository interface.
 * Repository interface for MaintenanceLog data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * MaintenanceLog repository interface
 * Extends base repository with MaintenanceLog-specific operations
 */
export interface IMaintenanceLogRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create MaintenanceLog DTO
 */
export interface CreateMaintenanceLogDTO {
  // Properties defined by MaintenanceLog model
  id?: string;
}

/**
 * Update MaintenanceLog DTO
 */
export interface UpdateMaintenanceLogDTO {
  // Properties defined by MaintenanceLog model  
  id?: string;
}
