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
exports.AddAllergyDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class AddAllergyDto {
    studentId;
    drugId;
    allergyType;
    reaction;
    severity;
    notes;
    diagnosedDate;
    diagnosedBy;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, format: "uuid" }, drugId: { required: true, type: () => String, format: "uuid" }, allergyType: { required: true, type: () => String, minLength: 1 }, reaction: { required: true, type: () => String, minLength: 1 }, severity: { required: true, type: () => String, minLength: 1 }, notes: { required: false, type: () => String }, diagnosedDate: { required: false, type: () => Date }, diagnosedBy: { required: false, type: () => String } };
    }
}
exports.AddAllergyDto = AddAllergyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], AddAllergyDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Drug ID',
        example: '123e4567-e89b-12d3-a456-426614174001',
    }),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], AddAllergyDto.prototype, "drugId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of allergy',
        example: 'Drug Allergy',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], AddAllergyDto.prototype, "allergyType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Allergic reaction description',
        example: 'Hives, itching, swelling',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], AddAllergyDto.prototype, "reaction", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Severity of the allergy',
        example: 'MODERATE',
        enum: ['MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING'],
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], AddAllergyDto.prototype, "severity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional notes about the allergy',
        example: 'Patient reports reaction occurred within 30 minutes of administration',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddAllergyDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date allergy was diagnosed',
        example: '2024-01-15',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], AddAllergyDto.prototype, "diagnosedDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Healthcare provider who diagnosed the allergy',
        example: 'Dr. Jane Smith',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddAllergyDto.prototype, "diagnosedBy", void 0);
//# sourceMappingURL=add-allergy.dto.js.map