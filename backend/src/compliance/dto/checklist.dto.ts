import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ComplianceCategory,
  ChecklistItemStatus,
} from '../entities/compliance-checklist-item.entity';

export class CreateChecklistDto {
  @ApiProperty({
    description: 'Compliance requirement description (5-500 chars)',
    minLength: 5,
    maxLength: 500,
  })
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  requirement: string;

  @ApiPropertyOptional({ description: 'Detailed requirement explanation' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ComplianceCategory, description: 'Compliance category' })
  @IsEnum(ComplianceCategory)
  category: ComplianceCategory;

  @ApiPropertyOptional({ description: 'Associated compliance report ID' })
  @IsOptional()
  @IsString()
  reportId?: string;

  @ApiPropertyOptional({ description: 'Completion due date (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

export class UpdateChecklistDto {
  @ApiPropertyOptional({
    enum: ChecklistItemStatus,
    description: 'Updated status',
  })
  @IsOptional()
  @IsEnum(ChecklistItemStatus)
  status?: ChecklistItemStatus;

  @ApiPropertyOptional({
    description: 'URL or description of compliance evidence',
  })
  @IsOptional()
  @IsString()
  evidence?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'User ID who completed the item' })
  @IsOptional()
  @IsString()
  completedBy?: string;
}

export class QueryChecklistDto {
  @ApiPropertyOptional({ description: 'Filter by report ID' })
  @IsOptional()
  @IsString()
  reportId?: string;

  @ApiPropertyOptional({
    enum: ComplianceCategory,
    description: 'Filter by category',
  })
  @IsOptional()
  @IsEnum(ComplianceCategory)
  category?: ComplianceCategory;

  @ApiPropertyOptional({
    enum: ChecklistItemStatus,
    description: 'Filter by status',
  })
  @IsOptional()
  @IsEnum(ChecklistItemStatus)
  status?: ChecklistItemStatus;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @IsOptional()
  limit?: number;
}
