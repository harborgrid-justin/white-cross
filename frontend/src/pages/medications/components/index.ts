/**
 * WF-MED-015 | components/index.ts - Medications Components Module
 * Purpose: Component exports for medication management
 * Dependencies: React, medication types, prescription management
 * Features: Medication tracking, administration, inventory, prescriptions
 */

// ==============================================================================
// MEDICATION LIST COMPONENTS
// ==============================================================================

/**
 * MedicationsList - Main list view for medications
 * Features: Filtering, sorting, pagination, active/inactive status
 */
export { MedicationsList } from './MedicationsList';

/**
 * MedicationCard - Compact medication display card
 * Features: Drug name, dosage, schedule, alerts
 */
export { MedicationCard } from './MedicationCard';

/**
 * MedicationFilters - Filter controls for medications list
 * Features: Active status, student, medication type, prescriber filters
 */
export { MedicationFilters } from './MedicationFilters';

/**
 * MedicationsPagination - Pagination controls for medications
 * Features: Page navigation, page size selection, total counts
 */
export { MedicationsPagination } from './MedicationsPagination';

// ==============================================================================
// MEDICATION FORM COMPONENTS
// ==============================================================================

/**
 * MedicationForm - Create/edit medication record
 * Features: Drug details, dosage, schedule, instructions, contraindications
 */
export { MedicationForm } from './MedicationForm';

/**
 * PrescriptionForm - Create/edit prescription
 * Features: Medication, dosage, duration, refills, prescriber
 */
export { PrescriptionForm } from './PrescriptionForm';

/**
 * MedicationScheduleForm - Configure administration schedule
 * Features: Times, frequency, duration, special instructions
 */
export { MedicationScheduleForm } from './MedicationScheduleForm';

/**
 * QuickMedicationForm - Simplified quick entry form
 * Features: Essential fields, common medications, fast entry
 */
export { QuickMedicationForm } from './QuickMedicationForm';

// ==============================================================================
// MEDICATION DETAILS COMPONENTS
// ==============================================================================

/**
 * MedicationDetails - Detailed view of a medication
 * Features: Full details, history, interactions, side effects
 */
export { MedicationDetails } from './MedicationDetails';

/**
 * MedicationHistory - Administration history
 * Features: Past administrations, missed doses, adherence tracking
 */
export { MedicationHistory } from './MedicationHistory';

/**
 * MedicationTimeline - Timeline of medication events
 * Features: Start/stop dates, changes, administrations
 */
export { MedicationTimeline } from './MedicationTimeline';

/**
 * MedicationNotes - Notes section for medication
 * Features: Add/edit notes, side effects, observations
 */
export { MedicationNotes } from './MedicationNotes';

// ==============================================================================
// ADMINISTRATION COMPONENTS
// ==============================================================================

/**
 * MedicationAdministration - Record medication administration
 * Features: Dose logging, time, administered by, student verification
 */
export { MedicationAdministration } from './MedicationAdministration';

/**
 * AdministrationSchedule - Daily administration schedule
 * Features: Today's schedule, upcoming doses, overdue alerts
 */
export { default as AdministrationSchedule } from './AdministrationSchedule';

/**
 * AdministrationLog - Log of administered medications
 * Features: Time, dose, administrator, student signature
 */
export { default as AdministrationLog } from './AdministrationLog';

/**
 * MissedDoseHandler - Handle missed doses
 * Features: Missed dose recording, reason, follow-up plan
 */
export { default as MissedDoseHandler } from './MissedDoseHandler';

/**
 * AdministrationReminders - Reminders for due doses
 * Features: Notification system, alerts, snooze options
 */
export { default as AdministrationReminders } from './AdministrationReminders';

// ==============================================================================
// PRESCRIPTION COMPONENTS
// ==============================================================================

/**
 * PrescriptionsList - List of prescriptions
 * Features: Active/expired, refill status, prescriber info
 */
export { default as PrescriptionsList } from './PrescriptionsList';

/**
 * PrescriptionCard - Individual prescription card
 * Features: Medication, dosage, refills, expiration
 */
export { default as PrescriptionCard } from './PrescriptionCard';

/**
 * PrescriptionDetails - Detailed prescription view
 * Features: Full prescription info, history, refills
 */
export { default as PrescriptionDetails } from './PrescriptionDetails';

/**
 * RefillManager - Manage prescription refills
 * Features: Refill requests, tracking, notifications
 */
export { default as RefillManager } from './RefillManager';

/**
 * PrescriptionScanner - Scan prescription documents
 * Features: OCR, image upload, data extraction
 */
export { default as PrescriptionScanner } from './PrescriptionScanner';

// ==============================================================================
// INVENTORY COMPONENTS
// ==============================================================================

/**
 * MedicationInventory - Medication inventory management
 * Features: Stock levels, expiration tracking, reorder alerts
 */
export { default as MedicationInventory } from './MedicationInventory';

/**
 * InventoryCard - Individual inventory item card
 * Features: Quantity, expiration, location, alerts
 */
export { default as InventoryCard } from './InventoryCard';

/**
 * StockLevelMonitor - Monitor stock levels
 * Features: Low stock alerts, reorder points, usage trends
 */
export { default as StockLevelMonitor } from './StockLevelMonitor';

/**
 * ExpirationTracker - Track medication expiration
 * Features: Expiring medications, disposal tracking
 */
export { default as ExpirationTracker } from './ExpirationTracker';

/**
 * InventoryAdjustment - Adjust inventory quantities
 * Features: Add/remove stock, reasons, audit trail
 */
export { default as InventoryAdjustment } from './InventoryAdjustment';

// ==============================================================================
// DRUG INTERACTION COMPONENTS
// ==============================================================================

/**
 * InteractionChecker - Check drug interactions
 * Features: Drug-drug, drug-allergy, drug-condition checks
 */
export { default as InteractionChecker } from './InteractionChecker';

/**
 * InteractionAlerts - Display interaction warnings
 * Features: Severity levels, recommendations, documentation
 */
export { default as InteractionAlerts } from './InteractionAlerts';

/**
 * ContraindicationsList - List of contraindications
 * Features: Medical conditions, allergies, other medications
 */
export { default as ContraindicationsList } from './ContraindicationsList';

// ==============================================================================
// MEDICATION EDUCATION COMPONENTS
// ==============================================================================

/**
 * MedicationEducation - Educational resources
 * Features: Drug information, side effects, instructions
 */
export { default as MedicationEducation } from './MedicationEducation';

/**
 * SideEffectsGuide - Side effects information
 * Features: Common/rare effects, what to watch for, when to notify
 */
export { default as SideEffectsGuide } from './SideEffectsGuide';

/**
 * AdministrationInstructions - How to administer
 * Features: Step-by-step, videos, special considerations
 */
export { default as AdministrationInstructions } from './AdministrationInstructions';

// ==============================================================================
// COMPLIANCE AND REPORTING COMPONENTS
// ==============================================================================

/**
 * AdherenceTracker - Track medication adherence
 * Features: Compliance rates, missed doses, patterns
 */
export { default as AdherenceTracker } from './AdherenceTracker';

/**
 * AdherenceChart - Visualize adherence data
 * Features: Graphs, trends, comparison over time
 */
export { default as AdherenceChart } from './AdherenceChart';

/**
 * ComplianceReport - Compliance reporting
 * Features: Regulatory reports, auditing, documentation
 */
export { default as ComplianceReport } from './ComplianceReport';

/**
 * MedicationAuditLog - Audit trail for medications
 * Features: All changes, access logs, administration records
 */
export { default as MedicationAuditLog } from './MedicationAuditLog';

// ==============================================================================
// STATISTICS AND DASHBOARD COMPONENTS
// ==============================================================================

/**
 * MedicationsDashboard - Main medications overview dashboard
 * Features: Key metrics, due medications, alerts
 */
export { MedicationsDashboard } from './MedicationsDashboard';

/**
 * MedicationStatistics - Statistics and metrics display
 * Features: Active medications, administration rates, adherence
 */
export { default as MedicationStatistics } from './MedicationStatistics';

/**
 * MedicationMetricsChart - Charts for medication metrics
 * Features: Usage trends, adherence graphs, inventory levels
 */
export { default as MedicationMetricsChart } from './MedicationMetricsChart';

/**
 * DueNowWidget - Widget showing medications due now
 * Features: Current schedule, overdue items, quick administration
 */
export { default as DueNowWidget } from './DueNowWidget';

// ==============================================================================
// SHARED MEDICATION COMPONENTS
// ==============================================================================

/**
 * MedicationStatusBadge - Status indicator badge
 * Features: Color-coded status, active/inactive/discontinued
 */
export { default as MedicationStatusBadge } from './MedicationStatusBadge';

/**
 * MedicationSearchBar - Search functionality across medications
 * Features: Drug name, student, generic/brand search
 */
export { default as MedicationSearchBar } from './MedicationSearchBar';

/**
 * DrugLookup - Look up drug information
 * Features: Drug database search, info retrieval, formulary
 */
export { default as DrugLookup } from './DrugLookup';

/**
 * MedicationExportModal - Export medication data
 * Features: Format selection, date ranges, compliance reports
 */
export { default as MedicationExportModal } from './MedicationExportModal';

/**
 * MedicationPrintView - Print-friendly medication records
 * Features: MAR, administration logs, prescription details
 */
export { default as MedicationPrintView } from './MedicationPrintView';

/**
 * MedicationHelpModal - Help and documentation modal
 * Features: Contextual help, drug references, procedures
 */
export { default as MedicationHelpModal } from './MedicationHelpModal';

/**
 * EmergencyMedicationPanel - Emergency medication quick access
 * Features: EpiPens, rescue inhalers, emergency protocols
 */
export { default as EmergencyMedicationPanel } from './EmergencyMedicationPanel';
