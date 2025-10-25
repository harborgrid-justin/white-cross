/**
 * @fileoverview IntegrationConfig repository interface.
 * Repository interface for IntegrationConfig data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * IntegrationConfig repository interface
 * Extends base repository with IntegrationConfig-specific operations
 */
export interface IIntegrationConfigRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create IntegrationConfig DTO
 */
export interface CreateIntegrationConfigDTO {
  // Properties defined by IntegrationConfig model
  id?: string;
}

/**
 * Update IntegrationConfig DTO
 */
export interface UpdateIntegrationConfigDTO {
  // Properties defined by IntegrationConfig model  
  id?: string;
}
