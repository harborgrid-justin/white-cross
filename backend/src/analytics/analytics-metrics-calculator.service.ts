/**
 * @fileoverview Analytics Metrics Calculator Service
 * @module analytics
 * @description Handles KPI calculations, trend analysis, and forecasting for analytics
 */

import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { BaseService } from '../../common/base';
import {
  AnalyticsTimePeriod,
  TrendData,
  ForecastData,
  AnalyticsOperationResult,
  HealthMetricsData,
  MedicationAnalyticsData,
  AppointmentAnalyticsData,
  IncidentAnalyticsData,
  TrendAnalysisResult,
  ForecastAnalysisResult,
  KPICalculationResult,
} from './analytics-interfaces';

import {
  ANALYTICS_CONSTANTS,
  ANALYTICS_CACHE_KEYS,
} from './analytics-constants';

@Injectable()
export class AnalyticsMetricsCalculatorService extends BaseService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  /**
   * Calculate comprehensive KPIs from health metrics
   */
  async calculateHealthKPIs(
    healthMetrics: HealthMetricsData,
  ): Promise<AnalyticsOperationResult<KPICalculationResult>> {
    try {
      const kpis = {
        medicationAdherenceScore: this.calculateMedicationAdherenceScore(healthMetrics),
        immunizationComplianceScore: this.calculateImmunizationComplianceScore(healthMetrics),
        healthRecordActivityScore: this.calculateHealthRecordActivityScore(healthMetrics),
        overallHealthIndex: this.calculateOverallHealthIndex(healthMetrics),
        riskIndicators: this.identifyRiskIndicators(healthMetrics),
        improvementAreas: this.identifyImprovementAreas(healthMetrics),
      };

      const result: KPICalculationResult = {
        schoolId: healthMetrics.schoolId,
        period: healthMetrics.period,
        kpis,
        calculatedAt: new Date(),
        dataPoints: {
          totalStudents: healthMetrics.totalStudents,
          activeHealthRecords: healthMetrics.activeHealthRecords,
          medicationAdherence: healthMetrics.medicationAdherence,
          immunizationCompliance: healthMetrics.immunizationCompliance,
        },
      };

      this.eventEmitter.emit('analytics.kpis.calculated', {
        schoolId: healthMetrics.schoolId,
        period: healthMetrics.period,
        kpiCount: Object.keys(kpis).length,
      });

      return { success: true, data: result };
    } catch (error) {
      this.logError(`Failed to calculate health KPIs for school ${healthMetrics.schoolId}`, error);
      return {
        success: false,
        error: `Failed to calculate KPIs: ${error.message}`,
      };
    }
  }

  /**
   * Analyze trends in health metrics over time
   */
  async analyzeHealthTrends(
    schoolId: string,
    metricType: string,
    periods: AnalyticsTimePeriod[] = [
      AnalyticsTimePeriod.LAST_30_DAYS,
      AnalyticsTimePeriod.LAST_90_DAYS,
      AnalyticsTimePeriod.LAST_6_MONTHS,
    ],
  ): Promise<AnalyticsOperationResult<TrendAnalysisResult>> {
    try {
      const cacheKey = ANALYTICS_CACHE_KEYS.TREND_DATA(schoolId, metricType, periods.join(','));
      const cached = await this.cacheManager.get<TrendAnalysisResult>(cacheKey);

      if (cached) {
        return { success: true, data: cached };
      }

      // In a real implementation, this would fetch historical data
      // For now, we'll generate synthetic trend data
      const trendData: TrendData[] = periods.map((period, index) => ({
        period,
        value: this.generateSyntheticTrendValue(metricType, index),
        change: this.generateSyntheticChange(index),
        changePercent: this.generateSyntheticChangePercent(index),
        timestamp: new Date(),
      }));

      const trendAnalysis: TrendAnalysisResult = {
        schoolId,
        metricType,
        trend: this.determineTrendDirection(trendData),
        confidence: this.calculateTrendConfidence(trendData),
        data: trendData,
        forecast: await this.generateTrendForecast(trendData),
        analysisDate: new Date(),
      };

      await this.cacheManager.set(
        cacheKey,
        trendAnalysis,
        ANALYTICS_CONSTANTS.CACHE_TTL.TREND_DATA,
      );

      this.eventEmitter.emit('analytics.trends.analyzed', {
        schoolId,
        metricType,
        trend: trendAnalysis.trend,
      });

      return { success: true, data: trendAnalysis };
    } catch (error) {
      this.logError(`Failed to analyze trends for school ${schoolId}, metric ${metricType}`, error);
      return {
        success: false,
        error: `Failed to analyze trends: ${error.message}`,
      };
    }
  }

  /**
   * Generate forecast for health metrics
   */
  async generateHealthForecast(
    schoolId: string,
    metricType: string,
    periods: number = ANALYTICS_CONSTANTS.CALCULATIONS.FORECAST_PERIODS,
  ): Promise<AnalyticsOperationResult<ForecastAnalysisResult>> {
    try {
      // Generate synthetic forecast data
      const forecastData: ForecastData[] = Array.from({ length: periods }, (_, index) => ({
        period: index + 1,
        predictedValue: this.generateSyntheticForecastValue(metricType, index),
        confidenceInterval: {
          lower: this.generateSyntheticForecastValue(metricType, index) * 0.9,
          upper: this.generateSyntheticForecastValue(metricType, index) * 1.1,
        },
        probability: 0.85 - (index * 0.05), // Decreasing confidence over time
        factors: this.generateForecastFactors(metricType),
        forecastDate: new Date(Date.now() + (index + 1) * 30 * 24 * 60 * 60 * 1000), // Monthly intervals
      }));

      const forecastAnalysis: ForecastAnalysisResult = {
        schoolId,
        metricType,
        forecast: forecastData,
        overallConfidence: this.calculateOverallForecastConfidence(forecastData),
        assumptions: this.generateForecastAssumptions(metricType),
        generatedAt: new Date(),
      };

      return { success: true, data: forecastAnalysis };
    } catch (error) {
      this.logError(`Failed to generate forecast for school ${schoolId}, metric ${metricType}`, error);
      return {
        success: false,
        error: `Failed to generate forecast: ${error.message}`,
      };
    }
  }

  /**
   * Calculate appointment efficiency metrics
   */
  calculateAppointmentEfficiency(
    appointmentData: AppointmentAnalyticsData,
  ): {
    efficiencyScore: number;
    utilizationRate: number;
    noShowImpact: number;
    recommendations: string[];
  } {
    const efficiencyScore = Math.max(0, Math.min(100,
      (appointmentData.completionRate * 0.7) +
      ((100 - appointmentData.noShowRate) * 0.3)
    ));

    const utilizationRate = appointmentData.totalAppointments > 0
      ? (appointmentData.completedAppointments / appointmentData.totalAppointments) * 100
      : 0;

    const noShowImpact = appointmentData.noShowRate;

    const recommendations: string[] = [];
    if (appointmentData.noShowRate > ANALYTICS_CONSTANTS.THRESHOLDS.NO_SHOW_RATE) {
      recommendations.push('Implement reminder system to reduce no-show rate');
    }
    if (appointmentData.completionRate < ANALYTICS_CONSTANTS.THRESHOLDS.APPOINTMENT_COMPLETION) {
      recommendations.push('Review appointment scheduling process');
    }

    return {
      efficiencyScore,
      utilizationRate,
      noShowImpact,
      recommendations,
    };
  }

  /**
   * Calculate medication management effectiveness
   */
  calculateMedicationEffectiveness(
    medicationData: MedicationAnalyticsData,
  ): {
    effectivenessScore: number;
    adherenceRate: number;
    diversityIndex: number;
    recommendations: string[];
  } {
    // Simplified effectiveness calculation
    const effectivenessScore = Math.min(100,
      (medicationData.uniqueStudents / Math.max(medicationData.totalAdministrations, 1)) * 100
    );

    const adherenceRate = ANALYTICS_CONSTANTS.THRESHOLDS.MEDICATION_ADHERENCE; // Placeholder

    const diversityIndex = medicationData.topMedications.length > 0
      ? (medicationData.topMedications.length / 10) * 100 // Normalize to 0-100
      : 0;

    const recommendations: string[] = [];
    if (medicationData.upcomingMedications > 10) {
      recommendations.push('High volume of upcoming medications - consider staffing adjustments');
    }
    if (diversityIndex < 30) {
      recommendations.push('Limited medication variety - review treatment protocols');
    }

    return {
      effectivenessScore,
      adherenceRate,
      diversityIndex,
      recommendations,
    };
  }

  /**
   * Calculate incident response effectiveness
   */
  calculateIncidentResponseEffectiveness(
    incidentData: IncidentAnalyticsData,
  ): {
    responseScore: number;
    severityDistribution: { [key: string]: number };
    criticalIncidentRate: number;
    recommendations: string[];
  } {
    const totalIncidents = incidentData.totalIncidents;
    const criticalRate = totalIncidents > 0
      ? (incidentData.criticalIncidents / totalIncidents) * 100
      : 0;

    // Simplified response score based on critical incident rate
    const responseScore = Math.max(0, 100 - (criticalRate * 2));

    const severityDistribution = incidentData.incidentsBySeverity.reduce(
      (acc, item) => {
        acc[item.severity] = item.count;
        return acc;
      },
      {} as { [key: string]: number },
    );

    const recommendations: string[] = [];
    if (criticalRate > 5) {
      recommendations.push('High critical incident rate - review safety protocols');
    }
    if (totalIncidents > ANALYTICS_CONSTANTS.THRESHOLDS.CRITICAL_INCIDENTS) {
      recommendations.push('Elevated incident volume - conduct safety assessment');
    }

    return {
      responseScore,
      severityDistribution,
      criticalIncidentRate: criticalRate,
      recommendations,
    };
  }

  // Private helper methods

  private calculateMedicationAdherenceScore(metrics: HealthMetricsData): number {
    return Math.min(100, Math.max(0, metrics.medicationAdherence));
  }

  private calculateImmunizationComplianceScore(metrics: HealthMetricsData): number {
    return Math.min(100, Math.max(0, metrics.immunizationCompliance));
  }

  private calculateHealthRecordActivityScore(metrics: HealthMetricsData): number {
    // Score based on active records per student
    const recordsPerStudent = metrics.totalStudents > 0
      ? metrics.activeHealthRecords / metrics.totalStudents
      : 0;
    return Math.min(100, recordsPerStudent * 20); // Scale to 0-100
  }

  private calculateOverallHealthIndex(metrics: HealthMetricsData): number {
    const weights = {
      medication: 0.3,
      immunization: 0.3,
      activity: 0.2,
      conditions: 0.2,
    };

    const medicationScore = this.calculateMedicationAdherenceScore(metrics);
    const immunizationScore = this.calculateImmunizationComplianceScore(metrics);
    const activityScore = this.calculateHealthRecordActivityScore(metrics);
    const conditionScore = metrics.topConditions.length > 0 ? 80 : 100; // Penalty for conditions

    return (
      medicationScore * weights.medication +
      immunizationScore * weights.immunization +
      activityScore * weights.activity +
      conditionScore * weights.conditions
    );
  }

  private identifyRiskIndicators(metrics: HealthMetricsData): string[] {
    const indicators: string[] = [];

    if (metrics.medicationAdherence < ANALYTICS_CONSTANTS.THRESHOLDS.MEDICATION_ADHERENCE) {
      indicators.push('Low medication adherence');
    }
    if (metrics.immunizationCompliance < ANALYTICS_CONSTANTS.THRESHOLDS.IMMUNIZATION_COMPLIANCE) {
      indicators.push('Low immunization compliance');
    }
    if (metrics.topConditions.length > 5) {
      indicators.push('High number of reported conditions');
    }

    return indicators;
  }

  private identifyImprovementAreas(metrics: HealthMetricsData): string[] {
    const areas: string[] = [];

    if (metrics.medicationAdherence < 90) {
      areas.push('Medication adherence programs');
    }
    if (metrics.immunizationCompliance < 95) {
      areas.push('Immunization tracking and reminders');
    }
    if (metrics.activeHealthRecords < metrics.totalStudents * 0.5) {
      areas.push('Health record documentation');
    }

    return areas;
  }

  private generateSyntheticTrendValue(metricType: string, index: number): number {
    const baseValues: { [key: string]: number } = {
      'medication_adherence': 85,
      'immunization_compliance': 90,
      'health_records': 150,
      'incidents': 5,
    };

    const base = baseValues[metricType] || 100;
    return base + (Math.random() - 0.5) * 20 + (index * 2);
  }

  private generateSyntheticChange(index: number): number {
    return (Math.random() - 0.5) * 10;
  }

  private generateSyntheticChangePercent(index: number): number {
    return (Math.random() - 0.5) * 20;
  }

  private determineTrendDirection(data: TrendData[]): 'increasing' | 'decreasing' | 'stable' {
    if (data.length < 2) return 'stable';

    const changes = data.slice(1).map((item, index) =>
      item.value - data[index].value
    );
    const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;

    if (avgChange > 1) return 'increasing';
    if (avgChange < -1) return 'decreasing';
    return 'stable';
  }

  private calculateTrendConfidence(data: TrendData[]): number {
    if (data.length < ANALYTICS_CONSTANTS.CALCULATIONS.MIN_DATA_POINTS) {
      return 0.5;
    }
    return Math.min(0.95, data.length / 10);
  }

  private async generateTrendForecast(data: TrendData[]): Promise<ForecastData[]> {
    // Simplified forecast generation
    const lastValue = data[data.length - 1]?.value || 0;
    return Array.from({ length: 3 }, (_, index) => ({
      period: index + 1,
      predictedValue: lastValue + (index + 1) * 5,
      confidenceInterval: {
        lower: lastValue + (index + 1) * 3,
        upper: lastValue + (index + 1) * 7,
      },
      probability: 0.8 - (index * 0.1),
      factors: ['Historical trend', 'Seasonal patterns'],
      forecastDate: new Date(Date.now() + (index + 1) * 30 * 24 * 60 * 60 * 1000),
    }));
  }

  private generateSyntheticForecastValue(metricType: string, index: number): number {
    const baseValues: { [key: string]: number } = {
      'medication_adherence': 85,
      'immunization_compliance': 90,
      'health_records': 150,
      'incidents': 5,
    };

    const base = baseValues[metricType] || 100;
    return base + (index + 1) * 3 + Math.random() * 5;
  }

  private generateForecastFactors(metricType: string): string[] {
    const factors: { [key: string]: string[] } = {
      'medication_adherence': ['Staff training', 'Reminder systems', 'Student engagement'],
      'immunization_compliance': ['Vaccine availability', 'Parental education', 'School policies'],
      'health_records': ['Documentation processes', 'Staff workload', 'System usability'],
      'incidents': ['Safety protocols', 'Staff training', 'Environmental factors'],
    };

    return factors[metricType] || ['General trends', 'External factors'];
  }

  private calculateOverallForecastConfidence(forecast: ForecastData[]): number {
    if (forecast.length === 0) return 0;

    const avgProbability = forecast.reduce(
      (sum, item) => sum + item.probability,
      0,
    ) / forecast.length;

    return Math.min(0.95, avgProbability);
  }

  private generateForecastAssumptions(metricType: string): string[] {
    return [
      'Current trends will continue',
      'No major policy changes',
      'Staffing levels remain constant',
      'External factors remain stable',
    ];
  }
}
