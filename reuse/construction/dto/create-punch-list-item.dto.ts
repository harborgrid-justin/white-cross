
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsEnum, IsNumber, IsOptional, IsDate, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { PunchListItemCategory, PunchListItemPriority } from '../types/closeout.types';

export class CreatePunchListItemDto {
  @ApiProperty()
  @IsUUID()
  closeoutId: string;

  @ApiProperty()
  @IsString()
  itemNumber: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty({ enum: PunchListItemCategory })
  @IsEnum(PunchListItemCategory)
  category: PunchListItemCategory;

  @ApiProperty({ enum: PunchListItemPriority })
  @IsEnum(PunchListItemPriority)
  priority: PunchListItemPriority;

  @ApiProperty()
  @IsUUID()
  reportedById: string;

  @ApiProperty()
  @IsString()
  reportedByName: string;

  @ApiProperty()
  @IsString()
  contractorResponsible: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assignedToId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignedToName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  estimatedHours?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  estimatedCost?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}
