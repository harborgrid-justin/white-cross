/**
 * LOC: EMERGENCY-BROADCAST-DTO-SEND-RESPONSE-001
 * DTO for send broadcast response
 */

export class SendBroadcastResponseDto {
  success: boolean;
  totalRecipients: number;
  sent: number;
  failed: number;
}
