/**
 * @fileoverview AppointmentWaitlist repository interface.
 * Repository interface for AppointmentWaitlist data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * AppointmentWaitlist repository interface
 * Extends base repository with AppointmentWaitlist-specific operations
 */
export interface IAppointmentWaitlistRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create AppointmentWaitlist DTO
 */
export interface CreateAppointmentWaitlistDTO {
  // Properties defined by AppointmentWaitlist model
  id?: string;
}

/**
 * Update AppointmentWaitlist DTO
 */
export interface UpdateAppointmentWaitlistDTO {
  // Properties defined by AppointmentWaitlist model  
  id?: string;
}
