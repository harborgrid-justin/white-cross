import {
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum';

/**
 * DTO for creating a new user
 */
export class CreateUserDto {
  @ApiProperty({
    description: 'User email address (unique)',
    example: 'nurse@school.edu',
    maxLength: 254,
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  @MaxLength(254, { message: 'Email cannot exceed 254 characters' })
  email: string;

  @ApiProperty({
    description: 'User password (min 8 characters, max 128 characters, must include uppercase, lowercase, number, and special character)',
    example: 'SecurePass123!',
    minLength: 8,
    maxLength: 128,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128, { message: 'Password cannot exceed 128 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'Jane',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.NURSE,
  })
  @IsEnum(UserRole, { message: 'Invalid user role' })
  role: UserRole;

  @ApiPropertyOptional({
    description: 'Associated school ID',
    example: 'school-uuid',
  })
  @IsOptional()
  @IsString()
  schoolId?: string;

  @ApiPropertyOptional({
    description: 'Associated district ID',
    example: 'district-uuid',
  })
  @IsOptional()
  @IsString()
  districtId?: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '(555) 123-4567',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Phone number cannot exceed 20 characters' })
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
    message: 'Invalid phone number format',
  })
  phone?: string;
}
