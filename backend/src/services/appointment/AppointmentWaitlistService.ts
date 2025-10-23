/**
 * LOC: E2238E82B9
 * WC-GEN-210 | AppointmentWaitlistService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - index.ts (database/models/index.ts)
 *   - appointment.ts (types/appointment.ts)
 *   - enums.ts (database/types/enums.ts)
 *   - crudOperations.ts (dynamic import only to avoid circular dependency)
 *
 * DOWNSTREAM (imported by):
 *   - AppointmentService.ts (services/appointment/AppointmentService.ts)
 *   - crudOperations.ts (services/appointment/crudOperations.ts - dynamic only)
 *   - appointmentService.ts (services/appointmentService.ts)
 */

/**
 * WC-GEN-210 | AppointmentWaitlistService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ../../types/appointment | Dependencies: sequelize, ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-23 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture, uses dynamic import for crudOperations to avoid circular dependency
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { AppointmentWaitlist, Student, User, EmergencyContact } from '../../database/models';
import { WaitlistEntry } from '../../types/appointment';
import { AppointmentType, WaitlistPriority, WaitlistStatus } from '../../database/types/enums';

// Type augmentations for associations
declare module '../../database/models/healthcare/AppointmentWaitlist' {
  interface AppointmentWaitlist {
    student?: Student & {
      emergencyContacts?: EmergencyContact[];
    };
    nurse?: User;
  }
}

export class AppointmentWaitlistService {
  /**
   * Add to waitlist
   */
  static async addToWaitlist(data: WaitlistEntry) {
    try {
      const student = await Student.findByPk(data.studentId);
      if (!student) throw new Error('Student not found');

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const waitlistEntry = await AppointmentWaitlist.create({
        studentId: data.studentId,
        nurseId: data.nurseId,
        type: data.type as any,
        preferredDate: data.preferredDate,
        duration: data.duration || 30,
        priority: (data.priority || WaitlistPriority.NORMAL) as any,
        reason: data.reason,
        notes: data.notes,
        expiresAt
      });

      // Reload with associations
      await waitlistEntry.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName']
          }
        ]
      });

      logger.info(`Added ${student.firstName} ${student.lastName} to waitlist for ${data.type}`);
      return waitlistEntry;
    } catch (error) {
      logger.error('Error adding to waitlist:', error);
      throw error;
    }
  }

  /**
   * Get waitlist entries
   */
  static async getWaitlist(filters?: { nurseId?: string; status?: string; priority?: string }) {
    try {
      const whereClause: any = {};

      if (filters?.nurseId) whereClause.nurseId = filters.nurseId;
      if (filters?.status) whereClause.status = filters.status;
      if (filters?.priority) whereClause.priority = filters.priority;

      const waitlist = await AppointmentWaitlist.findAll({
        where: whereClause,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          },
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
        order: [
          ['priority', 'DESC'],
          ['createdAt', 'ASC']
        ]
      });

      return waitlist;
    } catch (error) {
      logger.error('Error fetching waitlist:', error);
      throw error;
    }
  }

  /**
   * Remove from waitlist
   */
  static async removeFromWaitlist(id: string, reason?: string) {
    try {
      const entry = await AppointmentWaitlist.findByPk(id);

      if (!entry) {
        throw new Error('Waitlist entry not found');
      }

      await entry.update({
        status: WaitlistStatus.CANCELLED,
        notes: reason ? `Cancelled: ${reason}` : entry.notes
      });

      logger.info(`Removed entry ${id} from waitlist`);
      return entry;
    } catch (error) {
      logger.error('Error removing from waitlist:', error);
      throw error;
    }
  }

  /**
   * Automatically fill slots from waitlist when appointment is cancelled
   */
  static async fillSlotFromWaitlist(cancelledAppointment: {
    scheduledAt: Date;
    duration: number;
    nurseId: string;
    type: string;
  }) {
    try {
      const waitlistEntries = await AppointmentWaitlist.findAll({
        where: {
          status: WaitlistStatus.WAITING,
          type: cancelledAppointment.type as AppointmentType,
          [Op.or]: [
            { nurseId: cancelledAppointment.nurseId },
            { nurseId: null }
          ]
        },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber'],
            include: [
              {
                model: EmergencyContact,
                as: 'emergencyContacts',
                where: { isActive: true },
                required: false,
                limit: 1,
                order: [['priority', 'ASC']]
              }
            ]
          }
        ],
        order: [
          ['priority', 'DESC'],
          ['createdAt', 'ASC']
        ],
        limit: 5
      });

      for (const entry of waitlistEntries) {
        try {
          // Use dynamic import to avoid circular dependency with crudOperations
          const { AppointmentCrudOperations } = await import('./crudOperations');
          const appointment = await AppointmentCrudOperations.createAppointment({
            studentId: entry.studentId,
            nurseId: cancelledAppointment.nurseId,
            type: entry.type,
            scheduledAt: cancelledAppointment.scheduledAt,
            duration: entry.duration,
            reason: entry.reason,
            notes: `Auto-scheduled from waitlist: ${entry.notes || ''}`
          });

          await entry.update({
            status: WaitlistStatus.SCHEDULED,
            notifiedAt: new Date()
          });

          logger.info(`Auto-filled slot for ${entry.student!.firstName} ${entry.student!.lastName} from waitlist`);

          if (entry.student!.emergencyContacts && entry.student!.emergencyContacts.length > 0) {
            const contact = entry.student!.emergencyContacts[0];
            logger.info(`Would notify ${contact.firstName} ${contact.lastName} at ${contact.phoneNumber}`);
          }

          return appointment;
        } catch (error) {
          logger.warn(`Could not schedule waitlist entry ${entry.id}: ${(error as Error).message}`);
          continue;
        }
      }

      logger.info('No suitable waitlist entries found for the cancelled slot');
      return null;
    } catch (error) {
      logger.error('Error filling slot from waitlist:', error);
      throw error;
    }
  }
}
