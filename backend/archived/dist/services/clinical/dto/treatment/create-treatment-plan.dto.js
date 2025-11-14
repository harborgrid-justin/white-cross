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
exports.CreateTreatmentPlanDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const treatment_status_enum_1 = require("../../enums/treatment-status.enum");
class CreateTreatmentPlanDto {
    studentId;
    visitId;
    createdBy;
    diagnosis;
    treatmentGoals;
    interventions;
    medications;
    startDate;
    endDate;
    status;
    notes;
    reviewDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, format: "uuid" }, visitId: { required: false, type: () => String, format: "uuid" }, createdBy: { required: true, type: () => String, format: "uuid" }, diagnosis: { required: true, type: () => String }, treatmentGoals: { required: true, type: () => [String] }, interventions: { required: true, type: () => [String] }, medications: { required: false, type: () => [String] }, startDate: { required: true, type: () => Date }, endDate: { required: false, type: () => Date }, status: { required: false, enum: require("../../enums/treatment-status.enum").TreatmentStatus }, notes: { required: false, type: () => String }, reviewDate: { required: false, type: () => Date } };
    }
}
exports.CreateTreatmentPlanDto = CreateTreatmentPlanDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTreatmentPlanDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Associated clinic visit ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTreatmentPlanDto.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Staff member creating the plan',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTreatmentPlanDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Primary diagnosis',
        example: 'Type 1 Diabetes Mellitus',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTreatmentPlanDto.prototype, "diagnosis", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Treatment goals',
        example: ['Stabilize blood glucose', 'Prevent complications'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateTreatmentPlanDto.prototype, "treatmentGoals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Planned interventions',
        example: ['Insulin therapy', 'Dietary modifications', 'Regular monitoring'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateTreatmentPlanDto.prototype, "interventions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List of medications',
        example: ['Insulin glargine', 'Metformin'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateTreatmentPlanDto.prototype, "medications", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Treatment start date', example: '2025-10-28' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateTreatmentPlanDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Expected end date' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateTreatmentPlanDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Treatment plan status',
        enum: treatment_status_enum_1.TreatmentStatus,
        default: treatment_status_enum_1.TreatmentStatus.DRAFT,
    }),
    (0, class_validator_1.IsEnum)(treatment_status_enum_1.TreatmentStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTreatmentPlanDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTreatmentPlanDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date for plan review' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateTreatmentPlanDto.prototype, "reviewDate", void 0);
//# sourceMappingURL=create-treatment-plan.dto.js.map