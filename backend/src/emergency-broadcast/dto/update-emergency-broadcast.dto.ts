/**
 * LOC: EMERGENCY-BROADCAST-DTO-UPDATE-001
 * DTO for updating emergency broadcast
 */

import { PartialType } from '@nestjs/mapped-types';
import { CreateEmergencyBroadcastDto } from './create-emergency-broadcast.dto';

export class UpdateEmergencyBroadcastDto extends PartialType(CreateEmergencyBroadcastDto) {}
