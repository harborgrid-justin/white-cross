import { IsString, IsOptional, IsEnum, IsArray, IsBoolean, MinLength, MaxLength } from 'class-validator';
import { MessageType, MessageCategory } from '../enums';

export class CreateMessageTemplateDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  subject?: string;

  @IsString()
  @MinLength(1)
  content: string;

  @IsEnum(MessageType)
  type: MessageType;

  @IsEnum(MessageCategory)
  category: MessageCategory;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variables?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsString()
  createdBy: string;
}
