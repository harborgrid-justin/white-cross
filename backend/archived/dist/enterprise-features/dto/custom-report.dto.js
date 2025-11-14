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
exports.ReportDefinitionResponseDto = exports.ExportReportDto = exports.ExecuteReportDto = exports.CreateReportDefinitionDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateReportDefinitionDto {
    name;
    dataSource;
    fields;
    filters;
    grouping;
    sorting;
    visualization;
    schedule;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, dataSource: { required: true, type: () => String }, fields: { required: true, type: () => [String] }, filters: { required: true, type: () => [Object] }, grouping: { required: true, type: () => [String] }, sorting: { required: true, type: () => [String] }, visualization: { required: true, type: () => Object }, schedule: { required: false, type: () => ({ frequency: { required: true, type: () => Object }, recipients: { required: true, type: () => [String] } }) } };
    }
}
exports.CreateReportDefinitionDto = CreateReportDefinitionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Report name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReportDefinitionDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Data source identifier' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReportDefinitionDto.prototype, "dataSource", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fields to include in report', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateReportDefinitionDto.prototype, "fields", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter criteria' }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateReportDefinitionDto.prototype, "filters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Grouping fields', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateReportDefinitionDto.prototype, "grouping", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sorting fields', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateReportDefinitionDto.prototype, "sorting", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['table', 'chart', 'graph'],
        description: 'Visualization type',
    }),
    (0, class_validator_1.IsEnum)(['table', 'chart', 'graph']),
    __metadata("design:type", String)
], CreateReportDefinitionDto.prototype, "visualization", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Schedule configuration' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateReportDefinitionDto.prototype, "schedule", void 0);
class ExecuteReportDto {
    reportId;
    static _OPENAPI_METADATA_FACTORY() {
        return { reportId: { required: true, type: () => String } };
    }
}
exports.ExecuteReportDto = ExecuteReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Report ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExecuteReportDto.prototype, "reportId", void 0);
class ExportReportDto {
    reportId;
    format;
    static _OPENAPI_METADATA_FACTORY() {
        return { reportId: { required: true, type: () => String }, format: { required: true, type: () => Object } };
    }
}
exports.ExportReportDto = ExportReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Report ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExportReportDto.prototype, "reportId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['pdf', 'excel', 'csv'], description: 'Export format' }),
    (0, class_validator_1.IsEnum)(['pdf', 'excel', 'csv']),
    __metadata("design:type", String)
], ExportReportDto.prototype, "format", void 0);
class ReportDefinitionResponseDto {
    id;
    name;
    dataSource;
    fields;
    filters;
    grouping;
    sorting;
    visualization;
    schedule;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, dataSource: { required: true, type: () => String }, fields: { required: true, type: () => [String] }, filters: { required: true, type: () => [Object] }, grouping: { required: true, type: () => [String] }, sorting: { required: true, type: () => [String] }, visualization: { required: true, type: () => Object }, schedule: { required: false, type: () => ({ frequency: { required: true, type: () => Object }, recipients: { required: true, type: () => [String] } }) } };
    }
}
exports.ReportDefinitionResponseDto = ReportDefinitionResponseDto;
//# sourceMappingURL=custom-report.dto.js.map