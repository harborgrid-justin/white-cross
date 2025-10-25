/**
 * @fileoverview IntegrationLog repository interface.
 * Repository interface for IntegrationLog data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * IntegrationLog repository interface
 * Extends base repository with IntegrationLog-specific operations
 */
export interface IIntegrationLogRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create IntegrationLog DTO
 */
export interface CreateIntegrationLogDTO {
  // Properties defined by IntegrationLog model
  id?: string;
}

/**
 * Update IntegrationLog DTO
 */
export interface UpdateIntegrationLogDTO {
  // Properties defined by IntegrationLog model  
  id?: string;
}
