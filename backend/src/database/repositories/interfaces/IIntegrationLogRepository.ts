/**
 * @fileoverview IntegrationLog repository interface.
 * Auto-generated repository interface for IntegrationLog data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * IntegrationLog repository interface
 * Extends base repository with IntegrationLog-specific operations
 */
export interface IIntegrationLogRepository extends IRepository<any, any, any> {
  // Add IntegrationLog-specific methods here if needed
}

/**
 * Create IntegrationLog DTO
 */
export interface CreateIntegrationLogDTO {
  [key: string]: any;
}

/**
 * Update IntegrationLog DTO
 */
export interface UpdateIntegrationLogDTO {
  [key: string]: any;
}
