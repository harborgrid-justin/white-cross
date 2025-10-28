import { IsString, IsArray, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for creating permission delegation
 */
export class CreateDelegationDto {
  @ApiProperty({ description: 'User receiving the delegated permissions', example: 'uuid' })
  @IsUUID()
  toUserId: string;

  @ApiProperty({ description: 'Array of permission IDs to delegate', type: [String] })
  @IsArray()
  @IsString({ each: true })
  permissions: string[];

  @ApiProperty({ description: 'Reason for delegation', required: false })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ description: 'Expiration date for delegation', example: '2025-12-31T23:59:59Z' })
  @IsDateString()
  expiresAt: string;
}
