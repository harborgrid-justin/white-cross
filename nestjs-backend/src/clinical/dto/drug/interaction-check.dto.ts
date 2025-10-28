import { IsArray, IsOptional, IsUUID, ArrayMinSize } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Interaction Check DTO
 * Used for checking drug-drug interactions
 */
export class InteractionCheckDto {
  @ApiProperty({
    description: 'Array of drug IDs to check for interactions',
    example: ['123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001'],
    type: [String],
    minItems: 2,
  })
  @IsArray()
  @ArrayMinSize(2, { message: 'At least 2 drugs are required to check interactions' })
  @IsUUID('4', { each: true, message: 'Each drug ID must be a valid UUID' })
  drugIds: string[];

  @ApiPropertyOptional({
    description: 'Optional student ID to check for drug allergies',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsOptional()
  @IsUUID('4', { message: 'Student ID must be a valid UUID' })
  studentId?: string;
}
