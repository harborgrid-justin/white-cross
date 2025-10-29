/**
 * Emergency Contact Entity
 * @description Sequelize model re-export for managing student emergency contacts
 *
 * Key Features:
 * - Priority-based contact management (primary, secondary, emergency-only)
 * - Multi-channel notification support (SMS, email, voice)
 * - Contact verification workflow (unverified → pending → verified/failed)
 * - Student pickup authorization tracking
 * Re-export of Sequelize model for backward compatibility
 */

// Re-export the Sequelize model
export {
  EmergencyContact
} from '../../database/models/emergency-contact.model';
