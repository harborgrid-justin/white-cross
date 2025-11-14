/**
 * HealthRecord Entity
 *
 * Represents a health record entry for a student.
 * This entity stores Protected Health Information (PHI) and must comply
 * with HIPAA regulations.
 *
 * A HealthRecord can be:
 * - A standalone health event (checkup, vaccination, illness, injury, etc.)
 * - A parent record for related health data (vaccinations, vital signs, etc.)
 *
 * HIPAA Compliance:
 * - All health record data is PHI
 * - All access must be audited
 * - Soft deletes preserve audit trail
 * - Attachments must point to encrypted storage
 */

// Re-export the Sequelize model for backward compatibility
export { } from '@/database/models';
