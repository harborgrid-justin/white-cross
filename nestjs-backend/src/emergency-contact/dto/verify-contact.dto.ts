/**
 * Verify Contact DTO
 *
 * Data Transfer Object for verifying emergency contact information.
 */
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum VerificationMethod {
  SMS = 'sms',
  EMAIL = 'email',
  VOICE = 'voice',
}

export class VerifyContactDto {
  @ApiProperty({
    description: 'Verification method to use',
    enum: VerificationMethod,
    example: VerificationMethod.SMS,
  })
  @IsEnum(VerificationMethod)
  verificationMethod: VerificationMethod;
}
