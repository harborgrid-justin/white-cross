/**
 * @fileoverview AppointmentWaitlist repository interface.
 * Auto-generated repository interface for AppointmentWaitlist data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * AppointmentWaitlist repository interface
 * Extends base repository with AppointmentWaitlist-specific operations
 */
export interface IAppointmentWaitlistRepository extends IRepository<any, any, any> {
  // Add AppointmentWaitlist-specific methods here if needed
}

/**
 * Create AppointmentWaitlist DTO
 */
export interface CreateAppointmentWaitlistDTO {
  [key: string]: any;
}

/**
 * Update AppointmentWaitlist DTO
 */
export interface UpdateAppointmentWaitlistDTO {
  [key: string]: any;
}
