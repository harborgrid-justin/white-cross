import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for checking a new medication against existing medications
 */
export class CheckNewMedicationDto {
  @ApiProperty({
    description: 'Name of the medication to check for interactions',
    example: 'Amoxicillin',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  medicationName!: string;
}
