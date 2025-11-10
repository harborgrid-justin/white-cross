/**
 * @fileoverview Encrypted Message DTOs
 * @module infrastructure/encryption/dto
 * @description Data transfer objects for encrypted message operations
 */

import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EncryptionAlgorithm } from '../interfaces';

/**
 * Encryption metadata DTO
 * Contains information needed for decryption
 */
export class EncryptionMetadataDto {
  @ApiProperty({
    description: 'Encryption algorithm used',
    enum: EncryptionAlgorithm,
    example: EncryptionAlgorithm.AES_256_GCM,
  })
  @IsEnum(EncryptionAlgorithm)
  algorithm: EncryptionAlgorithm;

  @ApiProperty({
    description: 'Initialization vector (base64 encoded)',
    example: 'aGVsbG93b3JsZA==',
  })
  @IsString()
  iv: string;

  @ApiProperty({
    description: 'Authentication tag (base64 encoded)',
    example: 'dGFnZXhhbXBsZQ==',
  })
  @IsString()
  authTag: string;

  @ApiProperty({
    description: 'Key identifier for retrieving decryption key',
    example: 'key_user123_1635789012345_a1b2c3d4',
  })
  @IsString()
  keyId: string;

  @ApiProperty({
    description: 'Timestamp when encryption occurred',
    example: 1635789012345,
  })
  @IsNumber()
  timestamp: number;

  @ApiProperty({
    description: 'Version of encryption implementation',
    example: '1.0.0',
  })
  @IsString()
  version: string;
}

/**
 * DTO for creating an encrypted message
 */
export class CreateEncryptedMessageDto {
  @ApiProperty({
    description: 'Plain text message content to encrypt',
    example: 'This is a sensitive message',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'ID of message sender',
    example: 'user-123',
  })
  @IsString()
  senderId: string;

  @ApiProperty({
    description: 'IDs of message recipients',
    example: ['user-456', 'user-789'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  recipientIds: string[];

  @ApiProperty({
    description: 'Conversation identifier',
    example: 'conv-abc123',
  })
  @IsString()
  conversationId: string;

  @ApiPropertyOptional({
    description:
      'Additional authenticated data (not encrypted but authenticated)',
    example: 'metadata-string',
  })
  @IsOptional()
  @IsString()
  aad?: string;

  @ApiPropertyOptional({
    description: 'Custom session key ID to use',
    example: 'session_conv123_1635789012345_a1b2c3d4',
  })
  @IsOptional()
  @IsString()
  keyId?: string;
}

/**
 * DTO for encrypted message response
 */
export class EncryptedMessageDto {
  @ApiProperty({
    description: 'Base64-encoded encrypted content',
    example: 'ZW5jcnlwdGVkY29udGVudA==',
  })
  @IsString()
  encryptedContent: string;

  @ApiProperty({
    description: 'Encryption metadata',
    type: EncryptionMetadataDto,
  })
  @ValidateNested()
  @Type(() => EncryptionMetadataDto)
  metadata: EncryptionMetadataDto;

  @ApiProperty({
    description: 'ID of message sender',
    example: 'user-123',
  })
  @IsString()
  senderId: string;

  @ApiProperty({
    description: 'IDs of message recipients',
    example: ['user-456', 'user-789'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  recipientIds: string[];

  @ApiProperty({
    description: 'Conversation identifier',
    example: 'conv-abc123',
  })
  @IsString()
  conversationId: string;

  @ApiProperty({
    description: 'Whether this message is encrypted',
    example: true,
  })
  @IsBoolean()
  isEncrypted: boolean;
}

/**
 * DTO for decrypting a message
 */
export class DecryptMessageDto {
  @ApiProperty({
    description: 'Base64-encoded encrypted content',
    example: 'ZW5jcnlwdGVkY29udGVudA==',
  })
  @IsString()
  encryptedContent: string;

  @ApiProperty({
    description: 'Encryption metadata',
    type: EncryptionMetadataDto,
  })
  @ValidateNested()
  @Type(() => EncryptionMetadataDto)
  metadata: EncryptionMetadataDto;

  @ApiProperty({
    description: 'ID of recipient requesting decryption',
    example: 'user-456',
  })
  @IsString()
  recipientId: string;

  @ApiProperty({
    description: 'Conversation identifier',
    example: 'conv-abc123',
  })
  @IsString()
  conversationId: string;

  @ApiPropertyOptional({
    description: 'Additional authenticated data (must match encryption AAD)',
    example: 'metadata-string',
  })
  @IsOptional()
  @IsString()
  aad?: string;
}

/**
 * DTO for decrypted message response
 */
export class DecryptedMessageDto {
  @ApiProperty({
    description: 'Decrypted message content',
    example: 'This is a sensitive message',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Original encryption metadata',
    type: EncryptionMetadataDto,
  })
  @ValidateNested()
  @Type(() => EncryptionMetadataDto)
  metadata: EncryptionMetadataDto;

  @ApiProperty({
    description: 'Whether decryption was successful',
    example: true,
  })
  @IsBoolean()
  success: boolean;
}

/**
 * DTO for bulk message encryption
 */
export class BulkEncryptMessagesDto {
  @ApiProperty({
    description: 'Array of messages to encrypt',
    type: [CreateEncryptedMessageDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEncryptedMessageDto)
  messages: CreateEncryptedMessageDto[];

  @ApiPropertyOptional({
    description: 'Use same session key for all messages',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  useSharedKey?: boolean;
}

/**
 * DTO for encryption operation result
 */
export class EncryptionResultDto {
  @ApiProperty({
    description: 'Whether operation was successful',
    example: true,
  })
  @IsBoolean()
  success: boolean;

  @ApiPropertyOptional({
    description: 'Encrypted data (if successful)',
    example: 'ZW5jcnlwdGVkZGF0YQ==',
  })
  @IsOptional()
  @IsString()
  data?: string;

  @ApiPropertyOptional({
    description: 'Encryption metadata (if successful)',
    type: EncryptionMetadataDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => EncryptionMetadataDto)
  metadata?: EncryptionMetadataDto;

  @ApiPropertyOptional({
    description: 'Error message (if failed)',
    example: 'Encryption failed',
  })
  @IsOptional()
  @IsString()
  error?: string;

  @ApiPropertyOptional({
    description: 'Detailed error message',
    example: 'Invalid encryption key',
  })
  @IsOptional()
  @IsString()
  message?: string;
}
