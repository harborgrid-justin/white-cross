import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Individual configuration update in bulk operation
 */
class BulkConfigurationItem {
  @ApiProperty({ description: 'Configuration key' })
  @IsString()
  key: string;

  @ApiProperty({ description: 'New value' })
  @IsString()
  value: string;

  @ApiPropertyOptional({ description: 'Optional scope ID for scoped configs' })
  @IsOptional()
  @IsString()
  scopeId?: string;
}

/**
 * DTO for bulk configuration updates
 */
export class ConfigurationBulkUpdateDto {
  @ApiProperty({
    description: 'Array of configuration updates',
    type: [BulkConfigurationItem],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkConfigurationItem)
  updates: BulkConfigurationItem[];

  @ApiProperty({ description: 'User ID performing the bulk update' })
  @IsString()
  changedBy: string;

  @ApiPropertyOptional({ description: 'Reason for bulk update' })
  @IsOptional()
  @IsString()
  changeReason?: string;
}
