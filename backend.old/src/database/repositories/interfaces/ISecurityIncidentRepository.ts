/**
 * @fileoverview SecurityIncident repository interface.
 * Repository interface for SecurityIncident data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * SecurityIncident repository interface
 * Extends base repository with SecurityIncident-specific operations
 */
export interface ISecurityIncidentRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create SecurityIncident DTO
 */
export interface CreateSecurityIncidentDTO {
  // Properties defined by SecurityIncident model
  id?: string;
}

/**
 * Update SecurityIncident DTO
 */
export interface UpdateSecurityIncidentDTO {
  // Properties defined by SecurityIncident model  
  id?: string;
}
