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
exports.CreateVitalsDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class BloodPressureDto {
    systolic;
    diastolic;
    static _OPENAPI_METADATA_FACTORY() {
        return { systolic: { required: true, type: () => Number }, diastolic: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BloodPressureDto.prototype, "systolic", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BloodPressureDto.prototype, "diastolic", void 0);
class VitalSignsDto {
    heartRate;
    bloodPressure;
    temperature;
    oxygenSaturation;
    respiratoryRate;
    weight;
    height;
    static _OPENAPI_METADATA_FACTORY() {
        return { heartRate: { required: false, type: () => Number }, bloodPressure: { required: false, type: () => BloodPressureDto }, temperature: { required: false, type: () => Number }, oxygenSaturation: { required: false, type: () => Number }, respiratoryRate: { required: false, type: () => Number }, weight: { required: false, type: () => Number }, height: { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "heartRate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BloodPressureDto),
    __metadata("design:type", BloodPressureDto)
], VitalSignsDto.prototype, "bloodPressure", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "temperature", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "oxygenSaturation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "respiratoryRate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "weight", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "height", void 0);
class CreateVitalsDto {
    patientId;
    vitals;
    deviceId;
    notes;
    recordedBy;
    static _OPENAPI_METADATA_FACTORY() {
        return { patientId: { required: true, type: () => Number }, vitals: { required: true, type: () => VitalSignsDto }, deviceId: { required: false, type: () => String }, notes: { required: false, type: () => String }, recordedBy: { required: false, type: () => Number } };
    }
}
exports.CreateVitalsDto = CreateVitalsDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateVitalsDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => VitalSignsDto),
    __metadata("design:type", VitalSignsDto)
], CreateVitalsDto.prototype, "vitals", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVitalsDto.prototype, "deviceId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVitalsDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateVitalsDto.prototype, "recordedBy", void 0);
//# sourceMappingURL=create-vitals.dto.js.map