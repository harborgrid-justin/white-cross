import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Severity levels for drug interactions
 */
export enum InteractionSeverity {
  MINOR = 'minor',
  MODERATE = 'moderate',
  MAJOR = 'major',
  CONTRAINDICATED = 'contraindicated',
}

/**
 * DTO representing a drug interaction between two medications
 */
export class DrugInteractionDto {
  @ApiProperty({
    description: 'Severity level of the drug interaction',
    enum: InteractionSeverity,
    example: InteractionSeverity.MODERATE,
  })
  @IsEnum(InteractionSeverity)
  severity!: InteractionSeverity;

  @ApiProperty({
    description: 'Name of the first medication in the interaction',
    example: 'Warfarin',
  })
  @IsString()
  medication1!: string;

  @ApiProperty({
    description: 'Name of the second medication in the interaction',
    example: 'Aspirin',
  })
  @IsString()
  medication2!: string;

  @ApiProperty({
    description: 'Detailed description of the interaction and its effects',
    example:
      'Concurrent use may increase bleeding risk due to additive anticoagulant effects',
  })
  @IsString()
  description!: string;

  @ApiProperty({
    description: 'Clinical recommendation for managing this interaction',
    example:
      'Monitor INR levels more frequently. Consider alternative pain management options.',
  })
  @IsString()
  recommendation!: string;
}
