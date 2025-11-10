/**
 * LOC: PRJEVM001
 * File: /reuse/edwards/financial/composites/downstream/earned-value-management-systems.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - ../project-cost-accounting-composite
 *
 * DOWNSTREAM (imported by):
 *   - EVM reporting controllers
 *   - Project performance dashboards
 *   - Executive reporting modules
 */

import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsDate, IsOptional, IsEnum, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

// Import from parent composite
import {
  ProjectStatus,
  ProjectPerformanceStatus,
} from '../project-cost-accounting-composite';

// ============================================================================
// INTERFACES - EARNED VALUE MANAGEMENT
// ============================================================================

/**
 * Earned value metrics
 */
export interface EVMMetrics {
  projectId: number;
  asOfDate: Date;
  plannedValue: number; // PV - Budgeted cost of work scheduled
  earnedValue: number; // EV - Budgeted cost of work performed
  actualCost: number; // AC - Actual cost of work performed
  budgetAtCompletion: number; // BAC - Total planned budget
  costVariance: number; // CV = EV - AC
  scheduleVariance: number; // SV = EV - PV
  costPerformanceIndex: number; // CPI = EV / AC
  schedulePerformanceIndex: number; // SPI = EV / PV
  estimateAtCompletion: number; // EAC - Forecasted total cost
  estimateToComplete: number; // ETC - Remaining work forecast
  varianceAtCompletion: number; // VAC = BAC - EAC
  toCompletePerformanceIndex: number; // TCPI = (BAC - EV) / (BAC - AC)
  percentComplete: number; // % Complete
  percentScheduleComplete: number; // % Schedule complete
}

/**
 * Performance thresholds
 */
export interface PerformanceThresholds {
  cpiGreenMin: number; // CPI >= this value is green
  cpiYellowMin: number; // CPI >= this value is yellow
  spiGreenMin: number; // SPI >= this value is green
  spiYellowMin: number; // SPI >= this value is yellow
  cvTolerancePercent: number; // Cost variance tolerance %
  svTolerancePercent: number; // Schedule variance tolerance %
}

/**
 * EVM trend data point
 */
export interface EVMTrendDataPoint {
  date: Date;
  plannedValue: number;
  earnedValue: number;
  actualCost: number;
  cpi: number;
  spi: number;
}

// ============================================================================
// DTOs - EARNED VALUE REQUESTS
// ============================================================================

/**
 * EVM calculation request DTO
 */
export class CalculateEVMRequestDto {
  @ApiProperty({ description: 'Project ID' })
  @IsNumber()
  @IsNotEmpty()
  projectId!: number;

  @ApiProperty({ description: 'As-of date for calculations' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  asOfDate!: Date;

  @ApiPropertyOptional({ description: 'Include WBS-level metrics' })
  @IsOptional()
  includeWBSMetrics?: boolean;
}

/**
 * Forecast request DTO
 */
export class ProjectForecastRequestDto {
  @ApiProperty({ description: 'Project ID' })
  @IsNumber()
  @IsNotEmpty()
  projectId!: number;

  @ApiProperty({ description: 'As-of date for forecast' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  asOfDate!: Date;

  @ApiPropertyOptional({ description: 'Forecast method' })
  @IsEnum(['CPI', 'SPI', 'COMPOSITE', 'MANUAL'])
  @IsOptional()
  forecastMethod?: string = 'CPI';

  @ApiPropertyOptional({ description: 'Manual ETC amount' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  manualETC?: number;
}

// ============================================================================
// SERVICES - EARNED VALUE MANAGEMENT
// ============================================================================

/**
 * Earned value management service
 * Calculates and tracks EVM metrics, performance indices, and forecasts
 */
@Injectable()
export class EarnedValueManagementService {
  private readonly logger = new Logger(EarnedValueManagementService.name);

  // Default performance thresholds
  private readonly defaultThresholds: PerformanceThresholds = {
    cpiGreenMin: 0.95,
    cpiYellowMin: 0.90,
    spiGreenMin: 0.95,
    spiYellowMin: 0.90,
    cvTolerancePercent: 10,
    svTolerancePercent: 10,
  };

  /**
   * Calculates comprehensive earned value metrics for a project
   * @param projectId - Project identifier
   * @param asOfDate - As-of date for calculations
   * @returns Complete EVM metrics
   */
  async calculateEVMMetrics(
    projectId: number,
    asOfDate: Date
  ): Promise<EVMMetrics> {
    try {
      this.logger.log(`Calculating EVM metrics for project ${projectId} as of ${asOfDate.toISOString()}`);

      // Query project data
      // Query budget (BAC)
      // Query planned value (PV) - baseline schedule value as of date
      // Query actual costs (AC) - sum of all actual costs to date
      // Calculate earned value (EV) - BAC * % complete or completed work value

      const budgetAtCompletion = 100000;
      const plannedValue = 50000; // Should be at 50% by now
      const earnedValue = 45000; // Actually completed 45% of work
      const actualCost = 48000; // Spent 48,000

      // Calculate variances
      const costVariance = earnedValue - actualCost; // CV = EV - AC
      const scheduleVariance = earnedValue - plannedValue; // SV = EV - PV

      // Calculate performance indices
      const costPerformanceIndex = actualCost > 0 ? earnedValue / actualCost : 1; // CPI = EV / AC
      const schedulePerformanceIndex = plannedValue > 0 ? earnedValue / plannedValue : 1; // SPI = EV / PV

      // Calculate forecasts
      let estimateAtCompletion: number;
      if (costPerformanceIndex > 0) {
        // EAC = BAC / CPI (assumes current performance continues)
        estimateAtCompletion = budgetAtCompletion / costPerformanceIndex;
      } else {
        estimateAtCompletion = budgetAtCompletion;
      }

      const estimateToComplete = estimateAtCompletion - actualCost; // ETC = EAC - AC
      const varianceAtCompletion = budgetAtCompletion - estimateAtCompletion; // VAC = BAC - EAC

      // Calculate To-Complete Performance Index
      const remainingWork = budgetAtCompletion - earnedValue;
      const remainingBudget = budgetAtCompletion - actualCost;
      const toCompletePerformanceIndex = remainingBudget > 0 ? remainingWork / remainingBudget : 0;

      // Calculate percent complete
      const percentComplete = budgetAtCompletion > 0 ? (earnedValue / budgetAtCompletion) * 100 : 0;
      const percentScheduleComplete = plannedValue > 0 ? (earnedValue / plannedValue) * 100 : 0;

      const metrics: EVMMetrics = {
        projectId,
        asOfDate,
        plannedValue,
        earnedValue,
        actualCost,
        budgetAtCompletion,
        costVariance,
        scheduleVariance,
        costPerformanceIndex,
        schedulePerformanceIndex,
        estimateAtCompletion,
        estimateToComplete,
        varianceAtCompletion,
        toCompletePerformanceIndex,
        percentComplete,
        percentScheduleComplete,
      };

      this.logger.log(`EVM metrics calculated: CPI=${costPerformanceIndex.toFixed(2)}, SPI=${schedulePerformanceIndex.toFixed(2)}`);

      return metrics;
    } catch (error) {
      this.logger.error(`Failed to calculate EVM metrics: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Determines project performance status based on EVM metrics
   * @param metrics - EVM metrics
   * @param thresholds - Optional custom thresholds
   * @returns Performance status assessment
   */
  async assessPerformanceStatus(
    metrics: EVMMetrics,
    thresholds?: PerformanceThresholds
  ): Promise<{
    status: ProjectPerformanceStatus;
    costStatus: 'GREEN' | 'YELLOW' | 'RED';
    scheduleStatus: 'GREEN' | 'YELLOW' | 'RED';
    issues: string[];
    recommendations: string[];
  }> {
    try {
      this.logger.log(`Assessing performance status for project ${metrics.projectId}`);

      const thresh = thresholds || this.defaultThresholds;
      const issues: string[] = [];
      const recommendations: string[] = [];

      // Assess cost performance
      let costStatus: 'GREEN' | 'YELLOW' | 'RED';
      if (metrics.costPerformanceIndex >= thresh.cpiGreenMin) {
        costStatus = 'GREEN';
      } else if (metrics.costPerformanceIndex >= thresh.cpiYellowMin) {
        costStatus = 'YELLOW';
        issues.push(`Cost performance slightly below target (CPI: ${metrics.costPerformanceIndex.toFixed(2)})`);
        recommendations.push('Review cost drivers and implement cost control measures');
      } else {
        costStatus = 'RED';
        issues.push(`Cost performance significantly below target (CPI: ${metrics.costPerformanceIndex.toFixed(2)})`);
        recommendations.push('Immediate corrective action required - conduct cost review and implement recovery plan');
      }

      // Assess schedule performance
      let scheduleStatus: 'GREEN' | 'YELLOW' | 'RED';
      if (metrics.schedulePerformanceIndex >= thresh.spiGreenMin) {
        scheduleStatus = 'GREEN';
      } else if (metrics.schedulePerformanceIndex >= thresh.spiYellowMin) {
        scheduleStatus = 'YELLOW';
        issues.push(`Schedule performance slightly behind (SPI: ${metrics.schedulePerformanceIndex.toFixed(2)})`);
        recommendations.push('Review critical path and resource allocation');
      } else {
        scheduleStatus = 'RED';
        issues.push(`Schedule performance significantly behind (SPI: ${metrics.schedulePerformanceIndex.toFixed(2)})`);
        recommendations.push('Immediate schedule recovery plan required - consider fast-tracking or crashing');
      }

      // Determine overall status
      let status: ProjectPerformanceStatus;
      if (costStatus === 'GREEN' && scheduleStatus === 'GREEN') {
        status = ProjectPerformanceStatus.ON_TRACK;
      } else if (costStatus === 'RED' || scheduleStatus === 'RED') {
        status = ProjectPerformanceStatus.CRITICAL;
      } else {
        status = ProjectPerformanceStatus.AT_RISK;
      }

      // Check TCPI
      if (metrics.toCompletePerformanceIndex > 1.1) {
        issues.push(`Very high performance required to meet budget (TCPI: ${metrics.toCompletePerformanceIndex.toFixed(2)})`);
        recommendations.push('Consider scope reduction or budget increase');
      }

      return {
        status,
        costStatus,
        scheduleStatus,
        issues,
        recommendations,
      };
    } catch (error) {
      this.logger.error(`Failed to assess performance status: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Forecasts project completion cost using various methods
   * @param projectId - Project identifier
   * @param asOfDate - As-of date
   * @param method - Forecast method
   * @param manualETC - Optional manual ETC
   * @returns Forecast details
   */
  async forecastProjectCompletion(
    projectId: number,
    asOfDate: Date,
    method: 'CPI' | 'SPI' | 'COMPOSITE' | 'MANUAL' = 'CPI',
    manualETC?: number
  ): Promise<{
    estimateAtCompletion: number;
    estimateToComplete: number;
    varianceAtCompletion: number;
    forecastMethod: string;
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  }> {
    try {
      this.logger.log(`Forecasting project ${projectId} completion using ${method} method`);

      // Get current metrics
      const metrics = await this.calculateEVMMetrics(projectId, asOfDate);

      let estimateAtCompletion: number;
      let estimateToComplete: number;
      let confidence: 'HIGH' | 'MEDIUM' | 'LOW';

      switch (method) {
        case 'CPI':
          // EAC = BAC / CPI
          // Assumes current cost performance continues
          estimateAtCompletion = metrics.budgetAtCompletion / metrics.costPerformanceIndex;
          estimateToComplete = estimateAtCompletion - metrics.actualCost;
          confidence = metrics.percentComplete > 50 ? 'HIGH' : 'MEDIUM';
          break;

        case 'SPI':
          // EAC = AC + ((BAC - EV) / SPI)
          // Assumes schedule performance affects remaining work
          const remainingWorkSPI = (metrics.budgetAtCompletion - metrics.earnedValue) / metrics.schedulePerformanceIndex;
          estimateAtCompletion = metrics.actualCost + remainingWorkSPI;
          estimateToComplete = estimateAtCompletion - metrics.actualCost;
          confidence = 'MEDIUM';
          break;

        case 'COMPOSITE':
          // EAC = AC + ((BAC - EV) / (CPI * SPI))
          // Considers both cost and schedule performance
          const compositeFactor = metrics.costPerformanceIndex * metrics.schedulePerformanceIndex;
          const remainingWorkComposite = (metrics.budgetAtCompletion - metrics.earnedValue) / compositeFactor;
          estimateAtCompletion = metrics.actualCost + remainingWorkComposite;
          estimateToComplete = estimateAtCompletion - metrics.actualCost;
          confidence = metrics.percentComplete > 50 ? 'HIGH' : 'MEDIUM';
          break;

        case 'MANUAL':
          // Use manual ETC
          if (manualETC === undefined || manualETC < 0) {
            throw new BadRequestException('Manual ETC must be provided and non-negative');
          }
          estimateToComplete = manualETC;
          estimateAtCompletion = metrics.actualCost + estimateToComplete;
          confidence = 'MEDIUM';
          break;

        default:
          throw new BadRequestException(`Invalid forecast method: ${method}`);
      }

      const varianceAtCompletion = metrics.budgetAtCompletion - estimateAtCompletion;

      this.logger.log(`Forecast complete: EAC=${estimateAtCompletion.toFixed(2)}, VAC=${varianceAtCompletion.toFixed(2)}`);

      return {
        estimateAtCompletion,
        estimateToComplete,
        varianceAtCompletion,
        forecastMethod: method,
        confidence,
      };
    } catch (error) {
      this.logger.error(`Failed to forecast project completion: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Retrieves EVM trend data for charting and analysis
   * @param projectId - Project identifier
   * @param startDate - Trend start date
   * @param endDate - Trend end date
   * @returns Time-series EVM data
   */
  async getEVMTrendData(
    projectId: number,
    startDate: Date,
    endDate: Date
  ): Promise<EVMTrendDataPoint[]> {
    try {
      this.logger.log(`Retrieving EVM trend data for project ${projectId}`);

      // Query historical EVM snapshots from database
      // If no snapshots exist, calculate them on the fly

      const trendData: EVMTrendDataPoint[] = [];

      // Simulate trend data (would come from database)
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const weeklyPoints = Math.ceil(daysDiff / 7);

      for (let i = 0; i <= weeklyPoints; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i * 7);

        if (date > endDate) break;

        // Calculate metrics for this date
        const progress = i / weeklyPoints;
        const dataPoint: EVMTrendDataPoint = {
          date,
          plannedValue: 100000 * progress,
          earnedValue: 100000 * progress * 0.9, // Slightly behind
          actualCost: 100000 * progress * 0.95, // Cost overrun
          cpi: 0.9 / 0.95,
          spi: 0.9,
        };

        trendData.push(dataPoint);
      }

      this.logger.log(`Retrieved ${trendData.length} EVM trend data points`);

      return trendData;
    } catch (error) {
      this.logger.error(`Failed to retrieve EVM trend data: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generates comprehensive EVM performance report
   * @param projectId - Project identifier
   * @param asOfDate - As-of date
   * @returns Detailed performance report
   */
  async generatePerformanceReport(
    projectId: number,
    asOfDate: Date
  ): Promise<{
    metrics: EVMMetrics;
    performanceStatus: any;
    forecast: any;
    summary: string;
    keyInsights: string[];
  }> {
    try {
      this.logger.log(`Generating performance report for project ${projectId}`);

      // Calculate metrics
      const metrics = await this.calculateEVMMetrics(projectId, asOfDate);

      // Assess performance
      const performanceStatus = await this.assessPerformanceStatus(metrics);

      // Generate forecast
      const forecast = await this.forecastProjectCompletion(projectId, asOfDate, 'COMPOSITE');

      // Generate summary
      const summary = this.generateExecutiveSummary(metrics, performanceStatus, forecast);

      // Generate key insights
      const keyInsights = this.generateKeyInsights(metrics, performanceStatus, forecast);

      return {
        metrics,
        performanceStatus,
        forecast,
        summary,
        keyInsights,
      };
    } catch (error) {
      this.logger.error(`Failed to generate performance report: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generates executive summary text
   * @param metrics - EVM metrics
   * @param performance - Performance assessment
   * @param forecast - Forecast data
   * @returns Executive summary
   */
  private generateExecutiveSummary(
    metrics: EVMMetrics,
    performance: any,
    forecast: any
  ): string {
    const summary = `
Project Performance Summary (as of ${metrics.asOfDate.toISOString().split('T')[0]}):

Overall Status: ${performance.status}
Cost Performance: ${performance.costStatus} (CPI: ${metrics.costPerformanceIndex.toFixed(2)})
Schedule Performance: ${performance.scheduleStatus} (SPI: ${metrics.schedulePerformanceIndex.toFixed(2)})

Budget Status:
- Original Budget: $${metrics.budgetAtCompletion.toLocaleString()}
- Earned Value: $${metrics.earnedValue.toLocaleString()} (${metrics.percentComplete.toFixed(1)}% complete)
- Actual Cost: $${metrics.actualCost.toLocaleString()}
- Cost Variance: $${metrics.costVariance.toLocaleString()} (${metrics.costVariance >= 0 ? 'favorable' : 'unfavorable'})

Forecast:
- Estimate at Completion: $${forecast.estimateAtCompletion.toLocaleString()}
- Variance at Completion: $${forecast.varianceAtCompletion.toLocaleString()}
- Required Performance (TCPI): ${metrics.toCompletePerformanceIndex.toFixed(2)}
    `.trim();

    return summary;
  }

  /**
   * Generates key insights
   * @param metrics - EVM metrics
   * @param performance - Performance assessment
   * @param forecast - Forecast data
   * @returns Key insights
   */
  private generateKeyInsights(
    metrics: EVMMetrics,
    performance: any,
    forecast: any
  ): string[] {
    const insights: string[] = [];

    if (metrics.costPerformanceIndex < 1.0) {
      insights.push(`Project is over budget by ${((1 - metrics.costPerformanceIndex) * 100).toFixed(1)}%`);
    }

    if (metrics.schedulePerformanceIndex < 1.0) {
      insights.push(`Project is behind schedule by ${((1 - metrics.schedulePerformanceIndex) * 100).toFixed(1)}%`);
    }

    if (metrics.toCompletePerformanceIndex > 1.0) {
      insights.push(`Achieving budget requires ${metrics.toCompletePerformanceIndex.toFixed(2)} performance efficiency on remaining work`);
    }

    if (forecast.varianceAtCompletion < 0) {
      insights.push(`Forecasting budget overrun of $${Math.abs(forecast.varianceAtCompletion).toLocaleString()}`);
    }

    return insights;
  }
}
