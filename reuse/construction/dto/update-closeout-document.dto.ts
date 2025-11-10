
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsDate, IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { DocumentStatus } from '../types/closeout.types';

export class UpdateCloseoutDocumentDto {
  @ApiPropertyOptional({ enum: DocumentStatus })
  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  fileSize?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  version?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reviewComments?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expirationDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  warrantyStartDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  warrantyEndDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}
