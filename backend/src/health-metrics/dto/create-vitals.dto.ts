import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

class BloodPressureDto {
  @IsNumber()
  systolic: number;

  @IsNumber()
  diastolic: number;
}

class VitalSignsDto {
  @IsOptional()
  @IsNumber()
  heartRate?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => BloodPressureDto)
  bloodPressure?: BloodPressureDto;

  @IsOptional()
  @IsNumber()
  temperature?: number;

  @IsOptional()
  @IsNumber()
  oxygenSaturation?: number;

  @IsOptional()
  @IsNumber()
  respiratoryRate?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  height?: number;
}

export class CreateVitalsDto {
  @IsNumber()
  patientId: number;

  @ValidateNested()
  @Type(() => VitalSignsDto)
  vitals: VitalSignsDto;

  @IsOptional()
  @IsString()
  deviceId?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  recordedBy?: number;
}
