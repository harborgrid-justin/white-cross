/**
 * LOC: EMERGENCY-BROADCAST-DTO-RECIPIENT-001
 * DTO for recipient delivery status
 */

import { CommunicationChannel, DeliveryStatus, RecipientType } from '../emergency-broadcast.enums';

export class RecipientDeliveryStatusDto {
  recipientId: string;
  recipientType: RecipientType;
  name: string;
  contactMethod: CommunicationChannel;
  phoneNumber?: string;
  email?: string;
  status: DeliveryStatus;
  deliveredAt?: Date;
  acknowledgedAt?: Date;
  error?: string;
}
