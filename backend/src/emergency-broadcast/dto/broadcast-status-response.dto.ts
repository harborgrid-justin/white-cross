/**
 * LOC: EMERGENCY-BROADCAST-DTO-STATUS-RESPONSE-001
 * DTO for broadcast status response
 */

import { EmergencyBroadcastResponseDto } from './emergency-broadcast-response.dto';
import { RecipientDeliveryStatusDto } from './recipient-delivery-status.dto';

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
