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
exports.MfaRegenerateBackupCodesDto = exports.MfaStatusDto = exports.MfaDisableDto = exports.MfaEnableDto = exports.MfaVerifyDto = exports.MfaSetupResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class MfaSetupResponseDto {
    secret;
    qrCode;
    backupCodes;
    manualEntryKey;
    static _OPENAPI_METADATA_FACTORY() {
        return { secret: { required: true, type: () => String }, qrCode: { required: true, type: () => String }, backupCodes: { required: true, type: () => [String] }, manualEntryKey: { required: true, type: () => String } };
    }
}
exports.MfaSetupResponseDto = MfaSetupResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Secret key for TOTP configuration',
        example: 'JBSWY3DPEHPK3PXP',
    }),
    __metadata("design:type", String)
], MfaSetupResponseDto.prototype, "secret", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'QR code as data URL for scanning with authenticator app',
        example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
    }),
    __metadata("design:type", String)
], MfaSetupResponseDto.prototype, "qrCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Backup codes for account recovery',
        example: ['12345678', '87654321', '11223344'],
        type: [String],
    }),
    __metadata("design:type", Array)
], MfaSetupResponseDto.prototype, "backupCodes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Manual entry key for authenticator apps',
        example: 'JBSW Y3DP EHPK 3PXP',
    }),
    __metadata("design:type", String)
], MfaSetupResponseDto.prototype, "manualEntryKey", void 0);
class MfaVerifyDto {
    code;
    isBackupCode;
    static _OPENAPI_METADATA_FACTORY() {
        return { code: { required: true, type: () => String, minLength: 6, maxLength: 6 }, isBackupCode: { required: false, type: () => Boolean } };
    }
}
exports.MfaVerifyDto = MfaVerifyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Six-digit TOTP code from authenticator app',
        example: '123456',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(6, 6, { message: 'Code must be exactly 6 digits' }),
    __metadata("design:type", String)
], MfaVerifyDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether this is a backup code',
        example: false,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], MfaVerifyDto.prototype, "isBackupCode", void 0);
class MfaEnableDto {
    code;
    secret;
    static _OPENAPI_METADATA_FACTORY() {
        return { code: { required: true, type: () => String, minLength: 6, maxLength: 6 }, secret: { required: true, type: () => String } };
    }
}
exports.MfaEnableDto = MfaEnableDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Six-digit TOTP code to verify setup',
        example: '123456',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(6, 6),
    __metadata("design:type", String)
], MfaEnableDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Secret key from setup process',
        example: 'JBSWY3DPEHPK3PXP',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MfaEnableDto.prototype, "secret", void 0);
class MfaDisableDto {
    password;
    code;
    static _OPENAPI_METADATA_FACTORY() {
        return { password: { required: true, type: () => String }, code: { required: false, type: () => String, minLength: 6, maxLength: 6 } };
    }
}
exports.MfaDisableDto = MfaDisableDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current password for security verification',
        example: 'SecurePass123!',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MfaDisableDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Six-digit TOTP code from authenticator app',
        example: '123456',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 6),
    __metadata("design:type", String)
], MfaDisableDto.prototype, "code", void 0);
class MfaStatusDto {
    enabled;
    hasBackupCodes;
    backupCodesRemaining;
    enabledAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { enabled: { required: true, type: () => Boolean }, hasBackupCodes: { required: true, type: () => Boolean }, backupCodesRemaining: { required: true, type: () => Number }, enabledAt: { required: false, type: () => Date } };
    }
}
exports.MfaStatusDto = MfaStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether MFA is enabled for the user',
        example: true,
    }),
    __metadata("design:type", Boolean)
], MfaStatusDto.prototype, "enabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether backup codes are available',
        example: true,
    }),
    __metadata("design:type", Boolean)
], MfaStatusDto.prototype, "hasBackupCodes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of remaining backup codes',
        example: 8,
    }),
    __metadata("design:type", Number)
], MfaStatusDto.prototype, "backupCodesRemaining", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date when MFA was enabled',
        example: '2024-01-15T10:30:00Z',
        required: false,
    }),
    __metadata("design:type", Date)
], MfaStatusDto.prototype, "enabledAt", void 0);
class MfaRegenerateBackupCodesDto {
    password;
    code;
    static _OPENAPI_METADATA_FACTORY() {
        return { password: { required: true, type: () => String }, code: { required: true, type: () => String, minLength: 6, maxLength: 6 } };
    }
}
exports.MfaRegenerateBackupCodesDto = MfaRegenerateBackupCodesDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current password for security verification',
        example: 'SecurePass123!',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MfaRegenerateBackupCodesDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Six-digit TOTP code from authenticator app',
        example: '123456',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(6, 6),
    __metadata("design:type", String)
], MfaRegenerateBackupCodesDto.prototype, "code", void 0);
//# sourceMappingURL=mfa.dto.js.map