import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for querying high-risk students.
 * Allows filtering by minimum risk score threshold.
 */
export class HighRiskQueryDto {
  @ApiPropertyOptional({
    description: 'Minimum risk score threshold (0-100)',
    example: 50,
    minimum: 0,
    maximum: 100,
    default: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  minScore?: number = 50;
}
