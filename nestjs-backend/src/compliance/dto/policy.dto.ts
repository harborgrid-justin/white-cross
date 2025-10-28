import { IsString, IsEnum, IsOptional, IsDateString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PolicyCategory, PolicyStatus } from '../entities/policy-document.entity';

export class CreatePolicyDto {
  @ApiProperty({ description: 'Policy title (5-200 chars)', minLength: 5, maxLength: 200 })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @ApiProperty({ enum: PolicyCategory, description: 'Policy category' })
  @IsEnum(PolicyCategory)
  category: PolicyCategory;

  @ApiProperty({ description: 'Complete policy content (100-100000 chars)', minLength: 100 })
  @IsString()
  @MinLength(100)
  content: string;

  @ApiProperty({ description: 'Policy version number (e.g., 1.0)' })
  @IsString()
  version: string;

  @ApiProperty({ description: 'When the policy becomes effective (ISO 8601)' })
  @IsDateString()
  effectiveDate: string;

  @ApiPropertyOptional({ description: 'Next scheduled review date (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  reviewDate?: string;
}

export class UpdatePolicyDto {
  @ApiPropertyOptional({ enum: PolicyStatus, description: 'Updated policy status' })
  @IsOptional()
  @IsEnum(PolicyStatus)
  status?: PolicyStatus;

  @ApiPropertyOptional({ description: 'User ID who approved the policy' })
  @IsOptional()
  @IsString()
  approvedBy?: string;

  @ApiPropertyOptional({ description: 'Next scheduled review date (ISO 8601)' })
  @IsOptional()
  @IsDateString()
  reviewDate?: string;
}

export class AcknowledgePolicyDto {
  @ApiProperty({ description: 'IP address from which acknowledgment was made' })
  @IsString()
  ipAddress: string;
}

export class QueryPolicyDto {
  @ApiPropertyOptional({ enum: PolicyCategory, description: 'Filter by category' })
  @IsOptional()
  @IsEnum(PolicyCategory)
  category?: PolicyCategory;

  @ApiPropertyOptional({ enum: PolicyStatus, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(PolicyStatus)
  status?: PolicyStatus;
}
