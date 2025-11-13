/**
 * @fileoverview Verify Barcode DTO
 * @module student/dto
 * @description DTO for verifying student barcodes
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsObject } from 'class-validator';

export enum VerificationPurpose {
  STUDENT_ID = 'STUDENT_ID',
  MEDICATION = 'MEDICATION',
  ATTENDANCE = 'ATTENDANCE',
  CAFETERIA = 'CAFETERIA',
  LIBRARY = 'LIBRARY',
  CHECK_IN = 'CHECK_IN',
  CHECK_OUT = 'CHECK_OUT',
}

export class VerifyBarcodeDto {
  @ApiProperty({
    description: 'Barcode string to verify',
    example: '123456789',
  })
  @IsString()
  barcode: string;

  @ApiPropertyOptional({
    description: 'Purpose of verification',
    enum: VerificationPurpose,
    example: VerificationPurpose.STUDENT_ID,
  })
  @IsOptional()
  @IsEnum(VerificationPurpose)
  purpose?: VerificationPurpose;

  @ApiPropertyOptional({
    description: 'Location where verification is happening',
    example: 'Main Entrance',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: 'Device or system performing verification',
    example: 'Attendance Terminal #1',
  })
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiPropertyOptional({
    description: 'Additional verification metadata',
    example: { shift: 'morning', accessLevel: 'student' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
