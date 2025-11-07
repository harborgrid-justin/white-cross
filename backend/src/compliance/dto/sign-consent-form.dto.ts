/**
 * DTO for signing consent forms with digital signature
 * HIPAA 45 CFR 164.508 - Authorization requirements
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsIP,
} from 'class-validator';

export class SignConsentFormDto {
  @ApiProperty({
    description: 'ID of the consent form being signed',
    example: 'consent-form-uuid-123',
  })
  @IsString()
  @IsNotEmpty()
  consentFormId: string;

  @ApiProperty({
    description: 'ID of the student for whom consent is given',
    example: 'student-uuid-456',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Full name of person signing the consent form',
    example: 'Jane Marie Doe',
    minLength: 2,
  })
  @IsString()
  @MinLength(2, {
    message: 'Signatory name must be at least 2 characters for legal validity',
  })
  @IsNotEmpty()
  signedBy: string;

  @ApiProperty({
    description: 'Relationship to student from authorized list',
    example: 'Mother',
    enum: [
      'Mother',
      'Father',
      'Parent',
      'Legal Guardian',
      'Foster Parent',
      'Grandparent',
      'Stepparent',
      'Other Authorized Adult',
    ],
  })
  @IsString()
  @IsNotEmpty()
  relationship: string;

  @ApiPropertyOptional({
    description: 'Base64-encoded digital signature image (10-100,000 bytes)',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
  })
  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(100000)
  signatureData?: string;

  @ApiPropertyOptional({
    description: 'IP address of signing device for audit trail',
    example: '192.168.1.100',
  })
  @IsIP()
  @IsOptional()
  ipAddress?: string;
}
