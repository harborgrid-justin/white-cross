import { IsString, IsArray, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendBulkMessageDto {
  @ApiProperty({ description: 'Email subject' })
  @IsString()
  subject: string;

  @ApiProperty({ description: 'Message body' })
  @IsString()
  body: string;

  @ApiProperty({ description: 'List of recipient IDs', type: [String] })
  @IsArray()
  @IsString({ each: true })
  recipients: string[];

  @ApiProperty({
    enum: ['sms', 'email', 'push'],
    isArray: true,
    description: 'Delivery channels',
  })
  @IsArray()
  @IsEnum(['sms', 'email', 'push'], { each: true })
  channels: ('sms' | 'email' | 'push')[];
}

export class BulkMessageResponseDto {
  id: string;
  subject: string;
  body: string;
  recipients: string[];
  channels: ('sms' | 'email' | 'push')[];
  status: 'pending' | 'sending' | 'completed';
  deliveryStats: {
    sent: number;
    delivered: number;
    failed: number;
    opened: number;
  };
  sentAt?: Date;
}
