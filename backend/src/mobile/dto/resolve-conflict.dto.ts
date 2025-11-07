import { IsEnum, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ConflictResolution } from '../enums';

/**
 * DTO for resolving sync conflicts
 */
export class ResolveConflictDto {
  @ApiProperty({
    description: 'Conflict resolution strategy',
    enum: ConflictResolution,
  })
  @IsEnum(ConflictResolution)
  resolution!: ConflictResolution;

  @ApiProperty({
    description: 'Manually merged data (for MERGE strategy)',
    required: false,
  })
  @IsObject()
  @IsOptional()
  mergedData?: Record<string, any>;
}
