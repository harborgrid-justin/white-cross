/**
 * @fileoverview ConfigurationHistory repository interface.
 * Repository interface for ConfigurationHistory data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * ConfigurationHistory repository interface
 * Extends base repository with ConfigurationHistory-specific operations
 */
export interface IConfigurationHistoryRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create ConfigurationHistory DTO
 */
export interface CreateConfigurationHistoryDTO {
  // Properties defined by ConfigurationHistory model
  id?: string;
}

/**
 * Update ConfigurationHistory DTO
 */
export interface UpdateConfigurationHistoryDTO {
  // Properties defined by ConfigurationHistory model  
  id?: string;
}
