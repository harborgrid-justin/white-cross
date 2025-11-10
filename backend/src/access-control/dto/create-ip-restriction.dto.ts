import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

/**
 * IP restriction types
 */
export enum IpRestrictionType {
  BLACKLIST = 'BLACKLIST',
  WHITELIST = 'WHITELIST',
}

/**
 * DTO for creating an IP restriction
 */
export class AccessControlCreateIpRestrictionDto {
  @ApiProperty({
    description: 'IP address to restrict',
    example: '192.168.1.100',
  })
  @IsString()
  ipAddress: string;

  @ApiProperty({
    description: 'Type of restriction',
    enum: IpRestrictionType,
    example: IpRestrictionType.BLACKLIST,
  })
  @IsEnum(IpRestrictionType, { message: 'Type must be BLACKLIST or WHITELIST' })
  type: IpRestrictionType;

  @ApiProperty({
    description: 'Reason for the restriction',
    example: 'Multiple failed login attempts',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({
    description: 'UUID of the user who created the restriction',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'Created by user ID must be a valid UUID' })
  createdBy: string;
}
