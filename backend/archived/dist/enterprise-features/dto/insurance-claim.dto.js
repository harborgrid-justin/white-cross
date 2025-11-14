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
exports.InsuranceClaimResponseDto = exports.SubmitClaimDto = exports.ExportClaimDto = exports.GenerateClaimDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class GenerateClaimDto {
    incidentId;
    studentId;
    static _OPENAPI_METADATA_FACTORY() {
        return { incidentId: { required: true, type: () => String }, studentId: { required: true, type: () => String } };
    }
}
exports.GenerateClaimDto = GenerateClaimDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Incident ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateClaimDto.prototype, "incidentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Student ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateClaimDto.prototype, "studentId", void 0);
class ExportClaimDto {
    claimId;
    format;
    static _OPENAPI_METADATA_FACTORY() {
        return { claimId: { required: true, type: () => String }, format: { required: true, type: () => Object } };
    }
}
exports.ExportClaimDto = ExportClaimDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Claim ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExportClaimDto.prototype, "claimId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['pdf', 'xml', 'edi'], description: 'Export format' }),
    (0, class_validator_1.IsEnum)(['pdf', 'xml', 'edi']),
    __metadata("design:type", String)
], ExportClaimDto.prototype, "format", void 0);
class SubmitClaimDto {
    claimId;
    static _OPENAPI_METADATA_FACTORY() {
        return { claimId: { required: true, type: () => String } };
    }
}
exports.SubmitClaimDto = SubmitClaimDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Claim ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitClaimDto.prototype, "claimId", void 0);
class InsuranceClaimResponseDto {
    id;
    incidentId;
    studentId;
    claimNumber;
    insuranceProvider;
    claimAmount;
    status;
    submittedAt;
    documents;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, incidentId: { required: true, type: () => String }, studentId: { required: true, type: () => String }, claimNumber: { required: true, type: () => String }, insuranceProvider: { required: true, type: () => String }, claimAmount: { required: true, type: () => Number }, status: { required: true, type: () => Object }, submittedAt: { required: false, type: () => Date }, documents: { required: true, type: () => [String] } };
    }
}
exports.InsuranceClaimResponseDto = InsuranceClaimResponseDto;
//# sourceMappingURL=insurance-claim.dto.js.map