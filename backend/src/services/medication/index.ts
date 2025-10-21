/**
 * LOC: 7359200817-IDX
 * WC-SVC-MED-INDEX | Medication Service Main Export
 *
 * UPSTREAM (imports from):
 *   - All medication service modules
 *
 * DOWNSTREAM (imported by):
 *   - routes/medications.ts
 */

/**
 * WC-SVC-MED-INDEX | Medication Service Main Export
 * Purpose: Aggregates all medication service modules into a unified interface
 * Upstream: All medication modules | Dependencies: All medication services
 * Downstream: routes/medications.ts | Called by: Medication API routes
 * Related: Original medicationService.ts
 * Exports: MedicationService class | Key Services: Complete medication management
 * Last Updated: 2025-10-18 | Dependencies: All medication modules
 * Critical Path: Route → MedicationService → Specific module
 * LLM Context: HIPAA-compliant medication management facade pattern
 */

import './modelAugmentations';

// Import all service modules
import { MedicationCrudService } from './medicationCrudService';
import { StudentMedicationService } from './studentMedicationService';
import { AdministrationService } from './administrationService';
import { InventoryService } from './inventoryService';
import { ScheduleService } from './scheduleService';
import { AdverseReactionService } from './adverseReactionService';
import { AnalyticsService } from './analyticsService';

// Re-export types
export * from './types';

/**
 * MedicationService - Unified medication management service
 *
 * This class serves as a facade, delegating to specialized service modules
 * while maintaining backward compatibility with the original interface.
 *
 * Architecture:
 * - CRUD operations → MedicationCrudService
 * - Student prescriptions → StudentMedicationService
 * - Administration logging → AdministrationService
 * - Inventory management → InventoryService
 * - Scheduling/reminders → ScheduleService
 * - Adverse reactions → AdverseReactionService
 * - Analytics/reporting → AnalyticsService
 */
export class MedicationService {
  // ==================== CRUD Operations ====================

  /**
   * Get all medications with pagination
   */
  static async getMedications(page?: number, limit?: number, search?: string) {
    return MedicationCrudService.getMedications(page, limit, search);
  }

  /**
   * Create new medication
   */
  static async createMedication(data: any) {
    return MedicationCrudService.createMedication(data);
  }

  /**
   * Get medication form options
   */
  static async getMedicationFormOptions() {
    return MedicationCrudService.getMedicationFormOptions();
  }

  // ==================== Student Medication Management ====================

  /**
   * Assign medication to student
   */
  static async assignMedicationToStudent(data: any) {
    return StudentMedicationService.assignMedicationToStudent(data);
  }

  /**
   * Deactivate student medication (end prescription)
   */
  static async deactivateStudentMedication(id: string, reason?: string) {
    return StudentMedicationService.deactivateStudentMedication(id, reason);
  }

  // ==================== Administration Tracking ====================

  /**
   * Log medication administration
   */
  static async logMedicationAdministration(data: any) {
    return AdministrationService.logMedicationAdministration(data);
  }

  /**
   * Get medication administration logs for a student
   */
  static async getStudentMedicationLogs(studentId: string, page?: number, limit?: number) {
    return AdministrationService.getStudentMedicationLogs(studentId, page, limit);
  }

  // ==================== Inventory Management ====================

  /**
   * Add medication to inventory
   */
  static async addToInventory(data: any) {
    return InventoryService.addToInventory(data);
  }

  /**
   * Get inventory with low stock alerts
   */
  static async getInventoryWithAlerts() {
    return InventoryService.getInventoryWithAlerts();
  }

  /**
   * Update inventory quantity (for stock adjustments)
   */
  static async updateInventoryQuantity(inventoryId: string, newQuantity: number, reason?: string) {
    return InventoryService.updateInventoryQuantity(inventoryId, newQuantity, reason);
  }

  // ==================== Schedule and Reminders ====================

  /**
   * Get medication schedule for a date range
   */
  static async getMedicationSchedule(startDate: Date, endDate: Date, nurseId?: string) {
    return ScheduleService.getMedicationSchedule(startDate, endDate, nurseId);
  }

  /**
   * Get medication reminders for today and upcoming doses
   */
  static async getMedicationReminders(date?: Date) {
    return ScheduleService.getMedicationReminders(date);
  }

  // ==================== Adverse Reactions ====================

  /**
   * Report adverse reaction to medication
   */
  static async reportAdverseReaction(data: any) {
    return AdverseReactionService.reportAdverseReaction(data);
  }

  /**
   * Get adverse reaction reports for a medication
   */
  static async getAdverseReactions(medicationId?: string, studentId?: string) {
    return AdverseReactionService.getAdverseReactions(medicationId, studentId);
  }

  // ==================== Analytics and Reporting ====================

  /**
   * Get medication statistics
   */
  static async getMedicationStats() {
    return AnalyticsService.getMedicationStats();
  }

  /**
   * Get medication alerts
   */
  static async getMedicationAlerts() {
    return AnalyticsService.getMedicationAlerts();
  }
}
