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
exports.SessionKeysListDto = exports.ListSessionKeysDto = exports.KeyExpirationDto = exports.CheckKeyExpirationDto = exports.EncryptionConfigDto = exports.EncryptionOptionsDto = exports.RotateSessionKeyDto = exports.SessionKeyInfoDto = exports.GetSessionKeyDto = exports.SessionKeyDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class SessionKeyDto {
    id;
    key;
    conversationId;
    createdAt;
    expiresAt;
    version;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, key: { required: true, type: () => String }, conversationId: { required: true, type: () => String }, createdAt: { required: true, type: () => Number }, expiresAt: { required: true, type: () => Number }, version: { required: true, type: () => Number } };
    }
}
exports.SessionKeyDto = SessionKeyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique session key identifier',
        example: 'session_conv123_1635789012345_a1b2c3d4',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SessionKeyDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Base64-encoded key material (never log this!)',
        example: 'a2V5bWF0ZXJpYWw=',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SessionKeyDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Conversation identifier',
        example: 'conv-abc123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SessionKeyDto.prototype, "conversationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When key was created (Unix timestamp)',
        example: 1635789012345,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SessionKeyDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When key expires (Unix timestamp)',
        example: 1635875412345,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SessionKeyDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Key version for rotation tracking',
        example: 1,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SessionKeyDto.prototype, "version", void 0);
class GetSessionKeyDto {
    conversationId;
    keyTTL;
    skipCache;
    static _OPENAPI_METADATA_FACTORY() {
        return { conversationId: { required: true, type: () => String }, keyTTL: { required: false, type: () => Number, minimum: 60, maximum: 604800 }, skipCache: { required: false, type: () => Boolean } };
    }
}
exports.GetSessionKeyDto = GetSessionKeyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Conversation identifier',
        example: 'conv-abc123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetSessionKeyDto.prototype, "conversationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom TTL for session key in seconds',
        example: 86400,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(60),
    (0, class_validator_1.Max)(604800),
    __metadata("design:type", Number)
], GetSessionKeyDto.prototype, "keyTTL", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to skip cache and generate new key',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GetSessionKeyDto.prototype, "skipCache", void 0);
class SessionKeyInfoDto {
    id;
    conversationId;
    createdAt;
    expiresAt;
    version;
    isValid;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, conversationId: { required: true, type: () => String }, createdAt: { required: true, type: () => Number }, expiresAt: { required: true, type: () => Number }, version: { required: true, type: () => Number }, isValid: { required: true, type: () => Boolean } };
    }
}
exports.SessionKeyInfoDto = SessionKeyInfoDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique session key identifier',
        example: 'session_conv123_1635789012345_a1b2c3d4',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SessionKeyInfoDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Conversation identifier',
        example: 'conv-abc123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SessionKeyInfoDto.prototype, "conversationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When key was created (Unix timestamp)',
        example: 1635789012345,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SessionKeyInfoDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When key expires (Unix timestamp)',
        example: 1635875412345,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SessionKeyInfoDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Key version',
        example: 1,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SessionKeyInfoDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether key is still valid',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SessionKeyInfoDto.prototype, "isValid", void 0);
class RotateSessionKeyDto {
    conversationId;
    reason;
    static _OPENAPI_METADATA_FACTORY() {
        return { conversationId: { required: true, type: () => String }, reason: { required: false, type: () => String } };
    }
}
exports.RotateSessionKeyDto = RotateSessionKeyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Conversation identifier',
        example: 'conv-abc123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RotateSessionKeyDto.prototype, "conversationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason for rotation',
        example: 'Scheduled rotation',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RotateSessionKeyDto.prototype, "reason", void 0);
class EncryptionOptionsDto {
    keyId;
    conversationId;
    aad;
    skipCache;
    keyTTL;
    static _OPENAPI_METADATA_FACTORY() {
        return { keyId: { required: false, type: () => String }, conversationId: { required: false, type: () => String }, aad: { required: false, type: () => String }, skipCache: { required: false, type: () => Boolean }, keyTTL: { required: false, type: () => Number, minimum: 60, maximum: 604800 } };
    }
}
exports.EncryptionOptionsDto = EncryptionOptionsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Key identifier',
        example: 'session_conv123_1635789012345_a1b2c3d4',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EncryptionOptionsDto.prototype, "keyId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Conversation identifier',
        example: 'conv-abc123',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EncryptionOptionsDto.prototype, "conversationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional authenticated data',
        example: 'user123:conv-abc123',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EncryptionOptionsDto.prototype, "aad", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to skip cache',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], EncryptionOptionsDto.prototype, "skipCache", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom TTL for key in seconds',
        example: 86400,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(60),
    (0, class_validator_1.Max)(604800),
    __metadata("design:type", Number)
], EncryptionOptionsDto.prototype, "keyTTL", void 0);
class EncryptionConfigDto {
    enabled;
    algorithm;
    rsaKeySize;
    sessionKeyTTL;
    enableKeyRotation;
    keyRotationInterval;
    version;
    static _OPENAPI_METADATA_FACTORY() {
        return { enabled: { required: true, type: () => Boolean }, algorithm: { required: true, type: () => String }, rsaKeySize: { required: true, type: () => Number }, sessionKeyTTL: { required: true, type: () => Number }, enableKeyRotation: { required: true, type: () => Boolean }, keyRotationInterval: { required: true, type: () => Number }, version: { required: true, type: () => String } };
    }
}
exports.EncryptionConfigDto = EncryptionConfigDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether encryption is enabled',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], EncryptionConfigDto.prototype, "enabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Encryption algorithm',
        example: 'aes-256-gcm',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EncryptionConfigDto.prototype, "algorithm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'RSA key size in bits',
        example: 4096,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EncryptionConfigDto.prototype, "rsaKeySize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Default session key TTL in seconds',
        example: 86400,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EncryptionConfigDto.prototype, "sessionKeyTTL", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether key rotation is enabled',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], EncryptionConfigDto.prototype, "enableKeyRotation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Key rotation interval in seconds',
        example: 604800,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EncryptionConfigDto.prototype, "keyRotationInterval", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Encryption implementation version',
        example: '1.0.0',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EncryptionConfigDto.prototype, "version", void 0);
class CheckKeyExpirationDto {
    keyId;
    static _OPENAPI_METADATA_FACTORY() {
        return { keyId: { required: true, type: () => String } };
    }
}
exports.CheckKeyExpirationDto = CheckKeyExpirationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Key identifier to check',
        example: 'session_conv123_1635789012345_a1b2c3d4',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckKeyExpirationDto.prototype, "keyId", void 0);
class KeyExpirationDto {
    keyId;
    expired;
    expiresAt;
    timeUntilExpiration;
    static _OPENAPI_METADATA_FACTORY() {
        return { keyId: { required: true, type: () => String }, expired: { required: true, type: () => Boolean }, expiresAt: { required: true, type: () => Number }, timeUntilExpiration: { required: false, type: () => Number } };
    }
}
exports.KeyExpirationDto = KeyExpirationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Key identifier',
        example: 'session_conv123_1635789012345_a1b2c3d4',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KeyExpirationDto.prototype, "keyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether key has expired',
        example: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], KeyExpirationDto.prototype, "expired", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Expiration timestamp',
        example: 1635875412345,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], KeyExpirationDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Time until expiration in seconds',
        example: 82800,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], KeyExpirationDto.prototype, "timeUntilExpiration", void 0);
class ListSessionKeysDto {
    conversationId;
    includeExpired;
    limit;
    static _OPENAPI_METADATA_FACTORY() {
        return { conversationId: { required: false, type: () => String }, includeExpired: { required: false, type: () => Boolean }, limit: { required: false, type: () => Number, minimum: 1, maximum: 100 } };
    }
}
exports.ListSessionKeysDto = ListSessionKeysDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by conversation ID',
        example: 'conv-abc123',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ListSessionKeysDto.prototype, "conversationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include expired keys',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ListSessionKeysDto.prototype, "includeExpired", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum number of keys to return',
        example: 50,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], ListSessionKeysDto.prototype, "limit", void 0);
class SessionKeysListDto {
    keys;
    total;
    active;
    expired;
    static _OPENAPI_METADATA_FACTORY() {
        return { keys: { required: true, type: () => [require("./encryption-keys.dto").SessionKeyInfoDto] }, total: { required: true, type: () => Number }, active: { required: true, type: () => Number }, expired: { required: true, type: () => Number } };
    }
}
exports.SessionKeysListDto = SessionKeysListDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of session key info',
        type: [SessionKeyInfoDto],
    }),
    __metadata("design:type", Array)
], SessionKeysListDto.prototype, "keys", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of keys',
        example: 42,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SessionKeysListDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of active keys',
        example: 38,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SessionKeysListDto.prototype, "active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of expired keys',
        example: 4,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SessionKeysListDto.prototype, "expired", void 0);
//# sourceMappingURL=encryption-keys.dto.js.map