/**
 * @fileoverview AppointmentReminder repository interface.
 * Repository interface for AppointmentReminder data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * AppointmentReminder repository interface
 * Extends base repository with AppointmentReminder-specific operations
 */
export interface IAppointmentReminderRepository extends IRepository<any, any, any> {
  // Domain-specific methods can be added here
}

/**
 * Create AppointmentReminder DTO
 */
export interface CreateAppointmentReminderDTO {
  // Properties defined by AppointmentReminder model
  id?: string;
}

/**
 * Update AppointmentReminder DTO
 */
export interface UpdateAppointmentReminderDTO {
  // Properties defined by AppointmentReminder model  
  id?: string;
}
