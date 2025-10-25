/**
 * @fileoverview ComplianceChecklistItem repository interface.
 * Repository interface for ComplianceChecklistItem data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * ComplianceChecklistItem repository interface
 * Extends base repository with ComplianceChecklistItem-specific operations
 */
export interface IComplianceChecklistItemRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create ComplianceChecklistItem DTO
 */
export interface CreateComplianceChecklistItemDTO {
  // Properties defined by ComplianceChecklistItem model
  id?: string;
}

/**
 * Update ComplianceChecklistItem DTO
 */
export interface UpdateComplianceChecklistItemDTO {
  // Properties defined by ComplianceChecklistItem model  
  id?: string;
}
