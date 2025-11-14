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
exports.BulkTransitionDto = exports.TransitionCriteriaDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class TransitionCriteriaDto {
    minimumAttendance;
    minimumGPA;
    requiredCredits;
    static _OPENAPI_METADATA_FACTORY() {
        return { minimumAttendance: { required: false, type: () => Number, minimum: 0, maximum: 100 }, minimumGPA: { required: false, type: () => Number, minimum: 0, maximum: 4 }, requiredCredits: { required: false, type: () => Object } };
    }
}
exports.TransitionCriteriaDto = TransitionCriteriaDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum attendance percentage required for promotion',
        minimum: 0,
        maximum: 100,
        default: 90,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], TransitionCriteriaDto.prototype, "minimumAttendance", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum GPA required for promotion',
        minimum: 0,
        maximum: 4,
        default: 2.0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(4),
    __metadata("design:type", Number)
], TransitionCriteriaDto.prototype, "minimumGPA", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Required credits by grade level',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], TransitionCriteriaDto.prototype, "requiredCredits", void 0);
class BulkTransitionDto {
    effectiveDate;
    dryRun;
    criteria;
    static _OPENAPI_METADATA_FACTORY() {
        return { effectiveDate: { required: true, type: () => Date }, dryRun: { required: false, type: () => Boolean }, criteria: { required: false, type: () => require("./bulk-transition.dto").TransitionCriteriaDto } };
    }
}
exports.BulkTransitionDto = BulkTransitionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date when grade transitions take effect',
        type: Date,
    }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], BulkTransitionDto.prototype, "effectiveDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to perform actual transitions or just simulation',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BulkTransitionDto.prototype, "dryRun", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Promotion criteria',
        type: TransitionCriteriaDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TransitionCriteriaDto),
    __metadata("design:type", TransitionCriteriaDto)
], BulkTransitionDto.prototype, "criteria", void 0);
//# sourceMappingURL=bulk-transition.dto.js.map