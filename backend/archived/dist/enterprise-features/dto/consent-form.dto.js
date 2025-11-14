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
exports.ConsentFormResponseDto = exports.RenewConsentFormDto = exports.RevokeConsentDto = exports.VerifySignatureDto = exports.SignFormDto = exports.CreateConsentFormDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateConsentFormDto {
    studentId;
    formType;
    content;
    expiresAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { studentId: { required: true, type: () => String }, formType: { required: true, type: () => String }, content: { required: true, type: () => String }, expiresAt: { required: false, type: () => String } };
    }
}
exports.CreateConsentFormDto = CreateConsentFormDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Student ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConsentFormDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of consent form' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConsentFormDto.prototype, "formType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Form content/text' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConsentFormDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Expiration date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateConsentFormDto.prototype, "expiresAt", void 0);
class SignFormDto {
    formId;
    signedBy;
    signature;
    ipAddress;
    userAgent;
    static _OPENAPI_METADATA_FACTORY() {
        return { formId: { required: true, type: () => String }, signedBy: { required: true, type: () => String }, signature: { required: true, type: () => String }, ipAddress: { required: false, type: () => String }, userAgent: { required: false, type: () => String } };
    }
}
exports.SignFormDto = SignFormDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Form ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignFormDto.prototype, "formId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of person signing' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignFormDto.prototype, "signedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Digital signature data' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignFormDto.prototype, "signature", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'IP address of signer' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignFormDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Browser user agent' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignFormDto.prototype, "userAgent", void 0);
class VerifySignatureDto {
    formId;
    signature;
    static _OPENAPI_METADATA_FACTORY() {
        return { formId: { required: true, type: () => String }, signature: { required: true, type: () => String } };
    }
}
exports.VerifySignatureDto = VerifySignatureDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Form ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifySignatureDto.prototype, "formId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Signature to verify' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifySignatureDto.prototype, "signature", void 0);
class RevokeConsentDto {
    formId;
    revokedBy;
    reason;
    static _OPENAPI_METADATA_FACTORY() {
        return { formId: { required: true, type: () => String }, revokedBy: { required: true, type: () => String }, reason: { required: true, type: () => String } };
    }
}
exports.RevokeConsentDto = RevokeConsentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Form ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RevokeConsentDto.prototype, "formId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User revoking consent' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RevokeConsentDto.prototype, "revokedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reason for revocation' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RevokeConsentDto.prototype, "reason", void 0);
class RenewConsentFormDto {
    formId;
    extendedBy;
    additionalYears;
    static _OPENAPI_METADATA_FACTORY() {
        return { formId: { required: true, type: () => String }, extendedBy: { required: true, type: () => String }, additionalYears: { required: false, type: () => Number } };
    }
}
exports.RenewConsentFormDto = RenewConsentFormDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Form ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RenewConsentFormDto.prototype, "formId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User renewing the form' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RenewConsentFormDto.prototype, "extendedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of years to extend' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RenewConsentFormDto.prototype, "additionalYears", void 0);
class ConsentFormResponseDto {
    id;
    studentId;
    formType;
    status;
    content;
    signedBy;
    signedAt;
    expiresAt;
    createdAt;
    digitalSignature;
    version;
    metadata;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, studentId: { required: true, type: () => String }, formType: { required: true, type: () => String }, status: { required: true, type: () => Object }, content: { required: true, type: () => String }, signedBy: { required: false, type: () => String }, signedAt: { required: false, type: () => Date }, expiresAt: { required: false, type: () => Date }, createdAt: { required: false, type: () => Date }, digitalSignature: { required: false, type: () => String }, version: { required: false, type: () => String }, metadata: { required: false, type: () => Object } };
    }
}
exports.ConsentFormResponseDto = ConsentFormResponseDto;
//# sourceMappingURL=consent-form.dto.js.map