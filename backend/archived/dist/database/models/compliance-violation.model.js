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
exports.ComplianceViolation = exports.ViolationStatus = exports.ViolationSeverity = exports.ViolationType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var ViolationType;
(function (ViolationType) {
    ViolationType["HIPAA_BREACH"] = "HIPAA_BREACH";
    ViolationType["FERPA_VIOLATION"] = "FERPA_VIOLATION";
    ViolationType["UNAUTHORIZED_ACCESS"] = "UNAUTHORIZED_ACCESS";
    ViolationType["DATA_LEAK"] = "DATA_LEAK";
    ViolationType["POLICY_VIOLATION"] = "POLICY_VIOLATION";
    ViolationType["PROCEDURE_VIOLATION"] = "PROCEDURE_VIOLATION";
    ViolationType["TRAINING_DEFICIENCY"] = "TRAINING_DEFICIENCY";
})(ViolationType || (exports.ViolationType = ViolationType = {}));
var ViolationSeverity;
(function (ViolationSeverity) {
    ViolationSeverity["LOW"] = "LOW";
    ViolationSeverity["MEDIUM"] = "MEDIUM";
    ViolationSeverity["HIGH"] = "HIGH";
    ViolationSeverity["CRITICAL"] = "CRITICAL";
})(ViolationSeverity || (exports.ViolationSeverity = ViolationSeverity = {}));
var ViolationStatus;
(function (ViolationStatus) {
    ViolationStatus["REPORTED"] = "REPORTED";
    ViolationStatus["INVESTIGATING"] = "INVESTIGATING";
    ViolationStatus["REMEDIATION_IN_PROGRESS"] = "REMEDIATION_IN_PROGRESS";
    ViolationStatus["RESOLVED"] = "RESOLVED";
    ViolationStatus["CLOSED"] = "CLOSED";
})(ViolationStatus || (exports.ViolationStatus = ViolationStatus = {}));
let ComplianceViolation = class ComplianceViolation extends sequelize_typescript_1.Model {
    violationType;
    title;
    description;
    severity;
    status;
    reportedBy;
    discoveredAt;
    affectedStudents;
    affectedDataCategories;
    rootCause;
    assignedTo;
    resolutionNotes;
    resolvedAt;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('ComplianceViolation', instance);
    }
};
exports.ComplianceViolation = ComplianceViolation;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ComplianceViolation.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ViolationType)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], ComplianceViolation.prototype, "violationType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ComplianceViolation.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
    }),
    __metadata("design:type", String)
], ComplianceViolation.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ViolationSeverity)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], ComplianceViolation.prototype, "severity", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ViolationStatus)],
        },
        allowNull: false,
        defaultValue: ViolationStatus.REPORTED,
    }),
    __metadata("design:type", String)
], ComplianceViolation.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], ComplianceViolation.prototype, "reportedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], ComplianceViolation.prototype, "discoveredAt", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB),
    __metadata("design:type", Array)
], ComplianceViolation.prototype, "affectedStudents", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB),
    __metadata("design:type", Array)
], ComplianceViolation.prototype, "affectedDataCategories", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], ComplianceViolation.prototype, "rootCause", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ComplianceViolation.prototype, "assignedTo", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], ComplianceViolation.prototype, "resolutionNotes", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ComplianceViolation.prototype, "resolvedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ComplianceViolation.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ComplianceViolation.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ComplianceViolation]),
    __metadata("design:returntype", Promise)
], ComplianceViolation, "auditPHIAccess", null);
exports.ComplianceViolation = ComplianceViolation = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'compliance_violations',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['violationType'],
            },
            {
                fields: ['severity'],
            },
            {
                fields: ['status'],
            },
            {
                fields: ['reportedBy'],
            },
            {
                fields: ['assignedTo'],
            },
            {
                fields: ['discoveredAt'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_compliance_violation_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_compliance_violation_updated_at',
            },
        ],
    })
], ComplianceViolation);
//# sourceMappingURL=compliance-violation.model.js.map