import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { TimePeriod } from '../enums/time-period.enum';
import { TrendDirection } from '../enums/trend-direction.enum';
import {
  ChartData,
  IncidentTrend,
} from '../interfaces/health-analytics.interfaces';
import { IncidentReport } from '@/database/models';
import { DateRangeService } from './date-range.service';

import { BaseService } from '@/common/base';
/**
 * Incident Analytics Service
 * Provides comprehensive incident analysis and reporting
 *
 * Responsibilities:
 * - Analyze incidents by type, location, and time
 * - Generate incident trend reports
 * - Assess incident severity
 * - Identify common patterns and high-risk areas
 */
@Injectable()
export class IncidentAnalyticsService extends BaseService {
  constructor(
    @InjectModel(IncidentReport)
    private readonly incidentReportModel: typeof IncidentReport,
    private readonly dateRangeService: DateRangeService,
  ) {
    super("IncidentAnalyticsService");
  }

  /**
   * Get incident analytics with detailed breakdown
   */
  async getIncidentAnalytics(
    schoolId: string,
    period: TimePeriod = TimePeriod.LAST_90_DAYS,
  ) {
    try {
      const dateRange = this.dateRangeService.getDateRange(period);
      const { start, end } = dateRange;

      const incidents = await this.incidentReportModel.findAll({
        where: {
          occurredAt: { [Op.between]: [start, end] },
        },
        order: [['occurredAt', 'ASC']],
      });

      // Analyze by type
      const typeMap = new Map<string, number>();
      const locationMap = new Map<string, number>();
      const hourMap = new Map<number, number>();

      for (const incident of incidents) {
        // By type
        const type = incident.type || 'Unknown';
        typeMap.set(type, (typeMap.get(type) || 0) + 1);

        // By location
        const location = incident.location || 'Unknown';
        locationMap.set(location, (locationMap.get(location) || 0) + 1);

        // By time of day
        const hour = new Date(incident.occurredAt).getHours();
        hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
      }

      const byType: ChartData = {
        chartType: 'PIE',
        title: 'Incidents by Type',
        datasets: [
          {
            label: 'Incidents',
            data: Array.from(typeMap.entries()).map(([label, value]) => ({
              label,
              value,
            })),
            color: '#EF4444',
          },
        ],
      };

      const byLocation: ChartData = {
        chartType: 'BAR',
        title: 'Incidents by Location',
        xAxisLabel: 'Location',
        yAxisLabel: 'Count',
        datasets: [
          {
            label: 'Incidents',
            data: Array.from(locationMap.entries())
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10)
              .map(([label, value]) => ({ label, value })),
            color: '#F59E0B',
          },
        ],
      };

      const byTimeOfDay: ChartData = {
        chartType: 'LINE',
        title: 'Incidents by Time of Day',
        xAxisLabel: 'Hour',
        yAxisLabel: 'Count',
        datasets: [
          {
            label: 'Incidents',
            data: Array.from(hourMap.entries())
              .sort((a, b) => a[0] - b[0])
              .map(([hour, count]) => ({
                date: new Date(2000, 0, 1, hour),
                value: count,
                label: `${hour}:00`,
              })),
            color: '#8B5CF6',
          },
        ],
      };

      const trends: IncidentTrend[] = Array.from(typeMap.entries()).map(
        ([type, count]) => ({
          incidentType: type,
          count,
          severity: this.assessIncidentSeverity(type),
          trend: TrendDirection.STABLE,
          commonLocations: this.getCommonLocationsForType(incidents, type),
          timeOfDayDistribution: this.getTimeDistribution(incidents, type),
        }),
      );

      return {
        byType,
        byLocation,
        byTimeOfDay,
        trends,
      };
    } catch (error) {
      this.logError('Error getting incident analytics', error.stack);
      throw error;
    }
  }

  /**
   * Get common locations for incident type
   */
  private getCommonLocationsForType(
    incidents: IncidentReport[],
    type: string,
  ): string[] {
    return incidents
      .filter((i) => i.type === type)
      .map((i) => i.location || 'Unknown')
      .filter((loc, idx, arr) => arr.indexOf(loc) === idx)
      .slice(0, 3);
  }

  /**
   * Assess incident severity
   */
  assessIncidentSeverity(type: string): 'MINOR' | 'MODERATE' | 'SERIOUS' {
    const lower = type.toLowerCase();
    if (
      lower.includes('severe') ||
      lower.includes('serious') ||
      lower.includes('emergency')
    ) {
      return 'SERIOUS';
    }
    if (lower.includes('moderate') || lower.includes('injury')) {
      return 'MODERATE';
    }
    return 'MINOR';
  }

  /**
   * Get time of day distribution for incident type
   */
  private getTimeDistribution(
    incidents: IncidentReport[],
    type: string,
  ): { hour: number; count: number }[] {
    const hourMap = new Map<number, number>();

    incidents
      .filter((i) => i.type === type)
      .forEach((i) => {
        const hour = new Date(i.occurredAt).getHours();
        hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
      });

    return Array.from(hourMap.entries())
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  /**
   * Identify high-risk locations based on incident frequency
   */
  async identifyHighRiskLocations(
    schoolId: string,
    period: TimePeriod,
  ): Promise<Array<{ location: string; incidentCount: number; severity: string }>> {
    const dateRange = this.dateRangeService.getDateRange(period);
    const incidents = await this.incidentReportModel.findAll({
      where: {
        occurredAt: { [Op.between]: [dateRange.start, dateRange.end] },
      },
    });

    const locationCounts = new Map<string, number>();
    for (const incident of incidents) {
      const location = incident.location || 'Unknown';
      locationCounts.set(location, (locationCounts.get(location) || 0) + 1);
    }

    return Array.from(locationCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([location, incidentCount]) => ({
        location,
        incidentCount,
        severity: incidentCount > 10 ? 'HIGH' : incidentCount > 5 ? 'MEDIUM' : 'LOW',
      }));
  }
}
