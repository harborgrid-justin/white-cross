/**
 * Create Emergency Contact DTO
 *
 * Data Transfer Object for creating new emergency contact records.
 * Includes validation rules for all required and optional fields.
 */
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContactPriority, NotificationChannel, PreferredContactMethod } from '@/contact';

export class EmergencyContactCreateDto {
  @ApiProperty({
    description: 'Student ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  studentId: string;

  @ApiProperty({
    description: 'Emergency contact first name',
    example: 'Jane',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName: string;

  @ApiProperty({
    description: 'Emergency contact last name',
    example: 'Doe',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName: string;

  @ApiProperty({
    description: 'Relationship to student',
    example: 'Mother',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  relationship: string;

  @ApiProperty({
    description: 'Phone number (minimum 10 digits, maximum 20 characters)',
    example: '+1-555-123-4567',
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20, { message: 'Phone number cannot exceed 20 characters' })
  @Matches(/^[\d\s\-().+]+$/, {
    message:
      'Phone number must contain only digits, spaces, hyphens, parentheses, or plus sign',
  })
  phoneNumber: string;

  @ApiPropertyOptional({
    description: 'Email address',
    example: 'jane.doe@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({
    description: 'Physical address (maximum 500 characters)',
    example: '123 Main St, City, State 12345',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Address cannot exceed 500 characters' })
  address?: string;

  @ApiProperty({
    description: 'Contact priority level',
    enum: ContactPriority,
    example: ContactPriority.PRIMARY,
  })
  @IsEnum(ContactPriority)
  priority: ContactPriority;

  @ApiPropertyOptional({
    description: 'Preferred contact method',
    enum: PreferredContactMethod,
    example: PreferredContactMethod.ANY,
  })
  @IsOptional()
  @IsEnum(PreferredContactMethod)
  preferredContactMethod?: PreferredContactMethod;

  @ApiPropertyOptional({
    description: 'Notification channels (sms, email, voice)',
    example: ['sms', 'email'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  notificationChannels?: NotificationChannel[];

  @ApiPropertyOptional({
    description: 'Whether contact is authorized to pick up student',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  canPickupStudent?: boolean;

  @ApiPropertyOptional({
    description: 'Additional notes (maximum 1000 characters)',
    example: 'Prefers text messages during work hours',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Notes cannot exceed 1000 characters' })
  notes?: string;
}
