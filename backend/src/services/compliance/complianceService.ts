/**
 * LOC: 790BFA0623
 * WC-GEN-245 | complianceService.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - complianceService.ts (services/complianceService.ts)
 *   - index.ts (services/compliance/index.ts)
 *
 * DOWNSTREAM (imported by):
 *   - compliance.ts (routes/compliance.ts)
 *   - complianceService.ts (services/complianceService.ts)
 */

/**
 * WC-GEN-245 | complianceService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ./complianceService, ./compliance, ./compliance | Dependencies: ./complianceService, ./compliance, ./compliance
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * @deprecated This file has been refactored into modular services.
 * Import from './compliance' directory instead.
 * 
 * @example
 * // Old import:
 * import { ComplianceService } from './complianceService';
 * 
 * // New import:
 * import { ComplianceService } from './compliance';
 * 
 * // Or import specific services:
 * import { 
 *   ComplianceReportService, 
 *   ConsentService, 
 *   PolicyService 
 * } from './compliance';
 */

// Re-export the new modular compliance services for backward compatibility
export {
  ComplianceService,
  ComplianceReportService,
  ChecklistService,
  ConsentService,
  PolicyService,
  AuditService,
  StatisticsService,
  ReportGenerationService,
  ComplianceUtils,
  COMPLIANCE_CONSTANTS,
  COMPLIANCE_ERRORS,
  // Types
  CreateComplianceReportData,
  CreateChecklistItemData,
  CreateConsentFormData,
  CreatePolicyData,
  ComplianceReportFilters,
  AuditLogFilters,
  SignConsentFormData,
  CreateAuditLogData,
  UpdateComplianceReportData,
  UpdateChecklistItemData,
  UpdatePolicyData,
  ComplianceStatistics,
  PaginationResult
} from './compliance';
