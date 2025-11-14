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
exports.HealthDomainCreateRecordDto = exports.VitalSignsDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const health_record_types_1 = require("../../health-record/interfaces/health-record-types");
class VitalSignsDto {
    temperature;
    bloodPressureSystolic;
    bloodPressureDiastolic;
    heartRate;
    respiratoryRate;
    oxygenSaturation;
    height;
    weight;
    bmi;
    static _OPENAPI_METADATA_FACTORY() {
        return { temperature: { required: false, type: () => Number }, bloodPressureSystolic: { required: false, type: () => Number }, bloodPressureDiastolic: { required: false, type: () => Number }, heartRate: { required: false, type: () => Number }, respiratoryRate: { required: false, type: () => Number }, oxygenSaturation: { required: false, type: () => Number }, height: { required: false, type: () => Number }, weight: { required: false, type: () => Number }, bmi: { required: false, type: () => Number } };
    }
}
exports.VitalSignsDto = VitalSignsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "temperature", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "bloodPressureSystolic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "bloodPressureDiastolic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "heartRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "respiratoryRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "oxygenSaturation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "bmi", void 0);
class HealthDomainCreateRecordDto {
    studentId;
    type;
    date;
    description;
    vital;
    provider;
    notes;
    attachments;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String }, type: { required: true, enum: require("../../health-record/interfaces/health-record-types").HealthRecordType }, date: { required: true, type: () => Date }, description: { required: true, type: () => String }, vital: { required: false, type: () => require("./create-health-record.dto").VitalSignsDto }, provider: { required: false, type: () => String }, notes: { required: false, type: () => String }, attachments: { required: false, type: () => [String] } };
    }
}
exports.HealthDomainCreateRecordDto = HealthDomainCreateRecordDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HealthDomainCreateRecordDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: health_record_types_1.HealthRecordType }),
    (0, class_validator_1.IsEnum)(health_record_types_1.HealthRecordType),
    __metadata("design:type", String)
], HealthDomainCreateRecordDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], HealthDomainCreateRecordDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HealthDomainCreateRecordDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: VitalSignsDto }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_transformer_1.Type)(() => VitalSignsDto),
    __metadata("design:type", VitalSignsDto)
], HealthDomainCreateRecordDto.prototype, "vital", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HealthDomainCreateRecordDto.prototype, "provider", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HealthDomainCreateRecordDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], HealthDomainCreateRecordDto.prototype, "attachments", void 0);
//# sourceMappingURL=create-health-record.dto.js.map