import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsArray, ArrayMinSize } from 'class-validator';

/**
 * DTO for marking messages as read
 *
 * Supports marking single or multiple messages as read.
 * Used for:
 * - Updating unread count
 * - Showing read receipts
 * - Tracking user engagement
 */
export class MarkAsReadDto {
  @ApiProperty({
    description: 'Message IDs to mark as read',
    type: [String],
    minItems: 1,
    example: ['123e4567-e89b-12d3-a456-426614174000', '789e0123-e89b-12d3-a456-426614174000'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  messageIds: string[];
}

/**
 * DTO for marking all messages in a conversation as read
 */
export class MarkConversationAsReadDto {
  @ApiProperty({
    description: 'Conversation ID to mark all messages as read',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  conversationId: string;

  @ApiPropertyOptional({
    description: 'Optional timestamp to mark messages read up to this point',
    example: '2025-10-29T12:00:00Z',
  })
  @IsOptional()
  upToTimestamp?: string;
}
