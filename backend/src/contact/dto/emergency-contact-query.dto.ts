/**
 * Emergency Contact Query DTO
 * @description DTO for filtering emergency contacts
 */
import { IsBoolean, IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ContactPriority, VerificationStatus } from '../enums';

export class EmergencyContactQueryDto {
  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Filter by student ID',
  })
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @ApiPropertyOptional({
    enum: ContactPriority,
    description: 'Filter by priority',
  })
  @IsOptional()
  @IsEnum(ContactPriority)
  priority?: ContactPriority;

  @ApiPropertyOptional({
    example: true,
    description: 'Filter by active status',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    enum: VerificationStatus,
    description: 'Filter by verification status',
  })
  @IsOptional()
  @IsEnum(VerificationStatus)
  verificationStatus?: VerificationStatus;

  @ApiPropertyOptional({
    example: 1,
    description: 'Page number',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 20,
    description: 'Items per page',
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
