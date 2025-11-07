/**
 * Typing Indicator Input DTO
 *
 * Validated DTO for sending typing indicators via WebSocket.
 *
 * @class TypingIndicatorInputDto
 */
import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class TypingIndicatorInputDto {
  @IsUUID('4')
  @IsNotEmpty()
  conversationId!: string;

  @IsBoolean()
  @IsNotEmpty()
  isTyping!: boolean;
}
