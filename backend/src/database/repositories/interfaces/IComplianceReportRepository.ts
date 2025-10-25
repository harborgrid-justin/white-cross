/**
 * @fileoverview ComplianceReport repository interface.
 * Repository interface for ComplianceReport data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * ComplianceReport repository interface
 * Extends base repository with ComplianceReport-specific operations
 */
export interface IComplianceReportRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create ComplianceReport DTO
 */
export interface CreateComplianceReportDTO {
  // Properties defined by ComplianceReport model
  id?: string;
}

/**
 * Update ComplianceReport DTO
 */
export interface UpdateComplianceReportDTO {
  // Properties defined by ComplianceReport model  
  id?: string;
}
