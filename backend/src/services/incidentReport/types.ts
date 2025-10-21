/**
 * LOC: F01C1D74B1
 * WC-GEN-268 | types.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - coreService.ts (services/incidentReport/coreService.ts)
 *   - documentService.ts (services/incidentReport/documentService.ts)
 *   - followUpService.ts (services/incidentReport/followUpService.ts)
 *   - searchService.ts (services/incidentReport/searchService.ts)
 *   - statisticsService.ts (services/incidentReport/statisticsService.ts)
 *   - ... and 2 more
 */

/**
 * WC-GEN-268 | types.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../database/types/enums | Dependencies: ../../database/types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: interfaces | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { 
  IncidentType, 
  IncidentSeverity, 
  WitnessType, 
  ActionPriority, 
  ActionStatus, 
  InsuranceClaimStatus, 
  ComplianceStatus 
} from '../../database/types/enums';

export interface CreateIncidentReportData {
  studentId: string;
  reportedById: string;
  type: IncidentType;
  severity: IncidentSeverity;
  description: string;
  location: string;
  witnesses: string[];
  actionsTaken: string;
  occurredAt: Date;
  parentNotified?: boolean;
  followUpRequired?: boolean;
  followUpNotes?: string;
  attachments?: string[];
  evidencePhotos?: string[];
  evidenceVideos?: string[];
  insuranceClaimNumber?: string;
  legalComplianceStatus?: ComplianceStatus;
}

export interface UpdateIncidentReportData {
  type?: IncidentType;
  severity?: IncidentSeverity;
  description?: string;
  location?: string;
  witnesses?: string[];
  actionsTaken?: string;
  occurredAt?: Date;
  parentNotified?: boolean;
  followUpRequired?: boolean;
  followUpNotes?: string;
  attachments?: string[];
  evidencePhotos?: string[];
  evidenceVideos?: string[];
  insuranceClaimNumber?: string;
  insuranceClaimStatus?: InsuranceClaimStatus;
  legalComplianceStatus?: ComplianceStatus;
}

export interface IncidentFilters {
  studentId?: string;
  reportedById?: string;
  type?: IncidentType;
  severity?: IncidentSeverity;
  dateFrom?: Date;
  dateTo?: Date;
  parentNotified?: boolean;
  followUpRequired?: boolean;
}

export interface IncidentStatistics {
  total: number;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
  byLocation: Record<string, number>;
  parentNotificationRate: number;
  followUpRate: number;
  averageResponseTime: number; // minutes
}

export interface FollowUpActionData {
  id: string;
  incidentId: string;
  action: string;
  dueDate: Date;
  priority: ActionPriority;
  status: ActionStatus;
  assignedTo?: string;
  completedAt?: Date;
  completedBy?: string;
  notes?: string;
}

export interface WitnessStatementData {
  id: string;
  incidentReportId: string;
  witnessName: string;
  witnessType: WitnessType;
  witnessContact?: string;
  statement: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
}

export interface CreateWitnessStatementData {
  witnessName: string;
  witnessType: WitnessType;
  witnessContact?: string;
  statement: string;
}

export interface CreateFollowUpActionData {
  action: string;
  dueDate: Date;
  priority: ActionPriority;
  assignedTo?: string;
}

export interface IncidentReportDocumentData {
  reportNumber: string;
  generatedAt: Date;
  student: {
    name: string;
    studentNumber: string;
    grade: string;
    dateOfBirth: Date;
  };
  incident: {
    type: IncidentType;
    severity: IncidentSeverity;
    occurredAt: Date;
    location: string;
    description: string;
    actionsTaken: string;
    witnesses: string[];
  };
  reporter: {
    name: string;
    role: string;
    reportedAt: Date;
  };
  followUp: {
    required: boolean;
    notes?: string;
    parentNotified: boolean;
    parentNotificationMethod?: string;
    parentNotifiedAt?: Date;
    actions?: any[];
  };
  evidence: {
    attachments?: string[];
    photos?: string[];
    videos?: string[];
  };
  witnessStatements?: any[];
  insurance: {
    claimNumber?: string;
    claimStatus?: InsuranceClaimStatus;
  };
  compliance: {
    status?: ComplianceStatus;
  };
}
