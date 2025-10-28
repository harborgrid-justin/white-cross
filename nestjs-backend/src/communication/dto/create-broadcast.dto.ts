import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsArray,
  IsOptional,
  ValidateNested,
  MaxLength,
  MinLength,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MessagePriority, MessageCategory, MessageType } from './send-message.dto';

export class AudienceDto {
  @ApiPropertyOptional({
    description: 'Target grade levels',
    type: [String],
    example: ['K', '1', '2'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  grades?: string[];

  @ApiPropertyOptional({
    description: 'Target nurse IDs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  nurseIds?: string[];

  @ApiPropertyOptional({
    description: 'Target student IDs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  studentIds?: string[];

  @ApiPropertyOptional({
    description: 'Include parents in broadcast',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  includeParents?: boolean;

  @ApiPropertyOptional({
    description: 'Include emergency contacts in broadcast',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  includeEmergencyContacts?: boolean;
}

export class CreateBroadcastDto {
  @ApiProperty({
    description: 'Target audience configuration',
    type: AudienceDto,
  })
  @ValidateNested()
  @Type(() => AudienceDto)
  audience: AudienceDto;

  @ApiProperty({
    description: 'Communication channels to use',
    enum: MessageType,
    isArray: true,
    example: [MessageType.EMAIL, MessageType.SMS],
  })
  @IsArray()
  @IsEnum(MessageType, { each: true })
  channels: MessageType[];

  @ApiPropertyOptional({
    description: 'Broadcast subject line',
    maxLength: 255,
    example: 'School Emergency Notification',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  subject?: string;

  @ApiProperty({
    description: 'Broadcast message content',
    minLength: 1,
    maxLength: 50000,
    example: 'Due to severe weather, school will be closed tomorrow.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50000)
  content: string;

  @ApiProperty({
    description: 'Broadcast priority level',
    enum: MessagePriority,
    example: MessagePriority.URGENT,
  })
  @IsEnum(MessagePriority)
  priority: MessagePriority;

  @ApiProperty({
    description: 'Broadcast category',
    enum: MessageCategory,
    example: MessageCategory.EMERGENCY,
  })
  @IsEnum(MessageCategory)
  category: MessageCategory;

  @ApiPropertyOptional({
    description: 'Scheduled delivery time (ISO 8601)',
    example: '2025-10-28T14:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

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
