import {
  IsString,
  IsOptional,
  IsArray,
  IsInt,
  Min,
  Max,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApiKeyDto {
  @ApiProperty({
    description: 'Human-readable name for the API key',
    example: 'SIS Integration - Production',
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'Description of the API key purpose',
    example: 'Used for Student Information System integration',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Array of scopes/permissions for this API key',
    example: ['students:read', 'health-records:read'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  scopes?: string[];

  @ApiProperty({
    description: 'Number of days until key expires',
    example: 365,
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(365)
  @IsOptional()
  expiresInDays?: number;

  @ApiProperty({
    description: 'IP address restriction pattern (CIDR notation)',
    example: '192.168.1.0/24',
    required: false,
  })
  @IsString()
  @IsOptional()
  ipRestriction?: string;

  @ApiProperty({
    description: 'Rate limit (requests per minute)',
    example: 1000,
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(10000)
  @IsOptional()
  rateLimit?: number;
}
