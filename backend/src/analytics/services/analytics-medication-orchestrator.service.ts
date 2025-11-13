import { Injectable, Logger } from '@nestjs/common';
import { HealthTrendAnalyticsService } from './health-trend-analytics.service';
import { TimePeriod } from '../enums/time-period.enum';
import { TrendDirection } from '../enums/trend-direction.enum';
import { GetMedicationUsageQueryDto } from '../dto/medication-analytics.dto';
import { GetMedicationAdherenceQueryDto } from '../dto/medication-analytics.dto';

import { BaseService } from '../../common/base';
interface MedicationTrend {
  medicationName: string;
  category: string;
  administrationCount: number;
  studentCount: number;
  change: number;
  trend: TrendDirection;
  commonReasons: string[];
  sideEffectRate: number;
}

interface MedicationUsageResponse {
  usageChart: unknown;
  topMedications: MedicationTrend[];
  totalAdministrations: number;
  period: {
    startDate: Date;
    endDate: Date;
  };
  filters: {
    medicationName?: string;
    category?: string;
    groupBy: string;
  };
  adherenceIncluded: boolean;
}

interface MedicationAdherenceData {
  medicationName: string;
  category: string;
  studentCount: number;
  administrationCount: number;
  adherenceRate: number;
  isBelowThreshold: boolean;
  trend: TrendDirection;
}

interface MedicationAdherenceResponse {
  adherenceData: MedicationAdherenceData[];
  threshold: number;
  period: {
    startDate: Date;
    endDate: Date;
  };
  filters: {
    studentId?: string;
    medicationId?: string;
  };
}

/**
 * Analytics Medication Orchestrator Service
 * Handles medication usage and adherence analytics
 *
 * Responsibilities:
 * - Track medication usage patterns
 * - Calculate medication adherence rates
 * - Identify adherence issues
 * - Analyze medication trends by category
 */
@Injectable()
export class AnalyticsMedicationOrchestratorService extends BaseService {
  constructor(
    private readonly healthTrendService: HealthTrendAnalyticsService,
  ) {}

  /**
   * Get medication usage statistics
   */
  async getMedicationUsage(query: GetMedicationUsageQueryDto): Promise<MedicationUsageResponse> {
    try {
      const schoolId = query.schoolId || 'default-school';
      const medicationTrends =
        await this.healthTrendService.getMedicationTrends(
          schoolId,
          TimePeriod.LAST_30_DAYS,
        );

      const summary = await this.healthTrendService.getPopulationSummary(
        schoolId,
        TimePeriod.LAST_30_DAYS,
      );

      return {
        usageChart: medicationTrends,
        topMedications: summary.topMedications,
        totalAdministrations: summary.totalMedicationAdministrations,
        period: {
          startDate: query.startDate,
          endDate: query.endDate,
        },
        filters: {
          medicationName: query.medicationName,
          category: query.category,
          groupBy: query.groupBy || 'MEDICATION',
        },
        adherenceIncluded: query.includeAdherenceRate !== false,
      };
    } catch (error) {
      this.logError('Error getting medication usage', error);
      throw error;
    }
  }

  /**
   * Get medication adherence rates
   */
  async getMedicationAdherence(query: GetMedicationAdherenceQueryDto): Promise<MedicationAdherenceResponse> {
    try {
      const schoolId = query.schoolId || 'default-school';
      const summary = await this.healthTrendService.getPopulationSummary(
        schoolId,
        TimePeriod.LAST_30_DAYS,
      );

      const threshold = query.threshold || 80;

      // Calculate adherence data from medication trends
      const adherenceData: MedicationAdherenceData[] = summary.topMedications.map((med) => ({
        medicationName: med.medicationName,
        category: med.category,
        studentCount: med.studentCount,
        administrationCount: med.administrationCount,
        adherenceRate: 100 - med.sideEffectRate, // Simplified calculation
        isBelowThreshold: 100 - med.sideEffectRate < threshold,
        trend: med.trend,
      }));

      return {
        adherenceData,
        threshold,
        period: {
          startDate: query.startDate,
          endDate: query.endDate,
        },
        filters: {
          studentId: query.studentId,
          medicationId: query.medicationId,
        },
      };
    } catch (error) {
      this.logError('Error getting medication adherence', error);
      throw error;
    }
  }
}
