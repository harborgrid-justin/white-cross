/**
 * @fileoverview IncidentReport repository interface.
 * Auto-generated repository interface for IncidentReport data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * IncidentReport repository interface
 * Extends base repository with IncidentReport-specific operations
 */
export interface IIncidentReportRepository extends IRepository<any, any, any> {
  // Add IncidentReport-specific methods here if needed
}

/**
 * Create IncidentReport DTO
 */
export interface CreateIncidentReportDTO {
  [key: string]: any;
}

/**
 * Update IncidentReport DTO
 */
export interface UpdateIncidentReportDTO {
  [key: string]: any;
}
