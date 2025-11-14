"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentDataProcessingException = exports.InvalidUUIDException = exports.InvalidNurseAssignmentException = exports.InvalidDateOfBirthException = exports.MedicalRecordNumberConflictException = exports.StudentNumberConflictException = exports.StudentNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class StudentNotFoundException extends common_1.NotFoundException {
    code = 'STUDENT_NOT_FOUND';
    context;
    constructor(studentId, context) {
        super(`Student with ID ${studentId} not found`);
        this.name = 'StudentNotFoundException';
        this.context = context;
    }
}
exports.StudentNotFoundException = StudentNotFoundException;
class StudentNumberConflictException extends common_1.ConflictException {
    code = 'STUDENT_NUMBER_CONFLICT';
    context;
    constructor(studentNumber, context) {
        super(`Student number ${studentNumber} already exists. Please use a unique student number.`);
        this.name = 'StudentNumberConflictException';
        this.context = context;
    }
}
exports.StudentNumberConflictException = StudentNumberConflictException;
class MedicalRecordNumberConflictException extends common_1.ConflictException {
    code = 'MEDICAL_RECORD_NUMBER_CONFLICT';
    context;
    constructor(medicalRecordNumber, context) {
        super('Medical record number already exists. Each student must have a unique medical record number.');
        this.name = 'MedicalRecordNumberConflictException';
        this.context = context;
    }
}
exports.MedicalRecordNumberConflictException = MedicalRecordNumberConflictException;
class InvalidDateOfBirthException extends common_1.BadRequestException {
    code = 'INVALID_DATE_OF_BIRTH';
    context;
    constructor(reason, context) {
        super(reason);
        this.name = 'InvalidDateOfBirthException';
        this.context = context;
    }
}
exports.InvalidDateOfBirthException = InvalidDateOfBirthException;
class InvalidNurseAssignmentException extends common_1.NotFoundException {
    code = 'INVALID_NURSE_ASSIGNMENT';
    context;
    constructor(nurseId, context) {
        super('Assigned nurse not found. Please select a valid, active nurse.');
        this.name = 'InvalidNurseAssignmentException';
        this.context = context;
    }
}
exports.InvalidNurseAssignmentException = InvalidNurseAssignmentException;
class InvalidUUIDException extends common_1.BadRequestException {
    code = 'INVALID_UUID';
    context;
    constructor(fieldName, value, context) {
        super(`Invalid ${fieldName} format. Must be a valid UUID.`);
        this.name = 'InvalidUUIDException';
        this.context = context;
    }
}
exports.InvalidUUIDException = InvalidUUIDException;
class StudentDataProcessingException extends common_1.InternalServerErrorException {
    code = 'STUDENT_DATA_PROCESSING_ERROR';
    context;
    originalError;
    constructor(operation, originalError, context) {
        super(`Failed to ${operation}. Please try again later.`);
        this.name = 'StudentDataProcessingException';
        this.originalError = originalError;
        this.context = context;
    }
}
exports.StudentDataProcessingException = StudentDataProcessingException;
//# sourceMappingURL=student.exceptions.js.map