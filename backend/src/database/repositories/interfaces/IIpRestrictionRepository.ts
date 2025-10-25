/**
 * @fileoverview IpRestriction repository interface.
 * Repository interface for IpRestriction data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * IpRestriction repository interface
 * Extends base repository with IpRestriction-specific operations
 */
export interface IIpRestrictionRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create IpRestriction DTO
 */
export interface CreateIpRestrictionDTO {
  // Properties defined by IpRestriction model
  id?: string;
}

/**
 * Update IpRestriction DTO
 */
export interface UpdateIpRestrictionDTO {
  // Properties defined by IpRestriction model  
  id?: string;
}
