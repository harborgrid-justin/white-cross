import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, Max } from 'class-validator';

/**
 * DTO representing a risk factor in the health risk assessment.
 * Each risk factor contributes to the overall health risk score.
 */
export class RiskFactorDto {
  @ApiProperty({
    description: 'Category of the risk factor',
    example: 'Allergies',
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: 'Severity level (0-10 scale)',
    example: 8,
    minimum: 0,
    maximum: 10,
  })
  @IsNumber()
  @Min(0)
  @Max(10)
  severity: number;

  @ApiProperty({
    description: 'Detailed description of the risk factor',
    example: '3 allergies documented, including severe reactions',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Weight of this factor in overall score calculation',
    example: 0.3,
  })
  @IsNumber()
  weight: number;
}
