/**
 * License Entity
 *
 * Represents a software license issued to a district
 * Re-export of Sequelize model for backward compatibility
 */

// Re-export the Sequelize model and enums
export {
  License
} from '../../database/models/license.model';

export {
  LicenseType,
  LicenseStatus
} from '../enums/administration.enums';
