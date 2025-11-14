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
exports.MedicationConflictResponseDto = exports.CheckMedicationConflictsDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CheckMedicationConflictsDto {
    studentId;
    medicationName;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, format: "uuid" }, medicationName: { required: true, type: () => String, minLength: 1, maxLength: 255 } };
    }
}
exports.CheckMedicationConflictsDto = CheckMedicationConflictsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student UUID to check allergies against',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CheckMedicationConflictsDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Medication name to check for conflicts',
        example: 'Amoxicillin',
        minLength: 1,
        maxLength: 255,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CheckMedicationConflictsDto.prototype, "medicationName", void 0);
class MedicationConflictResponseDto {
    hasConflicts;
    conflicts;
    recommendation;
    warning;
    static _OPENAPI_METADATA_FACTORY() {
        return { hasConflicts: { required: true, type: () => Boolean }, conflicts: { required: true }, recommendation: { required: true, type: () => Object }, warning: { required: false, type: () => String } };
    }
}
exports.MedicationConflictResponseDto = MedicationConflictResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether any conflicts were found',
        example: true,
    }),
    __metadata("design:type", Boolean)
], MedicationConflictResponseDto.prototype, "hasConflicts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of conflicts with severity levels',
        example: [
            {
                allergen: 'Penicillin',
                severity: 'SEVERE',
                reaction: 'Anaphylaxis, hives, difficulty breathing',
                conflictType: 'DIRECT_MATCH',
            },
        ],
        type: 'array',
    }),
    __metadata("design:type", Array)
], MedicationConflictResponseDto.prototype, "conflicts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Recommended action based on severity',
        example: 'DO_NOT_ADMINISTER',
        enum: ['SAFE', 'CONSULT_PHYSICIAN', 'DO_NOT_ADMINISTER'],
    }),
    __metadata("design:type", String)
], MedicationConflictResponseDto.prototype, "recommendation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional warnings or notes',
        example: 'Patient has life-threatening allergy to penicillin. Amoxicillin is a penicillin derivative.',
        required: false,
    }),
    __metadata("design:type", String)
], MedicationConflictResponseDto.prototype, "warning", void 0);
//# sourceMappingURL=check-conflicts.dto.js.map