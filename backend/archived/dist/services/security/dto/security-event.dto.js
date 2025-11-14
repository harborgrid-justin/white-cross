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
exports.ThreatDetectionDto = exports.SecurityEventDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SecurityEventDto {
    eventType;
    description;
    userId;
    ipAddress;
    metadata;
    static _OPENAPI_METADATA_FACTORY() {
        return { eventType: { required: true, type: () => String }, description: { required: true, type: () => String }, userId: { required: false, type: () => String }, ipAddress: { required: false, type: () => String }, metadata: { required: false, type: () => Object } };
    }
}
exports.SecurityEventDto = SecurityEventDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event type' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SecurityEventDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SecurityEventDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User ID associated with the event' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SecurityEventDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'IP address' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SecurityEventDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional event metadata' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], SecurityEventDto.prototype, "metadata", void 0);
class ThreatDetectionDto {
    detected;
    threatType;
    details;
    confidence;
    static _OPENAPI_METADATA_FACTORY() {
        return { detected: { required: true, type: () => Boolean }, threatType: { required: true, type: () => String }, details: { required: false, type: () => String }, confidence: { required: false, type: () => Number } };
    }
}
exports.ThreatDetectionDto = ThreatDetectionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Threat detected flag' }),
    __metadata("design:type", Boolean)
], ThreatDetectionDto.prototype, "detected", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Threat type' }),
    __metadata("design:type", String)
], ThreatDetectionDto.prototype, "threatType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Threat details' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ThreatDetectionDto.prototype, "details", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Confidence score (0-1)' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ThreatDetectionDto.prototype, "confidence", void 0);
//# sourceMappingURL=security-event.dto.js.map