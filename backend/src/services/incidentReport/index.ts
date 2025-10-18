/**
 * LOC: 411F8BF03A
 * WC-SVC-INC-IDX-006 | Incident Report Services Module Index & Exports
 *
 * UPSTREAM (imports from):
 *   - coreService.ts (services/incidentReport/coreService.ts)
 *   - notificationService.ts (services/incidentReport/notificationService.ts)
 *   - witnessService.ts (services/incidentReport/witnessService.ts)
 *   - statisticsService.ts (services/incidentReport/statisticsService.ts)
 *   - searchService.ts (services/incidentReport/searchService.ts)
 *   - ... and 1 more
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-SVC-INC-IDX-006 | Incident Report Services Module Index & Exports
 * Purpose: Centralized exports for all incident-related services and types
 * Upstream: ./coreService, ./notificationService, ./witnessService, ./types, etc.
 * Downstream: ../incidentReportService, routes/incidentReports, other services
 * Related: All incident service files, types.ts, validationService.ts
 * Exports: All incident services, types, interfaces | Key Services: Unified incident API
 * Last Updated: 2025-10-17 | Dependencies: All incident service modules
 * Critical Path: Service imports → Re-exports → External consumption
 * LLM Context: Single import point for incident functionality, modular architecture
 */

// Export all types first
export * from './types';

// Core services
export { IncidentCoreService } from './coreService';
export { IncidentValidationService } from './validationService';
export { NotificationService } from './notificationService';
export { WitnessService } from './witnessService';
export { FollowUpService } from './followUpService';
export { EvidenceService } from './evidenceService';
export { InsuranceService } from './insuranceService';
export { StatisticsService } from './statisticsService';
export { SearchService } from './searchService';
export { DocumentService } from './documentService';

// Import services and types for internal use
import { IncidentCoreService } from './coreService';
import { NotificationService } from './notificationService';
import { WitnessService } from './witnessService';
import { StatisticsService } from './statisticsService';
import { SearchService } from './searchService';
import { DocumentService } from './documentService';
import {
  IncidentFilters,
  CreateIncidentReportData,
  UpdateIncidentReportData,
  CreateWitnessStatementData
} from './types';

// Main unified service class that combines all functionality
// Most services use static methods, so we reference the class directly
export class IncidentReportService {
  // Convenience methods that delegate to appropriate services
  static async getIncidentReports(
    page: number = 1,
    limit: number = 20,
    filters: IncidentFilters = {}
  ) {
    return IncidentCoreService.getIncidentReports(page, limit, filters);
  }

  static async createIncidentReport(data: CreateIncidentReportData) {
    return IncidentCoreService.createIncidentReport(data);
  }

  static async updateIncidentReport(id: string, data: UpdateIncidentReportData) {
    return IncidentCoreService.updateIncidentReport(id, data);
  }

  static async getIncidentReportById(id: string) {
    return IncidentCoreService.getIncidentReportById(id);
  }

  static async getIncidentStatistics(dateFrom?: Date, dateTo?: Date, studentId?: string) {
    return StatisticsService.getIncidentStatistics(dateFrom, dateTo, studentId);
  }

  static async searchIncidentReports(query: string, page?: number, limit?: number) {
    return SearchService.searchIncidentReports(query, page, limit);
  }

  static async advancedSearch(filters: IncidentFilters, searchQuery?: string, page?: number, limit?: number) {
    return SearchService.advancedSearch(filters, searchQuery, page, limit);
  }

  static async addWitnessStatement(incidentReportId: string, data: CreateWitnessStatementData) {
    return WitnessService.addWitnessStatement(incidentReportId, data);
  }

  static async notifyEmergencyContacts(incidentId: string) {
    return NotificationService.notifyEmergencyContacts(incidentId);
  }

  static async generateIncidentReportDocument(incidentId: string) {
    return DocumentService.generateIncidentReportDocument(incidentId);
  }

  static async generateIncidentSummary(incidentId: string) {
    return DocumentService.generateIncidentSummary(incidentId);
  }
}
