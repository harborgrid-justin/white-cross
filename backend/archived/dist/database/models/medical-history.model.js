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
exports.MedicalHistory = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
let MedicalHistory = class MedicalHistory extends sequelize_typescript_1.Model {
    studentId;
    recordType;
    condition;
    diagnosisCode;
    diagnosisDate;
    resolvedDate;
    isActive;
    severity;
    category;
    treatment;
    medication;
    notes;
    isFamilyHistory;
    familyRelation;
    isCritical;
    requiresMonitoring;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('MedicalHistory', instance);
    }
    static async validateMedicalHistory(instance) {
        if (instance.isFamilyHistory && !instance.familyRelation) {
            throw new Error('Family relation is required for family history records');
        }
        if (!instance.isFamilyHistory && instance.familyRelation) {
            throw new Error('Family relation should not be set for non-family history records');
        }
        if (!instance.isActive && !instance.resolvedDate) {
            instance.resolvedDate = new Date();
        }
        if (instance.resolvedDate && instance.diagnosisDate) {
            if (instance.resolvedDate < instance.diagnosisDate) {
                throw new Error('Resolved date cannot be before diagnosis date');
            }
        }
        if (instance.severity === 'critical') {
            instance.isCritical = true;
        }
        if (instance.category === 'chronic' || instance.isCritical) {
            instance.requiresMonitoring = true;
        }
    }
};
exports.MedicalHistory = MedicalHistory;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], MedicalHistory.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], MedicalHistory.prototype, "studentId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('condition', 'allergy', 'surgery', 'hospitalization', 'family_history', 'other'),
        allowNull: false,
    }),
    __metadata("design:type", String)
], MedicalHistory.prototype, "recordType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], MedicalHistory.prototype, "condition", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], MedicalHistory.prototype, "diagnosisCode", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], MedicalHistory.prototype, "diagnosisDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], MedicalHistory.prototype, "resolvedDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], MedicalHistory.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('mild', 'moderate', 'severe', 'critical')),
    __metadata("design:type", String)
], MedicalHistory.prototype, "severity", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('chronic', 'acute', 'genetic', 'infectious', 'autoimmune', 'other')),
    __metadata("design:type", String)
], MedicalHistory.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], MedicalHistory.prototype, "treatment", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], MedicalHistory.prototype, "medication", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], MedicalHistory.prototype, "notes", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], MedicalHistory.prototype, "isFamilyHistory", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('mother', 'father', 'sibling', 'grandparent', 'aunt', 'uncle', 'cousin', 'other')),
    __metadata("design:type", String)
], MedicalHistory.prototype, "familyRelation", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], MedicalHistory.prototype, "isCritical", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], MedicalHistory.prototype, "requiresMonitoring", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], MedicalHistory.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], MedicalHistory.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MedicalHistory]),
    __metadata("design:returntype", Promise)
], MedicalHistory, "auditPHIAccess", null);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MedicalHistory]),
    __metadata("design:returntype", Promise)
], MedicalHistory, "validateMedicalHistory", null);
exports.MedicalHistory = MedicalHistory = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'medical_history',
        timestamps: true,
        underscored: false,
        paranoid: true,
        indexes: [
            {
                fields: ['studentId'],
            },
            {
                fields: ['recordType'],
            },
            {
                fields: ['isActive'],
            },
            {
                fields: ['isFamilyHistory'],
            },
            {
                fields: ['isCritical'],
            },
            {
                fields: ['requiresMonitoring'],
            },
            {
                fields: ['diagnosisDate'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_medical_history_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_medical_history_updated_at',
            },
        ],
    })
], MedicalHistory);
//# sourceMappingURL=medical-history.model.js.map