/**
 * @fileoverview CDC Growth Charts Integration Utilities
 * @module utils/cdcGrowthCharts
 * @description Provides CDC-based growth chart calculations including percentiles for height,
 * weight, BMI, and head circumference using the LMS (Lambda-Mu-Sigma) method
 *
 * LOC: CDC-GROWTH-001
 * WC-UTIL-CDC-001 | CDC Growth Charts Integration
 *
 * Purpose: Calculate height, weight, and BMI percentiles based on CDC growth charts
 * Reference: CDC National Center for Health Statistics (NCHS)
 * Data Source: https://www.cdc.gov/growthcharts/
 */

import { logger } from './logger';

/**
 * @enum {string}
 * @description Gender options for growth chart calculations
 * @property {string} MALE - Male gender identifier
 * @property {string} FEMALE - Female gender identifier
 *
 * @example
 * const gender = GrowthChartGender.MALE;
 */
export enum GrowthChartGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

/**
 * @typedef {Object} GrowthMeasurement
 * @description Input data for growth percentile calculations
 * @property {number} ageInMonths - Age in months (0-240, representing 0-20 years)
 * @property {GrowthChartGender} gender - Gender for age/gender-specific calculations
 * @property {number} [heightCm] - Height in centimeters (optional, 40-200cm)
 * @property {number} [weightKg] - Weight in kilograms (optional, 2-200kg)
 * @property {number} [headCircumferenceCm] - Head circumference in cm (optional, 30-60cm, for ages 0-36 months only)
 *
 * @example
 * const measurement: GrowthMeasurement = {
 *   ageInMonths: 24,
 *   gender: GrowthChartGender.MALE,
 *   heightCm: 85.5,
 *   weightKg: 12.5,
 *   headCircumferenceCm: 48.0
 * };
 */
export interface GrowthMeasurement {
  ageInMonths: number;
  gender: GrowthChartGender;
  heightCm?: number;
  weightKg?: number;
  headCircumferenceCm?: number; // For ages 0-36 months
}

/**
 * @typedef {Object} GrowthPercentiles
 * @description Calculated growth percentiles and interpretations
 * @property {number} [heightPercentile] - Height percentile (0.1-99.9)
 * @property {number} [weightPercentile] - Weight percentile (0.1-99.9)
 * @property {number} [bmiPercentile] - BMI percentile (0.1-99.9, for ages 24+ months)
 * @property {number} [headCircumferencePercentile] - Head circumference percentile (0-36 months only)
 * @property {number} [bmi] - Calculated BMI value
 * @property {Object} interpretation - Clinical interpretations of percentiles
 * @property {string} [interpretation.height] - Height percentile interpretation
 * @property {string} [interpretation.weight] - Weight percentile interpretation
 * @property {string} [interpretation.bmi] - BMI percentile interpretation with CDC categories
 *
 * @example
 * const percentiles: GrowthPercentiles = {
 *   heightPercentile: 55.2,
 *   weightPercentile: 48.7,
 *   bmiPercentile: 42.1,
 *   bmi: 17.2,
 *   interpretation: {
 *     height: 'Average height (25th-75th percentile)',
 *     weight: 'Average weight (25th-75th percentile)',
 *     bmi: 'Healthy weight (5th-85th percentile)'
 *   }
 * };
 */
export interface GrowthPercentiles {
  heightPercentile?: number;
  weightPercentile?: number;
  bmiPercentile?: number;
  headCircumferencePercentile?: number;
  bmi?: number;
  interpretation: {
    height?: string;
    weight?: string;
    bmi?: string;
  };
}

/**
 * CDC Growth Charts Calculator
 * 
 * This implementation uses the LMS (Lambda-Mu-Sigma) method from CDC
 * Reference: https://www.cdc.gov/growthcharts/percentile_data_files.htm
 * 
 * For production use, consider integrating with:
 * - CDC's published LMS tables (available as CSV/Excel)
 * - WHO growth standards for children under 2
 * - State-specific growth monitoring requirements
 */
export class CDCGrowthCharts {
  /**
   * Calculate all percentiles for a given measurement
   */
  static calculatePercentiles(measurement: GrowthMeasurement): GrowthPercentiles {
    try {
      const result: GrowthPercentiles = {
        interpretation: {}
      };

      // Calculate height percentile
      if (measurement.heightCm !== undefined) {
        result.heightPercentile = this.calculateHeightPercentile(
          measurement.ageInMonths,
          measurement.gender,
          measurement.heightCm
        );
        result.interpretation.height = this.interpretPercentile(result.heightPercentile, 'height');
      }

      // Calculate weight percentile
      if (measurement.weightKg !== undefined) {
        result.weightPercentile = this.calculateWeightPercentile(
          measurement.ageInMonths,
          measurement.gender,
          measurement.weightKg
        );
        result.interpretation.weight = this.interpretPercentile(result.weightPercentile, 'weight');
      }

      // Calculate BMI and BMI percentile (for ages 2+)
      if (measurement.heightCm !== undefined && measurement.weightKg !== undefined) {
        result.bmi = this.calculateBMI(measurement.heightCm, measurement.weightKg);
        
        if (measurement.ageInMonths >= 24) { // BMI percentiles start at age 2
          result.bmiPercentile = this.calculateBMIPercentile(
            measurement.ageInMonths,
            measurement.gender,
            result.bmi
          );
          result.interpretation.bmi = this.interpretBMIPercentile(result.bmiPercentile);
        }
      }

      // Calculate head circumference percentile (for ages 0-36 months)
      if (measurement.headCircumferenceCm !== undefined && measurement.ageInMonths <= 36) {
        result.headCircumferencePercentile = this.calculateHeadCircumferencePercentile(
          measurement.ageInMonths,
          measurement.gender,
          measurement.headCircumferenceCm
        );
      }

      logger.debug('Growth percentiles calculated', {
        ageMonths: measurement.ageInMonths,
        gender: measurement.gender,
        percentiles: result
      });

      return result;
    } catch (error) {
      logger.error('Failed to calculate growth percentiles', error);
      throw new Error(`Growth chart calculation failed: ${(error as Error).message}`);
    }
  }

  /**
   * Calculate BMI from height and weight
   */
  static calculateBMI(heightCm: number, weightKg: number): number {
    const heightM = heightCm / 100;
    return Number((weightKg / (heightM * heightM)).toFixed(1));
  }

  /**
   * Calculate height percentile using simplified LMS method
   * 
   * TODO: For production, load actual CDC LMS tables from data files
   * Current implementation uses approximations for demonstration
   */
  private static calculateHeightPercentile(
    ageMonths: number,
    gender: GrowthChartGender,
    heightCm: number
  ): number {
    // This is a simplified calculation
    // In production, use actual CDC LMS values (L, M, S parameters)
    
    // Approximate median heights by age and gender
    const medianHeight = this.getMedianHeight(ageMonths, gender);
    const standardDeviation = this.getHeightStdDev(ageMonths, gender);
    
    // Calculate z-score
    const zScore = (heightCm - medianHeight) / standardDeviation;
    
    // Convert z-score to percentile
    return this.zScoreToPercentile(zScore);
  }

  /**
   * Calculate weight percentile using simplified LMS method
   */
  private static calculateWeightPercentile(
    ageMonths: number,
    gender: GrowthChartGender,
    weightKg: number
  ): number {
    const medianWeight = this.getMedianWeight(ageMonths, gender);
    const standardDeviation = this.getWeightStdDev(ageMonths, gender);
    
    const zScore = (weightKg - medianWeight) / standardDeviation;
    return this.zScoreToPercentile(zScore);
  }

  /**
   * Calculate BMI percentile using simplified LMS method
   */
  private static calculateBMIPercentile(
    ageMonths: number,
    gender: GrowthChartGender,
    bmi: number
  ): number {
    if (ageMonths < 24) {
      logger.warn('BMI percentiles not applicable for children under 24 months');
      return 50; // Return median
    }

    const medianBMI = this.getMedianBMI(ageMonths, gender);
    const standardDeviation = this.getBMIStdDev(ageMonths, gender);
    
    const zScore = (bmi - medianBMI) / standardDeviation;
    return this.zScoreToPercentile(zScore);
  }

  /**
   * Calculate head circumference percentile (0-36 months)
   */
  private static calculateHeadCircumferencePercentile(
    ageMonths: number,
    gender: GrowthChartGender,
    circumferenceCm: number
  ): number {
    if (ageMonths > 36) {
      logger.warn('Head circumference percentiles not applicable after 36 months');
      return 50;
    }

    const medianCircumference = this.getMedianHeadCircumference(ageMonths, gender);
    const standardDeviation = 2.0; // Approximate SD for head circumference
    
    const zScore = (circumferenceCm - medianCircumference) / standardDeviation;
    return this.zScoreToPercentile(zScore);
  }

  /**
   * Convert z-score to percentile using normal distribution approximation
   */
  private static zScoreToPercentile(zScore: number): number {
    // Using error function approximation for normal CDF
    // For production, use a proper statistics library
    
    const t = 1 / (1 + 0.2316419 * Math.abs(zScore));
    const d = 0.3989423 * Math.exp(-zScore * zScore / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    
    let percentile = zScore > 0 ? (1 - p) * 100 : p * 100;
    
    // Clamp to valid range
    percentile = Math.max(0.1, Math.min(99.9, percentile));
    
    return Number(percentile.toFixed(1));
  }

  /**
   * Get median height for age and gender
   * Based on CDC growth chart data approximations
   */
  private static getMedianHeight(ageMonths: number, gender: GrowthChartGender): number {
    // Simplified median heights (in cm) - actual CDC data should be used in production
    const baseHeight = gender === GrowthChartGender.MALE ? 50.5 : 49.5; // Birth
    const monthlyGrowth = ageMonths < 12 ? 2.5 : (ageMonths < 24 ? 1.2 : 0.6);
    
    return baseHeight + (ageMonths * monthlyGrowth);
  }

  /**
   * Get height standard deviation for age
   */
  private static getHeightStdDev(ageMonths: number, gender: GrowthChartGender): number {
    // Simplified - actual CDC LMS S values should be used
    return ageMonths < 24 ? 2.5 : 5.0;
  }

  /**
   * Get median weight for age and gender
   */
  private static getMedianWeight(ageMonths: number, gender: GrowthChartGender): number {
    const baseWeight = gender === GrowthChartGender.MALE ? 3.5 : 3.3; // Birth (kg)
    
    if (ageMonths < 3) return baseWeight + (ageMonths * 0.8);
    if (ageMonths < 12) return baseWeight + (3 * 0.8) + ((ageMonths - 3) * 0.5);
    if (ageMonths < 24) return baseWeight + (3 * 0.8) + (9 * 0.5) + ((ageMonths - 12) * 0.25);
    
    return baseWeight + (3 * 0.8) + (9 * 0.5) + (12 * 0.25) + ((ageMonths - 24) * 0.2);
  }

  /**
   * Get weight standard deviation for age
   */
  private static getWeightStdDev(ageMonths: number, gender: GrowthChartGender): number {
    return ageMonths < 24 ? 1.2 : 2.5;
  }

  /**
   * Get median BMI for age and gender
   */
  private static getMedianBMI(ageMonths: number, gender: GrowthChartGender): number {
    // Simplified median BMI values
    const ageYears = ageMonths / 12;
    
    if (gender === GrowthChartGender.MALE) {
      return 17.5 + (ageYears - 2) * 0.15;
    } else {
      return 17.0 + (ageYears - 2) * 0.15;
    }
  }

  /**
   * Get BMI standard deviation for age
   */
  private static getBMIStdDev(ageMonths: number, gender: GrowthChartGender): number {
    return 2.0;
  }

  /**
   * Get median head circumference for age and gender
   */
  private static getMedianHeadCircumference(ageMonths: number, gender: GrowthChartGender): number {
    const baseCircumference = gender === GrowthChartGender.MALE ? 35.0 : 34.5; // Birth (cm)
    const monthlyGrowth = ageMonths < 6 ? 2.0 : (ageMonths < 12 ? 0.5 : 0.2);
    
    return baseCircumference + (ageMonths * monthlyGrowth);
  }

  /**
   * Interpret percentile value
   */
  private static interpretPercentile(percentile: number, type: string): string {
    if (percentile < 3) return `Very low ${type} (< 3rd percentile) - consult healthcare provider`;
    if (percentile < 10) return `Below average ${type} (3rd-10th percentile)`;
    if (percentile < 25) return `Below average ${type} (10th-25th percentile)`;
    if (percentile <= 75) return `Average ${type} (25th-75th percentile)`;
    if (percentile <= 90) return `Above average ${type} (75th-90th percentile)`;
    if (percentile <= 97) return `Above average ${type} (90th-97th percentile)`;
    return `Very high ${type} (> 97th percentile) - consult healthcare provider`;
  }

  /**
   * Interpret BMI percentile according to CDC categories
   */
  private static interpretBMIPercentile(percentile: number): string {
    if (percentile < 5) return 'Underweight (< 5th percentile)';
    if (percentile < 85) return 'Healthy weight (5th-85th percentile)';
    if (percentile < 95) return 'Overweight (85th-95th percentile)';
    return 'Obese (≥ 95th percentile)';
  }

  /**
   * Calculate age in months from date of birth
   */
  static calculateAgeInMonths(dateOfBirth: Date): number {
    const now = new Date();
    const diffMs = now.getTime() - dateOfBirth.getTime();
    const ageMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.44)); // Average month length
    return ageMonths;
  }

  /**
   * Validate measurement data
   */
  static validateMeasurement(measurement: GrowthMeasurement): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (measurement.ageInMonths < 0 || measurement.ageInMonths > 240) {
      errors.push('Age must be between 0 and 240 months (0-20 years)');
    }

    if (measurement.heightCm !== undefined) {
      if (measurement.heightCm < 40 || measurement.heightCm > 200) {
        errors.push('Height must be between 40cm and 200cm');
      }
    }

    if (measurement.weightKg !== undefined) {
      if (measurement.weightKg < 2 || measurement.weightKg > 200) {
        errors.push('Weight must be between 2kg and 200kg');
      }
    }

    if (measurement.headCircumferenceCm !== undefined) {
      if (measurement.headCircumferenceCm < 30 || measurement.headCircumferenceCm > 60) {
        errors.push('Head circumference must be between 30cm and 60cm');
      }
      if (measurement.ageInMonths > 36) {
        errors.push('Head circumference is only measured for children 0-36 months');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
