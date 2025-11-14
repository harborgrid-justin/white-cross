/**
 * Complete Enterprise-Grade Health Records API Client
 *
 * Comprehensive management of student health records with 100% backend coverage:
 * - Main health records operations
 * - Allergies management with safety checks
 * - Chronic conditions tracking with care plans
 * - Vaccinations and compliance tracking
 * - Health screenings management
 * - Growth measurements and trends
 * - Vital signs tracking and alerts
 * - Bulk import/export operations
 * - PHI access logging and security (HIPAA compliant)
 *
 * This file has been refactored into a modular structure for better maintainability.
 * All exports are re-exported from the healthRecords module for backward compatibility.
 *
 * @module services/modules/healthRecordsApi
 */

// Re-export everything from the modular structure
export * from './healthRecords';

// Default export for convenience
export { healthRecordsApi as default } from './healthRecords';
