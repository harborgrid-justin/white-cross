/**
 * Emergency Procedure Type Definitions
 *
 * Type definitions for emergency procedures including step-by-step
 * instructions, checklists, and required resources.
 *
 * @module hooks/domains/emergency/types/emergencyProcedureTypes
 */

import type { EmergencyUser } from './emergencyUserTypes';

export interface EmergencyProcedure {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: ProcedureStep[];
  estimatedDuration: number; // minutes
  requiredRoles: string[];
  requiredResources: string[];
  triggers: string[];
  dependencies: string[];
  checklist: ChecklistItem[];
  documents: ProcedureDocument[];
  lastReviewed: string;
  reviewedBy: EmergencyUser;
  version: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProcedureStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  estimatedTime: number;
  isRequired: boolean;
  assignedRole?: string;
  prerequisites: string[];
  verification: string;
  notes?: string;
}

export interface ChecklistItem {
  id: string;
  item: string;
  isRequired: boolean;
  assignedRole?: string;
  verificationMethod: string;
}

export interface ProcedureDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  description?: string;
}
