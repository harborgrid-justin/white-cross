import { IsString, IsOptional, IsEnum, IsArray, IsBoolean, IsDateString, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { MessageType, MessagePriority, MessageCategory } from '../enums';

class BroadcastAudienceDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  grades?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  nurseIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  studentIds?: string[];

  @IsOptional()
  @IsBoolean()
  includeParents?: boolean;

  @IsOptional()
  @IsBoolean()
  includeEmergencyContacts?: boolean;
}

export class BroadcastMessageDto {
  @ValidateNested()
  @Type(() => BroadcastAudienceDto)
  audience: BroadcastAudienceDto;

  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(MessageType, { each: true })
  channels: MessageType[];

  @IsOptional()
  @IsString()
  subject?: string;

  @IsString()
  content: string;

  @IsEnum(MessagePriority)
  priority: MessagePriority;

  @IsEnum(MessageCategory)
  category: MessageCategory;

  @IsString()
  senderId: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  translateTo?: string[];
}
