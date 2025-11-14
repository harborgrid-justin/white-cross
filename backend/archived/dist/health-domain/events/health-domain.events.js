"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbnormalVitalsDetectedEvent = exports.VitalSignsRecordedEvent = exports.ChronicConditionUpdatedEvent = exports.ChronicConditionCreatedEvent = exports.ImmunizationUpdatedEvent = exports.ImmunizationCreatedEvent = exports.AllergyUpdatedEvent = exports.AllergyCreatedEvent = exports.HealthRecordDeletedEvent = exports.HealthRecordUpdatedEvent = exports.HealthRecordCreatedEvent = exports.HealthDomainEvent = void 0;
class HealthDomainEvent {
    timestamp;
    userId;
    constructor(timestamp = new Date(), userId) {
        this.timestamp = timestamp;
        this.userId = userId;
    }
}
exports.HealthDomainEvent = HealthDomainEvent;
class HealthRecordCreatedEvent extends HealthDomainEvent {
    healthRecordId;
    studentId;
    data;
    constructor(healthRecordId, studentId, data, userId) {
        super(new Date(), userId);
        this.healthRecordId = healthRecordId;
        this.studentId = studentId;
        this.data = data;
    }
}
exports.HealthRecordCreatedEvent = HealthRecordCreatedEvent;
class HealthRecordUpdatedEvent extends HealthDomainEvent {
    healthRecordId;
    studentId;
    data;
    constructor(healthRecordId, studentId, data, userId) {
        super(new Date(), userId);
        this.healthRecordId = healthRecordId;
        this.studentId = studentId;
        this.data = data;
    }
}
exports.HealthRecordUpdatedEvent = HealthRecordUpdatedEvent;
class HealthRecordDeletedEvent extends HealthDomainEvent {
    healthRecordId;
    studentId;
    constructor(healthRecordId, studentId, userId) {
        super(new Date(), userId);
        this.healthRecordId = healthRecordId;
        this.studentId = studentId;
    }
}
exports.HealthRecordDeletedEvent = HealthRecordDeletedEvent;
class AllergyCreatedEvent extends HealthDomainEvent {
    allergyId;
    studentId;
    data;
    constructor(allergyId, studentId, data, userId) {
        super(new Date(), userId);
        this.allergyId = allergyId;
        this.studentId = studentId;
        this.data = data;
    }
}
exports.AllergyCreatedEvent = AllergyCreatedEvent;
class AllergyUpdatedEvent extends HealthDomainEvent {
    allergyId;
    studentId;
    data;
    constructor(allergyId, studentId, data, userId) {
        super(new Date(), userId);
        this.allergyId = allergyId;
        this.studentId = studentId;
        this.data = data;
    }
}
exports.AllergyUpdatedEvent = AllergyUpdatedEvent;
class ImmunizationCreatedEvent extends HealthDomainEvent {
    immunizationId;
    studentId;
    data;
    constructor(immunizationId, studentId, data, userId) {
        super(new Date(), userId);
        this.immunizationId = immunizationId;
        this.studentId = studentId;
        this.data = data;
    }
}
exports.ImmunizationCreatedEvent = ImmunizationCreatedEvent;
class ImmunizationUpdatedEvent extends HealthDomainEvent {
    immunizationId;
    studentId;
    data;
    constructor(immunizationId, studentId, data, userId) {
        super(new Date(), userId);
        this.immunizationId = immunizationId;
        this.studentId = studentId;
        this.data = data;
    }
}
exports.ImmunizationUpdatedEvent = ImmunizationUpdatedEvent;
class ChronicConditionCreatedEvent extends HealthDomainEvent {
    conditionId;
    studentId;
    data;
    constructor(conditionId, studentId, data, userId) {
        super(new Date(), userId);
        this.conditionId = conditionId;
        this.studentId = studentId;
        this.data = data;
    }
}
exports.ChronicConditionCreatedEvent = ChronicConditionCreatedEvent;
class ChronicConditionUpdatedEvent extends HealthDomainEvent {
    conditionId;
    studentId;
    data;
    constructor(conditionId, studentId, data, userId) {
        super(new Date(), userId);
        this.conditionId = conditionId;
        this.studentId = studentId;
        this.data = data;
    }
}
exports.ChronicConditionUpdatedEvent = ChronicConditionUpdatedEvent;
class VitalSignsRecordedEvent extends HealthDomainEvent {
    vitalSignsId;
    studentId;
    vitals;
    constructor(vitalSignsId, studentId, vitals, userId) {
        super(new Date(), userId);
        this.vitalSignsId = vitalSignsId;
        this.studentId = studentId;
        this.vitals = vitals;
    }
}
exports.VitalSignsRecordedEvent = VitalSignsRecordedEvent;
class AbnormalVitalsDetectedEvent extends HealthDomainEvent {
    studentId;
    vitals;
    anomalies;
    constructor(studentId, vitals, anomalies, userId) {
        super(new Date(), userId);
        this.studentId = studentId;
        this.vitals = vitals;
        this.anomalies = anomalies;
    }
}
exports.AbnormalVitalsDetectedEvent = AbnormalVitalsDetectedEvent;
//# sourceMappingURL=health-domain.events.js.map