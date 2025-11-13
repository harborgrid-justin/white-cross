import { Body, Controller, Get, Param, Post, Query, Request, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { AnalyticsGenerateCustomReportDto } from './dto/custom-reports.dto';
import { GetAdminDashboardQueryDto, GetNurseDashboardQueryDto, GetPlatformSummaryQueryDto } from './dto/dashboard.dto';
import { GetAppointmentTrendsQueryDto, GetNoShowRateQueryDto } from './dto/appointment-analytics.dto';
import { GetHealthMetricsQueryDto, GetSchoolMetricsParamDto, GetSchoolMetricsQueryDto, GetStudentHealthMetricsParamDto, GetStudentHealthMetricsQueryDto } from './dto/health-metrics.dto';
import { GetHealthTrendsQueryDto } from './dto/analytics-query.dto';
import { GetIncidentsByLocationQueryDto, GetIncidentTrendsQueryDto } from './dto/incident-analytics.dto';
import { GetMedicationAdherenceQueryDto, GetMedicationUsageQueryDto } from './dto/medication-analytics.dto';
import { GetReportParamDto, GetReportQueryDto } from './dto/report-generation.dto';

import { BaseController } from '@/common/base';
/**
 * Analytics Controller
 * Comprehensive health metrics, analytics, and reporting endpoints
 * HIPAA Compliance: Aggregated health data analysis while protecting PHI
 */
@ApiTags('Analytics')
@Controller('analytics')
@ApiBearerAuth()
@UseInterceptors(CacheInterceptor)
export class AnalyticsController extends BaseController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * MODULE METADATA ENDPOINT
   */

  @Get()
  @ApiOperation({
    summary: 'Get analytics module metadata',
    description:
      'Returns information about the analytics module including available endpoint categories, capabilities, and authentication requirements. No authentication required for metadata access.',
  })
  @ApiResponse({
    status: 200,
    description: 'Analytics module metadata retrieved successfully',
  })
  getAnalyticsMetadata() {
    return this.analyticsService.getAnalyticsMetadata();
  }

  /**
   * HEALTH METRICS & TRENDS ENDPOINTS
   */

  @Get('health-metrics')
  @CacheTTL(300) // Cache for 5 minutes
  @ApiOperation({
    summary: 'Get aggregated health metrics',
    description:
      'Retrieves comprehensive health metrics for specified time period. Includes visit counts, incident rates, medication administration counts, chronic condition prevalence, immunization compliance, and emergency contact coverage. Supports school/district-level aggregation and period-over-period comparison. Essential for population health management and performance tracking.',
  })
  @ApiResponse({
    status: 200,
    description: 'Health metrics retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getHealthMetrics(@Query() query: GetHealthMetricsQueryDto) {
    return this.analyticsService.getHealthMetrics(query);
  }

  @Get('health-trends')
  @CacheTTL(900) // Cache for 15 minutes
  @ApiOperation({
    summary: 'Get health trend analysis',
    description:
      'Provides time-series trend analysis for health conditions and medications. Tracks changes over time with daily/weekly/monthly/quarterly/yearly aggregation. Identifies seasonal patterns, emerging health issues, and medication usage trends. Supports optional predictive forecasting for proactive health management. Critical for identifying outbreaks and planning interventions.',
  })
  @ApiResponse({
    status: 200,
    description: 'Health trends retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getHealthTrends(@Query() query: GetHealthTrendsQueryDto) {
    return this.analyticsService.getHealthTrends(query);
  }

  @Get('health-metrics/student/:studentId')
  @CacheTTL(300) // Cache for 5 minutes
  @ApiOperation({
    summary: 'Get student health trends',
    description:
      '**PHI ENDPOINT** - Returns detailed health trend data for individual student. Includes vital signs history, health visit patterns, medication adherence, chronic condition management, and growth metrics. Requires proper authorization and access logging per HIPAA. Used for personalized health tracking and care plan monitoring.',
  })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'Student health metrics retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid student ID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions for student data',
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async getStudentHealthMetrics(
    @Param() params: GetStudentHealthMetricsParamDto,
    @Query() query: GetStudentHealthMetricsQueryDto,
  ) {
    return this.analyticsService.getStudentHealthMetrics(
      params.studentId,
      query,
    );
  }

  @Get('health-metrics/school/:schoolId')
  @CacheTTL(900) // Cache for 15 minutes
  @ApiOperation({
    summary: 'Get school-wide health metrics',
    description:
      'Comprehensive school-level health analytics dashboard. Includes population health summary, immunization compliance by vaccine and grade, incident analysis by type/location/time, chronic condition management, and medication usage patterns. Supports grade-level filtering and district-wide comparisons. Essential for school health program evaluation and resource planning.',
  })
  @ApiParam({ name: 'schoolId', description: 'School ID' })
  @ApiResponse({
    status: 200,
    description: 'School metrics retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid school ID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions for school data',
  })
  @ApiResponse({ status: 404, description: 'School not found' })
  async getSchoolMetrics(
    @Param() params: GetSchoolMetricsParamDto,
    @Query() query: GetSchoolMetricsQueryDto,
  ) {
    return this.analyticsService.getSchoolMetrics(params.schoolId, query);
  }

  /**
   * INCIDENT ANALYTICS ENDPOINTS
   */

  @Get('incidents/trends')
  @CacheTTL(900) // Cache for 15 minutes
  @ApiOperation({
    summary: 'Get incident trends',
    description:
      'Analyzes incident patterns over time with multiple grouping options (type, location, time of day, day of week, severity). Identifies high-risk areas, peak incident times, and seasonal patterns. Tracks incident rate trends (increasing/decreasing/stable). Used for safety planning, staff allocation, and preventive interventions. Supports filtering by incident type and severity.',
  })
  @ApiResponse({
    status: 200,
    description: 'Incident trends retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getIncidentTrends(@Query() query: GetIncidentTrendsQueryDto) {
    return this.analyticsService.getIncidentTrends(query);
  }

  @Get('incidents/by-location')
  @CacheTTL(900) // Cache for 15 minutes
  @ApiOperation({
    summary: 'Get incidents by location',
    description:
      'Spatial analysis of incident distribution across school facilities. Identifies high-incident areas (playground, gymnasium, cafeteria, etc.) for targeted safety interventions. Optional heat map visualization for facilities planning. Used for facility risk assessment, supervision planning, and safety equipment placement. Supports location-specific filtering.',
  })
  @ApiResponse({
    status: 200,
    description: 'Location-based incident data retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getIncidentsByLocation(@Query() query: GetIncidentsByLocationQueryDto) {
    return this.analyticsService.getIncidentsByLocation(query);
  }

  /**
   * MEDICATION ANALYTICS ENDPOINTS
   */

  @Get('medications/usage')
  @CacheTTL(900) // Cache for 15 minutes
  @ApiOperation({
    summary: 'Get medication usage statistics',
    description:
      'Comprehensive medication administration analytics. Tracks most-administered medications, usage by category (bronchodilators, stimulants, NSAIDs, etc.), administration frequency, and trends. Includes adherence rate calculations and common administration reasons. Essential for inventory management, controlled substance tracking, and identifying medication needs. Supports grouping by medication, category, student, or time.',
  })
  @ApiResponse({
    status: 200,
    description: 'Medication usage statistics retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMedicationUsage(@Query() query: GetMedicationUsageQueryDto) {
    return this.analyticsService.getMedicationUsage(query);
  }

  @Get('medications/adherence')
  @CacheTTL(900) // Cache for 15 minutes
  @ApiOperation({
    summary: 'Get medication adherence rates',
    description:
      'Medication adherence monitoring and compliance tracking. Calculates adherence percentages for chronic medications, identifies students below adherence threshold, tracks missed doses, and analyzes adherence trends. Supports student-specific and medication-specific filtering. Critical for chronic disease management, parent communication about medication compliance, and health outcome optimization.',
  })
  @ApiResponse({
    status: 200,
    description: 'Medication adherence data retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMedicationAdherence(@Query() query: GetMedicationAdherenceQueryDto) {
    return this.analyticsService.getMedicationAdherence(query);
  }

  /**
   * APPOINTMENT ANALYTICS ENDPOINTS
   */

  @Get('appointments/trends')
  @CacheTTL(900) // Cache for 15 minutes
  @ApiOperation({
    summary: 'Get appointment trends',
    description:
      'Appointment scheduling and completion analytics. Tracks appointment volume by type (screening, medication check, follow-up, immunization), completion rates, cancellation rates, and seasonal patterns. Analyzes trends by day/week/month and appointment status (scheduled, completed, cancelled, no-show). Used for capacity planning, appointment scheduling optimization, and identifying access barriers.',
  })
  @ApiResponse({
    status: 200,
    description: 'Appointment trends retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAppointmentTrends(@Query() query: GetAppointmentTrendsQueryDto) {
    return this.analyticsService.getAppointmentTrends(query);
  }

  @Get('appointments/no-show-rate')
  @CacheTTL(900) // Cache for 15 minutes
  @ApiOperation({
    summary: 'Get appointment no-show statistics',
    description:
      'Detailed no-show rate analysis and root cause identification. Calculates overall and type-specific no-show rates, tracks reasons for missed appointments (student absent, no consent, scheduling conflict), compares against target rates, and identifies trends. Includes actionable insights for reducing no-shows. Critical for appointment policy optimization and parent communication strategies.',
  })
  @ApiResponse({
    status: 200,
    description: 'No-show statistics retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getNoShowRate(@Query() query: GetNoShowRateQueryDto) {
    return this.analyticsService.getNoShowRate(query);
  }

  /**
   * DASHBOARD & SUMMARY ENDPOINTS
   */

  @Get('dashboard/nurse')
  @CacheTTL(60) // Cache for 1 minute (real-time dashboard)
  @ApiOperation({
    summary: 'Get nurse dashboard data',
    description:
      "Real-time operational dashboard for school nurses. Displays today's/this week's key metrics: total patients, active appointments, critical alerts, bed occupancy, average vital signs, and department status. Includes active health alerts (tachycardia, fever, hypoxemia, etc.) prioritized by severity. Shows upcoming tasks (medication administrations, screenings, follow-ups) with time and priority. Essential daily tool for nursing workflow management.",
  })
  @ApiResponse({
    status: 200,
    description: 'Nurse dashboard data retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getNurseDashboard(@Query() query: GetNurseDashboardQueryDto) {
    return this.analyticsService.getNurseDashboard(query);
  }

  @Get('dashboard/admin')
  @CacheTTL(300) // Cache for 5 minutes
  @ApiOperation({
    summary: 'Get admin dashboard data',
    description:
      'Executive-level healthcare analytics dashboard for administrators. Provides population health summary, compliance metrics (immunization, documentation, training, audit readiness), predictive insights (outbreak risk, stock shortages, capacity warnings), and top health conditions/medications. Supports district and school-level views with month/quarter/year time ranges. Optional financial data integration. Used for strategic planning and compliance oversight.',
  })
  @ApiResponse({
    status: 200,
    description: 'Admin dashboard data retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin role required',
  })
  async getAdminDashboard(@Query() query: GetAdminDashboardQueryDto) {
    return this.analyticsService.getAdminDashboard(query);
  }

  @Get('summary')
  @CacheTTL(300) // Cache for 5 minutes
  @ApiOperation({
    summary: 'Get overall platform summary',
    description:
      'System-wide health platform analytics. Aggregates data across districts and schools: total students, health visits, medication administrations, incidents, immunization compliance. Shows system-wide alerts and operational status. Supports multi-school/district filtering. Used for district-level reporting, board presentations, and system health monitoring. Provides big-picture view of healthcare operations.',
  })
  @ApiResponse({
    status: 200,
    description: 'Platform summary retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPlatformSummary(@Query() query: GetPlatformSummaryQueryDto) {
    return this.analyticsService.getPlatformSummary(query);
  }

  /**
   * CUSTOM REPORT ENDPOINTS
   */

  @Post('reports/custom')
  @ApiOperation({
    summary: 'Generate custom report',
    description:
      'Flexible custom report generation with multiple report types and formats. Supports: Health Metrics, Incident Analysis, Medication Usage, Appointment Summary, Compliance Status, Student Health Summary, and Immunization Reports. Output formats: JSON, PDF, CSV, XLSX. Configurable date ranges, filters (school, district, grade, students), and optional features (charts, trends, comparisons). Can schedule recurring reports and email to recipients. Generated reports are stored and accessible via report ID.',
  })
  @ApiResponse({
    status: 201,
    description: 'Custom report generated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid report parameters' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Report generation failed' })
  async generateCustomReport(
    @Body() dto: AnalyticsGenerateCustomReportDto,
    @Request() req: any,
  ) {
    const userId = req.user?.id || 'system';
    return this.analyticsService.generateCustomReport(dto, userId);
  }

  @Get('reports/:id')
  @CacheTTL(3600) // Cache for 1 hour
  @ApiOperation({
    summary: 'Get generated report',
    description:
      'Retrieves previously generated report by ID. Returns full report data including sections, findings, recommendations, charts, and tables. Supports metadata-only mode (includeData=false) for listing reports without downloading large datasets. Can override output format on retrieval. Used for accessing historical reports, compliance documentation, and scheduled report delivery.',
  })
  @ApiParam({ name: 'id', description: 'Report ID' })
  @ApiResponse({
    status: 200,
    description: 'Report retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid report ID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async getGeneratedReport(
    @Param() params: GetReportParamDto,
    @Query() query: GetReportQueryDto,
  ) {
    return this.analyticsService.getGeneratedReport(params.id, query);
  }
}
