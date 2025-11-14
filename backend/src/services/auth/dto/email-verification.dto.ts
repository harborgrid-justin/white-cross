import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Verify email DTO
 */
export class VerifyEmailDto {
  @ApiProperty({
    description: 'Email verification token from email link',
    example: 'abc123def456ghi789',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}

/**
 * Resend verification email DTO
 */
export class ResendVerificationDto {
  @ApiProperty({
    description: 'Email address to resend verification to',
    example: 'nurse@school.edu',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  email: string;
}

/**
 * Email verification response DTO
 */
export class EmailVerificationResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Email verified successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Whether the operation was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Email address that was verified',
    example: 'nurse@school.edu',
    required: false,
  })
  email?: string;
}
