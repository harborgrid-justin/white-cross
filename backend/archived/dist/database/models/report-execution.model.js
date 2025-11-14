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
exports.ReportExecution = exports.ReportStatus = exports.OutputFormat = exports.ReportType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const model_audit_hooks_service_1 = require("../services/model-audit-hooks.service");
var ReportType;
(function (ReportType) {
    ReportType["HEALTH_REPORT"] = "HEALTH_REPORT";
    ReportType["MEDICATION_REPORT"] = "MEDICATION_REPORT";
    ReportType["INCIDENT_REPORT"] = "INCIDENT_REPORT";
    ReportType["COMPLIANCE_REPORT"] = "COMPLIANCE_REPORT";
    ReportType["ANALYTICS_REPORT"] = "ANALYTICS_REPORT";
})(ReportType || (exports.ReportType = ReportType = {}));
var OutputFormat;
(function (OutputFormat) {
    OutputFormat["PDF"] = "PDF";
    OutputFormat["CSV"] = "CSV";
    OutputFormat["XLSX"] = "XLSX";
    OutputFormat["JSON"] = "JSON";
})(OutputFormat || (exports.OutputFormat = OutputFormat = {}));
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["PENDING"] = "pending";
    ReportStatus["GENERATING"] = "generating";
    ReportStatus["COMPLETED"] = "completed";
    ReportStatus["FAILED"] = "failed";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
let ReportExecution = class ReportExecution extends sequelize_typescript_1.Model {
    scheduleId;
    reportType;
    outputFormat;
    parameters;
    status;
    filePath;
    downloadUrl;
    fileSize;
    recordCount;
    executionTimeMs;
    error;
    executedBy;
    startedAt;
    completedAt;
    expiresAt;
    static async auditPHIAccess(instance) {
        await (0, model_audit_hooks_service_1.createModelAuditHook)('ReportExecution', instance);
    }
};
exports.ReportExecution = ReportExecution;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(() => (0, uuid_1.v4)()),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ReportExecution.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.ForeignKey)(() => require('./report-schedule.model').ReportSchedule),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], ReportExecution.prototype, "scheduleId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => require('./report-schedule.model').ReportSchedule, {
        foreignKey: 'scheduleId',
        as: 'schedule',
    }),
    __metadata("design:type", Object)
], ReportExecution.prototype, "schedule", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ReportType)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], ReportExecution.prototype, "reportType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(OutputFormat)],
        },
        allowNull: false,
    }),
    __metadata("design:type", String)
], ReportExecution.prototype, "outputFormat", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB),
    __metadata("design:type", Object)
], ReportExecution.prototype, "parameters", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        validate: {
            isIn: [Object.values(ReportStatus)],
        },
        allowNull: false,
        defaultValue: ReportStatus.PENDING,
    }),
    __metadata("design:type", String)
], ReportExecution.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(500),
    }),
    __metadata("design:type", String)
], ReportExecution.prototype, "filePath", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(500),
    }),
    __metadata("design:type", String)
], ReportExecution.prototype, "downloadUrl", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BIGINT,
    }),
    __metadata("design:type", Number)
], ReportExecution.prototype, "fileSize", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], ReportExecution.prototype, "recordCount", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], ReportExecution.prototype, "executionTimeMs", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], ReportExecution.prototype, "error", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], ReportExecution.prototype, "executedBy", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], ReportExecution.prototype, "startedAt", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], ReportExecution.prototype, "completedAt", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], ReportExecution.prototype, "expiresAt", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ReportExecution]),
    __metadata("design:returntype", Promise)
], ReportExecution, "auditPHIAccess", null);
exports.ReportExecution = ReportExecution = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        active: {
            where: {
                deletedAt: null,
            },
            order: [['createdAt', 'DESC']],
        },
    })),
    (0, sequelize_typescript_1.Table)({
        tableName: 'report_executions',
        timestamps: false,
        indexes: [
            {
                fields: ['createdAt'],
                name: 'idx_report_execution_created_at',
            },
            {
                fields: ['updatedAt'],
                name: 'idx_report_execution_updated_at',
            },
        ],
    })
], ReportExecution);
//# sourceMappingURL=report-execution.model.js.map