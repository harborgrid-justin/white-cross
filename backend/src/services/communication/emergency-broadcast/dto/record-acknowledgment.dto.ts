/**
 * LOC: EMERGENCY-BROADCAST-DTO-ACKNOWLEDGMENT-001
 * DTO for recording acknowledgment
 */

import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class RecordAcknowledgmentDto {
  @IsString()
  @IsNotEmpty()
  recipientId: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  acknowledgedAt?: Date;
}
