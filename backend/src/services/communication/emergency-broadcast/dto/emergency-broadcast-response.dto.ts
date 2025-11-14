/**
 * LOC: EMERGENCY-BROADCAST-DTO-RESPONSE-001
 * DTO for emergency broadcast response
 */

import {
  BroadcastAudience,
  BroadcastStatus,
  CommunicationChannel,
  EmergencyPriority,
  EmergencyType,
} from '../emergency-broadcast.enums';

export class EmergencyBroadcastResponseDto {
  id: string;
  type: EmergencyType;
  priority: EmergencyPriority;
  title: string;
  message: string;
  audience: BroadcastAudience[];

  // Targeting filters
  schoolId?: string;
  gradeLevel?: string;
  classId?: string;
  groupIds?: string[];

  // Delivery options
  channels: CommunicationChannel[];
  requiresAcknowledgment?: boolean;
  expiresAt?: Date;

  // Metadata
  sentBy: string;
  sentAt: Date;
  status: BroadcastStatus;

  // Delivery tracking
  totalRecipients?: number;
  deliveredCount?: number;
  failedCount?: number;
  acknowledgedCount?: number;

  // Follow-up
  followUpRequired?: boolean;
  followUpInstructions?: string;
}
