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
exports.GetMedicationAdherenceQueryDto = exports.GetMedicationUsageQueryDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class GetMedicationUsageQueryDto {
    schoolId;
    startDate;
    endDate;
    medicationName;
    category;
    includeAdherenceRate;
    groupBy;
    static _OPENAPI_METADATA_FACTORY() {
        return { schoolId: { required: false, type: () => String }, startDate: { required: true, type: () => Date }, endDate: { required: true, type: () => Date }, medicationName: { required: false, type: () => String }, category: { required: false, type: () => String }, includeAdherenceRate: { required: false, type: () => Boolean }, groupBy: { required: false, type: () => String } };
    }
}
exports.GetMedicationUsageQueryDto = GetMedicationUsageQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'School ID', default: 'default-school' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetMedicationUsageQueryDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date for medication usage analysis' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetMedicationUsageQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date for medication usage analysis' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetMedicationUsageQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by medication name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetMedicationUsageQueryDto.prototype, "medicationName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by medication category' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetMedicationUsageQueryDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include adherence rate calculation',
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], GetMedicationUsageQueryDto.prototype, "includeAdherenceRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Group results by',
        enum: ['MEDICATION', 'CATEGORY', 'STUDENT', 'TIME'],
        default: 'MEDICATION',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetMedicationUsageQueryDto.prototype, "groupBy", void 0);
class GetMedicationAdherenceQueryDto {
    schoolId;
    startDate;
    endDate;
    studentId;
    medicationId;
    threshold;
    static _OPENAPI_METADATA_FACTORY() {
        return { schoolId: { required: false, type: () => String }, startDate: { required: true, type: () => Date }, endDate: { required: true, type: () => Date }, studentId: { required: false, type: () => String }, medicationId: { required: false, type: () => String }, threshold: { required: false, type: () => Number } };
    }
}
exports.GetMedicationAdherenceQueryDto = GetMedicationAdherenceQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'School ID', default: 'default-school' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetMedicationAdherenceQueryDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date for adherence analysis' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetMedicationAdherenceQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date for adherence analysis' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], GetMedicationAdherenceQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by specific student ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetMedicationAdherenceQueryDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by specific medication ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetMedicationAdherenceQueryDto.prototype, "medicationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Adherence threshold percentage',
        default: 80,
        minimum: 0,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], GetMedicationAdherenceQueryDto.prototype, "threshold", void 0);
//# sourceMappingURL=medication-analytics.dto.js.map