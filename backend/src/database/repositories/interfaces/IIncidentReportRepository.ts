/**
 * @fileoverview IncidentReport repository interface.
 * Repository interface for IncidentReport data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * IncidentReport repository interface
 * Extends base repository with IncidentReport-specific operations
 */
export interface IIncidentReportRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create IncidentReport DTO
 */
export interface CreateIncidentReportDTO {
  // Properties defined by IncidentReport model
  id?: string;
}

/**
 * Update IncidentReport DTO
 */
export interface UpdateIncidentReportDTO {
  // Properties defined by IncidentReport model  
  id?: string;
}
