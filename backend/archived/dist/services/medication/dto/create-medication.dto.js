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
exports.CreateMedicationDto = exports.DEASchedule = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
var DEASchedule;
(function (DEASchedule) {
    DEASchedule["SCHEDULE_II"] = "II";
    DEASchedule["SCHEDULE_III"] = "III";
    DEASchedule["SCHEDULE_IV"] = "IV";
    DEASchedule["SCHEDULE_V"] = "V";
})(DEASchedule || (exports.DEASchedule = DEASchedule = {}));
class CreateMedicationDto {
    medicationName;
    dosage;
    frequency;
    route;
    prescribedBy;
    startDate;
    studentId;
    endDate;
    instructions;
    sideEffects;
    isActive;
    ndc;
    isControlled;
    deaSchedule;
    requiresWitness;
    genericName;
    dosageForm;
    manufacturer;
    static _OPENAPI_METADATA_FACTORY() {
        return { medicationName: { required: true, type: () => String, minLength: 2, maxLength: 255 }, dosage: { required: true, type: () => String }, frequency: { required: true, type: () => String }, route: { required: true, type: () => String }, prescribedBy: { required: true, type: () => String }, startDate: { required: true, type: () => Date }, studentId: { required: true, type: () => String, format: "uuid" }, endDate: { required: false, type: () => Date }, instructions: { required: false, type: () => String }, sideEffects: { required: false, type: () => String }, isActive: { required: false, type: () => Boolean }, ndc: { required: false, type: () => String }, isControlled: { required: false, type: () => Boolean }, deaSchedule: { required: false, enum: require("./create-medication.dto").DEASchedule }, requiresWitness: { required: false, type: () => Boolean }, genericName: { required: false, type: () => String }, dosageForm: { required: false, type: () => String }, manufacturer: { required: false, type: () => String } };
    }
}
exports.CreateMedicationDto = CreateMedicationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the medication with strength',
        example: 'Ibuprofen 200mg',
        minLength: 2,
        maxLength: 255,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "medicationName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Dosage amount with unit',
        example: '200mg',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "dosage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'How often to administer the medication',
        example: 'Every 6 hours as needed',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Route of administration',
        example: 'Oral',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "route", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of prescribing physician',
        example: 'Dr. Smith',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "prescribedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Start date for medication',
        example: '2025-10-23T00:00:00Z',
    }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Date)
], CreateMedicationDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of the student this medication is for',
        example: '660e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'End date for medication (null if ongoing)',
        example: '2025-11-23T00:00:00Z',
    }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateMedicationDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Special administration instructions',
        example: 'Take with food',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "instructions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Known side effects',
        example: 'May cause drowsiness',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "sideEffects", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether the medication is currently active',
        example: true,
        default: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateMedicationDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'National Drug Code (11-digit format)',
        example: '00406-0486-01',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "ndc", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether this is a controlled substance',
        example: false,
        default: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateMedicationDto.prototype, "isControlled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'DEA schedule for controlled substances (II-V)',
        enum: DEASchedule,
        example: DEASchedule.SCHEDULE_II,
    }),
    (0, class_validator_1.IsEnum)(DEASchedule),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "deaSchedule", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether witness verification is required for administration',
        example: false,
        default: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateMedicationDto.prototype, "requiresWitness", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Generic name of the medication',
        example: 'Ibuprofen',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "genericName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Dosage form (Tablet, Capsule, Solution, etc.)',
        example: 'Tablet',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "dosageForm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Manufacturer name',
        example: 'ABC Pharmaceuticals',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "manufacturer", void 0);
//# sourceMappingURL=create-medication.dto.js.map