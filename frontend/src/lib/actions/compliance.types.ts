/**
 * @fileoverview Compliance Types - Next.js v16 App Router
 *
 * Type definitions for compliance management including audit logs,
 * policies, reports, and training compliance.
 */

import {
  AuditActionTypeEnum,
  AuditSeverityEnum,
  ResourceTypeEnum,
} from '@/schemas/compliance/compliance.schemas';

// ============================================================================
// Types
// ============================================================================

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuditLogContext {
  userId: string;
  userName: string;
  userRole: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
}

export interface CreateAuditLogInput {
  action: AuditActionTypeEnum;
  severity?: AuditSeverityEnum;
  resourceType?: ResourceTypeEnum;
  resourceId?: string;
  resourceName?: string;
  details?: Record<string, unknown>;
  changes?: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
  };
  status?: 'SUCCESS' | 'FAILURE' | 'PARTIAL';
  errorMessage?: string;
  phiAccessed?: boolean;
  complianceFlags?: string[];
}

export interface UIComplianceReport {
  id: string;
  title: string;
  type: string;
  status: string;
  generatedAt: string;
  generatedBy: string;
  period: { start: string; end: string };
}

export interface UIReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  requiredParams: string[];
}

export interface UIPolicy {
  id: string;
  title: string;
  category: string;
  status: string;
  version: string;
  effectiveDate: string;
  reviewDate: string;
  acknowledgments: {
    completed: number;
    pending: number;
    total: number;
  };
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}