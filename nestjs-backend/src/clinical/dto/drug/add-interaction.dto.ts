import { IsString, IsUUID, IsEnum, IsOptional, IsArray, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InteractionSeverity } from '../../enums/interaction-severity.enum';

/**
 * Add Drug Interaction DTO
 * Used for recording a drug-drug interaction
 */
export class AddInteractionDto {
  @ApiProperty({
    description: 'First drug ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4')
  drug1Id: string;

  @ApiProperty({
    description: 'Second drug ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID('4')
  drug2Id: string;

  @ApiProperty({
    description: 'Interaction severity level',
    enum: InteractionSeverity,
    example: InteractionSeverity.MODERATE,
  })
  @IsEnum(InteractionSeverity)
  severity: InteractionSeverity;

  @ApiProperty({
    description: 'Description of the interaction',
    example: 'May increase risk of gastrointestinal bleeding',
  })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiPropertyOptional({
    description: 'Clinical effects of the interaction',
    example: 'Increased bleeding risk, gastric irritation',
  })
  @IsOptional()
  @IsString()
  clinicalEffects?: string;

  @ApiPropertyOptional({
    description: 'Management recommendations',
    example: 'Monitor for signs of bleeding, consider alternative therapy',
  })
  @IsOptional()
  @IsString()
  management?: string;

  @ApiPropertyOptional({
    description: 'Reference citations',
    example: ['DrugBank', 'FDA Drug Interactions Database'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  references?: string[];

  @ApiPropertyOptional({
    description: 'Evidence level (e.g., Level A, Level B)',
    example: 'Level A',
  })
  @IsOptional()
  @IsString()
  evidenceLevel?: string;
}
