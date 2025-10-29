/**
 * Allergy Entity
 *
 * Patient safety critical entity managing life-threatening allergy information.
 * Supports medication-allergy cross-checking, emergency response protocols,
 * and HIPAA-compliant audit logging.
 *
 * Re-export of Sequelize model for backward compatibility
 */

// Re-export the Sequelize model and enums
export {
  Allergy
} from '../models/allergy.model';

export {
  AllergenType
} from '../models/allergy.model';

// Also export AllergySeverity from common enums for convenience
export {
  AllergySeverity
} from '../../common/enums';
