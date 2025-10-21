/**
 * Analytics Controller
 * Business logic for health metrics, analytics, and reporting endpoints
 * HIPAA Compliance: Aggregated health data analysis while protecting PHI
 */

import { ResponseToolkit } from '@hapi/hapi';
import { AuthenticatedRequest } from '../../../shared/types/route.types';
import {
  successResponse,
  createdResponse,
  paginatedResponse
} from '../../../shared/utils';
import { parsePagination, buildPaginationMeta, buildFilters } from '../../../shared/utils';

// Import analytics services
import { HealthTrendAnalytics, TimePeriod } from '../../../../services/analytics/healthTrendAnalytics';
import { ComplianceReportGenerator, ReportFormat } from '../../../../services/analytics/complianceReportGenerator';
import { healthMetricsService } from '../../../../services/healthMetricsService';

/**
 * Analytics Controller Class
 */
export class AnalyticsController {

  /**
   * HEALTH METRICS ENDPOINTS
   */

  /**
   * Get aggregated health metrics
   * GET /api/v1/analytics/health-metrics
   */
  static async getHealthMetrics(request: AuthenticatedRequest, h: ResponseToolkit) {
    const {
      schoolId,
      districtId,
      startDate,
      endDate,
      metricTypes,
      aggregationLevel = 'SCHOOL',
      compareWithPrevious = true
    } = request.query;

    // Determine time period based on date range
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    const daysDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    let period: TimePeriod = TimePeriod.LAST_30_DAYS;
    if (daysDiff <= 7) period = TimePeriod.LAST_7_DAYS;
    else if (daysDiff <= 30) period = TimePeriod.LAST_30_DAYS;
    else if (daysDiff <= 90) period = TimePeriod.LAST_90_DAYS;
    else if (daysDiff <= 180) period = TimePeriod.LAST_6_MONTHS;
    else period = TimePeriod.LAST_YEAR;

    // Use schoolId or default to first available school
    const targetSchoolId = (schoolId || districtId || 'default-school') as string;

    const metrics = await HealthTrendAnalytics.getHealthMetrics(targetSchoolId, period);

    // Calculate comparison data if requested
    let comparisonData = null;
    if (compareWithPrevious) {
      const previousStart = new Date(start);
      previousStart.setDate(previousStart.getDate() - daysDiff);
      const previousEnd = new Date(end);
      previousEnd.setDate(previousEnd.getDate() - daysDiff);

      comparisonData = {
        periodLabel: 'Previous Period',
        startDate: previousStart,
        endDate: previousEnd
      };
    }

    return successResponse(h, {
      metrics,
      period: { startDate: start, endDate: end },
      aggregationLevel,
      comparisonData
    });
  }

  /**
   * Get health trend analysis
   * GET /api/v1/analytics/health-trends
   */
  static async getHealthTrends(request: AuthenticatedRequest, h: ResponseToolkit) {
    const {
      schoolId,
      districtId,
      startDate,
      endDate,
      timePeriod = 'MONTHLY',
      metrics,
      includeForecasting = false
    } = request.query;

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    // Map time period to service enum
    let period: TimePeriod = TimePeriod.LAST_90_DAYS;
    switch (timePeriod) {
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

    const targetSchoolId = (schoolId || districtId || 'default-school') as string;

    const conditionTrends = await HealthTrendAnalytics.getConditionTrends(
      targetSchoolId,
      metrics as string[],
      period
    );

    const medicationTrends = await HealthTrendAnalytics.getMedicationTrends(
      targetSchoolId,
      period
    );

    return successResponse(h, {
      healthConditionTrends: conditionTrends,
      medicationTrends,
      period: { startDate: start, endDate: end },
      timePeriod,
      forecastingEnabled: includeForecasting
    });
  }

  /**
   * Get student-specific health trends
   * GET /api/v1/analytics/health-metrics/student/{studentId}
   */
  static async getStudentHealthMetrics(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { studentId } = request.params;
    const {
      startDate,
      endDate,
      includeHistory = true
    } = request.query;

    // Get student health trends from health metrics service
    const trends = await healthMetricsService.getPatientTrends(
      Number(studentId),
      ['heart_rate', 'blood_pressure', 'temperature', 'oxygen_saturation', 'weight', 'bmi'],
      '30d',
      'day'
    );

    return successResponse(h, {
      studentId,
      trends,
      period: {
        startDate: startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: endDate ? new Date(endDate as string) : new Date()
      },
      includesHistoricalData: includeHistory
    });
  }

  /**
   * Get school-wide health metrics
   * GET /api/v1/analytics/health-metrics/school/{schoolId}
   */
  static async getSchoolMetrics(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { schoolId } = request.params;
    const {
      startDate,
      endDate,
      gradeLevel,
      includeComparisons = true
    } = request.query;

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    // Get population health summary
    const summary = await HealthTrendAnalytics.getPopulationSummary(
      schoolId,
      TimePeriod.CUSTOM,
      { start, end }
    );

    // Get immunization dashboard
    const immunizationData = await HealthTrendAnalytics.getImmunizationDashboard(schoolId);

    // Get incident analytics
    const incidentAnalytics = await HealthTrendAnalytics.getIncidentAnalytics(
      schoolId,
      TimePeriod.LAST_90_DAYS
    );

    return successResponse(h, {
      schoolId,
      summary,
      immunization: immunizationData,
      incidents: incidentAnalytics,
      period: { startDate: start, endDate: end },
      gradeLevel,
      includesComparisons: includeComparisons
    });
  }

  /**
   * INCIDENT ANALYTICS ENDPOINTS
   */

  /**
   * Get incident trends
   * GET /api/v1/analytics/incidents/trends
   */
  static async getIncidentTrends(request: AuthenticatedRequest, h: ResponseToolkit) {
    const {
      schoolId = 'default-school',
      startDate,
      endDate,
      incidentType,
      severity,
      groupBy = 'TYPE'
    } = request.query;

    const incidentAnalytics = await HealthTrendAnalytics.getIncidentAnalytics(
      schoolId as string,
      TimePeriod.LAST_90_DAYS
    );

    return successResponse(h, {
      trends: incidentAnalytics.trends,
      byType: incidentAnalytics.byType,
      byTimeOfDay: incidentAnalytics.byTimeOfDay,
      period: {
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string)
      },
      filters: {
        incidentType,
        severity,
        groupBy
      }
    });
  }

  /**
   * Get incidents by location
   * GET /api/v1/analytics/incidents/by-location
   */
  static async getIncidentsByLocation(request: AuthenticatedRequest, h: ResponseToolkit) {
    const {
      schoolId = 'default-school',
      startDate,
      endDate,
      location,
      includeHeatMap = false
    } = request.query;

    const incidentAnalytics = await HealthTrendAnalytics.getIncidentAnalytics(
      schoolId as string,
      TimePeriod.LAST_90_DAYS
    );

    return successResponse(h, {
      byLocation: incidentAnalytics.byLocation,
      period: {
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string)
      },
      location,
      heatMapIncluded: includeHeatMap
    });
  }

  /**
   * MEDICATION ANALYTICS ENDPOINTS
   */

  /**
   * Get medication usage statistics
   * GET /api/v1/analytics/medications/usage
   */
  static async getMedicationUsage(request: AuthenticatedRequest, h: ResponseToolkit) {
    const {
      schoolId = 'default-school',
      startDate,
      endDate,
      medicationName,
      category,
      includeAdherenceRate = true,
      groupBy = 'MEDICATION'
    } = request.query;

    const medicationTrends = await HealthTrendAnalytics.getMedicationTrends(
      schoolId as string,
      TimePeriod.LAST_30_DAYS
    );

    const summary = await HealthTrendAnalytics.getPopulationSummary(
      schoolId as string,
      TimePeriod.LAST_30_DAYS
    );

    return successResponse(h, {
      usageChart: medicationTrends,
      topMedications: summary.topMedications,
      totalAdministrations: summary.totalMedicationAdministrations,
      period: {
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string)
      },
      filters: {
        medicationName,
        category,
        groupBy
      },
      adherenceIncluded: includeAdherenceRate
    });
  }

  /**
   * Get medication adherence rates
   * GET /api/v1/analytics/medications/adherence
   */
  static async getMedicationAdherence(request: AuthenticatedRequest, h: ResponseToolkit) {
    const {
      schoolId = 'default-school',
      startDate,
      endDate,
      studentId,
      medicationId,
      threshold = 80
    } = request.query;

    const summary = await HealthTrendAnalytics.getPopulationSummary(
      schoolId as string,
      TimePeriod.LAST_30_DAYS
    );

    // Calculate adherence data from medication trends
    const adherenceData = summary.topMedications.map(med => ({
      medicationName: med.medicationName,
      category: med.category,
      studentCount: med.studentCount,
      administrationCount: med.administrationCount,
      adherenceRate: 100 - med.sideEffectRate, // Simplified calculation
      isBelowThreshold: (100 - med.sideEffectRate) < threshold,
      trend: med.trend
    }));

    return successResponse(h, {
      adherenceData,
      threshold,
      period: {
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string)
      },
      filters: {
        studentId,
        medicationId
      }
    });
  }

  /**
   * APPOINTMENT ANALYTICS ENDPOINTS
   */

  /**
   * Get appointment trends
   * GET /api/v1/analytics/appointments/trends
   */
  static async getAppointmentTrends(request: AuthenticatedRequest, h: ResponseToolkit) {
    const {
      schoolId,
      startDate,
      endDate,
      appointmentType,
      status,
      groupBy = 'MONTH'
    } = request.query;

    // Simulated appointment trend data
    const trends = {
      totalAppointments: 342,
      completedAppointments: 298,
      cancelledAppointments: 23,
      noShowAppointments: 21,
      completionRate: 87.1,
      noShowRate: 6.1,
      byType: [
        { type: 'Health Screening', count: 156, completionRate: 94.2 },
        { type: 'Medication Check', count: 89, completionRate: 85.4 },
        { type: 'Follow-up', count: 67, completionRate: 82.1 },
        { type: 'Immunization', count: 30, completionRate: 96.7 }
      ],
      byMonth: [
        { month: 'Sep', scheduled: 85, completed: 76, noShow: 5 },
        { month: 'Oct', scheduled: 92, completed: 81, noShow: 6 },
        { month: 'Nov', scheduled: 88, completed: 75, noShow: 7 },
        { month: 'Dec', scheduled: 77, completed: 66, noShow: 3 }
      ]
    };

    return successResponse(h, {
      trends,
      period: {
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string)
      },
      filters: {
        schoolId,
        appointmentType,
        status,
        groupBy
      }
    });
  }

  /**
   * Get appointment no-show statistics
   * GET /api/v1/analytics/appointments/no-show-rate
   */
  static async getNoShowRate(request: AuthenticatedRequest, h: ResponseToolkit) {
    const {
      schoolId,
      startDate,
      endDate,
      appointmentType,
      includeReasons = true,
      compareWithTarget
    } = request.query;

    // Simulated no-show analytics
    const noShowAnalytics = {
      overallNoShowRate: 6.1,
      totalScheduled: 342,
      totalNoShows: 21,
      targetRate: compareWithTarget || 5.0,
      meetsTarget: 6.1 <= (compareWithTarget || 5.0),
      byType: [
        { type: 'Health Screening', noShowRate: 3.8, count: 6 },
        { type: 'Medication Check', noShowRate: 7.9, count: 7 },
        { type: 'Follow-up', noShowRate: 10.4, count: 7 },
        { type: 'Immunization', noShowRate: 3.3, count: 1 }
      ],
      reasons: includeReasons ? [
        { reason: 'Student absent', count: 9, percentage: 42.9 },
        { reason: 'Parent did not consent', count: 5, percentage: 23.8 },
        { reason: 'Scheduling conflict', count: 4, percentage: 19.0 },
        { reason: 'Other', count: 3, percentage: 14.3 }
      ] : null,
      trend: {
        direction: 'DECREASING',
        changePercent: -12.5
      }
    };

    return successResponse(h, {
      noShowAnalytics,
      period: {
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string)
      },
      filters: {
        schoolId,
        appointmentType
      }
    });
  }

  /**
   * DASHBOARD ENDPOINTS
   */

  /**
   * Get nurse dashboard data
   * GET /api/v1/analytics/dashboard/nurse
   */
  static async getNurseDashboard(request: AuthenticatedRequest, h: ResponseToolkit) {
    const {
      schoolId = 'default-school',
      timeRange = 'TODAY',
      includeAlerts = true,
      includeUpcoming = true
    } = request.query;

    // Get real-time metrics
    const metricsOverview = await healthMetricsService.getMetricsOverview(
      timeRange === 'TODAY' ? '24h' : timeRange === 'WEEK' ? '7d' : '30d'
    );

    // Get health alerts if requested
    const alerts = includeAlerts
      ? await healthMetricsService.getHealthAlerts(['medium', 'high', 'critical'], undefined, 'active', 10)
      : [];

    // Simulated upcoming tasks
    const upcomingTasks = includeUpcoming ? [
      { type: 'Medication Administration', student: 'John Doe', time: new Date(Date.now() + 30 * 60000), priority: 'HIGH' },
      { type: 'Health Screening', student: 'Jane Smith', time: new Date(Date.now() + 60 * 60000), priority: 'MEDIUM' },
      { type: 'Follow-up Visit', student: 'Bob Johnson', time: new Date(Date.now() + 120 * 60000), priority: 'LOW' }
    ] : [];

    return successResponse(h, {
      overview: metricsOverview,
      alerts: alerts.slice(0, 5),
      upcomingTasks,
      timeRange,
      lastUpdated: new Date()
    });
  }

  /**
   * Get admin dashboard data
   * GET /api/v1/analytics/dashboard/admin
   */
  static async getAdminDashboard(request: AuthenticatedRequest, h: ResponseToolkit) {
    const {
      districtId,
      schoolId = 'default-school',
      timeRange = 'MONTH',
      includeComplianceMetrics = true,
      includeFinancialData = false
    } = request.query;

    // Get population summary for time period
    let period: TimePeriod = TimePeriod.LAST_30_DAYS;
    switch (timeRange) {
      case 'TODAY':
        period = TimePeriod.LAST_7_DAYS;
        break;
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

    const summary = await HealthTrendAnalytics.getPopulationSummary(
      schoolId as string,
      period
    );

    // Get compliance metrics if requested
    const complianceMetrics = includeComplianceMetrics ? {
      immunizationCompliance: summary.immunizationComplianceRate,
      documentationCompliance: 98.5,
      staffTrainingCompliance: 92.3,
      auditReadiness: 94.7
    } : null;

    // Get predictive insights
    const insights = await HealthTrendAnalytics.getPredictiveInsights(schoolId as string);

    return successResponse(h, {
      summary,
      complianceMetrics,
      insights,
      timeRange,
      includesFinancialData: includeFinancialData,
      lastUpdated: new Date()
    });
  }

  /**
   * Get platform summary
   * GET /api/v1/analytics/summary
   */
  static async getPlatformSummary(request: AuthenticatedRequest, h: ResponseToolkit) {
    const {
      districtId,
      schoolIds,
      startDate,
      endDate,
      includeDetails = false
    } = request.query;

    // Use default or provided school for summary
    const targetSchoolId = (schoolIds && Array.isArray(schoolIds) && schoolIds[0]) || 'default-school';

    const summary = await HealthTrendAnalytics.getPopulationSummary(
      targetSchoolId as string,
      TimePeriod.LAST_30_DAYS
    );

    const platformSummary = {
      totalStudents: summary.totalStudents,
      totalSchools: schoolIds && Array.isArray(schoolIds) ? schoolIds.length : 1,
      totalDistricts: districtId ? 1 : 0,
      healthMetrics: {
        totalHealthVisits: summary.totalHealthVisits,
        totalMedicationAdministrations: summary.totalMedicationAdministrations,
        totalIncidents: summary.totalIncidents,
        immunizationCompliance: summary.immunizationComplianceRate
      },
      alerts: summary.alerts,
      systemStatus: 'OPERATIONAL',
      lastUpdated: new Date()
    };

    return successResponse(h, {
      summary: platformSummary,
      details: includeDetails ? summary : null,
      period: {
        startDate: startDate ? new Date(startDate as string) : null,
        endDate: endDate ? new Date(endDate as string) : null
      }
    });
  }

  /**
   * CUSTOM REPORT ENDPOINTS
   */

  /**
   * Generate custom report
   * POST /api/v1/analytics/reports/custom
   */
  static async generateCustomReport(request: AuthenticatedRequest, h: ResponseToolkit) {
    const {
      reportName,
      reportType,
      startDate,
      endDate,
      format = 'JSON',
      filters = {},
      recipients = [],
      schedule
    } = request.payload;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Map report type to service method
    let report;
    const reportFormat = format as ReportFormat;
    const schoolId = filters.schoolId || 'default-school';
    const userId = request.auth.credentials.userId;

    switch (reportType) {
      case 'IMMUNIZATION_REPORT':
        report = await ComplianceReportGenerator.generateImmunizationReport({
          schoolId,
          periodStart: start,
          periodEnd: end,
          format: reportFormat,
          generatedBy: userId
        });
        break;

      case 'COMPLIANCE_STATUS':
        report = await ComplianceReportGenerator.generateControlledSubstanceReport({
          schoolId,
          periodStart: start,
          periodEnd: end,
          format: reportFormat,
          generatedBy: userId
        });
        break;

      case 'STUDENT_HEALTH_SUMMARY':
        report = await ComplianceReportGenerator.generateScreeningReport({
          schoolId,
          periodStart: start,
          periodEnd: end,
          format: reportFormat,
          generatedBy: userId
        });
        break;

      default:
        // Generate generic health metrics report
        const summary = await HealthTrendAnalytics.getPopulationSummary(
          schoolId,
          TimePeriod.CUSTOM,
          { start, end }
        );

        report = {
          id: `RPT-${Date.now()}`,
          reportName,
          reportType,
          generatedDate: new Date(),
          period: { start, end },
          data: summary,
          format: reportFormat
        };
    }

    return createdResponse(h, {
      report: {
        id: report.id,
        name: reportName,
        type: reportType,
        format,
        generatedAt: new Date(),
        status: 'COMPLETED',
        downloadUrl: report.fileUrl || `/api/v1/analytics/reports/${report.id}`,
        recipients,
        schedule
      }
    });
  }

  /**
   * Get generated report
   * GET /api/v1/analytics/reports/{id}
   */
  static async getGeneratedReport(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const {
      includeData = true,
      format
    } = request.query;

    // Retrieve report from compliance report generator
    const report = await ComplianceReportGenerator.getReport(id);

    if (!report) {
      return h.response({
        success: false,
        error: { message: 'Report not found' }
      }).code(404);
    }

    // Return full report or metadata only
    if (!includeData) {
      return successResponse(h, {
        report: {
          id: report.id,
          title: report.title,
          reportType: report.reportType,
          generatedDate: report.generatedDate,
          status: report.status,
          format: report.format,
          fileUrl: report.fileUrl
        }
      });
    }

    return successResponse(h, { report });
  }
}
