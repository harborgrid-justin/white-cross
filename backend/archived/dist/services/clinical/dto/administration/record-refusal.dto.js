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
exports.RecordHeldMedicationDto = exports.RecordMissedDoseDto = exports.RecordRefusalDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class RecordRefusalDto {
    prescriptionId;
    scheduledTime;
    reason;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { prescriptionId: { required: true, type: () => String }, scheduledTime: { required: true, type: () => String }, reason: { required: true, type: () => String }, notes: { required: false, type: () => String } };
    }
}
exports.RecordRefusalDto = RecordRefusalDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prescription ID for the refused medication',
        example: '660e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordRefusalDto.prototype, "prescriptionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Scheduled time for the medication',
        example: '2025-11-04T10:00:00Z',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordRefusalDto.prototype, "scheduledTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for refusal',
        example: 'Student stated medication makes them feel nauseous',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordRefusalDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes about refusal',
        example: 'Parent notified, prescriber will be contacted',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordRefusalDto.prototype, "notes", void 0);
class RecordMissedDoseDto {
    prescriptionId;
    scheduledTime;
    reason;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { prescriptionId: { required: true, type: () => String }, scheduledTime: { required: true, type: () => String }, reason: { required: true, type: () => String }, notes: { required: false, type: () => String } };
    }
}
exports.RecordMissedDoseDto = RecordMissedDoseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prescription ID for the missed medication',
        example: '660e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordMissedDoseDto.prototype, "prescriptionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Scheduled time for the medication',
        example: '2025-11-04T10:00:00Z',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordMissedDoseDto.prototype, "scheduledTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for missed dose',
        example: 'Student absent from school',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordMissedDoseDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes about missed dose',
        example: 'Parent will administer at home',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordMissedDoseDto.prototype, "notes", void 0);
class RecordHeldMedicationDto {
    prescriptionId;
    scheduledTime;
    reason;
    clinicalRationale;
    static _OPENAPI_METADATA_FACTORY() {
        return { prescriptionId: { required: true, type: () => String }, scheduledTime: { required: true, type: () => String }, reason: { required: true, type: () => String }, clinicalRationale: { required: true, type: () => String } };
    }
}
exports.RecordHeldMedicationDto = RecordHeldMedicationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prescription ID for the held medication',
        example: '660e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordHeldMedicationDto.prototype, "prescriptionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Scheduled time for the medication',
        example: '2025-11-04T10:00:00Z',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordHeldMedicationDto.prototype, "scheduledTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Brief reason medication was held',
        example: 'Elevated blood pressure',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordHeldMedicationDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Detailed clinical rationale for holding medication',
        example: 'BP 145/95, holding medication per protocol. Prescriber contacted.',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordHeldMedicationDto.prototype, "clinicalRationale", void 0);
//# sourceMappingURL=record-refusal.dto.js.map