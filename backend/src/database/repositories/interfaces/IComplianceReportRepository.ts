/**
 * @fileoverview ComplianceReport repository interface.
 * Auto-generated repository interface for ComplianceReport data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * ComplianceReport repository interface
 * Extends base repository with ComplianceReport-specific operations
 */
export interface IComplianceReportRepository extends IRepository<any, any, any> {
  // Add ComplianceReport-specific methods here if needed
}

/**
 * Create ComplianceReport DTO
 */
export interface CreateComplianceReportDTO {
  [key: string]: any;
}

/**
 * Update ComplianceReport DTO
 */
export interface UpdateComplianceReportDTO {
  [key: string]: any;
}
