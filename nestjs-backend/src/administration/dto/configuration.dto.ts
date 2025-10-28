import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
  IsNumber,
  IsUUID,
  MaxLength,
} from 'class-validator';
import {
  ConfigCategory,
  ConfigValueType,
  ConfigScope,
} from '../enums/administration.enums';

/**
 * DTO for creating or updating system configuration
 */
export class ConfigurationDto {
  @ApiProperty({ description: 'Configuration key', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  key: string;

  @ApiProperty({ description: 'Configuration value' })
  @IsString()
  value: string;

  @ApiProperty({ description: 'Configuration category', enum: ConfigCategory })
  @IsEnum(ConfigCategory)
  category: ConfigCategory;

  @ApiPropertyOptional({
    description: 'Value data type',
    enum: ConfigValueType,
  })
  @IsOptional()
  @IsEnum(ConfigValueType)
  valueType?: ConfigValueType;

  @ApiPropertyOptional({ description: 'Sub-category', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  subCategory?: string;

  @ApiPropertyOptional({ description: 'Configuration description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Is publicly accessible', default: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({ description: 'Can be edited by admins', default: true })
  @IsOptional()
  @IsBoolean()
  isEditable?: boolean;

  @ApiPropertyOptional({
    description: 'Requires system restart to take effect',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  requiresRestart?: boolean;

  @ApiPropertyOptional({ description: 'Configuration scope', enum: ConfigScope })
  @IsOptional()
  @IsEnum(ConfigScope)
  scope?: ConfigScope;

  @ApiPropertyOptional({ description: 'Scope ID (district, school, or user ID)' })
  @IsOptional()
  @IsUUID()
  scopeId?: string;

  @ApiPropertyOptional({ description: 'Tags for organization', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Display order', default: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

/**
 * DTO for batch updating system settings
 */
export class BatchUpdateSettingsDto {
  @ApiProperty({
    description: 'Array of configuration updates',
    type: [ConfigurationDto],
  })
  @IsArray()
  settings: ConfigurationDto[];

  @ApiPropertyOptional({ description: 'User ID making the changes' })
  @IsOptional()
  @IsUUID()
  changedBy?: string;
}

/**
 * DTO for querying configuration history
 */
export class ConfigurationHistoryQueryDto {
  @ApiProperty({ description: 'Configuration key to query history for' })
  @IsString()
  configKey: string;

  @ApiPropertyOptional({ description: 'Number of history records', default: 50 })
  @IsOptional()
  @IsNumber()
  limit?: number = 50;
}
