/**
 * LOC: 1F097AF82C
 * WC-GEN-204 | AppointmentAvailabilityService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - appointment.ts (types/appointment.ts)
 *   - index.ts (database/models/index.ts)
 *
 * DOWNSTREAM (imported by):
 *   - AppointmentService.ts (services/appointment/AppointmentService.ts)
 *   - crudOperations.ts (services/appointment/crudOperations.ts)
 *   - appointmentService.ts (services/appointmentService.ts)
 */

/**
 * WC-GEN-204 | AppointmentAvailabilityService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../types/appointment, ../../database/models | Dependencies: sequelize, ../../utils/logger, ../../types/appointment
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { AvailabilitySlot } from '../../types/appointment';
import { Appointment, Student } from '../../database/models';

export class AppointmentAvailabilityService {
  /**
   * Check nurse availability for a given time slot
   */
  static async checkAvailability(
    nurseId: string,
    startTime: Date,
    duration: number,
    excludeAppointmentId?: string
  ) {
    try {
      const endTime = new Date(startTime.getTime() + duration * 60000);

      const whereClause: any = {
        nurseId,
        status: { [Op.in]: ['SCHEDULED', 'IN_PROGRESS'] },
        scheduledAt: {
          [Op.and]: [
            { [Op.lt]: endTime },
            { [Op.gte]: new Date(startTime.getTime() - 30 * 60000) }
          ]
        }
      };

      if (excludeAppointmentId) {
        whereClause.id = { [Op.ne]: excludeAppointmentId };
      }

      const conflicts = await Appointment.findAll({
        where: whereClause,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName']
          }
        ]
      });

      return conflicts;
    } catch (error) {
      logger.error('Error checking availability:', error);
      throw error;
    }
  }

  /**
   * Get available time slots for a nurse on a given date
   */
  static async getAvailableSlots(
    nurseId: string,
    date: Date,
    slotDuration: number = 30
  ): Promise<AvailabilitySlot[]> {
    try {
      const startHour = 8;
      const endHour = 17;

      const startDate = new Date(date);
      startDate.setHours(startHour, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setHours(endHour, 0, 0, 0);

      const appointments = await Appointment.findAll({
        where: {
          nurseId,
          scheduledAt: { [Op.gte]: startDate, [Op.lt]: endDate },
          status: { [Op.in]: ['SCHEDULED', 'IN_PROGRESS'] }
        },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName']
          }
        ],
        order: [['scheduledAt', 'ASC']]
      });

      const slots: AvailabilitySlot[] = [];
      let currentTime = new Date(startDate);

      while (currentTime < endDate) {
        const slotEnd = new Date(currentTime.getTime() + slotDuration * 60000);

        const conflict = appointments.find((appointment) => {
          const appointmentEnd = new Date(appointment.scheduledAt.getTime() + appointment.duration * 60000);
          return currentTime < appointmentEnd && slotEnd > appointment.scheduledAt;
        });

        slots.push({
          start: new Date(currentTime),
          end: new Date(slotEnd),
          available: !conflict,
          conflictingAppointment: conflict
            ? {
                id: conflict.id,
                student: `${conflict.student.firstName} ${conflict.student.lastName}`,
                reason: conflict.reason
              }
            : undefined
        });

        currentTime = new Date(currentTime.getTime() + slotDuration * 60000);
      }

      return slots;
    } catch (error) {
      logger.error('Error getting available slots:', error);
      throw error;
    }
  }
}
