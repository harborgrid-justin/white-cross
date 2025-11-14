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
exports.BaseHealthRecordFieldsDto = void 0;
const openapi = require("@nestjs/swagger");
const graphql_1 = require("@nestjs/graphql");
const class_validator_1 = require("class-validator");
class BaseHealthRecordFieldsDto {
    provider;
    providerNpi;
    facility;
    facilityNpi;
    diagnosis;
    diagnosisCode;
    treatment;
    followUpRequired;
    followUpDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { provider: { required: false, type: () => String, maxLength: 200 }, providerNpi: { required: false, type: () => String, maxLength: 20 }, facility: { required: false, type: () => String, maxLength: 200 }, facilityNpi: { required: false, type: () => String, maxLength: 20 }, diagnosis: { required: false, type: () => String, maxLength: 500 }, diagnosisCode: { required: false, type: () => String, maxLength: 20 }, treatment: { required: false, type: () => String, maxLength: 2000 }, followUpRequired: { required: false, type: () => Boolean }, followUpDate: { required: false, type: () => Date } };
    }
}
exports.BaseHealthRecordFieldsDto = BaseHealthRecordFieldsDto;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200, { message: 'Provider name must not exceed 200 characters' }),
    __metadata("design:type", String)
], BaseHealthRecordFieldsDto.prototype, "provider", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20, { message: 'Provider NPI must not exceed 20 characters' }),
    __metadata("design:type", String)
], BaseHealthRecordFieldsDto.prototype, "providerNpi", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200, { message: 'Facility name must not exceed 200 characters' }),
    __metadata("design:type", String)
], BaseHealthRecordFieldsDto.prototype, "facility", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20, { message: 'Facility NPI must not exceed 20 characters' }),
    __metadata("design:type", String)
], BaseHealthRecordFieldsDto.prototype, "facilityNpi", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500, { message: 'Diagnosis must not exceed 500 characters' }),
    __metadata("design:type", String)
], BaseHealthRecordFieldsDto.prototype, "diagnosis", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20, { message: 'Diagnosis code must not exceed 20 characters' }),
    __metadata("design:type", String)
], BaseHealthRecordFieldsDto.prototype, "diagnosisCode", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000, { message: 'Treatment must not exceed 2000 characters' }),
    __metadata("design:type", String)
], BaseHealthRecordFieldsDto.prototype, "treatment", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BaseHealthRecordFieldsDto.prototype, "followUpRequired", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Invalid date format for follow-up date' }),
    __metadata("design:type", Date)
], BaseHealthRecordFieldsDto.prototype, "followUpDate", void 0);
//# sourceMappingURL=base-health-record-fields.dto.js.map