import {
  IsString,
  IsEnum,
  IsOptional,
  IsObject,
  IsNumber,
  IsUrl,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IntegrationType } from '../entities/integration-config.entity';
import type {
  IntegrationSettings,
  AuthenticationConfig,
} from '../types';

export class CreateIntegrationDto {
  @ApiProperty({
    description: 'Integration name',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiProperty({ enum: IntegrationType, description: 'Type of integration' })
  @IsEnum(IntegrationType)
  type!: IntegrationType;

  @ApiPropertyOptional({ description: 'API endpoint URL' })
  @IsOptional()
  @IsUrl()
  endpoint?: string;

  @ApiPropertyOptional({ description: 'API key for authentication' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  apiKey?: string;

  @ApiPropertyOptional({ description: 'Username for basic authentication' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  username?: string;

  @ApiPropertyOptional({ description: 'Password for basic authentication' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiPropertyOptional({ description: 'Integration-specific settings' })
  @IsOptional()
  @IsObject()
  settings?: IntegrationSettings;

  @ApiPropertyOptional({ description: 'Authentication configuration' })
  @IsOptional()
  @IsObject()
  authentication?: AuthenticationConfig;

  @ApiPropertyOptional({
    description: 'Sync frequency in minutes',
    minimum: 1,
    maximum: 43200,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(43200)
  syncFrequency?: number;
}
