/**
 * @fileoverview Alert SMS DTO
 * @module infrastructure/sms/dto/alert-sms.dto
 * @description DTO for sending alert notifications via SMS
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { AlertSeverity } from '@/services/alerts/dto/create-alert.dto';

/**
 * DTO for alert SMS data
 */
export class AlertSmsDto {
  @ApiProperty({
    description: 'Alert title',
    example: 'Critical Alert',
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  @MaxLength(100, { message: 'Title cannot exceed 100 characters' })
  title: string;

  @ApiProperty({
    description: 'Alert message',
    example: 'Student requires immediate attention',
    maxLength: 500,
  })
  @IsNotEmpty({ message: 'Message is required' })
  @IsString()
  @MaxLength(500, { message: 'Message cannot exceed 500 characters' })
  message: string;

  @ApiProperty({
    description: 'Alert severity level',
    enum: AlertSeverity,
    example: AlertSeverity.CRITICAL,
  })
  @IsNotEmpty({ message: 'Severity is required' })
  @IsEnum(AlertSeverity, { message: 'Invalid severity level' })
  severity: AlertSeverity;
}
