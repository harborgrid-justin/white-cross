/**
 * LOC: 454766BAB0
 * WC-GEN-211 | crudOperations.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - index.ts (database/models/index.ts)
 *   - enums.ts (database/types/enums.ts)
 *   - validation.ts (services/appointment/validation.ts)
 *   - statusTransitions.ts (services/appointment/statusTransitions.ts)
 *   - ... and 3 more
 *
 * DOWNSTREAM (imported by):
 *   - appointmentService.ts (services/appointmentService.ts)
 */

/**
 * WC-GEN-211 | crudOperations.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models, ../../database/types/enums | Dependencies: sequelize, ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { Appointment, Student, User } from '../../database/models';
import { AppointmentStatus, AppointmentType } from '../../database/types/enums';
import {
  CreateAppointmentData,
  UpdateAppointmentData,
  AppointmentFilters
} from '../../types/appointment';
import { AppointmentValidation } from './validation';
import { AppointmentStatusTransitions } from './statusTransitions';
import { AppointmentAvailabilityService } from './AppointmentAvailabilityService';
import { AppointmentReminderService } from './AppointmentReminderService';
import { AppointmentWaitlistService } from './AppointmentWaitlistService';

/**
 * Enterprise-grade CRUD operations module for appointments
 * Handles create, read, update operations with comprehensive validation
 */
export class AppointmentCrudOperations {
  /**
   * Get appointments with pagination and filters
   * Implements efficient querying with Sequelize ORM
   */
  static async getAppointments(
    page: number = 1,
    limit: number = 20,
    filters: AppointmentFilters = {}
  ) {
    try {
      const offset = (page - 1) * limit;

      const whereClause: any = {};

      if (filters.nurseId) {
        whereClause.nurseId = filters.nurseId;
      }

      if (filters.studentId) {
        whereClause.studentId = filters.studentId;
      }

      if (filters.status) {
        whereClause.status = filters.status;
      }

      if (filters.type) {
        whereClause.type = filters.type;
      }

      if (filters.dateFrom || filters.dateTo) {
        whereClause.scheduledAt = {};
        if (filters.dateFrom) {
          whereClause.scheduledAt[Op.gte] = filters.dateFrom;
        }
        if (filters.dateTo) {
          whereClause.scheduledAt[Op.lte] = filters.dateTo;
        }
      }

      const { rows: appointments, count: total } = await Appointment.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          },
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ],
        order: [['scheduledAt', 'ASC']],
        distinct: true
      });

      return {
        appointments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching appointments:', error);
      throw new Error('Failed to fetch appointments');
    }
  }

  /**
   * Get a single appointment by ID
   */
  static async getAppointmentById(id: string) {
    try {
      const appointment = await Appointment.findByPk(id, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          },
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      return appointment;
    } catch (error) {
      logger.error(`Error fetching appointment ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create new appointment with comprehensive validation
   */
  static async createAppointment(data: CreateAppointmentData) {
    try {
      // Set default duration
      const duration = data.duration || AppointmentValidation.getDefaultDuration();

      // Comprehensive validation
      await AppointmentValidation.validateAppointmentData({ ...data, duration }, false);

      // Verify student exists
      const student = await Student.findByPk(data.studentId);
      if (!student) {
        throw new Error('Student not found');
      }

      // Verify nurse exists
      const nurse = await User.findByPk(data.nurseId);
      if (!nurse) {
        throw new Error('Nurse not found');
      }

      // Check for scheduling conflicts with buffer time
      const conflicts = await AppointmentAvailabilityService.checkAvailability(
        data.nurseId,
        data.scheduledAt,
        duration
      );

      if (conflicts.length > 0) {
        const conflictDetails = conflicts.map(c =>
          `${(c as any).student?.firstName} ${(c as any).student?.lastName} at ${c.scheduledAt.toLocaleTimeString()}`
        ).join(', ');
        throw new Error(
          `Nurse is not available at the requested time. Conflicts with: ${conflictDetails}`
        );
      }

      const appointment = await Appointment.create({
        ...data,
        duration,
        status: AppointmentStatus.SCHEDULED,
        type: data.type as any
      });

      // Reload with associations
      await appointment.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          },
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      logger.info(`Appointment created: ${appointment.type} for ${student.firstName} ${student.lastName} with ${nurse.firstName} ${nurse.lastName} at ${appointment.scheduledAt}`);

      // Schedule automatic reminders
      await AppointmentReminderService.scheduleReminders(appointment.id);

      return appointment;
    } catch (error) {
      logger.error('Error creating appointment:', error);
      throw error;
    }
  }

  /**
   * Update appointment with validation and conflict checking
   */
  static async updateAppointment(id: string, data: UpdateAppointmentData) {
    try {
      const existingAppointment = await Appointment.findByPk(id, {
        include: [
          { model: Student, as: 'student' },
          { model: User, as: 'nurse' }
        ]
      });

      if (!existingAppointment) {
        throw new Error('Appointment not found');
      }

      // Validate that completed/cancelled/no-show appointments cannot be modified
      AppointmentValidation.validateNotFinalState(existingAppointment.status);

      // Validate status transition if updating status
      if (data.status) {
        AppointmentStatusTransitions.validateStatusTransition(existingAppointment.status, data.status as any);
      }

      // Comprehensive validation
      await AppointmentValidation.validateAppointmentData(data, true, existingAppointment);

      // If rescheduling, check for conflicts
      if (data.scheduledAt && data.scheduledAt.getTime() !== existingAppointment.scheduledAt.getTime()) {
        const duration = data.duration || existingAppointment.duration;
        const conflicts = await AppointmentAvailabilityService.checkAvailability(
          existingAppointment.nurseId,
          data.scheduledAt,
          duration,
          id // Exclude current appointment from conflict check
        );

        if (conflicts.length > 0) {
          const conflictDetails = conflicts.map(c =>
            `${(c as any).student?.firstName} ${(c as any).student?.lastName} at ${c.scheduledAt.toLocaleTimeString()}`
          ).join(', ');
          throw new Error(
            `Nurse is not available at the requested time. Conflicts with: ${conflictDetails}`
          );
        }
      }

      await existingAppointment.update(data as any);

      // Reload with associations
      await existingAppointment.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          },
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      logger.info(`Appointment updated: ${existingAppointment.id} - ${existingAppointment.type} for ${(existingAppointment as any).student?.firstName} ${(existingAppointment as any).student?.lastName}`);
      return existingAppointment;
    } catch (error) {
      logger.error('Error updating appointment:', error);
      throw error;
    }
  }

  /**
   * Get upcoming appointments for a nurse
   */
  static async getUpcomingAppointments(nurseId: string, limit: number = 10) {
    try {
      const appointments = await Appointment.findAll({
        where: {
          nurseId,
          scheduledAt: {
            [Op.gte]: new Date()
          },
          status: {
            [Op.in]: [AppointmentStatus.SCHEDULED, AppointmentStatus.IN_PROGRESS]
          }
        },
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          }
        ],
        order: [['scheduledAt', 'ASC']],
        limit
      });

      return appointments;
    } catch (error) {
      logger.error('Error fetching upcoming appointments:', error);
      throw error;
    }
  }

  /**
   * Cancel appointment with validation and waitlist processing
   */
  static async cancelAppointment(id: string, reason?: string) {
    try {
      const appointment = await Appointment.findByPk(id, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName']
          },
          {
            model: User,
            as: 'nurse',
            attributes: ['firstName', 'lastName']
          }
        ]
      });

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Validate appointment can be cancelled
      AppointmentValidation.validateCanBeCancelled(appointment.status);

      // Validate cancellation notice period
      AppointmentValidation.validateCancellationNotice(appointment.scheduledAt);

      // Validate status transition
      AppointmentStatusTransitions.validateStatusTransition(appointment.status, AppointmentStatus.CANCELLED);

      await appointment.update({
        status: AppointmentStatus.CANCELLED,
        notes: reason ? `Cancelled: ${reason}` : 'Cancelled'
      });

      logger.info(`Appointment cancelled: ${appointment.type} for ${(appointment as any).student?.firstName} ${(appointment as any).student?.lastName}`);

      // Try to fill the slot from waitlist
      try {
        await AppointmentWaitlistService.fillSlotFromWaitlist({
          scheduledAt: appointment.scheduledAt,
          duration: appointment.duration,
          nurseId: appointment.nurseId,
          type: appointment.type
        });
      } catch (waitlistError) {
        logger.warn('Could not fill slot from waitlist:', waitlistError);
      }

      return appointment;
    } catch (error) {
      logger.error('Error cancelling appointment:', error);
      throw error;
    }
  }

  /**
   * Mark appointment as no-show
   */
  static async markNoShow(id: string) {
    try {
      const appointment = await Appointment.findByPk(id, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName']
          }
        ]
      });

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Validate appointment can be marked as no-show
      AppointmentValidation.validateCanBeMarkedNoShow(appointment.status);

      // Validate appointment time has passed
      AppointmentValidation.validateAppointmentPassed(appointment.scheduledAt);

      // Validate status transition
      AppointmentStatusTransitions.validateStatusTransition(appointment.status, AppointmentStatus.NO_SHOW);

      await appointment.update({ status: AppointmentStatus.NO_SHOW });

      logger.info(`Appointment marked as no-show: ${appointment.type} for ${(appointment as any).student?.firstName} ${(appointment as any).student?.lastName}`);
      return appointment;
    } catch (error) {
      logger.error('Error marking appointment as no-show:', error);
      throw error;
    }
  }

  /**
   * Start appointment (transition to IN_PROGRESS status)
   */
  static async startAppointment(id: string) {
    try {
      const appointment = await Appointment.findByPk(id, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          },
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Validate current status
      AppointmentValidation.validateCanBeStarted(appointment.status);

      // Validate status transition
      AppointmentStatusTransitions.validateStatusTransition(appointment.status, AppointmentStatus.IN_PROGRESS);

      // Validate that appointment time is within reasonable range
      AppointmentValidation.validateStartTiming(appointment.scheduledAt);

      await appointment.update({ status: AppointmentStatus.IN_PROGRESS });

      logger.info(`Appointment started: ${appointment.type} for ${(appointment as any).student?.firstName} ${(appointment as any).student?.lastName}`);
      return appointment;
    } catch (error) {
      logger.error('Error starting appointment:', error);
      throw error;
    }
  }

  /**
   * Complete appointment (transition to COMPLETED status)
   */
  static async completeAppointment(id: string, completionData?: {
    notes?: string;
    outcomes?: string;
    followUpRequired?: boolean;
    followUpDate?: Date;
  }) {
    try {
      const appointment = await Appointment.findByPk(id, {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          },
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Validate current status
      AppointmentValidation.validateCanBeCompleted(appointment.status);

      // Validate status transition
      AppointmentStatusTransitions.validateStatusTransition(appointment.status, AppointmentStatus.COMPLETED);

      // Prepare update data
      const updateData: any = {
        status: AppointmentStatus.COMPLETED
      };

      if (completionData?.notes) {
        updateData.notes = completionData.notes;
      }

      await appointment.update(updateData);

      // Reload with associations
      await appointment.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          },
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ]
      });

      logger.info(`Appointment completed: ${appointment.type} for ${(appointment as any).student?.firstName} ${(appointment as any).student?.lastName}`);
      return appointment;
    } catch (error) {
      logger.error('Error completing appointment:', error);
      throw error;
    }
  }
}
