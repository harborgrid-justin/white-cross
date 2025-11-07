import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
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
 * Comprehensive reporting system for healthcare analytics, compliance, and operational insights.
 * All reports support real-time data analysis with configurable date ranges and export options.
 */
@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  private readonly logger = new Logger(ReportsController.name);

  constructor(
    private readonly reportGenerationService: ReportGenerationService,
    private readonly reportExportService: ReportExportService,
    private readonly dashboardService: DashboardService,
  ) {}

  /**
   * Generate health trends analysis report
   */
  @Get('health-trends')
  @ApiOperation({
    summary: 'Generate health trends report',
    description:
      'Creates comprehensive health trend analysis over time periods. Tracks changes in health conditions, medication usage patterns, immunization compliance, and incident rates. Supports school-level and district-level aggregation with seasonal pattern identification and predictive insights.',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date for analysis period',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date for analysis period',
    example: '2024-12-31',
  })
  @ApiQuery({
    name: 'schoolId',
    required: false,
    description: 'Filter by specific school',
  })
  @ApiQuery({
    name: 'gradeLevel',
    required: false,
    description: 'Filter by grade level',
  })
  @ApiQuery({
    name: 'includeGraphs',
    required: false,
    description: 'Include trend visualizations',
    example: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Health trends report generated successfully',
    schema: {
      type: 'object',
      properties: {
        summary: { type: 'object' },
        trends: { type: 'array' },
        recommendations: { type: 'array' },
        visualizations: { type: 'array' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  async getHealthTrends(@Query() dto: HealthTrendsDto) {
    this.logger.log('Generating health trends report');
    return this.reportGenerationService.generateReport(
      ReportType.HEALTH_TRENDS,
      dto,
    );
  }

  /**
   * Generate medication usage analytics report
   */
  @Get('medication-usage')
  @ApiOperation({
    summary: 'Generate medication usage report',
    description:
      'Analyzes medication administration patterns, adherence rates, and usage trends. Includes controlled substance tracking, most-used medications, administration compliance, and cost analysis. Essential for inventory management and clinical oversight.',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date for usage analysis',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date for usage analysis',
  })
  @ApiQuery({
    name: 'medicationType',
    required: false,
    description: 'Filter by medication type (controlled, OTC, prescription)',
  })
  @ApiQuery({
    name: 'includeAdherence',
    required: false,
    description: 'Include adherence calculations',
    example: true,
  })
  @ApiQuery({
    name: 'groupBy',
    required: false,
    description: 'Group results by (medication, student, condition)',
    example: 'medication',
  })
  @ApiResponse({
    status: 200,
    description: 'Medication usage report generated successfully',
    schema: {
      type: 'object',
      properties: {
        totalAdministrations: { type: 'number' },
        topMedications: { type: 'array' },
        adherenceRates: { type: 'object' },
        trends: { type: 'array' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  async getMedicationUsage(@Query() dto: MedicationUsageDto) {
    this.logger.log('Generating medication usage report');
    return this.reportGenerationService.generateReport(
      ReportType.MEDICATION_USAGE,
      dto,
    );
  }

  /**
   * Generate incident statistics and safety analysis report
   */
  @Get('incident-statistics')
  @ApiOperation({
    summary: 'Generate incident statistics report',
    description:
      'Comprehensive safety and incident analysis including injury types, locations, time patterns, and severity trends. Identifies high-risk areas and times for targeted safety interventions and resource allocation.',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date for incident analysis',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date for incident analysis',
  })
  @ApiQuery({
    name: 'incidentType',
    required: false,
    description: 'Filter by incident type (injury, illness, emergency)',
  })
  @ApiQuery({
    name: 'location',
    required: false,
    description: 'Filter by location (classroom, playground, gymnasium)',
  })
  @ApiQuery({
    name: 'severity',
    required: false,
    description: 'Filter by severity level',
  })
  @ApiResponse({
    status: 200,
    description: 'Incident statistics report generated successfully',
    schema: {
      type: 'object',
      properties: {
        totalIncidents: { type: 'number' },
        byType: { type: 'object' },
        byLocation: { type: 'object' },
        timePatterns: { type: 'object' },
        recommendations: { type: 'array' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  async getIncidentStatistics(@Query() dto: IncidentStatisticsDto) {
    this.logger.log('Generating incident statistics report');
    return this.reportGenerationService.generateReport(
      ReportType.INCIDENT_STATISTICS,
      dto,
    );
  }

  /**
   * Generate attendance and health correlation analysis
   */
  @Get('attendance-correlation')
  @ApiOperation({
    summary: 'Generate attendance correlation report',
    description:
      'Analyzes correlations between health visits and attendance patterns. Identifies students with frequent health-related absences, chronic conditions affecting attendance, and seasonal health patterns impacting school participation.',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date for correlation analysis',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date for correlation analysis',
  })
  @ApiQuery({
    name: 'minimumVisits',
    required: false,
    description: 'Minimum health visits threshold',
    example: '3',
  })
  @ApiQuery({
    name: 'includeChronicConditions',
    required: false,
    description: 'Include chronic condition analysis',
    example: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Attendance correlation report generated successfully',
    schema: {
      type: 'object',
      properties: {
        correlationCoefficient: { type: 'number' },
        studentsAtRisk: { type: 'array' },
        seasonalPatterns: { type: 'object' },
        recommendations: { type: 'array' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Invalid correlation parameters' })
  async getAttendanceCorrelation(@Query() dto: AttendanceCorrelationDto) {
    this.logger.log('Generating attendance correlation report');
    return this.reportGenerationService.generateReport(
      ReportType.ATTENDANCE_CORRELATION,
      dto,
    );
  }

  /**
   * Generate comprehensive compliance audit report
   */
  @Get('compliance')
  @ApiOperation({
    summary: 'Generate compliance audit report',
    description:
      'Comprehensive HIPAA/FERPA compliance audit including documentation completeness, consent management, audit trail integrity, policy adherence, and violation tracking. Essential for regulatory compliance and accreditation.',
  })
  @ApiQuery({
    name: 'auditPeriod',
    required: false,
    description: 'Audit period (monthly, quarterly, annual)',
    example: 'quarterly',
  })
  @ApiQuery({
    name: 'includeRecommendations',
    required: false,
    description: 'Include compliance recommendations',
    example: true,
  })
  @ApiQuery({
    name: 'complianceType',
    required: false,
    description: 'Filter by compliance type (HIPAA, FERPA, both)',
    example: 'HIPAA',
  })
  @ApiResponse({
    status: 200,
    description: 'Compliance report generated successfully',
    schema: {
      type: 'object',
      properties: {
        overallScore: { type: 'number' },
        hipaaCompliance: { type: 'object' },
        ferpaCompliance: { type: 'object' },
        violations: { type: 'array' },
        actionItems: { type: 'array' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Insufficient permissions for compliance reporting',
  })
  async getComplianceReport(@Query() dto: BaseReportDto) {
    this.logger.log('Generating compliance report');
    return this.reportGenerationService.generateReport(
      ReportType.COMPLIANCE,
      dto,
    );
  }

  /**
   * Retrieve real-time dashboard metrics
   */
  @Get('dashboard')
  @ApiOperation({
    summary: 'Get real-time dashboard metrics',
    description:
      'Provides real-time operational dashboard data including active students, health visits today, critical alerts, medication due, and system status. Updates every 5 minutes for operational awareness.',
  })
  @ApiQuery({
    name: 'schoolId',
    required: false,
    description: 'Filter by specific school for district users',
  })
  @ApiQuery({
    name: 'refreshRate',
    required: false,
    description: 'Data refresh rate in minutes',
    example: '5',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard metrics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        activeStudents: { type: 'number' },
        todayVisits: { type: 'number' },
        criticalAlerts: { type: 'array' },
        medicationsDue: { type: 'number' },
        systemStatus: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getDashboardMetrics(@Query() dto: DashboardMetricsDto) {
    this.logger.log('Retrieving dashboard metrics');
    return this.dashboardService.getRealTimeDashboard();
  }

  /**
   * Export report to specific format
   */
  @Post('export')
  @ApiOperation({
    summary: 'Export report to specific format',
    description:
      'Exports generated reports to various formats including PDF, Excel, CSV, and Word. Supports password protection for sensitive healthcare data and custom branding for organizational requirements. Maintains audit trail of all report exports.',
  })
  @ApiBody({
    type: ExportOptionsDto,
    description: 'Export configuration and data',
    schema: {
      type: 'object',
      required: ['reportType', 'format', 'data'],
      properties: {
        reportType: {
          type: 'string',
          enum: [
            'health-trends',
            'medication-usage',
            'incident-statistics',
            'attendance-correlation',
            'compliance',
          ],
          example: 'health-trends',
        },
        format: {
          type: 'string',
          enum: ['pdf', 'excel', 'csv', 'word'],
          example: 'pdf',
        },
        data: {
          type: 'object',
          description: 'Report data to export',
        },
        options: {
          type: 'object',
          properties: {
            password: {
              type: 'string',
              description: 'Password protection for sensitive reports',
            },
            includeCharts: {
              type: 'boolean',
              example: true,
              description: 'Include visualizations in export',
            },
            watermark: { type: 'string', description: 'Custom watermark text' },
            branding: {
              type: 'boolean',
              example: true,
              description: 'Include organizational branding',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Report exported successfully',
    schema: {
      type: 'object',
      properties: {
        exportId: {
          type: 'string',
          example: 'export_12345',
          description: 'Unique export identifier',
        },
        downloadUrl: {
          type: 'string',
          example: '/api/downloads/report_12345.pdf',
          description: 'Secure download URL',
        },
        filename: { type: 'string', example: 'health_trends_2024_Q1.pdf' },
        fileSize: {
          type: 'number',
          example: 2048576,
          description: 'File size in bytes',
        },
        expiresAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T12:00:00Z',
          description: 'Download link expiration',
        },
        format: { type: 'string', example: 'pdf' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - invalid export parameters or unsupported format',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions for report export',
  })
  @ApiResponse({
    status: 413,
    description: 'Payload Too Large - report data exceeds export limits',
  })
  async exportReport(@Body() dto: ExportOptionsDto) {
    this.logger.log(`Exporting report: ${dto.reportType} as ${dto.format}`);
    return this.reportExportService.exportReport(dto.data, dto);
  }

  /**
   * Generate custom report
   */
  @Post('generate')
  @ApiOperation({
    summary: 'Generate custom report',
    description:
      'Creates custom reports with user-defined parameters and filters. Supports flexible data selection, custom date ranges, multi-dimensional analysis, and real-time data processing. Ideal for ad-hoc analysis and specialized reporting requirements.',
  })
  @ApiBody({
    description: 'Custom report configuration',
    schema: {
      type: 'object',
      required: ['reportType', 'parameters'],
      properties: {
        reportType: {
          type: 'string',
          enum: [
            'health-trends',
            'medication-usage',
            'incident-statistics',
            'attendance-correlation',
            'compliance',
            'custom-analytics',
          ],
          example: 'custom-analytics',
        },
        parameters: {
          type: 'object',
          properties: {
            dateRange: {
              type: 'object',
              properties: {
                startDate: {
                  type: 'string',
                  format: 'date',
                  example: '2024-01-01',
                },
                endDate: {
                  type: 'string',
                  format: 'date',
                  example: '2024-12-31',
                },
              },
            },
            filters: {
              type: 'object',
              properties: {
                schoolIds: { type: 'array', items: { type: 'string' } },
                gradeLevels: { type: 'array', items: { type: 'string' } },
                conditions: { type: 'array', items: { type: 'string' } },
                departments: { type: 'array', items: { type: 'string' } },
              },
            },
            metrics: {
              type: 'array',
              items: { type: 'string' },
              example: ['visit_count', 'medication_adherence', 'incident_rate'],
            },
            groupBy: {
              type: 'array',
              items: { type: 'string' },
              example: ['month', 'grade', 'condition'],
            },
            includeGraphs: { type: 'boolean', example: true },
            includeRecommendations: { type: 'boolean', example: false },
          },
        },
        outputOptions: {
          type: 'object',
          properties: {
            format: {
              type: 'string',
              enum: ['json', 'excel', 'pdf'],
              example: 'json',
            },
            includeRawData: { type: 'boolean', example: false },
            maxRecords: { type: 'number', example: 10000 },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Custom report generated successfully',
    schema: {
      type: 'object',
      properties: {
        reportId: {
          type: 'string',
          example: 'report_67890',
          description: 'Unique report identifier',
        },
        generatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T10:30:00Z',
        },
        reportType: { type: 'string', example: 'custom-analytics' },
        summary: {
          type: 'object',
          properties: {
            totalRecords: { type: 'number', example: 1250 },
            dateRange: { type: 'string', example: '2024-01-01 to 2024-12-31' },
            dataPoints: { type: 'number', example: 52 },
          },
        },
        data: {
          type: 'object',
          description:
            'Report data structure varies by report type and parameters',
        },
        visualizations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string', example: 'line_chart' },
              title: { type: 'string', example: 'Health Visits Over Time' },
              data: { type: 'object' },
            },
          },
        },
        recommendations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              priority: {
                type: 'string',
                enum: ['high', 'medium', 'low'],
                example: 'high',
              },
              category: { type: 'string', example: 'safety' },
              recommendation: {
                type: 'string',
                example:
                  'Increase playground supervision during peak injury hours',
              },
              evidence: {
                type: 'string',
                example:
                  'Based on 65% of playground injuries occurring between 12-1 PM',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - invalid report parameters or unsupported report type',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - insufficient permissions for custom report generation',
  })
  @ApiResponse({
    status: 422,
    description:
      'Unprocessable Entity - report parameters conflict or produce no data',
  })
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
