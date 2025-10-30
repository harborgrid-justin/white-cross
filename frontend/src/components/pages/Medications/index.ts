/**
 * Medications Module - Barrel Export File
 * 
 * This file exports all medication-related components for easy importing.
 * The Medications module provides comprehensive medication management functionality
 * including tracking, administration, compliance, inventory, alerts, and reporting.
 * 
 * @module Medications
 */

// Core Medication Components
export { default as MedicationCard } from './MedicationCard';
export { default as MedicationHeader } from './MedicationHeader';
export { default as MedicationList } from './MedicationList';
export { default as MedicationDetail } from './MedicationDetail';

// Medication Management Components
export { default as MedicationSchedule } from './MedicationSchedule';
export { default as MedicationComplianceTracker } from './MedicationComplianceTracker';
export { default as MedicationAdministrationLog } from './MedicationAdministrationLog';

// Medication System Components
export { default as MedicationInventory } from './MedicationInventory';
export { default as MedicationAlerts } from './MedicationAlerts';
export { default as MedicationReports } from './MedicationReports';

/**
 * Usage Examples:
 * 
 * // Import individual components
 * import { MedicationCard, MedicationList } from '@/components/pages/Medications';
 * 
 * // Import all components
 * import * as MedicationComponents from '@/components/pages/Medications';
 * 
 * // Use with dynamic imports
 * const MedicationDetail = dynamic(() => import('@/components/pages/Medications').then(mod => ({ default: mod.MedicationDetail })));
 */
