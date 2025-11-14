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
exports.EmailVerificationResponseDto = exports.ResendVerificationDto = exports.VerifyEmailDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class VerifyEmailDto {
    token;
    static _OPENAPI_METADATA_FACTORY() {
        return { token: { required: true, type: () => String } };
    }
}
exports.VerifyEmailDto = VerifyEmailDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email verification token from email link',
        example: 'abc123def456ghi789',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VerifyEmailDto.prototype, "token", void 0);
class ResendVerificationDto {
    email;
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String, format: "email" } };
    }
}
exports.ResendVerificationDto = ResendVerificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email address to resend verification to',
        example: 'nurse@school.edu',
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'Invalid email format' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ResendVerificationDto.prototype, "email", void 0);
class EmailVerificationResponseDto {
    message;
    success;
    email;
    static _OPENAPI_METADATA_FACTORY() {
        return { message: { required: true, type: () => String }, success: { required: true, type: () => Boolean }, email: { required: false, type: () => String } };
    }
}
exports.EmailVerificationResponseDto = EmailVerificationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Success message',
        example: 'Email verified successfully',
    }),
    __metadata("design:type", String)
], EmailVerificationResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the operation was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], EmailVerificationResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email address that was verified',
        example: 'nurse@school.edu',
        required: false,
    }),
    __metadata("design:type", String)
], EmailVerificationResponseDto.prototype, "email", void 0);
//# sourceMappingURL=email-verification.dto.js.map