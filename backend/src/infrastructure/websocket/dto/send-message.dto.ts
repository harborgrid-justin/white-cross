/**
 * Send Message DTO
 *
 * Validated DTO for sending new messages via WebSocket.
 * Uses class-validator decorators for automatic validation.
 *
 * @class SendMessageDto
 */
import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Message metadata DTO
 */
export class MessageMetadataDto {
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  mentions?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  attachments?: string[];

  @IsOptional()
  @IsUUID('4')
  replyToMessageId?: string;
}

/**
 * DTO for sending a new message
 */
export class SendMessageDto {
  @IsUUID('4')
  @IsNotEmpty()
  messageId!: string;

  @IsUUID('4')
  @IsNotEmpty()
  conversationId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10000, {
    message: 'Message content cannot exceed 10,000 characters',
  })
  content!: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  recipientIds?: string[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => MessageMetadataDto)
  metadata?: MessageMetadataDto;
}
