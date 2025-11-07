import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ConfigValueType,
  ConfigCategory,
  ConfigScope,
} from '../../administration/enums/administration.enums';

/**
 * DTO for creating a new configuration
 */
export class CreateConfigurationDto {
  @ApiProperty({ description: 'Configuration key (unique identifier)' })
  @IsString()
  key: string;

  @ApiProperty({ description: 'Configuration value (stored as string)' })
  @IsString()
  value: string;

  @ApiProperty({
    enum: ConfigValueType,
    description: 'Value type for validation',
  })
  @IsEnum(ConfigValueType)
  valueType: ConfigValueType;

  @ApiProperty({ enum: ConfigCategory, description: 'Configuration category' })
  @IsEnum(ConfigCategory)
  category: ConfigCategory;

  @ApiPropertyOptional({ description: 'Sub-category for further organization' })
  @IsOptional()
  @IsString()
  subCategory?: string;

  @ApiPropertyOptional({ description: 'Human-readable description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Default value for reset functionality' })
  @IsOptional()
  @IsString()
  defaultValue?: string;

  @ApiPropertyOptional({
    description: 'Valid values for enum type',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  validValues?: string[];

  @ApiPropertyOptional({ description: 'Minimum value for number type' })
  @IsOptional()
  @IsNumber()
  minValue?: number;

  @ApiPropertyOptional({ description: 'Maximum value for number type' })
  @IsOptional()
  @IsNumber()
  maxValue?: number;

  @ApiPropertyOptional({
    description: 'Whether config is visible to frontend',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({
    description: 'Whether config can be edited',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isEditable?: boolean;

  @ApiPropertyOptional({
    description: 'Whether changing this requires system restart',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  requiresRestart?: boolean;

  @ApiPropertyOptional({
    enum: ConfigScope,
    description: 'Configuration scope',
    default: ConfigScope.SYSTEM,
  })
  @IsOptional()
  @IsEnum(ConfigScope)
  scope?: ConfigScope;

  @ApiPropertyOptional({ description: 'Scope ID (district/school/user ID)' })
  @IsOptional()
  @IsString()
  scopeId?: string;

  @ApiPropertyOptional({
    description: 'Tags for categorization',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Sort order for display', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;
}
