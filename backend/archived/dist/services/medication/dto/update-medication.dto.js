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
exports.UpdateMedicationDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const create_medication_dto_1 = require("./create-medication.dto");
class UpdateMedicationDto {
    medicationName;
    dosage;
    frequency;
    route;
    prescribedBy;
    startDate;
    endDate;
    instructions;
    sideEffects;
    isActive;
    ndc;
    isControlled;
    deaSchedule;
    genericName;
    dosageForm;
    manufacturer;
    static _OPENAPI_METADATA_FACTORY() {
        return { medicationName: { required: false, type: () => String, minLength: 2, maxLength: 255 }, dosage: { required: false, type: () => String }, frequency: { required: false, type: () => String }, route: { required: false, type: () => String }, prescribedBy: { required: false, type: () => String }, startDate: { required: false, type: () => Date }, endDate: { required: false, type: () => Date }, instructions: { required: false, type: () => String }, sideEffects: { required: false, type: () => String }, isActive: { required: false, type: () => Boolean }, ndc: { required: false, type: () => String }, isControlled: { required: false, type: () => Boolean }, deaSchedule: { required: false, enum: require("./create-medication.dto").DEASchedule }, genericName: { required: false, type: () => String }, dosageForm: { required: false, type: () => String }, manufacturer: { required: false, type: () => String } };
    }
}
exports.UpdateMedicationDto = UpdateMedicationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Name of the medication with strength',
        example: 'Ibuprofen 400mg',
        minLength: 2,
        maxLength: 255,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateMedicationDto.prototype, "medicationName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Dosage amount with unit',
        example: '400mg',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMedicationDto.prototype, "dosage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'How often to administer the medication',
        example: 'Every 8 hours as needed',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMedicationDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Route of administration',
        example: 'Oral',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMedicationDto.prototype, "route", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Name of prescribing physician',
        example: 'Dr. Johnson',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMedicationDto.prototype, "prescribedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Start date for medication',
        example: '2025-10-23T00:00:00Z',
    }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateMedicationDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'End date for medication (null if ongoing)',
        example: '2025-11-23T00:00:00Z',
    }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateMedicationDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Special administration instructions',
        example: 'Take with food and full glass of water',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMedicationDto.prototype, "instructions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Known side effects',
        example: 'May cause drowsiness or dizziness',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMedicationDto.prototype, "sideEffects", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether the medication is currently active',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateMedicationDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'National Drug Code (11-digit format)',
        example: '00406-0486-01',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMedicationDto.prototype, "ndc", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this is a controlled substance',
        example: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateMedicationDto.prototype, "isControlled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'DEA schedule for controlled substances (II-V)',
        enum: create_medication_dto_1.DEASchedule,
        example: create_medication_dto_1.DEASchedule.SCHEDULE_III,
    }),
    (0, class_validator_1.IsEnum)(create_medication_dto_1.DEASchedule),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMedicationDto.prototype, "deaSchedule", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Generic name of the medication',
        example: 'Ibuprofen',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMedicationDto.prototype, "genericName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Dosage form (Tablet, Capsule, Solution, etc.)',
        example: 'Tablet',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMedicationDto.prototype, "dosageForm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Manufacturer name',
        example: 'XYZ Pharmaceuticals',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMedicationDto.prototype, "manufacturer", void 0);
//# sourceMappingURL=update-medication.dto.js.map