/**
 * Emergency Plan Type Definitions
 *
 * Type definitions for emergency plans including activation criteria,
 * escalation matrix, communication plan, and recovery procedures.
 *
 * @module hooks/domains/emergency/types/emergencyPlanTypes
 */

import type { EmergencyUser } from './emergencyUserTypes';
import type { EmergencyProcedure } from './emergencyProcedureTypes';
import type { EmergencyContact } from './emergencyContactTypes';
import type { EmergencyResource } from './emergencyResourceTypes';

/**
 * Emergency Plan Interface
 *
 * Defines comprehensive emergency response plan with activation criteria,
 * escalation matrix, communication plan, and recovery procedures.
 *
 * @interface
 *
 * @remarks
 * **Plan Lifecycle**:
 * - DRAFT: Plan under development, not yet approved
 * - ACTIVE: Approved and ready for activation
 * - INACTIVE: Temporarily disabled
 * - ARCHIVED: Retired plan, kept for historical reference
 *
 * **Activation Workflow**:
 * 1. Criteria evaluation triggers automatic or manual activation
 * 2. Escalation matrix determines notification hierarchy
 * 3. Communication plan executes notifications
 * 4. Resources allocated per plan requirements
 * 5. Recovery plan guides return to normal operations
 */
export interface EmergencyPlan {
  id: string;
  name: string;
  description: string;
  category: EmergencyPlanCategory;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  version: string;
  effectiveDate: string;
  reviewDate: string;
  procedures: EmergencyProcedure[];
  contacts: EmergencyContact[];
  resources: EmergencyResource[];
  activationCriteria: string[];
  escalationMatrix: EscalationLevel[];
  communicationPlan: CommunicationStep[];
  recoveryPlan: RecoveryStep[];
  createdBy: EmergencyUser;
  updatedBy?: EmergencyUser;
  createdAt: string;
  updatedAt: string;
  lastActivated?: string;
  activationCount: number;
}

export interface EmergencyPlanCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
}

export interface EscalationLevel {
  level: number;
  title: string;
  criteria: string;
  contacts: EmergencyContact[];
  actions: string[];
  timeframe: number; // minutes
}

export interface EscalationRule {
  condition: string;
  timeLimit: number;
  nextLevel: string;
  notifications: string[];
}

export interface CommunicationStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  audience: string;
  channels: string[];
  timing: string;
  template?: string;
  responsible: string;
}

export interface RecoveryStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  estimatedTime: number;
  dependencies: string[];
  responsible: string;
  verification: string;
}
