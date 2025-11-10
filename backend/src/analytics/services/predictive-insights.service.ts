import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { TimePeriod } from '../enums/time-period.enum';
import { PredictiveInsight } from '../interfaces/health-analytics.interfaces';
import { HealthRecord } from '../../database/models/health-record.model';
import { DateRangeService } from './date-range.service';
import { TrendCalculationService } from './trend-calculation.service';

/**
 * Predictive Insights Service
 * Provides predictive analytics and outbreak detection capabilities
 *
 * Responsibilities:
 * - Detect potential disease outbreaks
 * - Predict medication stock shortages
 * - Generate actionable recommendations
 * - Calculate probability and impact predictions
 */
@Injectable()
export class PredictiveInsightsService {
  private readonly logger = new Logger(PredictiveInsightsService.name);

  constructor(
    @InjectModel(HealthRecord)
    private readonly healthRecordModel: typeof HealthRecord,
    private readonly dateRangeService: DateRangeService,
    private readonly trendCalculationService: TrendCalculationService,
  ) {}

  /**
   * Get predictive insights using statistical analysis
   */
  async getPredictiveInsights(schoolId: string): Promise<PredictiveInsight[]> {
    try {
      const dateRange = this.dateRangeService.getDateRange(
        TimePeriod.LAST_90_DAYS,
      );

      const recentRecords = await this.healthRecordModel.findAll({
        where: {
          recordDate: { [Op.between]: [dateRange.start, dateRange.end] },
        },
      });

      const insights: PredictiveInsight[] = [];

      // Analyze for potential outbreaks
      const outbreakInsight = this.detectOutbreakRisk(recentRecords);
      if (outbreakInsight) {
        insights.push(outbreakInsight);
      }

      // Check for medication stock shortage risk
      const stockInsight = this.detectStockShortageRisk(recentRecords);
      if (stockInsight) {
        insights.push(stockInsight);
      }

      this.logger.log(
        `Generated ${insights.length} predictive insights for school ${schoolId}`,
      );
      return insights;
    } catch (error) {
      this.logger.error('Error generating predictive insights', error.stack);
      throw error;
    }
  }

  /**
   * Detect potential outbreak risk using exponential moving average
   */
  private detectOutbreakRisk(
    records: HealthRecord[],
  ): PredictiveInsight | null {
    const illnessCounts = this.trendCalculationService.aggregateByWeek(
      records.filter((r) => r.recordType === 'ILLNESS'),
    );

    if (illnessCounts.length < 2) return null;

    const trend = this.trendCalculationService.calculateExponentialMovingAverage(
      illnessCounts,
      0.3,
    );
    const recentTrend = trend.slice(-2);

    if (recentTrend.length === 2 && recentTrend[1] > recentTrend[0] * 1.2) {
      return {
        insightType: 'OUTBREAK_RISK',
        severity: recentTrend[1] > recentTrend[0] * 1.5 ? 'HIGH' : 'MEDIUM',
        title: 'Potential Illness Outbreak',
        description: `Illness cases trending ${((recentTrend[1] / recentTrend[0] - 1) * 100).toFixed(0)}% above previous week`,
        prediction: {
          timeframe: 'Next 7-14 days',
          probability: Math.min(
            95,
            Math.round((recentTrend[1] / recentTrend[0]) * 50),
          ),
          impactedCount: Math.round(recentTrend[1] * 1.3),
        },
        recommendations: [
          'Increase health monitoring frequency',
          'Notify parents of symptoms to watch for',
          'Ensure adequate supply of medications and PPE',
          'Review isolation protocols with staff',
        ],
      };
    }

    return null;
  }

  /**
   * Detect medication stock shortage risk
   */
  private detectStockShortageRisk(
    records: HealthRecord[],
  ): PredictiveInsight | null {
    const medicationRecords = records.filter(
      (r) =>
        r.treatment?.toLowerCase().includes('medication') ||
        r.recordType === 'MEDICATION_REVIEW',
    );

    if (medicationRecords.length > 100) {
      return {
        insightType: 'STOCK_SHORTAGE',
        severity: 'MEDIUM',
        title: 'High Medication Demand',
        description:
          'Medication administration rates above normal - monitor inventory',
        prediction: {
          timeframe: 'Next 14-21 days',
          probability: 65,
          impactedCount: Math.round(medicationRecords.length * 0.15),
        },
        recommendations: [
          'Review medication inventory levels',
          'Order additional stock for high-use medications',
          'Audit medication administration records',
        ],
      };
    }

    return null;
  }

  /**
   * Analyze seasonal trends for prediction
   */
  analyzeSeasonalTrend(
    records: HealthRecord[],
    currentMonth: number,
  ): { isPeakSeason: boolean; expectedIncrease: number } {
    // Flu season: December - March
    const fluSeasonMonths = [11, 0, 1, 2]; // JavaScript months are 0-indexed
    const isFluSeason = fluSeasonMonths.includes(currentMonth);

    // Allergy season: March - May, September
    const allergySeasonMonths = [2, 3, 4, 8];
    const isAllergySeason = allergySeasonMonths.includes(currentMonth);

    let expectedIncrease = 0;
    if (isFluSeason) {
      expectedIncrease = 35; // 35% increase during flu season
    } else if (isAllergySeason) {
      expectedIncrease = 25; // 25% increase during allergy season
    }

    return {
      isPeakSeason: isFluSeason || isAllergySeason,
      expectedIncrease,
    };
  }

  /**
   * Calculate risk score for a condition
   */
  calculateConditionRiskScore(
    currentCount: number,
    historicalAverage: number,
    growthRate: number,
  ): number {
    const deviationFactor = currentCount / historicalAverage;
    const growthFactor = 1 + growthRate / 100;
    const riskScore = Math.min(100, (deviationFactor * growthFactor) * 50);
    return Math.round(riskScore);
  }
}
