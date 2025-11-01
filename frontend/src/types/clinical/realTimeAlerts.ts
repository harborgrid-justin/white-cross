/**
 * Real-Time Alerts Types
 *
 * Types for WebSocket-based real-time notifications, emergency escalation,
 * and health risk flags. Critical for emergency response.
 *
 * @module types/clinical/realTimeAlerts
 * @category Clinical
 */

import { z } from 'zod';
import type { BaseEntity, ApiResponse } from '../common';

// ============================================================================
// ENUMS AND CONSTANTS
// ============================================================================

export enum AlertType {
  EMERGENCY = 'EMERGENCY',
  HEALTH_RISK = 'HEALTH_RISK',
  MEDICATION_MISSED = 'MEDICATION_MISSED',
  MEDICATION_DUE = 'MEDICATION_DUE',
  APPOINTMENT_DUE = 'APPOINTMENT_DUE',
  OUTBREAK_DETECTED = 'OUTBREAK_DETECTED',
  STUDENT_ARRIVED = 'STUDENT_ARRIVED',
  NURSE_CALL = 'NURSE_CALL',
  VITAL_SIGNS_ABNORMAL = 'VITAL_SIGNS_ABNORMAL',
  ALLERGY_ALERT = 'ALLERGY_ALERT',
  SYSTEM = 'SYSTEM',
}

export enum AlertPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL',
}

export enum EscalationLevel {
  NONE = 'NONE',
  SUPERVISOR = 'SUPERVISOR',
  ADMINISTRATOR = 'ADMINISTRATOR',
  EMERGENCY_SERVICES = 'EMERGENCY_SERVICES',
  PARENT_GUARDIAN = 'PARENT_GUARDIAN',
}

export enum WebSocketMessageType {
  ALERT = 'ALERT',
  NOTIFICATION = 'NOTIFICATION',
  UPDATE = 'UPDATE',
  ACKNOWLEDGMENT = 'ACKNOWLEDGMENT',
  PING = 'PING',
  PONG = 'PONG',
}

export enum AlertStatus {
  ACTIVE = 'ACTIVE',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
  ESCALATED = 'ESCALATED',
}

// ============================================================================
// DOMAIN MODEL INTERFACES
// ============================================================================

/**
 * Real-Time Alert
 *
 * @property {AlertType} alertType - Type of alert
 * @property {AlertPriority} priority - Alert priority
 * @property {AlertStatus} status - Current status
 * @property {string} title - Alert title
 * @property {string} message - Alert message
 * @property {string} [studentId] - Related student ID
 * @property {string} [sourceEntityId] - Source entity (medication, appointment, etc.)
 * @property {string} [sourceEntityType] - Type of source entity
 * @property {string} createdAt - ISO timestamp
 * @property {string} [acknowledgedAt] - ISO timestamp of acknowledgment
 * @property {string} [acknowledgedBy] - User who acknowledged
 * @property {string} [resolvedAt] - ISO timestamp of resolution
 * @property {string} [resolvedBy] - User who resolved
 * @property {EscalationLevel} escalationLevel - Current escalation level
 * @property {string} [escalatedAt] - ISO timestamp of escalation
 * @property {string[]} notifiedUsers - Users notified
 * @property {boolean} requiresAction - Whether action required
 * @property {string[]} suggestedActions - Suggested actions
 * @property {Record<string, any>} [metadata] - Additional data
 * @property {boolean} playSound - Whether to play sound
 * @property {boolean} showVisual - Whether to show visual indicator
 * @property {string} [expiresAt] - ISO timestamp when alert expires
 */
export interface RealTimeAlert extends BaseEntity {
  alertType: AlertType;
  priority: AlertPriority;
  status: AlertStatus;
  title: string;
  message: string;
  studentId?: string | null;
  sourceEntityId?: string | null;
  sourceEntityType?: string | null;
  acknowledgedAt?: string | null;
  acknowledgedBy?: string | null;
  resolvedAt?: string | null;
  resolvedBy?: string | null;
  escalationLevel: EscalationLevel;
  escalatedAt?: string | null;
  notifiedUsers: string[];
  requiresAction: boolean;
  suggestedActions: string[];
  metadata?: Record<string, any> | null;
  playSound: boolean;
  showVisual: boolean;
  expiresAt?: string | null;
}

/**
 * WebSocket Message
 *
 * Message structure for WebSocket communication.
 */
export interface WebSocketMessage<T = any> {
  type: WebSocketMessageType;
  payload: T;
  timestamp: string;
  messageId: string;
  userId?: string;
}

/**
 * Emergency Escalation
 *
 * Emergency escalation protocol execution.
 */
export interface EmergencyEscalation extends BaseEntity {
  alertId: string;
  studentId: string;
  escalationLevel: EscalationLevel;
  initiatedBy: string;
  initiatedAt: string;
  reason: string;
  contactsNotified: Array<{
    contactId: string;
    contactName: string;
    contactType: string;
    notificationMethod: 'SMS' | 'EMAIL' | 'PHONE_CALL';
    sentAt: string;
    deliveredAt?: string;
    status: 'SENT' | 'DELIVERED' | 'FAILED';
  }>;
  emergencyServicesContacted: boolean;
  emergencyServiceDetails?: string | null;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  completedAt?: string | null;
  notes?: string | null;
}

/**
 * Health Risk Flag
 *
 * Automated health risk detection and flagging.
 */
export interface HealthRiskFlag extends BaseEntity {
  studentId: string;
  riskType: 'VITAL_SIGNS' | 'MEDICATION' | 'ALLERGY' | 'CONDITION' | 'BEHAVIOR' | 'OTHER';
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  description: string;
  detectedAt: string;
  detectionSource: string;
  flaggedBy?: string | null;
  isActive: boolean;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  reviewNotes?: string | null;
  triggeredAlert: boolean;
  alertId?: string | null;
}

/**
 * Nurse Call Request
 *
 * Request for nurse assistance from classroom or office.
 */
export interface NurseCallRequest extends BaseEntity {
  location: string;
  requestedBy: string;
  studentId?: string | null;
  urgency: AlertPriority;
  reason: string;
  requestedAt: string;
  acknowledgedBy?: string | null;
  acknowledgedAt?: string | null;
  respondedBy?: string | null;
  respondedAt?: string | null;
  responseTime?: number | null; // seconds
  status: 'PENDING' | 'ACKNOWLEDGED' | 'RESPONDING' | 'COMPLETED' | 'CANCELLED';
  completedAt?: string | null;
  notes?: string | null;
}

/**
 * Alert Configuration
 *
 * User preferences for alert delivery.
 */
export interface AlertConfiguration extends BaseEntity {
  userId: string;
  alertType: AlertType;
  enabled: boolean;
  minimumPriority: AlertPriority;
  enableSound: boolean;
  enableVisual: boolean;
  enablePush: boolean;
  enableEmail: boolean;
  enableSms: boolean;
  quietHoursStart?: string | null; // HH:MM format
  quietHoursEnd?: string | null; // HH:MM format
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface CreateAlertRequest {
  alertType: AlertType;
  priority: AlertPriority;
  title: string;
  message: string;
  studentId?: string;
  sourceEntityId?: string;
  sourceEntityType?: string;
  escalationLevel?: EscalationLevel;
  notifyUsers?: string[];
  requiresAction?: boolean;
  suggestedActions?: string[];
  metadata?: Record<string, any>;
  playSound?: boolean;
  showVisual?: boolean;
  expiresAt?: string;
}

export interface AcknowledgeAlertRequest {
  alertId: string;
  userId: string;
  notes?: string;
}

export interface ResolveAlertRequest {
  alertId: string;
  userId: string;
  resolution: string;
}

export interface EscalateAlertRequest {
  alertId: string;
  escalationLevel: EscalationLevel;
  reason: string;
  notifyContacts: boolean;
}

export interface AlertFilters {
  alertType?: AlertType;
  priority?: AlertPriority;
  status?: AlertStatus;
  studentId?: string;
  startDate?: string;
  endDate?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

export type AlertsResponse = ApiResponse<RealTimeAlert[]>;
export type AlertResponse = ApiResponse<RealTimeAlert>;
export type EscalationResponse = ApiResponse<EmergencyEscalation>;
export type NurseCallResponse = ApiResponse<NurseCallRequest>;

// ============================================================================
// FORM VALIDATION SCHEMAS (ZOD)
// ============================================================================

export const CreateAlertSchema = z.object({
  alertType: z.nativeEnum(AlertType),
  priority: z.nativeEnum(AlertPriority),
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
  studentId: z.string().uuid().optional(),
  sourceEntityId: z.string().optional(),
  sourceEntityType: z.string().optional(),
  escalationLevel: z.nativeEnum(EscalationLevel).optional(),
  notifyUsers: z.array(z.string().uuid()).optional(),
  requiresAction: z.boolean().optional(),
  suggestedActions: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  playSound: z.boolean().optional(),
  showVisual: z.boolean().optional(),
  expiresAt: z.string().datetime().optional(),
});

export const EscalateAlertSchema = z.object({
  alertId: z.string().uuid(),
  escalationLevel: z.nativeEnum(EscalationLevel),
  reason: z.string().min(1).max(500),
  notifyContacts: z.boolean(),
});

// ============================================================================
// REDUX STATE TYPES
// ============================================================================

export interface RealTimeAlertsState {
  alerts: RealTimeAlert[];
  unacknowledgedCount: number;
  criticalAlertsCount: number;
  wsConnected: boolean;
  wsConnectionError: string | null;
  selectedAlert: RealTimeAlert | null;
  filters: AlertFilters;
  loading: boolean;
  error: string | null;
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface AlertNotificationProps {
  alert: RealTimeAlert;
  onAcknowledge?: () => void;
  onDismiss?: () => void;
  onEscalate?: () => void;
  autoHide?: boolean;
  hideDelay?: number;
}

export interface AlertBadgeProps {
  count: number;
  priority?: AlertPriority;
  onClick?: () => void;
}

export interface AlertListProps {
  alerts: RealTimeAlert[];
  onSelectAlert?: (alert: RealTimeAlert) => void;
  onAcknowledge?: (alertId: string) => void;
  onResolve?: (alertId: string) => void;
  showFilters?: boolean;
}

export interface EmergencyEscalationPanelProps {
  studentId: string;
  onEscalate?: (level: EscalationLevel) => void;
  currentLevel?: EscalationLevel;
}

// ============================================================================
// WEBSOCKET TYPES
// ============================================================================

export type AlertMessage = WebSocketMessage<RealTimeAlert>;
export type NotificationMessage = WebSocketMessage<{
  type: string;
  title: string;
  message: string;
}>;
export type UpdateMessage = WebSocketMessage<{
  entityType: string;
  entityId: string;
  action: 'CREATED' | 'UPDATED' | 'DELETED';
}>;

export type IncomingMessage = AlertMessage | NotificationMessage | UpdateMessage;

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isCriticalAlert(alert: RealTimeAlert): boolean {
  return alert.priority === AlertPriority.CRITICAL;
}

export function isUnacknowledgedAlert(alert: RealTimeAlert): boolean {
  return alert.status === AlertStatus.ACTIVE && !alert.acknowledgedAt;
}

export function requiresImmediateAction(alert: RealTimeAlert): boolean {
  return (
    alert.requiresAction &&
    [AlertPriority.URGENT, AlertPriority.CRITICAL].includes(alert.priority) &&
    alert.status === AlertStatus.ACTIVE
  );
}

export function isEmergency(alert: RealTimeAlert): boolean {
  return alert.alertType === AlertType.EMERGENCY;
}

export function isExpired(alert: RealTimeAlert): boolean {
  return alert.expiresAt ? new Date(alert.expiresAt) < new Date() : false;
}
