import { BadRequestException } from '@nestjs/common';
import { AppointmentStatus } from '../dto/update-appointment.dto';

/**
 * Appointment validation utility class
 * Implements business rules and validation logic
 */
export class AppointmentValidation {
  // Configuration constants for business rules
  static readonly MIN_DURATION_MINUTES = 15;
  static readonly MAX_DURATION_MINUTES = 120;
  static readonly DEFAULT_DURATION_MINUTES = 30;
  static readonly BUFFER_TIME_MINUTES = 15;
  static readonly MIN_CANCELLATION_HOURS = 2;
  static readonly MAX_APPOINTMENTS_PER_DAY = 16;
  static readonly BUSINESS_HOURS_START = 8; // 8 AM
  static readonly BUSINESS_HOURS_END = 17; // 5 PM
  static readonly WEEKEND_DAYS = [0, 6]; // Sunday and Saturday
  static readonly MIN_REMINDER_HOURS_BEFORE = 0.5; // 30 minutes minimum
  static readonly MAX_REMINDER_HOURS_BEFORE = 168; // 7 days maximum

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
      end: this.BUSINESS_HOURS_END,
    };
  }

  /**
   * Validate appointment date/time is in the future
   */
  static validateFutureDateTime(scheduledAt: Date): void {
    const now = new Date();
    if (scheduledAt <= now) {
      throw new BadRequestException(
        'Appointment must be scheduled for a future date and time',
      );
    }
  }

  /**
   * Validate appointment duration
   */
  static validateDuration(duration: number): void {
    if (duration < this.MIN_DURATION_MINUTES) {
      throw new BadRequestException(
        `Appointment duration must be at least ${this.MIN_DURATION_MINUTES} minutes`,
      );
    }
    if (duration > this.MAX_DURATION_MINUTES) {
      throw new BadRequestException(
        `Appointment duration cannot exceed ${this.MAX_DURATION_MINUTES} minutes`,
      );
    }
    if (duration % 15 !== 0) {
      throw new BadRequestException(
        'Appointment duration must be in 15-minute increments',
      );
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
      throw new BadRequestException(
        `Appointments must be scheduled after ${this.BUSINESS_HOURS_START}:00 AM`,
      );
    }

    const appointmentEndMinutes = totalMinutes + duration;
    if (appointmentEndMinutes > endMinutes) {
      throw new BadRequestException(
        `Appointments must end by ${this.BUSINESS_HOURS_END}:00 PM`,
      );
    }
  }

  /**
   * Validate appointment is not on weekend
   */
  static validateNotWeekend(scheduledAt: Date): void {
    const dayOfWeek = scheduledAt.getDay();
    if (this.WEEKEND_DAYS.includes(dayOfWeek)) {
      throw new BadRequestException(
        'Appointments cannot be scheduled on weekends',
      );
    }
  }

  /**
   * Validate cancellation notice period
   */
  static validateCancellationNotice(scheduledAt: Date): void {
    const now = new Date();
    const hoursUntilAppointment =
      (scheduledAt.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilAppointment < this.MIN_CANCELLATION_HOURS) {
      throw new BadRequestException(
        `Appointments must be cancelled at least ${this.MIN_CANCELLATION_HOURS} hours in advance`,
      );
    }
  }

  /**
   * Validate appointment is not more than 1 hour before scheduled time
   */
  static validateStartTiming(scheduledAt: Date): void {
    const now = new Date();
    const oneHourEarly = new Date(scheduledAt.getTime() - 60 * 60 * 1000);
    if (now < oneHourEarly) {
      throw new BadRequestException(
        'Cannot start appointment more than 1 hour before scheduled time',
      );
    }
  }

  /**
   * Validate appointment has passed for no-show marking
   */
  static validateAppointmentPassed(scheduledAt: Date): void {
    const now = new Date();
    if (scheduledAt > now) {
      throw new BadRequestException(
        'Cannot mark future appointment as no-show',
      );
    }
  }

  /**
   * Validate final state appointments cannot be modified
   */
  static validateNotFinalState(status: AppointmentStatus): void {
    if (
      [
        AppointmentStatus.COMPLETED,
        AppointmentStatus.CANCELLED,
        AppointmentStatus.NO_SHOW,
      ].includes(status)
    ) {
      throw new BadRequestException(
        `Cannot update appointment with status ${status}`,
      );
    }
  }

  /**
   * Validate appointment can be cancelled
   */
  static validateCanBeCancelled(status: AppointmentStatus): void {
    if (
      status !== AppointmentStatus.SCHEDULED &&
      status !== AppointmentStatus.IN_PROGRESS
    ) {
      throw new BadRequestException(
        `Cannot cancel appointment with status ${status}`,
      );
    }
  }

  /**
   * Validate appointment can be marked as no-show
   */
  static validateCanBeMarkedNoShow(status: AppointmentStatus): void {
    if (status !== AppointmentStatus.SCHEDULED) {
      throw new BadRequestException(
        `Cannot mark appointment with status ${status} as no-show`,
      );
    }
  }

  /**
   * Validate appointment can be started
   */
  static validateCanBeStarted(status: AppointmentStatus): void {
    if (status !== AppointmentStatus.SCHEDULED) {
      throw new BadRequestException(
        `Cannot start appointment with status ${status}`,
      );
    }
  }

  /**
   * Validate appointment can be completed
   */
  static validateCanBeCompleted(status: AppointmentStatus): void {
    if (status !== AppointmentStatus.IN_PROGRESS) {
      throw new BadRequestException(
        `Cannot complete appointment with status ${status}. Appointment must be IN_PROGRESS`,
      );
    }
  }
}
