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
exports.OverdueVaccinationsQueryDto = exports.StateReportingExportDto = exports.VaccinationRatesQueryDto = exports.CheckContraindicationsDto = exports.SchoolEntryRequirementsDto = exports.GetCatchUpScheduleDto = exports.GetScheduleByAgeDto = exports.ReportFormat = exports.GradeLevel = exports.AgeUnit = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var AgeUnit;
(function (AgeUnit) {
    AgeUnit["MONTHS"] = "MONTHS";
    AgeUnit["YEARS"] = "YEARS";
})(AgeUnit || (exports.AgeUnit = AgeUnit = {}));
var GradeLevel;
(function (GradeLevel) {
    GradeLevel["PRE_K"] = "PRE_K";
    GradeLevel["KINDERGARTEN"] = "KINDERGARTEN";
    GradeLevel["GRADE_1"] = "GRADE_1";
    GradeLevel["GRADE_2"] = "GRADE_2";
    GradeLevel["GRADE_3"] = "GRADE_3";
    GradeLevel["GRADE_4"] = "GRADE_4";
    GradeLevel["GRADE_5"] = "GRADE_5";
    GradeLevel["GRADE_6"] = "GRADE_6";
    GradeLevel["GRADE_7"] = "GRADE_7";
    GradeLevel["GRADE_8"] = "GRADE_8";
    GradeLevel["GRADE_9"] = "GRADE_9";
    GradeLevel["GRADE_10"] = "GRADE_10";
    GradeLevel["GRADE_11"] = "GRADE_11";
    GradeLevel["GRADE_12"] = "GRADE_12";
})(GradeLevel || (exports.GradeLevel = GradeLevel = {}));
var ReportFormat;
(function (ReportFormat) {
    ReportFormat["CSV"] = "CSV";
    ReportFormat["HL7"] = "HL7";
    ReportFormat["JSON"] = "JSON";
    ReportFormat["XML"] = "XML";
})(ReportFormat || (exports.ReportFormat = ReportFormat = {}));
class GetScheduleByAgeDto {
    age;
    ageUnit;
    stateCode;
    static _OPENAPI_METADATA_FACTORY() {
        return { age: { required: true, type: () => Number, minimum: 0, maximum: 240 }, ageUnit: { required: true, enum: require("./schedule.dto").AgeUnit }, stateCode: { required: false, type: () => String, maxLength: 2 } };
    }
}
exports.GetScheduleByAgeDto = GetScheduleByAgeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Age value',
        example: 12,
        minimum: 0,
        maximum: 240,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(240),
    __metadata("design:type", Number)
], GetScheduleByAgeDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Age unit',
        enum: AgeUnit,
        example: AgeUnit.MONTHS,
        default: AgeUnit.MONTHS,
    }),
    (0, class_validator_1.IsEnum)(AgeUnit),
    __metadata("design:type", String)
], GetScheduleByAgeDto.prototype, "ageUnit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'State code for state-specific requirements',
        example: 'CA',
        required: false,
        maxLength: 2,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2),
    __metadata("design:type", String)
], GetScheduleByAgeDto.prototype, "stateCode", void 0);
class GetCatchUpScheduleDto {
    studentId;
    currentAgeMonths;
    includeAccelerated;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, format: "uuid" }, currentAgeMonths: { required: true, type: () => Number, minimum: 0, maximum: 240 }, includeAccelerated: { required: false, type: () => Boolean } };
    }
}
exports.GetCatchUpScheduleDto = GetCatchUpScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student UUID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], GetCatchUpScheduleDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current age in months',
        example: 84,
        minimum: 0,
        maximum: 240,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(240),
    __metadata("design:type", Number)
], GetCatchUpScheduleDto.prototype, "currentAgeMonths", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Include accelerated catch-up schedules',
        example: true,
        default: true,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetCatchUpScheduleDto.prototype, "includeAccelerated", void 0);
class SchoolEntryRequirementsDto {
    gradeLevel;
    stateCode;
    schoolYear;
    static _OPENAPI_METADATA_FACTORY() {
        return { gradeLevel: { required: true, enum: require("./schedule.dto").GradeLevel }, stateCode: { required: true, type: () => String, maxLength: 2 }, schoolYear: { required: false, type: () => String, maxLength: 10 } };
    }
}
exports.SchoolEntryRequirementsDto = SchoolEntryRequirementsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Grade level for entry requirements',
        enum: GradeLevel,
        example: GradeLevel.KINDERGARTEN,
    }),
    (0, class_validator_1.IsEnum)(GradeLevel),
    __metadata("design:type", String)
], SchoolEntryRequirementsDto.prototype, "gradeLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'State code (US)',
        example: 'CA',
        maxLength: 2,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2),
    __metadata("design:type", String)
], SchoolEntryRequirementsDto.prototype, "stateCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'School year',
        example: '2025-2026',
        required: false,
        maxLength: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], SchoolEntryRequirementsDto.prototype, "schoolYear", void 0);
class CheckContraindicationsDto {
    studentId;
    cvxCode;
    includePrecautions;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, format: "uuid" }, cvxCode: { required: true, type: () => String, maxLength: 10 }, includePrecautions: { required: false, type: () => Boolean } };
    }
}
exports.CheckContraindicationsDto = CheckContraindicationsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student UUID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CheckContraindicationsDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'CVX code of vaccine to check',
        example: '03',
        maxLength: 10,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], CheckContraindicationsDto.prototype, "cvxCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Include precautions (not absolute contraindications)',
        example: true,
        default: false,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CheckContraindicationsDto.prototype, "includePrecautions", void 0);
class VaccinationRatesQueryDto {
    schoolId;
    gradeLevel;
    vaccineName;
    startDate;
    endDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { schoolId: { required: false, type: () => String, format: "uuid" }, gradeLevel: { required: false, enum: require("./schedule.dto").GradeLevel }, vaccineName: { required: false, type: () => String, maxLength: 100 }, startDate: { required: false, type: () => Date }, endDate: { required: false, type: () => Date } };
    }
}
exports.VaccinationRatesQueryDto = VaccinationRatesQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'School ID to filter by',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], VaccinationRatesQueryDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Grade level to filter by',
        enum: GradeLevel,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(GradeLevel),
    __metadata("design:type", String)
], VaccinationRatesQueryDto.prototype, "gradeLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Specific vaccine to report on',
        example: 'MMR',
        required: false,
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], VaccinationRatesQueryDto.prototype, "vaccineName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Start date for date range',
        example: '2025-01-01',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], VaccinationRatesQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'End date for date range',
        example: '2025-12-31',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], VaccinationRatesQueryDto.prototype, "endDate", void 0);
class StateReportingExportDto {
    stateCode;
    format;
    schoolIds;
    startDate;
    endDate;
    compliantOnly;
    includeExemptions;
    static _OPENAPI_METADATA_FACTORY() {
        return { stateCode: { required: true, type: () => String, maxLength: 2 }, format: { required: true, enum: require("./schedule.dto").ReportFormat }, schoolIds: { required: false, type: () => [String], format: "uuid" }, startDate: { required: true, type: () => Date }, endDate: { required: true, type: () => Date }, compliantOnly: { required: false, type: () => Boolean }, includeExemptions: { required: false, type: () => Boolean } };
    }
}
exports.StateReportingExportDto = StateReportingExportDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'State code for reporting',
        example: 'CA',
        maxLength: 2,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2),
    __metadata("design:type", String)
], StateReportingExportDto.prototype, "stateCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Report format',
        enum: ReportFormat,
        example: ReportFormat.HL7,
    }),
    (0, class_validator_1.IsEnum)(ReportFormat),
    __metadata("design:type", String)
], StateReportingExportDto.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'School IDs to include (empty = all schools)',
        example: ['123e4567-e89b-12d3-a456-426614174000'],
        required: false,
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], StateReportingExportDto.prototype, "schoolIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Start date for report',
        example: '2025-01-01',
    }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], StateReportingExportDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'End date for report',
        example: '2025-12-31',
    }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], StateReportingExportDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Include only compliant students',
        example: false,
        default: false,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], StateReportingExportDto.prototype, "compliantOnly", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Include exemptions in report',
        example: true,
        default: true,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], StateReportingExportDto.prototype, "includeExemptions", void 0);
class OverdueVaccinationsQueryDto {
    schoolId;
    gradeLevel;
    daysOverdue;
    vaccineName;
    static _OPENAPI_METADATA_FACTORY() {
        return { schoolId: { required: false, type: () => String, format: "uuid" }, gradeLevel: { required: false, enum: require("./schedule.dto").GradeLevel }, daysOverdue: { required: false, type: () => Number, minimum: 0 }, vaccineName: { required: false, type: () => String, maxLength: 100 } };
    }
}
exports.OverdueVaccinationsQueryDto = OverdueVaccinationsQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'School ID to filter by',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], OverdueVaccinationsQueryDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Grade level to filter by',
        enum: GradeLevel,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(GradeLevel),
    __metadata("design:type", String)
], OverdueVaccinationsQueryDto.prototype, "gradeLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Days overdue threshold (default: 0)',
        example: 30,
        minimum: 0,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], OverdueVaccinationsQueryDto.prototype, "daysOverdue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Specific vaccine name',
        example: 'MMR',
        required: false,
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], OverdueVaccinationsQueryDto.prototype, "vaccineName", void 0);
//# sourceMappingURL=schedule.dto.js.map