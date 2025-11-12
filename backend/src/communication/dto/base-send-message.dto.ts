import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

/**
 * Base DTO for message sending operations
 *
 * Contains common fields shared between direct and group messages.
 */
export class BaseSendMessageDto {
  @ApiProperty({
    description: 'Message content',
    minLength: 1,
    maxLength: 10000,
    example: 'Hello!',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(10000)
  content: string;

  @ApiPropertyOptional({
    description: 'Message attachments (file URLs)',
    type: [String],
    maxItems: 10,
    example: ['https://example.com/file.pdf'],
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  attachments?: string[];

  @ApiPropertyOptional({
    description: 'Parent message ID for threaded replies',
    example: '789e0123-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiPropertyOptional({
    description: 'Whether to encrypt the message content',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  encrypted?: boolean;

  @ApiPropertyOptional({
    description: 'Additional metadata for the message',
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  metadata?: Record<string, any>;
}