import { IsString, IsOptional, IsEnum, IsObject, IsBoolean, IsIP } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuditAction } from '@/audit';

/**
 * DTO for creating audit log entries
 */
export class CreateAuditLogDto {
  @ApiPropertyOptional({ description: 'User ID who performed the action' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ enum: AuditAction, description: 'Action performed' })
  @IsEnum(AuditAction)
  action: AuditAction;

  @ApiProperty({ description: 'Type of entity being audited' })
  @IsString()
  entityType: string;

  @ApiPropertyOptional({ description: 'ID of the entity being audited' })
  @IsOptional()
  @IsString()
  entityId?: string;

  @ApiPropertyOptional({ description: 'Changes made or additional data' })
  @IsOptional()
  @IsObject()
  changes?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'IP address of the request' })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'User agent of the request' })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiPropertyOptional({
    description: 'Whether the action was successful',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  success?: boolean;

  @ApiPropertyOptional({ description: 'Error message if action failed' })
  @IsOptional()
  @IsString()
  errorMessage?: string;
}
