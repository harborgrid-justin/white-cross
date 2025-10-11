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
