import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from './pagination.dto';
import { ProviderType, MonitoringLevel } from '../enums/provider-type.enum';

export class ProviderQueryDto extends PaginationDto {
  @ApiProperty({ 
    enum: ProviderType,
    description: 'Type of providers to filter by',
    example: ProviderType.EXPERIMENTAL
  })
  @IsEnum(ProviderType, { 
    message: `Provider type must be one of: ${Object.values(ProviderType).join(', ')}` 
  })
  type: ProviderType;

  @ApiPropertyOptional({
    description: 'Domain to filter providers by',
    example: 'health',
    minLength: 1
  })
  @IsOptional()
  @IsString({ message: 'Domain must be a string' })
  @MinLength(1, { message: 'Domain cannot be empty' })
  domain?: string;
}

export class FeatureFlagQueryDto {
  @ApiProperty({
    description: 'Feature flag to filter providers by',
    example: 'experimental',
    minLength: 1
  })
  @IsString({ message: 'Feature flag must be a string' })
  @MinLength(1, { message: 'Feature flag cannot be empty' })
  flag: string;
}

export class MonitoringQueryDto extends PaginationDto {
  @ApiPropertyOptional({ 
    enum: MonitoringLevel,
    description: 'Level of monitoring to filter by',
    example: MonitoringLevel.BASIC
  })
  @IsOptional()
  @IsEnum(MonitoringLevel, { 
    message: `Monitoring level must be one of: ${Object.values(MonitoringLevel).join(', ')}` 
  })
  level?: MonitoringLevel;
}

export class MetadataQueryDto extends PaginationDto {
  @ApiProperty({
    description: 'Metadata key to filter by',
    example: 'domain',
    minLength: 1
  })
  @IsString({ message: 'Metadata key must be a string' })
  @MinLength(1, { message: 'Metadata key cannot be empty' })
  key: string;

  @ApiPropertyOptional({
    description: 'Metadata value to filter by',
    example: 'health'
  })
  @IsOptional()
  @IsString({ message: 'Metadata value must be a string' })
  value?: string;
}
