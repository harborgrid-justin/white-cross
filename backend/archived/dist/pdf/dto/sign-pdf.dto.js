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
exports.SignPdfDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class SignPdfDto {
    pdfBuffer;
    certificateData;
    signatureName;
    signatureReason;
    signatureLocation;
    static _OPENAPI_METADATA_FACTORY() {
        return { pdfBuffer: { required: true, type: () => String }, certificateData: { required: false, type: () => String }, signatureName: { required: false, type: () => String }, signatureReason: { required: false, type: () => String }, signatureLocation: { required: false, type: () => String } };
    }
}
exports.SignPdfDto = SignPdfDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Base64-encoded PDF buffer' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SignPdfDto.prototype, "pdfBuffer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Certificate data (base64)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SignPdfDto.prototype, "certificateData", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Signature name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SignPdfDto.prototype, "signatureName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Signature reason' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SignPdfDto.prototype, "signatureReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Signature location' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SignPdfDto.prototype, "signatureLocation", void 0);
//# sourceMappingURL=sign-pdf.dto.js.map