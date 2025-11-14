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
exports.AcademicGenerateReportDto = exports.ReportFormat = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var ReportFormat;
(function (ReportFormat) {
    ReportFormat["PDF"] = "pdf";
    ReportFormat["HTML"] = "html";
    ReportFormat["JSON"] = "json";
})(ReportFormat || (exports.ReportFormat = ReportFormat = {}));
class AcademicGenerateReportDto {
    format = ReportFormat.JSON;
    includeHistory = true;
    includeAttendance = true;
    includeBehavior = true;
    includeAnalytics = false;
    static _OPENAPI_METADATA_FACTORY() {
        return { format: { required: false, default: ReportFormat.JSON, enum: require("./generate-report.dto").ReportFormat }, includeHistory: { required: false, type: () => Boolean, default: true }, includeAttendance: { required: false, type: () => Boolean, default: true }, includeBehavior: { required: false, type: () => Boolean, default: true }, includeAnalytics: { required: false, type: () => Boolean, default: false } };
    }
}
exports.AcademicGenerateReportDto = AcademicGenerateReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Report format',
        enum: ReportFormat,
        example: ReportFormat.PDF,
        required: false,
        default: ReportFormat.JSON,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ReportFormat, {
        message: 'Format must be one of: pdf, html, json',
    }),
    __metadata("design:type", String)
], AcademicGenerateReportDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Include grade history across all academic years',
        example: true,
        required: false,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AcademicGenerateReportDto.prototype, "includeHistory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Include attendance records',
        example: true,
        required: false,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AcademicGenerateReportDto.prototype, "includeAttendance", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Include behavior records',
        example: true,
        required: false,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AcademicGenerateReportDto.prototype, "includeBehavior", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Include performance analytics and trends',
        example: false,
        required: false,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AcademicGenerateReportDto.prototype, "includeAnalytics", void 0);
//# sourceMappingURL=generate-report.dto.js.map