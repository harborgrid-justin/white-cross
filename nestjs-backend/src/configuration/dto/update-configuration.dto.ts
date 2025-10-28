import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for updating a configuration value with audit trail
 */
export class UpdateConfigurationDto {
  @ApiProperty({ description: 'New configuration value' })
  @IsString()
  value: string;

  @ApiProperty({ description: 'User ID making the change' })
  @IsString()
  changedBy: string;

  @ApiPropertyOptional({ description: 'Name of user making the change' })
  @IsOptional()
  @IsString()
  changedByName?: string;

  @ApiPropertyOptional({ description: 'Reason for the change (audit trail)' })
  @IsOptional()
  @IsString()
  changeReason?: string;

  @ApiPropertyOptional({ description: 'IP address of the requester' })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'User agent string' })
  @IsOptional()
  @IsString()
  userAgent?: string;
}
