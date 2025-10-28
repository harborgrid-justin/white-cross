import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ConditionStatus } from '../enums';

/**
 * DTO for filtering chronic condition search queries.
 *
 * Supports multi-criteria filtering for care management, compliance reporting,
 * and population health monitoring.
 */
export class ChronicConditionFiltersDto {
  @ApiPropertyOptional({
    description: 'Filter by specific student UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @ApiPropertyOptional({
    description: 'Filter by management status',
    enum: ConditionStatus,
    example: ConditionStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ConditionStatus)
  status?: ConditionStatus;

  @ApiPropertyOptional({
    description: 'Filter conditions requiring IEP plans',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  requiresIEP?: boolean;

  @ApiPropertyOptional({
    description: 'Filter conditions requiring 504 plans',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  requires504?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by active/inactive status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Full-text search across condition, ICD code, notes, care plan',
    example: 'diabetes',
  })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiPropertyOptional({
    description: 'Filter conditions with reviews due within 30 days',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  reviewDueSoon?: boolean;
}
