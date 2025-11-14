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
exports.AnalyticsQueryDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class AnalyticsQueryDto {
    includeTrends = true;
    includeRecommendations = true;
    includeAttendanceTrends = true;
    includeBehaviorTrends = false;
    academicYear;
    compareWithAverage = false;
    static _OPENAPI_METADATA_FACTORY() {
        return { includeTrends: { required: false, type: () => Boolean, default: true }, includeRecommendations: { required: false, type: () => Boolean, default: true }, includeAttendanceTrends: { required: false, type: () => Boolean, default: true }, includeBehaviorTrends: { required: false, type: () => Boolean, default: false }, academicYear: { required: false, type: () => String, maxLength: 20 }, compareWithAverage: { required: false, type: () => Boolean, default: false } };
    }
}
exports.AnalyticsQueryDto = AnalyticsQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Include GPA and grade trend analysis',
        example: true,
        required: false,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AnalyticsQueryDto.prototype, "includeTrends", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Include academic recommendations based on performance',
        example: true,
        required: false,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AnalyticsQueryDto.prototype, "includeRecommendations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Include attendance trend analysis',
        example: true,
        required: false,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AnalyticsQueryDto.prototype, "includeAttendanceTrends", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Include behavior trend analysis',
        example: false,
        required: false,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AnalyticsQueryDto.prototype, "includeBehaviorTrends", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Academic year to analyze (leave empty for all years)',
        example: '2024-2025',
        required: false,
        maxLength: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20, { message: 'Academic year cannot exceed 20 characters' }),
    __metadata("design:type", String)
], AnalyticsQueryDto.prototype, "academicYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Compare with class or grade average',
        example: false,
        required: false,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AnalyticsQueryDto.prototype, "compareWithAverage", void 0);
//# sourceMappingURL=analytics-query.dto.js.map