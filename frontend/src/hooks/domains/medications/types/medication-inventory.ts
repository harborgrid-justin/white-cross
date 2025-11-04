/**
 * Medication Inventory and Safety Types
 *
 * Type definitions for medication inventory management, stock tracking,
 * and adverse reaction reporting for patient safety and pharmacovigilance.
 *
 * @module hooks/domains/medications/types/medication-inventory
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

/**
 * Inventory form data for medication stock management and tracking.
 *
 * Used when adding new medication inventory batches or updating stock levels.
 * Supports batch tracking, expiration management, and reorder level automation.
 *
 * @interface InventoryFormData
 *
 * @property {string} medicationId - ID of the medication being stocked
 * @property {string} batchNumber - Manufacturer's batch/lot number for tracking
 * @property {number} quantity - Number of units in stock (0-99,999)
 * @property {number} reorderLevel - Threshold quantity that triggers reorder alert (0-999)
 * @property {string} expirationDate - ISO 8601 date when batch expires
 * @property {string} [supplier] - Optional supplier/distributor name
 *
 * @example
 * ```typescript
 * const inventoryData: InventoryFormData = {
 *   medicationId: 'med-456',
 *   batchNumber: 'BATCH-2025-Q4-1234',
 *   quantity: 500,
 *   reorderLevel: 100,
 *   expirationDate: '2026-12-31',
 *   supplier: 'Generic Pharma Distributors Inc.'
 * };
 * ```
 *
 * @remarks
 * - **SAFETY**: Never dispense expired medications - check expiration before administration
 * - Batch numbers enable recall management and quality tracking
 * - Reorder level should account for lead time and typical usage rate
 * - Quantity must be verified during physical counts (reconciliation)
 */
export interface InventoryFormData {
  medicationId: string;
  batchNumber: string;
  quantity: number;
  reorderLevel: number;
  expirationDate: string;
  supplier?: string;
}

/**
 * Adverse reaction report form data for pharmacovigilance and patient safety.
 *
 * Used when reporting medication adverse reactions, side effects, or complications.
 * These reports are critical for patient safety, regulatory compliance, and drug monitoring.
 *
 * @interface AdverseReactionFormData
 *
 * @property {string} studentId - ID of student who experienced the reaction
 * @property {string} medicationId - ID of medication that caused the reaction
 * @property {'mild' | 'moderate' | 'severe'} severity - Reaction severity level
 * @property {string} description - Detailed description of reaction (10-1000 characters)
 * @property {string} actionsTaken - Actions taken in response (5-500 characters)
 * @property {string} occurredAt - ISO 8601 timestamp when reaction occurred
 *
 * @example
 * ```typescript
 * const adverseReaction: AdverseReactionFormData = {
 *   studentId: 'student-789',
 *   medicationId: 'med-123',
 *   severity: 'moderate',
 *   description: 'Patient developed urticarial rash on torso and arms within 2 hours of administration. Rash was itchy but patient remained hemodynamically stable.',
 *   actionsTaken: 'Medication discontinued immediately. Antihistamine (diphenhydramine 25mg) administered PO. Physician notified. Parent contacted.',
 *   occurredAt: '2025-10-26T14:30:00Z'
 * };
 * ```
 *
 * @remarks
 * - **CRITICAL SAFETY**: All adverse reactions must be reported promptly
 * - Severe reactions require immediate medical attention and physician notification
 * - Reports contribute to pharmacovigilance databases (FDA FAERS)
 * - Description must be detailed enough for clinical review
 * - This is PHI and subject to HIPAA protection
 * - May trigger medication discontinuation and allergy documentation
 */
export interface AdverseReactionFormData {
  studentId: string;
  medicationId: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  actionsTaken: string;
  occurredAt: string;
}
