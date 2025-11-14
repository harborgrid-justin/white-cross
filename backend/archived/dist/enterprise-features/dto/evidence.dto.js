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
exports.EvidenceFileResponseDto = exports.DeleteEvidenceDto = exports.UploadEvidenceDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UploadEvidenceDto {
    incidentId;
    fileData;
    type;
    uploadedBy;
    static _OPENAPI_METADATA_FACTORY() {
        return { incidentId: { required: true, type: () => String }, fileData: { required: true, type: () => String }, type: { required: true, type: () => Object }, uploadedBy: { required: true, type: () => String } };
    }
}
exports.UploadEvidenceDto = UploadEvidenceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Incident ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UploadEvidenceDto.prototype, "incidentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Base64 encoded file data' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UploadEvidenceDto.prototype, "fileData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['photo', 'video'], description: 'Type of evidence' }),
    (0, class_validator_1.IsEnum)(['photo', 'video']),
    __metadata("design:type", String)
], UploadEvidenceDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User uploading the evidence' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UploadEvidenceDto.prototype, "uploadedBy", void 0);
class DeleteEvidenceDto {
    evidenceId;
    deletedBy;
    reason;
    static _OPENAPI_METADATA_FACTORY() {
        return { evidenceId: { required: true, type: () => String }, deletedBy: { required: true, type: () => String }, reason: { required: true, type: () => String } };
    }
}
exports.DeleteEvidenceDto = DeleteEvidenceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Evidence ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeleteEvidenceDto.prototype, "evidenceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User deleting the evidence' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeleteEvidenceDto.prototype, "deletedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Reason for deletion' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeleteEvidenceDto.prototype, "reason", void 0);
class EvidenceFileResponseDto {
    id;
    incidentId;
    type;
    filename;
    url;
    metadata;
    uploadedBy;
    uploadedAt;
    securityLevel;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, incidentId: { required: true, type: () => String }, type: { required: true, type: () => Object }, filename: { required: true, type: () => String }, url: { required: true, type: () => String }, metadata: { required: true, type: () => ({ fileSize: { required: true, type: () => Number }, mimeType: { required: true, type: () => String }, duration: { required: false, type: () => Number }, dimensions: { required: false, type: () => ({ width: { required: true, type: () => Number }, height: { required: true, type: () => Number } }) } }) }, uploadedBy: { required: true, type: () => String }, uploadedAt: { required: true, type: () => Date }, securityLevel: { required: true, type: () => Object } };
    }
}
exports.EvidenceFileResponseDto = EvidenceFileResponseDto;
//# sourceMappingURL=evidence.dto.js.map