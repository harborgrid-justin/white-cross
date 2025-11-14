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
exports.DataRetentionPolicy = exports.RetentionStatus = exports.DataRetentionCategory = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var DataRetentionCategory;
(function (DataRetentionCategory) {
    DataRetentionCategory["STUDENT_RECORDS"] = "STUDENT_RECORDS";
    DataRetentionCategory["HEALTH_RECORDS"] = "HEALTH_RECORDS";
    DataRetentionCategory["MEDICATION_LOGS"] = "MEDICATION_LOGS";
    DataRetentionCategory["AUDIT_LOGS"] = "AUDIT_LOGS";
    DataRetentionCategory["CONSENT_FORMS"] = "CONSENT_FORMS";
    DataRetentionCategory["INCIDENT_REPORTS"] = "INCIDENT_REPORTS";
    DataRetentionCategory["TRAINING_RECORDS"] = "TRAINING_RECORDS";
})(DataRetentionCategory || (exports.DataRetentionCategory = DataRetentionCategory = {}));
var RetentionStatus;
(function (RetentionStatus) {
    RetentionStatus["ACTIVE"] = "ACTIVE";
    RetentionStatus["INACTIVE"] = "INACTIVE";
    RetentionStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
})(RetentionStatus || (exports.RetentionStatus = RetentionStatus = {}));
let DataRetentionPolicy = class DataRetentionPolicy extends sequelize_typescript_1.Model {
    category;
    description;
    retentionPeriodDays;
    legalBasis;
    status;
    autoDelete;
    lastReviewedAt;
    lastReviewedBy;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('DataRetentionPolicy', instance);
    }
};
exports.DataRetentionPolicy = DataRetentionPolicy;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], DataRetentionPolicy.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(DataRetentionCategory)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], DataRetentionPolicy.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], DataRetentionPolicy.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], DataRetentionPolicy.prototype, "retentionPeriodDays", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], DataRetentionPolicy.prototype, "legalBasis", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(RetentionStatus)],
        },
        allowNull: false,
        defaultValue: RetentionStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], DataRetentionPolicy.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], DataRetentionPolicy.prototype, "autoDelete", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], DataRetentionPolicy.prototype, "lastReviewedAt", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], DataRetentionPolicy.prototype, "lastReviewedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], DataRetentionPolicy.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], DataRetentionPolicy.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DataRetentionPolicy]),
    __metadata("design:returntype", Promise)
], DataRetentionPolicy, "auditPHIAccess", null);
exports.DataRetentionPolicy = DataRetentionPolicy = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'data_retention_policies',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['category'],
            },
            {
                fields: ['status'],
            },
            {
                fields: ['autoDelete'],
            },
            {
                fields: ['lastReviewedAt'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_data_retention_policy_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_data_retention_policy_updated_at',
            },
        ],
    })
], DataRetentionPolicy);
//# sourceMappingURL=data-retention-policy.model.js.map