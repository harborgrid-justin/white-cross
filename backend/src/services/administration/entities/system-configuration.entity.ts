/**
 * SystemConfiguration Entity
 *
 * Stores system-wide and scoped configuration settings
 * Re-export of Sequelize model for backward compatibility
 */

// Re-export the Sequelize model and enums
export { } from '@/database/models';

export {
  ConfigCategory,
  ConfigValueType,
  ConfigScope,
} from '../enums/administration.enums';
