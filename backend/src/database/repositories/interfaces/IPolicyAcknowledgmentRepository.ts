/**
 * @fileoverview PolicyAcknowledgment repository interface.
 * Auto-generated repository interface for PolicyAcknowledgment data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * PolicyAcknowledgment repository interface
 * Extends base repository with PolicyAcknowledgment-specific operations
 */
export interface IPolicyAcknowledgmentRepository extends IRepository<any, any, any> {
  // Add PolicyAcknowledgment-specific methods here if needed
}

/**
 * Create PolicyAcknowledgment DTO
 */
export interface CreatePolicyAcknowledgmentDTO {
  [key: string]: any;
}

/**
 * Update PolicyAcknowledgment DTO
 */
export interface UpdatePolicyAcknowledgmentDTO {
  [key: string]: any;
}
