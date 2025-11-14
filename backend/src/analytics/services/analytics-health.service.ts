import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Appointment, HealthRecord, MedicationLog } from '@/database';
import { HealthTrendAnalyticsService } from './health-trend-analytics.service';
import { TimePeriod } from '../enums/time-period.enum';
import { GetHealthMetricsQueryDto } from '../dto/health-metrics.dto';
import { GetHealthTrendsQueryDto } from '../dto/analytics-query.dto';
import { GetStudentHealthMetricsQueryDto } from '../dto/health-metrics.dto';
import { GetSchoolMetricsQueryDto } from '../dto/health-metrics.dto';

import { BaseService } from '@/common/base';
type MedicationStatus = 'PENDING' | 'ADMINISTERED' | 'MISSED' | 'REFUSED';
type AppointmentStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
type DatePeriod = { startDate: Date; endDate: Date };
type VitalSigns = { bloodPressure?: string; heartRate?: number; temperature?: number; weight?: number; height?: number };
type HealthVisitsByType = Record<string, number>;

/**
 * Analytics Health Service
 * Handles health metrics and trend orchestration
 *
 * Responsibilities:
 * - Aggregate health metrics across time periods
 * - Analyze health trends and conditions
 * - Generate student-specific health metrics
 * - Provide school-wide health summaries
 */
@Injectable()
export class AnalyticsHealthService extends BaseService {
  constructor(
    private readonly healthTrendService: HealthTrendAnalyticsService,
    @InjectModel(HealthRecord)
    private readonly healthRecordModel: typeof HealthRecord,
    @InjectModel(Appointment)
    private readonly appointmentModel: typeof Appointment,
    @InjectModel(MedicationLog)
    private readonly medicationLogModel: typeof MedicationLog,
  ) {
    super("AnalyticsHealthService");
  }

  /**
   * Get aggregated health metrics
   */
  async getHealthMetrics(query: GetHealthMetricsQueryDto) {
    try {
      const start = query.startDate;
      const end = query.endDate;
      const daysDiff = Math.floor(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
      );

      // Determine time period based on date range
      let period: TimePeriod = TimePeriod.LAST_30_DAYS;
      if (daysDiff <= 7) period = TimePeriod.LAST_7_DAYS;
      else if (daysDiff <= 30) period = TimePeriod.LAST_30_DAYS;
      else if (daysDiff <= 90) period = TimePeriod.LAST_90_DAYS;
      else if (daysDiff <= 180) period = TimePeriod.LAST_6_MONTHS;
      else period = TimePeriod.LAST_YEAR;

      const schoolId = query.schoolId || query.districtId || 'default-school';
      const metrics = await this.healthTrendService.getHealthMetrics(
        schoolId,
        period,
      );

      // Calculate comparison data if requested
      let comparisonData: {
        periodLabel: string;
        startDate: Date;
        endDate: Date;
      } | null = null;
      if (query.compareWithPrevious) {
        const previousStart = new Date(start);
        previousStart.setDate(previousStart.getDate() - daysDiff);
        const previousEnd = new Date(end);
        previousEnd.setDate(previousEnd.getDate() - daysDiff);

        comparisonData = {
          periodLabel: 'Previous Period',
          startDate: previousStart,
          endDate: previousEnd,
        };
      }

      return {
        metrics,
        period: { startDate: start, endDate: end },
        aggregationLevel: query.aggregationLevel || 'SCHOOL',
        comparisonData,
      };
    } catch (error) {
      this.logError('Error getting health metrics', error);
      throw error;
    }
  }

  /**
   * Get health trend analysis
   */
  async getHealthTrends(query: GetHealthTrendsQueryDto) {
    try {
      const start = query.startDate;
      const end = query.endDate;

      // Map time period to service enum
      let period: TimePeriod = TimePeriod.LAST_90_DAYS;
      switch (query.timePeriod) {
        case 'DAILY':
          period = TimePeriod.LAST_7_DAYS;
          break;
        case 'WEEKLY':
          period = TimePeriod.LAST_30_DAYS;
          break;
        case 'MONTHLY':
          period = TimePeriod.LAST_90_DAYS;
          break;
        case 'QUARTERLY':
          period = TimePeriod.LAST_6_MONTHS;
          break;
        case 'YEARLY':
          period = TimePeriod.LAST_YEAR;
          break;
      }

      const schoolId = query.schoolId || query.districtId || 'default-school';

      const conditionTrends = await this.healthTrendService.getConditionTrends(
        schoolId,
        query.metrics,
        period,
      );

      const medicationTrends =
        await this.healthTrendService.getMedicationTrends(schoolId, period);

      return {
        healthConditionTrends: conditionTrends,
        medicationTrends,
        period: { startDate: start, endDate: end },
        timePeriod: query.timePeriod || 'MONTHLY',
        forecastingEnabled: query.includeForecasting || false,
      };
    } catch (error) {
      this.logError('Error getting health trends', error);
      throw error;
    }
  }

  /**
   * Get student-specific health trends
   * Integrates with health records, medication logs, and appointments for comprehensive metrics
   */
  async getStudentHealthMetrics(studentId: string, query: GetStudentHealthMetricsQueryDto) {
    try {
      const startDate =
        query.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = query.endDate || new Date();

      // Query health records for the student
      const healthRecords = await this.healthRecordModel.findAll({
        where: {
          studentId,
          recordDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        order: [['recordDate', 'DESC']],
        limit: 100,
      });

      // Query medication logs
      const medicationLogs = await this.medicationLogModel.findAll({
        where: {
          studentId,
          administeredAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        order: [['administeredAt', 'DESC']],
        limit: 100,
      });

      // Query appointments
      const appointments = await this.appointmentModel.findAll({
        where: {
          studentId,
          scheduledAt: {
            [Op.between]: [startDate, endDate],
          },
        },
        order: [['scheduledAt', 'DESC']],
        limit: 50,
      });

      // Calculate medication adherence
      const scheduledMedications = medicationLogs.length;
      const medLogs = medicationLogs as unknown as Array<{ status: MedicationStatus }>;
      const administeredMedications = medLogs.filter((log) => log.status === 'ADMINISTERED').length;
      const adherenceRate = scheduledMedications > 0
        ? Math.round((administeredMedications / scheduledMedications) * 100) : 100;

      // Extract vital signs from health records
      const vitalSignsRecords = healthRecords
        .filter((record) => record.recordType === 'VITAL_SIGNS_CHECK' &&
          (record.metadata as { vitalSigns?: VitalSigns })?.vitalSigns)
        .map((record) => ({
          date: record.recordDate,
          ...((record.metadata as { vitalSigns?: VitalSigns })?.vitalSigns || {}),
        }));

      // Group health visits by type
      const healthVisitsByType = healthRecords.reduce((acc: HealthVisitsByType, record) => {
        acc[record.recordType] = (acc[record.recordType] || 0) + 1;
        return acc;
      }, {});

      const apts = appointments as unknown as Array<{ status: AppointmentStatus }>;
      const trends = {
        vitalSigns: vitalSignsRecords,
        healthVisits: healthRecords.map((record) => ({
          id: record.id, type: record.recordType, title: record.title,
          date: record.recordDate, provider: record.provider,
        })),
        healthVisitsByType,
        medicationAdherence: {
          rate: adherenceRate, scheduled: scheduledMedications,
          administered: administeredMedications, missedDoses: scheduledMedications - administeredMedications,
        },
        appointments: {
          total: appointments.length,
          completed: apts.filter((apt) => apt.status === 'COMPLETED').length,
          upcoming: apts.filter((apt) => apt.status === 'SCHEDULED').length,
          cancelled: apts.filter((apt) => apt.status === 'CANCELLED').length,
        },
      };

      this.logInfo(
        `Student health metrics retrieved: ${studentId} (${healthRecords.length} health records, ${medicationLogs.length} medication logs, ${appointments.length} appointments)`,
      );

      return {
        studentId,
        trends,
        period: { startDate, endDate },
        includesHistoricalData: query.includeHistory !== false,
      };
    } catch (error) {
      this.logError('Error getting student health metrics', error);
      throw error;
    }
  }

  /**
   * Get school-wide health metrics
   */
  async getSchoolMetrics(schoolId: string, query: GetSchoolMetricsQueryDto) {
    try {
      const start = query.startDate;
      const end = query.endDate;

      const summary = await this.healthTrendService.getPopulationSummary(
        schoolId,
        TimePeriod.CUSTOM,
        {
          start,
          end,
        },
      );

      const immunizationData =
        await this.healthTrendService.getImmunizationDashboard(schoolId);

      const incidentAnalytics =
        await this.healthTrendService.getIncidentAnalytics(
          schoolId,
          TimePeriod.LAST_90_DAYS,
        );

      return {
        schoolId,
        summary,
        immunization: immunizationData,
        incidents: incidentAnalytics,
        period: { startDate: start, endDate: end },
        gradeLevel: query.gradeLevel,
        includesComparisons: query.includeComparisons !== false,
      };
    } catch (error) {
      this.logError('Error getting school metrics', error);
      throw error;
    }
  }
}
