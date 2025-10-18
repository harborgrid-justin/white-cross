/**
 * Healthcare data validation utilities
 * 
 * Provides validation functions for medical codes, clinical data,
 * and healthcare-specific data formats.
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface VitalSigns {
  temperature?: number;
  systolicBP?: number;
  diastolicBP?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  height?: number; // in cm
  weight?: number; // in kg
}

export interface ClinicalRanges {
  temperature: { min: number; max: number; unit: string };
  systolicBP: { min: number; max: number; unit: string };
  diastolicBP: { min: number; max: number; unit: string };
  heartRate: { min: number; max: number; unit: string };
  respiratoryRate: { min: number; max: number; unit: string };
  oxygenSaturation: { min: number; max: number; unit: string };
}

// Age-based normal ranges for pediatric patients
const PEDIATRIC_VITAL_RANGES: Record<string, ClinicalRanges> = {
  'infant': { // 0-12 months
    temperature: { min: 36.1, max: 37.2, unit: '°C' },
    systolicBP: { min: 70, max: 100, unit: 'mmHg' },
    diastolicBP: { min: 50, max: 70, unit: 'mmHg' },
    heartRate: { min: 100, max: 160, unit: 'bpm' },
    respiratoryRate: { min: 30, max: 60, unit: '/min' },
    oxygenSaturation: { min: 95, max: 100, unit: '%' }
  },
  'toddler': { // 1-3 years
    temperature: { min: 36.1, max: 37.2, unit: '°C' },
    systolicBP: { min: 80, max: 110, unit: 'mmHg' },
    diastolicBP: { min: 55, max: 75, unit: 'mmHg' },
    heartRate: { min: 90, max: 150, unit: 'bpm' },
    respiratoryRate: { min: 24, max: 40, unit: '/min' },
    oxygenSaturation: { min: 95, max: 100, unit: '%' }
  },
  'preschool': { // 3-6 years
    temperature: { min: 36.1, max: 37.2, unit: '°C' },
    systolicBP: { min: 95, max: 110, unit: 'mmHg' },
    diastolicBP: { min: 56, max: 70, unit: 'mmHg' },
    heartRate: { min: 80, max: 120, unit: 'bpm' },
    respiratoryRate: { min: 22, max: 34, unit: '/min' },
    oxygenSaturation: { min: 95, max: 100, unit: '%' }
  },
  'school': { // 6-12 years
    temperature: { min: 36.1, max: 37.2, unit: '°C' },
    systolicBP: { min: 97, max: 112, unit: 'mmHg' },
    diastolicBP: { min: 57, max: 71, unit: 'mmHg' },
    heartRate: { min: 70, max: 110, unit: 'bpm' },
    respiratoryRate: { min: 18, max: 30, unit: '/min' },
    oxygenSaturation: { min: 95, max: 100, unit: '%' }
  },
  'adolescent': { // 12+ years
    temperature: { min: 36.1, max: 37.2, unit: '°C' },
    systolicBP: { min: 110, max: 120, unit: 'mmHg' },
    diastolicBP: { min: 64, max: 80, unit: 'mmHg' },
    heartRate: { min: 60, max: 100, unit: 'bpm' },
    respiratoryRate: { min: 12, max: 20, unit: '/min' },
    oxygenSaturation: { min: 95, max: 100, unit: '%' }
  }
};

/**
 * Validate medical codes (ICD-10, CPT, NDC)
 * 
 * @param code - Medical code to validate
 * @param type - Type of medical code
 * @returns boolean indicating if code format is valid
 */
export function validateMedicalCode(code: string, type: 'ICD10' | 'CPT' | 'NDC'): boolean {
  if (!code || typeof code !== 'string') {
    return false;
  }

  const cleanCode = code.trim().toUpperCase();

  switch (type) {
    case 'ICD10':
      // ICD-10 format: Letter followed by 2 digits, then optional decimal point and up to 4 more characters
      return /^[A-Z]\d{2}(\.\w{1,4})?$/.test(cleanCode);
    
    case 'CPT':
      // CPT format: 5 digits, optionally followed by 2-character modifier
      return /^\d{5}(-[A-Z0-9]{2})?$/.test(cleanCode);
    
    case 'NDC':
      // NDC format: Various formats like 5-4-2, 4-4-2, 5-3-2 digits separated by hyphens
      return /^\d{4,5}-\d{3,4}-\d{2}$/.test(cleanCode);
    
    default:
      return false;
  }
}

/**
 * Validate allergy severity level
 * 
 * @param severity - Allergy severity string
 * @returns boolean indicating if severity is valid
 */
export function validateAllergySeverity(severity: string): boolean {
  if (!severity || typeof severity !== 'string') {
    return false;
  }

  const validSeverities = ['MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING'];
  return validSeverities.includes(severity.toUpperCase());
}

/**
 * Validate vital signs against age-appropriate ranges
 * 
 * @param vitals - Vital signs object
 * @param ageGroup - Age group for range validation (optional)
 * @returns ValidationResult with any issues found
 */
export function validateVitalSigns(vitals: VitalSigns, ageGroup: string = 'school'): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  if (!vitals || typeof vitals !== 'object') {
    result.isValid = false;
    result.errors.push('Vital signs object is required');
    return result;
  }

  const ranges = PEDIATRIC_VITAL_RANGES[ageGroup] || PEDIATRIC_VITAL_RANGES['school'];

  // Validate temperature
  if (vitals.temperature !== undefined) {
    if (typeof vitals.temperature !== 'number' || vitals.temperature <= 0) {
      result.errors.push('Temperature must be a positive number');
      result.isValid = false;
    } else if (vitals.temperature < ranges.temperature.min || vitals.temperature > ranges.temperature.max) {
      result.warnings?.push(`Temperature ${vitals.temperature}°C is outside normal range (${ranges.temperature.min}-${ranges.temperature.max}°C)`);
    }
  }

  // Validate blood pressure
  if (vitals.systolicBP !== undefined) {
    if (typeof vitals.systolicBP !== 'number' || vitals.systolicBP <= 0) {
      result.errors.push('Systolic blood pressure must be a positive number');
      result.isValid = false;
    } else if (vitals.systolicBP < ranges.systolicBP.min || vitals.systolicBP > ranges.systolicBP.max) {
      result.warnings?.push(`Systolic BP ${vitals.systolicBP} mmHg is outside normal range (${ranges.systolicBP.min}-${ranges.systolicBP.max} mmHg)`);
    }
  }

  if (vitals.diastolicBP !== undefined) {
    if (typeof vitals.diastolicBP !== 'number' || vitals.diastolicBP <= 0) {
      result.errors.push('Diastolic blood pressure must be a positive number');
      result.isValid = false;
    } else if (vitals.diastolicBP < ranges.diastolicBP.min || vitals.diastolicBP > ranges.diastolicBP.max) {
      result.warnings?.push(`Diastolic BP ${vitals.diastolicBP} mmHg is outside normal range (${ranges.diastolicBP.min}-${ranges.diastolicBP.max} mmHg)`);
    }
  }

  // Validate heart rate
  if (vitals.heartRate !== undefined) {
    if (typeof vitals.heartRate !== 'number' || vitals.heartRate <= 0) {
      result.errors.push('Heart rate must be a positive number');
      result.isValid = false;
    } else if (vitals.heartRate < ranges.heartRate.min || vitals.heartRate > ranges.heartRate.max) {
      result.warnings?.push(`Heart rate ${vitals.heartRate} bpm is outside normal range (${ranges.heartRate.min}-${ranges.heartRate.max} bpm)`);
    }
  }

  // Validate respiratory rate
  if (vitals.respiratoryRate !== undefined) {
    if (typeof vitals.respiratoryRate !== 'number' || vitals.respiratoryRate <= 0) {
      result.errors.push('Respiratory rate must be a positive number');
      result.isValid = false;
    } else if (vitals.respiratoryRate < ranges.respiratoryRate.min || vitals.respiratoryRate > ranges.respiratoryRate.max) {
      result.warnings?.push(`Respiratory rate ${vitals.respiratoryRate}/min is outside normal range (${ranges.respiratoryRate.min}-${ranges.respiratoryRate.max}/min)`);
    }
  }

  // Validate oxygen saturation
  if (vitals.oxygenSaturation !== undefined) {
    if (typeof vitals.oxygenSaturation !== 'number' || vitals.oxygenSaturation <= 0) {
      result.errors.push('Oxygen saturation must be a positive number');
      result.isValid = false;
    } else if (vitals.oxygenSaturation < ranges.oxygenSaturation.min || vitals.oxygenSaturation > ranges.oxygenSaturation.max) {
      result.warnings?.push(`Oxygen saturation ${vitals.oxygenSaturation}% is outside normal range (${ranges.oxygenSaturation.min}-${ranges.oxygenSaturation.max}%)`);
    }
  }

  // Validate height and weight
  if (vitals.height !== undefined) {
    if (typeof vitals.height !== 'number' || vitals.height <= 0 || vitals.height > 250) {
      result.errors.push('Height must be a reasonable positive number (in cm)');
      result.isValid = false;
    }
  }

  if (vitals.weight !== undefined) {
    if (typeof vitals.weight !== 'number' || vitals.weight <= 0 || vitals.weight > 200) {
      result.errors.push('Weight must be a reasonable positive number (in kg)');
      result.isValid = false;
    }
  }

  return result;
}

/**
 * Sanitize health data for logging (remove PHI)
 * 
 * @param data - Health data object
 * @returns Sanitized data object safe for logging
 */
export function sanitizeHealthData(data: any): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const sanitized = { ...data };

  // Remove or mask PHI fields
  const phiFields = [
    'firstName',
    'lastName',
    'dateOfBirth',
    'ssn',
    'medicaidNumber',
    'insuranceNumber',
    'parentName',
    'guardianName',
    'address',
    'phone',
    'email'
  ];

  phiFields.forEach(field => {
    if (sanitized[field]) {
      if (typeof sanitized[field] === 'string') {
        // Mask string values
        sanitized[field] = '***REDACTED***';
      } else {
        // Remove non-string PHI
        delete sanitized[field];
      }
    }
  });

  // Keep only essential medical information for debugging
  const allowedFields = [
    'id',
    'type',
    'status',
    'severity',
    'category',
    'timestamp',
    'createdAt',
    'updatedAt',
    'medicationId',
    'dosage',
    'frequency',
    'vital signs' // Keep vital signs as they're clinical data, not PHI
  ];

  // If data has many fields, only keep allowed ones
  if (Object.keys(sanitized).length > 10) {
    const filtered: any = {};
    allowedFields.forEach(field => {
      if (sanitized[field] !== undefined) {
        filtered[field] = sanitized[field];
      }
    });
    return filtered;
  }

  return sanitized;
}