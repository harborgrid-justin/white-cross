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
exports.GenerateMedicationLogDto = exports.MedicationAdministrationDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class MedicationAdministrationDto {
    administeredAt;
    administeredBy;
    verifiedBy;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { administeredAt: { required: true, type: () => String }, administeredBy: { required: true, type: () => String }, verifiedBy: { required: false, type: () => String }, notes: { required: false, type: () => String } };
    }
}
exports.MedicationAdministrationDto = MedicationAdministrationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Administration date and time' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MedicationAdministrationDto.prototype, "administeredAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of person who administered' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MedicationAdministrationDto.prototype, "administeredBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Name of person who verified' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MedicationAdministrationDto.prototype, "verifiedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Administration notes' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MedicationAdministrationDto.prototype, "notes", void 0);
class GenerateMedicationLogDto {
    id;
    name;
    studentName;
    dosage;
    route;
    frequency;
    administrations;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, studentName: { required: true, type: () => String }, dosage: { required: true, type: () => String }, route: { required: true, type: () => String }, frequency: { required: true, type: () => String }, administrations: { required: false, type: () => [require("./generate-medication-log.dto").MedicationAdministrationDto] } };
    }
}
exports.GenerateMedicationLogDto = GenerateMedicationLogDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Medication ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GenerateMedicationLogDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Medication name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GenerateMedicationLogDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Student name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GenerateMedicationLogDto.prototype, "studentName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dosage' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GenerateMedicationLogDto.prototype, "dosage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Route of administration' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GenerateMedicationLogDto.prototype, "route", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Frequency of administration' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GenerateMedicationLogDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Administration records',
        type: [MedicationAdministrationDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => MedicationAdministrationDto),
    __metadata("design:type", Array)
], GenerateMedicationLogDto.prototype, "administrations", void 0);
//# sourceMappingURL=generate-medication-log.dto.js.map