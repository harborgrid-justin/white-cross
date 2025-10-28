/**
 * @fileoverview Verify Medication Administration DTO
 * @module advanced-features/dto/verify-medication-administration.dto
 * @description DTO for verifying medication administration using barcodes (Five Rights Check)
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class VerifyMedicationAdministrationDto {
  @ApiProperty({
    description: 'Student barcode',
    example: 'STU123456789',
  })
  @IsNotEmpty({ message: 'Student barcode is required' })
  @IsString()
  studentBarcode: string;

  @ApiProperty({
    description: 'Medication barcode',
    example: 'MED987654321',
  })
  @IsNotEmpty({ message: 'Medication barcode is required' })
  @IsString()
  medicationBarcode: string;

  @ApiProperty({
    description: 'Nurse barcode',
    example: 'NRS456789123',
  })
  @IsNotEmpty({ message: 'Nurse barcode is required' })
  @IsString()
  nurseBarcode: string;
}
