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
exports.ReportScheduleDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const report_constants_1 = require("../constants/report.constants");
class ReportScheduleDto {
    name;
    reportType;
    frequency;
    cronExpression;
    outputFormat = report_constants_1.OutputFormat.PDF;
    recipients;
    parameters;
    isActive = true;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, reportType: { required: true, enum: require("../constants/report.constants").ReportType }, frequency: { required: true, enum: require("../constants/report.constants").ScheduleFrequency }, cronExpression: { required: false, type: () => String }, outputFormat: { required: true, default: report_constants_1.OutputFormat.PDF, enum: require("../constants/report.constants").OutputFormat }, recipients: { required: true, type: () => [String], format: "email" }, parameters: { required: false, type: () => Object }, isActive: { required: false, type: () => Boolean, default: true } };
    }
}
exports.ReportScheduleDto = ReportScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the scheduled report',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportScheduleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: report_constants_1.ReportType,
        description: 'Type of report to generate',
    }),
    (0, class_validator_1.IsEnum)(report_constants_1.ReportType),
    __metadata("design:type", String)
], ReportScheduleDto.prototype, "reportType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: report_constants_1.ScheduleFrequency,
        description: 'Schedule frequency',
    }),
    (0, class_validator_1.IsEnum)(report_constants_1.ScheduleFrequency),
    __metadata("design:type", String)
], ReportScheduleDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom cron expression (required if frequency is CUSTOM)',
    }),
    (0, class_validator_1.ValidateIf)((o) => o.frequency === report_constants_1.ScheduleFrequency.CUSTOM),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReportScheduleDto.prototype, "cronExpression", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: report_constants_1.OutputFormat,
        description: 'Output format for generated reports',
        default: report_constants_1.OutputFormat.PDF,
    }),
    (0, class_validator_1.IsEnum)(report_constants_1.OutputFormat),
    __metadata("design:type", String)
], ReportScheduleDto.prototype, "outputFormat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        description: 'Email addresses to send reports to',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEmail)({}, { each: true }),
    __metadata("design:type", Array)
], ReportScheduleDto.prototype, "recipients", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Report parameters as JSON',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ReportScheduleDto.prototype, "parameters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether the schedule is active',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ReportScheduleDto.prototype, "isActive", void 0);
//# sourceMappingURL=report-schedule.dto.js.map