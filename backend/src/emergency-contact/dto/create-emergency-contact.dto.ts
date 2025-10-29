/**
 * Create Emergency Contact DTO
 *
 * Data Transfer Object for creating new emergency contact records.
 * Includes validation rules for all required and optional fields.
 */
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
  IsUUID,
  MinLength,
  MaxLength,
  Matches,
  ArrayMinSize,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContactPriority, PreferredContactMethod, NotificationChannel } from '../../contact/enums';

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
    description: 'Phone number (minimum 10 digits)',
    example: '+1-555-123-4567',
  })
  @IsString()
  @Matches(/^[\d\s\-().+]+$/, {
    message: 'Phone number must contain only digits, spaces, hyphens, parentheses, or plus sign',
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
    description: 'Physical address',
    example: '123 Main St, City, State 12345',
  })
  @IsOptional()
  @IsString()
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
    description: 'Additional notes',
    example: 'Prefers text messages during work hours',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
