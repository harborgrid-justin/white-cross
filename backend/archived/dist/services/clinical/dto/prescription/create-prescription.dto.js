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
exports.CreatePrescriptionDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const prescription_status_enum_1 = require("../../enums/prescription-status.enum");
class CreatePrescriptionDto {
    studentId;
    visitId;
    treatmentPlanId;
    prescribedBy;
    drugName;
    drugCode;
    dosage;
    frequency;
    route;
    quantity;
    refillsAuthorized = 0;
    startDate;
    endDate;
    instructions;
    status;
    pharmacyName;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, format: "uuid" }, visitId: { required: false, type: () => String, format: "uuid" }, treatmentPlanId: { required: false, type: () => String, format: "uuid" }, prescribedBy: { required: true, type: () => String, format: "uuid" }, drugName: { required: true, type: () => String }, drugCode: { required: false, type: () => String }, dosage: { required: true, type: () => String }, frequency: { required: true, type: () => String }, route: { required: true, type: () => String }, quantity: { required: true, type: () => Number, minimum: 1 }, refillsAuthorized: { required: false, type: () => Number, default: 0, minimum: 0 }, startDate: { required: true, type: () => Date }, endDate: { required: false, type: () => Date }, instructions: { required: false, type: () => String }, status: { required: false, enum: require("../../enums/prescription-status.enum").PrescriptionStatus }, pharmacyName: { required: false, type: () => String }, notes: { required: false, type: () => String } };
    }
}
exports.CreatePrescriptionDto = CreatePrescriptionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Associated clinic visit ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Associated treatment plan ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "treatmentPlanId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prescribing physician/provider',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "prescribedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Drug name', example: 'Amoxicillin' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "drugName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Drug code (NDC, etc.)',
        example: '00093-4155-73',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "drugCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dosage amount', example: '500mg' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "dosage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Frequency of administration',
        example: 'Three times daily',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Route of administration', example: 'Oral' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "route", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity to dispense', example: 30, minimum: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreatePrescriptionDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of refills authorized',
        example: 2,
        minimum: 0,
        default: 0,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreatePrescriptionDto.prototype, "refillsAuthorized", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date', example: '2025-10-28' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreatePrescriptionDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End date (if applicable)' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreatePrescriptionDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Special instructions for patient' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "instructions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Initial status',
        enum: prescription_status_enum_1.PrescriptionStatus,
        default: prescription_status_enum_1.PrescriptionStatus.PENDING,
    }),
    (0, class_validator_1.IsEnum)(prescription_status_enum_1.PrescriptionStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Pharmacy name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "pharmacyName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional notes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "notes", void 0);
//# sourceMappingURL=create-prescription.dto.js.map