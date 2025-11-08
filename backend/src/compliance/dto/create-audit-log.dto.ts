/**
 * DTO for creating HIPAA-compliant audit log entries
 * Required by 45 CFR 164.312(b) - Audit Controls
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsIP, IsObject, IsOptional, IsString } from 'class-validator';
import { AuditAction } from '../enums/index';

export class CreateAuditLogDto {
  @ApiPropertyOptional({
    description:
      'ID of user performing the action (optional for system actions)',
    example: 'user-uuid-123',
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    description: 'Action type performed',
    enum: AuditAction,
    example: AuditAction.VIEW,
  })
  @IsEnum(AuditAction)
  action: AuditAction;

  @ApiProperty({
    description: 'Type of entity being accessed or modified',
    example: 'HealthRecord',
  })
  @IsString()
  entityType: string;

  @ApiPropertyOptional({
    description: 'Unique identifier of the specific entity instance',
    example: 'record-uuid-456',
  })
  @IsString()
  @IsOptional()
  entityId?: string;

  @ApiPropertyOptional({
    description: 'Object containing change details (before/after values)',
    example: { status: { before: 'draft', after: 'submitted' } },
  })
  @IsObject()
  @IsOptional()
  changes?: any;

  @ApiPropertyOptional({
    description: 'IP address of the request origin for security tracking',
    example: '192.168.1.100',
  })
  @IsIP()
  @IsOptional()
  ipAddress?: string;

  @ApiPropertyOptional({
    description: 'Browser/client user agent string',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  })
  @IsString()
  @IsOptional()
  userAgent?: string;
}
