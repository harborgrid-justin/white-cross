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
exports.RateLimitStatusDto = exports.RateLimitConfigDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class RateLimitConfigDto {
    maxMessages;
    windowSeconds;
    identifier;
    static _OPENAPI_METADATA_FACTORY() {
        return { maxMessages: { required: true, type: () => Number, minimum: 1 }, windowSeconds: { required: true, type: () => Number, minimum: 1 }, identifier: { required: true, type: () => String } };
    }
}
exports.RateLimitConfigDto = RateLimitConfigDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum messages per time window',
        example: 10,
        minimum: 1,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], RateLimitConfigDto.prototype, "maxMessages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Time window in seconds',
        example: 60,
        minimum: 1,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], RateLimitConfigDto.prototype, "windowSeconds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Identifier for rate limiting (phone number or account ID)',
        example: '+15551234567',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RateLimitConfigDto.prototype, "identifier", void 0);
class RateLimitStatusDto {
    isLimited;
    currentCount;
    maxMessages;
    remainingMessages;
    resetInSeconds;
    resetAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { isLimited: { required: true, type: () => Boolean }, currentCount: { required: true, type: () => Number }, maxMessages: { required: true, type: () => Number }, remainingMessages: { required: true, type: () => Number }, resetInSeconds: { required: true, type: () => Number }, resetAt: { required: true, type: () => String } };
    }
}
exports.RateLimitStatusDto = RateLimitStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether rate limit is exceeded',
        example: false,
    }),
    __metadata("design:type", Boolean)
], RateLimitStatusDto.prototype, "isLimited", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current message count in window',
        example: 7,
    }),
    __metadata("design:type", Number)
], RateLimitStatusDto.prototype, "currentCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum allowed messages',
        example: 10,
    }),
    __metadata("design:type", Number)
], RateLimitStatusDto.prototype, "maxMessages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Remaining messages in current window',
        example: 3,
    }),
    __metadata("design:type", Number)
], RateLimitStatusDto.prototype, "remainingMessages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Seconds until rate limit resets',
        example: 45,
    }),
    __metadata("design:type", Number)
], RateLimitStatusDto.prototype, "resetInSeconds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp when rate limit resets',
        example: '2025-10-28T15:31:00Z',
    }),
    __metadata("design:type", String)
], RateLimitStatusDto.prototype, "resetAt", void 0);
//# sourceMappingURL=rate-limit.dto.js.map