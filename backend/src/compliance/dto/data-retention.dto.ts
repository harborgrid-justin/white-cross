import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DataRetentionCategory, RetentionStatus } from '@/database/models';

export class CreateDataRetentionDto {
  @ApiProperty({ enum: DataRetentionCategory, description: 'Data category' })
  @IsEnum(DataRetentionCategory)
  category: DataRetentionCategory;

  @ApiProperty({ description: 'Policy description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Retention period in days', minimum: 1 })
  @IsInt()
  @Min(1)
  retentionPeriodDays: number;

  @ApiProperty({
    description: 'Legal or regulatory basis for retention period',
  })
  @IsString()
  legalBasis: string;

  @ApiPropertyOptional({
    description: 'Auto-delete after retention period',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  autoDelete?: boolean;
}

export class UpdateDataRetentionDto {
  @ApiPropertyOptional({ description: 'Updated retention period in days' })
  @IsOptional()
  @IsInt()
  @Min(1)
  retentionPeriodDays?: number;

  @ApiPropertyOptional({ enum: RetentionStatus, description: 'Updated status' })
  @IsOptional()
  @IsEnum(RetentionStatus)
  status?: RetentionStatus;

  @ApiPropertyOptional({ description: 'Auto-delete flag' })
  @IsOptional()
  @IsBoolean()
  autoDelete?: boolean;
}

export class QueryDataRetentionDto {
  @ApiPropertyOptional({
    enum: DataRetentionCategory,
    description: 'Filter by category',
  })
  @IsOptional()
  @IsEnum(DataRetentionCategory)
  category?: DataRetentionCategory;

  @ApiPropertyOptional({
    enum: RetentionStatus,
    description: 'Filter by status',
  })
  @IsOptional()
  @IsEnum(RetentionStatus)
  status?: RetentionStatus;
}
