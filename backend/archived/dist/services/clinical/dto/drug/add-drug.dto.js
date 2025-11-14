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
exports.AddDrugDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class AddDrugDto {
    genericName;
    brandNames;
    rxnormCode;
    rxnormId;
    ndcCodes;
    drugClass;
    description;
    administrationRoute;
    controlledSubstanceSchedule;
    commonDoses;
    sideEffects;
    contraindications;
    warnings;
    fdaApproved;
    static _OPENAPI_METADATA_FACTORY() {
        return { genericName: { required: true, type: () => String, minLength: 1, maxLength: 255 }, brandNames: { required: false, type: () => [String], maxLength: 100 }, rxnormCode: { required: false, type: () => String, maxLength: 50 }, rxnormId: { required: false, type: () => String, maxLength: 50 }, ndcCodes: { required: false, type: () => [String], maxLength: 50 }, drugClass: { required: false, type: () => String, maxLength: 100 }, description: { required: false, type: () => String, maxLength: 2000 }, administrationRoute: { required: false, type: () => String, maxLength: 100 }, controlledSubstanceSchedule: { required: false, type: () => String, maxLength: 10 }, commonDoses: { required: false, type: () => Object }, sideEffects: { required: false, type: () => [String], maxLength: 200 }, contraindications: { required: false, type: () => [String], maxLength: 200 }, warnings: { required: false, type: () => [String], maxLength: 200 }, fdaApproved: { required: false, type: () => Boolean } };
    }
}
exports.AddDrugDto = AddDrugDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Generic drug name',
        example: 'Ibuprofen',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], AddDrugDto.prototype, "genericName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Brand names for the drug (each max 100 characters)',
        example: ['Advil', 'Motrin'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MaxLength)(100, {
        each: true,
        message: 'Each brand name cannot exceed 100 characters',
    }),
    __metadata("design:type", Array)
], AddDrugDto.prototype, "brandNames", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'RxNorm code',
        example: '5640',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], AddDrugDto.prototype, "rxnormCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'RxNorm ID',
        example: 'RXCUI:5640',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], AddDrugDto.prototype, "rxnormId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'NDC codes (each max 50 characters)',
        example: ['0573-0001-01', '0573-0001-05'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MaxLength)(50, {
        each: true,
        message: 'Each NDC code cannot exceed 50 characters',
    }),
    __metadata("design:type", Array)
], AddDrugDto.prototype, "ndcCodes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Drug classification',
        example: 'NSAID',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], AddDrugDto.prototype, "drugClass", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Drug description (maximum 2000 characters)',
        example: 'Nonsteroidal anti-inflammatory drug used for pain relief',
        maxLength: 2000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000, { message: 'Description cannot exceed 2000 characters' }),
    __metadata("design:type", String)
], AddDrugDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Administration route (maximum 100 characters)',
        example: 'oral',
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100, {
        message: 'Administration route cannot exceed 100 characters',
    }),
    __metadata("design:type", String)
], AddDrugDto.prototype, "administrationRoute", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Controlled substance schedule (I-V, maximum 10 characters)',
        example: null,
        maxLength: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10, {
        message: 'Controlled substance schedule cannot exceed 10 characters',
    }),
    __metadata("design:type", String)
], AddDrugDto.prototype, "controlledSubstanceSchedule", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Common dosing information',
        example: {
            adult: '200-400mg every 4-6 hours',
            pediatric: '10mg/kg every 6-8 hours',
        },
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], AddDrugDto.prototype, "commonDoses", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Known side effects (each max 200 characters)',
        example: ['Nausea', 'Stomach upset', 'Dizziness'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MaxLength)(200, {
        each: true,
        message: 'Each side effect cannot exceed 200 characters',
    }),
    __metadata("design:type", Array)
], AddDrugDto.prototype, "sideEffects", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Contraindications (each max 200 characters)',
        example: ['Active peptic ulcer disease', 'Known hypersensitivity'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MaxLength)(200, {
        each: true,
        message: 'Each contraindication cannot exceed 200 characters',
    }),
    __metadata("design:type", Array)
], AddDrugDto.prototype, "contraindications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Warnings and precautions (each max 200 characters)',
        example: ['Use caution in patients with renal impairment'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MaxLength)(200, {
        each: true,
        message: 'Each warning cannot exceed 200 characters',
    }),
    __metadata("design:type", Array)
], AddDrugDto.prototype, "warnings", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'FDA approval status',
        example: true,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AddDrugDto.prototype, "fdaApproved", void 0);
//# sourceMappingURL=add-drug.dto.js.map