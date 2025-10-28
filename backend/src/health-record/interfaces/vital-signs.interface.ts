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
  /** Body temperature in Fahrenheit (normal: 97.0-99.0°F) */
  temperature?: number;

  /** Systolic blood pressure in mmHg */
  bloodPressureSystolic?: number;

  /** Diastolic blood pressure in mmHg */
  bloodPressureDiastolic?: number;

  /** Heart rate in beats per minute (bpm) */
  heartRate?: number;

  /** Respiratory rate in breaths per minute */
  respiratoryRate?: number;

  /** Oxygen saturation percentage (normal: 95-100%) */
  oxygenSaturation?: number;

  /** Height in centimeters (CDC standard) */
  height?: number;

  /** Weight in kilograms (CDC standard) */
  weight?: number;

  /** Body Mass Index (weight/height²) */
  bmi?: number;
}
