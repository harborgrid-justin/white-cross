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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicTranscript = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
let AcademicTranscript = class AcademicTranscript extends sequelize_typescript_1.Model {
    studentId;
    academicYear;
    semester;
    grade;
    gpa;
    subjects;
    attendance;
    behavior;
    importedBy;
    importedAt;
    importSource;
    metadata;
    getTotalCredits() {
        return this.subjects.reduce((total, subject) => total + subject.credits, 0);
    }
    getHonorRollStatus() {
        if (this.gpa >= 3.75)
            return 'High Honors';
        if (this.gpa >= 3.25)
            return 'Honors';
        return 'None';
    }
    isAtRisk() {
        return this.gpa < 2.0 || this.attendance.attendanceRate < 90;
    }
    getSubject(subjectCode) {
        return this.subjects.find((s) => s.subjectCode === subjectCode);
    }
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('AcademicTranscript', instance);
    }
};
exports.AcademicTranscript = AcademicTranscript;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], AcademicTranscript.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./student.model').Student),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], AcademicTranscript.prototype, "studentId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        allowNull: false,
    }),
    __metadata("design:type", String)
], AcademicTranscript.prototype, "academicYear", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        allowNull: false,
    }),
    __metadata("design:type", String)
], AcademicTranscript.prototype, "semester", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(10),
        allowNull: false,
    }),
    __metadata("design:type", String)
], AcademicTranscript.prototype, "grade", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0.0,
    }),
    __metadata("design:type", Number)
], AcademicTranscript.prototype, "gpa", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: false,
        defaultValue: [],
    }),
    __metadata("design:type", Array)
], AcademicTranscript.prototype, "subjects", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: false,
        defaultValue: {
            totalDays: 0,
            presentDays: 0,
            absentDays: 0,
            tardyDays: 0,
            attendanceRate: 0,
        },
    }),
    __metadata("design:type", Object)
], AcademicTranscript.prototype, "attendance", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: false,
        defaultValue: {
            conductGrade: 'N/A',
            incidents: 0,
            commendations: 0,
        },
    }),
    __metadata("design:type", Object)
], AcademicTranscript.prototype, "behavior", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], AcademicTranscript.prototype, "importedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], AcademicTranscript.prototype, "importedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
    }),
    __metadata("design:type", String)
], AcademicTranscript.prototype, "importSource", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB),
    __metadata("design:type", Object)
], AcademicTranscript.prototype, "metadata", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], AcademicTranscript.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], AcademicTranscript.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./student.model').Student),
    __metadata("design:type", Object)
], AcademicTranscript.prototype, "student", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AcademicTranscript]),
    __metadata("design:returntype", Promise)
], AcademicTranscript, "auditPHIAccess", null);
exports.AcademicTranscript = AcademicTranscript = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'academic_transcripts',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['studentId'],
                name: 'academic_transcripts_student_id_idx',
            },
            {
                fields: ['academicYear'],
                name: 'academic_transcripts_academic_year_idx',
            },
            {
                fields: ['studentId', 'academicYear', 'semester'],
                unique: true,
                name: 'academic_transcripts_student_year_semester_unique',
            },
            {
                fields: ['gpa'],
                name: 'academic_transcripts_gpa_idx',
            },
            {
                fields: ['importedBy'],
                name: 'academic_transcripts_imported_by_idx',
            },
            {
                fields: ['createdAt'],
                name: 'idx_academic_transcript_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_academic_transcript_updated_at',
            },
        ],
    })
], AcademicTranscript);
//# sourceMappingURL=academic-transcript.model.js.map