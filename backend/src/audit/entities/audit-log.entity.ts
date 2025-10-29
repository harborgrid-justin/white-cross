/**
 * AuditLog Entity
 *
 * HIPAA Compliance: Immutable audit log entries for tracking all system actions
 * and PHI access. Required for HIPAA Security Rule (45 CFR § 164.308(a)(1)(ii)(D))
 *
 * Retention: 7 years as required by HIPAA regulations
 * Immutability: Enforced at model level - updates throw error
 * Re-export of Sequelize model for backward compatibility
 */

// Re-export the Sequelize model
export {
  AuditLog
} from '../../database/models/audit-log.model';
