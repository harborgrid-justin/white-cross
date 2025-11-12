/**
 * @fileoverview Health Record Controller - Legacy Re-export
 * @module health-record/health-record.controller
 * @description Re-exports the split controllers for backward compatibility
 * @deprecated Use individual controllers from ./controllers/ instead
 */

// Re-export controllers for backward compatibility
export { HealthRecordCrudController as HealthRecordController } from './controllers/health-record-crud.controller';
export { HealthRecordComplianceController } from './controllers/health-record-compliance.controller';
