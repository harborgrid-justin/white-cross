import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConsentFormDto {
  @ApiProperty({ description: 'Student ID' })
  @IsString()
  studentId: string;

  @ApiProperty({ description: 'Type of consent form' })
  @IsString()
  formType: string;

  @ApiProperty({ description: 'Form content/text' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: 'Expiration date' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

export class SignFormDto {
  @ApiProperty({ description: 'Form ID' })
  @IsString()
  formId: string;

  @ApiProperty({ description: 'Name of person signing' })
  @IsString()
  signedBy: string;

  @ApiProperty({ description: 'Digital signature data' })
  @IsString()
  signature: string;

  @ApiPropertyOptional({ description: 'IP address of signer' })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'Browser user agent' })
  @IsOptional()
  @IsString()
  userAgent?: string;
}

export class VerifySignatureDto {
  @ApiProperty({ description: 'Form ID' })
  @IsString()
  formId: string;

  @ApiProperty({ description: 'Signature to verify' })
  @IsString()
  signature: string;
}

export class RevokeConsentDto {
  @ApiProperty({ description: 'Form ID' })
  @IsString()
  formId: string;

  @ApiProperty({ description: 'User revoking consent' })
  @IsString()
  revokedBy: string;

  @ApiProperty({ description: 'Reason for revocation' })
  @IsString()
  reason: string;
}

export class RenewConsentFormDto {
  @ApiProperty({ description: 'Form ID' })
  @IsString()
  formId: string;

  @ApiProperty({ description: 'User renewing the form' })
  @IsString()
  extendedBy: string;

  @ApiPropertyOptional({ description: 'Number of years to extend' })
  @IsOptional()
  @IsNumber()
  additionalYears?: number;
}

export class ConsentFormResponseDto {
  id: string;
  studentId: string;
  formType: string;
  status: 'pending' | 'signed' | 'expired' | 'revoked';
  content: string;
  signedBy?: string;
  signedAt?: Date;
  expiresAt?: Date;
  createdAt?: Date;
  digitalSignature?: string;
  version?: string;
  metadata?: Record<string, any>;
}
