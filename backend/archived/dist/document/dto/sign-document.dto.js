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
exports.SignDocumentDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SignDocumentDto {
    documentId;
    signedBy;
    signedByRole;
    signatureData;
    ipAddress;
    static _OPENAPI_METADATA_FACTORY() {
        return { documentId: { required: true, type: () => String }, signedBy: { required: true, type: () => String }, signedByRole: { required: true, type: () => String, minLength: 2, maxLength: 100 }, signatureData: { required: false, type: () => String }, ipAddress: { required: false, type: () => String } };
    }
}
exports.SignDocumentDto = SignDocumentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of document being signed',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SignDocumentDto.prototype, "documentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID of the signer',
        example: '123e4567-e89b-12d3-a456-426614174001',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SignDocumentDto.prototype, "signedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Role of signer (Nurse, Parent, Administrator, etc.)',
        minLength: 2,
        maxLength: 100,
        example: 'School Nurse',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], SignDocumentDto.prototype, "signedByRole", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Base64-encoded signature image or encrypted signature data',
        example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SignDocumentDto.prototype, "signatureData", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'IP address of signer for audit trail',
        example: '192.168.1.100',
    }),
    (0, class_validator_1.IsIP)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SignDocumentDto.prototype, "ipAddress", void 0);
//# sourceMappingURL=sign-document.dto.js.map