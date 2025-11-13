/**
 * @fileoverview Generate Barcode DTO
 * @module student/dto
 * @description DTO for generating student barcodes
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsObject } from 'class-validator';

export enum BarcodeFormat {
  CODE128 = 'CODE128',
  QR_CODE = 'QR_CODE',
  PDF417 = 'PDF417',
}

export enum BarcodePurpose {
  STUDENT_ID = 'STUDENT_ID',
  MEDICATION = 'MEDICATION',
  ATTENDANCE = 'ATTENDANCE',
  CAFETERIA = 'CAFETERIA',
  LIBRARY = 'LIBRARY',
}

export class GenerateBarcodeDto {
  @ApiPropertyOptional({
    description: 'Barcode format',
    enum: BarcodeFormat,
    default: BarcodeFormat.CODE128,
    example: BarcodeFormat.CODE128,
  })
  @IsOptional()
  @IsEnum(BarcodeFormat)
  format?: BarcodeFormat = BarcodeFormat.CODE128;

  @ApiPropertyOptional({
    description: 'Purpose of the barcode',
    enum: BarcodePurpose,
    default: BarcodePurpose.STUDENT_ID,
    example: BarcodePurpose.STUDENT_ID,
  })
  @IsOptional()
  @IsEnum(BarcodePurpose)
  purpose?: BarcodePurpose = BarcodePurpose.STUDENT_ID;

  @ApiPropertyOptional({
    description: 'Additional metadata for barcode generation',
    example: { expiresAt: '2024-12-31', accessLevel: 'FULL' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Custom display text for barcode',
    example: 'SMITH, JOHN - GRADE 9',
  })
  @IsOptional()
  @IsString()
  displayText?: string;
}
