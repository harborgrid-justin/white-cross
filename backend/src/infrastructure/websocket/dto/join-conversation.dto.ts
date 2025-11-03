/**
 * Join Conversation DTO
 *
 * Validated DTO for joining a conversation room via WebSocket.
 *
 * @class JoinConversationDto
 */
import { IsNotEmpty, IsUUID } from 'class-validator';

export class JoinConversationDto {
  @IsUUID('4')
  @IsNotEmpty()
  conversationId: string;
}
