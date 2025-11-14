/**
 * WF-COMP-320 | broadcast-emergency.ts - Broadcast and emergency alert types
 * Purpose: Types for broadcast messages and emergency alerts
 * Dependencies: communication-enums, messages, message-delivery
 * Exports: Broadcast and emergency alert types
 * Last Updated: 2025-11-12 | File Type: .ts
 *
 * VALIDATION CONSTRAINTS:
 * - Recipients per broadcast: Maximum 10000
 * - Emergency alerts must have URGENT priority and EMERGENCY category
 * - Emergency alert title: 1-100 characters
 * - Emergency alert message: 1-500 characters
 */

import { MessageType, MessagePriority, MessageCategory, EmergencyAlertSeverity, EmergencyAlertAudience } from './communication-enums';
import type { Message, MessageDeliveryStatusResult } from './messages';

// =====================
// BROADCAST MESSAGE TYPES
// =====================

/**
 * Broadcast Audience targeting criteria
 */
export interface BroadcastAudience {
  grades?: string[];
  nurseIds?: string[];
  studentIds?: string[];
  includeParents?: boolean;
  includeEmergencyContacts?: boolean;
}

/**
 * Create Broadcast Message request data
 */
export interface BroadcastMessageData {
  audience: BroadcastAudience;
  channels: MessageType[];
  subject?: string;
  content: string;
  priority: MessagePriority;
  category: MessageCategory;
  scheduledAt?: string;
  translateTo?: string[];
}

// =====================
// EMERGENCY ALERT TYPES
// =====================

/**
 * Emergency Alert configuration
 *
 * Validation constraints:
 * - title: 1-100 characters, required
 * - message: 1-500 characters, required
 * - severity: Required (LOW, MEDIUM, HIGH, CRITICAL)
 * - channels: At least 1 channel required, multiple recommended
 * - groups: Required when audience is SPECIFIC_GROUPS
 * - Auto-assigned URGENT priority and EMERGENCY category
 */
export interface EmergencyAlertData {
  title: string;
  message: string;
  severity: EmergencyAlertSeverity;
  audience: EmergencyAlertAudience;
  groups?: string[];
  channels: MessageType[];
}

/**
 * Emergency Alert response
 */
export interface EmergencyAlertResponse {
  message: Message;
  deliveryStatuses: MessageDeliveryStatusResult[];
}
