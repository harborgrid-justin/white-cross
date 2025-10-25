/**
 * @fileoverview PolicyDocument repository interface.
 * Auto-generated repository interface for PolicyDocument data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * PolicyDocument repository interface
 * Extends base repository with PolicyDocument-specific operations
 */
export interface IPolicyDocumentRepository extends IRepository<any, any, any> {
  // Add PolicyDocument-specific methods here if needed
}

/**
 * Create PolicyDocument DTO
 */
export interface CreatePolicyDocumentDTO {
  [key: string]: any;
}

/**
 * Update PolicyDocument DTO
 */
export interface UpdatePolicyDocumentDTO {
  [key: string]: any;
}
