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
exports.ScreeningStatisticsQueryDto = exports.ScreeningScheduleQueryDto = exports.OverdueScreeningsQueryDto = exports.CreateReferralDto = exports.BatchScreeningDto = exports.CreateScreeningDto = exports.ScreeningResult = exports.ScreeningType = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
var ScreeningType;
(function (ScreeningType) {
    ScreeningType["VISION"] = "VISION";
    ScreeningType["HEARING"] = "HEARING";
    ScreeningType["BMI"] = "BMI";
    ScreeningType["DENTAL"] = "DENTAL";
    ScreeningType["SCOLIOSIS"] = "SCOLIOSIS";
    ScreeningType["TB"] = "TB";
    ScreeningType["DEVELOPMENTAL"] = "DEVELOPMENTAL";
})(ScreeningType || (exports.ScreeningType = ScreeningType = {}));
var ScreeningResult;
(function (ScreeningResult) {
    ScreeningResult["PASS"] = "PASS";
    ScreeningResult["FAIL"] = "FAIL";
    ScreeningResult["REFER"] = "REFER";
    ScreeningResult["INCOMPLETE"] = "INCOMPLETE";
})(ScreeningResult || (exports.ScreeningResult = ScreeningResult = {}));
class CreateScreeningDto {
    studentId;
    screeningType;
    screeningDate;
    result;
    screenerName;
    notes;
    followUpRequired;
    followUpNotes;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, format: "uuid" }, screeningType: { required: true, enum: require("./screening.dto").ScreeningType }, screeningDate: { required: true, type: () => String }, result: { required: true, enum: require("./screening.dto").ScreeningResult }, screenerName: { required: false, type: () => String }, notes: { required: false, type: () => String }, followUpRequired: { required: false, type: () => Boolean }, followUpNotes: { required: false, type: () => String } };
    }
}
exports.CreateScreeningDto = CreateScreeningDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student UUID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateScreeningDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of screening',
        enum: ScreeningType,
        example: ScreeningType.VISION,
    }),
    (0, class_validator_1.IsEnum)(ScreeningType),
    __metadata("design:type", String)
], CreateScreeningDto.prototype, "screeningType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date screening was performed',
        example: '2024-11-04',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateScreeningDto.prototype, "screeningDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Screening result',
        enum: ScreeningResult,
        example: ScreeningResult.PASS,
    }),
    (0, class_validator_1.IsEnum)(ScreeningResult),
    __metadata("design:type", String)
], CreateScreeningDto.prototype, "result", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Screener name',
        example: 'Nurse Johnson',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScreeningDto.prototype, "screenerName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Screening notes and observations',
        example: 'Vision 20/20 in both eyes',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScreeningDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Follow-up required',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateScreeningDto.prototype, "followUpRequired", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Follow-up notes',
        example: 'Refer to ophthalmologist',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScreeningDto.prototype, "followUpNotes", void 0);
class BatchScreeningDto {
    screenings;
    static _OPENAPI_METADATA_FACTORY() {
        return { screenings: { required: true, type: () => [require("./screening.dto").CreateScreeningDto] } };
    }
}
exports.BatchScreeningDto = BatchScreeningDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of screening records to import',
        type: [CreateScreeningDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateScreeningDto),
    __metadata("design:type", Array)
], BatchScreeningDto.prototype, "screenings", void 0);
class CreateReferralDto {
    providerName;
    reason;
    urgency;
    parentNotified;
    notificationDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { providerName: { required: true, type: () => String }, reason: { required: true, type: () => String }, urgency: { required: false, type: () => String }, parentNotified: { required: false, type: () => Boolean }, notificationDate: { required: false, type: () => String } };
    }
}
exports.CreateReferralDto = CreateReferralDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Referral provider name',
        example: 'Dr. Sarah Johnson, MD - Ophthalmology',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReferralDto.prototype, "providerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Referral reason',
        example: 'Failed vision screening - requires comprehensive eye exam',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReferralDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Referral urgency level',
        enum: ['ROUTINE', 'URGENT', 'EMERGENCY'],
        example: 'ROUTINE',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['ROUTINE', 'URGENT', 'EMERGENCY']),
    __metadata("design:type", String)
], CreateReferralDto.prototype, "urgency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Parent/guardian notified',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateReferralDto.prototype, "parentNotified", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Notification date',
        example: '2024-11-04',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateReferralDto.prototype, "notificationDate", void 0);
class OverdueScreeningsQueryDto {
    schoolId;
    gradeLevel;
    screeningType;
    static _OPENAPI_METADATA_FACTORY() {
        return { schoolId: { required: false, type: () => String, format: "uuid" }, gradeLevel: { required: false, type: () => String }, screeningType: { required: false, enum: require("./screening.dto").ScreeningType } };
    }
}
exports.OverdueScreeningsQueryDto = OverdueScreeningsQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'School ID to filter',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], OverdueScreeningsQueryDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Grade level to filter',
        example: '5',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OverdueScreeningsQueryDto.prototype, "gradeLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Screening type to filter',
        enum: ScreeningType,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ScreeningType),
    __metadata("design:type", String)
], OverdueScreeningsQueryDto.prototype, "screeningType", void 0);
class ScreeningScheduleQueryDto {
    gradeLevel;
    stateCode;
    static _OPENAPI_METADATA_FACTORY() {
        return { gradeLevel: { required: false, type: () => String }, stateCode: { required: false, type: () => String } };
    }
}
exports.ScreeningScheduleQueryDto = ScreeningScheduleQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Grade level',
        example: '5',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScreeningScheduleQueryDto.prototype, "gradeLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'State code for state-specific requirements',
        example: 'CA',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScreeningScheduleQueryDto.prototype, "stateCode", void 0);
class ScreeningStatisticsQueryDto {
    schoolId;
    startDate;
    endDate;
    screeningType;
    static _OPENAPI_METADATA_FACTORY() {
        return { schoolId: { required: false, type: () => String, format: "uuid" }, startDate: { required: false, type: () => String }, endDate: { required: false, type: () => String }, screeningType: { required: false, enum: require("./screening.dto").ScreeningType } };
    }
}
exports.ScreeningStatisticsQueryDto = ScreeningStatisticsQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'School ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ScreeningStatisticsQueryDto.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Start date for statistics',
        example: '2024-01-01',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ScreeningStatisticsQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'End date for statistics',
        example: '2024-12-31',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ScreeningStatisticsQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Screening type to filter',
        enum: ScreeningType,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ScreeningType),
    __metadata("design:type", String)
], ScreeningStatisticsQueryDto.prototype, "screeningType", void 0);
//# sourceMappingURL=screening.dto.js.map