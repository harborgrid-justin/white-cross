/**
 * LOC: 4FE7284D02
 * WC-GEN-243 | types.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - statisticsService.ts (services/compliance/statisticsService.ts)
 */

/**
 * WC-GEN-243 | types.ts - General utility functions and operations
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
  ComplianceReportType,
  ComplianceStatus,
  ComplianceCategory,
  ChecklistItemStatus,
  ConsentType,
  PolicyCategory,
  PolicyStatus,
  AuditAction
} from '../../database/types/enums';

// ========== Interface Definitions ==========

export interface CreateComplianceReportData {
  reportType: ComplianceReportType;
  title: string;
  description?: string;
  period: string;
  dueDate?: Date;
  createdById: string;
}

export interface CreateChecklistItemData {
  requirement: string;
  description?: string;
  category: ComplianceCategory;
  dueDate?: Date;
  reportId?: string;
}

export interface CreateConsentFormData {
  type: ConsentType;
  title: string;
  description: string;
  content: string;
  version?: string;
  expiresAt?: Date;
}

export interface CreatePolicyData {
  title: string;
  category: PolicyCategory;
  content: string;
  version?: string;
  effectiveDate: Date;
  reviewDate?: Date;
}

export interface ComplianceReportFilters {
  reportType?: ComplianceReportType;
  status?: ComplianceStatus;
  period?: string;
}

export interface AuditLogFilters {
  userId?: string;
  entityType?: string;
  action?: AuditAction;
  startDate?: Date;
  endDate?: Date;
}

export interface ComplianceStatistics {
  reports: {
    total: number;
    compliant: number;
    pending: number;
    nonCompliant: number;
  };
  checklistItems: {
    total: number;
    completed: number;
    overdue: number;
    completionRate: number;
  };
}

export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface SignConsentFormData {
  consentFormId: string;
  studentId: string;
  signedBy: string;
  relationship: string;
  signatureData?: string;
  ipAddress?: string;
}

export interface CreateAuditLogData {
  userId?: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
}

export interface UpdateComplianceReportData {
  status?: ComplianceStatus;
  findings?: any;
  recommendations?: any;
  submittedBy?: string;
  reviewedBy?: string;
}

export interface UpdateChecklistItemData {
  status?: ChecklistItemStatus;
  evidence?: string;
  notes?: string;
  completedBy?: string;
}

export interface UpdatePolicyData {
  status?: PolicyStatus;
  approvedBy?: string;
  reviewDate?: Date;
}
