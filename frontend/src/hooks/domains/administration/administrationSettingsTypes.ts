/**
 * @fileoverview Administration domain settings and configuration type definitions
 * @module hooks/domains/administration/administrationSettingsTypes
 * @category Hooks - Administration
 *
 * Type definitions for system settings, configuration, and validation rules.
 *
 * @remarks
 * **Read-Only Settings:**
 * System-critical settings should be marked read-only to prevent
 * accidental modification that could break the application.
 *
 * **Public vs Private:**
 * Public settings are accessible via API without admin auth.
 * Use carefully to avoid exposing sensitive configuration.
 */

/**
 * System-wide configuration setting.
 *
 * Represents a single configuration value that controls system behavior.
 * Settings can be public (visible to all users) or private (admin-only),
 * and can be read-only to prevent accidental modification.
 *
 * @property {string} id - Unique setting identifier
 * @property {string} key - Setting key (dot notation, e.g., 'app.timezone')
 * @property {any} value - Setting value (type determined by 'type' field)
 * @property {string} category - Setting category for organization (e.g., 'general', 'security')
 * @property {'string' | 'number' | 'boolean' | 'json' | 'array'} type - Data type of value
 * @property {string} description - Human-readable description of setting purpose
 * @property {boolean} isReadOnly - Whether setting can be modified via UI
 * @property {boolean} isPublic - Whether setting is visible to non-admin users
 * @property {SettingValidation} [validation] - Validation rules for value
 * @property {string} createdAt - ISO timestamp of creation
 * @property {string} updatedAt - ISO timestamp of last update
 *
 * @remarks
 * **Read-Only Settings:**
 * System-critical settings should be marked read-only to prevent
 * accidental modification that could break the application.
 *
 * **Public vs Private:**
 * Public settings are accessible via API without admin auth.
 * Use carefully to avoid exposing sensitive configuration.
 *
 * **Validation:**
 * Optional validation rules enforce data integrity and prevent
 * invalid configuration values.
 *
 * @example
 * ```typescript
 * const timezoneSetting: SystemSetting = {
 *   id: 'set-123',
 *   key: 'app.timezone',
 *   value: 'America/New_York',
 *   category: 'general',
 *   type: 'string',
 *   description: 'Default timezone for the application',
 *   isReadOnly: false,
 *   isPublic: true,
 *   validation: {
 *     required: true,
 *     pattern: '^[A-Za-z]+/[A-Za-z_]+$'
 *   },
 *   createdAt: '2025-01-01T00:00:00Z',
 *   updatedAt: '2025-10-26T12:00:00Z'
 * };
 * ```
 *
 * @see {@link SettingValidation} for validation rules
 * @see {@link useSettings} for querying settings
 * @see {@link useUpdateSetting} for updating settings
 */
export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  category: string;
  type: 'string' | 'number' | 'boolean' | 'json' | 'array';
  description: string;
  isReadOnly: boolean;
  isPublic: boolean;
  validation?: SettingValidation;
  createdAt: string;
  updatedAt: string;
}

export interface SettingValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  allowedValues?: any[];
}

export interface SystemConfiguration {
  module: string;
  name: string;
  description: string;
  settings: SystemSetting[];
  isEnabled: boolean;
  version: string;
  dependencies?: string[];
  lastUpdated: string;
}
