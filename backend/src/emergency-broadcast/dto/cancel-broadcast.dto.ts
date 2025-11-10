/**
 * LOC: EMERGENCY-BROADCAST-DTO-CANCEL-001
 * DTO for canceling broadcast
 */

import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CancelBroadcastDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  reason: string;
}
