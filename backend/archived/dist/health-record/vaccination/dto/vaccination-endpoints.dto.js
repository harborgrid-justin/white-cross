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
exports.BatchImportResponseDto = exports.DueVaccinationsResponseDto = exports.ComplianceReportQueryDto = exports.CreateExemptionDto = exports.BatchVaccinationDto = exports.CDCScheduleQueryDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const create_vaccination_dto_1 = require("./create-vaccination.dto");
class CDCScheduleQueryDto {
    ageOrGrade;
    vaccineType;
    static _OPENAPI_METADATA_FACTORY() {
        return { ageOrGrade: { required: false, type: () => String }, vaccineType: { required: false, type: () => String } };
    }
}
exports.CDCScheduleQueryDto = CDCScheduleQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Age in months or grade level',
        example: '24',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CDCScheduleQueryDto.prototype, "ageOrGrade", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Vaccine type to filter schedule',
        example: 'DTaP',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CDCScheduleQueryDto.prototype, "vaccineType", void 0);
class BatchVaccinationDto {
    vaccinations;
    static _OPENAPI_METADATA_FACTORY() {
        return { vaccinations: { required: true, type: () => [require("./create-vaccination.dto").CreateVaccinationDto] } };
    }
}
exports.BatchVaccinationDto = BatchVaccinationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of vaccination records to import',
        type: [create_vaccination_dto_1.CreateVaccinationDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_vaccination_dto_1.CreateVaccinationDto),
    __metadata("design:type", Array)
], BatchVaccinationDto.prototype, "vaccinations", void 0);
class CreateExemptionDto {
    studentId;
    vaccineName;
    exemptionType;
    reason;
    providerName;
    expirationDate;
    documentationPath;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, format: "uuid" }, vaccineName: { required: true, type: () => String }, exemptionType: { required: true, type: () => String }, reason: { required: true, type: () => String }, providerName: { required: false, type: () => String }, expirationDate: { required: false, type: () => String }, documentationPath: { required: false, type: () => String } };
    }
}
exports.CreateExemptionDto = CreateExemptionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student UUID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateExemptionDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Vaccine name or type being exempted',
        example: 'MMR',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExemptionDto.prototype, "vaccineName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Exemption reason',
        enum: ['MEDICAL', 'RELIGIOUS', 'PHILOSOPHICAL', 'PERSONAL'],
        example: 'MEDICAL',
    }),
    (0, class_validator_1.IsEnum)(['MEDICAL', 'RELIGIOUS', 'PHILOSOPHICAL', 'PERSONAL']),
    __metadata("design:type", String)
], CreateExemptionDto.prototype, "exemptionType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Detailed reason for exemption',
        example: 'Severe allergic reaction to vaccine components',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExemptionDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Provider name who authorized medical exemption',
        example: 'Dr. Sarah Johnson',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExemptionDto.prototype, "providerName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Exemption expiration date',
        example: '2025-12-31',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateExemptionDto.prototype, "expirationDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Supporting documentation file path or reference',
        example: 'exemptions/medical-550e8400.pdf',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExemptionDto.prototype, "documentationPath", void 0);
class ComplianceReportQueryDto {
    schoolId;
    gradeLevel;
    vaccineType;
    onlyNonCompliant;
    static _OPENAPI_METADATA_FACTORY() {
        return { schoolId: { required: false, type: () => String, format: "uuid" }, gradeLevel: { required: false, type: () => String }, vaccineType: { required: false, type: () => String }, onlyNonCompliant: { required: false, type: () => Boolean } };
    }
}
exports.ComplianceReportQueryDto = ComplianceReportQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'School ID to filter report',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ComplianceReportQueryDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Grade level to filter report',
        example: '5',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ComplianceReportQueryDto.prototype, "gradeLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Vaccine type to filter report',
        example: 'MMR',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ComplianceReportQueryDto.prototype, "vaccineType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include only non-compliant students',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ComplianceReportQueryDto.prototype, "onlyNonCompliant", void 0);
class DueVaccinationsResponseDto {
    studentId;
    studentName;
    dueVaccinations;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String }, studentName: { required: true, type: () => String }, dueVaccinations: { required: true } };
    }
}
exports.DueVaccinationsResponseDto = DueVaccinationsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    __metadata("design:type", String)
], DueVaccinationsResponseDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student full name',
        example: 'John Doe',
    }),
    __metadata("design:type", String)
], DueVaccinationsResponseDto.prototype, "studentName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of due or overdue vaccinations',
        type: 'array',
    }),
    __metadata("design:type", Array)
], DueVaccinationsResponseDto.prototype, "dueVaccinations", void 0);
class BatchImportResponseDto {
    successCount;
    errorCount;
    importedIds;
    errors;
    static _OPENAPI_METADATA_FACTORY() {
        return { successCount: { required: true, type: () => Number }, errorCount: { required: true, type: () => Number }, importedIds: { required: true, type: () => [String] }, errors: { required: true, type: () => [String] } };
    }
}
exports.BatchImportResponseDto = BatchImportResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of successfully imported vaccinations',
        example: 45,
    }),
    __metadata("design:type", Number)
], BatchImportResponseDto.prototype, "successCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of failed imports',
        example: 2,
    }),
    __metadata("design:type", Number)
], BatchImportResponseDto.prototype, "errorCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of imported vaccination IDs',
        type: [String],
    }),
    __metadata("design:type", Array)
], BatchImportResponseDto.prototype, "importedIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of error messages for failed imports',
        type: [String],
    }),
    __metadata("design:type", Array)
], BatchImportResponseDto.prototype, "errors", void 0);
//# sourceMappingURL=vaccination-endpoints.dto.js.map