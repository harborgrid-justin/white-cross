/**
 * Prescription Entity
 * Represents a medication prescription for a student
 *
 * @description
 * Manages prescription lifecycle from creation through filling and pickup,
 * including drug information, dosage, quantity, and refill authorization.
 * Re-export of Sequelize model for backward compatibility
 */

// Re-export the Sequelize model
export {
  Prescription
} from '../../database/models/prescription.model';
