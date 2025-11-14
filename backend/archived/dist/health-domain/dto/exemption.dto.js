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
exports.ExemptionFilterDto = exports.UpdateExemptionDto = exports.HealthDomainCreateExemptionDto = exports.ExemptionStatus = exports.ExemptionType = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var ExemptionType;
(function (ExemptionType) {
    ExemptionType["MEDICAL"] = "MEDICAL";
    ExemptionType["RELIGIOUS"] = "RELIGIOUS";
    ExemptionType["PHILOSOPHICAL"] = "PHILOSOPHICAL";
    ExemptionType["TEMPORARY"] = "TEMPORARY";
})(ExemptionType || (exports.ExemptionType = ExemptionType = {}));
var ExemptionStatus;
(function (ExemptionStatus) {
    ExemptionStatus["PENDING"] = "PENDING";
    ExemptionStatus["APPROVED"] = "APPROVED";
    ExemptionStatus["DENIED"] = "DENIED";
    ExemptionStatus["EXPIRED"] = "EXPIRED";
    ExemptionStatus["REVOKED"] = "REVOKED";
})(ExemptionStatus || (exports.ExemptionStatus = ExemptionStatus = {}));
class HealthDomainCreateExemptionDto {
    studentId;
    vaccineName;
    cvxCode;
    exemptionType;
    reason;
    providerName;
    providerLicense;
    providerNPI;
    providerSignatureDate;
    expirationDate;
    documentUrl;
    stateFormNumber;
    parentConsent;
    parentName;
    parentConsentDate;
    notes;
    createdBy;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String, format: "uuid" }, vaccineName: { required: true, type: () => String, maxLength: 100 }, cvxCode: { required: false, type: () => String, maxLength: 10 }, exemptionType: { required: true, enum: require("./exemption.dto").ExemptionType }, reason: { required: true, type: () => String, minLength: 10, maxLength: 2000 }, providerName: { required: false, type: () => String, maxLength: 255 }, providerLicense: { required: false, type: () => String, maxLength: 50 }, providerNPI: { required: false, type: () => String, maxLength: 10 }, providerSignatureDate: { required: false, type: () => Date }, expirationDate: { required: false, type: () => Date }, documentUrl: { required: false, type: () => String, maxLength: 500 }, stateFormNumber: { required: false, type: () => String, maxLength: 50 }, parentConsent: { required: false, type: () => Boolean }, parentName: { required: false, type: () => String, maxLength: 255 }, parentConsentDate: { required: false, type: () => Date }, notes: { required: false, type: () => String, maxLength: 2000 }, createdBy: { required: true, type: () => String, format: "uuid" } };
    }
}
exports.HealthDomainCreateExemptionDto = HealthDomainCreateExemptionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student UUID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], HealthDomainCreateExemptionDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Vaccine name or CDC CVX code being exempted',
        example: 'MMR',
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], HealthDomainCreateExemptionDto.prototype, "vaccineName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'CVX code for vaccine (if applicable)',
        example: '03',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], HealthDomainCreateExemptionDto.prototype, "cvxCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of exemption being requested',
        enum: ExemptionType,
        example: ExemptionType.MEDICAL,
    }),
    (0, class_validator_1.IsEnum)(ExemptionType),
    __metadata("design:type", String)
], HealthDomainCreateExemptionDto.prototype, "exemptionType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Detailed reason for exemption',
        example: 'Severe allergic reaction to vaccine component (egg allergy)',
        minLength: 10,
        maxLength: 2000,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], HealthDomainCreateExemptionDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Medical provider name (required for MEDICAL exemptions)',
        example: 'Dr. Jane Smith, MD',
        required: false,
        maxLength: 255,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], HealthDomainCreateExemptionDto.prototype, "providerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Medical provider license number',
        example: 'MD123456',
        required: false,
        maxLength: 50,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], HealthDomainCreateExemptionDto.prototype, "providerLicense", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Provider NPI number (National Provider Identifier)',
        example: '1234567890',
        required: false,
        maxLength: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], HealthDomainCreateExemptionDto.prototype, "providerNPI", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date provider signed exemption (required for MEDICAL)',
        example: '2025-01-15',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], HealthDomainCreateExemptionDto.prototype, "providerSignatureDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Exemption expiration date (permanent if null)',
        example: '2026-01-15',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], HealthDomainCreateExemptionDto.prototype, "expirationDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Supporting document URL or file reference',
        example: 'documents/exemptions/student-123-mmr-exemption.pdf',
        required: false,
        maxLength: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], HealthDomainCreateExemptionDto.prototype, "documentUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'State-specific exemption form reference',
        example: 'CA-PM-286',
        required: false,
        maxLength: 50,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], HealthDomainCreateExemptionDto.prototype, "stateFormNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Parent/guardian consent obtained',
        example: true,
        default: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], HealthDomainCreateExemptionDto.prototype, "parentConsent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Parent/guardian name who provided consent',
        example: 'John Doe',
        required: false,
        maxLength: 255,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], HealthDomainCreateExemptionDto.prototype, "parentName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date parent consent was obtained',
        example: '2025-01-15',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], HealthDomainCreateExemptionDto.prototype, "parentConsentDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional notes or context',
        example: 'Family physician will monitor for future administration possibility',
        required: false,
        maxLength: 2000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], HealthDomainCreateExemptionDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID who created the exemption request',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], HealthDomainCreateExemptionDto.prototype, "createdBy", void 0);
class UpdateExemptionDto extends (0, swagger_1.PartialType)(HealthDomainCreateExemptionDto) {
    status;
    statusChangeReason;
    reviewedBy;
    reviewedDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, enum: require("./exemption.dto").ExemptionStatus }, statusChangeReason: { required: false, type: () => String, maxLength: 1000 }, reviewedBy: { required: false, type: () => String, format: "uuid" }, reviewedDate: { required: false, type: () => Date } };
    }
}
exports.UpdateExemptionDto = UpdateExemptionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Exemption status',
        enum: ExemptionStatus,
        example: ExemptionStatus.APPROVED,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ExemptionStatus),
    __metadata("design:type", String)
], UpdateExemptionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status change reason (required when approving/denying)',
        example: 'Medical documentation verified by school nurse',
        required: false,
        maxLength: 1000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], UpdateExemptionDto.prototype, "statusChangeReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID who reviewed/updated the exemption',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], UpdateExemptionDto.prototype, "reviewedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date exemption was reviewed',
        example: '2025-01-16',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UpdateExemptionDto.prototype, "reviewedDate", void 0);
class ExemptionFilterDto {
    studentId;
    exemptionType;
    status;
    vaccineName;
    includeExpired;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: false, type: () => String, format: "uuid" }, exemptionType: { required: false, enum: require("./exemption.dto").ExemptionType }, status: { required: false, enum: require("./exemption.dto").ExemptionStatus }, vaccineName: { required: false, type: () => String, maxLength: 100 }, includeExpired: { required: false, type: () => Boolean } };
    }
}
exports.ExemptionFilterDto = ExemptionFilterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by student ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], ExemptionFilterDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by exemption type',
        enum: ExemptionType,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ExemptionType),
    __metadata("design:type", String)
], ExemptionFilterDto.prototype, "exemptionType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by exemption status',
        enum: ExemptionStatus,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ExemptionStatus),
    __metadata("design:type", String)
], ExemptionFilterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Filter by vaccine name',
        example: 'MMR',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], ExemptionFilterDto.prototype, "vaccineName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Include expired exemptions',
        example: false,
        default: false,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ExemptionFilterDto.prototype, "includeExpired", void 0);
//# sourceMappingURL=exemption.dto.js.map