import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReportGenerationService } from '../services/report-generation.service';
import { ReportExportService } from '../services/report-export.service';
import { DashboardService } from '../services/dashboard.service';
import { HealthTrendsDto } from '../dto/health-trends.dto';
import { MedicationUsageDto } from '../dto/medication-usage.dto';
import { IncidentStatisticsDto } from '../dto/incident-statistics.dto';
import { AttendanceCorrelationDto } from '../dto/attendance-correlation.dto';
import { BaseReportDto } from '../dto/base-report.dto';
import { ExportOptionsDto } from '../dto/export-options.dto';
import { DashboardMetricsDto } from '../dto/dashboard-metrics.dto';
import { ReportType } from '../constants/report.constants';

/**
 * Reports Controller
 * Handles all report generation and export endpoints
 */
@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  private readonly logger = new Logger(ReportsController.name);

  constructor(
    private readonly reportGenerationService: ReportGenerationService,
    private readonly reportExportService: ReportExportService,
    private readonly dashboardService: DashboardService,
  ) {}

  /**
   * Get health trends report
   */
  @Get('health-trends')
  @ApiOperation({ summary: 'Get health trends report' })
  @ApiResponse({ status: 200, description: 'Health trends report generated' })
  async getHealthTrends(@Query() dto: HealthTrendsDto) {
    this.logger.log('Generating health trends report');
    return this.reportGenerationService.generateReport(
      ReportType.HEALTH_TRENDS,
      dto,
    );
  }

  /**
   * Get medication usage report
   */
  @Get('medication-usage')
  @ApiOperation({ summary: 'Get medication usage report' })
  @ApiResponse({ status: 200, description: 'Medication usage report generated' })
  async getMedicationUsage(@Query() dto: MedicationUsageDto) {
    this.logger.log('Generating medication usage report');
    return this.reportGenerationService.generateReport(
      ReportType.MEDICATION_USAGE,
      dto,
    );
  }

  /**
   * Get incident statistics report
   */
  @Get('incident-statistics')
  @ApiOperation({ summary: 'Get incident statistics report' })
  @ApiResponse({
    status: 200,
    description: 'Incident statistics report generated',
  })
  async getIncidentStatistics(@Query() dto: IncidentStatisticsDto) {
    this.logger.log('Generating incident statistics report');
    return this.reportGenerationService.generateReport(
      ReportType.INCIDENT_STATISTICS,
      dto,
    );
  }

  /**
   * Get attendance correlation report
   */
  @Get('attendance-correlation')
  @ApiOperation({ summary: 'Get attendance correlation report' })
  @ApiResponse({
    status: 200,
    description: 'Attendance correlation report generated',
  })
  async getAttendanceCorrelation(@Query() dto: AttendanceCorrelationDto) {
    this.logger.log('Generating attendance correlation report');
    return this.reportGenerationService.generateReport(
      ReportType.ATTENDANCE_CORRELATION,
      dto,
    );
  }

  /**
   * Get compliance report
   */
  @Get('compliance')
  @ApiOperation({ summary: 'Get compliance report' })
  @ApiResponse({ status: 200, description: 'Compliance report generated' })
  async getComplianceReport(@Query() dto: BaseReportDto) {
    this.logger.log('Generating compliance report');
    return this.reportGenerationService.generateReport(
      ReportType.COMPLIANCE,
      dto,
    );
  }

  /**
   * Get dashboard metrics
   */
  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard metrics' })
  @ApiResponse({ status: 200, description: 'Dashboard metrics retrieved' })
  async getDashboardMetrics(@Query() dto: DashboardMetricsDto) {
    this.logger.log('Retrieving dashboard metrics');
    return this.dashboardService.getRealTimeDashboard();
  }

  /**
   * Export report to specific format
   */
  @Post('export')
  @ApiOperation({ summary: 'Export report to specific format' })
  @ApiResponse({ status: 200, description: 'Report exported successfully' })
  async exportReport(@Body() dto: ExportOptionsDto) {
    this.logger.log(`Exporting report: ${dto.reportType} as ${dto.format}`);
    return this.reportExportService.exportReport(dto.data, dto);
  }

  /**
   * Generate custom report
   */
  @Post('generate')
  @ApiOperation({ summary: 'Generate custom report' })
  @ApiResponse({ status: 200, description: 'Custom report generated' })
  async generateCustomReport(
    @Body() body: { reportType: ReportType; parameters: any },
  ) {
    this.logger.log(`Generating custom report: ${body.reportType}`);
    return this.reportGenerationService.generateReport(
      body.reportType,
      body.parameters,
    );
  }
}
