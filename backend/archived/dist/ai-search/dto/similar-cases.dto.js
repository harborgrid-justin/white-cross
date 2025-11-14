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
exports.SimilarCasesDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SimilarCasesDto {
    patientId;
    symptoms;
    conditions;
    treatments;
    threshold;
    limit;
    static _OPENAPI_METADATA_FACTORY() {
        return { patientId: { required: false, type: () => String }, symptoms: { required: false, type: () => [String] }, conditions: { required: false, type: () => [String] }, treatments: { required: false, type: () => [String] }, threshold: { required: false, type: () => Number, minimum: 0, maximum: 1 }, limit: { required: false, type: () => Number, minimum: 1, maximum: 50 } };
    }
}
exports.SimilarCasesDto = SimilarCasesDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Patient ID to find similar cases',
        required: false,
        example: 'uuid-123',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SimilarCasesDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Symptoms to search for',
        required: false,
        example: ['fever', 'cough', 'fatigue'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SimilarCasesDto.prototype, "symptoms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Conditions to search for',
        required: false,
        example: ['respiratory infection'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SimilarCasesDto.prototype, "conditions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Treatments to search for',
        required: false,
        example: ['antibiotics', 'rest'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SimilarCasesDto.prototype, "treatments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Similarity threshold (0-1)',
        required: false,
        example: 0.8,
        default: 0.8,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], SimilarCasesDto.prototype, "threshold", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum number of results',
        required: false,
        example: 5,
        default: 5,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], SimilarCasesDto.prototype, "limit", void 0);
//# sourceMappingURL=similar-cases.dto.js.map