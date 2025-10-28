import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsBoolean, IsOptional, IsString } from 'class-validator';

/**
 * DTO for logging a login attempt
 */
export class LogLoginAttemptDto {
  @ApiProperty({
    description: 'Email address used for login',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({
    description: 'Whether the login attempt was successful',
    example: true,
  })
  @IsBoolean()
  success: boolean;

  @ApiProperty({
    description: 'IP address of the login attempt',
    example: '192.168.1.1',
    required: false,
  })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiProperty({
    description: 'User agent string',
    example: 'Mozilla/5.0...',
    required: false,
  })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiProperty({
    description: 'Reason for failure (if applicable)',
    example: 'Invalid password',
    required: false,
  })
  @IsOptional()
  @IsString()
  failureReason?: string;
}
