/**
 * Contact Entity
 * @description Sequelize model re-export for contact management (guardians, staff, vendors, providers)
 *
 * Inspired by TwentyHQ CRM contact management system
 * Supports HIPAA-compliant contact tracking with audit trails
 * Re-export of Sequelize model for backward compatibility
 */

// Re-export the Sequelize model
export {
  Contact
} from '../../database/models/contact.model';
