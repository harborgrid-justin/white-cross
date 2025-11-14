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
exports.InitiateAdministrationDto = exports.RecordAdministrationDto = exports.VitalSignsDto = exports.StudentResponse = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const five_rights_verification_dto_1 = require("./five-rights-verification.dto");
var StudentResponse;
(function (StudentResponse) {
    StudentResponse["NORMAL"] = "normal";
    StudentResponse["UNUSUAL"] = "unusual";
    StudentResponse["ADVERSE"] = "adverse";
})(StudentResponse || (exports.StudentResponse = StudentResponse = {}));
class VitalSignsDto {
    bloodPressure;
    heartRate;
    temperature;
    respiratoryRate;
    oxygenSaturation;
    static _OPENAPI_METADATA_FACTORY() {
        return { bloodPressure: { required: false, type: () => String }, heartRate: { required: false, type: () => Number }, temperature: { required: false, type: () => Number }, respiratoryRate: { required: false, type: () => Number }, oxygenSaturation: { required: false, type: () => Number } };
    }
}
exports.VitalSignsDto = VitalSignsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Blood pressure reading',
        example: '120/80',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VitalSignsDto.prototype, "bloodPressure", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Heart rate in beats per minute',
        example: 75,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "heartRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Temperature in Fahrenheit',
        example: 98.6,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "temperature", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Respiratory rate in breaths per minute',
        example: 16,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "respiratoryRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Oxygen saturation percentage',
        example: 98,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "oxygenSaturation", void 0);
class RecordAdministrationDto {
    sessionId;
    prescriptionId;
    studentId;
    medicationId;
    dosageAdministered;
    route;
    administeredAt;
    administeredBy;
    fiveRightsData;
    witnessId;
    witnessSignature;
    notes;
    vitalSigns;
    studentResponse;
    followUpRequired;
    followUpNotes;
    static _OPENAPI_METADATA_FACTORY() {
        return { sessionId: { required: true, type: () => String }, prescriptionId: { required: true, type: () => String }, studentId: { required: true, type: () => String }, medicationId: { required: true, type: () => String }, dosageAdministered: { required: true, type: () => String }, route: { required: true, enum: require("./five-rights-verification.dto").AdministrationRoute }, administeredAt: { required: true, type: () => String }, administeredBy: { required: true, type: () => String }, fiveRightsData: { required: true, type: () => require("./five-rights-verification.dto").FiveRightsDataDto }, witnessId: { required: false, type: () => String }, witnessSignature: { required: false, type: () => String }, notes: { required: false, type: () => String }, vitalSigns: { required: false, type: () => require("./record-administration.dto").VitalSignsDto }, studentResponse: { required: false, enum: require("./record-administration.dto").StudentResponse }, followUpRequired: { required: false, type: () => Boolean }, followUpNotes: { required: false, type: () => String } };
    }
}
exports.RecordAdministrationDto = RecordAdministrationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Administration session ID from initiation and verification',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordAdministrationDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prescription ID being administered',
        example: '660e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordAdministrationDto.prototype, "prescriptionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student ID receiving medication',
        example: '770e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordAdministrationDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Medication ID being administered',
        example: '880e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordAdministrationDto.prototype, "medicationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Actual dosage administered',
        example: '200mg',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordAdministrationDto.prototype, "dosageAdministered", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Route of administration',
        enum: five_rights_verification_dto_1.AdministrationRoute,
        example: five_rights_verification_dto_1.AdministrationRoute.ORAL,
    }),
    (0, class_validator_1.IsEnum)(five_rights_verification_dto_1.AdministrationRoute),
    __metadata("design:type", String)
], RecordAdministrationDto.prototype, "route", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when medication was administered',
        example: '2025-11-04T10:30:00Z',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordAdministrationDto.prototype, "administeredAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID of administrator (nurse)',
        example: '990e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordAdministrationDto.prototype, "administeredBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Five Rights verification data',
        type: five_rights_verification_dto_1.FiveRightsDataDto,
    }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => five_rights_verification_dto_1.FiveRightsDataDto),
    __metadata("design:type", five_rights_verification_dto_1.FiveRightsDataDto)
], RecordAdministrationDto.prototype, "fiveRightsData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Witness ID for controlled substances',
        example: 'aa0e8400-e29b-41d4-a716-446655440000',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordAdministrationDto.prototype, "witnessId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Witness signature for controlled substances',
        example: 'data:image/png;base64,iVBORw0KGgoAAAANS...',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordAdministrationDto.prototype, "witnessSignature", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes about administration',
        example: 'Student took medication without difficulty',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordAdministrationDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Vital signs taken at time of administration',
        type: VitalSignsDto,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => VitalSignsDto),
    __metadata("design:type", VitalSignsDto)
], RecordAdministrationDto.prototype, "vitalSigns", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student response to medication',
        enum: StudentResponse,
        example: StudentResponse.NORMAL,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(StudentResponse),
    __metadata("design:type", String)
], RecordAdministrationDto.prototype, "studentResponse", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether follow-up is required',
        example: false,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], RecordAdministrationDto.prototype, "followUpRequired", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notes for follow-up if required',
        example: 'Monitor for rash in next 2 hours',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordAdministrationDto.prototype, "followUpNotes", void 0);
class InitiateAdministrationDto {
    prescriptionId;
    static _OPENAPI_METADATA_FACTORY() {
        return { prescriptionId: { required: true, type: () => String } };
    }
}
exports.InitiateAdministrationDto = InitiateAdministrationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prescription ID to initiate administration for',
        example: '660e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InitiateAdministrationDto.prototype, "prescriptionId", void 0);
//# sourceMappingURL=record-administration.dto.js.map