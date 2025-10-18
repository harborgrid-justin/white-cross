/**
 * WC-SVC-INC-004 | Legacy Incident Report Service (DEPRECATED)
 * Purpose: Backward compatibility re-exports for refactored incident services
 * Upstream: services/incidentReport/* (modular services) | Imports from incident/index
 * Downstream: Legacy code, routes/incidentReports.ts | Called by: Existing implementations
 * Related: services/incidentReport/*, routes/incidentReports.ts, REFACTORING.md
 * Exports: Re-exports from modular services | Key Services: All incident operations
 * Last Updated: 2025-10-17 | Dependencies: ./incidentReport module
 * Critical Path: Legacy imports → Re-export → New modular services
 * LLM Context: Migration bridge for incident services, use incidentReport/* directly
 * @deprecated Use './incidentReport' directory services instead for new development
 */

// Re-export the new modular incident report services for backward compatibility
export {
  IncidentReportService,
  IncidentCoreService,
  IncidentValidationService,
  NotificationService,
  WitnessService,
  FollowUpService,
  EvidenceService,
  InsuranceService,
  StatisticsService,
  SearchService,
  DocumentService,
  // Types
  CreateIncidentReportData,
  UpdateIncidentReportData,
  CreateWitnessStatementData,
  CreateFollowUpActionData,
  IncidentFilters,
  IncidentStatistics,
  IncidentReportDocumentData,
  FollowUpActionData,
  WitnessStatementData
} from './incidentReport';
