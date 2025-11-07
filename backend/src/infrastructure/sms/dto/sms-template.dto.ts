/**
 * @fileoverview SMS Template DTO
 * @module infrastructure/sms/dto/sms-template.dto
 * @description DTOs for SMS template management
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  MaxLength,
} from 'class-validator';

/**
 * SMS Template types
 */
export enum SmsTemplateType {
  ALERT = 'alert',
  REMINDER = 'reminder',
  NOTIFICATION = 'notification',
  VERIFICATION = 'verification',
  EMERGENCY = 'emergency',
  CUSTOM = 'custom',
}

/**
 * DTO for creating SMS template
 */
export class CreateSmsTemplateDto {
  @ApiProperty({
    description: 'Unique template identifier',
    example: 'medication-reminder',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  templateId: string;

  @ApiProperty({
    description: 'Template type',
    enum: SmsTemplateType,
  })
  @IsNotEmpty()
  @IsEnum(SmsTemplateType)
  type: SmsTemplateType;

  @ApiProperty({
    description:
      'Template content with variables (use {{variableName}} syntax)',
    example: 'Hi {{studentName}}, reminder: {{medicationName}} at {{time}}',
    maxLength: 1600,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1600)
  content: string;

  @ApiPropertyOptional({
    description: 'Template description',
    example: 'Template for medication reminders',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Required variables for this template',
    example: ['studentName', 'medicationName', 'time'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredVariables?: string[];
}

/**
 * DTO for SMS template with variables
 */
export class SendTemplatedSmsDto {
  @ApiProperty({
    description: 'Template identifier',
    example: 'medication-reminder',
  })
  @IsNotEmpty()
  @IsString()
  templateId: string;

  @ApiProperty({
    description: 'Variables to substitute in template',
    example: {
      studentName: 'John Doe',
      medicationName: 'Aspirin',
      time: '2:30 PM',
    },
  })
  @IsNotEmpty()
  variables: Record<string, unknown>;
}
