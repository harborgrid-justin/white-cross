/**
 * @fileoverview Encryption Keys DTOs
 * @module infrastructure/encryption/dto/encryption-keys
 * @description Data transfer objects for session key management
 */

import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for session key
 */
export class SessionKeyDto {
  @ApiProperty({
    description: 'Unique session key identifier',
    example: 'session_conv123_1635789012345_a1b2c3d4',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Base64-encoded key material (never log this!)',
    example: 'a2V5bWF0ZXJpYWw=',
  })
  @IsString()
  key: string;

  @ApiProperty({
    description: 'Conversation identifier',
    example: 'conv-abc123',
  })
  @IsString()
  conversationId: string;

  @ApiProperty({
    description: 'When key was created (Unix timestamp)',
    example: 1635789012345,
  })
  @IsNumber()
  createdAt: number;

  @ApiProperty({
    description: 'When key expires (Unix timestamp)',
    example: 1635875412345,
  })
  @IsNumber()
  expiresAt: number;

  @ApiProperty({
    description: 'Key version for rotation tracking',
    example: 1,
  })
  @IsNumber()
  version: number;
}

/**
 * DTO for requesting session key
 */
export class GetSessionKeyDto {
  @ApiProperty({
    description: 'Conversation identifier',
    example: 'conv-abc123',
  })
  @IsString()
  conversationId: string;

  @ApiPropertyOptional({
    description: 'Custom TTL for session key in seconds',
    example: 86400,
  })
  @IsOptional()
  @IsNumber()
  @Min(60)
  @Max(604800)
  keyTTL?: number;

  @ApiPropertyOptional({
    description: 'Whether to skip cache and generate new key',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  skipCache?: boolean;
}

/**
 * DTO for session key response (without key material)
 */
export class SessionKeyInfoDto {
  @ApiProperty({
    description: 'Unique session key identifier',
    example: 'session_conv123_1635789012345_a1b2c3d4',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Conversation identifier',
    example: 'conv-abc123',
  })
  @IsString()
  conversationId: string;

  @ApiProperty({
    description: 'When key was created (Unix timestamp)',
    example: 1635789012345,
  })
  @IsNumber()
  createdAt: number;

  @ApiProperty({
    description: 'When key expires (Unix timestamp)',
    example: 1635875412345,
  })
  @IsNumber()
  expiresAt: number;

  @ApiProperty({
    description: 'Key version',
    example: 1,
  })
  @IsNumber()
  version: number;

  @ApiProperty({
    description: 'Whether key is still valid',
    example: true,
  })
  @IsBoolean()
  isValid: boolean;
}

/**
 * DTO for rotating session key
 */
export class RotateSessionKeyDto {
  @ApiProperty({
    description: 'Conversation identifier',
    example: 'conv-abc123',
  })
  @IsString()
  conversationId: string;

  @ApiPropertyOptional({
    description: 'Reason for rotation',
    example: 'Scheduled rotation',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

/**
 * DTO for creating encryption options
 */
export class EncryptionOptionsDto {
  @ApiPropertyOptional({
    description: 'Key identifier',
    example: 'session_conv123_1635789012345_a1b2c3d4',
  })
  @IsOptional()
  @IsString()
  keyId?: string;

  @ApiPropertyOptional({
    description: 'Conversation identifier',
    example: 'conv-abc123',
  })
  @IsOptional()
  @IsString()
  conversationId?: string;

  @ApiPropertyOptional({
    description: 'Additional authenticated data',
    example: 'user123:conv-abc123',
  })
  @IsOptional()
  @IsString()
  aad?: string;

  @ApiPropertyOptional({
    description: 'Whether to skip cache',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  skipCache?: boolean;

  @ApiPropertyOptional({
    description: 'Custom TTL for key in seconds',
    example: 86400,
  })
  @IsOptional()
  @IsNumber()
  @Min(60)
  @Max(604800)
  keyTTL?: number;
}

/**
 * DTO for encryption configuration
 */
export class EncryptionConfigDto {
  @ApiProperty({
    description: 'Whether encryption is enabled',
    example: true,
  })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({
    description: 'Encryption algorithm',
    example: 'aes-256-gcm',
  })
  @IsString()
  algorithm: string;

  @ApiProperty({
    description: 'RSA key size in bits',
    example: 4096,
  })
  @IsNumber()
  rsaKeySize: number;

  @ApiProperty({
    description: 'Default session key TTL in seconds',
    example: 86400,
  })
  @IsNumber()
  sessionKeyTTL: number;

  @ApiProperty({
    description: 'Whether key rotation is enabled',
    example: true,
  })
  @IsBoolean()
  enableKeyRotation: boolean;

  @ApiProperty({
    description: 'Key rotation interval in seconds',
    example: 604800,
  })
  @IsNumber()
  keyRotationInterval: number;

  @ApiProperty({
    description: 'Encryption implementation version',
    example: '1.0.0',
  })
  @IsString()
  version: string;
}

/**
 * DTO for key expiration check
 */
export class CheckKeyExpirationDto {
  @ApiProperty({
    description: 'Key identifier to check',
    example: 'session_conv123_1635789012345_a1b2c3d4',
  })
  @IsString()
  keyId: string;
}

/**
 * DTO for key expiration response
 */
export class KeyExpirationDto {
  @ApiProperty({
    description: 'Key identifier',
    example: 'session_conv123_1635789012345_a1b2c3d4',
  })
  @IsString()
  keyId: string;

  @ApiProperty({
    description: 'Whether key has expired',
    example: false,
  })
  @IsBoolean()
  expired: boolean;

  @ApiProperty({
    description: 'Expiration timestamp',
    example: 1635875412345,
  })
  @IsNumber()
  expiresAt: number;

  @ApiPropertyOptional({
    description: 'Time until expiration in seconds',
    example: 82800,
  })
  @IsOptional()
  @IsNumber()
  timeUntilExpiration?: number;
}

/**
 * DTO for listing session keys
 */
export class ListSessionKeysDto {
  @ApiPropertyOptional({
    description: 'Filter by conversation ID',
    example: 'conv-abc123',
  })
  @IsOptional()
  @IsString()
  conversationId?: string;

  @ApiPropertyOptional({
    description: 'Include expired keys',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  includeExpired?: boolean;

  @ApiPropertyOptional({
    description: 'Maximum number of keys to return',
    example: 50,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}

/**
 * DTO for session keys list response
 */
export class SessionKeysListDto {
  @ApiProperty({
    description: 'Array of session key info',
    type: [SessionKeyInfoDto],
  })
  keys: SessionKeyInfoDto[];

  @ApiProperty({
    description: 'Total number of keys',
    example: 42,
  })
  @IsNumber()
  total: number;

  @ApiProperty({
    description: 'Number of active keys',
    example: 38,
  })
  @IsNumber()
  active: number;

  @ApiProperty({
    description: 'Number of expired keys',
    example: 4,
  })
  @IsNumber()
  expired: number;
}
