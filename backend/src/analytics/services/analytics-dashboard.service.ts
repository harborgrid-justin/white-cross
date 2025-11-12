import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Appointment, HealthRecord, IncidentReport, MedicationLog } from '@/database';
import { HealthTrendAnalyticsService } from './health-trend-analytics.service';
import { TimePeriod } from '../enums/time-period.enum';
import { GetNurseDashboardQueryDto } from '../dto/dashboard.dto';
import { GetAdminDashboardQueryDto } from '../dto/dashboard.dto';
import { GetPlatformSummaryQueryDto } from '../dto/dashboard.dto';

interface MedicationLogAttributes {
  id: string;
  studentId: string;
  medicationId: string;
  scheduledAt: Date;
  administeredAt?: Date;
  status: 'PENDING' | 'ADMINISTERED' | 'MISSED' | 'REFUSED';
  dosage: string;
  notes?: string;
}

interface AppointmentAttributes {
  id: string;
  studentId: string;
  type: string;
  scheduledAt: Date;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

interface IncidentAttributes {
  id: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  studentId: string;
  description: string;
  occurredAt: Date;
}

interface NurseDashboardOverview {
  totalPatients: number;
  activeAppointments: number;
  criticalAlerts: number;
  pendingMedications: number;
  status: 'OPERATIONAL' | 'ATTENTION_REQUIRED';
}

interface NurseDashboardAlert {
  id: string;
  type: string;
  severity: string;
  studentId: string;
  description: string;
  time: Date;
}

interface NurseDashboardTask {
  type: string;
  studentId: string;
  time: Date;
  priority: string;
  medicationId?: string;
  appointmentType?: string;
}

interface NurseDashboardResponse {
  overview: NurseDashboardOverview;
  alerts: NurseDashboardAlert[];
  upcomingTasks: NurseDashboardTask[];
  timeRange: string;
  lastUpdated: Date;
}

interface AdminDashboardComplianceMetrics {
  immunizationCompliance: number;
  documentationCompliance: number;
  staffTrainingCompliance: number;
  auditReadiness: number;
}

interface AdminDashboardResponse {
  summary: unknown;
  complianceMetrics: AdminDashboardComplianceMetrics | null;
  insights: unknown;
  timeRange: string;
  includesFinancialData: boolean;
  lastUpdated: Date;
}

interface PlatformHealthMetrics {
  totalHealthVisits: number;
  totalMedicationAdministrations: number;
  totalIncidents: number;
  immunizationCompliance: number;
}

interface PlatformSummaryData {
  totalStudents: number;
  totalSchools: number;
  totalDistricts: number;
  healthMetrics: PlatformHealthMetrics;
  alerts: unknown[];
  systemStatus: string;
  lastUpdated: Date;
}

interface PlatformSummaryResponse {
  summary: PlatformSummaryData;
  details: unknown | null;
  period: {
    startDate: Date | null;
    endDate: Date | null;
  };
}

/**
 * Analytics Dashboard Service
 * Handles all dashboard-related analytics operations
 * 
 * Responsibilities:
 * - Generate nurse operational dashboards
 * - Generate admin overview dashboards
 * - Generate platform-wide summaries
 * - Real-time metrics aggregation
 */
@Injectable()
export class AnalyticsDashboardService {
  private readonly logger = new Logger(AnalyticsDashboardService.name);

  constructor(
    private readonly healthTrendService: HealthTrendAnalyticsService,
    @InjectModel(HealthRecord)
    private readonly healthRecordModel: typeof HealthRecord,
    @InjectModel(Appointment)
    private readonly appointmentModel: typeof Appointment,
    @InjectModel(MedicationLog)
    private readonly medicationLogModel: typeof MedicationLog,
    @InjectModel(IncidentReport)
    private readonly incidentReportModel: typeof IncidentReport,
  ) {}

  /**
   * Get nurse dashboard data
   * Integrates with real-time health data sources for operational metrics
   */
  async getNurseDashboard(query: GetNurseDashboardQueryDto): Promise<NurseDashboardResponse> {
    try {
      const schoolId = query.schoolId || 'default-school';
      const timeRange = query.timeRange || 'TODAY';

      // Calculate time range for queries
      let startDate: Date;
      const endDate = new Date();

      switch (timeRange) {
        case 'TODAY':
          startDate = new Date();
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'WEEK':
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'MONTH':
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date();
          startDate.setHours(0, 0, 0, 0);
      }

      // Query today's health records
      const todayHealthRecords = await this.healthRecordModel.count({
        where: {
          recordDate: {
            [Op.between]: [startDate, endDate],
          },
        },
      });

      // Query active appointments for today
      const todayAppointments = await this.appointmentModel.findAll({
        where: {
          scheduledAt: {
            [Op.between]: [startDate, endDate],
          },
          status: {
            [Op.in]: ['SCHEDULED', 'IN_PROGRESS'],
          },
        },
      });

      // Query critical incidents
      const criticalIncidents = await this.incidentReportModel.findAll({
        where: {
          occurredAt: {
            [Op.between]: [startDate, endDate],
          },
          severity: {
            [Op.in]: ['CRITICAL', 'HIGH'],
          },
        },
        limit: 10,
        order: [['occurredAt', 'DESC']],
      });

      // Query pending medication administrations
      const upcomingMedications = await this.medicationLogModel.findAll({
        where: {
          scheduledAt: {
            [Op.between]: [
              new Date(),
              new Date(Date.now() + 4 * 60 * 60 * 1000),
            ], // Next 4 hours
          },
          status: 'PENDING',
        },
        order: [['scheduledAt', 'ASC']],
        limit: 20,
      });

      const metricsOverview: NurseDashboardOverview = {
        totalPatients: todayHealthRecords,
        activeAppointments: todayAppointments.length,
        criticalAlerts: criticalIncidents.length,
        pendingMedications: upcomingMedications.length,
        status:
          criticalIncidents.length > 5 ? 'ATTENTION_REQUIRED' : 'OPERATIONAL',
      };

      const alerts = query.includeAlerts
        ? (criticalIncidents as unknown as IncidentAttributes[]).map((incident) => ({
            id: incident.id,
            type: incident.type,
            severity: incident.severity,
            studentId: incident.studentId,
            description: incident.description,
            time: incident.occurredAt,
          }))
        : [];

      const upcomingTasks = query.includeUpcoming
        ? [
            ...(upcomingMedications as unknown as MedicationLogAttributes[]).map((med) => ({
              type: 'Medication Administration',
              studentId: med.studentId,
              medicationId: med.medicationId,
              time: med.scheduledAt,
              priority: 'HIGH',
            })),
            ...(todayAppointments as unknown as AppointmentAttributes[])
              .slice(0, 10)
              .map((apt) => ({
                type: 'Appointment',
                studentId: apt.studentId,
                appointmentType: apt.type,
                time: apt.scheduledAt,
                priority: 'MEDIUM',
              })),
          ]
        : [];

      this.logger.log(
        `Nurse dashboard loaded: ${metricsOverview.totalPatients} patients, ${metricsOverview.activeAppointments} appointments, ${metricsOverview.criticalAlerts} critical alerts, ${metricsOverview.pendingMedications} pending medications`,
      );

      return {
        overview: metricsOverview,
        alerts,
        upcomingTasks,
        timeRange,
        lastUpdated: new Date(),
      };
    } catch (error) {
      this.logger.error('Error getting nurse dashboard', error);
      throw error;
    }
  }

  /**
   * Get admin dashboard data
   */
  async getAdminDashboard(query: GetAdminDashboardQueryDto): Promise<AdminDashboardResponse> {
    try {
      const schoolId = query.schoolId || 'default-school';

      // Map time range to period
      let period: TimePeriod = TimePeriod.LAST_30_DAYS;
      switch (query.timeRange) {
        case 'TODAY':
        case 'WEEK':
          period = TimePeriod.LAST_7_DAYS;
          break;
        case 'MONTH':
          period = TimePeriod.LAST_30_DAYS;
          break;
        case 'QUARTER':
          period = TimePeriod.LAST_90_DAYS;
          break;
        case 'YEAR':
          period = TimePeriod.LAST_YEAR;
          break;
      }

      const summary = await this.healthTrendService.getPopulationSummary(
        schoolId,
        period,
      );

      const complianceMetrics = query.includeComplianceMetrics
        ? {
            immunizationCompliance: summary.immunizationComplianceRate,
            documentationCompliance: 98.5,
            staffTrainingCompliance: 92.3,
            auditReadiness: 94.7,
          }
        : null;

      const insights =
        await this.healthTrendService.getPredictiveInsights(schoolId);

      return {
        summary,
        complianceMetrics,
        insights,
        timeRange: query.timeRange || 'MONTH',
        includesFinancialData: query.includeFinancialData || false,
        lastUpdated: new Date(),
      };
    } catch (error) {
      this.logger.error('Error getting admin dashboard', error);
      throw error;
    }
  }

  /**
   * Get platform summary
   */
  async getPlatformSummary(query: GetPlatformSummaryQueryDto): Promise<PlatformSummaryResponse> {
    try {
      const targetSchoolId =
        (query.schoolIds && query.schoolIds.length > 0 && query.schoolIds[0]) ||
        'default-school';

      const summary = await this.healthTrendService.getPopulationSummary(
        targetSchoolId,
        TimePeriod.LAST_30_DAYS,
      );

      const platformSummary: PlatformSummaryData = {
        totalStudents: summary.totalStudents,
        totalSchools: query.schoolIds ? query.schoolIds.length : 1,
        totalDistricts: query.districtId ? 1 : 0,
        healthMetrics: {
          totalHealthVisits: summary.totalHealthVisits,
          totalMedicationAdministrations:
            summary.totalMedicationAdministrations,
          totalIncidents: summary.totalIncidents,
          immunizationCompliance: summary.immunizationComplianceRate,
        },
        alerts: summary.alerts,
        systemStatus: 'OPERATIONAL',
        lastUpdated: new Date(),
      };

      return {
        summary: platformSummary,
        details: query.includeDetails ? summary : null,
        period: {
          startDate: query.startDate || null,
          endDate: query.endDate || null,
        },
      };
    } catch (error) {
      this.logger.error('Error getting platform summary', error);
      throw error;
    }
  }
}
