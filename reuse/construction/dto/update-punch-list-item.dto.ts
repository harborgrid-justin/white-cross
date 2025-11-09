
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsBoolean, IsDate, IsOptional, IsString, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { PunchListItemStatus } from '../types/closeout.types';

export class UpdatePunchListItemDto {
  @ApiPropertyOptional({ enum: PunchListItemStatus })
  @IsOptional()
  @IsEnum(PunchListItemStatus)
  status?: PunchListItemStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
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
  actualHours?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  actualCost?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  resolutionNotes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  requiresReinspection?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photoUrls?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachmentUrls?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}
