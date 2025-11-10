/**
 * @fileoverview Scan Barcode DTO
 * @module student/dto
 * @description DTO for barcode scanning operations
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * Barcode Scan Type Enumeration
 */
export enum BarcodeScanType {
  STUDENT = 'student',
  MEDICATION = 'medication',
  EQUIPMENT = 'equipment',
  GENERAL = 'general',
}

/**
 * Scan Barcode DTO
 *
 * Used for barcode scanning operations:
 * - Student ID cards
 * - Medication labels
 * - Medical equipment
 * - General inventory items
 *
 * Supports multiple barcode formats:
 * - Code 128
 * - QR Code
 * - Data Matrix
 * - PDF417
 *
 * Used for quick identification and tracking
 */
export class StudentScanBarcodeDto {
  @ApiProperty({
    description: 'Barcode string data (alphanumeric)',
    example: 'STU-2024-12345',
  })
  @IsNotEmpty()
  @IsString()
  barcodeString!: string;

  @ApiPropertyOptional({
    description: 'Type of barcode scan for context-specific processing',
    enum: BarcodeScanType,
    example: BarcodeScanType.STUDENT,
    default: BarcodeScanType.GENERAL,
  })
  @IsOptional()
  @IsEnum(BarcodeScanType)
  scanType?: BarcodeScanType = BarcodeScanType.GENERAL;
}
