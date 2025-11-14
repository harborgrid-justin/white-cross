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
exports.ResetPasswordResponseDto = exports.VerifyResetTokenDto = exports.ResetPasswordDto = exports.ForgotPasswordDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ForgotPasswordDto {
    email;
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String, format: "email" } };
    }
}
exports.ForgotPasswordDto = ForgotPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email address of the user requesting password reset',
        example: 'nurse@school.edu',
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'Invalid email format' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);
class ResetPasswordDto {
    token;
    password;
    static _OPENAPI_METADATA_FACTORY() {
        return { token: { required: true, type: () => String }, password: { required: true, type: () => String, minLength: 8, pattern: "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]/" } };
    }
}
exports.ResetPasswordDto = ResetPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Password reset token from email',
        example: 'abc123def456ghi789',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New password (min 8 chars, must include uppercase, lowercase, number, special char)',
        example: 'NewSecurePass123!',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long' }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        message: 'Password must contain uppercase, lowercase, number, and special character',
    }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "password", void 0);
class VerifyResetTokenDto {
    token;
    static _OPENAPI_METADATA_FACTORY() {
        return { token: { required: true, type: () => String } };
    }
}
exports.VerifyResetTokenDto = VerifyResetTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Password reset token to verify',
        example: 'abc123def456ghi789',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VerifyResetTokenDto.prototype, "token", void 0);
class ResetPasswordResponseDto {
    message;
    success;
    static _OPENAPI_METADATA_FACTORY() {
        return { message: { required: true, type: () => String }, success: { required: true, type: () => Boolean } };
    }
}
exports.ResetPasswordResponseDto = ResetPasswordResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Success message',
        example: 'Password has been reset successfully',
    }),
    __metadata("design:type", String)
], ResetPasswordResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the operation was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ResetPasswordResponseDto.prototype, "success", void 0);
//# sourceMappingURL=password-reset.dto.js.map