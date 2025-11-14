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
exports.GetHealthMetricsDto = exports.CompareCohortsDto = exports.CompareCohort = exports.GetPredictiveInsightsDto = exports.GetAbsenceCorrelationDto = exports.GetImmunizationDashboardDto = exports.GetIncidentAnalyticsDto = exports.GetMedicationTrendsDto = exports.GetConditionTrendsDto = exports.GetPopulationSummaryDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const time_period_enum_1 = require("../enums/time-period.enum");
class GetPopulationSummaryDto {
    schoolId;
    period;
    customStart;
    customEnd;
    static _OPENAPI_METADATA_FACTORY() {
        return { schoolId: { required: true, type: () => String }, period: { required: true, enum: require("../enums/time-period.enum").TimePeriod }, customStart: { required: false, type: () => Date }, customEnd: { required: false, type: () => Date } };
    }
}
exports.GetPopulationSummaryDto = GetPopulationSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'School ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetPopulationSummaryDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: time_period_enum_1.TimePeriod, description: 'Time period for analytics' }),
    (0, class_validator_1.IsEnum)(time_period_enum_1.TimePeriod),
    __metadata("design:type", String)
], GetPopulationSummaryDto.prototype, "period", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Custom range start date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetPopulationSummaryDto.prototype, "customStart", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Custom range end date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetPopulationSummaryDto.prototype, "customEnd", void 0);
class GetConditionTrendsDto {
    schoolId;
    conditions;
    period;
    static _OPENAPI_METADATA_FACTORY() {
        return { schoolId: { required: true, type: () => String }, conditions: { required: false, type: () => [String] }, period: { required: false, enum: require("../enums/time-period.enum").TimePeriod } };
    }
}
exports.GetConditionTrendsDto = GetConditionTrendsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'School ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetConditionTrendsDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [String],
        description: 'Specific conditions to track',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], GetConditionTrendsDto.prototype, "conditions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: time_period_enum_1.TimePeriod,
        description: 'Time period',
        default: time_period_enum_1.TimePeriod.LAST_90_DAYS,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(time_period_enum_1.TimePeriod),
    __metadata("design:type", String)
], GetConditionTrendsDto.prototype, "period", void 0);
class GetMedicationTrendsDto {
    schoolId;
    period;
    static _OPENAPI_METADATA_FACTORY() {
        return { schoolId: { required: true, type: () => String }, period: { required: false, enum: require("../enums/time-period.enum").TimePeriod } };
    }
}
exports.GetMedicationTrendsDto = GetMedicationTrendsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'School ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetMedicationTrendsDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: time_period_enum_1.TimePeriod,
        description: 'Time period',
        default: time_period_enum_1.TimePeriod.LAST_30_DAYS,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(time_period_enum_1.TimePeriod),
    __metadata("design:type", String)
], GetMedicationTrendsDto.prototype, "period", void 0);
class GetIncidentAnalyticsDto {
    schoolId;
    period;
    static _OPENAPI_METADATA_FACTORY() {
        return { schoolId: { required: true, type: () => String }, period: { required: false, enum: require("../enums/time-period.enum").TimePeriod } };
    }
}
exports.GetIncidentAnalyticsDto = GetIncidentAnalyticsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'School ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetIncidentAnalyticsDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: time_period_enum_1.TimePeriod,
        description: 'Time period',
        default: time_period_enum_1.TimePeriod.LAST_90_DAYS,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(time_period_enum_1.TimePeriod),
    __metadata("design:type", String)
], GetIncidentAnalyticsDto.prototype, "period", void 0);
class GetImmunizationDashboardDto {
    schoolId;
    static _OPENAPI_METADATA_FACTORY() {
        return { schoolId: { required: true, type: () => String } };
    }
}
exports.GetImmunizationDashboardDto = GetImmunizationDashboardDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'School ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetImmunizationDashboardDto.prototype, "schoolId", void 0);
class GetAbsenceCorrelationDto {
    schoolId;
    period;
    static _OPENAPI_METADATA_FACTORY() {
        return { schoolId: { required: true, type: () => String }, period: { required: false, enum: require("../enums/time-period.enum").TimePeriod } };
    }
}
exports.GetAbsenceCorrelationDto = GetAbsenceCorrelationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'School ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetAbsenceCorrelationDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: time_period_enum_1.TimePeriod,
        description: 'Time period',
        default: time_period_enum_1.TimePeriod.LAST_30_DAYS,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(time_period_enum_1.TimePeriod),
    __metadata("design:type", String)
], GetAbsenceCorrelationDto.prototype, "period", void 0);
class GetPredictiveInsightsDto {
    schoolId;
    static _OPENAPI_METADATA_FACTORY() {
        return { schoolId: { required: true, type: () => String } };
    }
}
exports.GetPredictiveInsightsDto = GetPredictiveInsightsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'School ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetPredictiveInsightsDto.prototype, "schoolId", void 0);
class CompareCohort {
    name;
    filter;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, filter: { required: true, type: () => Object } };
    }
}
exports.CompareCohort = CompareCohort;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cohort name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompareCohort.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter criteria' }),
    __metadata("design:type", Object)
], CompareCohort.prototype, "filter", void 0);
class CompareCohortsDto {
    schoolId;
    cohorts;
    static _OPENAPI_METADATA_FACTORY() {
        return { schoolId: { required: true, type: () => String }, cohorts: { required: true, type: () => [require("./analytics-query.dto").CompareCohort] } };
    }
}
exports.CompareCohortsDto = CompareCohortsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'School ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompareCohortsDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CompareCohort], description: 'Cohort definitions' }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CompareCohortsDto.prototype, "cohorts", void 0);
class GetHealthMetricsDto {
    schoolId;
    period;
    static _OPENAPI_METADATA_FACTORY() {
        return { schoolId: { required: true, type: () => String }, period: { required: true, enum: require("../enums/time-period.enum").TimePeriod } };
    }
}
exports.GetHealthMetricsDto = GetHealthMetricsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'School ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetHealthMetricsDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: time_period_enum_1.TimePeriod, description: 'Time period' }),
    (0, class_validator_1.IsEnum)(time_period_enum_1.TimePeriod),
    __metadata("design:type", String)
], GetHealthMetricsDto.prototype, "period", void 0);
//# sourceMappingURL=analytics-query.dto.js.map