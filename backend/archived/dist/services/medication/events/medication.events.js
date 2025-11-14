"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicationMissedDoseEvent = exports.MedicationAllergyConflictEvent = exports.MedicationDosageChangedEvent = exports.MedicationDiscontinuedEvent = exports.MedicationExpiringSoonEvent = exports.MedicationInteractionDetectedEvent = exports.MedicationRefusedEvent = exports.MedicationAdministeredEvent = exports.MedicationPrescribedEvent = void 0;
class MedicationPrescribedEvent {
    medication;
    prescribedBy;
    indication;
    context;
    eventName = 'medication.prescribed';
    occurredAt;
    constructor(medication, prescribedBy, indication, context) {
        this.medication = medication;
        this.prescribedBy = prescribedBy;
        this.indication = indication;
        this.context = context;
        this.occurredAt = new Date();
    }
    toAuditLog() {
        return {
            eventName: this.eventName,
            eventTime: this.occurredAt.toISOString(),
            medicationId: this.medication.id,
            studentId: this.medication.studentId,
            medicationName: this.medication.name,
            dosage: this.medication.dosage,
            prescribedBy: this.prescribedBy,
            indication: this.indication,
            userId: this.context.userId,
            userRole: this.context.userRole,
            requestId: this.context.requestId,
        };
    }
}
exports.MedicationPrescribedEvent = MedicationPrescribedEvent;
class MedicationAdministeredEvent {
    medicationId;
    studentId;
    administeredBy;
    dosageGiven;
    administrationTime;
    route;
    notes;
    witnessedBy;
    context;
    eventName = 'medication.administered';
    occurredAt;
    constructor(medicationId, studentId, administeredBy, dosageGiven, administrationTime, route, notes, witnessedBy, context) {
        this.medicationId = medicationId;
        this.studentId = studentId;
        this.administeredBy = administeredBy;
        this.dosageGiven = dosageGiven;
        this.administrationTime = administrationTime;
        this.route = route;
        this.notes = notes;
        this.witnessedBy = witnessedBy;
        this.context = context;
        this.occurredAt = new Date();
    }
    toAuditLog() {
        return {
            eventName: this.eventName,
            eventTime: this.occurredAt.toISOString(),
            medicationId: this.medicationId,
            studentId: this.studentId,
            administeredBy: this.administeredBy,
            dosageGiven: this.dosageGiven,
            administrationTime: this.administrationTime.toISOString(),
            route: this.route,
            witnessedBy: this.witnessedBy,
            userId: this.context?.userId,
            userRole: this.context?.userRole,
        };
    }
}
exports.MedicationAdministeredEvent = MedicationAdministeredEvent;
class MedicationRefusedEvent {
    medicationId;
    studentId;
    scheduledTime;
    refusalReason;
    attemptedBy;
    isCriticalMedication;
    context;
    eventName = 'medication.refused';
    occurredAt;
    constructor(medicationId, studentId, scheduledTime, refusalReason, attemptedBy, isCriticalMedication, context) {
        this.medicationId = medicationId;
        this.studentId = studentId;
        this.scheduledTime = scheduledTime;
        this.refusalReason = refusalReason;
        this.attemptedBy = attemptedBy;
        this.isCriticalMedication = isCriticalMedication;
        this.context = context;
        this.occurredAt = new Date();
    }
    toAuditLog() {
        return {
            eventName: this.eventName,
            eventTime: this.occurredAt.toISOString(),
            medicationId: this.medicationId,
            studentId: this.studentId,
            scheduledTime: this.scheduledTime.toISOString(),
            refusalReason: this.refusalReason,
            attemptedBy: this.attemptedBy,
            isCriticalMedication: this.isCriticalMedication,
            userId: this.context?.userId,
            userRole: this.context?.userRole,
        };
    }
}
exports.MedicationRefusedEvent = MedicationRefusedEvent;
class MedicationInteractionDetectedEvent {
    studentId;
    medication1Id;
    medication2Id;
    medication1Name;
    medication2Name;
    interactionSeverity;
    interactionDescription;
    recommendedAction;
    context;
    eventName = 'medication.interaction-detected';
    occurredAt;
    constructor(studentId, medication1Id, medication2Id, medication1Name, medication2Name, interactionSeverity, interactionDescription, recommendedAction, context) {
        this.studentId = studentId;
        this.medication1Id = medication1Id;
        this.medication2Id = medication2Id;
        this.medication1Name = medication1Name;
        this.medication2Name = medication2Name;
        this.interactionSeverity = interactionSeverity;
        this.interactionDescription = interactionDescription;
        this.recommendedAction = recommendedAction;
        this.context = context;
        this.occurredAt = new Date();
    }
    isCritical() {
        return this.interactionSeverity === 'MAJOR' || this.interactionSeverity === 'SEVERE';
    }
    toAuditLog() {
        return {
            eventName: this.eventName,
            eventTime: this.occurredAt.toISOString(),
            studentId: this.studentId,
            medication1Id: this.medication1Id,
            medication2Id: this.medication2Id,
            medication1Name: this.medication1Name,
            medication2Name: this.medication2Name,
            interactionSeverity: this.interactionSeverity,
            interactionDescription: this.interactionDescription,
            recommendedAction: this.recommendedAction,
            userId: this.context?.userId,
            userRole: this.context?.userRole,
        };
    }
}
exports.MedicationInteractionDetectedEvent = MedicationInteractionDetectedEvent;
class MedicationExpiringSoonEvent {
    medicationId;
    studentId;
    medicationName;
    expirationDate;
    daysUntilExpiration;
    requiresRenewal;
    eventName = 'medication.expiring-soon';
    occurredAt;
    constructor(medicationId, studentId, medicationName, expirationDate, daysUntilExpiration, requiresRenewal) {
        this.medicationId = medicationId;
        this.studentId = studentId;
        this.medicationName = medicationName;
        this.expirationDate = expirationDate;
        this.daysUntilExpiration = daysUntilExpiration;
        this.requiresRenewal = requiresRenewal;
        this.occurredAt = new Date();
    }
    toAuditLog() {
        return {
            eventName: this.eventName,
            eventTime: this.occurredAt.toISOString(),
            medicationId: this.medicationId,
            studentId: this.studentId,
            medicationName: this.medicationName,
            expirationDate: this.expirationDate.toISOString(),
            daysUntilExpiration: this.daysUntilExpiration,
            requiresRenewal: this.requiresRenewal,
        };
    }
}
exports.MedicationExpiringSoonEvent = MedicationExpiringSoonEvent;
class MedicationDiscontinuedEvent {
    medicationId;
    studentId;
    discontinuedBy;
    reason;
    discontinuationDate;
    context;
    eventName = 'medication.discontinued';
    occurredAt;
    constructor(medicationId, studentId, discontinuedBy, reason, discontinuationDate, context) {
        this.medicationId = medicationId;
        this.studentId = studentId;
        this.discontinuedBy = discontinuedBy;
        this.reason = reason;
        this.discontinuationDate = discontinuationDate;
        this.context = context;
        this.occurredAt = new Date();
    }
    toAuditLog() {
        return {
            eventName: this.eventName,
            eventTime: this.occurredAt.toISOString(),
            medicationId: this.medicationId,
            studentId: this.studentId,
            discontinuedBy: this.discontinuedBy,
            reason: this.reason,
            discontinuationDate: this.discontinuationDate.toISOString(),
            userId: this.context?.userId,
            userRole: this.context?.userRole,
        };
    }
}
exports.MedicationDiscontinuedEvent = MedicationDiscontinuedEvent;
class MedicationDosageChangedEvent {
    medicationId;
    studentId;
    oldDosage;
    newDosage;
    changedBy;
    reason;
    effectiveDate;
    context;
    eventName = 'medication.dosage-changed';
    occurredAt;
    constructor(medicationId, studentId, oldDosage, newDosage, changedBy, reason, effectiveDate, context) {
        this.medicationId = medicationId;
        this.studentId = studentId;
        this.oldDosage = oldDosage;
        this.newDosage = newDosage;
        this.changedBy = changedBy;
        this.reason = reason;
        this.effectiveDate = effectiveDate;
        this.context = context;
        this.occurredAt = new Date();
    }
    toAuditLog() {
        return {
            eventName: this.eventName,
            eventTime: this.occurredAt.toISOString(),
            medicationId: this.medicationId,
            studentId: this.studentId,
            oldDosage: this.oldDosage,
            newDosage: this.newDosage,
            changedBy: this.changedBy,
            reason: this.reason,
            effectiveDate: this.effectiveDate.toISOString(),
            userId: this.context?.userId,
            userRole: this.context?.userRole,
        };
    }
}
exports.MedicationDosageChangedEvent = MedicationDosageChangedEvent;
class MedicationAllergyConflictEvent {
    studentId;
    medicationId;
    medicationName;
    allergyId;
    allergenName;
    allergySeverity;
    blockedAdministration;
    context;
    eventName = 'medication.allergy-conflict';
    occurredAt;
    constructor(studentId, medicationId, medicationName, allergyId, allergenName, allergySeverity, blockedAdministration, context) {
        this.studentId = studentId;
        this.medicationId = medicationId;
        this.medicationName = medicationName;
        this.allergyId = allergyId;
        this.allergenName = allergenName;
        this.allergySeverity = allergySeverity;
        this.blockedAdministration = blockedAdministration;
        this.context = context;
        this.occurredAt = new Date();
    }
    toAuditLog() {
        return {
            eventName: this.eventName,
            eventTime: this.occurredAt.toISOString(),
            studentId: this.studentId,
            medicationId: this.medicationId,
            medicationName: this.medicationName,
            allergyId: this.allergyId,
            allergenName: this.allergenName,
            allergySeverity: this.allergySeverity,
            blockedAdministration: this.blockedAdministration,
            userId: this.context?.userId,
            userRole: this.context?.userRole,
        };
    }
}
exports.MedicationAllergyConflictEvent = MedicationAllergyConflictEvent;
class MedicationMissedDoseEvent {
    medicationId;
    studentId;
    scheduledTime;
    isCritical;
    reason;
    context;
    eventName = 'medication.missed-dose';
    occurredAt;
    constructor(medicationId, studentId, scheduledTime, isCritical, reason, context) {
        this.medicationId = medicationId;
        this.studentId = studentId;
        this.scheduledTime = scheduledTime;
        this.isCritical = isCritical;
        this.reason = reason;
        this.context = context;
        this.occurredAt = new Date();
    }
    toAuditLog() {
        return {
            eventName: this.eventName,
            eventTime: this.occurredAt.toISOString(),
            medicationId: this.medicationId,
            studentId: this.studentId,
            scheduledTime: this.scheduledTime.toISOString(),
            isCritical: this.isCritical,
            reason: this.reason,
            userId: this.context?.userId,
            userRole: this.context?.userRole,
        };
    }
}
exports.MedicationMissedDoseEvent = MedicationMissedDoseEvent;
//# sourceMappingURL=medication.events.js.map