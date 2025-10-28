/**
 * Create Emergency Contact DTO
 * @description DTO for creating a new emergency contact with validation
 */
import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsUUID,
  Length,
  Matches,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsIn
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ContactPriority,
  VerificationStatus,
  PreferredContactMethod,
  VALID_NOTIFICATION_CHANNELS,
  VALID_RELATIONSHIPS
} from '../enums';

export class CreateEmergencyContactDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Student ID this contact belongs to'
  })
  @IsUUID()
  studentId: string;

  @ApiProperty({ example: 'Jane', description: 'First name', minLength: 1, maxLength: 100 })
  @IsString()
  @Length(1, 100)
  @Matches(/^[a-zA-Z\s'-]+$/, {
    message: 'First name can only contain letters, spaces, hyphens, and apostrophes'
  })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name', minLength: 1, maxLength: 100 })
  @IsString()
  @Length(1, 100)
  @Matches(/^[a-zA-Z\s'-]+$/, {
    message: 'Last name can only contain letters, spaces, hyphens, and apostrophes'
  })
  lastName: string;

  @ApiProperty({
    example: 'PARENT',
    description: 'Relationship to student',
    enum: VALID_RELATIONSHIPS
  })
  @IsString()
  @IsIn(VALID_RELATIONSHIPS)
  relationship: string;

  @ApiProperty({
    example: '+1-555-123-4567',
    description: 'Phone number (required)',
    minLength: 10,
    maxLength: 20
  })
  @IsString()
  @Length(10, 20)
  phoneNumber: string;

  @ApiPropertyOptional({
    example: 'jane.doe@example.com',
    description: 'Email address (optional)'
  })
  @IsOptional()
  @IsEmail()
  @Length(0, 255)
  email?: string;

  @ApiPropertyOptional({
    example: '123 Main St, Springfield, IL 62701',
    description: 'Physical address'
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  address?: string;

  @ApiProperty({
    enum: ContactPriority,
    example: ContactPriority.PRIMARY,
    description: 'Contact priority level',
    default: ContactPriority.PRIMARY
  })
  @IsEnum(ContactPriority)
  priority: ContactPriority;

  @ApiPropertyOptional({
    example: true,
    description: 'Active status',
    default: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    enum: PreferredContactMethod,
    example: PreferredContactMethod.SMS,
    description: 'Preferred contact method'
  })
  @IsOptional()
  @IsEnum(PreferredContactMethod)
  preferredContactMethod?: PreferredContactMethod;

  @ApiPropertyOptional({
    enum: VerificationStatus,
    example: VerificationStatus.UNVERIFIED,
    description: 'Verification status',
    default: VerificationStatus.UNVERIFIED
  })
  @IsOptional()
  @IsEnum(VerificationStatus)
  verificationStatus?: VerificationStatus;

  @ApiPropertyOptional({
    example: ['sms', 'email'],
    description: 'Notification channels',
    isArray: true,
    enum: VALID_NOTIFICATION_CHANNELS
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsIn(VALID_NOTIFICATION_CHANNELS, { each: true })
  notificationChannels?: string[];

  @ApiPropertyOptional({
    example: true,
    description: 'Whether contact can pick up student',
    default: false
  })
  @IsOptional()
  @IsBoolean()
  canPickupStudent?: boolean;

  @ApiPropertyOptional({
    example: 'Available after 3 PM',
    description: 'Additional notes'
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  notes?: string;
}
