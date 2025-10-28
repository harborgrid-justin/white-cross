import { IsEnum, IsOptional, IsBoolean, IsString, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ConfigCategory, ConfigScope } from '../../administration/enums/administration.enums';
import { Transform } from 'class-transformer';

/**
 * DTO for filtering configurations
 */
export class FilterConfigurationDto {
  @ApiPropertyOptional({ enum: ConfigCategory, description: 'Filter by category' })
  @IsOptional()
  @IsEnum(ConfigCategory)
  category?: ConfigCategory;

  @ApiPropertyOptional({ description: 'Filter by sub-category' })
  @IsOptional()
  @IsString()
  subCategory?: string;

  @ApiPropertyOptional({ enum: ConfigScope, description: 'Filter by scope' })
  @IsOptional()
  @IsEnum(ConfigScope)
  scope?: ConfigScope;

  @ApiPropertyOptional({ description: 'Filter by scope ID' })
  @IsOptional()
  @IsString()
  scopeId?: string;

  @ApiPropertyOptional({ description: 'Filter by tags', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  tags?: string[];

  @ApiPropertyOptional({ description: 'Filter by public visibility' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({ description: 'Filter by editability' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isEditable?: boolean;
}
