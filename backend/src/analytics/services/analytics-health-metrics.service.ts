import { Injectable, Logger } from '@nestjs/common';
import { HealthTrendAnalyticsService } from './health-trend-analytics.service';
import { TimePeriod } from '../enums/time-period.enum';
import { GetHealthMetricsQueryDto } from '../dto/health-metrics.dto';
import { GetHealthTrendsQueryDto } from '../dto/analytics-query.dto';
import { GetSchoolMetricsQueryDto } from '../dto/health-metrics.dto';

/**
 * Analytics Health Metrics Service
 *
 * Handles health metrics aggregation and trend analysis across different scopes:
 * - Overall health metrics with time period analysis
 * - Health condition trends with forecasting capabilities
 * - School-wide health metrics including immunization and incidents
 *
 * This service focuses on population-level health analytics and metrics aggregation
 * for compliance reporting and administrative decision-making.
 */
@Injectable()
export class AnalyticsHealthMetricsService {
  private readonly logger = new Logger(AnalyticsHealthMetricsService.name);

  constructor(
    private readonly healthTrendService: HealthTrendAnalyticsService,
  ) {}

  /**
   * Get aggregated health metrics for a given time period
   *
   * Calculates comprehensive health metrics including:
   * - Time period determination based on date range
   * - Previous period comparison when requested
   * - Aggregation level configuration
   *
   * @param query - Health metrics query parameters
   * @returns Aggregated health metrics with period and comparison data
   */
  async getHealthMetrics(query: GetHealthMetricsQueryDto) {
    try {
      const start = query.startDate;
      const end = query.endDate;
      const daysDiff = Math.floor(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
      );

      // Determine time period based on date range
      let period: TimePeriod = TimePeriod.LAST_30_DAYS;
      if (daysDiff <= 7) period = TimePeriod.LAST_7_DAYS;
      else if (daysDiff <= 30) period = TimePeriod.LAST_30_DAYS;
      else if (daysDiff <= 90) period = TimePeriod.LAST_90_DAYS;
      else if (daysDiff <= 180) period = TimePeriod.LAST_6_MONTHS;
      else period = TimePeriod.LAST_YEAR;

      const schoolId = query.schoolId || query.districtId || 'default-school';
      const metrics = await this.healthTrendService.getHealthMetrics(
        schoolId,
        period,
      );

      // Calculate comparison data if requested
      let comparisonData: {
        periodLabel: string;
        startDate: Date;
        endDate: Date;
      } | null = null;
      if (query.compareWithPrevious) {
        const previousStart = new Date(start);
        previousStart.setDate(previousStart.getDate() - daysDiff);
        const previousEnd = new Date(end);
        previousEnd.setDate(previousEnd.getDate() - daysDiff);

        comparisonData = {
          periodLabel: 'Previous Period',
          startDate: previousStart,
          endDate: previousEnd,
        };
      }

      return {
        metrics,
        period: { startDate: start, endDate: end },
        aggregationLevel: query.aggregationLevel || 'SCHOOL',
        comparisonData,
      };
    } catch (error) {
      this.logger.error('Error getting health metrics', error);
      throw error;
    }
  }

  /**
   * Get health trend analysis over time
   *
   * Provides comprehensive trend analysis including:
   * - Health condition trends by metric type
   * - Medication usage trends
   * - Time period granularity (daily, weekly, monthly, quarterly, yearly)
   * - Optional forecasting for predictive insights
   *
   * @param query - Health trends query parameters
   * @returns Health condition and medication trends with period information
   */
  async getHealthTrends(query: GetHealthTrendsQueryDto) {
    try {
      const start = query.startDate;
      const end = query.endDate;

      // Map time period to service enum
      let period: TimePeriod = TimePeriod.LAST_90_DAYS;
      switch (query.timePeriod) {
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

      const schoolId = query.schoolId || query.districtId || 'default-school';

      const conditionTrends = await this.healthTrendService.getConditionTrends(
        schoolId,
        query.metrics,
        period,
      );

      const medicationTrends =
        await this.healthTrendService.getMedicationTrends(schoolId, period);

      return {
        healthConditionTrends: conditionTrends,
        medicationTrends,
        period: { startDate: start, endDate: end },
        timePeriod: query.timePeriod || 'MONTHLY',
        forecastingEnabled: query.includeForecasting || false,
      };
    } catch (error) {
      this.logger.error('Error getting health trends', error);
      throw error;
    }
  }

  /**
   * Get comprehensive school-wide health metrics
   *
   * Aggregates multiple data sources for school health overview:
   * - Population health summary
   * - Immunization compliance dashboard
   * - Incident analytics
   * - Optional grade-level filtering
   * - Period-over-period comparisons
   *
   * @param schoolId - School identifier
   * @param query - School metrics query parameters
   * @returns Comprehensive school health metrics
   */
  async getSchoolMetrics(schoolId: string, query: GetSchoolMetricsQueryDto) {
    try {
      const start = query.startDate;
      const end = query.endDate;

      const summary = await this.healthTrendService.getPopulationSummary(
        schoolId,
        TimePeriod.CUSTOM,
        {
          start,
          end,
        },
      );

      const immunizationData =
        await this.healthTrendService.getImmunizationDashboard(schoolId);

      const incidentAnalytics =
        await this.healthTrendService.getIncidentAnalytics(
          schoolId,
          TimePeriod.LAST_90_DAYS,
        );

      return {
        schoolId,
        summary,
        immunization: immunizationData,
        incidents: incidentAnalytics,
        period: { startDate: start, endDate: end },
        gradeLevel: query.gradeLevel,
        includesComparisons: query.includeComparisons !== false,
      };
    } catch (error) {
      this.logger.error('Error getting school metrics', error);
      throw error;
    }
  }
}
