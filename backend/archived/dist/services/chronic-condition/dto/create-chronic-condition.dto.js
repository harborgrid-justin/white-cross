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
exports.ChronicConditionCreateDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const condition_status_enum_1 = require("../enums/condition-status.enum");
class ChronicConditionCreateDto {
    studentId;
    healthRecordId;
    condition;
    icdCode;
    diagnosedDate;
    diagnosedBy;
    status;
    severity;
    notes;
    carePlan;
    medications;
    restrictions;
    triggers;
    accommodations;
    emergencyProtocol;
    lastReviewDate;
    nextReviewDate;
    requiresIEP;
    requires504;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, format: "uuid" }, healthRecordId: { required: false, type: () => String, format: "uuid" }, condition: { required: true, type: () => String, minLength: 2, maxLength: 200 }, icdCode: { required: false, type: () => String, maxLength: 20 }, diagnosedDate: { required: true, type: () => String }, diagnosedBy: { required: false, type: () => String, maxLength: 200 }, status: { required: true, enum: require("../enums/condition-status.enum").ConditionStatus }, severity: { required: false, type: () => String, maxLength: 50 }, notes: { required: false, type: () => String, maxLength: 5000 }, carePlan: { required: false, type: () => String, maxLength: 10000 }, medications: { required: false, type: () => [String], maxLength: 200 }, restrictions: { required: false, type: () => [String], maxLength: 200 }, triggers: { required: false, type: () => [String], maxLength: 200 }, accommodations: { required: false, type: () => [String], maxLength: 200 }, emergencyProtocol: { required: false, type: () => String, maxLength: 2000 }, lastReviewDate: { required: false, type: () => String }, nextReviewDate: { required: false, type: () => String }, requiresIEP: { required: false, type: () => Boolean }, requires504: { required: false, type: () => Boolean } };
    }
}
exports.ChronicConditionCreateDto = ChronicConditionCreateDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the student',
        example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ChronicConditionCreateDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'UUID of associated health record',
        example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ChronicConditionCreateDto.prototype, "healthRecordId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Condition name',
        example: 'Type 1 Diabetes',
        minLength: 2,
        maxLength: 200,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], ChronicConditionCreateDto.prototype, "condition", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ICD-10 diagnosis code',
        example: 'E10.9',
        maxLength: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], ChronicConditionCreateDto.prototype, "icdCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date of official diagnosis',
        example: '2024-01-15',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ChronicConditionCreateDto.prototype, "diagnosedDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Diagnosing healthcare provider name and credentials',
        example: 'Dr. Sarah Johnson, Pediatric Endocrinology',
        maxLength: 200,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], ChronicConditionCreateDto.prototype, "diagnosedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current management status',
        enum: condition_status_enum_1.ConditionStatus,
        example: condition_status_enum_1.ConditionStatus.ACTIVE,
    }),
    (0, class_validator_1.IsEnum)(condition_status_enum_1.ConditionStatus),
    __metadata("design:type", String)
], ChronicConditionCreateDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Severity level',
        example: 'High',
        maxLength: 50,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], ChronicConditionCreateDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Clinical notes and observations (maximum 5000 characters)',
        example: 'Patient requires close monitoring during physical activities',
        maxLength: 5000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000, { message: 'Notes cannot exceed 5000 characters' }),
    __metadata("design:type", String)
], ChronicConditionCreateDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Comprehensive care plan documentation (maximum 10000 characters)',
        example: 'Blood glucose monitoring 4x daily, insulin administration protocol...',
        maxLength: 10000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10000, { message: 'Care plan cannot exceed 10000 characters' }),
    __metadata("design:type", String)
], ChronicConditionCreateDto.prototype, "carePlan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List of prescribed medications for this condition (each max 200 characters)',
        example: ['Insulin - Humalog', 'Insulin - Lantus'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MaxLength)(200, {
        each: true,
        message: 'Each medication cannot exceed 200 characters',
    }),
    __metadata("design:type", Array)
], ChronicConditionCreateDto.prototype, "medications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Activity or dietary restrictions (each max 200 characters)',
        example: ['No unsupervised activities until stable', 'No high-sugar foods'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MaxLength)(200, {
        each: true,
        message: 'Each restriction cannot exceed 200 characters',
    }),
    __metadata("design:type", Array)
], ChronicConditionCreateDto.prototype, "restrictions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Known triggers that worsen the condition (each max 200 characters)',
        example: ['Illness', 'Stress', 'Irregular meals'],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MaxLength)(200, {
        each: true,
        message: 'Each trigger cannot exceed 200 characters',
    }),
    __metadata("design:type", Array)
], ChronicConditionCreateDto.prototype, "triggers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Required school accommodations (each max 200 characters)',
        example: [
            'Blood sugar checks during class',
            'Snacks allowed',
            'Extra restroom breaks',
        ],
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.MaxLength)(200, {
        each: true,
        message: 'Each accommodation cannot exceed 200 characters',
    }),
    __metadata("design:type", Array)
], ChronicConditionCreateDto.prototype, "accommodations", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Emergency response procedures (maximum 2000 characters)',
        example: 'If blood sugar <70 or >300, contact parent and 911 immediately',
        maxLength: 2000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000, {
        message: 'Emergency protocol cannot exceed 2000 characters',
    }),
    __metadata("design:type", String)
], ChronicConditionCreateDto.prototype, "emergencyProtocol", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date of most recent care plan review',
        example: '2024-01-15',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ChronicConditionCreateDto.prototype, "lastReviewDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Scheduled date for next review',
        example: '2024-04-15',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ChronicConditionCreateDto.prototype, "nextReviewDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether condition requires IEP (Individualized Education Program)',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ChronicConditionCreateDto.prototype, "requiresIEP", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether condition requires 504 accommodation plan',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ChronicConditionCreateDto.prototype, "requires504", void 0);
//# sourceMappingURL=create-chronic-condition.dto.js.map