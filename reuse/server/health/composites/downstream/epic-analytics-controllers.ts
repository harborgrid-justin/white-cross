/**
 * LOC: HLTH-DS-ANALYTICS-CTRL-001
 * File: /reuse/server/health/composites/downstream/epic-analytics-controllers.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - ../epic-analytics-reporting-composites
 */

/**
 * File: /reuse/server/health/composites/downstream/epic-analytics-controllers.ts
 * Locator: WC-DS-ANALYTICS-CTRL-001
 * Purpose: Epic Analytics Controllers - REST API controllers for Epic analytics
 */

import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  EpicAnalyticsReportingCompositeService,
  AnalyticsQuery,
  QualityMeasureResult,
  DashboardMetrics,
  ProviderProductivityMetrics,
} from '../epic-analytics-reporting-composites';

@Controller('api/epic/analytics')
@ApiTags('Epic Analytics API')
export class EpicAnalyticsController {
  constructor(
    private readonly analyticsService: EpicAnalyticsReportingCompositeService,
  ) {}

  /**
   * 1. GET /quality-measures/:measureId
   */
  @Get('quality-measures/:measureId')
  @ApiOperation({ summary: 'Get quality measure performance' })
  @ApiResponse({ status: 200, type: QualityMeasureResult })
  async getQualityMeasure(
    @Param('measureId') measureId: string,
    @Query() query: AnalyticsQuery,
  ): Promise<QualityMeasureResult> {
    return this.analyticsService.calculateCQMMeasurePerformance(measureId, query);
  }

  /**
   * 2. GET /dashboard/realtime
   */
  @Get('dashboard/realtime')
  @ApiOperation({ summary: 'Get real-time operational dashboard' })
  @ApiResponse({ status: 200, type: DashboardMetrics })
  async getRealtimeDashboard(): Promise<DashboardMetrics> {
    return this.analyticsService.generateRealtimeOperationalDashboard();
  }

  /**
   * 3. GET /provider/:providerId/productivity
   */
  @Get('provider/:providerId/productivity')
  @ApiOperation({ summary: 'Get provider productivity metrics' })
  @ApiResponse({ status: 200, type: ProviderProductivityMetrics })
  async getProviderProductivity(
    @Param('providerId') providerId: string,
    @Query() query: AnalyticsQuery,
  ): Promise<ProviderProductivityMetrics> {
    return this.analyticsService.calculateProviderProductivityMetrics(
      providerId,
      query,
    );
  }

  /**
   * 4. GET /revenue-cycle
   */
  @Get('revenue-cycle')
  @ApiOperation({ summary: 'Get revenue cycle metrics' })
  async getRevenueCycleMetrics(@Query() query: AnalyticsQuery): Promise<any> {
    return this.analyticsService.calculateRevenueCycleMetrics(query);
  }

  /**
   * 5. GET /ed-throughput
   */
  @Get('ed-throughput')
  @ApiOperation({ summary: 'Get ED throughput metrics' })
  async getEDThroughput(@Query() query: AnalyticsQuery): Promise<any> {
    return this.analyticsService.calculateEDThroughputMetrics(query);
  }

  /**
   * 6. GET /readmission-rates
   */
  @Get('readmission-rates')
  @ApiOperation({ summary: 'Calculate readmission rates' })
  async getReadmissionRates(@Query() query: AnalyticsQuery): Promise<any> {
    return this.analyticsService.calculateReadmissionRates(query);
  }

  /**
   * 7. POST /reports/custom
   */
  @Post('reports/custom')
  @ApiOperation({ summary: 'Generate custom analytics report' })
  async generateCustomReport(@Body() reportConfig: any): Promise<any> {
    return this.analyticsService.generateCustomAnalyticsReport(reportConfig);
  }

  /**
   * 8. GET /export/:reportType
   */
  @Get('export/:reportType')
  @ApiOperation({ summary: 'Export analytics to BI tool' })
  async exportToBITool(
    @Param('reportType') reportType: string,
    @Query('format') format: string,
  ): Promise<any> {
    return this.analyticsService.exportAnalyticsToBITool(format, reportType);
  }
}

export default EpicAnalyticsController;
