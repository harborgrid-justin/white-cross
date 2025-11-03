/**
 * Vital Signs Interface
 *
 * Comprehensive vital signs measurements following clinical standards.
 * All measurements use standard medical units.
 *
 * @interface VitalSigns
 * @compliance CDC Growth Charts, WHO Child Growth Standards
 */
export interface VitalSigns {
  /** Unique identifier */
  id?: string;

  /** Student ID this vital signs record belongs to */
  studentId: string;

  /** Date and time of measurement */
  measurementDate: Date;

  /** Body temperature value */
  temperature?: number;

  /** Temperature unit (F or C) */
  temperatureUnit?: string;

  /** Heart rate in beats per minute */
  heartRate?: number;

  /** Respiratory rate in breaths per minute */
  respiratoryRate?: number;

  /** Systolic blood pressure in mmHg */
  bloodPressureSystolic?: number;

  /** Diastolic blood pressure in mmHg */
  bloodPressureDiastolic?: number;

  /** Oxygen saturation percentage */
  oxygenSaturation?: number;

  /** Weight measurement */
  weight?: number;

  /** Weight unit (lbs or kg) */
  weightUnit?: string;

  /** Height measurement */
  height?: number;

  /** Height unit (inches or cm) */
  heightUnit?: string;

  /** Body Mass Index (calculated) */
  bmi?: number;

  /** Pain level on 0-10 scale */
  pain?: number;

  /** Whether any vitals are abnormal */
  isAbnormal: boolean;

  /** Array of abnormal vital types */
  abnormalFlags?: string[];

  /** Person who measured the vitals */
  measuredBy?: string;

  /** Additional notes */
  notes?: string;

  /** Record creation timestamp */
  createdAt?: Date;

  /** Record update timestamp */
  updatedAt?: Date;
}
