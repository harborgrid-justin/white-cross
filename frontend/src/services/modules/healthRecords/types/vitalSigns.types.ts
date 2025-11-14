/**
 * Vital Signs Type Definitions
 *
 * Types for managing vital signs monitoring including:
 * - Temperature, blood pressure, heart rate, etc.
 * - Trend analysis and alerts
 * - Clinical measurements
 *
 * @module services/modules/healthRecords/types/vitalSigns.types
 */

/**
 * Vital signs record entity
 */
export interface VitalSigns {
  id: string;
  studentId: string;
  recordDate: string;
  temperature?: number; // in Celsius
  temperatureMethod?: TemperatureMethod;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number; // beats per minute
  respiratoryRate?: number; // breaths per minute
  oxygenSaturation?: number; // percentage
  pain?: number; // 0-10 scale
  glucose?: number; // mg/dL
  weight?: number; // in kg
  height?: number; // in cm
  notes?: string;
  recordedBy: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Temperature measurement methods
 */
export type TemperatureMethod = 'oral' | 'axillary' | 'tympanic' | 'temporal';

/**
 * Vital sign types for trend analysis
 */
export type VitalType = 'temperature' | 'bloodPressure' | 'heartRate' | 'respiratoryRate' | 'oxygenSaturation';

/**
 * Data required to create a new vital signs record
 */
export interface VitalSignsCreate {
  studentId: string;
  recordDate: string;
  temperature?: number;
  temperatureMethod?: TemperatureMethod;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  pain?: number;
  glucose?: number;
  weight?: number;
  height?: number;
  notes?: string;
  recordedBy: string;
}

/**
 * Data for updating an existing vital signs record
 */
export interface VitalSignsUpdate {
  recordDate?: string;
  temperature?: number;
  temperatureMethod?: TemperatureMethod;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  pain?: number;
  glucose?: number;
  weight?: number;
  height?: number;
  notes?: string;
}

/**
 * Vital signs trend information
 */
export interface VitalSignsTrend {
  studentId: string;
  vitalType: VitalType;
  measurements: Array<{
    date: string;
    value: number;
    systolic?: number;
    diastolic?: number;
  }>;
  average: number;
  min: number;
  max: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  alerts: string[];
}

/**
 * Filters for querying vital signs
 */
export interface VitalSignsFilters {
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}
