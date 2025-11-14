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
exports.AdvancedSearchCriteriaDto = exports.TimeframeDto = exports.BehavioralCriteriaDto = exports.MedicalCriteriaDto = exports.DemographicsDto = exports.AgeRangeDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class AgeRangeDto {
    min;
    max;
    static _OPENAPI_METADATA_FACTORY() {
        return { min: { required: false, type: () => Number, minimum: 0 }, max: { required: false, type: () => Number, maximum: 150 } };
    }
}
exports.AgeRangeDto = AgeRangeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Minimum age', required: false, example: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], AgeRangeDto.prototype, "min", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Maximum age', required: false, example: 18 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Max)(150),
    __metadata("design:type", Number)
], AgeRangeDto.prototype, "max", void 0);
class DemographicsDto {
    ageRange;
    gender;
    grade;
    static _OPENAPI_METADATA_FACTORY() {
        return { ageRange: { required: false, type: () => require("./advanced-search.dto").AgeRangeDto }, gender: { required: false, type: () => String }, grade: { required: false, type: () => String } };
    }
}
exports.DemographicsDto = DemographicsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Age range filter',
        required: false,
        type: AgeRangeDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AgeRangeDto),
    __metadata("design:type", AgeRangeDto)
], DemographicsDto.prototype, "ageRange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Gender filter',
        required: false,
        example: 'female',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DemographicsDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Grade filter', required: false, example: '10' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DemographicsDto.prototype, "grade", void 0);
class MedicalCriteriaDto {
    conditions;
    medications;
    allergies;
    riskFactors;
    static _OPENAPI_METADATA_FACTORY() {
        return { conditions: { required: false, type: () => [String] }, medications: { required: false, type: () => [String] }, allergies: { required: false, type: () => [String] }, riskFactors: { required: false, type: () => [String] } };
    }
}
exports.MedicalCriteriaDto = MedicalCriteriaDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Medical conditions',
        required: false,
        example: ['asthma', 'diabetes'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], MedicalCriteriaDto.prototype, "conditions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Medications',
        required: false,
        example: ['albuterol', 'insulin'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], MedicalCriteriaDto.prototype, "medications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Allergies',
        required: false,
        example: ['peanuts', 'penicillin'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], MedicalCriteriaDto.prototype, "allergies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Risk factors',
        required: false,
        example: ['obesity', 'hypertension'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], MedicalCriteriaDto.prototype, "riskFactors", void 0);
class BehavioralCriteriaDto {
    frequentVisitor;
    complianceLevel;
    appointmentHistory;
    static _OPENAPI_METADATA_FACTORY() {
        return { frequentVisitor: { required: false, type: () => Boolean }, complianceLevel: { required: false, type: () => String }, appointmentHistory: { required: false, type: () => String } };
    }
}
exports.BehavioralCriteriaDto = BehavioralCriteriaDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter for frequent visitors',
        required: false,
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BehavioralCriteriaDto.prototype, "frequentVisitor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Compliance level',
        required: false,
        example: 'high',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BehavioralCriteriaDto.prototype, "complianceLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Appointment history pattern',
        required: false,
        example: 'regular',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BehavioralCriteriaDto.prototype, "appointmentHistory", void 0);
class TimeframeDto {
    start;
    end;
    static _OPENAPI_METADATA_FACTORY() {
        return { start: { required: false, type: () => Date }, end: { required: false, type: () => Date } };
    }
}
exports.TimeframeDto = TimeframeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date', required: false, type: Date }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], TimeframeDto.prototype, "start", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date', required: false, type: Date }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], TimeframeDto.prototype, "end", void 0);
class AdvancedSearchCriteriaDto {
    demographics;
    medical;
    behavioral;
    timeframe;
    limit;
    userId;
    static _OPENAPI_METADATA_FACTORY() {
        return { demographics: { required: false, type: () => require("./advanced-search.dto").DemographicsDto }, medical: { required: false, type: () => require("./advanced-search.dto").MedicalCriteriaDto }, behavioral: { required: false, type: () => require("./advanced-search.dto").BehavioralCriteriaDto }, timeframe: { required: false, type: () => require("./advanced-search.dto").TimeframeDto }, limit: { required: false, type: () => Number, minimum: 1, maximum: 100 }, userId: { required: true, type: () => String } };
    }
}
exports.AdvancedSearchCriteriaDto = AdvancedSearchCriteriaDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Demographic criteria',
        required: false,
        type: DemographicsDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DemographicsDto),
    __metadata("design:type", DemographicsDto)
], AdvancedSearchCriteriaDto.prototype, "demographics", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Medical criteria',
        required: false,
        type: MedicalCriteriaDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => MedicalCriteriaDto),
    __metadata("design:type", MedicalCriteriaDto)
], AdvancedSearchCriteriaDto.prototype, "medical", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Behavioral criteria',
        required: false,
        type: BehavioralCriteriaDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BehavioralCriteriaDto),
    __metadata("design:type", BehavioralCriteriaDto)
], AdvancedSearchCriteriaDto.prototype, "behavioral", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timeframe filter',
        required: false,
        type: TimeframeDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TimeframeDto),
    __metadata("design:type", TimeframeDto)
], AdvancedSearchCriteriaDto.prototype, "timeframe", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Result limit',
        required: false,
        example: 20,
        default: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], AdvancedSearchCriteriaDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID making the search', required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdvancedSearchCriteriaDto.prototype, "userId", void 0);
//# sourceMappingURL=advanced-search.dto.js.map