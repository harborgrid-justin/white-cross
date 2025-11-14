import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { BaseSendMessageDto } from './base-send-message.dto';

/**
 * DTO for sending direct messages (1-to-1 conversations)
 *
 * Direct messages are private conversations between two users.
 * A conversation will be automatically created if one doesn't exist.
 */
export class SendDirectMessageDto extends BaseSendMessageDto {
  @ApiProperty({
    description: 'Recipient user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  recipientId: string;
}
