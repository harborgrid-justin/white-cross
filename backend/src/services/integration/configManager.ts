/**
 * LOC: 56944D7E5D-CONFIG
 * WC-GEN-271-D | configManager.ts - Integration Configuration Management
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - models (database/models)
 *   - enums.ts (database/types/enums.ts)
 *   - types.ts (local)
 *   - validators.ts (local)
 *   - encryption.ts (local)
 *   - logManager.ts (local)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (integration service)
 */

/**
 * WC-GEN-271-D | configManager.ts - Integration Configuration Management
 * Purpose: CRUD operations for integration configurations
 * Upstream: ../utils/logger, ../database/models, ./validators, ./encryption | Dependencies: sequelize
 * Downstream: index.ts | Called by: IntegrationService main class
 * Related: validators.ts, encryption.ts, types.ts
 * Exports: ConfigManager class | Key Services: Configuration CRUD
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Request → Validation → Encryption → Database → Response
 * LLM Context: HIPAA-compliant configuration management for healthcare integrations
 */

import { logger } from '../../utils/logger';
import { IntegrationConfig, IntegrationLog } from '../../database/models';
import { IntegrationStatus } from '../../database/types/enums';
import {
  CreateIntegrationConfigData,
  UpdateIntegrationConfigData
} from './types';
import { ValidationService } from './validators';
import { EncryptionService } from './encryption';
import { LogManager } from './logManager';

/**
 * Service managing CRUD operations for integration configurations
 * Handles validation, encryption, and secure storage of integration settings
 */
export class ConfigManager {
  /**
   * Get all integration configurations with optional type filtering
   * Masks sensitive credentials in the response
   *
   * @param type - Optional integration type filter
   * @returns Array of integration configurations with masked credentials
   */
  static async getAllIntegrations(type?: string) {
    try {
      const whereClause: any = {};
      if (type) {
        whereClause.type = type;
      }

      const integrations = await IntegrationConfig.findAll({
        where: whereClause,
        include: [
          {
            model: IntegrationLog,
            as: 'logs',
            limit: 5,
            order: [['createdAt', 'DESC']]
          }
        ],
        order: [
          ['type', 'ASC'],
          ['name', 'ASC']
        ]
      });

      // Mask sensitive data
      return integrations.map((integration: any) => ({
        ...integration.get({ plain: true }),
        apiKey: integration.apiKey ? '***MASKED***' : null,
        password: integration.password ? '***MASKED***' : null,
      }));
    } catch (error) {
      logger.error('Error fetching integrations:', error);
      throw error;
    }
  }

  /**
   * Get integration configuration by ID
   *
   * @param id - Integration ID
   * @param includeSensitive - Whether to include unmasked sensitive data
   * @returns Integration configuration
   */
  static async getIntegrationById(id: string, includeSensitive: boolean = false): Promise<any> {
    try {
      const integration = await IntegrationConfig.findByPk(id, {
        include: [
          {
            model: IntegrationLog,
            as: 'logs',
            limit: 10,
            order: [['createdAt', 'DESC']]
          }
        ]
      });

      if (!integration) {
        throw new Error('Integration not found');
      }

      const integrationData = integration.get({ plain: true }) as any;

      // Mask sensitive data unless explicitly requested
      if (!includeSensitive) {
        return {
          ...integrationData,
          apiKey: integrationData.apiKey ? '***MASKED***' : null,
          password: integrationData.password ? '***MASKED***' : null,
        };
      }

      return integrationData;
    } catch (error) {
      logger.error('Error fetching integration:', error);
      throw error;
    }
  }

  /**
   * Create new integration configuration
   * Validates input, encrypts credentials, and stores configuration
   *
   * @param data - Integration configuration data
   * @returns Created integration with masked credentials
   */
  static async createIntegration(data: CreateIntegrationConfigData) {
    try {
      // Business logic validation
      ValidationService.validateIntegrationData(data);

      // Check for duplicate names
      const existingIntegration = await IntegrationConfig.findOne({
        where: { name: data.name }
      });

      if (existingIntegration) {
        throw new Error(`Integration with name "${data.name}" already exists`);
      }

      // Validate endpoint connectivity for external integrations
      if (data.endpoint) {
        ValidationService.validateEndpointUrl(data.endpoint);
      }

      // Validate authentication credentials
      ValidationService.validateAuthenticationCredentials(data);

      // Validate settings object if provided
      if (data.settings) {
        ValidationService.validateIntegrationSettings(data.settings, data.type);
      }

      // Encrypt sensitive data before storage (in production environment)
      const encryptedData = EncryptionService.encryptSensitiveData(data);

      const integration = await IntegrationConfig.create({
        name: data.name,
        type: data.type,
        status: IntegrationStatus.INACTIVE,
        endpoint: data.endpoint,
        apiKey: encryptedData.apiKey,
        username: data.username,
        password: encryptedData.password,
        settings: data.settings,
        syncFrequency: data.syncFrequency,
        isActive: true
      });

      logger.info(`Integration created: ${data.name} (${data.type})`);

      // Log the creation
      await LogManager.createIntegrationLog({
        integrationId: integration.id,
        integrationType: data.type,
        action: 'create',
        status: 'success',
        details: { message: 'Integration configuration created' }
      });

      const integrationData = integration.get({ plain: true });

      // Mask sensitive data in response
      return {
        ...integrationData,
        apiKey: integrationData.apiKey ? '***MASKED***' : null,
        password: integrationData.password ? '***MASKED***' : null,
      };
    } catch (error) {
      logger.error('Error creating integration:', error);
      throw error;
    }
  }

  /**
   * Update integration configuration
   * Validates changes, encrypts new credentials, and updates configuration
   *
   * @param id - Integration ID
   * @param data - Updated configuration data
   * @returns Updated integration with masked credentials
   */
  static async updateIntegration(id: string, data: UpdateIntegrationConfigData) {
    try {
      // Validate ID format
      if (!id || typeof id !== 'string') {
        throw new Error('Valid integration ID is required');
      }

      // Get existing integration
      const existingIntegration = await IntegrationConfig.findByPk(id);
      if (!existingIntegration) {
        throw new Error('Integration not found');
      }

      // Check for name conflicts if name is being updated
      if (data.name && data.name !== existingIntegration.name) {
        const duplicateIntegration = await IntegrationConfig.findOne({
          where: { name: data.name }
        });

        if (duplicateIntegration) {
          throw new Error(`Integration with name "${data.name}" already exists`);
        }
      }

      // Validate endpoint if being updated
      if (data.endpoint) {
        ValidationService.validateEndpointUrl(data.endpoint);
      }

      // Validate authentication credentials if being updated
      if (data.apiKey || data.username || data.password) {
        ValidationService.validateAuthenticationCredentials({
          ...existingIntegration.get({ plain: true }),
          ...data
        } as any);
      }

      // Validate settings if being updated
      if (data.settings) {
        ValidationService.validateIntegrationSettings(data.settings, existingIntegration.type);
      }

      // Validate sync frequency if being updated
      if (data.syncFrequency !== undefined) {
        ValidationService.validateSyncFrequency(data.syncFrequency);
      }

      // Encrypt sensitive data if being updated
      const updateData = { ...data };
      if (data.apiKey) {
        updateData.apiKey = EncryptionService.encryptCredential(data.apiKey);
      }
      if (data.password) {
        updateData.password = EncryptionService.encryptCredential(data.password);
      }

      const [updatedRowsCount] = await IntegrationConfig.update(updateData, {
        where: { id }
      });

      if (updatedRowsCount === 0) {
        throw new Error('Integration not found or no changes made');
      }

      const integration = await IntegrationConfig.findByPk(id);
      const integrationData = integration!.get({ plain: true });

      logger.info(`Integration updated: ${integrationData.name} (${integrationData.type})`);

      // Log the update
      await LogManager.createIntegrationLog({
        integrationId: id,
        integrationType: integrationData.type,
        action: 'update',
        status: 'success',
        details: {
          message: 'Integration configuration updated',
          updatedFields: Object.keys(data)
        }
      });

      // Mask sensitive data in response
      return {
        ...integrationData,
        apiKey: integrationData.apiKey ? '***MASKED***' : null,
        password: integrationData.password ? '***MASKED***' : null,
      };
    } catch (error) {
      logger.error('Error updating integration:', error);
      throw error;
    }
  }

  /**
   * Delete integration configuration
   * Removes integration and associated logs
   *
   * @param id - Integration ID
   */
  static async deleteIntegration(id: string) {
    try {
      const integration = await IntegrationConfig.findByPk(id);

      if (!integration) {
        throw new Error('Integration not found');
      }

      const integrationData = integration.get({ plain: true });

      await IntegrationConfig.destroy({
        where: { id }
      });

      logger.info(`Integration deleted: ${integrationData.name} (${integrationData.type})`);
    } catch (error) {
      logger.error('Error deleting integration:', error);
      throw error;
    }
  }
}
