import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAuditLogDto } from './create-audit-log.dto';
import { PHIAccessType } from '../enums/phi-access-type.enum';
import { PHIDataCategory } from '../enums/phi-data-category.enum';

/**
 * DTO for logging PHI (Protected Health Information) access
 * HIPAA Compliance: Required for tracking all PHI access
 */
export class CreatePHIAccessLogDto extends CreateAuditLogDto {
  @ApiProperty({ description: 'Student ID whose PHI is being accessed' })
  @IsString()
  studentId: string;

  @ApiProperty({ enum: PHIAccessType, description: 'Type of PHI access' })
  @IsEnum(PHIAccessType)
  accessType: PHIAccessType;

  @ApiProperty({
    enum: PHIDataCategory,
    description: 'Category of PHI data accessed',
  })
  @IsEnum(PHIDataCategory)
  dataCategory: PHIDataCategory;
}
