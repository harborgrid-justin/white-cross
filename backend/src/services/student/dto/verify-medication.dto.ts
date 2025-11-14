/**
 * @fileoverview Verify Medication Administration DTO
 * @module student/dto
 * @description DTO for three-point barcode verification of medication administration
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Verify Medication Administration DTO
 *
 * Implements the Five Rights of Medication Administration using three-point barcode verification:
 * 1. Right Patient - Student barcode verification
 * 2. Right Medication - Medication barcode verification
 * 3. Right Person - Nurse barcode verification
 * 4. Right Time - System timestamp (automatic)
 * 5. Right Dose - Verified through medication barcode lookup
 *
 * This is a critical safety feature that prevents medication errors
 *
 * PHI Protected: All medication verification attempts are logged for compliance
 * Failed verifications trigger immediate alerts to prevent errors
 */
export class VerifyMedicationDto {
  @ApiProperty({
    description: 'Student ID barcode string',
    example: 'STU-2024-12345',
  })
  @IsNotEmpty()
  @IsString()
  studentBarcode!: string;

  @ApiProperty({
    description: 'Medication barcode string (NDC or custom code)',
    example: 'MED-12345-ASPIRIN-100MG',
  })
  @IsNotEmpty()
  @IsString()
  medicationBarcode!: string;

  @ApiProperty({
    description: 'Nurse ID barcode string for verification',
    example: 'NURSE-2024-789',
  })
  @IsNotEmpty()
  @IsString()
  nurseBarcode!: string;
}
