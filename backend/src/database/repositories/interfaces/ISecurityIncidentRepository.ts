/**
 * @fileoverview SecurityIncident repository interface.
 * Auto-generated repository interface for SecurityIncident data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * SecurityIncident repository interface
 * Extends base repository with SecurityIncident-specific operations
 */
export interface ISecurityIncidentRepository extends IRepository<any, any, any> {
  // Add SecurityIncident-specific methods here if needed
}

/**
 * Create SecurityIncident DTO
 */
export interface CreateSecurityIncidentDTO {
  [key: string]: any;
}

/**
 * Update SecurityIncident DTO
 */
export interface UpdateSecurityIncidentDTO {
  [key: string]: any;
}
