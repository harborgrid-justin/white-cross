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
exports.HealthRecordCreateMedicationDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const medication_interface_1 = require("../../interfaces/medication.interface");
class HealthRecordCreateMedicationDto {
    name;
    genericName;
    dosageForm;
    strength;
    manufacturer;
    ndc;
    isControlled;
    deaSchedule;
    requiresWitness;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, minLength: 1, maxLength: 255 }, genericName: { required: false, type: () => String, maxLength: 255 }, dosageForm: { required: true, enum: require("../../interfaces/medication.interface").DosageForm }, strength: { required: true, type: () => String, minLength: 1, maxLength: 100 }, manufacturer: { required: false, type: () => String, maxLength: 255 }, ndc: { required: false, type: () => String, maxLength: 20 }, isControlled: { required: true, type: () => Boolean }, deaSchedule: { required: false, enum: require("../../interfaces/medication.interface").DEASchedule }, requiresWitness: { required: true, type: () => Boolean } };
    }
}
exports.HealthRecordCreateMedicationDto = HealthRecordCreateMedicationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Brand name of the medication',
        example: 'Advil',
        minLength: 1,
        maxLength: 255,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], HealthRecordCreateMedicationDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Generic name of the medication',
        example: 'Ibuprofen',
        maxLength: 255,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], HealthRecordCreateMedicationDto.prototype, "genericName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Dosage form',
        enum: medication_interface_1.DosageForm,
        example: medication_interface_1.DosageForm.TABLET,
    }),
    (0, class_validator_1.IsEnum)(medication_interface_1.DosageForm),
    __metadata("design:type", String)
], HealthRecordCreateMedicationDto.prototype, "dosageForm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Strength of the medication',
        example: '200mg',
        minLength: 1,
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], HealthRecordCreateMedicationDto.prototype, "strength", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Manufacturer of the medication',
        example: 'Pfizer',
        maxLength: 255,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], HealthRecordCreateMedicationDto.prototype, "manufacturer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'National Drug Code (NDC)',
        example: '0009-0054-01',
        maxLength: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], HealthRecordCreateMedicationDto.prototype, "ndc", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether medication is a controlled substance',
        example: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], HealthRecordCreateMedicationDto.prototype, "isControlled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'DEA schedule if controlled',
        enum: medication_interface_1.DEASchedule,
        example: medication_interface_1.DEASchedule.IV,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(medication_interface_1.DEASchedule),
    __metadata("design:type", String)
], HealthRecordCreateMedicationDto.prototype, "deaSchedule", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether administration requires a witness',
        example: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], HealthRecordCreateMedicationDto.prototype, "requiresWitness", void 0);
//# sourceMappingURL=create-medication.dto.js.map