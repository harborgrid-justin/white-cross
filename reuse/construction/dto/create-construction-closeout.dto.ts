
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateConstructionCloseoutDto {
  @ApiProperty()
  @IsUUID()
  projectId: string;

  @ApiProperty()
  @IsString()
  projectName: string;

  @ApiProperty()
  @IsUUID()
  contractorId: string;

  @ApiProperty()
  @IsString()
  contractorName: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  contractValue: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  retainageAmount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  retainagePercentage?: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  warrantyPeriodMonths: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  finalPaymentAmount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}
