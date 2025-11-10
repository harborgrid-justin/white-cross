import { IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Drug Search DTO
 * Used for searching drugs by name or brand
 */
export class DrugSearchDto {
  @ApiProperty({
    description: 'Search query (drug name or brand)',
    example: 'ibuprofen',
    minLength: 2,
  })
  @IsString()
  @MinLength(2, { message: 'Search query must be at least 2 characters' })
  query: string;

  @ApiPropertyOptional({
    description: 'Maximum number of results',
    example: 20,
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
