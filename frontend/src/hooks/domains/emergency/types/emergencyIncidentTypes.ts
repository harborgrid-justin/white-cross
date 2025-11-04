/**
 * Emergency Incident Type Definitions
 *
 * Type definitions for emergency incidents including severity levels,
 * status lifecycle, response team coordination, timeline management,
 * and damage assessment.
 *
 * @module hooks/domains/emergency/types/emergencyIncidentTypes
 */

import type { EmergencyUser } from './emergencyUserTypes';
import type { EmergencyPlan } from './emergencyPlanTypes';
import type { EmergencyResource } from './emergencyResourceTypes';
import type { EscalationRule } from './emergencyPlanTypes';

/**
 * Emergency Incident Interface
 *
 * Comprehensive incident tracking with severity levels, status lifecycle,
 * response team coordination, timeline management, and damage assessment.
 *
 * @interface
 *
 * @remarks
 * **Incident Lifecycle**:
 * 1. REPORTED: Initial report submitted, awaiting triage
 * 2. INVESTIGATING: Team assessing situation and severity
 * 3. RESPONDING: Active response in progress
 * 4. CONTAINED: Immediate threat contained, cleanup in progress
 * 5. RESOLVED: Incident resolved, monitoring continues
 * 6. CLOSED: Incident officially closed after review
 *
 * **Severity-Based Escalation**:
 * - LOW: Standard response, single responder
 * - MEDIUM: Multiple responders, supervisor notification
 * - HIGH: Response team, management notification, emergency plan consideration
 * - CRITICAL: Full response activation, incident commander assigned, emergency plans activated
 *
 * **Real-Time Monitoring**:
 * - Incidents have 2-minute cache stale time
 * - Active incidents refetch every 15 seconds
 * - Critical incidents refetch every 10 seconds
 * - Timeline updates trigger immediate cache invalidation
 *
 * **HIPAA Compliance**:
 * - All incident access logged for audit trail
 * - PHI in incident descriptions must be appropriately secured
 * - Communication logs track all PHI disclosures
 */
export interface EmergencyIncident {
  id: string;
  title: string;
  description: string;
  type: IncidentType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'REPORTED' | 'INVESTIGATING' | 'RESPONDING' | 'CONTAINED' | 'RESOLVED' | 'CLOSED';
  location: IncidentLocation;
  reportedBy: EmergencyUser;
  assignedTo?: EmergencyUser;
  incidentCommander?: EmergencyUser;
  affectedAreas: string[];
  estimatedAffected: number;
  actualAffected?: number;
  responseTeam: EmergencyUser[];
  relatedPlans: EmergencyPlan[];
  timeline: IncidentTimelineEntry[];
  resources: EmergencyResource[];
  communications: IncidentCommunication[];
  damages?: IncidentDamage;
  lessons: string[];
  reportedAt: string;
  acknowledgedAt?: string;
  respondedAt?: string;
  containedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentType {
  id: string;
  name: string;
  description: string;
  category: string;
  severity: string;
  responseTime: number; // minutes
  escalationRules: EscalationRule[];
}

export interface IncidentLocation {
  id: string;
  name: string;
  address: string;
  coordinates?: { latitude: number; longitude: number };
  floor?: string;
  room?: string;
  zone?: string;
  capacity?: number;
}

export interface IncidentTimelineEntry {
  id: string;
  timestamp: string;
  event: string;
  description: string;
  user: EmergencyUser;
  status?: string;
  attachments?: string[];
}

export interface IncidentCommunication {
  id: string;
  type: 'INTERNAL' | 'EXTERNAL' | 'PUBLIC' | 'REGULATORY';
  channel: 'EMAIL' | 'SMS' | 'PHONE' | 'RADIO' | 'SOCIAL' | 'WEBSITE';
  recipients: string[];
  message: string;
  sentBy: EmergencyUser;
  sentAt: string;
  status: 'DRAFT' | 'SENT' | 'DELIVERED' | 'FAILED';
}

export interface IncidentDamage {
  property: number;
  equipment: number;
  business: number;
  environmental: number;
  reputation: number;
  currency: string;
  notes: string;
}
