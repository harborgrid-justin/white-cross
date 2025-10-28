import { IsString, IsNotEmpty } from 'class-validator';

export class CheckNewMedicationDto {
  @IsString()
  @IsNotEmpty()
  medicationName: string;
}
