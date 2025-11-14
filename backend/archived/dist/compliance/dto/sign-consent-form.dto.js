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
exports.SignConsentFormDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SignConsentFormDto {
    consentFormId;
    studentId;
    signedBy;
    relationship;
    signatureData;
    ipAddress;
    static _OPENAPI_METADATA_FACTORY() {
        return { consentFormId: { required: true, type: () => String }, studentId: { required: true, type: () => String }, signedBy: { required: true, type: () => String, minLength: 2 }, relationship: { required: true, type: () => String }, signatureData: { required: false, type: () => String, minLength: 10, maxLength: 100000 }, ipAddress: { required: false, type: () => String } };
    }
}
exports.SignConsentFormDto = SignConsentFormDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the consent form being signed',
        example: 'consent-form-uuid-123',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SignConsentFormDto.prototype, "consentFormId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the student for whom consent is given',
        example: 'student-uuid-456',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SignConsentFormDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Full name of person signing the consent form',
        example: 'Jane Marie Doe',
        minLength: 2,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, {
        message: 'Signatory name must be at least 2 characters for legal validity',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SignConsentFormDto.prototype, "signedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Relationship to student from authorized list',
        example: 'Mother',
        enum: [
            'Mother',
            'Father',
            'Parent',
            'Legal Guardian',
            'Foster Parent',
            'Grandparent',
            'Stepparent',
            'Other Authorized Adult',
        ],
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SignConsentFormDto.prototype, "relationship", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Base64-encoded digital signature image (10-100,000 bytes)',
        example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.MaxLength)(100000),
    __metadata("design:type", String)
], SignConsentFormDto.prototype, "signatureData", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'IP address of signing device for audit trail',
        example: '192.168.1.100',
    }),
    (0, class_validator_1.IsIP)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SignConsentFormDto.prototype, "ipAddress", void 0);
//# sourceMappingURL=sign-consent-form.dto.js.map