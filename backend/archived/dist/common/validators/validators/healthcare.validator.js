"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPhone = isValidPhone;
exports.normalizePhone = normalizePhone;
exports.isValidSSN = isValidSSN;
exports.maskSSN = maskSSN;
exports.isValidMRN = isValidMRN;
exports.isValidNPI = isValidNPI;
exports.isValidICD10 = isValidICD10;
exports.isValidDosage = isValidDosage;
exports.parseDosage = parseDosage;
exports.isValidHIPAADate = isValidHIPAADate;
exports.isValidStudentAge = isValidStudentAge;
exports.calculateAge = calculateAge;
exports.isValidBloodType = isValidBloodType;
exports.isValidTemperature = isValidTemperature;
exports.isValidHeartRate = isValidHeartRate;
exports.isValidBloodPressure = isValidBloodPressure;
exports.isValidWeight = isValidWeight;
exports.isValidHeight = isValidHeight;
const validation_types_1 = require("../../../middleware/core/types/validation.types");
function isValidPhone(phone) {
    return validation_types_1.HEALTHCARE_PATTERNS.PHONE.test(phone);
}
function normalizePhone(phone) {
    const cleaned = phone.replace(/[^\d+]/g, '');
    const match = cleaned.match(/^(\+?1)?(\d{3})(\d{3})(\d{4})$/);
    if (!match)
        return phone;
    const [, countryCode, area, prefix, line] = match;
    return `(${area}) ${prefix}-${line}`;
}
function isValidSSN(ssn) {
    return validation_types_1.HEALTHCARE_PATTERNS.SSN.test(ssn);
}
function maskSSN(ssn) {
    const cleaned = ssn.replace(/-/g, '');
    if (cleaned.length !== 9)
        return '***-**-****';
    return `***-**-${cleaned.substring(5)}`;
}
function isValidMRN(mrn) {
    return validation_types_1.HEALTHCARE_PATTERNS.MRN.test(mrn);
}
function isValidNPI(npi) {
    if (!/^\d{10}$/.test(npi))
        return false;
    const fullNumber = '80840' + npi.substring(0, 9);
    let sum = 0;
    let shouldDouble = true;
    for (let i = fullNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(fullNumber[i], 10);
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9)
                digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === parseInt(npi[9], 10);
}
function isValidICD10(code) {
    return validation_types_1.HEALTHCARE_PATTERNS.ICD10.test(code);
}
function isValidDosage(dosage) {
    return validation_types_1.HEALTHCARE_PATTERNS.DOSAGE.test(dosage);
}
function parseDosage(dosage) {
    const match = dosage.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z%]+)$/);
    if (!match)
        return null;
    return {
        amount: parseFloat(match[1]),
        unit: match[2],
    };
}
function isValidHIPAADate(date) {
    if (!validation_types_1.HEALTHCARE_PATTERNS.DATE.test(date))
        return false;
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return (dateObj.getFullYear() === year &&
        dateObj.getMonth() === month - 1 &&
        dateObj.getDate() === day);
}
function isValidStudentAge(age) {
    return age >= 3 && age <= 22;
}
function calculateAge(dateOfBirth) {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    if (monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
        age--;
    }
    return age;
}
function isValidBloodType(bloodType) {
    const validTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    return validTypes.includes(bloodType.toUpperCase());
}
function isValidTemperature(temp, unit = 'F') {
    if (unit === 'F') {
        return temp >= 95.0 && temp <= 108.0;
    }
    else {
        return temp >= 35.0 && temp <= 42.0;
    }
}
function isValidHeartRate(bpm, age) {
    if (age !== undefined) {
        if (age < 1)
            return bpm >= 80 && bpm <= 180;
        if (age < 12)
            return bpm >= 70 && bpm <= 130;
        if (age < 18)
            return bpm >= 60 && bpm <= 120;
    }
    return bpm >= 40 && bpm <= 200;
}
function isValidBloodPressure(systolic, diastolic) {
    if (systolic < 60 || systolic > 250) {
        return { valid: false, warning: 'Systolic out of measurable range' };
    }
    if (diastolic < 40 || diastolic > 150) {
        return { valid: false, warning: 'Diastolic out of measurable range' };
    }
    if (systolic <= diastolic) {
        return { valid: false, warning: 'Systolic must be greater than diastolic' };
    }
    if (systolic >= 180 || diastolic >= 120) {
        return {
            valid: true,
            warning: 'Hypertensive crisis - immediate attention required',
        };
    }
    return { valid: true };
}
function isValidWeight(pounds, age) {
    if (pounds <= 0 || pounds > 500)
        return false;
    if (age !== undefined) {
        if (age < 1 && pounds > 30)
            return false;
        if (age < 12 && pounds > 200)
            return false;
    }
    return true;
}
function isValidHeight(inches, age) {
    if (inches <= 0 || inches > 96)
        return false;
    if (age !== undefined) {
        if (age < 1 && inches > 36)
            return false;
        if (age < 12 && inches > 72)
            return false;
    }
    return true;
}
//# sourceMappingURL=healthcare.validator.js.map