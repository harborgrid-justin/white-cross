import { IsBoolean, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ConflictResolution } from '../enums';

/**
 * DTO for sync operation options
 */
export class SyncOptionsDto {
  @ApiProperty({ description: 'Force synchronization', required: false, default: false })
  @IsBoolean()
  @IsOptional()
  forceSync?: boolean;

  @ApiProperty({ description: 'Batch size for sync', required: false, default: 50 })
  @IsNumber()
  @IsOptional()
  batchSize?: number;

  @ApiProperty({ description: 'Retry failed items', required: false, default: true })
  @IsBoolean()
  @IsOptional()
  retryFailed?: boolean;

  @ApiProperty({
    description: 'Conflict resolution strategy',
    enum: ConflictResolution,
    required: false
  })
  @IsEnum(ConflictResolution)
  @IsOptional()
  conflictStrategy?: ConflictResolution;
}
