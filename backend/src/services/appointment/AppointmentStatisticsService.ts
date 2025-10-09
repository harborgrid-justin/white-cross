import { PrismaClient, Prisma } from '@prisma/client';
import { logger } from '../../utils/logger';

const prisma = new PrismaClient();

export class AppointmentStatisticsService {
  /**
   * Get appointment statistics
   */
  static async getAppointmentStatistics(nurseId?: string, dateFrom?: Date, dateTo?: Date) {
    try {
      const whereClause: Prisma.AppointmentWhereInput = {};

      if (nurseId) whereClause.nurseId = nurseId;

      if (dateFrom || dateTo) {
        whereClause.scheduledAt = {};
        if (dateFrom) whereClause.scheduledAt.gte = dateFrom;
        if (dateTo) whereClause.scheduledAt.lte = dateTo;
      }

      const [statusStats, typeStats, totalAppointments] = await Promise.all([
        prisma.appointment.groupBy({
          by: ['status'],
          where: whereClause,
          _count: { status: true }
        }),
        prisma.appointment.groupBy({
          by: ['type'],
          where: whereClause,
          _count: { type: true }
        }),
        prisma.appointment.count({ where: whereClause })
      ]);

      const noShowRate = statusStats.find((s) => s.status === 'NO_SHOW')?._count.status || 0;
      const completedCount = statusStats.find((s) => s.status === 'COMPLETED')?._count.status || 0;

      return {
        total: totalAppointments,
        byStatus: statusStats.reduce((acc: Record<string, number>, curr) => {
          acc[curr.status] = curr._count.status;
          return acc;
        }, {}),
        byType: typeStats.reduce((acc: Record<string, number>, curr) => {
          acc[curr.type] = curr._count.type;
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
