import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsOptional,
  IsArray,
  IsUrl,
  MaxLength,
  MinLength,
  IsBoolean,
} from 'class-validator';

/**
 * DTO for sending direct messages (1-to-1 conversations)
 *
 * Direct messages are private conversations between two users.
 * A conversation will be automatically created if one doesn't exist.
 */
export class SendDirectMessageDto {
  @ApiProperty({
    description: 'Recipient user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  recipientId: string;

  @ApiProperty({
    description: 'Message content',
    minLength: 1,
    maxLength: 10000,
    example: 'Hello, how are you?',
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
  @IsUUID()
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
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
