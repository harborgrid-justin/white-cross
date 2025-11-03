/**
 * Edit Message DTO
 *
 * Validated DTO for editing existing messages via WebSocket.
 *
 * @class EditMessageDto
 */
import { IsString, IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

export class EditMessageDto {
  @IsUUID('4')
  @IsNotEmpty()
  messageId: string;

  @IsUUID('4')
  @IsNotEmpty()
  conversationId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10000, {
    message: 'Message content cannot exceed 10,000 characters',
  })
  content: string;
}
