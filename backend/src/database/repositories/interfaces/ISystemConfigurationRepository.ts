/**
 * @fileoverview SystemConfiguration repository interface.
 * Auto-generated repository interface for SystemConfiguration data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * SystemConfiguration repository interface
 * Extends base repository with SystemConfiguration-specific operations
 */
export interface ISystemConfigurationRepository extends IRepository<any, any, any> {
  // Add SystemConfiguration-specific methods here if needed
}

/**
 * Create SystemConfiguration DTO
 */
export interface CreateSystemConfigurationDTO {
  [key: string]: any;
}

/**
 * Update SystemConfiguration DTO
 */
export interface UpdateSystemConfigurationDTO {
  [key: string]: any;
}
