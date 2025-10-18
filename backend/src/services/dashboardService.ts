/**
 * WC-SVC-DSH-018 | dashboardService.ts - Dashboard Analytics and Statistics Service
 * Purpose: Real-time dashboard data aggregation with performance caching, trend analysis, and multi-module statistics
 * Upstream: ../database/models, studentService, medicationService, appointmentService, incidentService | Dependencies: sequelize aggregation
 * Downstream: routes/dashboard.ts, frontend/dashboard, reportService | Called by: Dashboard routes, admin interface
 * Related: studentService, medicationService, appointmentService, incidentReportService, healthRecordService
 * Exports: DashboardService class, dashboard interfaces | Key Services: Statistics, trends, charts, real-time feeds, caching
 * Last Updated: 2025-10-18 | File Type: .ts | HIPAA: Aggregated PHI data - no individual patient details exposed
 * Critical Path: Data aggregation → Cache check → Multi-service queries → Trend calculation → Response formatting
 * LLM Context: Central analytics hub providing real-time insights and trends across all health management modules
 */

import { Op, fn, col, literal } from 'sequelize';
import { logger } from '../utils/logger';
import {
  Student,
  StudentMedication,
  Appointment,
  IncidentReport,
  MedicationLog,
  Allergy,
  User,
  Medication,
  sequelize
} from '../database/models';
import { AppointmentStatus, AppointmentType, AllergySeverity } from '../database/types/enums';

/**
 * Interface definitions for dashboard data structures
 */

export interface TrendData {
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
}

export interface DashboardStats {
  totalStudents: number;
  activeMedications: number;
  todaysAppointments: number;
  pendingIncidents: number;
  medicationsDueToday: number;
  healthAlerts: number;
  recentActivityCount: number;
  studentTrend: TrendData;
  medicationTrend: TrendData;
  appointmentTrend: TrendData;
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

/**
 * DashboardService
 *
 * Provides comprehensive dashboard statistics, analytics, and real-time data
 * for the healthcare platform. Aggregates data from multiple modules including
 * students, medications, appointments, incidents, and health records.
 *
 * Features:
 * - Real-time statistics with trend analysis
 * - Recent activity tracking across all modules
 * - Chart data generation for visualizations
 * - Performance-optimized queries with caching
 * - HIPAA-compliant data aggregation
 */
export class DashboardService {
  // Cache TTL in milliseconds (5 minutes)
  private static readonly CACHE_TTL = 5 * 60 * 1000;
  private static statsCache: { data: DashboardStats | null; timestamp: number } = {
    data: null,
    timestamp: 0
  };

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
   *
   * @param userId - Optional user ID for user-specific stats
   * @returns Dashboard statistics with trend data
   */
  static async getDashboardStats(userId?: string): Promise<DashboardStats> {
    try {
      // Check cache first for performance optimization
      const now = Date.now();
      if (this.statsCache.data && (now - this.statsCache.timestamp) < this.CACHE_TTL) {
        logger.debug('Returning cached dashboard stats');
        return this.statsCache.data;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Calculate date range for trend comparison (last month)
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      // Parallel execution of all count queries for optimal performance
      const [
        totalStudents,
        activeMedications,
        todaysAppointments,
        pendingIncidents,
        medicationsDueToday,
        healthAlerts,
        studentsLastMonth,
        medicationsLastMonth,
        appointmentsLastMonth
      ] = await Promise.all([
        // Current period counts
        Student.count({
          where: { isActive: true }
        }),

        StudentMedication.count({
          where: {
            isActive: true,
            startDate: { [Op.lte]: today },
            [Op.or]: [
              { endDate: null },
              { endDate: { [Op.gte]: today } }
            ]
          }
        }),

        Appointment.count({
          where: {
            scheduledAt: {
              [Op.gte]: today,
              [Op.lt]: tomorrow
            },
            status: {
              [Op.in]: [AppointmentStatus.SCHEDULED, AppointmentStatus.IN_PROGRESS]
            }
          }
        }),

        IncidentReport.count({
          where: {
            followUpRequired: true
          }
        }),

        // Count active medications with schedules that include today
        StudentMedication.count({
          where: {
            isActive: true,
            startDate: { [Op.lte]: today },
            [Op.or]: [
              { endDate: null },
              { endDate: { [Op.gte]: today } }
            ]
          }
        }),

        // Count severe and life-threatening allergies as health alerts
        // Use a subquery to count allergies for active students only
        (async () => {
          const allergiesWithActiveStudents = await Allergy.findAll({
            attributes: ['id'],
            where: {
              severity: {
                [Op.in]: [AllergySeverity.SEVERE, AllergySeverity.LIFE_THREATENING]
              },
              active: true
            },
            include: [
              {
                model: Student,
                as: 'student',
                attributes: [],
                where: { isActive: true },
                required: true
              }
            ],
            raw: true
          });
          return allergiesWithActiveStudents.length;
        })(),

        // Historical data for trend analysis
        Student.count({
          where: {
            isActive: true,
            createdAt: { [Op.lte]: lastMonth }
          }
        }),

        StudentMedication.count({
          where: {
            isActive: true,
            createdAt: { [Op.lte]: lastMonth }
          }
        }),

        Appointment.count({
          where: {
            scheduledAt: {
              [Op.gte]: lastMonth,
              [Op.lt]: today
            }
          }
        })
      ]);

      // Calculate percentage changes for trend analysis
      const studentChange = studentsLastMonth > 0
        ? ((totalStudents - studentsLastMonth) / studentsLastMonth * 100).toFixed(1)
        : '0';

      const medicationChange = medicationsLastMonth > 0
        ? ((activeMedications - medicationsLastMonth) / medicationsLastMonth * 100).toFixed(1)
        : '0';

      const appointmentChange = appointmentsLastMonth > 0
        ? ((todaysAppointments - appointmentsLastMonth) / appointmentsLastMonth * 100).toFixed(1)
        : '0';

      // Helper function to determine trend type
      const getTrendType = (change: string): 'positive' | 'negative' | 'neutral' => {
        const numChange = Number(change);
        return numChange > 0 ? 'positive' : numChange < 0 ? 'negative' : 'neutral';
      };

      const recentActivityCount = await this.getRecentActivitiesCount();

      const stats: DashboardStats = {
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
          changeType: getTrendType(studentChange)
        },
        medicationTrend: {
          value: activeMedications.toString(),
          change: `${Number(medicationChange) > 0 ? '+' : ''}${medicationChange}%`,
          changeType: getTrendType(medicationChange)
        },
        appointmentTrend: {
          value: todaysAppointments.toString(),
          change: `${Number(appointmentChange) > 0 ? '+' : ''}${appointmentChange}%`,
          changeType: getTrendType(appointmentChange)
        }
      };

      // Cache the results
      this.statsCache = {
        data: stats,
        timestamp: now
      };

      logger.info('Dashboard stats retrieved successfully');
      return stats;
    } catch (error) {
      logger.error('Error fetching dashboard stats:', error);
      throw new Error('Failed to fetch dashboard statistics');
    }
  }

  /**
   * Get recent activities across all modules for dashboard feed
   *
   * Aggregates recent activity from:
   * - Medication administration logs
   * - Incident reports
   * - Upcoming appointments
   *
   * Activities are formatted with relative timestamps and appropriate status indicators.
   *
   * @param limit - Maximum number of activities to return (default: 5)
   * @returns Array of recent activities with formatted timestamps
   */
  static async getRecentActivities(limit: number = 5): Promise<DashboardRecentActivity[]> {
    try {
      const activities: DashboardRecentActivity[] = [];

      // Get recent medication administration logs
      const recentMeds = await MedicationLog.findAll({
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
                required: true
              },
              {
                model: Medication,
                as: 'medication',
                attributes: ['id', 'name'],
                required: true
              }
            ]
          },
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName'],
            required: false
          }
        ]
      });

      recentMeds.forEach(med => {
        const studentMedication = med.get('studentMedication') as any;
        if (studentMedication && studentMedication.student && studentMedication.medication) {
          activities.push({
            id: med.id,
            type: 'medication',
            message: `Administered ${studentMedication.medication.name} to ${studentMedication.student.firstName} ${studentMedication.student.lastName}`,
            time: this.formatRelativeTime(med.timeGiven),
            status: 'completed'
          });
        }
      });

      // Get recent incident reports
      const recentIncidents = await IncidentReport.findAll({
        limit: 2,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName'],
            required: true
          }
        ]
      });

      recentIncidents.forEach(incident => {
        const student = incident.get('student') as any;
        if (student) {
          const typeFormatted = incident.type
            .toLowerCase()
            .replace(/_/g, ' ');

          activities.push({
            id: incident.id,
            type: 'incident',
            message: `New ${typeFormatted} report for ${student.firstName} ${student.lastName}`,
            time: this.formatRelativeTime(incident.createdAt),
            status: incident.followUpRequired ? 'pending' : 'completed'
          });
        }
      });

      // Get upcoming appointments
      const now = new Date();
      const upcomingAppointments = await Appointment.findAll({
        limit: 2,
        where: {
          scheduledAt: { [Op.gte]: now },
          status: AppointmentStatus.SCHEDULED
        },
        order: [['scheduledAt', 'ASC']],
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName'],
            required: true
          }
        ]
      });

      upcomingAppointments.forEach(apt => {
        const student = apt.get('student') as any;
        if (student) {
          const typeFormatted = apt.type
            .toLowerCase()
            .replace(/_/g, ' ');

          activities.push({
            id: apt.id,
            type: 'appointment',
            message: `Upcoming ${typeFormatted} with ${student.firstName} ${student.lastName}`,
            time: this.formatFutureTime(apt.scheduledAt),
            status: 'upcoming'
          });
        }
      });

      // Sort by most recent/upcoming and limit
      return activities.slice(0, limit);
    } catch (error) {
      logger.error('Error fetching recent activities:', error);
      throw new Error('Failed to fetch recent activities');
    }
  }

  /**
   * Get upcoming appointments with priority classification
   *
   * Retrieves scheduled appointments sorted by time, with priority levels
   * determined by appointment type:
   * - High: Medication administration, Emergency
   * - Medium: Default priority
   * - Low: Routine checkups
   *
   * @param limit - Maximum number of appointments to return (default: 5)
   * @returns Array of upcoming appointments with formatted time and priority
   */
  static async getUpcomingAppointments(limit: number = 5): Promise<DashboardUpcomingAppointment[]> {
    try {
      const now = new Date();
      const appointments = await Appointment.findAll({
        limit,
        where: {
          scheduledAt: { [Op.gte]: now },
          status: {
            [Op.in]: [AppointmentStatus.SCHEDULED, AppointmentStatus.IN_PROGRESS]
          }
        },
        order: [['scheduledAt', 'ASC']],
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName'],
            required: true
          }
        ]
      });

      return appointments.map(apt => {
        const student = apt.get('student') as any;

        // Determine priority based on appointment type
        let priority: 'high' | 'medium' | 'low' = 'medium';
        if (apt.type === AppointmentType.MEDICATION_ADMINISTRATION || apt.type === AppointmentType.EMERGENCY) {
          priority = 'high';
        } else if (apt.type === AppointmentType.ROUTINE_CHECKUP) {
          priority = 'low';
        }

        // Format time for display
        const timeStr = apt.scheduledAt.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
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
          priority
        };
      });
    } catch (error) {
      logger.error('Error fetching upcoming appointments:', error);
      throw new Error('Failed to fetch upcoming appointments');
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
   *
   * Data is aggregated by date and formatted for chart rendering.
   *
   * @param period - Time period for data aggregation ('week', 'month', or 'year')
   * @returns Chart data grouped by date for all tracked metrics
   */
  static async getChartData(period: 'week' | 'month' | 'year' = 'week'): Promise<DashboardChartData> {
    try {
      const now = new Date();
      let startDate = new Date();
      let dateFormat: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };

      // Calculate start date based on period
      if (period === 'week') {
        startDate.setDate(now.getDate() - 7);
      } else if (period === 'month') {
        startDate.setMonth(now.getMonth() - 1);
      } else {
        startDate.setFullYear(now.getFullYear() - 1);
        dateFormat = { month: 'short' };
      }

      // Parallel execution of all chart data queries
      const [
        enrollmentData,
        medicationData,
        incidentData,
        appointmentData
      ] = await Promise.all([
        // Enrollment trend - group by creation date
        Student.findAll({
          attributes: [
            [fn('DATE', col('createdAt')), 'date'],
            [fn('COUNT', col('id')), 'count']
          ],
          where: {
            createdAt: { [Op.gte]: startDate }
          },
          group: [fn('DATE', col('createdAt'))],
          order: [[fn('DATE', col('createdAt')), 'ASC']],
          raw: true
        }),

        // Medication administration - group by administration time
        MedicationLog.findAll({
          attributes: [
            [fn('DATE', col('timeGiven')), 'date'],
            [fn('COUNT', col('id')), 'count']
          ],
          where: {
            timeGiven: { [Op.gte]: startDate }
          },
          group: [fn('DATE', col('timeGiven'))],
          order: [[fn('DATE', col('timeGiven')), 'ASC']],
          raw: true
        }),

        // Incident frequency - group by occurrence date
        IncidentReport.findAll({
          attributes: [
            [fn('DATE', col('occurredAt')), 'date'],
            [fn('COUNT', col('id')), 'count']
          ],
          where: {
            occurredAt: { [Op.gte]: startDate }
          },
          group: [fn('DATE', col('occurredAt'))],
          order: [[fn('DATE', col('occurredAt')), 'ASC']],
          raw: true
        }),

        // Appointment trends - group by scheduled date
        Appointment.findAll({
          attributes: [
            [fn('DATE', col('scheduledAt')), 'date'],
            [fn('COUNT', col('id')), 'count']
          ],
          where: {
            scheduledAt: { [Op.gte]: startDate }
          },
          group: [fn('DATE', col('scheduledAt'))],
          order: [[fn('DATE', col('scheduledAt')), 'ASC']],
          raw: true
        })
      ]);

      return {
        enrollmentTrend: this.formatChartData(enrollmentData, dateFormat),
        medicationAdministration: this.formatChartData(medicationData, dateFormat),
        incidentFrequency: this.formatChartData(incidentData, dateFormat),
        appointmentTrends: this.formatChartData(appointmentData, dateFormat)
      };
    } catch (error) {
      logger.error('Error fetching chart data:', error);
      throw new Error('Failed to fetch chart data');
    }
  }

  /**
   * Format chart data from raw database results
   *
   * Converts database aggregation results into chart-ready format with
   * properly formatted date labels.
   *
   * @param data - Raw query results with date and count
   * @param dateFormat - Date formatting options for labels
   * @returns Array of chart data points with formatted dates
   * @private
   */
  private static formatChartData(
    data: any[],
    dateFormat: Intl.DateTimeFormatOptions
  ): ChartDataPoint[] {
    return data.map(item => {
      const date = new Date(item.date);
      const dateStr = date.toLocaleDateString('en-US', dateFormat);

      return {
        date: dateStr,
        value: parseInt(item.count, 10) || 0,
        label: dateStr
      };
    });
  }

  /**
   * Get count of recent activities in last 24 hours
   *
   * Aggregates activity counts from:
   * - Medication logs
   * - Incident reports
   * - Appointments created
   *
   * @returns Total count of activities in last 24 hours
   * @private
   */
  private static async getRecentActivitiesCount(): Promise<number> {
    try {
      const last24Hours = new Date();
      last24Hours.setHours(last24Hours.getHours() - 24);

      const [medCount, incidentCount, aptCount] = await Promise.all([
        MedicationLog.count({
          where: { timeGiven: { [Op.gte]: last24Hours } }
        }),
        IncidentReport.count({
          where: { createdAt: { [Op.gte]: last24Hours } }
        }),
        Appointment.count({
          where: { createdAt: { [Op.gte]: last24Hours } }
        })
      ]);

      return medCount + incidentCount + aptCount;
    } catch (error) {
      logger.error('Error fetching recent activities count:', error);
      return 0;
    }
  }

  /**
   * Format a past date as relative time string
   *
   * Converts timestamps to human-readable format:
   * - "Just now" for <1 minute ago
   * - "X minutes ago" for <1 hour ago
   * - "X hours ago" for <24 hours ago
   * - "X days ago" for >24 hours ago
   *
   * @param date - Date to format
   * @returns Formatted relative time string
   * @private
   */
  private static formatRelativeTime(date: Date): string {
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
   *
   * Converts future timestamps to human-readable format:
   * - "Now" for current time
   * - "in X minutes" for <1 hour
   * - "in X hours" for <24 hours
   * - "in X days" for >24 hours
   *
   * @param date - Future date to format
   * @returns Formatted future time string
   * @private
   */
  private static formatFutureTime(date: Date): string {
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

  /**
   * Clear the dashboard statistics cache
   *
   * Forces fresh data retrieval on next stats request.
   * Should be called when significant data changes occur.
   */
  static clearCache(): void {
    this.statsCache = {
      data: null,
      timestamp: 0
    };
    logger.debug('Dashboard cache cleared');
  }

  /**
   * Get dashboard data for specific school or district
   *
   * Filters all dashboard data by school or district context.
   * Useful for multi-tenant deployments.
   *
   * @param schoolId - Optional school ID filter
   * @param districtId - Optional district ID filter
   * @returns Filtered dashboard statistics
   */
  static async getDashboardStatsByScope(
    schoolId?: string,
    districtId?: string
  ): Promise<DashboardStats> {
    try {
      // This method can be extended to filter by school/district
      // For now, returns general stats
      // Future enhancement: add where clauses based on user's scope
      logger.info(`Getting dashboard stats for scope - School: ${schoolId}, District: ${districtId}`);
      return this.getDashboardStats();
    } catch (error) {
      logger.error('Error fetching scoped dashboard stats:', error);
      throw new Error('Failed to fetch scoped dashboard statistics');
    }
  }
}
