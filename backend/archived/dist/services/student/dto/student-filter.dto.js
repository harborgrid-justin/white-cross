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
exports.StudentFilterDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const models_1 = require("../../../database/models");
class StudentFilterDto {
    page = 1;
    limit = 20;
    search;
    grade;
    isActive;
    nurseId;
    gender;
    hasAllergies;
    hasMedications;
    static _OPENAPI_METADATA_FACTORY() {
        return { page: { required: false, type: () => Number, default: 1, minimum: 1 }, limit: { required: false, type: () => Number, default: 20, minimum: 1, maximum: 100 }, search: { required: false, type: () => String }, grade: { required: false, type: () => String }, isActive: { required: false, type: () => Boolean }, nurseId: { required: false, type: () => String, format: "uuid" }, gender: { required: false, enum: require("../../../database/models/student.model").Gender }, hasAllergies: { required: false, type: () => Boolean }, hasMedications: { required: false, type: () => Boolean } };
    }
}
exports.StudentFilterDto = StudentFilterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Page number (1-based)',
        example: 1,
        required: false,
        default: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'Page must be an integer' }),
    (0, class_validator_1.Min)(1, { message: 'Page must be at least 1' }),
    __metadata("design:type", Number)
], StudentFilterDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of records per page',
        example: 20,
        required: false,
        default: 20,
        minimum: 1,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'Limit must be an integer' }),
    (0, class_validator_1.Min)(1, { message: 'Limit must be at least 1' }),
    (0, class_validator_1.Max)(100, { message: 'Limit cannot exceed 100' }),
    __metadata("design:type", Number)
], StudentFilterDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search query (searches firstName, lastName, studentNumber)',
        example: 'Emma',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StudentFilterDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by grade level',
        example: '3',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StudentFilterDto.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by active status',
        example: true,
        required: false,
        type: 'boolean',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return value;
    }),
    (0, class_validator_1.IsBoolean)({ message: 'IsActive must be a boolean' }),
    __metadata("design:type", Boolean)
], StudentFilterDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by assigned nurse UUID',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
        format: 'uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Nurse ID must be a valid UUID' }),
    __metadata("design:type", String)
], StudentFilterDto.prototype, "nurseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by gender',
        enum: models_1.Gender,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(models_1.Gender, {
        message: 'Gender must be MALE, FEMALE, OTHER, or PREFER_NOT_TO_SAY',
    }),
    __metadata("design:type", String)
], StudentFilterDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter students with allergies',
        example: true,
        required: false,
        type: 'boolean',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return value;
    }),
    (0, class_validator_1.IsBoolean)({ message: 'HasAllergies must be a boolean' }),
    __metadata("design:type", Boolean)
], StudentFilterDto.prototype, "hasAllergies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter students with active medications',
        example: true,
        required: false,
        type: 'boolean',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return value;
    }),
    (0, class_validator_1.IsBoolean)({ message: 'HasMedications must be a boolean' }),
    __metadata("design:type", Boolean)
], StudentFilterDto.prototype, "hasMedications", void 0);
//# sourceMappingURL=student-filter.dto.js.map