/**
 * LOC: C7FDC9BE2F
 * WC-GEN-206 | AppointmentRecurringService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - appointment.ts (types/appointment.ts)
 *   - crudOperations.ts (services/appointment/crudOperations.ts)
 *
 * DOWNSTREAM (imported by):
 *   - appointmentService.ts (services/appointmentService.ts)
 */

/**
 * WC-GEN-206 | AppointmentRecurringService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../types/appointment, ./crudOperations | Dependencies: ../../utils/logger, ../../types/appointment, ./crudOperations
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-23 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture, circular dependency fixed
 */

import { logger } from '../../utils/logger';
import { CreateAppointmentData, RecurrencePattern } from '../../types/appointment';
import { AppointmentCrudOperations } from './crudOperations';

export class AppointmentRecurringService {
  /**
   * Create recurring appointments
   */
  static async createRecurringAppointments(
    baseData: CreateAppointmentData,
    recurrencePattern: RecurrencePattern
  ) {
    try {
      const appointments = [];
      const currentDate = new Date(baseData.scheduledAt);

      while (currentDate <= recurrencePattern.endDate) {
        let shouldCreate = true;

        if (recurrencePattern.frequency === 'weekly' && recurrencePattern.daysOfWeek) {
          shouldCreate = recurrencePattern.daysOfWeek.includes(currentDate.getDay());
        }

        if (shouldCreate) {
          try {
            const appointment = await AppointmentCrudOperations.createAppointment({
              ...baseData,
              scheduledAt: new Date(currentDate)
            });
            appointments.push(appointment);
          } catch (error) {
            logger.warn(`Failed to create recurring appointment for ${currentDate}: ${(error as Error).message}`);
          }
        }

        switch (recurrencePattern.frequency) {
          case 'daily':
            currentDate.setDate(currentDate.getDate() + recurrencePattern.interval);
            break;
          case 'weekly':
            currentDate.setDate(currentDate.getDate() + 7 * recurrencePattern.interval);
            break;
          case 'monthly':
            currentDate.setMonth(currentDate.getMonth() + recurrencePattern.interval);
            break;
        }
      }

      logger.info(`Created ${appointments.length} recurring appointments`);
      return appointments;
    } catch (error) {
      logger.error('Error creating recurring appointments:', error);
      throw error;
    }
  }
}
