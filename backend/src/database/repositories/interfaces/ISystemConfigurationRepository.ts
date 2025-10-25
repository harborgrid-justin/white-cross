/**
 * @fileoverview SystemConfiguration repository interface.
 * Repository interface for SystemConfiguration data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * SystemConfiguration repository interface
 * Extends base repository with SystemConfiguration-specific operations
 */
export interface ISystemConfigurationRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create SystemConfiguration DTO
 */
export interface CreateSystemConfigurationDTO {
  // Properties defined by SystemConfiguration model
  id?: string;
}

/**
 * Update SystemConfiguration DTO
 */
export interface UpdateSystemConfigurationDTO {
  // Properties defined by SystemConfiguration model  
  id?: string;
}
