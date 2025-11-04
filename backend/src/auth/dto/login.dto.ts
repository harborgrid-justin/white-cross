import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'nurse@school.edu',
    description: 'User email address',
    maxLength: 254,
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(254, { message: 'Email cannot exceed 254 characters' })
  email: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description: 'User password',
    maxLength: 128,
  })
  @IsString()
  @MinLength(1, { message: 'Password is required' })
  @MaxLength(128, { message: 'Password cannot exceed 128 characters' })
  password: string;
}
