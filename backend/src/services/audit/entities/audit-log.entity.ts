/**
 * AuditLog Entity
 *
 * HIPAA and FERPA compliant audit logging for all system operations.
 * Tracks all access to PHI and critical system changes.
 *
 * Re-export of Sequelize model for backward compatibility
 */

// Re-export the Sequelize model and enums
export {
  AuditLog,
  ComplianceType,
  AuditSeverity,
} from '@/database/models';

// Also export AuditAction enum from administration enums
export { AuditAction } from '@/services/administration/enums/administration.enums';
