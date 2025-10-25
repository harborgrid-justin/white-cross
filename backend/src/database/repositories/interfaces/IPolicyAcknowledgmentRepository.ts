/**
 * @fileoverview PolicyAcknowledgment repository interface.
 * Repository interface for PolicyAcknowledgment data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * PolicyAcknowledgment repository interface
 * Extends base repository with PolicyAcknowledgment-specific operations
 */
export interface IPolicyAcknowledgmentRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create PolicyAcknowledgment DTO
 */
export interface CreatePolicyAcknowledgmentDTO {
  // Properties defined by PolicyAcknowledgment model
  id?: string;
}

/**
 * Update PolicyAcknowledgment DTO
 */
export interface UpdatePolicyAcknowledgmentDTO {
  // Properties defined by PolicyAcknowledgment model  
  id?: string;
}
