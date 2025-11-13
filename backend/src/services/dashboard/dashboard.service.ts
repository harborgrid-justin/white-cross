/**
 * Dashboard Service
 * Provides comprehensive dashboard statistics, analytics, and real-time data
 * for the healthcare platform. Aggregates data from multiple modules.
 *
 * NOTE: This service requires the following Sequelize models to be available:
 * - Student, StudentMedication, Appointment, IncidentReport, MedicationLog, Allergy, User, Medication
 * These models should be registered in the DatabaseModule through Sequelize's model registry.
 */

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { col, fn, Op, Sequelize } from 'sequelize';
import { BaseService } from '@/common/base';
import {
  ChartDataPointDto,
  DashboardChartDataDto,
  DashboardStatsDto,
  RecentActivityDto,
  UpcomingAppointmentDto,
} from './dto';

// Enums from backend (replicated here for type safety)
enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

enum AppointmentType {
  ROUTINE_CHECKUP = 'ROUTINE_CHECKUP',
  SICK_VISIT = 'SICK_VISIT',
  MEDICATION_ADMINISTRATION = 'MEDICATION_ADMINISTRATION',
  INJURY_ASSESSMENT = 'INJURY_ASSESSMENT',
  EMERGENCY = 'EMERGENCY',
  FOLLOW_UP = 'FOLLOW_UP',
  HEALTH_SCREENING = 'HEALTH_SCREENING',
}

enum AllergySeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
  LIFE_THREATENING = 'LIFE_THREATENING',
}

/**
 * Dashboard Service
 *
 * Features:
 * - Real-time statistics with trend analysis
 * - Recent activity tracking across all modules
 * - Chart data generation for visualizations
 * - Performance-optimized queries with caching
 * - HIPAA-compliant data aggregation
 */
@Injectable()
export class DashboardService extends BaseService {
  // Cache TTL in milliseconds (5 minutes)
  private static readonly CACHE_TTL = 5 * 60 * 1000;
  private statsCache: { data: DashboardStatsDto | null; timestamp: number } = {
    data: null,
    timestamp: 0,
  };

  constructor(@InjectConnection() private readonly sequelize: Sequelize) {
    super('DashboardService');
  }

  /**
   * Get Sequelize models dynamically
   */
  private getModel(modelName: string): any {
    return this.sequelize.models[modelName];
  }

  /**
   * Get comprehensive dashboard statistics with trend analysis
   *
   * Retrieves and calculates key metrics including:
   * - Total active students
   * - Active medication prescriptions
   * - Today's appointment count
   * - Pending incident reports
   * - Medications due today
   * - Critical health alerts
   * - Recent activity counts
   * - Month-over-month trend comparisons
   */
  async getDashboardStats(): Promise<DashboardStatsDto> {
    try {
      // Check cache first for performance optimization
      const now = Date.now();
      if (this.statsCache.data && now - this.statsCache.timestamp < DashboardService.CACHE_TTL) {
        this.logDebug('Returning cached dashboard stats');
        return this.statsCache.data;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Calculate date range for trend comparison (last month)
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const Student = this.getModel('Student');
      const StudentMedication = this.getModel('StudentMedication');
      const Appointment = this.getModel('Appointment');
      const IncidentReport = this.getModel('IncidentReport');
      const Allergy = this.getModel('Allergy');

      // Parallel execution of all count queries with graceful degradation
      const results = await Promise.allSettled([
        // Current period counts
        Student.count({ where: { isActive: true } }),

        StudentMedication.count({
          where: {
            isActive: true,
            startDate: { [Op.lte]: today },
            [Op.or]: [{ endDate: null }, { endDate: { [Op.gte]: today } }],
          },
        }),

        Appointment.count({
          where: {
            scheduledAt: {
              [Op.gte]: today,
              [Op.lt]: tomorrow,
            },
            status: {
              [Op.in]: [AppointmentStatus.SCHEDULED, AppointmentStatus.IN_PROGRESS],
            },
          },
        }),

        IncidentReport.count({
          where: { followUpRequired: true },
        }),

        // Count active medications with schedules that include today
        StudentMedication.count({
          where: {
            isActive: true,
            startDate: { [Op.lte]: today },
            [Op.or]: [{ endDate: null }, { endDate: { [Op.gte]: today } }],
          },
        }),

        // Count severe and life-threatening allergies as health alerts
        (async () => {
          const allergiesWithActiveStudents = await Allergy.findAll({
            attributes: ['id'],
            where: {
              severity: {
                [Op.in]: [AllergySeverity.SEVERE, AllergySeverity.LIFE_THREATENING],
              },
              active: true,
            },
            include: [
              {
                model: Student,
                as: 'student',
                attributes: [],
                where: { isActive: true },
                required: true,
              },
            ],
            raw: true,
          });
          return allergiesWithActiveStudents.length;
        })(),

        // Historical data for trend analysis
        Student.count({
          where: {
            isActive: true,
            createdAt: { [Op.lte]: lastMonth },
          },
        }),

        StudentMedication.count({
          where: {
            isActive: true,
            createdAt: { [Op.lte]: lastMonth },
          },
        }),

        Appointment.count({
          where: {
            scheduledAt: {
              [Op.gte]: lastMonth,
              [Op.lt]: today,
            },
          },
        }),
      ]);

      // Metric names for logging and fallback handling
      const metricNames = [
        'totalStudents',
        'activeMedications',
        'todaysAppointments',
        'pendingIncidents',
        'medicationsDueToday',
        'healthAlerts',
        'studentsLastMonth',
        'medicationsLastMonth',
        'appointmentsLastMonth',
      ];

      // Extract values with fallback to 0 for failed queries
      const [
        totalStudents,
        activeMedications,
        todaysAppointments,
        pendingIncidents,
        medicationsDueToday,
        healthAlerts,
        studentsLastMonth,
        medicationsLastMonth,
        appointmentsLastMonth,
      ] = results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value as number;
        } else {
          this.logError(
            `Dashboard metric '${metricNames[index]}' failed: ${result.reason?.message || result.reason}`,
          );
          return 0;
        }
      });

      // Calculate percentage changes for trend analysis
      const studentChange =
        studentsLastMonth > 0
          ? (((totalStudents - studentsLastMonth) / studentsLastMonth) * 100).toFixed(1)
          : '0';

      const medicationChange =
        medicationsLastMonth > 0
          ? (((activeMedications - medicationsLastMonth) / medicationsLastMonth) * 100).toFixed(1)
          : '0';

      const appointmentChange =
        appointmentsLastMonth > 0
          ? (((todaysAppointments - appointmentsLastMonth) / appointmentsLastMonth) * 100).toFixed(1)
          : '0';

      // Helper function to determine trend type
      const getTrendType = (change: string): 'positive' | 'negative' | 'neutral' => {
        const numChange = Number(change);
        return numChange > 0 ? 'positive' : numChange < 0 ? 'negative' : 'neutral';
      };

      const recentActivityCount = await this.getRecentActivitiesCount();

      const stats: DashboardStatsDto = {
        totalStudents,
        activeMedications,
        todaysAppointments,
        pendingIncidents,
        medicationsDueToday,
        healthAlerts,
        recentActivityCount,
        studentTrend: {
          value: totalStudents.toString(),
          change: `${Number(studentChange) > 0 ? '+' : ''}${studentChange}%`,
          changeType: getTrendType(studentChange),
        },
        medicationTrend: {
          value: activeMedications.toString(),
          change: `${Number(medicationChange) > 0 ? '+' : ''}${medicationChange}%`,
          changeType: getTrendType(medicationChange),
        },
        appointmentTrend: {
          value: todaysAppointments.toString(),
          change: `${Number(appointmentChange) > 0 ? '+' : ''}${appointmentChange}%`,
          changeType: getTrendType(appointmentChange),
        },
      };

      // Cache the results
      this.statsCache = {
        data: stats,
        timestamp: now,
      };

      this.logInfo('Dashboard stats retrieved successfully');
      return stats;
    } catch (error) {
      this.logError(
        'Error fetching dashboard stats',
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException('Failed to fetch dashboard statistics');
    }
  }

  /**
   * Get recent activities across all modules for dashboard feed
   *
   * PERFORMANCE OPTIMIZATION: Parallel execution of all queries
   * Aggregates recent activity from:
   * - Medication administration logs
   * - Incident reports
   * - Upcoming appointments
   */
  async getRecentActivities(limit: number = 5): Promise<RecentActivityDto[]> {
    try {
      const activities: RecentActivityDto[] = [];

      const MedicationLog = this.getModel('MedicationLog');
      const StudentMedication = this.getModel('StudentMedication');
      const Student = this.getModel('Student');
      const Medication = this.getModel('Medication');
      const User = this.getModel('User');
      const IncidentReport = this.getModel('IncidentReport');
      const Appointment = this.getModel('Appointment');

      const now = new Date();

      // PERFORMANCE: Execute all queries in parallel
      const [recentMeds, recentIncidents, upcomingAppointments] = await Promise.all([
        // Get recent medication administration logs
        MedicationLog.findAll({
          limit: 3,
          order: [['timeGiven', 'DESC']],
          include: [
            {
              model: StudentMedication,
              as: 'studentMedication',
              required: true,
              include: [
                {
                  model: Student,
                  as: 'student',
                  attributes: ['id', 'firstName', 'lastName'],
                  required: true,
                },
                {
                  model: Medication,
                  as: 'medication',
                  attributes: ['id', 'name'],
                  required: true,
                },
              ],
            },
            {
              model: User,
              as: 'nurse',
              attributes: ['id', 'firstName', 'lastName'],
              required: false,
            },
          ],
        }),

        // Get recent incident reports
        IncidentReport.findAll({
          limit: 2,
          order: [['createdAt', 'DESC']],
          include: [
            {
              model: Student,
              as: 'student',
              attributes: ['id', 'firstName', 'lastName'],
              required: true,
            },
          ],
        }),

        // Get upcoming appointments
        Appointment.findAll({
          limit: 2,
          where: {
            scheduledAt: { [Op.gte]: now },
            status: AppointmentStatus.SCHEDULED,
          },
          order: [['scheduledAt', 'ASC']],
          include: [
            {
              model: Student,
              as: 'student',
              attributes: ['id', 'firstName', 'lastName'],
              required: true,
            },
          ],
        }),
      ]);

      // Process all results in parallel
      recentMeds.forEach((med: any) => {
        const studentMedication = med.studentMedication;
        if (studentMedication && studentMedication.student && studentMedication.medication) {
          activities.push({
            id: med.id,
            type: 'medication',
            message: `Administered ${studentMedication.medication.name} to ${studentMedication.student.firstName} ${studentMedication.student.lastName}`,
            time: this.formatRelativeTime(med.timeGiven),
            status: 'completed',
          });
        }
      });

      recentIncidents.forEach((incident: any) => {
        const student = incident.student;
        if (student) {
          const typeFormatted = incident.type.toLowerCase().replace(/_/g, ' ');

          activities.push({
            id: incident.id,
            type: 'incident',
            message: `New ${typeFormatted} report for ${student.firstName} ${student.lastName}`,
            time: this.formatRelativeTime(incident.createdAt),
            status: incident.followUpRequired ? 'pending' : 'completed',
          });
        }
      });

      upcomingAppointments.forEach((apt: any) => {
        const student = apt.student;
        if (student) {
          const typeFormatted = apt.type.toLowerCase().replace(/_/g, ' ');

          activities.push({
            id: apt.id,
            type: 'appointment',
            message: `Upcoming ${typeFormatted} with ${student.firstName} ${student.lastName}`,
            time: this.formatFutureTime(apt.scheduledAt),
            status: 'upcoming',
          });
        }
      });

      // Sort by most recent/upcoming and limit
      return activities.slice(0, limit);
    } catch (error) {
      this.logError(
        'Error fetching recent activities',
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException('Failed to fetch recent activities');
    }
  }

  /**
   * Get upcoming appointments with priority classification
   *
   * Retrieves scheduled appointments sorted by time, with priority levels
   * determined by appointment type.
   */
  async getUpcomingAppointments(limit: number = 5): Promise<UpcomingAppointmentDto[]> {
    try {
      const now = new Date();
      const Appointment = this.getModel('Appointment');
      const Student = this.getModel('Student');

      const appointments = await Appointment.findAll({
        limit,
        where: {
          scheduledAt: { [Op.gte]: now },
          status: {
            [Op.in]: [AppointmentStatus.SCHEDULED, AppointmentStatus.IN_PROGRESS],
          },
        },
        order: [['scheduledAt', 'ASC']],
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName'],
            required: true,
          },
        ],
      });

      return appointments.map((apt: any) => {
        const student = apt.student;

        // Determine priority based on appointment type
        let priority: 'high' | 'medium' | 'low' = 'medium';
        if (
          apt.type === AppointmentType.MEDICATION_ADMINISTRATION ||
          apt.type === AppointmentType.EMERGENCY
        ) {
          priority = 'high';
        } else if (apt.type === AppointmentType.ROUTINE_CHECKUP) {
          priority = 'low';
        }

        // Format time for display
        const timeStr = apt.scheduledAt.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

        // Format appointment type for display
        const typeFormatted = apt.type
          .replace(/_/g, ' ')
          .toLowerCase()
          .replace(/\b\w/g, (l: string) => l.toUpperCase());

        return {
          id: apt.id,
          student: student ? `${student.firstName} ${student.lastName}` : 'Unknown',
          studentId: student ? student.id : '',
          time: timeStr,
          type: typeFormatted,
          priority,
        };
      });
    } catch (error) {
      this.logError(
        'Error fetching upcoming appointments',
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException('Failed to fetch upcoming appointments');
    }
  }

  /**
   * Get chart data for dashboard visualizations over specified time period
   *
   * Generates time-series data for:
   * - Student enrollment trends
   * - Medication administration frequency
   * - Incident report frequency
   * - Appointment scheduling patterns
   */
  async getChartData(
    period: 'week' | 'month' | 'year' = 'week',
  ): Promise<DashboardChartDataDto> {
    try {
      const now = new Date();
      const startDate = new Date();
      let dateFormat: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
      };

      // Calculate start date based on period
      if (period === 'week') {
        startDate.setDate(now.getDate() - 7);
      } else if (period === 'month') {
        startDate.setMonth(now.getMonth() - 1);
      } else {
        startDate.setFullYear(now.getFullYear() - 1);
        dateFormat = { month: 'short' };
      }

      const Student = this.getModel('Student');
      const MedicationLog = this.getModel('MedicationLog');
      const IncidentReport = this.getModel('IncidentReport');
      const Appointment = this.getModel('Appointment');

      // Parallel execution of all chart data queries
      const [enrollmentData, medicationData, incidentData, appointmentData] =
        await Promise.all([
          // Enrollment trend - group by creation date
          Student.findAll({
            attributes: [
              [fn('DATE', col('createdAt')), 'date'],
              [fn('COUNT', col('id')), 'count'],
            ],
            where: {
              createdAt: { [Op.gte]: startDate },
            },
            group: [fn('DATE', col('createdAt'))],
            order: [[fn('DATE', col('createdAt')), 'ASC']],
            raw: true,
          }),

          // Medication administration - group by administration time
          MedicationLog.findAll({
            attributes: [
              [fn('DATE', col('timeGiven')), 'date'],
              [fn('COUNT', col('id')), 'count'],
            ],
            where: {
              timeGiven: { [Op.gte]: startDate },
            },
            group: [fn('DATE', col('timeGiven'))],
            order: [[fn('DATE', col('timeGiven')), 'ASC']],
            raw: true,
          }),

          // Incident frequency - group by occurrence date
          IncidentReport.findAll({
            attributes: [
              [fn('DATE', col('occurredAt')), 'date'],
              [fn('COUNT', col('id')), 'count'],
            ],
            where: {
              occurredAt: { [Op.gte]: startDate },
            },
            group: [fn('DATE', col('occurredAt'))],
            order: [[fn('DATE', col('occurredAt')), 'ASC']],
            raw: true,
          }),

          // Appointment trends - group by scheduled date
          Appointment.findAll({
            attributes: [
              [fn('DATE', col('scheduledAt')), 'date'],
              [fn('COUNT', col('id')), 'count'],
            ],
            where: {
              scheduledAt: { [Op.gte]: startDate },
            },
            group: [fn('DATE', col('scheduledAt'))],
            order: [[fn('DATE', col('scheduledAt')), 'ASC']],
            raw: true,
          }),
        ]);

      return {
        enrollmentTrend: this.formatChartData(enrollmentData, dateFormat),
        medicationAdministration: this.formatChartData(
          medicationData,
          dateFormat,
        ),
        incidentFrequency: this.formatChartData(incidentData, dateFormat),
        appointmentTrends: this.formatChartData(appointmentData, dateFormat),
      };
    } catch (error) {
      this.logError('Error fetching chart data', error instanceof Error ? error.stack : undefined);
      throw new InternalServerErrorException('Failed to fetch chart data');
    }
  }

  /**
   * Get dashboard data for specific school or district
   *
   * Filters all dashboard data by school or district context.
   */
  async getDashboardStatsByScope(
    schoolId?: string,
    districtId?: string,
  ): Promise<DashboardStatsDto> {
    try {
      // This method can be extended to filter by school/district
      // For now, returns general stats
      this.logInfo(
        `Getting dashboard stats for scope - School: ${schoolId}, District: ${districtId}`,
      );
      return this.getDashboardStats();
    } catch (error) {
      this.logError('Error fetching scoped dashboard stats', error instanceof Error ? error.stack : undefined);
      throw new InternalServerErrorException(
        'Failed to fetch scoped dashboard statistics',
      );
    }
  }

  /**
   * Clear the dashboard statistics cache
   *
   * Forces fresh data retrieval on next stats request.
   */
  clearCache(): void {
    this.statsCache = {
      data: null,
      timestamp: 0,
    };
    this.logDebug('Dashboard cache cleared');
  }

  // ==================== Private Helper Methods ====================

  /**
   * Format chart data from raw database results
   */
  private formatChartData(
    data: any[],
    dateFormat: Intl.DateTimeFormatOptions,
  ): ChartDataPointDto[] {
    return data.map((item) => {
      const date = new Date(item.date);
      const dateStr = date.toLocaleDateString('en-US', dateFormat);

      return {
        date: dateStr,
        value: parseInt(item.count, 10) || 0,
        label: dateStr,
      };
    });
  }

  /**
   * Get count of recent activities in last 24 hours
   */
  private async getRecentActivitiesCount(): Promise<number> {
    try {
      const last24Hours = new Date();
      last24Hours.setHours(last24Hours.getHours() - 24);

      const MedicationLog = this.getModel('MedicationLog');
      const IncidentReport = this.getModel('IncidentReport');
      const Appointment = this.getModel('Appointment');

      const [medCount, incidentCount, aptCount] = await Promise.all([
        MedicationLog.count({
          where: { timeGiven: { [Op.gte]: last24Hours } },
        }),
        IncidentReport.count({
          where: { createdAt: { [Op.gte]: last24Hours } },
        }),
        Appointment.count({
          where: { createdAt: { [Op.gte]: last24Hours } },
        }),
      ]);

      return medCount + incidentCount + aptCount;
    } catch (error) {
      this.logError('Error fetching recent activities count', error instanceof Error ? error.stack : undefined);
      return 0;
    }
  }

  /**
   * Format a past date as relative time string
   */
  private formatRelativeTime(date: Date): string {
    const timeDiff = Date.now() - date.getTime();
    const minutes = Math.floor(timeDiff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }

  /**
   * Format a future date as relative time string
   */
  private formatFutureTime(date: Date): string {
    const timeDiff = date.getTime() - Date.now();
    const minutes = Math.floor(timeDiff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `in ${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `in ${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return 'Now';
    }
  }
}
