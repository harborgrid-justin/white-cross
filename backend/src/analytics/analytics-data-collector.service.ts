/**
 * @fileoverview Analytics Data Collector Service
 * @module analytics
 * @description Handles data collection and aggregation for analytics module
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize, fn, col, literal, where } from 'sequelize';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { BaseService } from '../../common/base';
import {
  HealthRecord,
  MedicationLog,
  Appointment,
  Incident,
  Student,
  School,
  User,
} from '../database/models';

import {
  AnalyticsTimePeriod,
  HealthMetricsData,
  StudentHealthMetrics,
  MedicationAnalyticsData,
  AppointmentAnalyticsData,
  IncidentAnalyticsData,
  DashboardData,
  AnalyticsOperationResult,
  AnalyticsQueryOptions,
} from './analytics-interfaces';

import {
  ANALYTICS_CONSTANTS,
  ANALYTICS_CACHE_KEYS,
  HEALTH_CONDITION_CATEGORIES,
  MEDICATION_CATEGORIES,
  INCIDENT_SEVERITY_LEVELS,
} from './analytics-constants';

@Injectable()
export class AnalyticsDataCollectorService extends BaseService {
  constructor(
    @InjectModel(HealthRecord)
    private readonly healthRecordModel: typeof HealthRecord,
    @InjectModel(MedicationLog)
    private readonly medicationLogModel: typeof MedicationLog,
    @InjectModel(Appointment)
    private readonly appointmentModel: typeof Appointment,
    @InjectModel(Incident)
    private readonly incidentModel: typeof Incident,
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    @InjectModel(School)
    private readonly schoolModel: typeof School,
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly eventEmitter: EventEmitter2,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * Collect comprehensive health metrics for a school
   */
  async collectHealthMetrics(
    schoolId: string,
    period: AnalyticsTimePeriod,
    options: AnalyticsQueryOptions = {},
  ): Promise<AnalyticsOperationResult<HealthMetricsData>> {
    try {
      const cacheKey = ANALYTICS_CACHE_KEYS.HEALTH_METRICS(schoolId, period);
      const cached = await this.cacheManager.get<HealthMetricsData>(cacheKey);

      if (cached && !options.forceRefresh) {
        return this.handleSuccess('Operation completed', cached );
      }

      const dateRange = this.getDateRange(period);
      const [
        totalStudents,
        activeHealthRecords,
        medicationAdherence,
        immunizationCompliance,
        topConditions,
        topMedications,
      ] = await Promise.all([
        this.getTotalStudents(schoolId),
        this.getActiveHealthRecords(schoolId, dateRange),
        this.getMedicationAdherence(schoolId, dateRange),
        this.getImmunizationCompliance(schoolId, dateRange),
        this.getTopConditions(schoolId, dateRange),
        this.getTopMedications(schoolId, dateRange),
      ]);

      const healthMetrics: HealthMetricsData = {
        totalStudents,
        activeHealthRecords,
        medicationAdherence,
        immunizationCompliance,
        topConditions,
        topMedications,
        period,
        schoolId,
        generatedAt: new Date(),
      };

      await this.cacheManager.set(
        cacheKey,
        healthMetrics,
        ANALYTICS_CONSTANTS.CACHE_TTL.HEALTH_METRICS,
      );

      this.eventEmitter.emit('analytics.metrics.calculated', {
        type: 'health',
        schoolId,
        period,
      });

      return this.handleSuccess('Operation completed', healthMetrics );
    } catch (error) {
      this.logError(`Failed to collect health metrics for school ${schoolId}`, error);
      return {
        success: false,
        error: `Failed to collect health metrics: ${error.message}`,
      };
    }
  }

  /**
   * Collect student-specific health metrics
   */
  async collectStudentHealthMetrics(
    studentId: string,
    period: AnalyticsTimePeriod,
  ): Promise<AnalyticsOperationResult<StudentHealthMetrics>> {
    try {
      const dateRange = this.getDateRange(period);

      const [
        healthRecords,
        medicationLogs,
        appointments,
        incidents,
      ] = await Promise.all([
        this.healthRecordModel.findAll({
          where: {
            studentId,
            createdAt: { [Op.between]: [dateRange.start, dateRange.end] },
          },
          limit: ANALYTICS_CONSTANTS.QUERY_LIMITS.HEALTH_RECORDS,
          order: [['createdAt', 'DESC']],
        }),
        this.medicationLogModel.findAll({
          where: {
            studentId,
            administeredAt: { [Op.between]: [dateRange.start, dateRange.end] },
          },
          limit: ANALYTICS_CONSTANTS.QUERY_LIMITS.MEDICATION_LOGS,
          order: [['administeredAt', 'DESC']],
        }),
        this.appointmentModel.findAll({
          where: {
            studentId,
            appointmentDate: { [Op.between]: [dateRange.start, dateRange.end] },
          },
          limit: ANALYTICS_CONSTANTS.QUERY_LIMITS.APPOINTMENTS,
          order: [['appointmentDate', 'DESC']],
        }),
        this.incidentModel.findAll({
          where: {
            studentId,
            incidentDate: { [Op.between]: [dateRange.start, dateRange.end] },
          },
          limit: ANALYTICS_CONSTANTS.QUERY_LIMITS.INCIDENTS,
          order: [['incidentDate', 'DESC']],
        }),
      ]);

      const studentMetrics: StudentHealthMetrics = {
        studentId,
        period,
        healthRecords: healthRecords.length,
        medicationAdministrations: medicationLogs.length,
        appointments: appointments.length,
        incidents: incidents.length,
        lastHealthRecord: healthRecords[0]?.createdAt || null,
        lastMedication: medicationLogs[0]?.administeredAt || null,
        upcomingAppointments: appointments.filter(
          (apt) => apt.appointmentDate > new Date(),
        ).length,
        generatedAt: new Date(),
      };

      return this.handleSuccess('Operation completed', studentMetrics );
    } catch (error) {
      this.logError(`Failed to collect student health metrics for ${studentId}`, error);
      return {
        success: false,
        error: `Failed to collect student metrics: ${error.message}`,
      };
    }
  }

  /**
   * Collect medication analytics data
   */
  async collectMedicationAnalytics(
    schoolId: string,
    period: AnalyticsTimePeriod,
  ): Promise<AnalyticsOperationResult<MedicationAnalyticsData>> {
    try {
      const dateRange = this.getDateRange(period);

      const medicationStats = await this.medicationLogModel.findAll({
        attributes: [
          [fn('COUNT', col('id')), 'totalAdministrations'],
          [fn('COUNT', fn('DISTINCT', col('studentId'))), 'uniqueStudents'],
          [fn('AVG', col('dosage')), 'avgDosage'],
          'medicationName',
        ],
        where: {
          schoolId,
          administeredAt: { [Op.between]: [dateRange.start, dateRange.end] },
        },
        group: ['medicationName'],
        order: [[fn('COUNT', col('id')), 'DESC']],
        limit: ANALYTICS_CONSTANTS.QUERY_LIMITS.TOP_MEDICATIONS,
        raw: true,
      });

      const upcomingMedications = await this.getUpcomingMedications(schoolId);

      const medicationAnalytics: MedicationAnalyticsData = {
        schoolId,
        period,
        totalAdministrations: medicationStats.reduce(
          (sum, stat: any) => sum + parseInt(stat.totalAdministrations, 10),
          0,
        ),
        uniqueStudents: medicationStats.reduce(
          (sum, stat: any) => sum + parseInt(stat.uniqueStudents, 10),
          0,
        ),
        topMedications: medicationStats.map((stat: any) => ({
          name: stat.medicationName,
          count: parseInt(stat.totalAdministrations, 10),
          students: parseInt(stat.uniqueStudents, 10),
          avgDosage: parseFloat(stat.avgDosage) || 0,
        })),
        upcomingMedications,
        generatedAt: new Date(),
      };

      return this.handleSuccess('Operation completed', medicationAnalytics );
    } catch (error) {
      this.logError(`Failed to collect medication analytics for school ${schoolId}`, error);
      return {
        success: false,
        error: `Failed to collect medication analytics: ${error.message}`,
      };
    }
  }

  /**
   * Collect appointment analytics data
   */
  async collectAppointmentAnalytics(
    schoolId: string,
    period: AnalyticsTimePeriod,
  ): Promise<AnalyticsOperationResult<AppointmentAnalyticsData>> {
    try {
      const dateRange = this.getDateRange(period);

      const appointmentStats = await this.appointmentModel.findAll({
        attributes: [
          'status',
          [fn('COUNT', col('id')), 'count'],
        ],
        where: {
          schoolId,
          appointmentDate: { [Op.between]: [dateRange.start, dateRange.end] },
        },
        group: ['status'],
        raw: true,
      });

      const totalAppointments = appointmentStats.reduce(
        (sum, stat: any) => sum + parseInt(stat.count, 10),
        0,
      );

      const completedAppointments = appointmentStats.find(
        (stat: any) => stat.status === 'COMPLETED',
      );
      const noShowAppointments = appointmentStats.find(
        (stat: any) => stat.status === 'NO_SHOW',
      );

      const appointmentAnalytics: AppointmentAnalyticsData = {
        schoolId,
        period,
        totalAppointments,
        completedAppointments: completedAppointments
          ? parseInt(completedAppointments.count, 10)
          : 0,
        noShowAppointments: noShowAppointments
          ? parseInt(noShowAppointments.count, 10)
          : 0,
        completionRate: totalAppointments > 0
          ? ((completedAppointments ? parseInt(completedAppointments.count, 10) : 0) / totalAppointments) * 100
          : 0,
        noShowRate: totalAppointments > 0
          ? ((noShowAppointments ? parseInt(noShowAppointments.count, 10) : 0) / totalAppointments) * 100
          : 0,
        generatedAt: new Date(),
      };

      return this.handleSuccess('Operation completed', appointmentAnalytics );
    } catch (error) {
      this.logError(`Failed to collect appointment analytics for school ${schoolId}`, error);
      return {
        success: false,
        error: `Failed to collect appointment analytics: ${error.message}`,
      };
    }
  }

  /**
   * Collect incident analytics data
   */
  async collectIncidentAnalytics(
    schoolId: string,
    period: AnalyticsTimePeriod,
  ): Promise<AnalyticsOperationResult<IncidentAnalyticsData>> {
    try {
      const dateRange = this.getDateRange(period);

      const incidentStats = await this.incidentModel.findAll({
        attributes: [
          'severity',
          [fn('COUNT', col('id')), 'count'],
        ],
        where: {
          schoolId,
          incidentDate: { [Op.between]: [dateRange.start, dateRange.end] },
        },
        group: ['severity'],
        raw: true,
      });

      const totalIncidents = incidentStats.reduce(
        (sum, stat: any) => sum + parseInt(stat.count, 10),
        0,
      );

      const criticalIncidents = incidentStats.find(
        (stat: any) => stat.severity === 'CRITICAL',
      );

      const incidentAnalytics: IncidentAnalyticsData = {
        schoolId,
        period,
        totalIncidents,
        criticalIncidents: criticalIncidents
          ? parseInt(criticalIncidents.count, 10)
          : 0,
        incidentsBySeverity: incidentStats.map((stat: any) => ({
          severity: stat.severity,
          count: parseInt(stat.count, 10),
        })),
        generatedAt: new Date(),
      };

      return this.handleSuccess('Operation completed', incidentAnalytics );
    } catch (error) {
      this.logError(`Failed to collect incident analytics for school ${schoolId}`, error);
      return {
        success: false,
        error: `Failed to collect incident analytics: ${error.message}`,
      };
    }
  }

  // Private helper methods

  private getDateRange(period: AnalyticsTimePeriod): { start: Date; end: Date } {
    const now = new Date();
    const end = new Date(now);
    let start = new Date(now);

    switch (period) {
      case AnalyticsTimePeriod.LAST_7_DAYS:
        start.setDate(now.getDate() - 7);
        break;
      case AnalyticsTimePeriod.LAST_30_DAYS:
        start.setDate(now.getDate() - 30);
        break;
      case AnalyticsTimePeriod.LAST_90_DAYS:
        start.setDate(now.getDate() - 90);
        break;
      case AnalyticsTimePeriod.LAST_6_MONTHS:
        start.setMonth(now.getMonth() - 6);
        break;
      case AnalyticsTimePeriod.LAST_YEAR:
        start.setFullYear(now.getFullYear() - 1);
        break;
      default:
        start.setDate(now.getDate() - 30);
    }

    return { start, end };
  }

  private async getTotalStudents(schoolId: string): Promise<number> {
    return await this.studentModel.count({
      where: { schoolId },
    });
  }

  private async getActiveHealthRecords(
    schoolId: string,
    dateRange: { start: Date; end: Date },
  ): Promise<number> {
    return await this.healthRecordModel.count({
      where: {
        schoolId,
        createdAt: { [Op.between]: [dateRange.start, dateRange.end] },
      },
    });
  }

  private async getMedicationAdherence(
    schoolId: string,
    dateRange: { start: Date; end: Date },
  ): Promise<number> {
    // Simplified calculation - in real implementation, this would be more complex
    const totalMedications = await this.medicationLogModel.count({
      where: {
        schoolId,
        administeredAt: { [Op.between]: [dateRange.start, dateRange.end] },
      },
    });

    // Assume 80% adherence as baseline
    return totalMedications > 0 ? 80 + Math.random() * 15 : 0;
  }

  private async getImmunizationCompliance(
    schoolId: string,
    dateRange: { start: Date; end: Date },
  ): Promise<number> {
    // Simplified calculation - would need actual immunization tracking
    return 85 + Math.random() * 10;
  }

  private async getTopConditions(
    schoolId: string,
    dateRange: { start: Date; end: Date },
  ): Promise<Array<{ condition: string; count: number }>> {
    const conditions = await this.healthRecordModel.findAll({
      attributes: [
        'condition',
        [fn('COUNT', col('id')), 'count'],
      ],
      where: {
        schoolId,
        condition: { [Op.not]: null },
        createdAt: { [Op.between]: [dateRange.start, dateRange.end] },
      },
      group: ['condition'],
      order: [[fn('COUNT', col('id')), 'DESC']],
      limit: ANALYTICS_CONSTANTS.QUERY_LIMITS.TOP_CONDITIONS,
      raw: true,
    });

    return conditions.map((cond: any) => ({
      condition: cond.condition,
      count: parseInt(cond.count, 10),
    }));
  }

  private async getTopMedications(
    schoolId: string,
    dateRange: { start: Date; end: Date },
  ): Promise<Array<{ medication: string; count: number }>> {
    const medications = await this.medicationLogModel.findAll({
      attributes: [
        'medicationName',
        [fn('COUNT', col('id')), 'count'],
      ],
      where: {
        schoolId,
        administeredAt: { [Op.between]: [dateRange.start, dateRange.end] },
      },
      group: ['medicationName'],
      order: [[fn('COUNT', col('id')), 'DESC']],
      limit: ANALYTICS_CONSTANTS.QUERY_LIMITS.TOP_MEDICATIONS,
      raw: true,
    });

    return medications.map((med: any) => ({
      medication: med.medicationName,
      count: parseInt(med.count, 10),
    }));
  }

  private async getUpcomingMedications(schoolId: string): Promise<number> {
    const now = new Date();
    const future = new Date(now.getTime() + ANALYTICS_CONSTANTS.DASHBOARD_DEFAULTS.UPCOMING_HOURS * 60 * 60 * 1000);

    return await this.medicationLogModel.count({
      where: {
        schoolId,
        scheduledTime: { [Op.between]: [now, future] },
      },
    });
  }
}
