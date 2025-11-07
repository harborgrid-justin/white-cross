import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { MessageCategory, MessageType } from './send-message.dto';

export class CreateTemplateDto {
  @ApiProperty({
    description: 'Template name',
    minLength: 3,
    maxLength: 100,
    example: 'Appointment Reminder Template',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'Template subject line',
    maxLength: 255,
    example: 'Appointment Reminder for {{studentName}}',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  subject?: string;

  @ApiProperty({
    description: 'Template content with variable placeholders',
    minLength: 1,
    maxLength: 50000,
    example:
      'Dear {{parentName}}, this is a reminder that {{studentName}} has an appointment on {{date}} at {{time}}.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50000)
  content: string;

  @ApiProperty({
    description: 'Message type for this template',
    enum: MessageType,
    example: MessageType.EMAIL,
  })
  @IsEnum(MessageType)
  type: MessageType;

  @ApiProperty({
    description: 'Message category',
    enum: MessageCategory,
    example: MessageCategory.APPOINTMENT_REMINDER,
  })
  @IsEnum(MessageCategory)
  category: MessageCategory;

  @ApiPropertyOptional({
    description: 'Template variable names',
    type: [String],
    example: ['studentName', 'parentName', 'date', 'time'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variables?: string[];

  @ApiPropertyOptional({
    description: 'Whether template is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateTemplateDto {
  @ApiPropertyOptional({
    description: 'Template name',
    minLength: 3,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    description: 'Template subject line',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  subject?: string;

  @ApiPropertyOptional({
    description: 'Template content',
    minLength: 1,
    maxLength: 50000,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50000)
  content?: string;

  @ApiPropertyOptional({
    description: 'Message type',
    enum: MessageType,
  })
  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;

  @ApiPropertyOptional({
    description: 'Message category',
    enum: MessageCategory,
  })
  @IsOptional()
  @IsEnum(MessageCategory)
  category?: MessageCategory;

  @ApiPropertyOptional({
    description: 'Template variables',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variables?: string[];

  @ApiPropertyOptional({
    description: 'Whether template is active',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
