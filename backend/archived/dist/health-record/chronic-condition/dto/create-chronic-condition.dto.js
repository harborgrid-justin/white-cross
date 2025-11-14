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
exports.CreateChronicConditionDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const chronic_condition_interface_1 = require("../../interfaces/chronic-condition.interface");
class CreateChronicConditionDto {
    studentId;
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
    emergencyActionPlan;
    reviewFrequencyMonths;
    requiresIEP;
    requires504;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, format: "uuid" }, condition: { required: true, type: () => String, maxLength: 255 }, icdCode: { required: false, type: () => String, maxLength: 20 }, diagnosedDate: { required: true, type: () => Date }, diagnosedBy: { required: false, type: () => String, maxLength: 255 }, status: { required: true, enum: require("../../interfaces/chronic-condition.interface").ConditionStatus }, severity: { required: false, type: () => String, maxLength: 100 }, notes: { required: false, type: () => String, maxLength: 1000 }, carePlan: { required: false, type: () => String, maxLength: 2000 }, medications: { required: false, type: () => [String] }, restrictions: { required: false, type: () => [String] }, triggers: { required: false, type: () => [String] }, accommodations: { required: false, type: () => [String] }, emergencyActionPlan: { required: false, type: () => String, maxLength: 2000 }, reviewFrequencyMonths: { required: false, type: () => Number }, requiresIEP: { required: false, type: () => Boolean }, requires504: { required: false, type: () => Boolean } };
    }
}
exports.CreateChronicConditionDto = CreateChronicConditionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student UUID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateChronicConditionDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the chronic condition',
        example: 'Asthma',
        maxLength: 255,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateChronicConditionDto.prototype, "condition", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ICD diagnostic code',
        example: 'J45.909',
        maxLength: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateChronicConditionDto.prototype, "icdCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date when condition was diagnosed (ISO 8601)',
        example: '2023-05-15',
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateChronicConditionDto.prototype, "diagnosedDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Healthcare provider who diagnosed',
        example: 'Dr. Sarah Johnson',
        maxLength: 255,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateChronicConditionDto.prototype, "diagnosedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current status of the condition',
        enum: chronic_condition_interface_1.ConditionStatus,
        example: chronic_condition_interface_1.ConditionStatus.ACTIVE,
    }),
    (0, class_validator_1.IsEnum)(chronic_condition_interface_1.ConditionStatus),
    __metadata("design:type", String)
], CreateChronicConditionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Severity level',
        example: 'Moderate',
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateChronicConditionDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional clinical notes',
        maxLength: 1000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateChronicConditionDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Care plan and management strategy',
        maxLength: 2000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CreateChronicConditionDto.prototype, "carePlan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Associated medications',
        type: [String],
        example: ['Albuterol inhaler', 'Fluticasone nasal spray'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateChronicConditionDto.prototype, "medications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Activity restrictions',
        type: [String],
        example: ['No strenuous exercise', 'Avoid smoke exposure'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateChronicConditionDto.prototype, "restrictions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Known triggers',
        type: [String],
        example: ['Pollen', 'Cold air', 'Exercise'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateChronicConditionDto.prototype, "triggers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Required accommodations',
        type: [String],
        example: ['Extra time for assignments', 'Seating near exit'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateChronicConditionDto.prototype, "accommodations", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Emergency action plan',
        maxLength: 2000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CreateChronicConditionDto.prototype, "emergencyActionPlan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Review frequency in months',
        example: 6,
        minimum: 1,
        maximum: 24,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateChronicConditionDto.prototype, "reviewFrequencyMonths", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Requires IEP accommodation',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateChronicConditionDto.prototype, "requiresIEP", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Requires 504 plan accommodation',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateChronicConditionDto.prototype, "requires504", void 0);
//# sourceMappingURL=create-chronic-condition.dto.js.map