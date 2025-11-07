/**
 * Sign Document DTO
 * Data transfer object for applying electronic signatures to documents
 * Compliant with 21 CFR Part 11 for electronic signatures
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIP, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class SignDocumentDto {
  @ApiProperty({
    description: 'ID of document being signed',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  documentId: string;

  @ApiProperty({
    description: 'User ID of the signer',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsString()
  @IsNotEmpty()
  signedBy: string;

  @ApiProperty({
    description: 'Role of signer (Nurse, Parent, Administrator, etc.)',
    minLength: 2,
    maxLength: 100,
    example: 'School Nurse',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  signedByRole: string;

  @ApiPropertyOptional({
    description: 'Base64-encoded signature image or encrypted signature data',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
  })
  @IsString()
  @IsOptional()
  signatureData?: string;

  @ApiPropertyOptional({
    description: 'IP address of signer for audit trail',
    example: '192.168.1.100',
  })
  @IsIP()
  @IsOptional()
  ipAddress?: string;
}
