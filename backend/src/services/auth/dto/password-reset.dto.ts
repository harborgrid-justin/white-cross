import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

/**
 * Forgot password DTO
 */
export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email address of the user requesting password reset',
    example: 'nurse@school.edu',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  email: string;
}

/**
 * Reset password DTO
 */
export class ResetPasswordDto {
  @ApiProperty({
    description: 'Password reset token from email',
    example: 'abc123def456ghi789',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description:
      'New password (min 8 chars, must include uppercase, lowercase, number, special char)',
    example: 'NewSecurePass123!',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain uppercase, lowercase, number, and special character',
  })
  password: string;
}

/**
 * Verify reset token DTO
 */
export class VerifyResetTokenDto {
  @ApiProperty({
    description: 'Password reset token to verify',
    example: 'abc123def456ghi789',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}

/**
 * Reset password response DTO
 */
export class ResetPasswordResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Password has been reset successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Whether the operation was successful',
    example: true,
  })
  success: boolean;
}
