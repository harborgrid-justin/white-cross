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
exports.ComplianceReport = exports.ComplianceStatus = exports.ComplianceReportType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var ComplianceReportType;
(function (ComplianceReportType) {
    ComplianceReportType["HIPAA"] = "HIPAA";
    ComplianceReportType["FERPA"] = "FERPA";
    ComplianceReportType["PRIVACY"] = "PRIVACY";
    ComplianceReportType["SECURITY"] = "SECURITY";
    ComplianceReportType["BREACH"] = "BREACH";
    ComplianceReportType["RISK_ASSESSMENT"] = "RISK_ASSESSMENT";
    ComplianceReportType["TRAINING"] = "TRAINING";
    ComplianceReportType["AUDIT"] = "AUDIT";
})(ComplianceReportType || (exports.ComplianceReportType = ComplianceReportType = {}));
var ComplianceStatus;
(function (ComplianceStatus) {
    ComplianceStatus["PENDING"] = "PENDING";
    ComplianceStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ComplianceStatus["COMPLIANT"] = "COMPLIANT";
    ComplianceStatus["NON_COMPLIANT"] = "NON_COMPLIANT";
    ComplianceStatus["NEEDS_REVIEW"] = "NEEDS_REVIEW";
})(ComplianceStatus || (exports.ComplianceStatus = ComplianceStatus = {}));
let ComplianceReport = class ComplianceReport extends sequelize_typescript_1.Model {
    reportType;
    title;
    description;
    status;
    period;
    findings;
    recommendations;
    dueDate;
    submittedAt;
    submittedBy;
    reviewedAt;
    reviewedBy;
    createdById;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('ComplianceReport', instance);
    }
};
exports.ComplianceReport = ComplianceReport;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ComplianceReport.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ComplianceReportType)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], ComplianceReport.prototype, "reportType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ComplianceReport.prototype, "title", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], ComplianceReport.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ComplianceStatus)],
        },
        allowNull: false,
        defaultValue: ComplianceStatus.PENDING,
    }),
    __metadata("design:type", String)
], ComplianceReport.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ComplianceReport.prototype, "period", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB),
    __metadata("design:type", Object)
], ComplianceReport.prototype, "findings", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB),
    __metadata("design:type", Object)
], ComplianceReport.prototype, "recommendations", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ComplianceReport.prototype, "dueDate", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ComplianceReport.prototype, "submittedAt", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ComplianceReport.prototype, "submittedBy", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ComplianceReport.prototype, "reviewedAt", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ComplianceReport.prototype, "reviewedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], ComplianceReport.prototype, "createdById", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ComplianceReport.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], ComplianceReport.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => require('./compliance-checklist-item.model').ComplianceChecklistItem),
    __metadata("design:type", Array)
], ComplianceReport.prototype, "checklistItems", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ComplianceReport]),
    __metadata("design:returntype", Promise)
], ComplianceReport, "auditPHIAccess", null);
exports.ComplianceReport = ComplianceReport = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'compliance_reports',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['reportType'],
            },
            {
                fields: ['status'],
            },
            {
                fields: ['period'],
            },
            {
                fields: ['dueDate'],
            },
            {
                fields: ['createdById'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_compliance_report_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_compliance_report_updated_at',
            },
        ],
    })
], ComplianceReport);
//# sourceMappingURL=compliance-report.model.js.map