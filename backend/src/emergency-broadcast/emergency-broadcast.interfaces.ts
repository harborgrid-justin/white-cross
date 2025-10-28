/**
 * LOC: EMERGENCY-BROADCAST-INTERFACES-001
 * Emergency Broadcast System - Interfaces
 */

import {
  EmergencyType,
  EmergencyPriority,
  BroadcastAudience,
  BroadcastStatus,
  CommunicationChannel,
  RecipientType,
  DeliveryStatus,
} from './emergency-broadcast.enums';

/**
 * Emergency broadcast message
 */
export interface EmergencyBroadcast {
  id?: string;
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

/**
 * Recipient delivery status
 */
export interface RecipientDeliveryStatus {
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

/**
 * Emergency template
 */
export interface EmergencyTemplate {
  title: string;
  message: string;
}
