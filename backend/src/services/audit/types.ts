/**
 * WC-GEN-225 | types.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../database/types/enums, ../../database/models | Dependencies: ../../database/types/enums, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: interfaces, types | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { AuditAction } from '../../database/types/enums';
import { AuditLog } from '../../database/models';

/**
 * Interface for creating audit log entries
 */
export interface AuditLogEntry {
  userId?: string;
  action: AuditAction | string;
  entityType: string;
  entityId?: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  success?: boolean;
  errorMessage?: string;
}

/**
 * Interface for PHI (Protected Health Information) access logs
 * HIPAA Compliance: Tracks all access to protected health information
 */
export interface PHIAccessLog extends AuditLogEntry {
  studentId: string;
  accessType: 'READ' | 'WRITE' | 'DELETE' | 'EXPORT';
  dataCategory: 'HEALTH_RECORD' | 'MEDICATION' | 'ALLERGY' | 'VACCINATION' | 'DIAGNOSIS' | 'TREATMENT' | 'CHRONIC_CONDITION' | 'SCREENING' | 'VITAL_SIGNS' | 'GROWTH_MEASUREMENT';
}

/**
 * Interface for audit log filters
 */
export interface AuditLogFilters {
  userId?: string;
  entityType?: string;
  action?: AuditAction | string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

/**
 * Interface for PHI access log filters
 */
export interface PHIAccessLogFilters {
  userId?: string;
  studentId?: string;
  accessType?: string;
  dataCategory?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

/**
 * Interface for pagination results
 */
export interface PaginatedResult<T> {
  logs: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Interface for compliance report
 */
export interface ComplianceReport {
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalAccess: number;
    failedAccess: number;
    successRate: number;
  };
  accessByType: Array<{ type: string; count: number }>;
  accessByCategory: Array<{ category: string; count: number }>;
  topUsers: Array<{ userId: string; userName: string; accessCount: number }>;
  topStudents: Array<{ studentId: string; studentName: string; accessCount: number }>;
}

/**
 * Interface for audit statistics
 */
export interface AuditStatistics {
  period: {
    start: Date;
    end: Date;
  };
  totalLogs: number;
  uniqueUsers: number;
  actionDistribution: Array<{ action: string; count: number }>;
  entityTypeDistribution: Array<{ entityType: string; count: number }>;
}

/**
 * Interface for enriched audit log (includes user and student details)
 */
export interface EnrichedAuditLog extends AuditLog {
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  } | null;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  } | null;
}

/**
 * Interface for audit log search criteria
 */
export interface AuditLogSearchCriteria {
  keyword: string;
  page?: number;
  limit?: number;
}

/**
 * Available PHI access types
 */
export type PHIAccessType = 'READ' | 'WRITE' | 'DELETE' | 'EXPORT';

/**
 * Available PHI data categories
 */
export type PHIDataCategory = 
  | 'HEALTH_RECORD' 
  | 'MEDICATION' 
  | 'ALLERGY' 
  | 'VACCINATION' 
  | 'DIAGNOSIS' 
  | 'TREATMENT' 
  | 'CHRONIC_CONDITION' 
  | 'SCREENING' 
  | 'VITAL_SIGNS' 
  | 'GROWTH_MEASUREMENT';
