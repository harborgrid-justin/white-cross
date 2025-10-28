import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { HealthTrendAnalyticsService } from './services/health-trend-analytics.service';
import { ComplianceReportGeneratorService } from './services/compliance-report-generator.service';
import {
  GetPopulationSummaryDto,
  GetConditionTrendsDto,
  GetMedicationTrendsDto,
  GetIncidentAnalyticsDto,
  GetImmunizationDashboardDto,
  GetAbsenceCorrelationDto,
  GetPredictiveInsightsDto,
  CompareCohortsDto,
  GetHealthMetricsDto,
  GenerateImmunizationReportDto,
  GenerateControlledSubstanceReportDto,
  GenerateHIPAAAuditReportDto,
  GenerateScreeningReportDto,
  ScheduleRecurringReportDto,
  ExportReportDto,
  DistributeReportDto,
  GetReportsFilterDto,
} from './dto';

/**
 * Analytics Controller
 * Handles health trend analytics and compliance reporting endpoints
 */
@ApiTags('Analytics')
@Controller('analytics')
@UseInterceptors(CacheInterceptor)
export class AnalyticsController {
  constructor(
    private readonly healthTrendService: HealthTrendAnalyticsService,
    private readonly reportGeneratorService: ComplianceReportGeneratorService,
  ) {}

  // Health Trend Analytics Endpoints

  @Get('population-summary')
  @CacheTTL(300) // Cache for 5 minutes
  @ApiOperation({ summary: 'Get population health summary' })
  @ApiResponse({ status: 200, description: 'Population health summary retrieved successfully' })
  async getPopulationSummary(@Query() query: GetPopulationSummaryDto) {
    const customRange =
      query.customStart && query.customEnd
        ? { start: new Date(query.customStart), end: new Date(query.customEnd) }
        : undefined;

    return this.healthTrendService.getPopulationSummary(query.schoolId, query.period, customRange);
  }

  @Get('condition-trends')
  @CacheTTL(900) // Cache for 15 minutes
  @ApiOperation({ summary: 'Get health condition trends over time' })
  @ApiResponse({ status: 200, description: 'Condition trends retrieved successfully' })
  async getConditionTrends(@Query() query: GetConditionTrendsDto) {
    return this.healthTrendService.getConditionTrends(query.schoolId, query.conditions, query.period);
  }

  @Get('medication-trends')
  @CacheTTL(900) // Cache for 15 minutes
  @ApiOperation({ summary: 'Get medication usage trends' })
  @ApiResponse({ status: 200, description: 'Medication trends retrieved successfully' })
  async getMedicationTrends(@Query() query: GetMedicationTrendsDto) {
    return this.healthTrendService.getMedicationTrends(query.schoolId, query.period);
  }

  @Get('incident-analytics')
  @CacheTTL(900) // Cache for 15 minutes
  @ApiOperation({ summary: 'Get incident analytics by type, location, and time' })
  @ApiResponse({ status: 200, description: 'Incident analytics retrieved successfully' })
  async getIncidentAnalytics(@Query() query: GetIncidentAnalyticsDto) {
    return this.healthTrendService.getIncidentAnalytics(query.schoolId, query.period);
  }

  @Get('immunization-dashboard')
  @CacheTTL(3600) // Cache for 1 hour
  @ApiOperation({ summary: 'Get immunization compliance dashboard' })
  @ApiResponse({ status: 200, description: 'Immunization dashboard retrieved successfully' })
  async getImmunizationDashboard(@Query() query: GetImmunizationDashboardDto) {
    return this.healthTrendService.getImmunizationDashboard(query.schoolId);
  }

  @Get('absence-correlation')
  @CacheTTL(900) // Cache for 15 minutes
  @ApiOperation({ summary: 'Get absence correlation with health visits' })
  @ApiResponse({ status: 200, description: 'Absence correlation data retrieved successfully' })
  async getAbsenceCorrelation(@Query() query: GetAbsenceCorrelationDto) {
    return this.healthTrendService.getAbsenceCorrelation(query.schoolId, query.period);
  }

  @Get('predictive-insights')
  @CacheTTL(3600) // Cache for 1 hour
  @ApiOperation({ summary: 'Get AI/ML predictive insights for health risks' })
  @ApiResponse({ status: 200, description: 'Predictive insights retrieved successfully' })
  async getPredictiveInsights(@Query() query: GetPredictiveInsightsDto) {
    return this.healthTrendService.getPredictiveInsights(query.schoolId);
  }

  @Post('compare-cohorts')
  @ApiOperation({ summary: 'Compare health metrics across student cohorts' })
  @ApiResponse({ status: 200, description: 'Cohort comparison completed successfully' })
  async compareCohorts(@Body() body: CompareCohortsDto) {
    return this.healthTrendService.compareCohorts(body.schoolId, body.cohorts);
  }

  @Get('health-metrics')
  @CacheTTL(300) // Cache for 5 minutes
  @ApiOperation({ summary: 'Get health metrics summary' })
  @ApiResponse({ status: 200, description: 'Health metrics retrieved successfully' })
  async getHealthMetrics(@Query() query: GetHealthMetricsDto) {
    return this.healthTrendService.getHealthMetrics(query.schoolId, query.period);
  }

  // Compliance Report Generation Endpoints

  @Post('reports/immunization')
  @ApiOperation({ summary: 'Generate immunization compliance report' })
  @ApiResponse({ status: 201, description: 'Immunization report generated successfully' })
  async generateImmunizationReport(@Body() body: GenerateImmunizationReportDto) {
    return this.reportGeneratorService.generateImmunizationReport(body);
  }

  @Post('reports/controlled-substance')
  @ApiOperation({ summary: 'Generate controlled substance report' })
  @ApiResponse({ status: 201, description: 'Controlled substance report generated successfully' })
  async generateControlledSubstanceReport(@Body() body: GenerateControlledSubstanceReportDto) {
    return this.reportGeneratorService.generateControlledSubstanceReport(body);
  }

  @Post('reports/hipaa-audit')
  @ApiOperation({ summary: 'Generate HIPAA audit report' })
  @ApiResponse({ status: 201, description: 'HIPAA audit report generated successfully' })
  async generateHIPAAAuditReport(@Body() body: GenerateHIPAAAuditReportDto) {
    return this.reportGeneratorService.generateHIPAAAuditReport(body);
  }

  @Post('reports/screening')
  @ApiOperation({ summary: 'Generate health screening compliance report' })
  @ApiResponse({ status: 201, description: 'Health screening report generated successfully' })
  async generateScreeningReport(@Body() body: GenerateScreeningReportDto) {
    return this.reportGeneratorService.generateScreeningReport(body);
  }

  @Get('reports')
  @CacheTTL(60) // Cache for 1 minute
  @ApiOperation({ summary: 'Get all reports with optional filters' })
  @ApiResponse({ status: 200, description: 'Reports retrieved successfully' })
  async getReports(@Query() filters: GetReportsFilterDto) {
    return this.reportGeneratorService.getReports(filters);
  }

  @Get('reports/:id')
  @CacheTTL(3600) // Cache for 1 hour
  @ApiOperation({ summary: 'Get report by ID' })
  @ApiParam({ name: 'id', description: 'Report ID' })
  @ApiResponse({ status: 200, description: 'Report retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async getReport(@Param('id') id: string) {
    return this.reportGeneratorService.getReport(id);
  }

  @Post('reports/schedule')
  @ApiOperation({ summary: 'Schedule recurring report generation' })
  @ApiResponse({ status: 201, description: 'Recurring report scheduled successfully' })
  async scheduleRecurringReport(@Body() body: ScheduleRecurringReportDto) {
    return this.reportGeneratorService.scheduleRecurringReport(body);
  }

  @Get('reports/scheduled/list')
  @ApiOperation({ summary: 'Get all scheduled report configurations' })
  @ApiResponse({ status: 200, description: 'Scheduled reports retrieved successfully' })
  async getScheduledReports() {
    return this.reportGeneratorService.getScheduledReports();
  }

  @Post('reports/:id/export')
  @ApiOperation({ summary: 'Export report to specified format' })
  @ApiParam({ name: 'id', description: 'Report ID' })
  @ApiResponse({ status: 200, description: 'Report exported successfully' })
  async exportReport(@Param('id') id: string, @Body() body: ExportReportDto) {
    return this.reportGeneratorService.exportReport(id, body.format);
  }

  @Post('reports/:id/distribute')
  @ApiOperation({ summary: 'Distribute report to recipients' })
  @ApiParam({ name: 'id', description: 'Report ID' })
  @ApiResponse({ status: 200, description: 'Report distributed successfully' })
  async distributeReport(@Param('id') id: string, @Body() body: DistributeReportDto) {
    await this.reportGeneratorService.distributeReport(id, body.recipients);
    return { message: 'Report distributed successfully' };
  }
}
