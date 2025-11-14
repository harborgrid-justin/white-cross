"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthcareException = void 0;
const common_1 = require("@nestjs/common");
const error_codes_1 = require("../constants/error-codes");
class HealthcareException extends common_1.HttpException {
    errorCode;
    domain;
    safetyLevel;
    context;
    constructor(message, errorCode = error_codes_1.HealthcareErrorCodes.OPERATION_NOT_ALLOWED, domain = 'clinical', safetyLevel = 'warning', context) {
        const response = {
            success: false,
            error: 'Healthcare Error',
            message,
            errorCode,
            domain,
            safetyLevel,
            context,
        };
        const status = safetyLevel === 'critical'
            ? common_1.HttpStatus.BAD_REQUEST
            : common_1.HttpStatus.UNPROCESSABLE_ENTITY;
        super(response, status);
        this.errorCode = errorCode;
        this.domain = domain;
        this.safetyLevel = safetyLevel;
        this.context = context;
        this.name = 'HealthcareException';
    }
    static drugInteraction(medications, severity, details) {
        const safetyLevel = severity === 'critical' ? 'critical' : 'warning';
        return new HealthcareException(`Drug interaction detected: ${details || 'Please review medication list'}`, error_codes_1.HealthcareErrorCodes.DRUG_INTERACTION_DETECTED, 'medication', safetyLevel, { medications, severity, details });
    }
    static allergyConflict(medication, allergen, reactionType) {
        return new HealthcareException(`Medication ${medication} conflicts with known allergy to ${allergen}`, error_codes_1.HealthcareErrorCodes.ALLERGY_CONFLICT, 'allergy', 'critical', { medication, allergen, reactionType });
    }
    static consentRequired(action, studentId) {
        return new HealthcareException(`Parental consent required for: ${action}`, error_codes_1.HealthcareErrorCodes.CONSENT_REQUIRED, 'consent', 'warning', { action, studentId });
    }
    static consentExpired(consentType, expiryDate) {
        return new HealthcareException(`${consentType} consent expired on ${expiryDate.toISOString().split('T')[0]}`, error_codes_1.HealthcareErrorCodes.CONSENT_EXPIRED, 'consent', 'warning', { consentType, expiryDate });
    }
    static dosageOutOfRange(medication, dosage, minDosage, maxDosage) {
        return new HealthcareException(`Dosage ${dosage} for ${medication} is outside recommended range (${minDosage}-${maxDosage})`, error_codes_1.HealthcareErrorCodes.DOSAGE_OUT_OF_RANGE, 'medication', 'critical', { medication, dosage, minDosage, maxDosage });
    }
    static contraindication(medication, condition, reason) {
        return new HealthcareException(`${medication} is contraindicated for ${condition}: ${reason}`, error_codes_1.HealthcareErrorCodes.CONTRAINDICATION_DETECTED, 'medication', 'critical', { medication, condition, reason });
    }
    static ageRestriction(medication, age, minAge) {
        return new HealthcareException(`${medication} is not approved for ages under ${minAge}. Patient age: ${age}`, error_codes_1.HealthcareErrorCodes.AGE_RESTRICTION_VIOLATED, 'medication', 'critical', { medication, age, minAge });
    }
    static vaccinationOverdue(vaccination, dueDate, daysPastDue) {
        return new HealthcareException(`${vaccination} vaccination is ${daysPastDue} days overdue`, error_codes_1.HealthcareErrorCodes.VACCINATION_OVERDUE, 'vaccination', 'warning', { vaccination, dueDate, daysPastDue });
    }
    static vaccinationTooSoon(vaccination, nextDueDate) {
        return new HealthcareException(`${vaccination} cannot be administered until ${nextDueDate.toISOString().split('T')[0]}`, error_codes_1.HealthcareErrorCodes.VACCINATION_TOO_SOON, 'vaccination', 'warning', { vaccination, nextDueDate });
    }
    static appointmentConflict(proposedTime, conflictingAppointmentId) {
        return new HealthcareException(`Appointment time conflicts with existing appointment`, error_codes_1.HealthcareErrorCodes.APPOINTMENT_CONFLICT, 'appointment', 'info', { proposedTime, conflictingAppointmentId });
    }
    static vitalSignsOutOfRange(vitalSign, value, minNormal, maxNormal) {
        return new HealthcareException(`${vitalSign} (${value}) is outside normal range (${minNormal}-${maxNormal})`, error_codes_1.HealthcareErrorCodes.VITAL_SIGNS_OUT_OF_RANGE, 'clinical', 'warning', { vitalSign, value, minNormal, maxNormal });
    }
}
exports.HealthcareException = HealthcareException;
//# sourceMappingURL=healthcare.exception.js.map