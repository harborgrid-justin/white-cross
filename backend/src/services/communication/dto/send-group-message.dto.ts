import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsUUID } from 'class-validator';
import { BaseSendMessageDto } from './base-send-message.dto';

/**
 * DTO for sending group messages (1-to-many conversations)
 *
 * Group messages are sent to multiple recipients in an existing group conversation.
 * The conversation must exist before sending a group message.
 */
export class SendGroupMessageDto extends BaseSendMessageDto {
  @ApiProperty({
    description: 'Conversation ID to send the message to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  conversationId: string;

  @ApiPropertyOptional({
    description: 'Mention specific users by their IDs',
    type: [String],
    example: ['user-id-1', 'user-id-2'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  mentions?: string[];
}
