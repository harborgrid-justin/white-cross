/**
 * @fileoverview Key Exchange DTOs
 * @module infrastructure/encryption/dto/key-exchange
 * @description Data transfer objects for key exchange operations
 */

import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { KeyType, KeyStatus } from '../interfaces';

/**
 * DTO for requesting key pair generation
 */
export class GenerateKeyPairDto {
  @ApiProperty({
    description: 'User ID to generate keys for',
    example: 'user-123',
  })
  @IsString()
  userId: string;

  @ApiPropertyOptional({
    description: 'RSA key size in bits',
    example: 4096,
    enum: [2048, 4096],
  })
  @IsOptional()
  @IsNumber()
  @Min(2048)
  @Max(4096)
  keySize?: 2048 | 4096;

  @ApiPropertyOptional({
    description: 'Key expiration time in seconds',
    example: 31536000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  expirationTime?: number;

  @ApiPropertyOptional({
    description: 'Whether to cache the keys',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  cache?: boolean;
}

/**
 * DTO for key pair response
 */
export class KeyPairDto {
  @ApiProperty({
    description: 'Public key in PEM format',
    example: '-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----',
  })
  @IsString()
  publicKey: string;

  @ApiProperty({
    description: 'Unique key identifier',
    example: 'key_user123_1635789012345_a1b2c3d4',
  })
  @IsString()
  keyId: string;

  @ApiProperty({
    description: 'Key size in bits',
    example: 4096,
  })
  @IsNumber()
  keySize: number;

  @ApiProperty({
    description: 'When the key was created (Unix timestamp)',
    example: 1635789012345,
  })
  @IsNumber()
  createdAt: number;

  @ApiPropertyOptional({
    description: 'When the key expires (Unix timestamp)',
    example: 1667325012345,
  })
  @IsOptional()
  @IsNumber()
  expiresAt?: number;
}

/**
 * DTO for requesting public key
 */
export class GetPublicKeyDto {
  @ApiProperty({
    description: 'User ID to get public key for',
    example: 'user-123',
  })
  @IsString()
  userId: string;
}

/**
 * DTO for public key response
 */
export class PublicKeyDto {
  @ApiProperty({
    description: 'User ID',
    example: 'user-123',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Public key in PEM format',
    example: '-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----',
  })
  @IsString()
  publicKey: string;

  @ApiProperty({
    description: 'Key identifier',
    example: 'key_user123_1635789012345_a1b2c3d4',
  })
  @IsString()
  keyId: string;

  @ApiProperty({
    description: 'Key status',
    enum: KeyStatus,
    example: KeyStatus.ACTIVE,
  })
  @IsEnum(KeyStatus)
  status: KeyStatus;
}

/**
 * DTO for rotating user keys
 */
export class RotateKeysDto {
  @ApiProperty({
    description: 'User ID to rotate keys for',
    example: 'user-123',
  })
  @IsString()
  userId: string;

  @ApiPropertyOptional({
    description: 'Grace period for old key in seconds',
    example: 86400,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  gracePeriod?: number;

  @ApiPropertyOptional({
    description: 'Whether to immediately revoke old key',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  revokeOldKey?: boolean;

  @ApiPropertyOptional({
    description: 'Reason for rotation',
    example: 'Scheduled rotation',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

/**
 * DTO for revoking user keys
 */
export class RevokeKeysDto {
  @ApiProperty({
    description: 'User ID to revoke keys for',
    example: 'user-123',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Reason for revocation',
    example: 'Security breach',
  })
  @IsString()
  reason: string;
}

/**
 * DTO for encrypting data with public key
 */
export class EncryptWithPublicKeyDto {
  @ApiProperty({
    description: 'Data to encrypt',
    example: 'Sensitive data',
  })
  @IsString()
  data: string;

  @ApiProperty({
    description: 'User ID whose public key to use',
    example: 'user-456',
  })
  @IsString()
  recipientUserId: string;
}

/**
 * DTO for encrypted data response
 */
export class EncryptedDataDto {
  @ApiProperty({
    description: 'Encrypted data in base64',
    example: 'ZW5jcnlwdGVkZGF0YQ==',
  })
  @IsString()
  encryptedData: string;

  @ApiProperty({
    description: 'Key ID used for encryption',
    example: 'key_user456_1635789012345_a1b2c3d4',
  })
  @IsString()
  keyId: string;

  @ApiProperty({
    description: 'Recipient user ID',
    example: 'user-456',
  })
  @IsString()
  recipientUserId: string;
}

/**
 * DTO for decrypting data with private key
 */
export class DecryptWithPrivateKeyDto {
  @ApiProperty({
    description: 'Encrypted data in base64',
    example: 'ZW5jcnlwdGVkZGF0YQ==',
  })
  @IsString()
  encryptedData: string;

  @ApiProperty({
    description: 'User ID whose private key to use',
    example: 'user-123',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Passphrase to decrypt private key',
    example: 'my-secure-passphrase',
  })
  @IsString()
  passphrase: string;
}

/**
 * DTO for key metadata
 */
export class KeyMetadataDto {
  @ApiProperty({
    description: 'Unique key identifier',
    example: 'key_user123_1635789012345_a1b2c3d4',
  })
  @IsString()
  keyId: string;

  @ApiProperty({
    description: 'User ID',
    example: 'user-123',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Type of key',
    enum: KeyType,
    example: KeyType.PUBLIC,
  })
  @IsEnum(KeyType)
  keyType: KeyType;

  @ApiProperty({
    description: 'Current key status',
    enum: KeyStatus,
    example: KeyStatus.ACTIVE,
  })
  @IsEnum(KeyStatus)
  status: KeyStatus;

  @ApiProperty({
    description: 'Key version for rotation tracking',
    example: 1,
  })
  @IsNumber()
  version: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: 1635789012345,
  })
  @IsNumber()
  createdAt: number;

  @ApiPropertyOptional({
    description: 'Expiration timestamp',
    example: 1667325012345,
  })
  @IsOptional()
  @IsNumber()
  expiresAt?: number;

  @ApiProperty({
    description: 'Algorithm',
    example: 'RSA-OAEP',
  })
  @IsString()
  algorithm: string;
}

/**
 * DTO for checking if user has valid keys
 */
export class CheckKeysDto {
  @ApiProperty({
    description: 'User ID to check',
    example: 'user-123',
  })
  @IsString()
  userId: string;
}

/**
 * DTO for key validity response
 */
export class KeyValidityDto {
  @ApiProperty({
    description: 'User ID',
    example: 'user-123',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Whether user has valid keys',
    example: true,
  })
  @IsBoolean()
  hasValidKeys: boolean;

  @ApiPropertyOptional({
    description: 'Key metadata if keys exist',
    type: KeyMetadataDto,
  })
  @IsOptional()
  metadata?: KeyMetadataDto;
}
