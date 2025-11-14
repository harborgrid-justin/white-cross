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
exports.ExportOptionsDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const report_constants_1 = require("../constants/report.constants");
class ExportOptionsDto {
    reportType;
    format;
    includeCharts = false;
    includeSummary = true;
    pageOrientation = 'portrait';
    columns;
    data;
    static _OPENAPI_METADATA_FACTORY() {
        return { reportType: { required: true, enum: require("../constants/report.constants").ReportType }, format: { required: true, enum: require("../constants/report.constants").OutputFormat }, includeCharts: { required: false, type: () => Boolean, default: false }, includeSummary: { required: false, type: () => Boolean, default: true }, pageOrientation: { required: false, type: () => Object, default: "portrait" }, columns: { required: false, type: () => [String] }, data: { required: false, type: () => Object } };
    }
}
exports.ExportOptionsDto = ExportOptionsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: report_constants_1.ReportType,
        description: 'Type of report to export',
    }),
    (0, class_validator_1.IsEnum)(report_constants_1.ReportType),
    __metadata("design:type", String)
], ExportOptionsDto.prototype, "reportType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: report_constants_1.OutputFormat,
        description: 'Export format',
    }),
    (0, class_validator_1.IsEnum)(report_constants_1.OutputFormat),
    __metadata("design:type", String)
], ExportOptionsDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include charts in export (PDF only)',
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ExportOptionsDto.prototype, "includeCharts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include executive summary',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ExportOptionsDto.prototype, "includeSummary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page orientation for PDF',
        enum: ['portrait', 'landscape'],
        default: 'portrait',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExportOptionsDto.prototype, "pageOrientation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Specific columns to include (CSV/Excel)',
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ExportOptionsDto.prototype, "columns", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Report data as JSON object',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], ExportOptionsDto.prototype, "data", void 0);
//# sourceMappingURL=export-options.dto.js.map