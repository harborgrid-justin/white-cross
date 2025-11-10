/**
 * @fileoverview Config Service Interface
 * @module shared/interfaces/config.interface
 * @description Interface for configuration services
 */

/**
 * Config Service Interface
 *
 * Defines the contract for configuration services.
 * Implementations can use environment variables, files, remote config, etc.
 */
export interface IConfigService {
  /**
   * Get configuration value
   */
  get<T = any>(key: string, defaultValue?: T): T;

  /**
   * Get all configuration values
   */
  getAll?(): Record<string, any>;

  /**
   * Check if configuration key exists
   */
  has?(key: string): boolean;

  /**
   * Get configuration value or throw error if not found
   */
  getOrThrow?<T = any>(key: string): T;
}
