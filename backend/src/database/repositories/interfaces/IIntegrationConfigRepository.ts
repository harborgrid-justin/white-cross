/**
 * @fileoverview IntegrationConfig repository interface.
 * Auto-generated repository interface for IntegrationConfig data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * IntegrationConfig repository interface
 * Extends base repository with IntegrationConfig-specific operations
 */
export interface IIntegrationConfigRepository extends IRepository<any, any, any> {
  // Add IntegrationConfig-specific methods here if needed
}

/**
 * Create IntegrationConfig DTO
 */
export interface CreateIntegrationConfigDTO {
  [key: string]: any;
}

/**
 * Update IntegrationConfig DTO
 */
export interface UpdateIntegrationConfigDTO {
  [key: string]: any;
}
