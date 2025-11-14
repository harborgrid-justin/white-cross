/**
 * @fileoverview Report Data Collector Service
 * @module analytics/services
 * @description Service for collecting data for analytics reports
 */

import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, fn, col } from 'sequelize';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { BaseService } from '@/common/base';
import {
  AnalyticsReportType,
  AnalyticsTimePeriod,
  HealthMetricsData,
  StudentHealthMetrics,
  MedicationAnalyticsData,
  AppointmentAnalyticsData,
  IncidentAnalyticsData,
  DashboardData,
  ComplianceData,
} from '../analytics-interfaces';
import {
  Student,
  HealthRecord,
  MedicationLog,
  Appointment,
  IncidentReport,
  StudentMedication,
  Vaccination,
} from '@/database/models';

@Injectable()
export class ReportDataCollectorService extends BaseService {
  constructor(
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    @InjectModel(HealthRecord)
    private readonly healthRecordModel: typeof HealthRecord,
    @InjectModel(MedicationLog)
    private readonly medicationLogModel: typeof MedicationLog,
    @InjectModel(Appointment)
    private readonly appointmentModel: typeof Appointment,
    @InjectModel(IncidentReport)
    private readonly incidentReportModel: typeof IncidentReport,
    @InjectModel(StudentMedication)
    private readonly studentMedicationModel: typeof StudentMedication,
    @InjectModel(Vaccination)
    private readonly vaccinationModel: typeof Vaccination,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super('ReportDataCollectorService');
  }

  /**
   * Collect data for a specific report type
   */
  async collectReportData(
    schoolId: string,
    reportType: AnalyticsReportType,
    period: AnalyticsTimePeriod,
    filters?: Record<string, any>,
  ): Promise<any> {
    try {
      switch (reportType) {
        case AnalyticsReportType.HEALTH_OVERVIEW:
          return await this.collectHealthOverviewData(schoolId, period, filters);

        case AnalyticsReportType.MEDICATION_SUMMARY:
          return await this.collectMedicationData(schoolId, period, filters);

        case AnalyticsReportType.STUDENT_HEALTH_SUMMARY:
          return await this.collectStudentHealthData(schoolId, period, filters);

        case AnalyticsReportType.COMPLIANCE_REPORT:
          return await this.collectComplianceData(schoolId, period, filters);

        case AnalyticsReportType.DASHBOARD_SUMMARY:
          return await this.collectDashboardData(schoolId, period, filters);

        case AnalyticsReportType.INCIDENT_ANALYSIS:
          return await this.collectIncidentData(schoolId, period, filters);

        case AnalyticsReportType.APPOINTMENT_ANALYTICS:
          return await this.collectAppointmentData(schoolId, period, filters);

        default:
          throw new Error(`Unsupported report type: ${reportType}`);
      }
    } catch (error) {
      this.logError(`Failed to collect data for report ${reportType}`, error);
      throw error;
    }
  }

  /**
   * Collect health overview data
   */
  private async collectHealthOverviewData(
    schoolId: string,
    period: AnalyticsTimePeriod,
    filters?: Record<string, any>,
  ): Promise<HealthMetricsData> {
    try {
      const dateRange = this.getDateRange(period);

      // Query real database for health metrics
      const [
        totalStudents,
        activeHealthRecords,
        totalMedications,
        administeredMedications,
        totalVaccinations,
        requiredVaccinations,
        incidentCount,
        totalAppointments,
        completedAppointments,
      ] = await Promise.all([
        // Total active students in school
        this.studentModel.count({
          where: { schoolId, isActive: true },
        }),

        // Active health records in period
        this.healthRecordModel.count({
          where: {
            schoolId,
            createdAt: { [Op.between]: [dateRange.start, dateRange.end] },
          },
        }),

        // Total scheduled medications
        this.studentMedicationModel.count({
          where: {
            schoolId,
            isActive: true,
            startDate: { [Op.lte]: dateRange.end },
            [Op.or]: [
              { endDate: null },
              { endDate: { [Op.gte]: dateRange.start } },
            ],
          },
        }),

        // Actually administered medications
        this.medicationLogModel.count({
          where: {
            schoolId,
            administeredAt: { [Op.between]: [dateRange.start, dateRange.end] },
          },
        }),

        // Total vaccinations administered
        this.vaccinationModel.count({
          where: {
            schoolId,
            administeredAt: { [Op.between]: [dateRange.start, dateRange.end] },
          },
        }),

        // Required vaccinations (estimate: 10 per student)
        this.studentModel.count({
          where: { schoolId, isActive: true },
        }).then(count => count * 10),

        // Incident count in period
        this.incidentReportModel.count({
          where: {
            schoolId,
            occurredAt: { [Op.between]: [dateRange.start, dateRange.end] },
          },
        }),

        // Total appointments in period
        this.appointmentModel.count({
          where: {
            schoolId,
            scheduledAt: { [Op.between]: [dateRange.start, dateRange.end] },
          },
        }),

        // Completed appointments
        this.appointmentModel.count({
          where: {
            schoolId,
            scheduledAt: { [Op.between]: [dateRange.start, dateRange.end] },
            status: 'COMPLETED',
          },
        }),
      ]);

      // Calculate percentages
      const medicationAdherence = totalMedications > 0
        ? (administeredMedications / totalMedications) * 100
        : 0;

      const immunizationCompliance = requiredVaccinations > 0
        ? (totalVaccinations / requiredVaccinations) * 100
        : 0;

      const appointmentCompletion = totalAppointments > 0
        ? (completedAppointments / totalAppointments) * 100
        : 0;

      return {
        totalStudents,
        activeHealthRecords,
        medicationAdherence: parseFloat(medicationAdherence.toFixed(1)),
        immunizationCompliance: parseFloat(immunizationCompliance.toFixed(1)),
        incidentCount,
        appointmentCompletion: parseFloat(appointmentCompletion.toFixed(1)),
      };
    } catch (error) {
      this.logError('Error collecting health overview data', error);
      throw error;
    }
  }

  /**
   * Get date range for analytics period
   */
  private getDateRange(period: AnalyticsTimePeriod): { start: Date; end: Date } {
    const end = new Date();
    const start = new Date();

    switch (period) {
      case AnalyticsTimePeriod.LAST_7_DAYS:
        start.setDate(end.getDate() - 7);
        break;
      case AnalyticsTimePeriod.LAST_30_DAYS:
        start.setDate(end.getDate() - 30);
        break;
      case AnalyticsTimePeriod.LAST_90_DAYS:
        start.setDate(end.getDate() - 90);
        break;
      case AnalyticsTimePeriod.LAST_6_MONTHS:
        start.setMonth(end.getMonth() - 6);
        break;
      case AnalyticsTimePeriod.LAST_YEAR:
        start.setFullYear(end.getFullYear() - 1);
        break;
      default:
        start.setDate(end.getDate() - 30);
    }

    return { start, end };
  }

  /**
   * Collect medication analytics data
   */
  private async collectMedicationData(
    schoolId: string,
    period: AnalyticsTimePeriod,
    filters?: Record<string, any>,
  ): Promise<MedicationAnalyticsData> {
    try {
      const dateRange = this.getDateRange(period);

      // Get medication administration statistics
      const medicationStats = await this.medicationLogModel.findAll({
        attributes: [
          'medicationName',
          [fn('COUNT', col('id')), 'count'],
          [fn('COUNT', fn('DISTINCT', col('studentId'))), 'students'],
        ],
        where: {
          schoolId,
          administeredAt: { [Op.between]: [dateRange.start, dateRange.end] },
        },
        group: ['medicationName'],
        order: [[fn('COUNT', col('id')), 'DESC']],
        limit: 10,
        raw: true,
      });

      const medications = medicationStats.map((stat: any) => ({
        name: stat.medicationName,
        count: parseInt(stat.count, 10),
        students: parseInt(stat.students, 10),
      }));

      const commonMedications = medications.slice(0, 3).map(m => m.name);

      // Calculate medication adherence
      const totalScheduled = await this.studentMedicationModel.count({
        where: {
          schoolId,
          isActive: true,
          startDate: { [Op.lte]: dateRange.end },
          [Op.or]: [
            { endDate: null },
            { endDate: { [Op.gte]: dateRange.start } },
          ],
        },
      });

      const totalAdministered = await this.medicationLogModel.count({
        where: {
          schoolId,
          administeredAt: { [Op.between]: [dateRange.start, dateRange.end] },
        },
      });

      const adherence = totalScheduled > 0
        ? (totalAdministered / totalScheduled) * 100
        : 0;

      return {
        medications,
        adherence: parseFloat(adherence.toFixed(1)),
        commonMedications,
      };
    } catch (error) {
      this.logError('Error collecting medication data', error);
      throw error;
    }
  }

  /**
   * Collect student health data
   */
  private async collectStudentHealthData(
    schoolId: string,
    period: AnalyticsTimePeriod,
    filters?: Record<string, any>,
  ): Promise<StudentHealthMetrics[]> {
    try {
      const dateRange = this.getDateRange(period);

      // Get all active students for the school
      const students = await this.studentModel.findAll({
        where: { schoolId, isActive: true },
        attributes: ['id'],
        limit: filters?.limit || 100,
      });

      if (students.length === 0) {
        return [];
      }

      const studentIds = students.map(s => s.id);

      // Collect metrics for each student in parallel
      const studentMetrics = await Promise.all(
        studentIds.map(async (studentId) => {
          const [
            healthRecordsCount,
            medicationLogsCount,
            appointmentsCount,
            incidentsCount,
            lastHealthRecordData,
            lastMedicationData,
            upcomingAppointmentsCount,
          ] = await Promise.all([
            this.healthRecordModel.count({
              where: {
                studentId,
                createdAt: { [Op.between]: [dateRange.start, dateRange.end] },
              },
            }),

            this.medicationLogModel.count({
              where: {
                studentId,
                administeredAt: { [Op.between]: [dateRange.start, dateRange.end] },
              },
            }),

            this.appointmentModel.count({
              where: {
                studentId,
                scheduledAt: { [Op.between]: [dateRange.start, dateRange.end] },
              },
            }),

            this.incidentReportModel.count({
              where: {
                studentId,
                occurredAt: { [Op.between]: [dateRange.start, dateRange.end] },
              },
            }),

            this.healthRecordModel.findOne({
              where: { studentId },
              order: [['createdAt', 'DESC']],
              attributes: ['createdAt'],
            }),

            this.medicationLogModel.findOne({
              where: { studentId },
              order: [['administeredAt', 'DESC']],
              attributes: ['administeredAt'],
            }),

            this.appointmentModel.count({
              where: {
                studentId,
                scheduledAt: { [Op.gt]: new Date() },
                status: { [Op.in]: ['SCHEDULED', 'IN_PROGRESS'] },
              },
            }),
          ]);

          return {
            studentId,
            period,
            healthRecords: healthRecordsCount,
            medicationAdministrations: medicationLogsCount,
            appointments: appointmentsCount,
            incidents: incidentsCount,
            lastHealthRecord: lastHealthRecordData?.createdAt || null,
            lastMedication: lastMedicationData?.administeredAt || null,
            upcomingAppointments: upcomingAppointmentsCount,
          };
        })
      );

      // Filter out students with no activity if specified
      if (filters?.activeOnly) {
        return studentMetrics.filter(m =>
          m.healthRecords > 0 ||
          m.medicationAdministrations > 0 ||
          m.appointments > 0 ||
          m.incidents > 0
        );
      }

      return studentMetrics;
    } catch (error) {
      this.logError('Error collecting student health data', error);
      throw error;
    }
  }

  /**
   * Collect compliance data
   */
  private async collectComplianceData(
    schoolId: string,
    period: AnalyticsTimePeriod,
    filters?: Record<string, any>,
  ): Promise<ComplianceData> {
    // In a real implementation, this would calculate compliance metrics
    const medicationAdherence = 87.5;
    const immunizationCompliance = 92.3;
    const appointmentCompletion = 89.2;
    const incidentReporting = 94.1;

    const overall = this.calculateOverallCompliance({
      medicationAdherence,
      immunizationCompliance,
      appointmentCompletion,
      incidentReporting,
    });

    return {
      medicationAdherence,
      immunizationCompliance,
      appointmentCompletion,
      incidentReporting,
      overall,
      status: this.determineComplianceStatus(overall),
      areasOfConcern: this.identifyComplianceConcerns({
        medicationAdherence,
        immunizationCompliance,
        appointmentCompletion,
        incidentReporting,
      }),
      recommendations: this.generateComplianceRecommendations({
        medicationAdherence,
        immunizationCompliance,
        appointmentCompletion,
        incidentReporting,
      }),
    };
  }

  /**
   * Collect dashboard data
   */
  private async collectDashboardData(
    schoolId: string,
    period: AnalyticsTimePeriod,
    filters?: Record<string, any>,
  ): Promise<DashboardData> {
    // In a real implementation, this would aggregate dashboard metrics
    return {
      keyMetrics: [
        {
          name: 'Active Health Records',
          value: 1250,
          change: 5.2,
          trend: 'up',
        },
        {
          name: 'Medication Adherence',
          value: 87.5,
          change: -1.3,
          trend: 'down',
        },
        {
          name: 'Immunization Compliance',
          value: 92.3,
          change: 2.1,
          trend: 'up',
        },
      ],
      alerts: [
        {
          id: 'alert_001',
          type: 'MEDICATION',
          message: 'Medication adherence below 90%',
          severity: 'MEDIUM',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
      ],
      upcomingAppointments: 15,
      pendingTasks: 8,
      recommendations: [
        'Review medication administration protocols',
        'Schedule immunization catch-up clinics',
        'Update health record documentation procedures',
      ],
    };
  }

  /**
   * Collect incident analytics data
   */
  private async collectIncidentData(
    schoolId: string,
    period: AnalyticsTimePeriod,
    filters?: Record<string, any>,
  ): Promise<IncidentAnalyticsData> {
    try {
      const dateRange = this.getDateRange(period);

      // Get all incidents for the period
      const incidents = await this.incidentReportModel.findAll({
        where: {
          schoolId,
          occurredAt: { [Op.between]: [dateRange.start, dateRange.end] },
        },
        attributes: ['type', 'severity', 'occurredAt', 'resolvedAt'],
      });

      const totalIncidents = incidents.length;

      // Group by type
      const incidentTypes: Record<string, number> = {};
      incidents.forEach(incident => {
        const type = incident.type || 'Unknown';
        incidentTypes[type] = (incidentTypes[type] || 0) + 1;
      });

      // Group by severity
      const severityBreakdown: Record<string, number> = {
        LOW: 0,
        MEDIUM: 0,
        HIGH: 0,
        CRITICAL: 0,
      };
      incidents.forEach(incident => {
        const severity = incident.severity || 'LOW';
        if (severityBreakdown.hasOwnProperty(severity)) {
          severityBreakdown[severity]++;
        }
      });

      // Calculate average resolution time
      const resolvedIncidents = incidents.filter(i => i.resolvedAt && i.occurredAt);
      let resolutionTime = 0;
      if (resolvedIncidents.length > 0) {
        const totalResolutionTime = resolvedIncidents.reduce((sum, incident) => {
          const resolutionMs = incident.resolvedAt!.getTime() - incident.occurredAt.getTime();
          return sum + (resolutionMs / (1000 * 60 * 60)); // Convert to hours
        }, 0);
        resolutionTime = totalResolutionTime / resolvedIncidents.length;
      }

      return {
        totalIncidents,
        incidentTypes,
        severityBreakdown,
        resolutionTime: parseFloat(resolutionTime.toFixed(1)),
      };
    } catch (error) {
      this.logError('Error collecting incident data', error);
      throw error;
    }
  }

  /**
   * Collect appointment analytics data
   */
  private async collectAppointmentData(
    schoolId: string,
    period: AnalyticsTimePeriod,
    filters?: Record<string, any>,
  ): Promise<AppointmentAnalyticsData> {
    try {
      const dateRange = this.getDateRange(period);

      // Get appointment statistics
      const appointments = await this.appointmentModel.findAll({
        where: {
          schoolId,
          scheduledAt: { [Op.between]: [dateRange.start, dateRange.end] },
        },
        attributes: ['status', 'scheduledAt', 'checkInTime'],
      });

      const totalAppointments = appointments.length;
      const completedAppointments = appointments.filter(a => a.status === 'COMPLETED').length;
      const noShowAppointments = appointments.filter(a => a.status === 'NO_SHOW').length;

      // Calculate average wait time (from scheduled to check-in)
      const appointmentsWithWaitTime = appointments.filter(a =>
        a.checkInTime && a.scheduledAt
      );

      let averageWaitTime = 0;
      if (appointmentsWithWaitTime.length > 0) {
        const totalWaitTime = appointmentsWithWaitTime.reduce((sum, apt) => {
          const waitMs = apt.checkInTime!.getTime() - apt.scheduledAt.getTime();
          return sum + (waitMs / (1000 * 60)); // Convert to minutes
        }, 0);
        averageWaitTime = totalWaitTime / appointmentsWithWaitTime.length;
      }

      const completionRate = totalAppointments > 0
        ? (completedAppointments / totalAppointments) * 100
        : 0;

      return {
        totalAppointments,
        completedAppointments,
        noShowAppointments,
        completionRate: parseFloat(completionRate.toFixed(1)),
        averageWaitTime: parseFloat(averageWaitTime.toFixed(1)),
      };
    } catch (error) {
      this.logError('Error collecting appointment data', error);
      throw error;
    }
  }

  /**
   * Calculate overall compliance score
   */
  private calculateOverallCompliance(data: {
    medicationAdherence: number;
    immunizationCompliance: number;
    appointmentCompletion: number;
    incidentReporting: number;
  }): number {
    const weights = {
      medication: 0.3,
      immunization: 0.3,
      appointments: 0.2,
      incidents: 0.2,
    };

    return (
      data.medicationAdherence * weights.medication +
      data.immunizationCompliance * weights.immunization +
      data.appointmentCompletion * weights.appointments +
      data.incidentReporting * weights.incidents
    );
  }

  /**
   * Determine compliance status
   */
  private determineComplianceStatus(overall: number): 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'CRITICAL' {
    if (overall >= 95) return 'EXCELLENT';
    if (overall >= 85) return 'GOOD';
    if (overall >= 70) return 'NEEDS_IMPROVEMENT';
    return 'CRITICAL';
  }

  /**
   * Identify compliance concerns
   */
  private identifyComplianceConcerns(scores: {
    medicationAdherence: number;
    immunizationCompliance: number;
    appointmentCompletion: number;
    incidentReporting: number;
  }): string[] {
    const concerns: string[] = [];
    const thresholds = {
      medication: 85,
      immunization: 90,
      appointments: 80,
      incidents: 85,
    };

    if (scores.medicationAdherence < thresholds.medication) {
      concerns.push('Medication adherence below threshold');
    }
    if (scores.immunizationCompliance < thresholds.immunization) {
      concerns.push('Immunization compliance below threshold');
    }
    if (scores.appointmentCompletion < thresholds.appointments) {
      concerns.push('Appointment completion below threshold');
    }
    if (scores.incidentReporting < thresholds.incidents) {
      concerns.push('Incident reporting below threshold');
    }

    return concerns;
  }

  /**
   * Generate compliance recommendations
   */
  private generateComplianceRecommendations(scores: {
    medicationAdherence: number;
    immunizationCompliance: number;
    appointmentCompletion: number;
    incidentReporting: number;
  }): string[] {
    const recommendations: string[] = [];

    if (scores.medicationAdherence < 85) {
      recommendations.push('Implement medication reminder systems');
    }
    if (scores.immunizationCompliance < 90) {
      recommendations.push('Enhance immunization tracking and reminders');
    }
    if (scores.appointmentCompletion < 80) {
      recommendations.push('Review appointment scheduling and follow-up processes');
    }
    if (scores.incidentReporting < 85) {
      recommendations.push('Improve incident reporting procedures');
    }

    return recommendations;
  }
}
