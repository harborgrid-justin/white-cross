/**
 * @fileoverview Appointment Query Service
 * @module appointme@/services/appointment-query.service
 * @description Business logic for appointment queries and availability
 */

import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import {
  AppointmentEntity,
} from '../entities/appointment.entity';
import {
  Appointment,
  AppointmentStatus as ModelAppointmentStatus,
} from '@/database/models';
import { User } from '@/database/models';
import { AppointmentSchedulingService } from './appointment-scheduling.service';

import { BaseService } from '@/common/base';
/**
 * Appointment Query Service
 *
 * Handles query operations and availability checking:
 * - Get appointments by date
 * - Get upcoming appointments
 * - Check nurse availability (delegates to AppointmentSchedulingService)
 * - Get available time slots (delegates to AppointmentSchedulingService)
 */
@Injectable()
export class AppointmentQueryService extends BaseService {
  constructor(
    @InjectModel(Appointment)
    private readonly appointmentModel: typeof Appointment,
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly schedulingService: AppointmentSchedulingService,
  ) {}

  /**
   * Get appointments by a specific date
   */
  async getAppointmentsByDate(dateStr: string): Promise<{ data: AppointmentEntity[] }> {
    this.logInfo(`Fetching appointments for date: ${dateStr}`);

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
      this.logError(`Error fetching appointments by date: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to fetch appointments by date');
    }
  }

  /**
   * Get upcoming appointments for a specific nurse
   */
  async getUpcomingAppointments(nurseId: string, limit: number = 10): Promise<AppointmentEntity[]> {
    this.logInfo(`Fetching upcoming appointments for nurse: ${nurseId}`);

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
      this.logError(`Error fetching upcoming appointments: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to fetch upcoming appointments');
    }
  }

  /**
   * Get upcoming appointments for the next N days (not nurse-specific)
   */
  async getGeneralUpcomingAppointments(
    limit: number = 50,
  ): Promise<{ data: AppointmentEntity[] }> {
    this.logInfo(`Fetching general upcoming appointments`);

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
      this.logError(
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
    return this.schedulingService.checkAvailability(nurseId, startTime, duration, excludeAppointmentId);
  }

  /**
   * Get available time slots for a nurse on a given date
   */
  async getAvailableSlots(
    nurseId: string,
    dateFrom?: string,
    dateTo?: string,
    duration: number = 30,
  ): Promise<any[]> {
    this.logInfo(`Getting available slots for nurse: ${nurseId}`);

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

      const allSlots: any[] = [];

      // Generate slots for each day in the range
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const daySlots = await this.schedulingService.getAvailableSlots(nurseId, currentDate, duration);
        allSlots.push(...daySlots);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return allSlots;
    } catch (error) {
      this.logError(`Error getting available slots: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to get available slots');
    }
  }
}