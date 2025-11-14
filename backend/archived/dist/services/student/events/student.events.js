"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentDeactivatedEvent = exports.StudentImmunizationUpdatedEvent = exports.StudentEmergencyContactUpdatedEvent = exports.StudentHealthRecordUpdatedEvent = exports.StudentGraduatedEvent = exports.StudentTransferredEvent = exports.StudentUpdatedEvent = exports.StudentCreatedEvent = void 0;
class StudentCreatedEvent {
    student;
    context;
    eventName = 'student.created';
    occurredAt;
    constructor(student, context) {
        this.student = student;
        this.context = context;
        this.occurredAt = new Date();
    }
    toAuditLog() {
        return {
            eventName: this.eventName,
            eventTime: this.occurredAt.toISOString(),
            studentId: this.student.id,
            gradeLevel: this.student.gradeLevel,
            schoolId: this.student.schoolId,
            userId: this.context.userId,
            userRole: this.context.userRole,
            requestId: this.context.requestId,
        };
    }
}
exports.StudentCreatedEvent = StudentCreatedEvent;
class StudentUpdatedEvent {
    student;
    previousData;
    context;
    eventName = 'student.updated';
    occurredAt;
    constructor(student, previousData, context) {
        this.student = student;
        this.previousData = previousData;
        this.context = context;
        this.occurredAt = new Date();
    }
    toAuditLog() {
        return {
            eventName: this.eventName,
            eventTime: this.occurredAt.toISOString(),
            studentId: this.student.id,
            changes: this.previousData,
            userId: this.context.userId,
            userRole: this.context.userRole,
            requestId: this.context.requestId,
        };
    }
}
exports.StudentUpdatedEvent = StudentUpdatedEvent;
class StudentTransferredEvent {
    studentId;
    fromSchoolId;
    toSchoolId;
    fromGrade;
    toGrade;
    transferDate;
    context;
    eventName = 'student.transferred';
    occurredAt;
    constructor(studentId, fromSchoolId, toSchoolId, fromGrade, toGrade, transferDate, context) {
        this.studentId = studentId;
        this.fromSchoolId = fromSchoolId;
        this.toSchoolId = toSchoolId;
        this.fromGrade = fromGrade;
        this.toGrade = toGrade;
        this.transferDate = transferDate;
        this.context = context;
        this.occurredAt = new Date();
    }
    toAuditLog() {
        return {
            eventName: this.eventName,
            eventTime: this.occurredAt.toISOString(),
            studentId: this.studentId,
            fromSchoolId: this.fromSchoolId,
            toSchoolId: this.toSchoolId,
            fromGrade: this.fromGrade,
            toGrade: this.toGrade,
            transferDate: this.transferDate?.toISOString(),
            userId: this.context?.userId,
            userRole: this.context?.userRole,
        };
    }
}
exports.StudentTransferredEvent = StudentTransferredEvent;
class StudentGraduatedEvent {
    studentId;
    graduationDate;
    finalGrade;
    context;
    eventName = 'student.graduated';
    occurredAt;
    constructor(studentId, graduationDate, finalGrade, context) {
        this.studentId = studentId;
        this.graduationDate = graduationDate;
        this.finalGrade = finalGrade;
        this.context = context;
        this.occurredAt = new Date();
    }
    toAuditLog() {
        return {
            eventName: this.eventName,
            eventTime: this.occurredAt.toISOString(),
            studentId: this.studentId,
            graduationDate: this.graduationDate.toISOString(),
            finalGrade: this.finalGrade,
            userId: this.context?.userId,
            userRole: this.context?.userRole,
        };
    }
}
exports.StudentGraduatedEvent = StudentGraduatedEvent;
class StudentHealthRecordUpdatedEvent {
    studentId;
    healthRecordId;
    updateType;
    requiresAlert;
    context;
    eventName = 'student.health-record-updated';
    occurredAt;
    constructor(studentId, healthRecordId, updateType, requiresAlert, context) {
        this.studentId = studentId;
        this.healthRecordId = healthRecordId;
        this.updateType = updateType;
        this.requiresAlert = requiresAlert;
        this.context = context;
        this.occurredAt = new Date();
    }
    toAuditLog() {
        return {
            eventName: this.eventName,
            eventTime: this.occurredAt.toISOString(),
            studentId: this.studentId,
            healthRecordId: this.healthRecordId,
            updateType: this.updateType,
            requiresAlert: this.requiresAlert,
            userId: this.context?.userId,
            userRole: this.context?.userRole,
        };
    }
}
exports.StudentHealthRecordUpdatedEvent = StudentHealthRecordUpdatedEvent;
class StudentEmergencyContactUpdatedEvent {
    studentId;
    contactId;
    changeType;
    context;
    eventName = 'student.emergency-contact-updated';
    occurredAt;
    constructor(studentId, contactId, changeType, context) {
        this.studentId = studentId;
        this.contactId = contactId;
        this.changeType = changeType;
        this.context = context;
        this.occurredAt = new Date();
    }
    toAuditLog() {
        return {
            eventName: this.eventName,
            eventTime: this.occurredAt.toISOString(),
            studentId: this.studentId,
            contactId: this.contactId,
            changeType: this.changeType,
            userId: this.context?.userId,
            userRole: this.context?.userRole,
        };
    }
}
exports.StudentEmergencyContactUpdatedEvent = StudentEmergencyContactUpdatedEvent;
class StudentImmunizationUpdatedEvent {
    studentId;
    immunizationType;
    isCompliant;
    dueDate;
    context;
    eventName = 'student.immunization-updated';
    occurredAt;
    constructor(studentId, immunizationType, isCompliant, dueDate, context) {
        this.studentId = studentId;
        this.immunizationType = immunizationType;
        this.isCompliant = isCompliant;
        this.dueDate = dueDate;
        this.context = context;
        this.occurredAt = new Date();
    }
    toAuditLog() {
        return {
            eventName: this.eventName,
            eventTime: this.occurredAt.toISOString(),
            studentId: this.studentId,
            immunizationType: this.immunizationType,
            isCompliant: this.isCompliant,
            dueDate: this.dueDate?.toISOString(),
            userId: this.context?.userId,
            userRole: this.context?.userRole,
        };
    }
}
exports.StudentImmunizationUpdatedEvent = StudentImmunizationUpdatedEvent;
class StudentDeactivatedEvent {
    studentId;
    reason;
    context;
    eventName = 'student.deactivated';
    occurredAt;
    constructor(studentId, reason, context) {
        this.studentId = studentId;
        this.reason = reason;
        this.context = context;
        this.occurredAt = new Date();
    }
    toAuditLog() {
        return {
            eventName: this.eventName,
            eventTime: this.occurredAt.toISOString(),
            studentId: this.studentId,
            reason: this.reason,
            userId: this.context?.userId,
            userRole: this.context?.userRole,
        };
    }
}
exports.StudentDeactivatedEvent = StudentDeactivatedEvent;
//# sourceMappingURL=student.events.js.map