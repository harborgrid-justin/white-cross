"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMedicalCode = validateMedicalCode;
exports.validateAllergySeverity = validateAllergySeverity;
exports.validateVitalSigns = validateVitalSigns;
exports.sanitizeHealthData = sanitizeHealthData;
const PEDIATRIC_VITAL_RANGES = {
    infant: {
        temperature: { min: 36.1, max: 37.2, unit: '°C' },
        systolicBP: { min: 70, max: 100, unit: 'mmHg' },
        diastolicBP: { min: 50, max: 70, unit: 'mmHg' },
        heartRate: { min: 100, max: 160, unit: 'bpm' },
        respiratoryRate: { min: 30, max: 60, unit: '/min' },
        oxygenSaturation: { min: 95, max: 100, unit: '%' },
    },
    toddler: {
        temperature: { min: 36.1, max: 37.2, unit: '°C' },
        systolicBP: { min: 80, max: 110, unit: 'mmHg' },
        diastolicBP: { min: 55, max: 75, unit: 'mmHg' },
        heartRate: { min: 90, max: 150, unit: 'bpm' },
        respiratoryRate: { min: 24, max: 40, unit: '/min' },
        oxygenSaturation: { min: 95, max: 100, unit: '%' },
    },
    preschool: {
        temperature: { min: 36.1, max: 37.2, unit: '°C' },
        systolicBP: { min: 95, max: 110, unit: 'mmHg' },
        diastolicBP: { min: 56, max: 70, unit: 'mmHg' },
        heartRate: { min: 80, max: 120, unit: 'bpm' },
        respiratoryRate: { min: 22, max: 34, unit: '/min' },
        oxygenSaturation: { min: 95, max: 100, unit: '%' },
    },
    school: {
        temperature: { min: 36.1, max: 37.2, unit: '°C' },
        systolicBP: { min: 97, max: 112, unit: 'mmHg' },
        diastolicBP: { min: 57, max: 71, unit: 'mmHg' },
        heartRate: { min: 70, max: 110, unit: 'bpm' },
        respiratoryRate: { min: 18, max: 30, unit: '/min' },
        oxygenSaturation: { min: 95, max: 100, unit: '%' },
    },
    adolescent: {
        temperature: { min: 36.1, max: 37.2, unit: '°C' },
        systolicBP: { min: 110, max: 120, unit: 'mmHg' },
        diastolicBP: { min: 64, max: 80, unit: 'mmHg' },
        heartRate: { min: 60, max: 100, unit: 'bpm' },
        respiratoryRate: { min: 12, max: 20, unit: '/min' },
        oxygenSaturation: { min: 95, max: 100, unit: '%' },
    },
};
function validateMedicalCode(code, type) {
    if (!code || typeof code !== 'string') {
        return false;
    }
    const cleanCode = code.trim().toUpperCase();
    switch (type) {
        case 'ICD10':
            return /^[A-Z]\d{2}(\.\w{1,4})?$/.test(cleanCode);
        case 'CPT':
            return /^\d{5}(-[A-Z0-9]{2})?$/.test(cleanCode);
        case 'NDC':
            return /^\d{4,5}-\d{3,4}-\d{2}$/.test(cleanCode);
        default:
            return false;
    }
}
function validateAllergySeverity(severity) {
    if (!severity || typeof severity !== 'string') {
        return false;
    }
    const validSeverities = ['MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING'];
    return validSeverities.includes(severity.toUpperCase());
}
function validateVitalSigns(vitals, ageGroup = 'school') {
    const result = {
        isValid: true,
        errors: [],
        warnings: [],
    };
    if (!vitals || typeof vitals !== 'object') {
        result.isValid = false;
        result.errors.push('Vital signs object is required');
        return result;
    }
    const ranges = PEDIATRIC_VITAL_RANGES[ageGroup] || PEDIATRIC_VITAL_RANGES['school'];
    if (!ranges) {
        result.isValid = false;
        result.errors.push('Invalid age group for vital signs validation');
        return result;
    }
    if (vitals.temperature !== undefined) {
        if (typeof vitals.temperature !== 'number' || vitals.temperature <= 0) {
            result.errors.push('Temperature must be a positive number');
            result.isValid = false;
        }
        else if (vitals.temperature < ranges.temperature.min ||
            vitals.temperature > ranges.temperature.max) {
            result.warnings?.push(`Temperature ${vitals.temperature}°C is outside normal range (${ranges.temperature.min}-${ranges.temperature.max}°C)`);
        }
    }
    if (vitals.systolicBP !== undefined) {
        if (typeof vitals.systolicBP !== 'number' || vitals.systolicBP <= 0) {
            result.errors.push('Systolic blood pressure must be a positive number');
            result.isValid = false;
        }
        else if (vitals.systolicBP < ranges.systolicBP.min ||
            vitals.systolicBP > ranges.systolicBP.max) {
            result.warnings?.push(`Systolic BP ${vitals.systolicBP} mmHg is outside normal range (${ranges.systolicBP.min}-${ranges.systolicBP.max} mmHg)`);
        }
    }
    if (vitals.diastolicBP !== undefined) {
        if (typeof vitals.diastolicBP !== 'number' || vitals.diastolicBP <= 0) {
            result.errors.push('Diastolic blood pressure must be a positive number');
            result.isValid = false;
        }
        else if (vitals.diastolicBP < ranges.diastolicBP.min ||
            vitals.diastolicBP > ranges.diastolicBP.max) {
            result.warnings?.push(`Diastolic BP ${vitals.diastolicBP} mmHg is outside normal range (${ranges.diastolicBP.min}-${ranges.diastolicBP.max} mmHg)`);
        }
    }
    if (vitals.heartRate !== undefined) {
        if (typeof vitals.heartRate !== 'number' || vitals.heartRate <= 0) {
            result.errors.push('Heart rate must be a positive number');
            result.isValid = false;
        }
        else if (vitals.heartRate < ranges.heartRate.min || vitals.heartRate > ranges.heartRate.max) {
            result.warnings?.push(`Heart rate ${vitals.heartRate} bpm is outside normal range (${ranges.heartRate.min}-${ranges.heartRate.max} bpm)`);
        }
    }
    if (vitals.respiratoryRate !== undefined) {
        if (typeof vitals.respiratoryRate !== 'number' || vitals.respiratoryRate <= 0) {
            result.errors.push('Respiratory rate must be a positive number');
            result.isValid = false;
        }
        else if (vitals.respiratoryRate < ranges.respiratoryRate.min ||
            vitals.respiratoryRate > ranges.respiratoryRate.max) {
            result.warnings?.push(`Respiratory rate ${vitals.respiratoryRate}/min is outside normal range (${ranges.respiratoryRate.min}-${ranges.respiratoryRate.max}/min)`);
        }
    }
    if (vitals.oxygenSaturation !== undefined) {
        if (typeof vitals.oxygenSaturation !== 'number' || vitals.oxygenSaturation <= 0) {
            result.errors.push('Oxygen saturation must be a positive number');
            result.isValid = false;
        }
        else if (vitals.oxygenSaturation < ranges.oxygenSaturation.min ||
            vitals.oxygenSaturation > ranges.oxygenSaturation.max) {
            result.warnings?.push(`Oxygen saturation ${vitals.oxygenSaturation}% is outside normal range (${ranges.oxygenSaturation.min}-${ranges.oxygenSaturation.max}%)`);
        }
    }
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
function sanitizeHealthData(data) {
    if (!data || typeof data !== 'object') {
        return data;
    }
    const sanitized = { ...data };
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
        'email',
    ];
    phiFields.forEach((field) => {
        if (sanitized[field]) {
            if (typeof sanitized[field] === 'string') {
                sanitized[field] = '***REDACTED***';
            }
            else {
                delete sanitized[field];
            }
        }
    });
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
        'vital signs',
    ];
    if (Object.keys(sanitized).length > 10) {
        const filtered = {};
        allowedFields.forEach((field) => {
            if (sanitized[field] !== undefined) {
                filtered[field] = sanitized[field];
            }
        });
        return filtered;
    }
    return sanitized;
}
//# sourceMappingURL=validators.js.map