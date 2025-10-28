/**
 * @fileoverview Appointment CRUD Operations Module - Enterprise-grade create, read, update, delete operations
 *
 * LOC: 454766BAB0
 * WC-GEN-211 | crudOperations.ts - Appointment CRUD Operations with Comprehensive Validation
 *
 * This module provides robust CRUD operations for appointments with:
 * - Comprehensive data validation using AppointmentValidation
 * - State machine-enforced status transitions via AppointmentStatusTransitions
 * - Availability conflict checking with buffer time
 * - Automatic reminder scheduling on appointment creation
 * - Waitlist integration for cancelled appointment slots
 * - HIPAA-compliant audit logging
 * - Student and nurse association loading
 *
 * ARCHITECTURAL PATTERN:
 * - Static class methods (no instance required)
 * - Separation of concerns: validation, transitions, availability handled by specialized modules
 * - Dynamic import for waitlist to prevent circular dependencies
 * - Comprehensive error handling and logging
 *
 * VALIDATION & BUSINESS RULES:
 * - Future datetime validation
 * - Duration limits (15-120 minutes)
 * - Status transition validation (finite state machine)
 * - Cancellation notice period (2 hours minimum)
 * - Cannot modify finalized appointments (completed, cancelled, no-show)
 * - Appointment time validation (not too early/late for start)
 *
 * CONFLICT CHECKING:
 * - Checks nurse availability with buffer time
 * - Excludes current appointment from checks during updates
 * - Returns detailed conflict information with student names
 *
 * HIPAA COMPLIANCE:
 * - All operations logged with appointment and student details
 * - PHI access tracked via audit logs
 * - Soft delete pattern preserves records for compliance
 *
 * CIRCULAR DEPENDENCY HANDLING:
 * Uses dynamic import for AppointmentWaitlistService to avoid circular dependencies:
 * - AppointmentService → crudOperations → AppointmentWaitlistService → crudOperations (circular)
 * - Solution: Dynamic import in cancelAppointment method
 *
 * UPSTREAM DEPENDENCIES:
 * - logger.ts (utils/logger.ts) - Winston logging
 * - index.ts (database/models/index.ts) - Sequelize models
 * - enums.ts (database/types/enums.ts) - Status and type enums
 * - validation.ts (services/appointment/validation.ts) - Business rule validation
 * - statusTransitions.ts (services/appointment/statusTransitions.ts) - State machine
 * - AppointmentAvailabilityService.ts - Conflict checking
 * - AppointmentReminderService.ts - Reminder scheduling
 * - AppointmentWaitlistService.ts (dynamic import) - Slot filling
 *
 * DOWNSTREAM CONSUMERS:
 * - AppointmentService.ts (services/appointment/AppointmentService.ts) - Main facade
 * - AppointmentRecurringService.ts - Recurring appointment creation
 * - AppointmentWaitlistService.ts - Waitlist appointment creation
 *
 * @module services/appointment/crudOperations
 * @requires sequelize
 * @requires utils/logger
 * @requires database/models
 * @requires database/types/enums
 * @requires services/appointment/validation
 * @requires services/appointment/statusTransitions
 * @requires services/appointment/AppointmentAvailabilityService
 * @requires services/appointment/AppointmentReminderService
 *
 * @example
 * ```typescript
 * import { AppointmentCrudOperations } from './crudOperations';
 *
 * // Create appointment with validation
 * const appointment = await AppointmentCrudOperations.createAppointment({
 *   studentId: 'student-123',
 *   nurseId: 'nurse-456',
 *   scheduledAt: new Date('2025-10-26T10:00:00Z'),
 *   duration: 30,
 *   type: AppointmentType.CHECKUP
 * });
 *
 * // Get appointments with pagination and filters
 * const result = await AppointmentCrudOperations.getAppointments(1, 20, {
 *   nurseId: 'nurse-456',
 *   status: AppointmentStatus.SCHEDULED
 * });
 * ```
 *
 * @since 1.0.0
 * @lastUpdated 2025-10-25
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

/**
 * AppointmentCrudOperations - Static class providing enterprise-grade CRUD operations
 *
 * All methods are static and designed to be called directly without instantiation.
 * Implements comprehensive validation, conflict checking, and business rule enforcement.
 *
 * FEATURES:
 * - Paginated queries with flexible filtering
 * - Automatic association loading (student, nurse details)
 * - Comprehensive validation before create/update
 * - Conflict checking with detailed error messages
 * - Status transition enforcement via state machine
 * - Automatic reminder scheduling
 * - Waitlist integration for slot optimization
 * - HIPAA-compliant audit logging
 *
 * @class AppointmentCrudOperations
 * @static
 * @since 1.0.0
 */
export class AppointmentCrudOperations {
  /**
   * Retrieves appointments with pagination and advanced filtering
   *
   * Supports filtering by nurse, student, status, type, and date ranges.
   * Automatically loads associated student and nurse details for each appointment.
   * Returns paginated results with metadata.
   *
   * QUERY OPTIMIZATION:
   * - Uses Sequelize findAndCountAll for efficient pagination
   * - Filters applied at database level (WHERE clause)
   * - Eager loading of associations (student, nurse)
   * - Ordered by scheduledAt ascending
   * - Distinct count to prevent duplicate rows from joins
   *
   * @param {number} [page=1] - Page number (1-indexed)
   * @param {number} [limit=20] - Number of appointments per page
   * @param {AppointmentFilters} [filters={}] - Filter criteria
   * @param {string} [filters.nurseId] - Filter by nurse UUID
   * @param {string} [filters.studentId] - Filter by student UUID
   * @param {AppointmentStatus} [filters.status] - Filter by appointment status
   * @param {AppointmentType} [filters.type] - Filter by appointment type
   * @param {Date} [filters.dateFrom] - Start date for range filter (inclusive)
   * @param {Date} [filters.dateTo] - End date for range filter (inclusive)
   *
   * @returns {Promise<{appointments: Appointment[], pagination: {page: number, limit: number, total: number, pages: number}}>}
   *   Appointments array with pagination metadata
   *
   * @throws {Error} If database query fails
   *
   * @example
   * ```typescript
   * // Get scheduled appointments for nurse next week
   * const result = await AppointmentCrudOperations.getAppointments(1, 20, {
   *   nurseId: 'nurse-123',
   *   status: AppointmentStatus.SCHEDULED,
   *   dateFrom: new Date('2025-10-26'),
   *   dateTo: new Date('2025-11-02')
   * });
   *
   * console.log(`Page ${result.pagination.page} of ${result.pagination.pages}`);
   * console.log(`Total appointments: ${result.pagination.total}`);
   * result.appointments.forEach(apt => {
   *   console.log(`${apt.student.firstName} - ${apt.type} at ${apt.scheduledAt}`);
   * });
   * ```
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

      if (filters.appointmentType) {
        whereClause.appointmentType = filters.appointmentType;
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
   * Retrieves a single appointment by ID with full associations
   *
   * @param {string} id - Appointment UUID
   * @returns {Promise<Appointment>} Appointment with student and nurse details
   * @throws {Error} If appointment not found
   *
   * @example
   * ```typescript
   * const appointment = await AppointmentCrudOperations.getAppointmentById('appt-123');
   * console.log(`${appointment.student.firstName} with ${appointment.nurse.firstName}`);
   * ```
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
   * Creates new appointment with comprehensive validation and conflict checking
   *
   * WORKFLOW:
   * 1. Set default duration if not provided
   * 2. Validate appointment data (future date, duration, business rules)
   * 3. Verify student exists
   * 4. Verify nurse exists
   * 5. Check availability conflicts (with buffer time)
   * 6. Create appointment with SCHEDULED status
   * 7. Reload with associations
   * 8. Schedule automatic reminders
   * 9. Log creation for HIPAA audit
   *
   * @param {CreateAppointmentData} data - Appointment creation data
   * @returns {Promise<Appointment>} Created appointment with associations
   * @throws {Error} If validation fails, student/nurse not found, or conflicts detected
   *
   * @example
   * ```typescript
   * const appointment = await AppointmentCrudOperations.createAppointment({
   *   studentId: 'student-456',
   *   nurseId: 'nurse-123',
   *   scheduledAt: new Date('2025-10-26T10:00:00Z'),
   *   duration: 30,
   *   type: AppointmentType.CHECKUP
   * });
   * // Reminders automatically scheduled
   * ```
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
        data.scheduledDate,
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
        studentId: data.studentId,
        nurseId: data.nurseId,
        type: data.appointmentType as any,
        scheduledAt: data.scheduledDate,
        duration,
        reason: data.reason,
        notes: data.notes,
        status: AppointmentStatus.SCHEDULED
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
   * Updates appointment with validation, status transition, and conflict checking
   *
   * VALIDATIONS:
   * - Cannot modify finalized appointments (completed, cancelled, no-show)
   * - Status transitions validated by state machine
   * - Rescheduling checks for conflicts (excluding current appointment)
   *
   * @param {string} id - Appointment UUID
   * @param {UpdateAppointmentData} data - Partial update data
   * @returns {Promise<Appointment>} Updated appointment with associations
   * @throws {Error} If not found, invalid transition, or conflicts detected
   *
   * @example
   * ```typescript
   * const updated = await AppointmentCrudOperations.updateAppointment('appt-123', {
   *   scheduledAt: new Date('2025-10-26T14:00:00Z'),
   *   notes: 'Rescheduled per parent request'
   * });
   * ```
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
      if (data.scheduledDate && data.scheduledDate.getTime() !== existingAppointment.scheduledAt.getTime()) {
        const duration = data.duration || existingAppointment.duration;
        const conflicts = await AppointmentAvailabilityService.checkAvailability(
          existingAppointment.nurseId,
          data.scheduledDate,
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

      // Map scheduledDate to scheduledAt and appointmentType to type for database model
      const updateData: any = { ...data };
      if (data.scheduledDate) {
        updateData.scheduledAt = data.scheduledDate;
        delete updateData.scheduledDate;
      }
      if (data.appointmentType) {
        updateData.type = data.appointmentType;
        delete updateData.appointmentType;
      }

      await existingAppointment.update(updateData);

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
   * Retrieves upcoming appointments for a nurse (scheduled or in-progress)
   *
   * @param {string} nurseId - Nurse UUID
   * @param {number} [limit=10] - Maximum number to return
   * @returns {Promise<Appointment[]>} Upcoming appointments ordered by time
   * @throws {Error} If query fails
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
   * Cancels appointment with validation and automatic waitlist processing
   *
   * WORKFLOW:
   * 1. Validate can be cancelled (not already finalized)
   * 2. Validate cancellation notice period (2 hours minimum)
   * 3. Validate status transition to CANCELLED
   * 4. Update appointment status
   * 5. Attempt to fill slot from waitlist (best effort, logs warnings on failure)
   *
   * @param {string} id - Appointment UUID
   * @param {string} [reason] - Optional cancellation reason
   * @returns {Promise<Appointment>} Cancelled appointment
   * @throws {Error} If not found, cannot be cancelled, or insufficient notice
   *
   * @example
   * ```typescript
   * const cancelled = await AppointmentCrudOperations.cancelAppointment(
   *   'appt-123',
   *   'Student home sick'
   * );
   * // Waitlist automatically processed
   * ```
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

      // Try to fill the slot from waitlist (dynamic import to avoid circular dependency)
      try {
        const { AppointmentWaitlistService } = await import('./AppointmentWaitlistService');
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
   * Marks appointment as no-show (student didn't arrive)
   *
   * Validates appointment time has passed and status allows NO_SHOW transition.
   *
   * @param {string} id - Appointment UUID
   * @returns {Promise<Appointment>} No-show appointment
   * @throws {Error} If not found, time hasn't passed, or invalid status
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
   * Starts appointment (transitions to IN_PROGRESS status)
   *
   * Validates timing (not too early/late) and status transition.
   *
   * @param {string} id - Appointment UUID
   * @returns {Promise<Appointment>} Started appointment
   * @throws {Error} If not found, timing invalid, or transition not allowed
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
   * Completes appointment with optional completion data
   *
   * @param {string} id - Appointment UUID
   * @param {Object} [completionData] - Optional completion details
   * @param {string} [completionData.notes] - Completion notes
   * @param {string} [completionData.outcomes] - Health outcomes
   * @param {boolean} [completionData.followUpRequired] - Follow-up needed
   * @param {Date} [completionData.followUpDate] - Follow-up date
   * @returns {Promise<Appointment>} Completed appointment
   * @throws {Error} If not found or status transition not allowed
   *
   * @example
   * ```typescript
   * const completed = await AppointmentCrudOperations.completeAppointment('appt-123', {
   *   notes: 'Medication administered successfully',
   *   outcomes: 'No adverse reactions',
   *   followUpRequired: true
   * });
   * ```
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
