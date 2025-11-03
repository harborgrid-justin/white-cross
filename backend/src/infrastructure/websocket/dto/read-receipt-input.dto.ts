/**
 * Read Receipt Input DTO
 *
 * Validated DTO for sending read receipts via WebSocket.
 *
 * @class ReadReceiptInputDto
 */
import { IsNotEmpty, IsUUID, IsArray, IsOptional } from 'class-validator';

export class ReadReceiptInputDto {
  @IsUUID('4')
  @IsNotEmpty()
  conversationId: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  messageIds?: string[];

  @IsOptional()
  @IsUUID('4')
  messageId?: string;
}
