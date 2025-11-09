
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsEnum, IsBoolean, IsOptional, IsNumber, IsArray } from 'class-validator';
import { CloseoutDocumentType } from '../types/closeout.types';

export class CreateCloseoutDocumentDto {
  @ApiProperty()
  @IsUUID()
  closeoutId: string;

  @ApiProperty({ enum: CloseoutDocumentType })
  @IsEnum(CloseoutDocumentType)
  documentType: CloseoutDocumentType;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  documentNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  relatedEquipment?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  relatedSystem?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  modelNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  trainingTopic?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  trainingDuration?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}
