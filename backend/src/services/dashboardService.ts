import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface DashboardStats {
  totalStudents: number;
  activeMedications: number;
  todaysAppointments: number;
  pendingIncidents: number;
  medicationsDueToday: number;
  healthAlerts: number;
  recentActivityCount: number;
  studentTrend: {
    value: string;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
  };
  medicationTrend: {
    value: string;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
  };
  appointmentTrend: {
    value: string;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
  };
}

export interface DashboardRecentActivity {
  id: string;
  type: 'medication' | 'incident' | 'appointment';
  message: string;
  time: string;
  status: 'completed' | 'pending' | 'warning' | 'upcoming';
}

export interface DashboardUpcomingAppointment {
  id: string;
  student: string;
  studentId: string;
  time: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface DashboardChartData {
  enrollmentTrend: ChartDataPoint[];
  medicationAdministration: ChartDataPoint[];
  incidentFrequency: ChartDataPoint[];
  appointmentTrends: ChartDataPoint[];
}

export class DashboardService {
  /**
   * Get dashboard statistics
   */
  static async getDashboardStats(userId?: string): Promise<DashboardStats> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Get counts
      const [
        totalStudents,
        activeMedications,
        todaysAppointments,
        pendingIncidents,
        medicationsDueToday,
        healthAlerts
      ] = await Promise.all([
        prisma.student.count({ where: { isActive: true } }),
        prisma.studentMedication.count({ where: { isActive: true } }),
        prisma.appointment.count({
          where: {
            scheduledAt: {
              gte: today,
              lt: tomorrow
            },
            status: {
              in: ['SCHEDULED', 'IN_PROGRESS']
            }
          }
        }),
        prisma.incidentReport.count({
          where: {
            followUpRequired: true
          }
        }),
        prisma.studentMedication.count({
          where: {
            isActive: true,
            // Count active medications
            startDate: { lte: today },
            OR: [
              { endDate: null },
              { endDate: { gte: today } }
            ]
          }
        }),
        prisma.allergy.count({
          where: {
            severity: {
              in: ['SEVERE', 'LIFE_THREATENING']
            },
            student: {
              isActive: true
            }
          }
        })
      ]);

      // Calculate trends (comparing with last month)
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const [
        studentsLastMonth,
        medicationsLastMonth,
        appointmentsLastMonth
      ] = await Promise.all([
        prisma.student.count({
          where: {
            isActive: true,
            createdAt: { lte: lastMonth }
          }
        }),
        prisma.studentMedication.count({
          where: {
            isActive: true,
            createdAt: { lte: lastMonth }
          }
        }),
        prisma.appointment.count({
          where: {
            scheduledAt: {
              gte: lastMonth,
              lt: today
            }
          }
        })
      ]);

      // Calculate percentage changes
      const studentChange = studentsLastMonth > 0
        ? ((totalStudents - studentsLastMonth) / studentsLastMonth * 100).toFixed(1)
        : '0';

      const medicationChange = medicationsLastMonth > 0
        ? ((activeMedications - medicationsLastMonth) / medicationsLastMonth * 100).toFixed(1)
        : '0';

      const appointmentChange = appointmentsLastMonth > 0
        ? ((todaysAppointments - appointmentsLastMonth) / appointmentsLastMonth * 100).toFixed(1)
        : '0';

      return {
        totalStudents,
        activeMedications,
        todaysAppointments,
        pendingIncidents,
        medicationsDueToday,
        healthAlerts,
        recentActivityCount: await this.getRecentActivitiesCount(),
        studentTrend: {
          value: totalStudents.toString(),
          change: `${studentChange > '0' ? '+' : ''}${studentChange}%`,
          changeType: Number(studentChange) > 0 ? 'positive' : Number(studentChange) < 0 ? 'negative' : 'neutral'
        },
        medicationTrend: {
          value: activeMedications.toString(),
          change: `${medicationChange > '0' ? '+' : ''}${medicationChange}%`,
          changeType: Number(medicationChange) > 0 ? 'positive' : Number(medicationChange) < 0 ? 'negative' : 'neutral'
        },
        appointmentTrend: {
          value: todaysAppointments.toString(),
          change: `${appointmentChange > '0' ? '+' : ''}${appointmentChange}%`,
          changeType: Number(appointmentChange) > 0 ? 'positive' : Number(appointmentChange) < 0 ? 'negative' : 'neutral'
        }
      };
    } catch (error) {
      logger.error('Error fetching dashboard stats:', error);
      throw new Error('Failed to fetch dashboard statistics');
    }
  }

  /**
   * Get recent activities for dashboard
   */
  static async getRecentActivities(limit: number = 5): Promise<DashboardRecentActivity[]> {
    try {
      const activities: DashboardRecentActivity[] = [];

      // Get recent medication logs
      const recentMeds = await prisma.medicationLog.findMany({
        take: 3,
        orderBy: { timeGiven: 'desc' },
        include: {
          studentMedication: {
            include: {
              student: true,
              medication: true
            }
          },
          nurse: true
        }
      });

      recentMeds.forEach(med => {
        const timeDiff = Date.now() - med.timeGiven.getTime();
        const minutes = Math.floor(timeDiff / 60000);
        const hours = Math.floor(minutes / 60);

        let timeStr = '';
        if (hours > 24) timeStr = `${Math.floor(hours / 24)} days ago`;
        else if (hours > 0) timeStr = `${hours} hour${hours > 1 ? 's' : ''} ago`;
        else if (minutes > 0) timeStr = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        else timeStr = 'Just now';

        activities.push({
          id: med.id,
          type: 'medication',
          message: `Administered ${med.studentMedication.medication.name} to ${med.studentMedication.student.firstName} ${med.studentMedication.student.lastName}`,
          time: timeStr,
          status: 'completed'
        });
      });

      // Get recent incidents
      const recentIncidents = await prisma.incidentReport.findMany({
        take: 2,
        orderBy: { createdAt: 'desc' },
        include: {
          student: true
        }
      });

      recentIncidents.forEach(incident => {
        const timeDiff = Date.now() - incident.createdAt.getTime();
        const minutes = Math.floor(timeDiff / 60000);
        const hours = Math.floor(minutes / 60);

        let timeStr = '';
        if (hours > 24) timeStr = `${Math.floor(hours / 24)} days ago`;
        else if (hours > 0) timeStr = `${hours} hour${hours > 1 ? 's' : ''} ago`;
        else if (minutes > 0) timeStr = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        else timeStr = 'Just now';

        activities.push({
          id: incident.id,
          type: 'incident',
          message: `New ${incident.type.toLowerCase().replace('_', ' ')} report for ${incident.student.firstName} ${incident.student.lastName}`,
          time: timeStr,
          status: incident.followUpRequired ? 'pending' : 'completed'
        });
      });

      // Get upcoming appointments
      const now = new Date();
      const upcomingAppointments = await prisma.appointment.findMany({
        take: 2,
        where: {
          scheduledAt: { gte: now },
          status: 'SCHEDULED'
        },
        orderBy: { scheduledAt: 'asc' },
        include: {
          student: true
        }
      });

      upcomingAppointments.forEach(apt => {
        const timeDiff = apt.scheduledAt.getTime() - Date.now();
        const minutes = Math.floor(timeDiff / 60000);
        const hours = Math.floor(minutes / 60);

        let timeStr = '';
        if (hours > 24) timeStr = `in ${Math.floor(hours / 24)} days`;
        else if (hours > 0) timeStr = `in ${hours} hour${hours > 1 ? 's' : ''}`;
        else if (minutes > 0) timeStr = `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
        else timeStr = 'Now';

        activities.push({
          id: apt.id,
          type: 'appointment',
          message: `Upcoming ${apt.type.toLowerCase().replace('_', ' ')} with ${apt.student.firstName} ${apt.student.lastName}`,
          time: timeStr,
          status: 'upcoming'
        });
      });

      // Sort by most recent
      return activities.slice(0, limit);
    } catch (error) {
      logger.error('Error fetching recent activities:', error);
      throw new Error('Failed to fetch recent activities');
    }
  }

  /**
   * Get upcoming appointments for dashboard
   */
  static async getUpcomingAppointments(limit: number = 5): Promise<DashboardUpcomingAppointment[]> {
    try {
      const now = new Date();
      const appointments = await prisma.appointment.findMany({
        take: limit,
        where: {
          scheduledAt: { gte: now },
          status: {
            in: ['SCHEDULED', 'IN_PROGRESS']
          }
        },
        orderBy: { scheduledAt: 'asc' },
        include: {
          student: true
        }
      });

      return appointments.map(apt => {
        // Determine priority based on appointment type and time
        let priority: 'high' | 'medium' | 'low' = 'medium';
        if (apt.type === 'MEDICATION_ADMINISTRATION' || apt.type === 'EMERGENCY') {
          priority = 'high';
        } else if (apt.type === 'ROUTINE_CHECKUP') {
          priority = 'low';
        }

        const timeStr = apt.scheduledAt.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });

        return {
          id: apt.id,
          student: `${apt.student.firstName} ${apt.student.lastName}`,
          studentId: apt.student.id,
          time: timeStr,
          type: apt.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
          priority
        };
      });
    } catch (error) {
      logger.error('Error fetching upcoming appointments:', error);
      throw new Error('Failed to fetch upcoming appointments');
    }
  }

  /**
   * Get chart data for dashboard visualizations
   */
  static async getChartData(period: 'week' | 'month' | 'year' = 'week'): Promise<DashboardChartData> {
    try {
      const now = new Date();
      let startDate = new Date();
      let dateFormat: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };

      if (period === 'week') {
        startDate.setDate(now.getDate() - 7);
      } else if (period === 'month') {
        startDate.setMonth(now.getMonth() - 1);
      } else {
        startDate.setFullYear(now.getFullYear() - 1);
        dateFormat = { month: 'short' };
      }

      // Get enrollment trend
      const enrollmentData = await prisma.student.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: { gte: startDate }
        },
        _count: true
      });

      // Get medication administration
      const medicationData = await prisma.medicationLog.groupBy({
        by: ['timeGiven'],
        where: {
          timeGiven: { gte: startDate }
        },
        _count: true
      });

      // Get incident frequency
      const incidentData = await prisma.incidentReport.groupBy({
        by: ['occurredAt'],
        where: {
          occurredAt: { gte: startDate }
        },
        _count: true
      });

      // Get appointment trends
      const appointmentData = await prisma.appointment.groupBy({
        by: ['scheduledAt'],
        where: {
          scheduledAt: { gte: startDate }
        },
        _count: true
      });

      return {
        enrollmentTrend: this.formatChartData(enrollmentData, 'createdAt', dateFormat),
        medicationAdministration: this.formatChartData(medicationData, 'timeGiven', dateFormat),
        incidentFrequency: this.formatChartData(incidentData, 'occurredAt', dateFormat),
        appointmentTrends: this.formatChartData(appointmentData, 'scheduledAt', dateFormat)
      };
    } catch (error) {
      logger.error('Error fetching chart data:', error);
      throw new Error('Failed to fetch chart data');
    }
  }

  /**
   * Helper method to format chart data
   */
  private static formatChartData(
    data: any[],
    dateField: string,
    dateFormat: Intl.DateTimeFormatOptions
  ): ChartDataPoint[] {
    const grouped = new Map<string, number>();

    data.forEach(item => {
      const date = new Date(item[dateField]);
      const dateStr = date.toLocaleDateString('en-US', dateFormat);
      grouped.set(dateStr, (grouped.get(dateStr) || 0) + item._count);
    });

    return Array.from(grouped.entries()).map(([date, value]) => ({
      date,
      value,
      label: date
    }));
  }

  /**
   * Get recent activities count
   */
  private static async getRecentActivitiesCount(): Promise<number> {
    try {
      const last24Hours = new Date();
      last24Hours.setHours(last24Hours.getHours() - 24);

      const [medCount, incidentCount, aptCount] = await Promise.all([
        prisma.medicationLog.count({
          where: { timeGiven: { gte: last24Hours } }
        }),
        prisma.incidentReport.count({
          where: { createdAt: { gte: last24Hours } }
        }),
        prisma.appointment.count({
          where: { createdAt: { gte: last24Hours } }
        })
      ]);

      return medCount + incidentCount + aptCount;
    } catch (error) {
      logger.error('Error fetching recent activities count:', error);
      return 0;
    }
  }
}
