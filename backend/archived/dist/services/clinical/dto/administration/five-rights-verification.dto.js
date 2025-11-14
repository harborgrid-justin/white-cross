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
exports.FiveRightsVerificationResultDto = exports.VerifyFiveRightsDto = exports.FiveRightsDataDto = exports.AdministrationRoute = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var AdministrationRoute;
(function (AdministrationRoute) {
    AdministrationRoute["ORAL"] = "oral";
    AdministrationRoute["SUBLINGUAL"] = "sublingual";
    AdministrationRoute["BUCCAL"] = "buccal";
    AdministrationRoute["INTRAVENOUS"] = "intravenous";
    AdministrationRoute["INTRAMUSCULAR"] = "intramuscular";
    AdministrationRoute["SUBCUTANEOUS"] = "subcutaneous";
    AdministrationRoute["TOPICAL"] = "topical";
    AdministrationRoute["INHALATION"] = "inhalation";
    AdministrationRoute["RECTAL"] = "rectal";
    AdministrationRoute["OPHTHALMIC"] = "ophthalmic";
    AdministrationRoute["OTIC"] = "otic";
    AdministrationRoute["NASAL"] = "nasal";
})(AdministrationRoute || (exports.AdministrationRoute = AdministrationRoute = {}));
class FiveRightsDataDto {
    studentBarcode;
    patientPhotoConfirmed;
    medicationNDC;
    medicationBarcode;
    lasaConfirmed;
    scannedDose;
    calculatedDose;
    doseCalculatorUsed;
    route;
    administrationTime;
    withinWindow;
    timeOverrideReason;
    allergyAcknowledged;
    allergyWarnings;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentBarcode: { required: true, type: () => String }, patientPhotoConfirmed: { required: true, type: () => Boolean }, medicationNDC: { required: true, type: () => String }, medicationBarcode: { required: true, type: () => String }, lasaConfirmed: { required: true, type: () => Boolean }, scannedDose: { required: true, type: () => String }, calculatedDose: { required: false, type: () => String }, doseCalculatorUsed: { required: true, type: () => Boolean }, route: { required: true, enum: require("./five-rights-verification.dto").AdministrationRoute }, administrationTime: { required: true, type: () => String }, withinWindow: { required: true, type: () => Boolean }, timeOverrideReason: { required: false, type: () => String }, allergyAcknowledged: { required: true, type: () => Boolean }, allergyWarnings: { required: false, type: () => [String] } };
    }
}
exports.FiveRightsDataDto = FiveRightsDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student barcode scanned from ID badge',
        example: 'STU-123456',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FiveRightsDataDto.prototype, "studentBarcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Confirmation that patient photo was visually verified',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FiveRightsDataDto.prototype, "patientPhotoConfirmed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Medication NDC (National Drug Code) scanned from package',
        example: '12345-678-90',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FiveRightsDataDto.prototype, "medicationNDC", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Medication barcode scanned from package',
        example: '312345678901',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FiveRightsDataDto.prototype, "medicationBarcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Confirmation that LASA (Look-Alike Sound-Alike) warnings were reviewed',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FiveRightsDataDto.prototype, "lasaConfirmed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Dose scanned or measured for administration',
        example: '200mg',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FiveRightsDataDto.prototype, "scannedDose", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Calculated dose based on patient weight/age (if applicable)',
        example: '200mg',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FiveRightsDataDto.prototype, "calculatedDose", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether dose calculator was used for calculation',
        example: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FiveRightsDataDto.prototype, "doseCalculatorUsed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Route of administration',
        enum: AdministrationRoute,
        example: AdministrationRoute.ORAL,
    }),
    (0, class_validator_1.IsEnum)(AdministrationRoute),
    __metadata("design:type", String)
], FiveRightsDataDto.prototype, "route", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Actual time of administration',
        example: '2025-11-04T10:30:00Z',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], FiveRightsDataDto.prototype, "administrationTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether administration time is within scheduled window',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FiveRightsDataDto.prototype, "withinWindow", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for time override if outside window',
        example: 'Student was in class, administered as soon as they arrived',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FiveRightsDataDto.prototype, "timeOverrideReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Confirmation that allergy warnings were reviewed and acknowledged',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FiveRightsDataDto.prototype, "allergyAcknowledged", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of allergy warnings displayed to administrator',
        type: [String],
        required: false,
        example: ['Penicillin allergy on file', 'No known interactions'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], FiveRightsDataDto.prototype, "allergyWarnings", void 0);
class VerifyFiveRightsDto {
    sessionId;
    fiveRightsData;
    static _OPENAPI_METADATA_FACTORY() {
        return { sessionId: { required: true, type: () => String }, fiveRightsData: { required: true, type: () => require("./five-rights-verification.dto").FiveRightsDataDto } };
    }
}
exports.VerifyFiveRightsDto = VerifyFiveRightsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Administration session ID from initiation',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyFiveRightsDto.prototype, "sessionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Five Rights verification data',
        type: FiveRightsDataDto,
    }),
    __metadata("design:type", FiveRightsDataDto)
], VerifyFiveRightsDto.prototype, "fiveRightsData", void 0);
class FiveRightsVerificationResultDto {
    valid;
    errors;
    warnings;
    criticalWarnings;
    canProceed;
    requiresOverride;
    overrideRequirements;
    static _OPENAPI_METADATA_FACTORY() {
        return { valid: { required: true, type: () => Boolean }, errors: { required: true, type: () => [String] }, warnings: { required: true, type: () => [String] }, criticalWarnings: { required: true, type: () => [String] }, canProceed: { required: true, type: () => Boolean }, requiresOverride: { required: true, type: () => Boolean }, overrideRequirements: { required: false, type: () => ({ supervisorApproval: { required: true, type: () => Boolean }, documentation: { required: true, type: () => [String] } }) } };
    }
}
exports.FiveRightsVerificationResultDto = FiveRightsVerificationResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether all Five Rights verification passed',
        example: true,
    }),
    __metadata("design:type", Boolean)
], FiveRightsVerificationResultDto.prototype, "valid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of validation errors',
        type: [String],
        example: [],
    }),
    __metadata("design:type", Array)
], FiveRightsVerificationResultDto.prototype, "errors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of non-critical warnings',
        type: [String],
        example: ['Administration slightly outside scheduled window'],
    }),
    __metadata("design:type", Array)
], FiveRightsVerificationResultDto.prototype, "warnings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of critical warnings requiring immediate attention',
        type: [String],
        example: [],
    }),
    __metadata("design:type", Array)
], FiveRightsVerificationResultDto.prototype, "criticalWarnings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether administration can proceed',
        example: true,
    }),
    __metadata("design:type", Boolean)
], FiveRightsVerificationResultDto.prototype, "canProceed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether supervisor override is required to proceed',
        example: false,
    }),
    __metadata("design:type", Boolean)
], FiveRightsVerificationResultDto.prototype, "requiresOverride", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Override requirements if override needed',
        required: false,
    }),
    __metadata("design:type", Object)
], FiveRightsVerificationResultDto.prototype, "overrideRequirements", void 0);
//# sourceMappingURL=five-rights-verification.dto.js.map