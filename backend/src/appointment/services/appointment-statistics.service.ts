/**
 * @fileoverview Appointment Statistics Service
 * @module appointment/services/appointment-statistics.service
 * @description Business logic for appointment statistics, trends, and analytics
 */

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { AppointmentValidation } from '../validators/appointment-validation';
import { StatisticsFiltersDto, DateRangeDto } from '../dto/statistics.dto';
import { AppointmentEntity } from '../entities/appointment.entity';
import {
  Appointment,
  AppointmentStatus as ModelAppointmentStatus,
} from '../../database/models/appointment.model';
import { User } from '../../database/models/user.model';

import { BaseService } from '@/common/base';
/**
 * Appointment Statistics Service
 *
 * Handles statistical and analytical operations:
 * - Appointment statistics by status and type
 * - No-show rate calculation
 * - Utilization rate tracking
 * - Trend analysis over time
 * - Calendar export functionality
 */
@Injectable()
export class AppointmentStatisticsService extends BaseService {
  constructor(
    @InjectModel(Appointment)
    private readonly appointmentModel: typeof Appointment,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  /**
   * Get appointment statistics with optional filtering
   *
   * @param filters Filter criteria for statistics
   * @returns Statistics including totals, by status, by type, rates
   */
  async getStatistics(filters: StatisticsFiltersDto = {}): Promise<any> {
    this.logInfo('Getting appointment statistics');

    try {
      const whereClause: any = {};

      if (filters.nurseId) {
        whereClause.nurseId = filters.nurseId;
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

      const total = await this.appointmentModel.count({ where: whereClause });

      const byStatus = await this.appointmentModel.findAll({
        where: whereClause,
        attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
        group: ['status'],
        raw: true,
      });

      const byType = await this.appointmentModel.findAll({
        where: whereClause,
        attributes: ['type', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
        group: ['type'],
        raw: true,
      });

      const noShowCount = await this.appointmentModel.count({
        where: { ...whereClause, status: ModelAppointmentStatus.NO_SHOW },
      });

      const completedCount = await this.appointmentModel.count({
        where: { ...whereClause, status: ModelAppointmentStatus.COMPLETED },
      });

      return {
        total,
        byStatus: byStatus.reduce(
          (acc, item: any) => {
            acc[item.status] = parseInt(item.count);
            return acc;
          },
          {} as Record<string, number>,
        ),
        byType: byType.reduce(
          (acc, item: any) => {
            acc[item.type] = parseInt(item.count);
            return acc;
          },
          {} as Record<string, number>,
        ),
        noShowRate: total > 0 ? (noShowCount / total) * 100 : 0,
        completionRate: total > 0 ? (completedCount / total) * 100 : 0,
      };
    } catch (error) {
      this.logError(`Error getting statistics: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to get statistics');
    }
  }

  /**
   * Get appointment trends over time
   *
   * @param dateFrom Start date for trend analysis
   * @param dateTo End date for trend analysis
   * @param groupBy Grouping interval (day, week, month)
   * @returns Trend data with counts per period
   */
  async getAppointmentTrends(
    dateFrom: string,
    dateTo: string,
    groupBy: 'day' | 'week' | 'month' = 'day',
  ): Promise<{ trends: Array<{ date: string; count: number }> }> {
    this.logInfo('Getting appointment trends');

    try {
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);

      const trends: Array<{ date: string; count: number }> = [];
      const current = new Date(fromDate);

      while (current <= toDate) {
        const count = await this.appointmentModel.count({
          where: {
            scheduledAt: {
              [Op.gte]: current,
              [Op.lt]: new Date(current.getTime() + 24 * 60 * 60 * 1000),
            },
          },
        });

        trends.push({
          date: current.toISOString().split('T')[0],
          count,
        });

        current.setDate(current.getDate() + 1);
      }

      return { trends };
    } catch (error) {
      this.logError(`Error getting appointment trends: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to get appointment trends');
    }
  }

  /**
   * Get no-show statistics
   *
   * @param nurseId Optional nurse ID filter
   * @param dateFrom Optional start date
   * @param dateTo Optional end date
   * @returns No-show rate and details
   */
  async getNoShowStats(
    nurseId?: string,
    dateFrom?: string,
    dateTo?: string,
  ): Promise<{
    rate: number;
    total: number;
    noShows: number;
    byStudent: any[];
  }> {
    this.logInfo('Getting no-show statistics');

    try {
      const whereClause: any = {};

      if (nurseId) {
        whereClause.nurseId = nurseId;
      }

      if (dateFrom || dateTo) {
        whereClause.scheduledAt = {};
        if (dateFrom) {
          whereClause.scheduledAt[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          whereClause.scheduledAt[Op.lte] = new Date(dateTo);
        }
      }

      const total = await this.appointmentModel.count({ where: whereClause });
      const noShows = await this.appointmentModel.count({
        where: { ...whereClause, status: ModelAppointmentStatus.NO_SHOW },
      });

      const rate = total > 0 ? (noShows / total) * 100 : 0;

      return {
        rate,
        total,
        noShows,
        byStudent: [], // Could be enhanced with actual student aggregation
      };
    } catch (error) {
      this.logError(`Error getting no-show stats: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to get no-show statistics');
    }
  }

  /**
   * Get no-show count for a specific student
   *
   * @param studentId Student ID
   * @param daysBack Number of days to look back (default 90)
   * @returns Count of no-shows
   */
  async getNoShowCount(studentId: string, daysBack: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);

    return await this.appointmentModel.count({
      where: {
        studentId,
        status: ModelAppointmentStatus.NO_SHOW,
        scheduledAt: {
          [Op.gte]: cutoffDate,
        },
      },
    });
  }

  /**
   * Get utilization statistics for a nurse
   *
   * @param nurseId Nurse ID
   * @param dateFrom Start date
   * @param dateTo End date
   * @returns Utilization rate and slot breakdown
   */
  async getUtilizationStats(
    nurseId: string,
    dateFrom: string,
    dateTo: string,
  ): Promise<{
    utilizationRate: number;
    totalSlots: number;
    bookedSlots: number;
    availableSlots: number;
    byDay: any[];
  }> {
    this.logInfo('Getting utilization statistics');

    try {
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);

      const totalAppointments = await this.appointmentModel.count({
        where: {
          nurseId,
          scheduledAt: {
            [Op.gte]: fromDate,
            [Op.lte]: toDate,
          },
        },
      });

      const bookedSlots = await this.appointmentModel.count({
        where: {
          nurseId,
          scheduledAt: {
            [Op.gte]: fromDate,
            [Op.lte]: toDate,
          },
          status: {
            [Op.in]: [
              ModelAppointmentStatus.SCHEDULED,
              ModelAppointmentStatus.IN_PROGRESS,
              ModelAppointmentStatus.COMPLETED,
            ],
          },
        },
      });

      // Calculate business days between dates
      const businessDays = this.calculateBusinessDays(fromDate, toDate);
      const businessHours = AppointmentValidation.getBusinessHours();
      const hoursPerDay = businessHours.end - businessHours.start;
      const slotsPerDay = (hoursPerDay * 60) / 30; // 30-minute slots
      const totalSlots = businessDays * slotsPerDay;
      const availableSlots = totalSlots - bookedSlots;
      const utilizationRate = totalSlots > 0 ? (bookedSlots / totalSlots) * 100 : 0;

      return {
        utilizationRate,
        totalSlots,
        bookedSlots,
        availableSlots,
        byDay: [], // Could be enhanced with daily breakdown
      };
    } catch (error) {
      this.logError(`Error getting utilization stats: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to get utilization statistics');
    }
  }

  /**
   * Export calendar in iCal format
   *
   * @param nurseId Nurse ID
   * @param dateFrom Optional start date
   * @param dateTo Optional end date
   * @returns iCal format string
   */
  async exportCalendar(nurseId: string, dateFrom?: string, dateTo?: string): Promise<string> {
    this.logInfo('Exporting calendar');

    try {
      const whereClause: any = { nurseId };

      if (dateFrom || dateTo) {
        whereClause.scheduledAt = {};
        if (dateFrom) {
          whereClause.scheduledAt[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          whereClause.scheduledAt[Op.lte] = new Date(dateTo);
        }
      }

      const appointments = await this.appointmentModel.findAll({
        where: whereClause,
        order: [['scheduledAt', 'ASC']],
      });

      // Generate basic iCal format
      let icalContent =
        'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//White Cross//Appointments//EN\r\n';

      for (const appointment of appointments) {
        const startTime =
          appointment.scheduledAt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const endTime =
          new Date(appointment.scheduledAt.getTime() + appointment.duration * 60000)
            .toISOString()
            .replace(/[-:]/g, '')
            .split('.')[0] + 'Z';

        icalContent += 'BEGIN:VEVENT\r\n';
        icalContent += `UID:${appointment.id}@whitecross.edu\r\n`;
        icalContent += `DTSTART:${startTime}\r\n`;
        icalContent += `DTEND:${endTime}\r\n`;
        icalContent += `SUMMARY:${appointment.reason || 'Appointment'}\r\n`;
        icalContent += `DESCRIPTION:${appointment.notes || ''}\r\n`;
        icalContent += 'END:VEVENT\r\n';
      }

      icalContent += 'END:VCALENDAR\r\n';

      return icalContent;
    } catch (error) {
      this.logError(`Error exporting calendar: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to export calendar');
    }
  }

  /**
   * Calculate business days between two dates
   *
   * @param startDate Start date
   * @param endDate End date
   * @returns Number of business days
   */
  private calculateBusinessDays(startDate: Date, endDate: Date): number {
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
