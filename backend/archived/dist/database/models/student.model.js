"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = exports.Gender = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
    Gender["OTHER"] = "OTHER";
    Gender["PREFER_NOT_TO_SAY"] = "PREFER_NOT_TO_SAY";
})(Gender || (exports.Gender = Gender = {}));
let Student = class Student extends sequelize_typescript_1.Model {
    studentNumber;
    firstName;
    lastName;
    dateOfBirth;
    grade;
    gender;
    photo;
    medicalRecordNum;
    isActive;
    enrollmentDate;
    nurseId;
    schoolId;
    districtId;
    createdBy;
    updatedBy;
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    get age() {
        return this.getAge();
    }
    static async validateEnrollmentDate(instance) {
        if (instance.enrollmentDate && instance.enrollmentDate > new Date()) {
            throw new Error('Enrollment date cannot be in the future');
        }
    }
    static async auditPHIAccess(instance) {
        if (instance.changed()) {
            const changedFields = instance.changed();
            const phiFields = [
                'firstName',
                'lastName',
                'dateOfBirth',
                'medicalRecordNum',
                'photo',
            ];
            const { logModelPHIFieldChanges } = await Promise.resolve().then(() => __importStar(require('../services/model-audit-helper.service.js')));
            const transaction = instance.sequelize?.transaction || undefined;
            await logModelPHIFieldChanges('Student', instance.id, changedFields, phiFields, transaction);
        }
    }
    getFullName() {
        return `${this.lastName}, ${this.firstName}`;
    }
    getAge() {
        const today = new Date();
        const birthDate = new Date(this.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    isCurrentlyEnrolled() {
        return this.isActive;
    }
};
exports.Student = Student;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Student.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
        unique: true,
    }),
    __metadata("design:type", String)
], Student.prototype, "studentNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Student.prototype, "firstName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Student.prototype, "lastName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true,
            isBefore: new Date().toISOString(),
            isValidAge(value) {
                const dob = new Date(value);
                const age = (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
                if (age < 3 || age > 22) {
                    throw new Error('Student age must be between 3 and 22 years');
                }
            },
        },
    }),
    __metadata("design:type", Date)
], Student.prototype, "dateOfBirth", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(10),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Student.prototype, "grade", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        allowNull: false,
        validate: {
            isIn: [Object.values(Gender)],
        },
    }),
    __metadata("design:type", String)
], Student.prototype, "gender", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(500),
    }),
    __metadata("design:type", String)
], Student.prototype, "photo", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        unique: true,
        validate: {
            is: {
                args: /^[A-Z0-9]{2,4}-?[A-Z0-9]{4,8}$/i,
                msg: 'Medical Record Number must be 6-12 alphanumeric characters, optionally separated by a hyphen (e.g., ABC-12345, 12345678)',
            },
            len: {
                args: [6, 50],
                msg: 'Medical Record Number must be between 6 and 50 characters',
            },
        },
    }),
    __metadata("design:type", String)
], Student.prototype, "medicalRecordNum", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }),
    __metadata("design:type", Boolean)
], Student.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        defaultValue: sequelize_typescript_1.DataType.NOW,
    }),
    __metadata("design:type", Date)
], Student.prototype, "enrollmentDate", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./user.model').User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        references: {
            model: 'users',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    }),
    __metadata("design:type", String)
], Student.prototype, "nurseId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./school.model').School),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        references: {
            model: 'schools',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", String)
], Student.prototype, "schoolId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./district.model').District),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        references: {
            model: 'districts',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", String)
], Student.prototype, "districtId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], Student.prototype, "createdBy", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], Student.prototype, "updatedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], Student.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], Student.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], Student.prototype, "deletedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./user.model').User, {
        foreignKey: 'nurseId',
        as: 'nurse',
    }),
    __metadata("design:type", Function)
], Student.prototype, "nurse", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./school.model').School, {
        foreignKey: 'schoolId',
        as: 'school',
    }),
    __metadata("design:type", Function)
], Student.prototype, "school", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./district.model').District, {
        foreignKey: 'districtId',
        as: 'district',
    }),
    __metadata("design:type", Function)
], Student.prototype, "district", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./health-record.model').HealthRecord, {
        foreignKey: 'studentId',
        as: 'healthRecords',
    }),
    __metadata("design:type", Array)
], Student.prototype, "healthRecords", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./academic-transcript.model').AcademicTranscript, {
        foreignKey: 'studentId',
        as: 'academicTranscripts',
    }),
    __metadata("design:type", Array)
], Student.prototype, "academicTranscripts", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./mental-health-record.model').MentalHealthRecord, {
        foreignKey: 'studentId',
        as: 'mentalHealthRecords',
    }),
    __metadata("design:type", Array)
], Student.prototype, "mentalHealthRecords", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./appointment.model').Appointment, {
        foreignKey: 'studentId',
        as: 'appointments',
    }),
    __metadata("design:type", Array)
], Student.prototype, "appointments", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./prescription.model').Prescription, {
        foreignKey: 'studentId',
        as: 'prescriptions',
    }),
    __metadata("design:type", Array)
], Student.prototype, "prescriptions", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./clinic-visit.model').ClinicVisit, {
        foreignKey: 'studentId',
        as: 'clinicVisits',
    }),
    __metadata("design:type", Array)
], Student.prototype, "clinicVisits", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./allergy.model').Allergy, {
        foreignKey: 'studentId',
        as: 'allergies',
    }),
    __metadata("design:type", Array)
], Student.prototype, "allergies", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./chronic-condition.model').ChronicCondition, {
        foreignKey: 'studentId',
        as: 'chronicConditions',
    }),
    __metadata("design:type", Array)
], Student.prototype, "chronicConditions", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./vaccination.model').Vaccination, {
        foreignKey: 'studentId',
        as: 'vaccinations',
    }),
    __metadata("design:type", Array)
], Student.prototype, "vaccinations", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./vital-signs.model').VitalSigns, {
        foreignKey: 'studentId',
        as: 'vitalSigns',
    }),
    __metadata("design:type", Array)
], Student.prototype, "vitalSigns", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./clinical-note.model').ClinicalNote, {
        foreignKey: 'studentId',
        as: 'clinicalNotes',
    }),
    __metadata("design:type", Array)
], Student.prototype, "clinicalNotes", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./incident-report.model').IncidentReport, {
        foreignKey: 'studentId',
        as: 'incidentReports',
    }),
    __metadata("design:type", Array)
], Student.prototype, "incidentReports", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Student]),
    __metadata("design:returntype", Promise)
], Student, "validateEnrollmentDate", null);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Student]),
    __metadata("design:returntype", Promise)
], Student, "auditPHIAccess", null);
exports.Student = Student = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                isActive: true,
                deletedAt: null,
            },
        },
        byGrade: (grade) => ({
            where: { grade },
        }),
        bySchool: (schoolId) => ({
            where: { schoolId },
        }),
        byDistrict: (districtId) => ({
            where: { districtId },
        }),
        withHealthRecords: {
            include: [
                {
                    association: 'healthRecords',
                },
            ],
        },
        recentlyEnrolled: {
            where: {
                enrollmentDate: {
                    [sequelize_1.Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                },
            },
            order: [['enrollmentDate', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'students',
        timestamps: true,
        underscored: false,
        paranoid: true,
        indexes: [
            {
                fields: ['studentNumber'],
                unique: true,
            },
            {
                fields: ['nurseId'],
            },
            {
                fields: ['schoolId'],
            },
            {
                fields: ['districtId'],
            },
            {
                fields: ['isActive'],
            },
            {
                fields: ['grade'],
            },
            {
                fields: ['lastName', 'firstName'],
            },
            {
                fields: ['medicalRecordNum'],
                unique: true,
                where: {
                    medicalRecordNum: {
                        [sequelize_1.Op.ne]: null,
                    },
                },
            },
            {
                fields: ['schoolId', 'grade', 'isActive'],
                name: 'idx_students_school_grade_active',
            },
            {
                fields: ['districtId', 'isActive'],
                name: 'idx_students_district_active',
            },
            {
                fields: ['enrollmentDate'],
                name: 'idx_students_enrollment_date',
            },
            {
                fields: ['createdAt'],
                name: 'idx_students_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_students_updated_at',
            },
        ],
    })
], Student);
//# sourceMappingURL=student.model.js.map