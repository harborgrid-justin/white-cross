/**
 * @fileoverview Appointment Query Service
 * @module appointment/services/appointment-query.service
 * @description Business logic for appointment queries and availability
 */

import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import {
  AppointmentEntity,
  AvailabilitySlot,
} from '../entities/appointment.entity';
import { AppointmentValidation } from '../validators/appointment-validation';
import {
  Appointment,
  AppointmentStatus as ModelAppointmentStatus,
} from '../../database/models/appointment.model';
import { User } from '../../database/models/user.model';

/**
 * Appointment Query Service
 *
 * Handles query operations and availability checking:
 * - Get appointments by date
 * - Get upcoming appointments
 * - Check nurse availability
 * - Get available time slots
 */
@Injectable()
export class AppointmentQueryService {
  private readonly logger = new Logger(AppointmentQueryService.name);

  constructor(
    @InjectModel(Appointment)
    private readonly appointmentModel: typeof Appointment,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  /**
   * Get appointments by a specific date
   */
  async getAppointmentsByDate(dateStr: string): Promise<{ data: AppointmentEntity[] }> {
    this.logger.log(`Fetching appointments for date: ${dateStr}`);

    try {
      // Parse the date string and create start/end of day boundaries
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        throw new BadRequestException('Invalid date format. Expected YYYY-MM-DD');
      }

      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const appointments = await this.appointmentModel.findAll({
        where: {
          scheduledAt: {
            [Op.gte]: dayStart,
            [Op.lte]: dayEnd,
          },
        },
        order: [['scheduledAt', 'ASC']],
        include: [
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
          },
        ],
      });

      const data = appointments.map((apt) => this.mapToEntity(apt));
      return { data };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error fetching appointments by date: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to fetch appointments by date');
    }
  }

  /**
   * Get upcoming appointments for a specific nurse
   */
  async getUpcomingAppointments(nurseId: string, limit: number = 10): Promise<AppointmentEntity[]> {
    this.logger.log(`Fetching upcoming appointments for nurse: ${nurseId}`);

    try {
      const now = new Date();

      const appointments = await this.appointmentModel.findAll({
        where: {
          nurseId,
          scheduledAt: {
            [Op.gte]: now,
          },
          status: {
            [Op.in]: [ModelAppointmentStatus.SCHEDULED, ModelAppointmentStatus.IN_PROGRESS],
          },
        },
        order: [['scheduledAt', 'ASC']],
        limit,
        include: [
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
          },
        ],
      });

      return appointments.map((apt) => this.mapToEntity(apt));
    } catch (error) {
      this.logger.error(`Error fetching upcoming appointments: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to fetch upcoming appointments');
    }
  }

  /**
   * Get upcoming appointments for the next N days (not nurse-specific)
   */
  async getGeneralUpcomingAppointments(
    limit: number = 50,
  ): Promise<{ data: AppointmentEntity[] }> {
    this.logger.log(`Fetching general upcoming appointments`);

    try {
      const now = new Date();
      const futureDate = new Date();
      futureDate.setDate(now.getDate() + 7); // Next 7 days

      const appointments = await this.appointmentModel.findAll({
        where: {
          scheduledAt: {
            [Op.gte]: now,
            [Op.lte]: futureDate,
          },
          status: {
            [Op.in]: [ModelAppointmentStatus.SCHEDULED, ModelAppointmentStatus.IN_PROGRESS],
          },
        },
        order: [['scheduledAt', 'ASC']],
        limit,
        include: [
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
          },
        ],
      });

      const data = appointments.map((apt) => this.mapToEntity(apt));
      return { data };
    } catch (error) {
      this.logger.error(
        `Error fetching general upcoming appointments: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to fetch upcoming appointments');
    }
  }

  /**
   * Check availability for a time slot with conflict detection
   */
  async checkAvailability(
    nurseId: string,
    startTime: Date,
    duration: number,
    excludeAppointmentId?: string,
  ): Promise<AppointmentEntity[]> {
    this.logger.log(`Checking availability for nurse: ${nurseId}`);

    // Calculate time range including buffer
    const bufferMinutes = AppointmentValidation.getBufferTimeMinutes();
    const slotStart = new Date(startTime.getTime() - bufferMinutes * 60000);
    const slotEnd = new Date(startTime.getTime() + (duration + bufferMinutes) * 60000);

    try {
      // Build where clause
      const whereClause: Record<string, any> = {
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
      this.logger.error(`Error checking availability: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to check availability');
    }
  }

  /**
   * Get available time slots for a nurse on a given date
   */
  async getAvailableSlots(
    nurseId: string,
    dateFrom?: string,
    dateTo?: string,
    duration: number = 30,
  ): Promise<AvailabilitySlot[]> {
    this.logger.log(`Getting available slots for nurse: ${nurseId}`);

    try {
      // Default to today if no date range provided
      const startDate = dateFrom ? new Date(dateFrom) : new Date();
      const endDate = dateTo ? new Date(dateTo) : new Date(startDate);

      // Ensure start date is not in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDate < today) {
        startDate.setTime(today.getTime());
      }

      const allSlots: AvailabilitySlot[] = [];

      // Generate slots for each day in the range
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const daySlots = await this.getAvailableSlotsForDate(nurseId, currentDate, duration);
        allSlots.push(...daySlots);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return allSlots;
    } catch (error) {
      this.logger.error(`Error getting available slots: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to get available slots');
    }
  }

  // ==================== PRIVATE METHODS ====================

  /**
   * Get available slots for a specific date
   */
  private async getAvailableSlotsForDate(
    nurseId: string,
    date: Date,
    slotDuration: number,
  ): Promise<AvailabilitySlot[]> {
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
   * Map Sequelize model to entity
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