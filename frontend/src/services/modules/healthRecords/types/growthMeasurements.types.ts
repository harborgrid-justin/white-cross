/**
 * Growth Measurements Type Definitions
 *
 * Types for managing student growth tracking including:
 * - Height, weight, and BMI measurements
 * - Growth trends and percentiles
 * - Development monitoring
 *
 * @module services/modules/healthRecords/types/growthMeasurements.types
 */

/**
 * Growth measurement record entity
 */
export interface GrowthMeasurement {
  id: string;
  studentId: string;
  measurementDate: string;
  height?: number; // in cm
  weight?: number; // in kg
  headCircumference?: number; // in cm
  bmi?: number;
  bmiPercentile?: number;
  heightPercentile?: number;
  weightPercentile?: number;
  measuredBy: string;
  notes?: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
    dateOfBirth: string;
    gender: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Data required to create a new growth measurement
 */
export interface GrowthMeasurementCreate {
  studentId: string;
  measurementDate: string;
  height?: number;
  weight?: number;
  headCircumference?: number;
  measuredBy: string;
  notes?: string;
}

/**
 * Data for updating an existing growth measurement
 */
export interface GrowthMeasurementUpdate {
  measurementDate?: string;
  height?: number;
  weight?: number;
  headCircumference?: number;
  measuredBy?: string;
  notes?: string;
}

/**
 * Growth trend information for a student
 */
export interface GrowthTrend {
  studentId: string;
  measurements: GrowthMeasurement[];
  trends: {
    heightTrend: 'increasing' | 'stable' | 'decreasing';
    weightTrend: 'increasing' | 'stable' | 'decreasing';
    bmiTrend: 'increasing' | 'stable' | 'decreasing';
  };
  concerns: string[];
  recommendations: string[];
}
