"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentValidationService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const database_1 = require("../../../database");
const base_1 = require("../../../common/base");
let StudentValidationService = class StudentValidationService extends base_1.BaseService {
    studentModel;
    userModel;
    constructor(studentModel, userModel) {
        super('StudentValidationService');
        this.studentModel = studentModel;
        this.userModel = userModel;
    }
    async validateStudentNumber(studentNumber, excludeId) {
        const normalized = studentNumber.toUpperCase().trim();
        const where = { studentNumber: normalized };
        if (excludeId) {
            where.id = { [sequelize_2.Op.ne]: excludeId };
        }
        const existing = await this.studentModel.findOne({ where });
        if (existing) {
            throw new common_1.ConflictException('Student number already exists. Please use a unique student number.');
        }
    }
    async validateMedicalRecordNumber(medicalRecordNum, excludeId) {
        const normalized = medicalRecordNum.toUpperCase().trim();
        const where = { medicalRecordNum: normalized };
        if (excludeId) {
            where.id = { [sequelize_2.Op.ne]: excludeId };
        }
        const existing = await this.studentModel.findOne({ where });
        if (existing) {
            throw new common_1.ConflictException('Medical record number already exists. Each student must have a unique medical record number.');
        }
    }
    validateDateOfBirth(dateOfBirth) {
        const dob = new Date(dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        if (dob >= today) {
            throw new common_1.BadRequestException('Date of birth must be in the past.');
        }
        if (age < 3 || age > 100) {
            throw new common_1.BadRequestException('Student age must be between 3 and 100 years.');
        }
    }
    async validateNurseAssignment(nurseId) {
        this.validateUUID(nurseId);
        const nurse = await this.userModel.findOne({
            where: {
                id: nurseId,
                role: database_1.UserRole.NURSE,
                isActive: true,
            },
        });
        if (!nurse) {
            throw new common_1.NotFoundException('Assigned nurse not found. Please select a valid, active nurse.');
        }
        this.logInfo(`Nurse validation successful: ${nurse.fullName} (${nurseId})`);
    }
    validateUUID(id) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!id || !uuidRegex.test(id)) {
            throw new common_1.BadRequestException('Invalid ID format. Must be a valid UUID.');
        }
    }
    normalizeCreateData(data) {
        return {
            ...data,
            firstName: data.firstName.trim(),
            lastName: data.lastName.trim(),
            studentNumber: data.studentNumber.toUpperCase().trim(),
            medicalRecordNum: data.medicalRecordNum?.toUpperCase().trim(),
            enrollmentDate: data.enrollmentDate || new Date(),
        };
    }
    normalizeUpdateData(data) {
        const normalized = { ...data };
        if (data.firstName)
            normalized.firstName = data.firstName.trim();
        if (data.lastName)
            normalized.lastName = data.lastName.trim();
        if (data.studentNumber)
            normalized.studentNumber = data.studentNumber.toUpperCase().trim();
        if (data.medicalRecordNum)
            normalized.medicalRecordNum = data.medicalRecordNum.toUpperCase().trim();
        return normalized;
    }
    calculateAge(dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
};
exports.StudentValidationService = StudentValidationService;
exports.StudentValidationService = StudentValidationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.Student)),
    __param(1, (0, sequelize_1.InjectModel)(database_1.User)),
    __metadata("design:paramtypes", [Object, Object])
], StudentValidationService);
//# sourceMappingURL=student-validation.service.js.map