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
exports.ReportExecution = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const report_schedule_model_1 = require("./report-schedule.model");
const report_constants_1 = require("../constants/report.constants");
let ReportExecution = class ReportExecution extends sequelize_typescript_1.Model {
    scheduleId;
    schedule;
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
};
exports.ReportExecution = ReportExecution;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], ReportExecution.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => report_schedule_model_1.ReportSchedule),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], ReportExecution.prototype, "scheduleId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => report_schedule_model_1.ReportSchedule),
    __metadata("design:type", report_schedule_model_1.ReportSchedule)
], ReportExecution.prototype, "schedule", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(...Object.values(report_constants_1.ReportType)),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ReportExecution.prototype, "reportType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(...Object.values(report_constants_1.OutputFormat)),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ReportExecution.prototype, "outputFormat", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSONB,
        allowNull: true,
    }),
    __metadata("design:type", Object)
], ReportExecution.prototype, "parameters", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(report_constants_1.ReportStatus.PENDING),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM(...Object.values(report_constants_1.ReportStatus)),
        allowNull: false,
    }),
    __metadata("design:type", String)
], ReportExecution.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(500),
        allowNull: true,
    }),
    __metadata("design:type", String)
], ReportExecution.prototype, "filePath", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(500),
        allowNull: true,
    }),
    __metadata("design:type", String)
], ReportExecution.prototype, "downloadUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BIGINT,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], ReportExecution.prototype, "fileSize", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], ReportExecution.prototype, "recordCount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], ReportExecution.prototype, "executionTimeMs", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: true,
    }),
    __metadata("design:type", String)
], ReportExecution.prototype, "error", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], ReportExecution.prototype, "executedBy", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], ReportExecution.prototype, "startedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], ReportExecution.prototype, "completedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: true,
    }),
    __metadata("design:type", Date)
], ReportExecution.prototype, "expiresAt", void 0);
exports.ReportExecution = ReportExecution = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'report_executions',
        timestamps: false,
    })
], ReportExecution);
//# sourceMappingURL=report-execution.model.js.map