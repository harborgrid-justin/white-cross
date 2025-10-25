/**
 * @fileoverview IpRestriction repository interface.
 * Auto-generated repository interface for IpRestriction data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * IpRestriction repository interface
 * Extends base repository with IpRestriction-specific operations
 */
export interface IIpRestrictionRepository extends IRepository<any, any, any> {
  // Add IpRestriction-specific methods here if needed
}

/**
 * Create IpRestriction DTO
 */
export interface CreateIpRestrictionDTO {
  [key: string]: any;
}

/**
 * Update IpRestriction DTO
 */
export interface UpdateIpRestrictionDTO {
  [key: string]: any;
}
