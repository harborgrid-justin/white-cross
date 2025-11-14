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
exports.AnalyticsReport = exports.ComplianceStatus = exports.ReportStatus = exports.ReportFormat = exports.ReportType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var ReportType;
(function (ReportType) {
    ReportType["COMPLIANCE"] = "COMPLIANCE";
    ReportType["HEALTH_TRENDS"] = "HEALTH_TRENDS";
    ReportType["INCIDENT_ANALYSIS"] = "INCIDENT_ANALYSIS";
    ReportType["MEDICATION_USAGE"] = "MEDICATION_USAGE";
    ReportType["APPOINTMENT_UTILIZATION"] = "APPOINTMENT_UTILIZATION";
    ReportType["STUDENT_HEALTH_OVERVIEW"] = "STUDENT_HEALTH_OVERVIEW";
    ReportType["NURSE_WORKLOAD"] = "NURSE_WORKLOAD";
    ReportType["EQUIPMENT_MAINTENANCE"] = "EQUIPMENT_MAINTENANCE";
    ReportType["BUDGET_ANALYSIS"] = "BUDGET_ANALYSIS";
    ReportType["CUSTOM"] = "CUSTOM";
})(ReportType || (exports.ReportType = ReportType = {}));
var ReportFormat;
(function (ReportFormat) {
    ReportFormat["PDF"] = "PDF";
    ReportFormat["CSV"] = "CSV";
    ReportFormat["EXCEL"] = "EXCEL";
    ReportFormat["JSON"] = "JSON";
    ReportFormat["HTML"] = "HTML";
})(ReportFormat || (exports.ReportFormat = ReportFormat = {}));
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["PENDING"] = "PENDING";
    ReportStatus["GENERATING"] = "GENERATING";
    ReportStatus["COMPLETED"] = "COMPLETED";
    ReportStatus["FAILED"] = "FAILED";
    ReportStatus["CANCELLED"] = "CANCELLED";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
var ComplianceStatus;
(function (ComplianceStatus) {
    ComplianceStatus["COMPLIANT"] = "COMPLIANT";
    ComplianceStatus["NON_COMPLIANT"] = "NON_COMPLIANT";
    ComplianceStatus["PARTIALLY_COMPLIANT"] = "PARTIALLY_COMPLIANT";
    ComplianceStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
})(ComplianceStatus || (exports.ComplianceStatus = ComplianceStatus = {}));
let AnalyticsReport = class AnalyticsReport extends sequelize_typescript_1.Model {
    reportType;
    title;
    description;
    periodStart;
    periodEnd;
    generatedDate;
    schoolId;
    schoolName;
    summary;
    sections;
    findings;
    recommendations;
    status;
    format;
    fileUrl;
    fileSize;
    generatedBy;
    reviewedBy;
    reviewedAt;
    approvedBy;
    approvalDate;
    distributionList;
    sentAt;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('AnalyticsReport', instance);
    }
};
exports.AnalyticsReport = AnalyticsReport;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], AnalyticsReport.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ReportType)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], AnalyticsReport.prototype, "reportType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], AnalyticsReport.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], AnalyticsReport.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], AnalyticsReport.prototype, "periodStart", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], AnalyticsReport.prototype, "periodEnd", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], AnalyticsReport.prototype, "generatedDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], AnalyticsReport.prototype, "schoolId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], AnalyticsReport.prototype, "schoolName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: false,
    }),
    __metadata("design:type", Object)
], AnalyticsReport.prototype, "summary", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: false,
        defaultValue: [],
    }),
    __metadata("design:type", Array)
], AnalyticsReport.prototype, "sections", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: false,
        defaultValue: [],
    }),
    __metadata("design:type", Array)
], AnalyticsReport.prototype, "findings", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: false,
        defaultValue: [],
    }),
    __metadata("design:type", Array)
], AnalyticsReport.prototype, "recommendations", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(ReportStatus.PENDING),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ReportStatus)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], AnalyticsReport.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ReportFormat)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], AnalyticsReport.prototype, "format", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING(255)),
    __metadata("design:type", String)
], AnalyticsReport.prototype, "fileUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], AnalyticsReport.prototype, "fileSize", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], AnalyticsReport.prototype, "generatedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], AnalyticsReport.prototype, "reviewedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], AnalyticsReport.prototype, "reviewedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], AnalyticsReport.prototype, "approvedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], AnalyticsReport.prototype, "approvalDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB),
    __metadata("design:type", Array)
], AnalyticsReport.prototype, "distributionList", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], AnalyticsReport.prototype, "sentAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], AnalyticsReport.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], AnalyticsReport.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AnalyticsReport]),
    __metadata("design:returntype", Promise)
], AnalyticsReport, "auditPHIAccess", null);
exports.AnalyticsReport = AnalyticsReport = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'analytics_reports',
        timestamps: true,
        underscored: false,
        indexes: [
            {
                fields: ['schoolId', 'reportType'],
            },
            {
                fields: ['generatedDate'],
            },
            {
                fields: ['createdAt'],
                name: 'idx_analytics_report_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_analytics_report_updated_at',
            },
        ],
    })
], AnalyticsReport);
//# sourceMappingURL=analytics-report.model.js.map