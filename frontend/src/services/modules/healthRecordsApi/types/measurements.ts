/**
 * Health Records API - Measurement Type Definitions
 *
 * Types for physical measurements including growth tracking and vital signs
 *
 * @module services/modules/healthRecordsApi/types/measurements
 */

import type { StudentReference, StudentReferenceWithDemographics } from './base';

// ==========================================
// GROWTH MEASUREMENTS
// ==========================================

/**
 * Complete growth measurement record entity
 * Tracks physical growth metrics over time for pediatric health monitoring
 */
export interface GrowthMeasurement {
  /** Unique identifier for the measurement record */
  id: string;
  /** ID of the student being measured */
  studentId: string;
  /** Date measurement was taken (ISO 8601 format) */
  measurementDate: string;
  /** Height in centimeters */
  height?: number;
  /** Weight in kilograms */
  weight?: number;
  /** Head circumference in centimeters (typically for younger children) */
  headCircumference?: number;
  /** Calculated Body Mass Index */
  bmi?: number;
  /** BMI percentile for age and gender */
  bmiPercentile?: number;
  /** Height percentile for age and gender */
  heightPercentile?: number;
  /** Weight percentile for age and gender */
  weightPercentile?: number;
  /** Name of person who took the measurements */
  measuredBy: string;
  /** Additional notes about the measurement */
  notes?: string;
  /** Student reference with required demographic data for percentile calculations */
  student: StudentReferenceWithDemographics;
  /** Timestamp when record was created (ISO 8601 format) */
  createdAt: string;
  /** Timestamp when record was last updated (ISO 8601 format) */
  updatedAt: string;
}

/**
 * Data required to create a new growth measurement record
 * Excludes calculated fields (BMI, percentiles) and system-generated fields
 */
export interface GrowthMeasurementCreate {
  /** ID of the student being measured */
  studentId: string;
  /** Date measurement was taken (ISO 8601 format) */
  measurementDate: string;
  /** Height in centimeters */
  height?: number;
  /** Weight in kilograms */
  weight?: number;
  /** Head circumference in centimeters */
  headCircumference?: number;
  /** Name of person who took the measurements */
  measuredBy: string;
  /** Additional notes about the measurement */
  notes?: string;
}

/**
 * Fields that can be updated on an existing growth measurement record
 * All fields are optional to support partial updates
 */
export interface GrowthMeasurementUpdate {
  /** Date measurement was taken (ISO 8601 format) */
  measurementDate?: string;
  /** Height in centimeters */
  height?: number;
  /** Weight in kilograms */
  weight?: number;
  /** Head circumference in centimeters */
  headCircumference?: number;
  /** Name of person who took the measurements */
  measuredBy?: string;
  /** Additional notes about the measurement */
  notes?: string;
}

/**
 * Trend directions for growth metrics
 */
export type GrowthTrendDirection = 'increasing' | 'stable' | 'decreasing';

/**
 * Growth trend analysis for a student
 * Provides historical view and trend analysis of growth measurements
 */
export interface GrowthTrend {
  /** ID of the student */
  studentId: string;
  /** Historical measurements in chronological order */
  measurements: GrowthMeasurement[];
  /** Analyzed trends for different metrics */
  trends: {
    /** Height trend over time */
    heightTrend: GrowthTrendDirection;
    /** Weight trend over time */
    weightTrend: GrowthTrendDirection;
    /** BMI trend over time */
    bmiTrend: GrowthTrendDirection;
  };
  /** Any concerns identified from the growth patterns */
  concerns: string[];
  /** Recommendations based on growth trends */
  recommendations: string[];
}

// ==========================================
// VITAL SIGNS
// ==========================================

/**
 * Method used for temperature measurement
 */
export type TemperatureMethod = 'oral' | 'axillary' | 'tympanic' | 'temporal';

/**
 * Complete vital signs record entity
 * Captures various physiological measurements at a point in time
 */
export interface VitalSigns {
  /** Unique identifier for the vital signs record */
  id: string;
  /** ID of the student */
  studentId: string;
  /** Date and time vitals were recorded (ISO 8601 format) */
  recordDate: string;
  /** Body temperature in Celsius */
  temperature?: number;
  /** Method used to measure temperature */
  temperatureMethod?: TemperatureMethod;
  /** Systolic blood pressure in mmHg */
  bloodPressureSystolic?: number;
  /** Diastolic blood pressure in mmHg */
  bloodPressureDiastolic?: number;
  /** Heart rate in beats per minute */
  heartRate?: number;
  /** Respiratory rate in breaths per minute */
  respiratoryRate?: number;
  /** Oxygen saturation percentage (SpO2) */
  oxygenSaturation?: number;
  /** Pain level on 0-10 scale */
  pain?: number;
  /** Blood glucose level in mg/dL */
  glucose?: number;
  /** Weight in kilograms */
  weight?: number;
  /** Height in centimeters */
  height?: number;
  /** Additional notes about the vital signs */
  notes?: string;
  /** Name of person who recorded the vitals */
  recordedBy: string;
  /** Reference to the student */
  student: StudentReference;
  /** Timestamp when record was created (ISO 8601 format) */
  createdAt: string;
  /** Timestamp when record was last updated (ISO 8601 format) */
  updatedAt: string;
}

/**
 * Data required to create a new vital signs record
 * Excludes system-generated fields like id, timestamps, and student reference
 */
export interface VitalSignsCreate {
  /** ID of the student */
  studentId: string;
  /** Date and time vitals were recorded (ISO 8601 format) */
  recordDate: string;
  /** Body temperature in Celsius */
  temperature?: number;
  /** Method used to measure temperature */
  temperatureMethod?: TemperatureMethod;
  /** Systolic blood pressure in mmHg */
  bloodPressureSystolic?: number;
  /** Diastolic blood pressure in mmHg */
  bloodPressureDiastolic?: number;
  /** Heart rate in beats per minute */
  heartRate?: number;
  /** Respiratory rate in breaths per minute */
  respiratoryRate?: number;
  /** Oxygen saturation percentage (SpO2) */
  oxygenSaturation?: number;
  /** Pain level on 0-10 scale */
  pain?: number;
  /** Blood glucose level in mg/dL */
  glucose?: number;
  /** Weight in kilograms */
  weight?: number;
  /** Height in centimeters */
  height?: number;
  /** Additional notes about the vital signs */
  notes?: string;
  /** Name of person who recorded the vitals */
  recordedBy: string;
}

/**
 * Fields that can be updated on an existing vital signs record
 * All fields are optional to support partial updates
 */
export interface VitalSignsUpdate {
  /** Date and time vitals were recorded (ISO 8601 format) */
  recordDate?: string;
  /** Body temperature in Celsius */
  temperature?: number;
  /** Method used to measure temperature */
  temperatureMethod?: TemperatureMethod;
  /** Systolic blood pressure in mmHg */
  bloodPressureSystolic?: number;
  /** Diastolic blood pressure in mmHg */
  bloodPressureDiastolic?: number;
  /** Heart rate in beats per minute */
  heartRate?: number;
  /** Respiratory rate in breaths per minute */
  respiratoryRate?: number;
  /** Oxygen saturation percentage (SpO2) */
  oxygenSaturation?: number;
  /** Pain level on 0-10 scale */
  pain?: number;
  /** Blood glucose level in mg/dL */
  glucose?: number;
  /** Weight in kilograms */
  weight?: number;
  /** Height in centimeters */
  height?: number;
  /** Additional notes about the vital signs */
  notes?: string;
}

/**
 * Query filters for retrieving vital signs records
 */
export interface VitalSignsFilters {
  /** Filter by records on or after this date (ISO 8601 format) */
  dateFrom?: string;
  /** Filter by records on or before this date (ISO 8601 format) */
  dateTo?: string;
  /** Maximum number of records to return */
  limit?: number;
}

/**
 * Type of vital sign being analyzed
 */
export type VitalType = 'temperature' | 'bloodPressure' | 'heartRate' | 'respiratoryRate' | 'oxygenSaturation';

/**
 * Trend direction for vital signs
 */
export type VitalTrendDirection = 'increasing' | 'stable' | 'decreasing';

/**
 * Vital signs trend analysis for a specific metric
 * Provides historical data and statistical analysis for a particular vital sign
 */
export interface VitalSignsTrend {
  /** ID of the student */
  studentId: string;
  /** Type of vital sign being analyzed */
  vitalType: VitalType;
  /** Historical measurements in chronological order */
  measurements: Array<{
    /** Date of measurement (ISO 8601 format) */
    date: string;
    /** Primary value (temperature, heart rate, etc.) */
    value: number;
    /** Systolic blood pressure (only for bloodPressure type) */
    systolic?: number;
    /** Diastolic blood pressure (only for bloodPressure type) */
    diastolic?: number;
  }>;
  /** Average value across all measurements */
  average: number;
  /** Minimum value observed */
  min: number;
  /** Maximum value observed */
  max: number;
  /** Overall trend direction */
  trend: VitalTrendDirection;
  /** Any alerts or concerns based on the measurements */
  alerts: string[];
}
