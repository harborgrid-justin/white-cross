import { ArrayMinSize, IsArray, IsDateString, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MessageCategory, MessagePriority, MessageType } from '../enums';
import { RecipientDto } from './recipient.dto';

export class CreateMessageDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RecipientDto)
  recipients: RecipientDto[];

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

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];

  @IsString()
  senderId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  translateTo?: string[];
}
