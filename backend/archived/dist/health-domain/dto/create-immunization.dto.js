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
exports.CreateImmunizationDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const vaccination_interface_1 = require("../../health-record/interfaces/vaccination.interface");
class CreateImmunizationDto {
    studentId;
    vaccineType;
    administrationDate;
    administeredBy;
    cvxCode;
    ndcCode;
    lotNumber;
    manufacturer;
    doseNumber;
    totalDoses;
    expirationDate;
    nextDueDate;
    site;
    route;
    dosageAmount;
    reactions;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String }, vaccineType: { required: true, enum: require("../../health-record/interfaces/vaccination.interface").VaccineType }, administrationDate: { required: true, type: () => Date }, administeredBy: { required: true, type: () => String }, cvxCode: { required: false, type: () => String }, ndcCode: { required: false, type: () => String }, lotNumber: { required: false, type: () => String }, manufacturer: { required: false, type: () => String }, doseNumber: { required: false, type: () => Number }, totalDoses: { required: false, type: () => Number }, expirationDate: { required: false, type: () => Date }, nextDueDate: { required: false, type: () => Date }, site: { required: false, type: () => String }, route: { required: false, type: () => String }, dosageAmount: { required: false, type: () => String }, reactions: { required: false, type: () => String }, notes: { required: false, type: () => String } };
    }
}
exports.CreateImmunizationDto = CreateImmunizationDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImmunizationDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: vaccination_interface_1.VaccineType }),
    (0, class_validator_1.IsEnum)(vaccination_interface_1.VaccineType),
    __metadata("design:type", String)
], CreateImmunizationDto.prototype, "vaccineType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateImmunizationDto.prototype, "administrationDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImmunizationDto.prototype, "administeredBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImmunizationDto.prototype, "cvxCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImmunizationDto.prototype, "ndcCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImmunizationDto.prototype, "lotNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImmunizationDto.prototype, "manufacturer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateImmunizationDto.prototype, "doseNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateImmunizationDto.prototype, "totalDoses", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateImmunizationDto.prototype, "expirationDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateImmunizationDto.prototype, "nextDueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImmunizationDto.prototype, "site", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImmunizationDto.prototype, "route", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImmunizationDto.prototype, "dosageAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImmunizationDto.prototype, "reactions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImmunizationDto.prototype, "notes", void 0);
//# sourceMappingURL=create-immunization.dto.js.map