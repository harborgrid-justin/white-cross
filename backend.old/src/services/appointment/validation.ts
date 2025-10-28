/**
 * LOC: 111508072A
 * WC-GEN-215 | validation.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - index.ts (database/models/index.ts)
 *
 * DOWNSTREAM (imported by):
 *   - crudOperations.ts (services/appointment/crudOperations.ts)
 *   - appointmentService.ts (services/appointmentService.ts)
 */

/**
 * WC-GEN-215 | validation.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../database/models, ../../database/types/enums, ../../types/appointment | Dependencies: sequelize, ../../database/models, ../../database/types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Op } from 'sequelize';
import { Appointment } from '../../database/models';
import {
  AppointmentType,
  AppointmentStatus,
  WaitlistPriority
} from '../../database/types/enums';
import {
  CreateAppointmentData,
  UpdateAppointmentData
} from '../../types/appointment';

/**
 * Enterprise-grade validation module for appointment business rules
 * Implements comprehensive validation logic following SOLID principles
 */
export class AppointmentValidation {
  // Configuration constants for business rules
  private static readonly MIN_DURATION_MINUTES = 15;
  private static readonly MAX_DURATION_MINUTES = 120;
  private static readonly DEFAULT_DURATION_MINUTES = 30;
  private static readonly BUFFER_TIME_MINUTES = 15;
  private static readonly MIN_CANCELLATION_HOURS = 2;
  private static readonly MAX_APPOINTMENTS_PER_DAY = 16;
  private static readonly BUSINESS_HOURS_START = 8; // 8 AM
  private static readonly BUSINESS_HOURS_END = 17; // 5 PM
  private static readonly WEEKEND_DAYS = [0, 6]; // Sunday and Saturday
  private static readonly MIN_REMINDER_HOURS_BEFORE = 0.5; // 30 minutes minimum
  private static readonly MAX_REMINDER_HOURS_BEFORE = 168; // 7 days maximum

  /**
   * Get default duration for appointments
   */
  static getDefaultDuration(): number {
    return this.DEFAULT_DURATION_MINUTES;
  }

  /**
   * Get buffer time for scheduling
   */
  static getBufferTimeMinutes(): number {
    return this.BUFFER_TIME_MINUTES;
  }

  /**
   * Get business hours configuration
   */
  static getBusinessHours(): { start: number; end: number } {
    return {
      start: this.BUSINESS_HOURS_START,
      end: this.BUSINESS_HOURS_END
    };
  }

  /**
   * Validate appointment date/time is in the future
   */
  static validateFutureDateTime(scheduledAt: Date): void {
    const now = new Date();
    if (scheduledAt <= now) {
      throw new Error('Appointment must be scheduled for a future date and time');
    }
  }

  /**
   * Validate appointment duration
   */
  static validateDuration(duration: number): void {
    if (duration < this.MIN_DURATION_MINUTES) {
      throw new Error(`Appointment duration must be at least ${this.MIN_DURATION_MINUTES} minutes`);
    }
    if (duration > this.MAX_DURATION_MINUTES) {
      throw new Error(`Appointment duration cannot exceed ${this.MAX_DURATION_MINUTES} minutes`);
    }
    if (duration % 15 !== 0) {
      throw new Error('Appointment duration must be in 15-minute increments');
    }
  }

  /**
   * Validate appointment is within business hours
   */
  static validateBusinessHours(scheduledAt: Date, duration: number): void {
    const hour = scheduledAt.getHours();
    const minutes = scheduledAt.getMinutes();
    const totalMinutes = hour * 60 + minutes;

    const startMinutes = this.BUSINESS_HOURS_START * 60;
    const endMinutes = this.BUSINESS_HOURS_END * 60;

    if (totalMinutes < startMinutes) {
      throw new Error(`Appointments must be scheduled after ${this.BUSINESS_HOURS_START}:00 AM`);
    }

    const appointmentEndMinutes = totalMinutes + duration;
    if (appointmentEndMinutes > endMinutes) {
      throw new Error(`Appointments must end by ${this.BUSINESS_HOURS_END}:00 PM`);
    }
  }

  /**
   * Validate appointment is not on weekend
   */
  static validateNotWeekend(scheduledAt: Date): void {
    const dayOfWeek = scheduledAt.getDay();
    if (this.WEEKEND_DAYS.includes(dayOfWeek)) {
      throw new Error('Appointments cannot be scheduled on weekends');
    }
  }

  /**
   * Validate appointment type enum
   */
  static validateAppointmentType(type: any): void {
    const validTypes = Object.values(AppointmentType);
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid appointment type. Must be one of: ${validTypes.join(', ')}`);
    }
  }

  /**
   * Validate cancellation notice period
   */
  static validateCancellationNotice(scheduledAt: Date): void {
    const now = new Date();
    const hoursUntilAppointment = (scheduledAt.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilAppointment < this.MIN_CANCELLATION_HOURS) {
      throw new Error(
        `Appointments must be cancelled at least ${this.MIN_CANCELLATION_HOURS} hours in advance`
      );
    }
  }

  /**
   * Validate waitlist priority
   */
  static validateWaitlistPriority(priority: WaitlistPriority): void {
    const validPriorities = Object.values(WaitlistPriority);
    if (!validPriorities.includes(priority)) {
      throw new Error(`Invalid waitlist priority. Must be one of: ${validPriorities.join(', ')}`);
    }
  }

  /**
   * Validate reminder timing
   */
  static validateReminderTiming(appointmentTime: Date, reminderTime: Date): void {
    if (reminderTime >= appointmentTime) {
      throw new Error('Reminder must be scheduled before the appointment time');
    }

    const hoursBeforeAppointment = (appointmentTime.getTime() - reminderTime.getTime()) / (1000 * 60 * 60);

    if (hoursBeforeAppointment < this.MIN_REMINDER_HOURS_BEFORE) {
      throw new Error(`Reminder must be at least ${this.MIN_REMINDER_HOURS_BEFORE} hours before appointment`);
    }

    if (hoursBeforeAppointment > this.MAX_REMINDER_HOURS_BEFORE) {
      throw new Error(`Reminder cannot be more than ${this.MAX_REMINDER_HOURS_BEFORE} hours before appointment`);
    }

    const now = new Date();
    if (reminderTime <= now) {
      throw new Error('Reminder time must be in the future');
    }
  }

  /**
   * Validate appointment is not more than 1 hour before scheduled time
   */
  static validateStartTiming(scheduledAt: Date): void {
    const now = new Date();
    const oneHourEarly = new Date(scheduledAt.getTime() - 60 * 60 * 1000);
    if (now < oneHourEarly) {
      throw new Error('Cannot start appointment more than 1 hour before scheduled time');
    }
  }

  /**
   * Validate appointment has passed for no-show marking
   */
  static validateAppointmentPassed(scheduledAt: Date): void {
    const now = new Date();
    if (scheduledAt > now) {
      throw new Error('Cannot mark future appointment as no-show');
    }
  }

  /**
   * Validate nurse hasn't exceeded max appointments per day
   */
  static async validateMaxAppointmentsPerDay(
    nurseId: string,
    scheduledAt: Date,
    excludeAppointmentId?: string
  ): Promise<void> {
    const startOfDay = new Date(scheduledAt);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(scheduledAt);
    endOfDay.setHours(23, 59, 59, 999);

    const whereClause: any = {
      nurseId,
      scheduledAt: {
        [Op.gte]: startOfDay,
        [Op.lte]: endOfDay
      },
      status: {
        [Op.in]: [AppointmentStatus.SCHEDULED, AppointmentStatus.IN_PROGRESS]
      }
    };

    if (excludeAppointmentId) {
      whereClause.id = { [Op.ne]: excludeAppointmentId };
    }

    const count = await Appointment.count({ where: whereClause });

    if (count >= this.MAX_APPOINTMENTS_PER_DAY) {
      throw new Error(
        `Nurse has reached the maximum of ${this.MAX_APPOINTMENTS_PER_DAY} appointments per day`
      );
    }
  }

  /**
   * Comprehensive validation for appointment creation/update
   */
  static async validateAppointmentData(
    data: CreateAppointmentData | UpdateAppointmentData,
    isUpdate: boolean = false,
    existingAppointment?: Appointment
  ): Promise<void> {
    // Validate appointment type
    if (data.appointmentType) {
      this.validateAppointmentType(data.appointmentType);
    }

    // Validate scheduled time
    if (data.scheduledDate) {
      this.validateFutureDateTime(data.scheduledDate);
      this.validateNotWeekend(data.scheduledDate);

      const duration = data.duration ||
        (existingAppointment?.duration) ||
        this.DEFAULT_DURATION_MINUTES;

      this.validateBusinessHours(data.scheduledDate, duration);

      if ('nurseId' in data) {
        await this.validateMaxAppointmentsPerDay(
          data.nurseId,
          data.scheduledDate,
          existingAppointment?.id
        );
      } else if (existingAppointment) {
        await this.validateMaxAppointmentsPerDay(
          existingAppointment.nurseId,
          data.scheduledDate,
          existingAppointment.id
        );
      }
    }

    // Validate duration
    if (data.duration !== undefined) {
      this.validateDuration(data.duration);
    }

    // Validate reason is provided (optional field, so no validation needed)
  }

  /**
   * Validate final state appointments cannot be modified
   */
  static validateNotFinalState(status: AppointmentStatus): void {
    if ([AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW]
      .includes(status)) {
      throw new Error(`Cannot update appointment with status ${status}`);
    }
  }

  /**
   * Validate appointment can be cancelled
   */
  static validateCanBeCancelled(status: AppointmentStatus): void {
    if (status !== AppointmentStatus.SCHEDULED &&
      status !== AppointmentStatus.IN_PROGRESS) {
      throw new Error(`Cannot cancel appointment with status ${status}`);
    }
  }

  /**
   * Validate appointment can be marked as no-show
   */
  static validateCanBeMarkedNoShow(status: AppointmentStatus): void {
    if (status !== AppointmentStatus.SCHEDULED) {
      throw new Error(`Cannot mark appointment with status ${status} as no-show`);
    }
  }

  /**
   * Validate appointment can be started
   */
  static validateCanBeStarted(status: AppointmentStatus): void {
    if (status !== AppointmentStatus.SCHEDULED) {
      throw new Error(`Cannot start appointment with status ${status}`);
    }
  }

  /**
   * Validate appointment can be completed
   */
  static validateCanBeCompleted(status: AppointmentStatus): void {
    if (status !== AppointmentStatus.IN_PROGRESS) {
      throw new Error(`Cannot complete appointment with status ${status}. Appointment must be IN_PROGRESS`);
    }
  }

  /**
   * Validate reason is provided for operations that require it
   */
  static validateReasonProvided(reason?: string): void {
    if (!reason || reason.trim().length === 0) {
      throw new Error('Reason is required');
    }
  }
}
