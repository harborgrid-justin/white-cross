/**
 * LOC: EMERGENCY-BROADCAST-DTO-STATUS-RESPONSE-001
 * DTO for broadcast status response
 */

import { EmergencyBroadcastResponseDto, RecipientDeliveryStatusDto } from '@/emergency-broadcast';

export class DeliveryStatsDto {
  total: number;
  delivered: number;
  failed: number;
  pending: number;
  acknowledged: number;
}

export class BroadcastStatusResponseDto {
  broadcast: EmergencyBroadcastResponseDto;
  deliveryStats: DeliveryStatsDto;
  recentDeliveries: RecipientDeliveryStatusDto[];
}
