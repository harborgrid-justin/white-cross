import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ReportType } from '../constants/report.constants';
import { HealthReportsService } from './health-reports.service';
import { MedicationReportsService } from './medication-reports.service';
import { IncidentReportsService } from './incident-reports.service';
import { AttendanceReportsService } from './attendance-reports.service';
import { ComplianceReportsService } from './compliance-reports.service';
import { DashboardService } from './dashboard.service';
import { ReportResult } from '../interfaces/report-types.interface';
import { HealthTrendsDto } from '../dto/health-trends.dto';
import { MedicationUsageDto } from '../dto/medication-usage.dto';
import { IncidentStatisticsDto } from '../dto/incident-statistics.dto';
import { AttendanceCorrelationDto } from '../dto/attendance-correlation.dto';
import { BaseReportDto } from '../dto/base-report.dto';

import { BaseService } from '@/common/base';
/**
 * Report Generation Service
 * Main orchestrator for report generation across all report types
 * Implements factory pattern for report type selection
 */
@Injectable()
export class ReportGenerationService extends BaseService {
  constructor(
    private readonly healthReportsService: HealthReportsService,
    private readonly medicationReportsService: MedicationReportsService,
    private readonly incidentReportsService: IncidentReportsService,
    private readonly attendanceReportsService: AttendanceReportsService,
    private readonly complianceReportsService: ComplianceReportsService,
    private readonly dashboardService: DashboardService,
  ) {}

  /**
   * Generate report by type
   */
  async generateReport(reportType: ReportType, parameters: any): Promise<ReportResult<any>> {
    const startTime = Date.now();

    try {
      let data: any;

      switch (reportType) {
        case ReportType.HEALTH_TRENDS:
          data = await this.healthReportsService.getHealthTrends(parameters as HealthTrendsDto);
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

      this.logInfo(
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
      this.logError(`Error generating ${reportType} report:`, error);
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
      const arrayProps = Object.keys(data).filter((key) => Array.isArray((data as Record<string, unknown>)[key]));
      if (arrayProps.length > 0) {
        const firstArrayKey = arrayProps[0];
        const arrayData = (data as Record<string, unknown>)[firstArrayKey];
        return Array.isArray(arrayData) ? arrayData.length : 1;
      }
      return 1;
    }
    return 0;
  }
}
