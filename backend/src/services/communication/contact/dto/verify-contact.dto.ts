/**
 * Verify Contact DTO
 * @description DTO for contact verification workflow
 */
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VerificationStatus } from '../enums';

export class ContactVerifyDto {
  @ApiProperty({
    enum: VerificationStatus,
    example: VerificationStatus.VERIFIED,
    description: 'New verification status',
  })
  @IsEnum(VerificationStatus)
  verificationStatus: VerificationStatus;

  @ApiPropertyOptional({
    example: 'Contact verified via phone call',
    description: 'Verification notes',
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  notes?: string;
}
