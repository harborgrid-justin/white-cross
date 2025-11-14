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
exports.HealthRiskScoreDto = exports.RiskLevel = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const risk_factor_dto_1 = require("./risk-factor.dto");
var RiskLevel;
(function (RiskLevel) {
    RiskLevel["LOW"] = "low";
    RiskLevel["MODERATE"] = "moderate";
    RiskLevel["HIGH"] = "high";
    RiskLevel["CRITICAL"] = "critical";
})(RiskLevel || (exports.RiskLevel = RiskLevel = {}));
class HealthRiskScoreDto {
    studentId;
    overallScore;
    riskLevel;
    factors;
    recommendations;
    calculatedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, format: "uuid" }, overallScore: { required: true, type: () => Number, minimum: 0, maximum: 100 }, riskLevel: { required: true, enum: require("./health-risk-score.dto").RiskLevel }, factors: { required: true, type: () => [require("./risk-factor.dto").RiskFactorDto] }, recommendations: { required: true, type: () => [String] }, calculatedAt: { required: true, type: () => Date } };
    }
}
exports.HealthRiskScoreDto = HealthRiskScoreDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the student',
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], HealthRiskScoreDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Overall risk score (0-100, higher = higher risk)',
        example: 65,
        minimum: 0,
        maximum: 100,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], HealthRiskScoreDto.prototype, "overallScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Categorized risk level',
        enum: RiskLevel,
        example: RiskLevel.HIGH,
    }),
    (0, class_validator_1.IsEnum)(RiskLevel),
    __metadata("design:type", String)
], HealthRiskScoreDto.prototype, "riskLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of contributing risk factors',
        type: [risk_factor_dto_1.RiskFactorDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => risk_factor_dto_1.RiskFactorDto),
    __metadata("design:type", Array)
], HealthRiskScoreDto.prototype, "factors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Recommended actions based on risk assessment',
        example: [
            'Schedule immediate consultation with school nurse',
            'Ensure emergency action plans are up to date',
        ],
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], HealthRiskScoreDto.prototype, "recommendations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when assessment was calculated',
        example: '2024-10-28T02:24:00Z',
    }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], HealthRiskScoreDto.prototype, "calculatedAt", void 0);
//# sourceMappingURL=health-risk-score.dto.js.map