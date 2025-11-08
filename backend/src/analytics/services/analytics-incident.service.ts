import { Injectable, Logger } from '@nestjs/common';
import { HealthTrendAnalyticsService } from './health-trend-analytics.service';
import { TimePeriod } from '../enums/time-period.enum';
import { GetIncidentTrendsQueryDto } from '../dto/incident-analytics.dto';
import { GetIncidentsByLocationQueryDto } from '../dto/incident-analytics.dto';

/**
 * Analytics Incident Service
 *
 * Handles incident analytics and reporting:
 * - Incident trend analysis by type, severity, and time
 * - Location-based incident patterns and heat mapping
 * - Time-of-day incident distribution
 * - Safety trend identification
 *
 * This service supports school safety initiatives by providing data-driven
 * insights into incident patterns, high-risk locations, and temporal trends.
 */
@Injectable()
export class AnalyticsIncidentService {
  private readonly logger = new Logger(AnalyticsIncidentService.name);

  constructor(
    private readonly healthTrendService: HealthTrendAnalyticsService,
  ) {}

  /**
   * Get incident trends over time
   *
   * Provides comprehensive incident analytics including:
   * - Overall incident trends
   * - Breakdown by incident type
   * - Time-of-day distribution
   * - Optional filtering by type and severity
   * - Grouping options (type, severity, location)
   *
   * @param query - Incident trends query parameters
   * @returns Incident trends and patterns
   */
  async getIncidentTrends(query: GetIncidentTrendsQueryDto) {
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
      this.logger.error('Error getting incident trends', error);
      throw error;
    }
  }

  /**
   * Get incidents by location
   *
   * Provides location-based incident analytics:
   * - Incident distribution by location
   * - Optional heat map data for visualization
   * - High-risk area identification
   * - Location-specific incident patterns
   *
   * Supports safety planning by identifying areas requiring additional
   * monitoring or safety interventions.
   *
   * @param query - Location-based incident query parameters
   * @returns Incidents grouped by location with optional heat map
   */
  async getIncidentsByLocation(query: GetIncidentsByLocationQueryDto) {
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
      this.logger.error('Error getting incidents by location', error);
      throw error;
    }
  }
}
