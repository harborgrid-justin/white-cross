/**
 * Student gender enumeration
 */
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

/**
 * Student Entity
 *
 * Represents a student within the White Cross Healthcare Platform.
 * This entity stores Protected Health Information (PHI) and must comply
 * with HIPAA regulations for student health records.
 *
 * HIPAA Compliance:
 * - All student data is considered PHI
 * - All access must be audited via audit_logs table
 * - medicalRecordNum must be unique and protected
 * - Photo URLs must point to encrypted storage
 * - Soft deletes used to preserve audit trail
 *
 * Re-export of Sequelize model for backward compatibility
 */

// Re-export the Sequelize model
export {
  Student
} from '../../database/models/student.model';
