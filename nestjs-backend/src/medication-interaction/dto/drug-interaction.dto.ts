import { IsString, IsEnum } from 'class-validator';

export enum InteractionSeverity {
  MINOR = 'minor',
  MODERATE = 'moderate',
  MAJOR = 'major',
  CONTRAINDICATED = 'contraindicated',
}

export class DrugInteractionDto {
  @IsEnum(InteractionSeverity)
  severity: InteractionSeverity;

  @IsString()
  medication1: string;

  @IsString()
  medication2: string;

  @IsString()
  description: string;

  @IsString()
  recommendation: string;
}
