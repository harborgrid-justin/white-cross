/**
 * LOC: 7D7CD0C33F
 * WC-GEN-209 | AppointmentStatisticsService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - index.ts (database/models/index.ts)
 *
 * DOWNSTREAM (imported by):
 *   - appointmentService.ts (services/appointmentService.ts)
 */

/**
 * WC-GEN-209 | AppointmentStatisticsService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../utils/logger, ../../database/models | Dependencies: sequelize, ../../utils/logger, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { Appointment, sequelize } from '../../database/models';

export class AppointmentStatisticsService {
  /**
   * Get appointment statistics
   */
  static async getAppointmentStatistics(nurseId?: string, dateFrom?: Date, dateTo?: Date) {
    try {
      const whereClause: any = {};

      if (nurseId) whereClause.nurseId = nurseId;

      if (dateFrom || dateTo) {
        whereClause.scheduledAt = {};
        if (dateFrom) whereClause.scheduledAt[Op.gte] = dateFrom;
        if (dateTo) whereClause.scheduledAt[Op.lte] = dateTo;
      }

      const [statusStats, typeStats, totalAppointments] = await Promise.all([
        Appointment.findAll({
          where: whereClause,
          attributes: [
            'status',
            [sequelize.fn('COUNT', sequelize.col('status')), 'count']
          ],
          group: ['status'],
          raw: true
        }),
        Appointment.findAll({
          where: whereClause,
          attributes: [
            'type',
            [sequelize.fn('COUNT', sequelize.col('type')), 'count']
          ],
          group: ['type'],
          raw: true
        }),
        Appointment.count({ where: whereClause })
      ]);

      const noShowRate = (statusStats as any[]).find((s: any) => s.status === 'NO_SHOW')?.count || 0;
      const completedCount = (statusStats as any[]).find((s: any) => s.status === 'COMPLETED')?.count || 0;

      return {
        total: totalAppointments,
        byStatus: (statusStats as any[]).reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.status] = parseInt(curr.count, 10);
          return acc;
        }, {}),
        byType: (typeStats as any[]).reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.type] = parseInt(curr.count, 10);
          return acc;
        }, {}),
        noShowRate: totalAppointments > 0 ? (noShowRate / totalAppointments) * 100 : 0,
        completionRate: totalAppointments > 0 ? (completedCount / totalAppointments) * 100 : 0
      };
    } catch (error) {
      logger.error('Error fetching appointment statistics:', error);
      throw error;
    }
  }
}
