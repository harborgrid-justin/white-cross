/**
 * Allergy Model - Module Re-export
 *
 * This file re-exports the canonical Allergy model from database/models
 * to maintain backward compatibility with the allergy module structure.
 *
 * Patient safety critical model managing life-threatening allergy information.
 * Supports medication-allergy cross-checking, emergency response protocols,
 * and HIPAA-compliant audit logging.
 *
 * @model Allergy
 * @compliance HIPAA, Healthcare Allergy Documentation Standards
 */

// Re-export the canonical Allergy model and related types from database models
export {
  Allergy,
  AllergyType,
  AllergySeverity,
  type AllergyAttributes,
} from '../../database/models/allergy.model';
