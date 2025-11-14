import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { BackupType } from '../enums/administration.enums';

/**
 * DTO for creating a backup
 */
export class CreateBackupDto {
  @ApiProperty({ description: 'Backup type', enum: BackupType })
  @IsEnum(BackupType)
  type: BackupType;

  @ApiPropertyOptional({ description: 'User UUID who triggered the backup' })
  @IsOptional()
  @IsUUID()
  triggeredBy?: string;
}

/**
 * DTO for querying backup logs with pagination
 */
export class BackupQueryDto {
  @ApiPropertyOptional({ description: 'Page number', default: 1, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    default: 20,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 20;
}
