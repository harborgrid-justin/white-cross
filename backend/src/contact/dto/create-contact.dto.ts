/**
 * Create Contact DTO
 * @description DTO for creating a new contact with validation
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
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContactType } from '../enums';

export class CreateContactDto {
  @ApiProperty({
    example: 'John',
    description: 'First name',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  lastName: string;

  @ApiPropertyOptional({
    example: 'john.doe@example.com',
    description: 'Email address',
  })
  @IsOptional()
  @IsEmail()
  @Length(0, 255)
  email?: string;

  @ApiPropertyOptional({ example: '+1-555-0123', description: 'Phone number' })
  @IsOptional()
  @IsString()
  @Length(10, 20)
  @Matches(/^[\d\s\-\+\(\)]+$/, {
    message: 'Invalid phone number format',
  })
  phone?: string;

  @ApiProperty({
    enum: ContactType,
    example: ContactType.Guardian,
    description: 'Contact type',
  })
  @IsEnum(ContactType)
  type: ContactType;

  @ApiPropertyOptional({
    example: 'Acme Healthcare',
    description: 'Organization name',
  })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  organization?: string;

  @ApiPropertyOptional({
    example: 'Director',
    description: 'Job title or role',
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  title?: string;

  @ApiPropertyOptional({
    example: '123 Main St',
    description: 'Physical address',
  })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  address?: string;

  @ApiPropertyOptional({ example: 'Springfield', description: 'City' })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  city?: string;

  @ApiPropertyOptional({ example: 'IL', description: 'State or province' })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  state?: string;

  @ApiPropertyOptional({ example: '62701', description: 'Postal code' })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  zip?: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID of related student or user',
  })
  @IsOptional()
  @IsUUID()
  relationTo?: string;

  @ApiPropertyOptional({
    example: 'parent',
    description: 'Type of relationship',
  })
  @IsOptional()
  @IsString()
  @Length(0, 50)
  relationshipType?: string;

  @ApiPropertyOptional({
    example: { emergencyProtocol: 'call-911' },
    description: 'Custom healthcare-specific fields',
  })
  @IsOptional()
  @IsObject()
  customFields?: Record<string, any>;

  @ApiPropertyOptional({
    example: true,
    description: 'Active status',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: 'Prefers morning calls',
    description: 'Additional notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User ID who creates this contact',
  })
  @IsOptional()
  @IsUUID()
  createdBy?: string;
}
