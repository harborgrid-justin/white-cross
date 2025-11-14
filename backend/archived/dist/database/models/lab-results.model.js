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
exports.LabResults = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
let LabResults = class LabResults extends sequelize_typescript_1.Model {
    studentId;
    testType;
    testName;
    testCode;
    orderedDate;
    collectionDate;
    resultDate;
    result;
    resultValue;
    resultUnit;
    referenceRange;
    isAbnormal;
    abnormalFlags;
    interpretation;
    status;
    orderedBy;
    performedBy;
    reviewedBy;
    reviewedDate;
    labName;
    notes;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('LabResults', instance);
    }
    static async checkAbnormalResults(instance) {
        const abnormalFlags = [];
        if (instance.resultValue !== undefined && instance.referenceRange) {
            const value = instance.resultValue;
            const range = instance.referenceRange;
            if (range.includes('-')) {
                const [min, max] = range.split('-').map((r) => parseFloat(r.trim()));
                if (!isNaN(min) && !isNaN(max)) {
                    if (value < min)
                        abnormalFlags.push('low');
                    if (value > max)
                        abnormalFlags.push('high');
                }
            }
            else if (range.startsWith('<')) {
                const max = parseFloat(range.substring(1).trim());
                if (!isNaN(max) && value >= max)
                    abnormalFlags.push('high');
            }
            else if (range.startsWith('>')) {
                const min = parseFloat(range.substring(1).trim());
                if (!isNaN(min) && value <= min)
                    abnormalFlags.push('low');
            }
        }
        if (instance.resultValue !== undefined) {
            if (instance.testName.toLowerCase().includes('glucose') &&
                instance.resultValue > 500) {
                abnormalFlags.push('critical_high');
            }
            if (instance.testName.toLowerCase().includes('potassium') &&
                (instance.resultValue < 3.0 || instance.resultValue > 6.0)) {
                abnormalFlags.push('critical');
            }
        }
        instance.abnormalFlags = abnormalFlags;
        instance.isAbnormal = abnormalFlags.length > 0;
    }
};
exports.LabResults = LabResults;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], LabResults.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], LabResults.prototype, "studentId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM('blood_test', 'urinalysis', 'culture', 'chemistry', 'hematology', 'microbiology', 'other'),
        allowNull: false,
    }),
    __metadata("design:type", String)
], LabResults.prototype, "testType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], LabResults.prototype, "testName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], LabResults.prototype, "testCode", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], LabResults.prototype, "orderedDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], LabResults.prototype, "collectionDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], LabResults.prototype, "resultDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], LabResults.prototype, "result", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.FLOAT),
    __metadata("design:type", Number)
], LabResults.prototype, "resultValue", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], LabResults.prototype, "resultUnit", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], LabResults.prototype, "referenceRange", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], LabResults.prototype, "isAbnormal", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Array)
], LabResults.prototype, "abnormalFlags", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], LabResults.prototype, "interpretation", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)('pending'),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM('pending', 'completed', 'reviewed', 'cancelled')),
    __metadata("design:type", String)
], LabResults.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], LabResults.prototype, "orderedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], LabResults.prototype, "performedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], LabResults.prototype, "reviewedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], LabResults.prototype, "reviewedDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], LabResults.prototype, "labName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], LabResults.prototype, "notes", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], LabResults.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], LabResults.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LabResults]),
    __metadata("design:returntype", Promise)
], LabResults, "auditPHIAccess", null);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LabResults]),
    __metadata("design:returntype", Promise)
], LabResults, "checkAbnormalResults", null);
exports.LabResults = LabResults = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'lab_results',
        timestamps: true,
        underscored: false,
        paranoid: true,
        indexes: [
            {
                fields: ['studentId'],
            },
            {
                fields: ['testType'],
            },
            {
                fields: ['status'],
            },
            {
                fields: ['isAbnormal'],
            },
            {
                fields: ['orderedDate'],
            },
            {
                fields: ['resultDate'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_lab_results_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_lab_results_updated_at',
            },
        ],
    })
], LabResults);
//# sourceMappingURL=lab-results.model.js.map