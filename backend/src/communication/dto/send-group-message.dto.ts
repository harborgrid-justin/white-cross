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
  ArrayMinSize,
} from 'class-validator';

/**
 * DTO for sending group messages (1-to-many conversations)
 *
 * Group messages are sent to multiple recipients in an existing group conversation.
 * The conversation must exist before sending a group message.
 */
export class SendGroupMessageDto {
  @ApiProperty({
    description: 'Conversation ID to send the message to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  conversationId: string;

  @ApiProperty({
    description: 'Message content',
    minLength: 1,
    maxLength: 10000,
    example: 'Hello everyone!',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(10000)
  content: string;

  @ApiPropertyOptional({
    description: 'Message attachments (file URLs)',
    type: [String],
    maxItems: 10,
    example: ['https://example.com/document.pdf'],
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
    description: 'Mention specific users by their IDs',
    type: [String],
    example: ['user-id-1', 'user-id-2'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  mentions?: string[];

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
