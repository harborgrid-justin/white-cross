/**
 * @fileoverview Generic SMS DTO
 * @module infrastructure/sms/dto/generic-sms.dto
 * @description DTO for sending generic SMS messages
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * DTO for generic SMS data
 */
export class GenericSmsDto {
  @ApiProperty({
    description: 'SMS message content',
    example: 'This is a notification message',
    maxLength: 1600,
  })
  @IsNotEmpty({ message: 'Message is required' })
  @IsString()
  @MaxLength(1600, { message: 'Message cannot exceed 1600 characters' })
  message: string;
}
