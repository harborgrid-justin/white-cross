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
exports.CreateVaccinationDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateVaccinationDto {
    studentId;
    vaccineName;
    vaccineCode;
    administrationDate;
    doseNumber;
    lotNumber;
    manufacturer;
    expirationDate;
    route;
    site;
    administeredBy;
    providerId;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, format: "uuid" }, vaccineName: { required: true, type: () => String, maxLength: 200 }, vaccineCode: { required: true, type: () => String, maxLength: 10 }, administrationDate: { required: true, type: () => Date }, doseNumber: { required: true, type: () => Number, minimum: 1, maximum: 10 }, lotNumber: { required: true, type: () => String, maxLength: 50 }, manufacturer: { required: false, type: () => String, maxLength: 200 }, expirationDate: { required: false, type: () => Date }, route: { required: false, type: () => String, maxLength: 50 }, site: { required: false, type: () => String, maxLength: 100 }, administeredBy: { required: false, type: () => String, maxLength: 200 }, providerId: { required: false, type: () => String, format: "uuid" }, notes: { required: false, type: () => String, maxLength: 1000 } };
    }
}
exports.CreateVaccinationDto = CreateVaccinationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student UUID',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Student ID is required' }),
    (0, class_validator_1.IsUUID)(4, { message: 'Student ID must be a valid UUID' }),
    __metadata("design:type", String)
], CreateVaccinationDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Vaccine name',
        example: 'COVID-19, mRNA, LNP-S, PF, 30 mcg/0.3 mL dose',
        maxLength: 200,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Vaccine name is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200, { message: 'Vaccine name cannot exceed 200 characters' }),
    __metadata("design:type", String)
], CreateVaccinationDto.prototype, "vaccineName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'CDC CVX code',
        example: '208',
        maxLength: 10,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Vaccine code (CVX) is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10, { message: 'Vaccine code cannot exceed 10 characters' }),
    __metadata("design:type", String)
], CreateVaccinationDto.prototype, "vaccineCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Administration date',
        example: '2024-10-28',
        type: 'string',
        format: 'date',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Administration date is required' }),
    (0, class_validator_1.IsDate)({ message: 'Administration date must be a valid date' }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateVaccinationDto.prototype, "administrationDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Dose number in series',
        example: 1,
        minimum: 1,
        maximum: 10,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Dose number is required' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1, { message: 'Dose number must be at least 1' }),
    (0, class_validator_1.Max)(10, { message: 'Dose number cannot exceed 10' }),
    __metadata("design:type", Number)
], CreateVaccinationDto.prototype, "doseNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Vaccine lot number',
        example: 'EK9231',
        maxLength: 50,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Lot number is required' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, { message: 'Lot number cannot exceed 50 characters' }),
    __metadata("design:type", String)
], CreateVaccinationDto.prototype, "lotNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Manufacturer name',
        example: 'Pfizer-BioNTech',
        required: false,
        maxLength: 200,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200, { message: 'Manufacturer cannot exceed 200 characters' }),
    __metadata("design:type", String)
], CreateVaccinationDto.prototype, "manufacturer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Expiration date',
        example: '2025-12-31',
        required: false,
        type: 'string',
        format: 'date',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)({ message: 'Expiration date must be a valid date' }),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateVaccinationDto.prototype, "expirationDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Route of administration',
        example: 'Intramuscular',
        required: false,
        maxLength: 50,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, { message: 'Route cannot exceed 50 characters' }),
    __metadata("design:type", String)
], CreateVaccinationDto.prototype, "route", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Site of administration',
        example: 'Left deltoid',
        required: false,
        maxLength: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100, { message: 'Site cannot exceed 100 characters' }),
    __metadata("design:type", String)
], CreateVaccinationDto.prototype, "site", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of person who administered vaccine',
        example: 'Nurse Jane Smith, RN',
        required: false,
        maxLength: 200,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200, { message: 'Administered by cannot exceed 200 characters' }),
    __metadata("design:type", String)
], CreateVaccinationDto.prototype, "administeredBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of provider who administered vaccine',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
        format: 'uuid',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(4, { message: 'Provider ID must be a valid UUID' }),
    __metadata("design:type", String)
], CreateVaccinationDto.prototype, "providerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes',
        required: false,
        maxLength: 1000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000, { message: 'Notes cannot exceed 1000 characters' }),
    __metadata("design:type", String)
], CreateVaccinationDto.prototype, "notes", void 0);
//# sourceMappingURL=create-vaccination.dto.js.map