/**
 * @fileoverview ComplianceChecklistItem repository interface.
 * Auto-generated repository interface for ComplianceChecklistItem data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * ComplianceChecklistItem repository interface
 * Extends base repository with ComplianceChecklistItem-specific operations
 */
export interface IComplianceChecklistItemRepository extends IRepository<any, any, any> {
  // Add ComplianceChecklistItem-specific methods here if needed
}

/**
 * Create ComplianceChecklistItem DTO
 */
export interface CreateComplianceChecklistItemDTO {
  [key: string]: any;
}

/**
 * Update ComplianceChecklistItem DTO
 */
export interface UpdateComplianceChecklistItemDTO {
  [key: string]: any;
}
