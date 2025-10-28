import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsArray, IsOptional, MaxLength, IsDateString } from 'class-validator';
import { DocumentAccessLevel } from './create-document.dto';

export enum DocumentStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  APPROVED = 'APPROVED',
  ARCHIVED = 'ARCHIVED',
  EXPIRED = 'EXPIRED',
  PENDING_REVIEW = 'PENDING_REVIEW',
}

export class UpdateDocumentDto {
  @ApiPropertyOptional({ description: 'Updated document title' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ description: 'Updated description' })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ description: 'New document status', enum: DocumentStatus })
  @IsEnum(DocumentStatus)
  @IsOptional()
  status?: DocumentStatus;

  @ApiPropertyOptional({ description: 'Updated searchable tags', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Document retention/destruction date' })
  @IsDateString()
  @IsOptional()
  retentionDate?: Date;

  @ApiPropertyOptional({ description: 'Updated access control level', enum: DocumentAccessLevel })
  @IsEnum(DocumentAccessLevel)
  @IsOptional()
  accessLevel?: DocumentAccessLevel;
}
