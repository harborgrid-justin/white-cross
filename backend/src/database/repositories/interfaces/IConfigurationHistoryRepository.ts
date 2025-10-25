/**
 * @fileoverview ConfigurationHistory repository interface.
 * Auto-generated repository interface for ConfigurationHistory data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * ConfigurationHistory repository interface
 * Extends base repository with ConfigurationHistory-specific operations
 */
export interface IConfigurationHistoryRepository extends IRepository<any, any, any> {
  // Add ConfigurationHistory-specific methods here if needed
}

/**
 * Create ConfigurationHistory DTO
 */
export interface CreateConfigurationHistoryDTO {
  [key: string]: any;
}

/**
 * Update ConfigurationHistory DTO
 */
export interface UpdateConfigurationHistoryDTO {
  [key: string]: any;
}
