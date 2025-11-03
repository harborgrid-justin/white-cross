/**
 * Delete Message DTO
 *
 * Validated DTO for deleting messages via WebSocket.
 *
 * @class DeleteMessageDto
 */
import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteMessageDto {
  @IsUUID('4')
  @IsNotEmpty()
  messageId: string;

  @IsUUID('4')
  @IsNotEmpty()
  conversationId: string;
}
