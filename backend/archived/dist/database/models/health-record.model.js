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
exports.HealthRecord = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
let HealthRecord = class HealthRecord extends sequelize_typescript_1.Model {
    studentId;
    recordType;
    title;
    description;
    recordDate;
    provider;
    providerNpi;
    facility;
    facilityNpi;
    diagnosis;
    diagnosisCode;
    treatment;
    followUpRequired;
    followUpDate;
    followUpCompleted;
    attachments;
    metadata;
    isConfidential;
    notes;
    createdBy;
    updatedBy;
    static async validateFollowUpDate(instance) {
        if (instance.followUpRequired && !instance.followUpDate) {
            throw new Error('Follow-up date is required when follow-up is marked as required');
        }
        if (instance.followUpDate && instance.followUpDate < instance.recordDate) {
            throw new Error('Follow-up date cannot be before record date');
        }
    }
    static async auditPHIAccess(instance) {
        if (instance.changed()) {
            const changedFields = instance.changed();
            const { logModelPHIAccess } = await Promise.resolve().then(() => __importStar(require('../services/model-audit-helper.service.js')));
            const transaction = instance.sequelize?.transaction || undefined;
            await logModelPHIAccess('HealthRecord', instance.id, 'UPDATE', changedFields, transaction);
        }
    }
    isFollowUpOverdue() {
        if (!this.followUpRequired ||
            !this.followUpDate ||
            this.followUpCompleted) {
            return false;
        }
        return new Date() > this.followUpDate;
    }
    getDaysUntilFollowUp() {
        if (!this.followUpRequired ||
            !this.followUpDate ||
            this.followUpCompleted) {
            return null;
        }
        const diff = this.followUpDate.getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
};
exports.HealthRecord = HealthRecord;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], HealthRecord.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => require('./student.model').Student),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
        references: {
            model: 'students',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", String)
], HealthRecord.prototype, "studentId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('CHECKUP', 'VACCINATION', 'ILLNESS', 'INJURY', 'SCREENING', 'PHYSICAL_EXAM', 'MENTAL_HEALTH', 'DENTAL', 'VISION', 'HEARING', 'EXAMINATION', 'ALLERGY_DOCUMENTATION', 'CHRONIC_CONDITION_REVIEW', 'GROWTH_ASSESSMENT', 'VITAL_SIGNS_CHECK', 'EMERGENCY_VISIT', 'FOLLOW_UP', 'CONSULTATION', 'DIAGNOSTIC_TEST', 'PROCEDURE', 'HOSPITALIZATION', 'SURGERY', 'COUNSELING', 'THERAPY', 'NUTRITION', 'MEDICATION_REVIEW', 'IMMUNIZATION', 'LAB_RESULT', 'RADIOLOGY', 'OTHER'),
        allowNull: false,
    }),
    __metadata("design:type", String)
], HealthRecord.prototype, "recordType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: false,
    }),
    __metadata("design:type", String)
], HealthRecord.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], HealthRecord.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], HealthRecord.prototype, "recordDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200)),
    __metadata("design:type", String)
], HealthRecord.prototype, "provider", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        validate: {
            is: {
                args: /^\d{10}$/,
                msg: 'NPI must be a 10-digit number',
            },
        },
    }),
    __metadata("design:type", String)
], HealthRecord.prototype, "providerNpi", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(200)),
    __metadata("design:type", String)
], HealthRecord.prototype, "facility", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        validate: {
            is: {
                args: /^\d{10}$/,
                msg: 'NPI must be a 10-digit number',
            },
        },
    }),
    __metadata("design:type", String)
], HealthRecord.prototype, "facilityNpi", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], HealthRecord.prototype, "diagnosis", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
        validate: {
            is: {
                args: /^[A-Z]\d{2}(\.\d{1,4})?$/,
                msg: 'Diagnosis code must be in ICD-10 format (e.g., A00, A00.0, A00.01)',
            },
        },
    }),
    __metadata("design:type", String)
], HealthRecord.prototype, "diagnosisCode", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], HealthRecord.prototype, "treatment", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], HealthRecord.prototype, "followUpRequired", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], HealthRecord.prototype, "followUpDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], HealthRecord.prototype, "followUpCompleted", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)([]),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
    }),
    __metadata("design:type", Array)
], HealthRecord.prototype, "attachments", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB),
    __metadata("design:type", Object)
], HealthRecord.prototype, "metadata", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], HealthRecord.prototype, "isConfidential", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], HealthRecord.prototype, "notes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], HealthRecord.prototype, "createdBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], HealthRecord.prototype, "updatedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], HealthRecord.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], HealthRecord.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./student.model').Student, {
        foreignKey: 'studentId',
        as: 'student',
        constraints: true,
    }),
    __metadata("design:type", Function)
], HealthRecord.prototype, "student", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [HealthRecord]),
    __metadata("design:returntype", Promise)
], HealthRecord, "validateFollowUpDate", null);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [HealthRecord]),
    __metadata("design:returntype", Promise)
], HealthRecord, "auditPHIAccess", null);
exports.HealthRecord = HealthRecord = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        byStudent: (studentId) => ({
            where: { studentId },
            order: [['recordDate', 'DESC']],
        }),
        byType: (recordType) => ({
            where: { recordType },
            order: [['recordDate', 'DESC']],
        }),
        confidential: {
            where: {
                isConfidential: true,
            },
        },
        recent: {
            where: {
                recordDate: {
                    [sequelize_1.Op.gte]: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
                },
            },
            order: [['recordDate', 'DESC']],
        },
        needsFollowUp: {
            where: {
                followUpRequired: true,
                followUpCompleted: false,
                followUpDate: {
                    [sequelize_1.Op.ne]: null,
                },
            },
            order: [['followUpDate', 'ASC']],
        },
        overdueFollowUp: {
            where: {
                followUpRequired: true,
                followUpCompleted: false,
                followUpDate: {
                    [sequelize_1.Op.lt]: new Date(),
                },
            },
            order: [['followUpDate', 'ASC']],
        },
        byDiagnosisCode: (code) => ({
            where: {
                diagnosisCode: {
                    [sequelize_1.Op.like]: `${code}%`,
                },
            },
            order: [['recordDate', 'DESC']],
        }),
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'health_records',
        timestamps: true,
        underscored: false,
        paranoid: true,
        indexes: [
            {
                fields: ['studentId', 'recordDate'],
                name: 'idx_health_records_student_date',
            },
            {
                fields: ['recordType', 'recordDate'],
                name: 'idx_health_records_type_date',
            },
            {
                fields: ['createdBy'],
                name: 'idx_health_records_created_by',
            },
            {
                fields: ['followUpRequired', 'followUpDate'],
                name: 'idx_health_records_followup',
            },
            {
                fields: ['studentId', 'recordType', 'recordDate'],
                name: 'idx_health_records_student_type_date',
            },
            {
                fields: ['studentId', 'isConfidential'],
                name: 'idx_health_records_student_confidential',
            },
            {
                fields: ['recordType', 'isConfidential', 'recordDate'],
                name: 'idx_health_records_type_confidential_date',
            },
            {
                fields: ['provider', 'recordDate'],
                name: 'idx_health_records_provider_date',
            },
            {
                fields: ['diagnosisCode'],
                name: 'idx_health_records_diagnosis_code',
            },
            {
                fields: ['createdAt'],
                name: 'idx_health_records_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_health_records_updated_at',
            },
        ],
    })
], HealthRecord);
//# sourceMappingURL=health-record.model.js.map