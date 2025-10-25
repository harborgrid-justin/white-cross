/**
 * @fileoverview PolicyDocument repository interface.
 * Repository interface for PolicyDocument data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * PolicyDocument repository interface
 * Extends base repository with PolicyDocument-specific operations
 */
export interface IPolicyDocumentRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create PolicyDocument DTO
 */
export interface CreatePolicyDocumentDTO {
  // Properties defined by PolicyDocument model
  id?: string;
}

/**
 * Update PolicyDocument DTO
 */
export interface UpdatePolicyDocumentDTO {
  // Properties defined by PolicyDocument model  
  id?: string;
}
