import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

/**
 * DTO for generic security events
 */
export class SecurityEventDto {
  @ApiProperty({ description: 'Event type' })
  @IsString()
  @IsNotEmpty()
  eventType!: string;

  @ApiProperty({ description: 'Event description' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiPropertyOptional({ description: 'User ID associated with the event' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: 'IP address' })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'Additional event metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

/**
 * DTO for threat detection results
 */
export class ThreatDetectionDto {
  @ApiProperty({ description: 'Threat detected flag' })
  detected!: boolean;

  @ApiProperty({ description: 'Threat type' })
  threatType!: string;

  @ApiPropertyOptional({ description: 'Threat details' })
  @IsOptional()
  @IsString()
  details?: string;

  @ApiPropertyOptional({ description: 'Confidence score (0-1)' })
  @IsOptional()
  confidence?: number;
}
