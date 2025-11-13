import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum MessagePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum MessageCategory {
  EMERGENCY = 'EMERGENCY',
  HEALTH_UPDATE = 'HEALTH_UPDATE',
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  MEDICATION_REMINDER = 'MEDICATION_REMINDER',
  GENERAL = 'GENERAL',
  INCIDENT_NOTIFICATION = 'INCIDENT_NOTIFICATION',
  COMPLIANCE = 'COMPLIANCE',
}

export enum MessageType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
  VOICE = 'VOICE',
}

export enum RecipientType {
  NURSE = 'NURSE',
  PARENT = 'PARENT',
  GUARDIAN = 'GUARDIAN',
  EMERGENCY_CONTACT = 'EMERGENCY_CONTACT',
  STUDENT = 'STUDENT',
  STAFF = 'STAFF',
  ADMINISTRATOR = 'ADMINISTRATOR',
}

export class RecipientDto {
  @ApiProperty({
    description: 'Type of recipient',
    enum: RecipientType,
    example: RecipientType.PARENT,
  })
  @IsEnum(RecipientType)
  type: RecipientType;

  @ApiProperty({
    description: 'Recipient unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiPropertyOptional({
    description: 'Recipient email address',
    example: 'parent@example.com',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    description: 'Recipient phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Push notification token',
  })
  @IsOptional()
  @IsString()
  pushToken?: string;

  @ApiPropertyOptional({
    description: 'Preferred language code',
    example: 'en',
  })
  @IsOptional()
  @IsString()
  preferredLanguage?: string;
}

export class SendMessageDto {
  @ApiProperty({
    description: 'List of message recipients',
    type: [RecipientDto],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RecipientDto)
  recipients: RecipientDto[];

  @ApiPropertyOptional({
    description: 'Communication channels to use',
    enum: MessageType,
    isArray: true,
    example: [MessageType.EMAIL, MessageType.SMS],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(MessageType, { each: true })
  channels?: MessageType[];

  @ApiPropertyOptional({
    description: 'Message subject line',
    maxLength: 255,
    example: 'Important Health Update',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  subject?: string;

  @ApiProperty({
    description: 'Message content',
    minLength: 1,
    maxLength: 50000,
    example: 'Your child has a scheduled health appointment tomorrow at 2 PM.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50000)
  content: string;

  @ApiPropertyOptional({
    description: 'Message priority level',
    enum: MessagePriority,
    default: MessagePriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(MessagePriority)
  priority?: MessagePriority;

  @ApiProperty({
    description: 'Message category',
    enum: MessageCategory,
    example: MessageCategory.HEALTH_UPDATE,
  })
  @IsEnum(MessageCategory)
  category: MessageCategory;

  @ApiPropertyOptional({
    description: 'Message template ID if using template',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  templateId?: string;

  @ApiPropertyOptional({
    description: 'Scheduled delivery time (ISO 8601)',
    example: '2025-10-28T14:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiPropertyOptional({
    description: 'Attachment URLs (HTTPS only)',
    type: [String],
    maxItems: 10,
    example: ['https://example.com/consent-form.pdf'],
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  attachments?: string[];

  @ApiPropertyOptional({
    description: 'Target languages for translation',
    type: [String],
    example: ['es', 'fr'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  translateTo?: string[];
}
