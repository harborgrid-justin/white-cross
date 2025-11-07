/**
 * Update Emergency Contact DTO
 *
 * Data Transfer Object for updating existing emergency contact records.
 * All fields are optional to support partial updates.
 */
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
  MinLength,
  MaxLength,
  Matches,
  ArrayMinSize,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ContactPriority,
  PreferredContactMethod,
  VerificationStatus,
  NotificationChannel,
} from '@/contact';

export class EmergencyContactUpdateDto {
  @ApiPropertyOptional({
    description: 'Emergency contact first name',
    example: 'Jane',
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Emergency contact last name',
    example: 'Doe',
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Relationship to student',
    example: 'Mother',
    minLength: 1,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  relationship?: string;

  @ApiPropertyOptional({
    description: 'Phone number (minimum 10 digits)',
    example: '+1-555-123-4567',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[\d\s\-().+]+$/, {
    message:
      'Phone number must contain only digits, spaces, hyphens, parentheses, or plus sign',
  })
  phoneNumber?: string;

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

  @ApiPropertyOptional({
    description: 'Contact priority level',
    enum: ContactPriority,
    example: ContactPriority.PRIMARY,
  })
  @IsOptional()
  @IsEnum(ContactPriority)
  priority?: ContactPriority;

  @ApiPropertyOptional({
    description: 'Active status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Preferred contact method',
    enum: PreferredContactMethod,
    example: PreferredContactMethod.ANY,
  })
  @IsOptional()
  @IsEnum(PreferredContactMethod)
  preferredContactMethod?: PreferredContactMethod;

  @ApiPropertyOptional({
    description: 'Verification status',
    enum: VerificationStatus,
    example: VerificationStatus.VERIFIED,
  })
  @IsOptional()
  @IsEnum(VerificationStatus)
  verificationStatus?: VerificationStatus;

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
