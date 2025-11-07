import { IsBoolean, IsArray, IsNumber, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { DrugInteractionDto } from './drug-interaction.dto';

/**
 * DTO representing the result of a medication interaction check
 */
export class InteractionCheckResultDto {
  @ApiProperty({
    description: 'Whether any drug interactions were found',
    example: true,
  })
  @IsBoolean()
  hasInteractions!: boolean;

  @ApiProperty({
    description: 'Array of identified drug interactions',
    type: [DrugInteractionDto],
    example: [
      {
        severity: 'moderate',
        medication1: 'Warfarin',
        medication2: 'Aspirin',
        description: 'Concurrent use may increase bleeding risk',
        recommendation: 'Monitor INR levels more frequently',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DrugInteractionDto)
  interactions!: DrugInteractionDto[];

  @ApiProperty({
    description: 'Overall safety score (0-100, higher is safer)',
    example: 75,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  safetyScore!: number;
}
