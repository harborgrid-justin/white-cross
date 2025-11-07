import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AuditLogFilterDto } from './audit-log-filter.dto';
import { PHIAccessType, PHIDataCategory } from '../enums';

/**
 * DTO for filtering PHI access logs
 * HIPAA Compliance: Required for querying PHI access audit trail
 */
export class PHIAccessFilterDto extends AuditLogFilterDto {
  @ApiPropertyOptional({ description: 'Filter by student ID' })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({
    enum: PHIAccessType,
    description: 'Filter by access type',
  })
  @IsOptional()
  @IsEnum(PHIAccessType)
  accessType?: PHIAccessType;

  @ApiPropertyOptional({
    enum: PHIDataCategory,
    description: 'Filter by data category',
  })
  @IsOptional()
  @IsEnum(PHIDataCategory)
  dataCategory?: PHIDataCategory;
}
