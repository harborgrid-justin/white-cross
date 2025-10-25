/**
 * @fileoverview AppointmentReminder repository interface.
 * Auto-generated repository interface for AppointmentReminder data management.
 *
 * @module database/repositories/interfaces
 */

import { IRepository } from './IRepository';

/**
 * AppointmentReminder repository interface
 * Extends base repository with AppointmentReminder-specific operations
 */
export interface IAppointmentReminderRepository extends IRepository<any, any, any> {
  // Add AppointmentReminder-specific methods here if needed
}

/**
 * Create AppointmentReminder DTO
 */
export interface CreateAppointmentReminderDTO {
  [key: string]: any;
}

/**
 * Update AppointmentReminder DTO
 */
export interface UpdateAppointmentReminderDTO {
  [key: string]: any;
}
