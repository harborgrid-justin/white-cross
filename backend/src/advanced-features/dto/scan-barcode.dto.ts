/**
 * @fileoverview Scan Barcode DTO
 * @module advanced-features/dto/scan-barcode.dto
 * @description DTO for barcode scanning operations
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

export enum ScanType {
  STUDENT = 'student',
  MEDICATION = 'medication',
  NURSE = 'nurse',
  INVENTORY = 'inventory',
  EQUIPMENT = 'equipment',
}

export class AdvancedFeaturesScanBarcodeDto {
  @ApiProperty({
    description: 'Barcode string to scan',
    example: '123456789012',
  })
  @IsNotEmpty({ message: 'Barcode string is required' })
  @IsString()
  barcodeString: string;

  @ApiProperty({
    description: 'Type of barcode being scanned',
    enum: ScanType,
    example: ScanType.MEDICATION,
  })
  @IsNotEmpty({ message: 'Scan type is required' })
  @IsEnum(ScanType, { message: 'Invalid scan type' })
  scanType: ScanType;

  @ApiProperty({
    description: 'Additional context for the scan',
    example: 'medication_administration',
    required: false,
  })
  @IsOptional()
  @IsString()
  context?: string;
}
