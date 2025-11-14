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
exports.GetSchoolMetricsQueryDto = exports.GetSchoolMetricsParamDto = exports.GetStudentHealthMetricsQueryDto = exports.GetStudentHealthMetricsParamDto = exports.GetHealthTrendsQueryDto = exports.GetHealthMetricsQueryDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class GetHealthMetricsQueryDto {
    schoolId;
    districtId;
    startDate;
    endDate;
    metricTypes;
    aggregationLevel;
    compareWithPrevious;
    static _OPENAPI_METADATA_FACTORY() {
        return { schoolId: { required: false, type: () => String }, districtId: { required: false, type: () => String }, startDate: { required: true, type: () => Date }, endDate: { required: true, type: () => Date }, metricTypes: { required: false, type: () => [String] }, aggregationLevel: { required: false, type: () => String }, compareWithPrevious: { required: false, type: () => Boolean } };
    }
}
exports.GetHealthMetricsQueryDto = GetHealthMetricsQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'School ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetHealthMetricsQueryDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'District ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetHealthMetricsQueryDto.prototype, "districtId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date for metrics' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetHealthMetricsQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date for metrics' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetHealthMetricsQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: 'Specific metric types to retrieve',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], GetHealthMetricsQueryDto.prototype, "metricTypes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Aggregation level',
        enum: ['SCHOOL', 'DISTRICT', 'GRADE'],
        default: 'SCHOOL',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetHealthMetricsQueryDto.prototype, "aggregationLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include comparison with previous period',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], GetHealthMetricsQueryDto.prototype, "compareWithPrevious", void 0);
class GetHealthTrendsQueryDto {
    schoolId;
    districtId;
    startDate;
    endDate;
    timePeriod;
    metrics;
    includeForecasting;
    static _OPENAPI_METADATA_FACTORY() {
        return { schoolId: { required: false, type: () => String }, districtId: { required: false, type: () => String }, startDate: { required: true, type: () => Date }, endDate: { required: true, type: () => Date }, timePeriod: { required: false, type: () => String }, metrics: { required: false, type: () => [String] }, includeForecasting: { required: false, type: () => Boolean } };
    }
}
exports.GetHealthTrendsQueryDto = GetHealthTrendsQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'School ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetHealthTrendsQueryDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'District ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetHealthTrendsQueryDto.prototype, "districtId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date for trend analysis' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetHealthTrendsQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date for trend analysis' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetHealthTrendsQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Time period granularity',
        enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'],
        default: 'MONTHLY',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetHealthTrendsQueryDto.prototype, "timePeriod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: 'Specific metrics to track',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], GetHealthTrendsQueryDto.prototype, "metrics", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include predictive forecasting',
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], GetHealthTrendsQueryDto.prototype, "includeForecasting", void 0);
class GetStudentHealthMetricsParamDto {
    studentId;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String } };
    }
}
exports.GetStudentHealthMetricsParamDto = GetStudentHealthMetricsParamDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Student ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetStudentHealthMetricsParamDto.prototype, "studentId", void 0);
class GetStudentHealthMetricsQueryDto {
    startDate;
    endDate;
    includeHistory;
    static _OPENAPI_METADATA_FACTORY() {
        return { startDate: { required: false, type: () => Date }, endDate: { required: false, type: () => Date }, includeHistory: { required: false, type: () => Boolean } };
    }
}
exports.GetStudentHealthMetricsQueryDto = GetStudentHealthMetricsQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Start date for student metrics' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetStudentHealthMetricsQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End date for student metrics' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetStudentHealthMetricsQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include historical data',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], GetStudentHealthMetricsQueryDto.prototype, "includeHistory", void 0);
class GetSchoolMetricsParamDto {
    schoolId;
    static _OPENAPI_METADATA_FACTORY() {
        return { schoolId: { required: true, type: () => String } };
    }
}
exports.GetSchoolMetricsParamDto = GetSchoolMetricsParamDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'School ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetSchoolMetricsParamDto.prototype, "schoolId", void 0);
class GetSchoolMetricsQueryDto {
    startDate;
    endDate;
    gradeLevel;
    includeComparisons;
    static _OPENAPI_METADATA_FACTORY() {
        return { startDate: { required: true, type: () => Date }, endDate: { required: true, type: () => Date }, gradeLevel: { required: false, type: () => String }, includeComparisons: { required: false, type: () => Boolean } };
    }
}
exports.GetSchoolMetricsQueryDto = GetSchoolMetricsQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date for school metrics' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetSchoolMetricsQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date for school metrics' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetSchoolMetricsQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by grade level' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetSchoolMetricsQueryDto.prototype, "gradeLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include comparisons with other schools',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], GetSchoolMetricsQueryDto.prototype, "includeComparisons", void 0);
//# sourceMappingURL=health-metrics.dto.js.map