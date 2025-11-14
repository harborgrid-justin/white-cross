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
exports.WitnessStatementResponseDto = exports.TranscribeVoiceStatementDto = exports.VerifyStatementDto = exports.CaptureStatementDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CaptureStatementDto {
    incidentId;
    witnessName;
    witnessRole;
    statement;
    captureMethod;
    signature;
    static _OPENAPI_METADATA_FACTORY() {
        return { incidentId: { required: true, type: () => String }, witnessName: { required: true, type: () => String }, witnessRole: { required: true, type: () => Object }, statement: { required: true, type: () => String }, captureMethod: { required: true, type: () => Object }, signature: { required: false, type: () => String } };
    }
}
exports.CaptureStatementDto = CaptureStatementDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Incident ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CaptureStatementDto.prototype, "incidentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of witness' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CaptureStatementDto.prototype, "witnessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['student', 'teacher', 'staff', 'other'],
        description: 'Role of witness',
    }),
    (0, class_validator_1.IsEnum)(['student', 'teacher', 'staff', 'other']),
    __metadata("design:type", String)
], CaptureStatementDto.prototype, "witnessRole", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Statement text' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CaptureStatementDto.prototype, "statement", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['typed', 'voice-to-text', 'handwritten-scan'],
        description: 'How statement was captured',
    }),
    (0, class_validator_1.IsEnum)(['typed', 'voice-to-text', 'handwritten-scan']),
    __metadata("design:type", String)
], CaptureStatementDto.prototype, "captureMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Digital signature' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CaptureStatementDto.prototype, "signature", void 0);
class VerifyStatementDto {
    statementId;
    verifiedBy;
    static _OPENAPI_METADATA_FACTORY() {
        return { statementId: { required: true, type: () => String }, verifiedBy: { required: true, type: () => String } };
    }
}
exports.VerifyStatementDto = VerifyStatementDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Statement ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyStatementDto.prototype, "statementId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User verifying the statement' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyStatementDto.prototype, "verifiedBy", void 0);
class TranscribeVoiceStatementDto {
    audioData;
    static _OPENAPI_METADATA_FACTORY() {
        return { audioData: { required: true, type: () => String } };
    }
}
exports.TranscribeVoiceStatementDto = TranscribeVoiceStatementDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Base64 encoded audio data' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TranscribeVoiceStatementDto.prototype, "audioData", void 0);
class WitnessStatementResponseDto {
    id;
    incidentId;
    witnessName;
    witnessRole;
    statement;
    captureMethod;
    timestamp;
    signature;
    verified;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, incidentId: { required: true, type: () => String }, witnessName: { required: true, type: () => String }, witnessRole: { required: true, type: () => Object }, statement: { required: true, type: () => String }, captureMethod: { required: true, type: () => Object }, timestamp: { required: true, type: () => Date }, signature: { required: false, type: () => String }, verified: { required: true, type: () => Boolean } };
    }
}
exports.WitnessStatementResponseDto = WitnessStatementResponseDto;
//# sourceMappingURL=witness-statement.dto.js.map