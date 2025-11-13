/**
 * @fileoverview Appointment Scheduling Service
 * @module appointment/services/appointment-scheduling.service
 * @description Business logic for appointment scheduling, availability checking, and conflict detection
 */

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { AppointmentValidation } from '../validators/appointment-validation';
import { AppointmentEntity, AvailabilitySlot } from '../entities/appointment.entity';
import {
  Appointment,
  AppointmentStatus as ModelAppointmentStatus,
} from '../../database/models/appointment.model';
import { User } from '../../database/models/user.model';

import { BaseService } from '@/common/base';
/**
 * Appointment Scheduling Service
 *
 * Handles scheduling-specific operations:
 * - Availability checking with conflict detection
 * - Time slot generation based on business hours
 * - Scheduling conflict validation
 * - Daily appointment limit enforcement
 * - Business hours and weekend validation
 */
@Injectable()
export class AppointmentSchedulingService extends BaseService {
  constructor(
    @InjectModel(Appointment)
    private readonly appointmentModel: typeof Appointment,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  /**
   * Check availability for a time slot with conflict detection
   *
   * Returns conflicting appointments if any exist
   * Considers buffer time between appointments
   *
   * @param nurseId Nurse ID to check availability for
   * @param startTime Start time of the requested slot
   * @param duration Duration in minutes
   * @param excludeAppointmentId Optional appointment to exclude (for updates)
   */
  async checkAvailability(
    nurseId: string,
    startTime: Date,
    duration: number,
    excludeAppointmentId?: string,
  ): Promise<AppointmentEntity[]> {
    this.logInfo(`Checking availability for nurse: ${nurseId}`);

    // Calculate time range including buffer
    const bufferMinutes = AppointmentValidation.BUFFER_TIME_MINUTES;
    const slotStart = new Date(startTime.getTime() - bufferMinutes * 60000);
    const slotEnd = new Date(startTime.getTime() + (duration + bufferMinutes) * 60000);

    try {
      // Build where clause
      const whereClause: any = {
        nurseId,
        status: {
          [Op.in]: [ModelAppointmentStatus.SCHEDULED, ModelAppointmentStatus.IN_PROGRESS],
        },
        [Op.or]: [
          // Appointment starts within the requested slot
          {
            scheduledAt: {
              [Op.gte]: slotStart,
              [Op.lt]: slotEnd,
            },
          },
          // Appointment ends within the requested slot
          {
            [Op.and]: [
              Sequelize.where(
                Sequelize.fn(
                  'DATE_ADD',
                  Sequelize.col('scheduled_at'),
                  Sequelize.literal('INTERVAL duration MINUTE'),
                ),
                Op.gt,
                slotStart,
              ),
              Sequelize.where(Sequelize.col('scheduled_at'), Op.lt, slotEnd),
            ],
          },
        ],
      };

      // Exclude specific appointment if provided
      if (excludeAppointmentId) {
        whereClause.id = { [Op.ne]: excludeAppointmentId };
      }

      const conflicts = await this.appointmentModel.findAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName'],
          },
        ],
      });

      return conflicts.map((apt) => this.mapToEntity(apt));
    } catch (error) {
      this.logError(`Error checking availability: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to check availability');
    }
  }

  /**
   * Get available time slots for a nurse on a given date with business hours logic
   *
   * Generates 30-minute slots from business hours,
   * excluding existing appointments and buffer time
   *
   * @param nurseId Nurse ID to get slots for
   * @param date Date to check availability
   * @param slotDuration Duration of each slot in minutes (default 30)
   */
  async getAvailableSlots(
    nurseId: string,
    date: Date,
    slotDuration: number = 30,
  ): Promise<AvailabilitySlot[]> {
    this.logInfo(`Getting available slots for nurse: ${nurseId} on ${date}`);

    const businessHours = AppointmentValidation.getBusinessHours();
    const slots: AvailabilitySlot[] = [];

    // Generate time slots for the day
    const dayStart = new Date(date);
    dayStart.setHours(businessHours.start, 0, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(businessHours.end, 0, 0, 0);

    // Generate slots in slotDuration increments
    let currentSlotStart = new Date(dayStart);
    while (currentSlotStart < dayEnd) {
      const currentSlotEnd = new Date(currentSlotStart.getTime() + slotDuration * 60000);

      // Skip if slot extends beyond business hours
      if (currentSlotEnd > dayEnd) {
        break;
      }

      // Check for conflicts
      const conflicts = await this.checkAvailability(nurseId, currentSlotStart, slotDuration);

      slots.push({
        startTime: new Date(currentSlotStart),
        endTime: currentSlotEnd,
        nurseId,
        isAvailable: conflicts.length === 0,
        duration: slotDuration,
        unavailabilityReason:
          conflicts.length > 0
            ? `Conflicting appointment: ${conflicts[0].reason || 'Scheduled'}`
            : undefined,
      });

      // Move to next slot
      currentSlotStart = new Date(currentSlotStart.getTime() + slotDuration * 60000);
    }

    return slots;
  }

  /**
   * Check for scheduling conflicts
   *
   * @param nurseId Nurse ID to check
   * @param startTime Start time of appointment
   * @param duration Duration in minutes
   * @param excludeAppointmentId Optional appointment to exclude
   */
  async checkConflicts(
    nurseId: string,
    startTime: string,
    duration: number,
    excludeAppointmentId?: string,
  ): Promise<{
    hasConflict: boolean;
    conflicts: AppointmentEntity[];
    availableSlots: AvailabilitySlot[];
  }> {
    this.logInfo('Checking scheduling conflicts');

    try {
      const startDateTime = new Date(startTime);
      const conflicts = await this.checkAvailability(
        nurseId,
        startDateTime,
        duration,
        excludeAppointmentId,
      );

      const availableSlots = await this.getAvailableSlots(nurseId, startDateTime, duration);

      return {
        hasConflict: conflicts.length > 0,
        conflicts,
        availableSlots: availableSlots.filter((slot) => slot.isAvailable),
      };
    } catch (error) {
      this.logError(`Error checking conflicts: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to check conflicts');
    }
  }

  /**
   * Validate daily appointment limit for nurse (max 20 per day)
   *
   * @param nurseId Nurse ID to validate
   * @param date Date to check
   * @throws BadRequestException if limit exceeded
   */
  async validateDailyAppointmentLimit(nurseId: string, date: Date): Promise<void> {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const count = await this.appointmentModel.count({
      where: {
        nurseId,
        scheduledAt: {
          [Op.gte]: dayStart,
          [Op.lte]: dayEnd,
        },
        status: {
          [Op.in]: [ModelAppointmentStatus.SCHEDULED, ModelAppointmentStatus.IN_PROGRESS],
        },
      },
    });

    if (count >= 20) {
      throw new BadRequestException('Nurse has reached maximum daily appointment limit (20)');
    }
  }

  /**
   * Calculate business days between two dates
   *
   * @param startDate Start date
   * @param endDate End date
   * @returns Number of business days (Monday-Friday)
   */
  calculateBusinessDays(startDate: Date, endDate: Date): number {
    let businessDays = 0;
    const current = new Date(startDate);

    while (current <= endDate) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Not Sunday or Saturday
        businessDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    return businessDays;
  }

  /**
   * Map Sequelize model to entity
   *
   * @param appointment Sequelize appointment model
   * @returns AppointmentEntity
   */
  private mapToEntity(appointment: Appointment): AppointmentEntity {
    return {
      id: appointment.id,
      studentId: appointment.studentId,
      nurseId: appointment.nurseId,
      type: appointment.type as any,
      appointmentType: appointment.type as any,
      scheduledAt: appointment.scheduledAt,
      duration: appointment.duration,
      reason: appointment.reason,
      notes: appointment.notes,
      status: appointment.status as any,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
      nurse: appointment.nurse
        ? {
            id: appointment.nurse.id,
            firstName: appointment.nurse.firstName,
            lastName: appointment.nurse.lastName,
            email: appointment.nurse.email,
            role: appointment.nurse.role || 'NURSE',
          }
        : undefined,
    };
  }
}
