/**
 * SystemConfiguration Entity
 *
 * Stores system-wide and scoped configuration settings
 * Re-export of Sequelize model for backward compatibility
 */

// Re-export the Sequelize model and enums
export { SystemConfig as SystemConfiguration } from '../../database/models/system-config.model';

export {
  ConfigCategory,
  ConfigValueType,
  ConfigScope,
} from '../enums/administration.enums';
