/**
 * @fileoverview Phone Number DTO
 * @module infrastructure/sms/dto/phone-number.dto
 * @description DTOs for phone number validation and formatting
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * Phone number types
 */
export enum PhoneNumberType {
  MOBILE = 'mobile',
  FIXED_LINE = 'fixed-line',
  FIXED_LINE_OR_MOBILE = 'fixed-line-or-mobile',
  TOLL_FREE = 'toll-free',
  PREMIUM_RATE = 'premium-rate',
  VOIP = 'voip',
  UNKNOWN = 'unknown',
}

/**
 * DTO for validating phone number
 */
export class ValidatePhoneNumberDto {
  @ApiProperty({
    description: 'Phone number to validate',
    example: '+15551234567',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiPropertyOptional({
    description: 'Default country code (ISO 3166-1 alpha-2)',
    example: 'US',
  })
  @IsOptional()
  @IsString()
  defaultCountry?: string;
}

/**
 * Response DTO for phone number validation
 */
export class PhoneNumberValidationResult {
  @ApiProperty({
    description: 'Whether the phone number is valid',
    example: true,
  })
  isValid: boolean;

  @ApiProperty({
    description: 'Phone number in E.164 format',
    example: '+15551234567',
    required: false,
  })
  e164Format?: string;

  @ApiProperty({
    description: 'Country code (ISO 3166-1 alpha-2)',
    example: 'US',
    required: false,
  })
  countryCode?: string;

  @ApiProperty({
    description: 'Phone number type',
    enum: PhoneNumberType,
    required: false,
  })
  type?: PhoneNumberType;

  @ApiProperty({
    description: 'National format of phone number',
    example: '(555) 123-4567',
    required: false,
  })
  nationalFormat?: string;

  @ApiProperty({
    description: 'Validation error message',
    example: 'Invalid phone number format',
    required: false,
  })
  error?: string;
}
