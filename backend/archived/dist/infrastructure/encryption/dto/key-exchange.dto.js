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
exports.KeyValidityDto = exports.CheckKeysDto = exports.KeyMetadataDto = exports.DecryptWithPrivateKeyDto = exports.EncryptedDataDto = exports.EncryptWithPublicKeyDto = exports.RevokeKeysDto = exports.RotateKeysDto = exports.PublicKeyDto = exports.GetPublicKeyDto = exports.KeyPairDto = exports.GenerateKeyPairDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const interfaces_1 = require("../interfaces");
class GenerateKeyPairDto {
    userId;
    keySize;
    expirationTime;
    cache;
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: true, type: () => String }, keySize: { required: false, type: () => Object, minimum: 2048, maximum: 4096 }, expirationTime: { required: false, type: () => Number, minimum: 0 }, cache: { required: false, type: () => Boolean } };
    }
}
exports.GenerateKeyPairDto = GenerateKeyPairDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID to generate keys for',
        example: 'user-123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateKeyPairDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'RSA key size in bits',
        example: 4096,
        enum: [2048, 4096],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(2048),
    (0, class_validator_1.Max)(4096),
    __metadata("design:type", Number)
], GenerateKeyPairDto.prototype, "keySize", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Key expiration time in seconds',
        example: 31536000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], GenerateKeyPairDto.prototype, "expirationTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to cache the keys',
        example: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], GenerateKeyPairDto.prototype, "cache", void 0);
class KeyPairDto {
    publicKey;
    keyId;
    keySize;
    createdAt;
    expiresAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { publicKey: { required: true, type: () => String }, keyId: { required: true, type: () => String }, keySize: { required: true, type: () => Number }, createdAt: { required: true, type: () => Number }, expiresAt: { required: false, type: () => Number } };
    }
}
exports.KeyPairDto = KeyPairDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Public key in PEM format',
        example: '-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KeyPairDto.prototype, "publicKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique key identifier',
        example: 'key_user123_1635789012345_a1b2c3d4',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KeyPairDto.prototype, "keyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Key size in bits',
        example: 4096,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], KeyPairDto.prototype, "keySize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When the key was created (Unix timestamp)',
        example: 1635789012345,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], KeyPairDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'When the key expires (Unix timestamp)',
        example: 1667325012345,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], KeyPairDto.prototype, "expiresAt", void 0);
class GetPublicKeyDto {
    userId;
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: true, type: () => String } };
    }
}
exports.GetPublicKeyDto = GetPublicKeyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID to get public key for',
        example: 'user-123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetPublicKeyDto.prototype, "userId", void 0);
class PublicKeyDto {
    userId;
    publicKey;
    keyId;
    status;
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: true, type: () => String }, publicKey: { required: true, type: () => String }, keyId: { required: true, type: () => String }, status: { required: true, enum: require("../interfaces/key-management.interfaces").KeyStatus } };
    }
}
exports.PublicKeyDto = PublicKeyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID',
        example: 'user-123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PublicKeyDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Public key in PEM format',
        example: '-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PublicKeyDto.prototype, "publicKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Key identifier',
        example: 'key_user123_1635789012345_a1b2c3d4',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PublicKeyDto.prototype, "keyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Key status',
        enum: interfaces_1.KeyStatus,
        example: interfaces_1.KeyStatus.ACTIVE,
    }),
    (0, class_validator_1.IsEnum)(interfaces_1.KeyStatus),
    __metadata("design:type", String)
], PublicKeyDto.prototype, "status", void 0);
class RotateKeysDto {
    userId;
    gracePeriod;
    revokeOldKey;
    reason;
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: true, type: () => String }, gracePeriod: { required: false, type: () => Number, minimum: 0 }, revokeOldKey: { required: false, type: () => Boolean }, reason: { required: false, type: () => String } };
    }
}
exports.RotateKeysDto = RotateKeysDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID to rotate keys for',
        example: 'user-123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RotateKeysDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Grace period for old key in seconds',
        example: 86400,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], RotateKeysDto.prototype, "gracePeriod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to immediately revoke old key',
        example: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], RotateKeysDto.prototype, "revokeOldKey", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reason for rotation',
        example: 'Scheduled rotation',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RotateKeysDto.prototype, "reason", void 0);
class RevokeKeysDto {
    userId;
    reason;
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: true, type: () => String }, reason: { required: true, type: () => String } };
    }
}
exports.RevokeKeysDto = RevokeKeysDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID to revoke keys for',
        example: 'user-123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RevokeKeysDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for revocation',
        example: 'Security breach',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RevokeKeysDto.prototype, "reason", void 0);
class EncryptWithPublicKeyDto {
    data;
    recipientUserId;
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true, type: () => String }, recipientUserId: { required: true, type: () => String } };
    }
}
exports.EncryptWithPublicKeyDto = EncryptWithPublicKeyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data to encrypt',
        example: 'Sensitive data',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EncryptWithPublicKeyDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID whose public key to use',
        example: 'user-456',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EncryptWithPublicKeyDto.prototype, "recipientUserId", void 0);
class EncryptedDataDto {
    encryptedData;
    keyId;
    recipientUserId;
    static _OPENAPI_METADATA_FACTORY() {
        return { encryptedData: { required: true, type: () => String }, keyId: { required: true, type: () => String }, recipientUserId: { required: true, type: () => String } };
    }
}
exports.EncryptedDataDto = EncryptedDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Encrypted data in base64',
        example: 'ZW5jcnlwdGVkZGF0YQ==',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EncryptedDataDto.prototype, "encryptedData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Key ID used for encryption',
        example: 'key_user456_1635789012345_a1b2c3d4',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EncryptedDataDto.prototype, "keyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Recipient user ID',
        example: 'user-456',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EncryptedDataDto.prototype, "recipientUserId", void 0);
class DecryptWithPrivateKeyDto {
    encryptedData;
    userId;
    passphrase;
    static _OPENAPI_METADATA_FACTORY() {
        return { encryptedData: { required: true, type: () => String }, userId: { required: true, type: () => String }, passphrase: { required: true, type: () => String } };
    }
}
exports.DecryptWithPrivateKeyDto = DecryptWithPrivateKeyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Encrypted data in base64',
        example: 'ZW5jcnlwdGVkZGF0YQ==',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DecryptWithPrivateKeyDto.prototype, "encryptedData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID whose private key to use',
        example: 'user-123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DecryptWithPrivateKeyDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Passphrase to decrypt private key',
        example: 'my-secure-passphrase',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DecryptWithPrivateKeyDto.prototype, "passphrase", void 0);
class KeyMetadataDto {
    keyId;
    userId;
    keyType;
    status;
    version;
    createdAt;
    expiresAt;
    algorithm;
    static _OPENAPI_METADATA_FACTORY() {
        return { keyId: { required: true, type: () => String }, userId: { required: true, type: () => String }, keyType: { required: true, enum: require("../interfaces/key-management.interfaces").KeyType }, status: { required: true, enum: require("../interfaces/key-management.interfaces").KeyStatus }, version: { required: true, type: () => Number }, createdAt: { required: true, type: () => Number }, expiresAt: { required: false, type: () => Number }, algorithm: { required: true, type: () => String } };
    }
}
exports.KeyMetadataDto = KeyMetadataDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique key identifier',
        example: 'key_user123_1635789012345_a1b2c3d4',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KeyMetadataDto.prototype, "keyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID',
        example: 'user-123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KeyMetadataDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of key',
        enum: interfaces_1.KeyType,
        example: interfaces_1.KeyType.PUBLIC,
    }),
    (0, class_validator_1.IsEnum)(interfaces_1.KeyType),
    __metadata("design:type", String)
], KeyMetadataDto.prototype, "keyType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current key status',
        enum: interfaces_1.KeyStatus,
        example: interfaces_1.KeyStatus.ACTIVE,
    }),
    (0, class_validator_1.IsEnum)(interfaces_1.KeyStatus),
    __metadata("design:type", String)
], KeyMetadataDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Key version for rotation tracking',
        example: 1,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], KeyMetadataDto.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: 1635789012345,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], KeyMetadataDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Expiration timestamp',
        example: 1667325012345,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], KeyMetadataDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Algorithm',
        example: 'RSA-OAEP',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KeyMetadataDto.prototype, "algorithm", void 0);
class CheckKeysDto {
    userId;
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: true, type: () => String } };
    }
}
exports.CheckKeysDto = CheckKeysDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID to check',
        example: 'user-123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckKeysDto.prototype, "userId", void 0);
class KeyValidityDto {
    userId;
    hasValidKeys;
    metadata;
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: true, type: () => String }, hasValidKeys: { required: true, type: () => Boolean }, metadata: { required: false, type: () => require("./key-exchange.dto").KeyMetadataDto } };
    }
}
exports.KeyValidityDto = KeyValidityDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID',
        example: 'user-123',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KeyValidityDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether user has valid keys',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], KeyValidityDto.prototype, "hasValidKeys", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Key metadata if keys exist',
        type: KeyMetadataDto,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", KeyMetadataDto)
], KeyValidityDto.prototype, "metadata", void 0);
//# sourceMappingURL=key-exchange.dto.js.map