import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthChangePasswordDto {
  @ApiProperty({
    example: 'CurrentPass123!',
    description: 'Current password',
    maxLength: 128,
  })
  @IsString()
  @MinLength(1, { message: 'Current password is required' })
  @MaxLength(128, { message: 'Current password cannot exceed 128 characters' })
  currentPassword: string;

  @ApiProperty({
    example: 'NewPass123!',
    description:
      'New password (min 8 chars, max 128 chars, must include uppercase, lowercase, number, and special character)',
    minLength: 8,
    maxLength: 128,
  })
  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @MaxLength(128, { message: 'New password cannot exceed 128 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  newPassword: string;
}
