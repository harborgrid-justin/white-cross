/**
 * Notification Result DTO
 *
 * Data Transfer Object for notification sending results.
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChannelResultDto {
  @ApiProperty({
    description: 'Whether the notification was successful',
    example: true,
  })
  success: boolean;

  @ApiPropertyOptional({
    description: 'Message ID or call ID if successful',
    example: 'sms_1234567890',
  })
  messageId?: string;

  @ApiPropertyOptional({
    description: 'Call ID if voice notification',
    example: 'call_1234567890',
  })
  callId?: string;

  @ApiPropertyOptional({
    description: 'Error message if unsuccessful',
    example: 'Phone number is invalid',
  })
  error?: string;
}

export class ContactInfoDto {
  @ApiProperty({
    description: 'Contact first name',
    example: 'Jane',
  })
  firstName: string;

  @ApiProperty({
    description: 'Contact last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '+1-555-123-4567',
  })
  phoneNumber: string;

  @ApiPropertyOptional({
    description: 'Contact email address',
    example: 'jane.doe@example.com',
  })
  email?: string;
}

export class NotificationResultDto {
  @ApiProperty({
    description: 'Emergency contact ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  contactId: string;

  @ApiProperty({
    description: 'Contact information',
    type: ContactInfoDto,
  })
  contact: ContactInfoDto;

  @ApiProperty({
    description: 'Results per notification channel',
    type: 'object',
    example: {
      sms: { success: true, messageId: 'sms_1234567890' },
      email: { success: true, messageId: 'email_0987654321' },
    },
  })
  channels: {
    sms?: ChannelResultDto;
    email?: ChannelResultDto;
    voice?: ChannelResultDto;
  };

  @ApiProperty({
    description: 'Timestamp when notification was sent',
    example: '2025-10-28T02:45:00Z',
  })
  timestamp: Date;
}
