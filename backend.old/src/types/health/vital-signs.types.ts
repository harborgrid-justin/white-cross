/**
 * Type definitions for vital signs and health measurements
 * Replaces `any` types for PHI (Protected Health Information) data
 */

/**
 * Complete vital signs measurement interface
 * Used for health records and vital sign tracking
 */
export interface VitalSigns {
  temperature?: number; // in Fahrenheit or Celsius
  bloodPressureSystolic?: number; // in mmHg
  bloodPressureDiastolic?: number; // in mmHg
  heartRate?: number; // beats per minute
  respiratoryRate?: number; // breaths per minute
  oxygenSaturation?: number; // percentage (0-100)
  height?: number; // in inches or cm
  weight?: number; // in pounds or kg
  bmi?: number; // calculated Body Mass Index
  bloodGlucose?: number; // mg/dL
  headCircumference?: number; // for pediatric measurements
  painLevel?: number; // 0-10 scale
}

/**
 * Vital signs record with metadata
 * Includes measurement context and who performed it
 */
export interface VitalSignsRecord extends VitalSigns {
  id: string;
  studentId: string;
  measuredAt: Date;
  measuredBy: string;
  notes?: string;
  location?: string; // where measurement was taken
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Vital signs with temporal information for tracking
 */
export interface VitalSignsMeasurement {
  recordId: string;
  date: Date;
  vitalSigns: VitalSigns;
  provider?: string;
  notes?: string;
}

/**
 * Vital signs ranges for health assessment
 */
export interface VitalSignsRange {
  temperature?: { min: number; max: number };
  bloodPressureSystolic?: { min: number; max: number };
  bloodPressureDiastolic?: { min: number; max: number };
  heartRate?: { min: number; max: number };
  respiratoryRate?: { min: number; max: number };
  oxygenSaturation?: { min: number; max: number };
}

/**
 * Vital signs trend data for analytics
 */
export interface VitalSignsTrend {
  studentId: string;
  measurementType: keyof VitalSigns;
  measurements: Array<{
    date: Date;
    value: number;
  }>;
  average: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}
