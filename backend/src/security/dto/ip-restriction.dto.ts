import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsIP, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IpRestrictionType } from '../enums/ip-restriction-type.enum';

/**
 * DTO for creating IP restriction rules
 */
export class SecurityCreateIpRestrictionDto {
  @ApiProperty({
    enum: IpRestrictionType,
    description: 'Type of IP restriction',
  })
  @IsEnum(IpRestrictionType)
  type!: IpRestrictionType;

  @ApiPropertyOptional({
    description: 'IP address or CIDR notation (e.g., 192.168.1.0/24)',
  })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({
    description: 'IP range with start and end addresses',
  })
  @IsOptional()
  ipRange?: { start: string; end: string };

  @ApiPropertyOptional({
    description: 'ISO country codes for geo restrictions',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  countries?: string[];

  @ApiProperty({ description: 'Reason for the restriction' })
  @IsString()
  @IsNotEmpty()
  reason!: string;

  @ApiProperty({ description: 'User ID who created the restriction' })
  @IsString()
  @IsNotEmpty()
  createdBy!: string;

  @ApiPropertyOptional({ description: 'Expiration date for the restriction' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

/**
 * DTO for updating IP restriction rules
 */
export class UpdateIpRestrictionDto extends PartialType(
  SecurityCreateIpRestrictionDto,
) {
  @ApiPropertyOptional({ description: 'Active status of the restriction' })
  @IsOptional()
  isActive?: boolean;
}

/**
 * DTO for checking IP access
 */
export class IpCheckDto {
  @ApiProperty({ description: 'IP address to check' })
  @IsIP()
  ipAddress!: string;

  @ApiPropertyOptional({
    description: 'User ID for user-specific restrictions',
  })
  @IsOptional()
  @IsString()
  userId?: string;
}
