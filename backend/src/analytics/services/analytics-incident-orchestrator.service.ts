import { Injectable, Logger } from '@nestjs/common';
import { HealthTrendAnalyticsService } from './health-trend-analytics.service';
import { TimePeriod } from '../enums/time-period.enum';
import { GetIncidentTrendsQueryDto } from '../dto/incident-analytics.dto';
import { GetIncidentsByLocationQueryDto } from '../dto/incident-analytics.dto';

import { BaseService } from '@/common/base';
interface IncidentTrendsResponse {
  trends: unknown;
  byType: unknown;
  byTimeOfDay: unknown;
  period: {
    startDate: Date;
    endDate: Date;
  };
  filters: {
    incidentType?: string;
    severity?: string;
    groupBy: string;
  };
}

interface IncidentsByLocationResponse {
  byLocation: unknown;
  period: {
    startDate: Date;
    endDate: Date;
  };
  location?: string;
  heatMapIncluded: boolean;
}

/**
 * Analytics Incident Orchestrator Service
 * Handles incident analytics and pattern analysis
 *
 * Responsibilities:
 * - Analyze incident trends over time
 * - Group incidents by location
 * - Identify incident patterns by type and severity
 * - Support heatmap generation for location-based analysis
 */
@Injectable()
export class AnalyticsIncidentOrchestratorService extends BaseService {
  constructor(
    private readonly healthTrendService: HealthTrendAnalyticsService,
  ) {
    super("AnalyticsIncidentOrchestratorService");}

  /**
   * Get incident trends
   */
  async getIncidentTrends(query: GetIncidentTrendsQueryDto): Promise<IncidentTrendsResponse> {
    try {
      const schoolId = query.schoolId || 'default-school';
      const incidentAnalytics =
        await this.healthTrendService.getIncidentAnalytics(
          schoolId,
          TimePeriod.LAST_90_DAYS,
        );

      return {
        trends: incidentAnalytics.trends,
        byType: incidentAnalytics.byType,
        byTimeOfDay: incidentAnalytics.byTimeOfDay,
        period: {
          startDate: query.startDate,
          endDate: query.endDate,
        },
        filters: {
          incidentType: query.incidentType,
          severity: query.severity,
          groupBy: query.groupBy || 'TYPE',
        },
      };
    } catch (error) {
      this.logError('Error getting incident trends', error);
      throw error;
    }
  }

  /**
   * Get incidents by location
   */
  async getIncidentsByLocation(query: GetIncidentsByLocationQueryDto): Promise<IncidentsByLocationResponse> {
    try {
      const schoolId = query.schoolId || 'default-school';
      const incidentAnalytics =
        await this.healthTrendService.getIncidentAnalytics(
          schoolId,
          TimePeriod.LAST_90_DAYS,
        );

      return {
        byLocation: incidentAnalytics.byLocation,
        period: {
          startDate: query.startDate,
          endDate: query.endDate,
        },
        location: query.location,
        heatMapIncluded: query.includeHeatMap || false,
      };
    } catch (error) {
      this.logError('Error getting incidents by location', error);
      throw error;
    }
  }
}
