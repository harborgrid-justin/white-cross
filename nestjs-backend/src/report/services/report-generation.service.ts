import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ReportType } from '../constants/report.constants';
import { HealthReportsService } from './health-reports.service';
import { MedicationReportsService } from './medication-reports.service';
import { IncidentReportsService } from './incident-reports.service';
import { AttendanceReportsService } from './attendance-reports.service';
import { ComplianceReportsService } from './compliance-reports.service';
import { DashboardService } from './dashboard.service';
import { ReportExportService } from './report-export.service';
import { ReportResult } from '../interfaces/report-types.interface';
import { HealthTrendsDto } from '../dto/health-trends.dto';
import { MedicationUsageDto } from '../dto/medication-usage.dto';
import { IncidentStatisticsDto } from '../dto/incident-statistics.dto';
import { AttendanceCorrelationDto } from '../dto/attendance-correlation.dto';
import { BaseReportDto } from '../dto/base-report.dto';

/**
 * Report Generation Service
 * Main orchestrator for report generation across all report types
 * Implements factory pattern for report type selection
 */
@Injectable()
export class ReportGenerationService {
  private readonly logger = new Logger(ReportGenerationService.name);

  constructor(
    private readonly healthReportsService: HealthReportsService,
    private readonly medicationReportsService: MedicationReportsService,
    private readonly incidentReportsService: IncidentReportsService,
    private readonly attendanceReportsService: AttendanceReportsService,
    private readonly complianceReportsService: ComplianceReportsService,
    private readonly dashboardService: DashboardService,
    private readonly reportExportService: ReportExportService,
  ) {}

  /**
   * Generate report by type
   */
  async generateReport(
    reportType: ReportType,
    parameters: any,
  ): Promise<ReportResult<any>> {
    const startTime = Date.now();

    try {
      let data: any;

      switch (reportType) {
        case ReportType.HEALTH_TRENDS:
          data = await this.healthReportsService.getHealthTrends(
            parameters as HealthTrendsDto,
          );
          break;

        case ReportType.MEDICATION_USAGE:
          data = await this.medicationReportsService.getMedicationUsageReport(
            parameters as MedicationUsageDto,
          );
          break;

        case ReportType.INCIDENT_STATISTICS:
          data = await this.incidentReportsService.getIncidentStatistics(
            parameters as IncidentStatisticsDto,
          );
          break;

        case ReportType.ATTENDANCE_CORRELATION:
          data = await this.attendanceReportsService.getAttendanceCorrelation(
            parameters as AttendanceCorrelationDto,
          );
          break;

        case ReportType.COMPLIANCE:
          data = await this.complianceReportsService.getComplianceReport(
            parameters as BaseReportDto,
          );
          break;

        case ReportType.DASHBOARD:
          data = await this.dashboardService.getRealTimeDashboard();
          break;

        default:
          throw new BadRequestException(`Unsupported report type: ${reportType}`);
      }

      const executionTime = Date.now() - startTime;
      const recordCount = this.getRecordCount(data);

      this.logger.log(
        `Report generated: ${reportType}, records: ${recordCount}, time: ${executionTime}ms`,
      );

      return {
        data,
        metadata: {
          generatedAt: new Date(),
          reportType,
          recordCount,
          parameters,
          executionTime,
        },
      };
    } catch (error) {
      this.logger.error(`Error generating ${reportType} report:`, error);
      throw error;
    }
  }

  /**
   * Get record count from report data
   */
  private getRecordCount(data: any): number {
    if (Array.isArray(data)) {
      return data.length;
    } else if (typeof data === 'object' && data !== null) {
      // Find the first array property and count its length
      const arrayProps = Object.keys(data).filter(key => Array.isArray(data[key]));
      if (arrayProps.length > 0) {
        return data[arrayProps[0]].length;
      }
      return 1;
    }
    return 0;
  }
}
