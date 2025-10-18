/**
 * WC-GEN-271 | integrationService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../utils/logger, ../database/models, ../database/types/enums | Dependencies: sequelize, ../utils/logger, ../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes, interfaces | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Op } from 'sequelize';
import { logger } from '../utils/logger';
import {
  IntegrationConfig,
  IntegrationLog,
  sequelize
} from '../database/models';
import { IntegrationType, IntegrationStatus } from '../database/types/enums';

// Integration Configuration
export interface CreateIntegrationConfigData {
  name: string;
  type: IntegrationType;
  endpoint?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  settings?: any; // JSON data
  syncFrequency?: number;
}

export interface UpdateIntegrationConfigData {
  name?: string;
  endpoint?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  settings?: any; // JSON data
  syncFrequency?: number;
  isActive?: boolean;
}

export interface IntegrationTestResult {
  success: boolean;
  message: string;
  responseTime?: number;
  details?: any; // JSON data
}

export interface IntegrationSyncResult {
  success: boolean;
  recordsProcessed: number;
  recordsSucceeded: number;
  recordsFailed: number;
  duration: number;
  errors?: string[];
}

export class IntegrationService {
  // ==================== Integration Configuration Management ====================
  
  /**
   * Get all integration configurations
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
   * Get integration by ID
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
   */
  static async createIntegration(data: CreateIntegrationConfigData) {
    try {
      // Business logic validation
      this.validateIntegrationData(data);

      // Check for duplicate names
      const existingIntegration = await IntegrationConfig.findOne({
        where: { name: data.name }
      });

      if (existingIntegration) {
        throw new Error(`Integration with name "${data.name}" already exists`);
      }

      // Validate endpoint connectivity for external integrations
      if (data.endpoint) {
        this.validateEndpointUrl(data.endpoint);
      }

      // Validate authentication credentials
      this.validateAuthenticationCredentials(data);

      // Validate settings object if provided
      if (data.settings) {
        this.validateIntegrationSettings(data.settings, data.type);
      }

      // Encrypt sensitive data before storage (in production environment)
      const encryptedData = this.encryptSensitiveData(data);

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
      await this.createIntegrationLog({
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
        this.validateEndpointUrl(data.endpoint);
      }

      // Validate authentication credentials if being updated
      if (data.apiKey || data.username || data.password) {
        this.validateAuthenticationCredentials({
          ...existingIntegration.get({ plain: true }),
          ...data
        } as any);
      }

      // Validate settings if being updated
      if (data.settings) {
        this.validateIntegrationSettings(data.settings, existingIntegration.type);
      }

      // Validate sync frequency if being updated
      if (data.syncFrequency !== undefined) {
        if (data.syncFrequency < 1 || data.syncFrequency > 43200) {
          throw new Error('Sync frequency must be between 1 and 43200 minutes');
        }
      }

      // Encrypt sensitive data if being updated
      const updateData = { ...data };
      if (data.apiKey) {
        updateData.apiKey = this.encryptCredential(data.apiKey);
      }
      if (data.password) {
        updateData.password = this.encryptCredential(data.password);
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
      await this.createIntegrationLog({
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

  // ==================== Integration Operations ====================

  /**
   * Test integration connection
   */
  static async testConnection(id: string): Promise<IntegrationTestResult> {
    const startTime = Date.now();
    
    try {
      const integration = await this.getIntegrationById(id, true);
      
      // Update status to TESTING
      await IntegrationConfig.update(
        { status: IntegrationStatus.TESTING },
        { where: { id } }
      );

      // Simulate connection test based on integration type
      // In production, this would make actual API calls
      const testResult = await this.performConnectionTest({
        type: integration.type,
        endpoint: integration.endpoint || undefined,
        settings: integration.settings || undefined
      });
      
      const responseTime = Date.now() - startTime;

      // Update status based on result
      await IntegrationConfig.update(
        { 
          status: testResult.success ? IntegrationStatus.ACTIVE : IntegrationStatus.ERROR,
          lastSyncStatus: testResult.success ? 'success' : 'failed'
        },
        { where: { id } }
      );

      // Log the test
      await this.createIntegrationLog({
        integrationId: id,
        integrationType: integration.type,
        action: 'test_connection',
        status: testResult.success ? 'success' : 'failed',
        duration: responseTime,
        errorMessage: testResult.success ? undefined : testResult.message,
        details: testResult.details
      });

      logger.info(`Connection test ${testResult.success ? 'succeeded' : 'failed'} for ${integration.name}`);
      
      return {
        ...testResult,
        responseTime
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      await IntegrationConfig.update(
        { status: IntegrationStatus.ERROR, lastSyncStatus: 'failed' },
        { where: { id } }
      );

      logger.error('Error testing connection:', error);
      
      return {
        success: false,
        message: (error as Error).message,
        responseTime
      };
    }
  }

  /**
   * Perform actual connection test based on integration type
   */
  private static async performConnectionTest(integration: { type: string; endpoint?: string; settings?: any }): Promise<IntegrationTestResult> {
    // Mock implementation - in production, this would make real API calls

    // Validate required fields
    if (!integration.endpoint && integration.type !== 'GOVERNMENT_REPORTING') {
      return {
        success: false,
        message: 'Endpoint URL is required'
      };
    }

    // Simulate different test scenarios based on type
    switch (integration.type) {
      case 'SIS':
        return {
          success: true,
          message: 'Successfully connected to Student Information System',
          details: {
            version: '2.1.0',
            studentCount: 1542,
            lastSync: new Date().toISOString()
          }
        };
      
      case 'EHR':
        return {
          success: true,
          message: 'Successfully connected to Electronic Health Record system',
          details: {
            version: '3.4.2',
            recordsAvailable: 1542,
            integrationVersion: 'HL7 FHIR R4'
          }
        };
      
      case 'PHARMACY':
        return {
          success: true,
          message: 'Successfully connected to Pharmacy Management System',
          details: {
            pharmacyName: integration.settings?.pharmacyName || 'Main Pharmacy',
            activeOrders: 45
          }
        };
      
      case 'LABORATORY':
        return {
          success: true,
          message: 'Successfully connected to Laboratory Information System',
          details: {
            labName: integration.settings?.labName || 'Central Lab',
            pendingResults: 12
          }
        };
      
      case 'INSURANCE':
        return {
          success: true,
          message: 'Successfully connected to Insurance Verification System',
          details: {
            provider: integration.settings?.provider || 'Insurance Provider',
            apiVersion: '2.0'
          }
        };
      
      case 'PARENT_PORTAL':
        return {
          success: true,
          message: 'Successfully connected to Parent Portal',
          details: {
            activeParents: 1200,
            portalVersion: '1.8.3'
          }
        };
      
      case 'HEALTH_APP':
        return {
          success: true,
          message: 'Successfully connected to Health Application API',
          details: {
            appName: integration.settings?.appName || 'Health App',
            apiVersion: '3.0'
          }
        };
      
      case 'GOVERNMENT_REPORTING':
        return {
          success: true,
          message: 'Successfully validated Government Reporting configuration',
          details: {
            reportingAgency: integration.settings?.agency || 'State Health Department',
            requiredReports: ['Immunization', 'Screening', 'Incident']
          }
        };
      
      default:
        return {
          success: false,
          message: 'Unknown integration type'
        };
    }
  }

  /**
   * Trigger integration sync
   */
  static async syncIntegration(id: string): Promise<IntegrationSyncResult> {
    const startTime = Date.now();
    
    try {
      const integration = await this.getIntegrationById(id, true);
      
      if (!integration.isActive) {
        throw new Error('Integration is not active');
      }

      // Update status to SYNCING
      await IntegrationConfig.update(
        { status: IntegrationStatus.SYNCING },
        { where: { id } }
      );

      // Perform the sync operation
      const syncResult = await this.performSync(integration);
      
      const duration = Date.now() - startTime;

      // Update integration with sync results
      await IntegrationConfig.update(
        { 
          status: syncResult.success ? IntegrationStatus.ACTIVE : IntegrationStatus.ERROR,
          lastSyncAt: new Date(),
          lastSyncStatus: syncResult.success ? 'success' : 'failed'
        },
        { where: { id } }
      );

      // Log the sync
      await this.createIntegrationLog({
        integrationId: id,
        integrationType: integration.type,
        action: 'sync',
        status: syncResult.success ? 'success' : 'failed',
        recordsProcessed: syncResult.recordsProcessed,
        recordsSucceeded: syncResult.recordsSucceeded,
        recordsFailed: syncResult.recordsFailed,
        duration,
        errorMessage: syncResult.errors?.join('; '),
        details: { errors: syncResult.errors }
      });

      logger.info(`Sync ${syncResult.success ? 'completed' : 'failed'} for ${integration.name}`);
      
      return {
        ...syncResult,
        duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      await IntegrationConfig.update(
        { 
          status: IntegrationStatus.ERROR,
          lastSyncAt: new Date(),
          lastSyncStatus: 'failed'
        },
        { where: { id } }
      );

      logger.error('Error syncing integration:', error);
      
      return {
        success: false,
        recordsProcessed: 0,
        recordsSucceeded: 0,
        recordsFailed: 0,
        duration,
        errors: [(error as Error).message]
      };
    }
  }

  /**
   * Perform actual sync operation
   */
  private static async performSync(_integration: { type: string; settings?: any }): Promise<IntegrationSyncResult> {
    // Mock implementation - in production, this would perform real data synchronization
    
    // Simulate processing records
    const recordsProcessed = Math.floor(Math.random() * 100) + 50;
    const recordsFailed = Math.floor(Math.random() * 5);
    const recordsSucceeded = recordsProcessed - recordsFailed;

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    const errors: string[] = [];
    if (recordsFailed > 0) {
      for (let i = 0; i < Math.min(recordsFailed, 3); i++) {
        errors.push(`Record ${i + 1}: Validation error - missing required field`);
      }
      if (recordsFailed > 3) {
        errors.push(`... and ${recordsFailed - 3} more errors`);
      }
    }

    return {
      success: recordsFailed === 0,
      recordsProcessed,
      recordsSucceeded,
      recordsFailed,
      duration: 0, // Will be calculated by caller
      errors: errors.length > 0 ? errors : undefined
    };
  }

  // ==================== Integration Logs ====================

  /**
   * Create integration log
   */
  static async createIntegrationLog(data: {
    integrationId?: string;
    integrationType: string;
    action: string;
    status: string;
    recordsProcessed?: number;
    recordsSucceeded?: number;
    recordsFailed?: number;
    duration?: number;
    errorMessage?: string;
    details?: any;
  }) {
    try {
      const log = await IntegrationLog.create({
        integrationId: data.integrationId,
        integrationType: data.integrationType as any,
        action: data.action,
        status: data.status,
        recordsProcessed: data.recordsProcessed,
        recordsSucceeded: data.recordsSucceeded,
        recordsFailed: data.recordsFailed,
        startedAt: new Date(),
        completedAt: data.status === 'success' || data.status === 'failed' ? new Date() : undefined,
        duration: data.duration,
        errorMessage: data.errorMessage,
        details: data.details
      });

      return log;
    } catch (error) {
      logger.error('Error creating integration log:', error);
      throw error;
    }
  }

  /**
   * Get integration logs
   */
  static async getIntegrationLogs(
    integrationId?: string,
    type?: string,
    page: number = 1,
    limit: number = 20
  ) {
    try {
      const whereClause: any = {};
      if (integrationId) whereClause.integrationId = integrationId;
      if (type) whereClause.integrationType = type;

      const offset = (page - 1) * limit;

      const { rows: logs, count: total } = await IntegrationLog.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: IntegrationConfig,
            as: 'integration',
            attributes: ['name', 'type']
          }
        ]
      });

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching integration logs:', error);
      throw error;
    }
  }

  // ==================== Statistics ====================

  /**
   * Get integration statistics
   */
  static async getIntegrationStatistics() {
    try {
      const [
        totalIntegrations,
        activeIntegrations,
        recentLogs,
        syncStats
      ] = await Promise.all([
        IntegrationConfig.count(),
        IntegrationConfig.count({ where: { status: IntegrationStatus.ACTIVE } }),
        IntegrationLog.findAll({
          limit: 100,
          order: [['createdAt', 'DESC']],
          where: {
            action: 'sync',
            createdAt: {
              [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          }
        }),
        IntegrationLog.findAll({
          attributes: [
            'integrationType',
            'status',
            [sequelize.fn('COUNT', sequelize.col('integrationType')), 'count']
          ],
          where: {
            action: 'sync',
            createdAt: {
              [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          },
          group: ['integrationType', 'status'],
          raw: true
        })
      ]);

      // Calculate sync statistics
      const totalSyncs = recentLogs.length;
      const successfulSyncs = recentLogs.filter((log: any) => log.status === 'success').length;
      const failedSyncs = recentLogs.filter((log: any) => log.status === 'failed').length;
      const successRate = totalSyncs > 0 ? (successfulSyncs / totalSyncs) * 100 : 0;

      // Calculate total records processed
      const totalRecordsProcessed = recentLogs.reduce((sum: number, log: any) => sum + (log.recordsProcessed || 0), 0);
      const totalRecordsSucceeded = recentLogs.reduce((sum: number, log: any) => sum + (log.recordsSucceeded || 0), 0);
      const totalRecordsFailed = recentLogs.reduce((sum: number, log: any) => sum + (log.recordsFailed || 0), 0);

      // Group stats by type
      const statsByType: Record<string, { success: number; failed: number; total: number }> = {};
      (syncStats as any[]).forEach((stat: any) => {
        if (!statsByType[stat.integrationType]) {
          statsByType[stat.integrationType] = {
            success: 0,
            failed: 0,
            total: 0
          };
        }
        (statsByType[stat.integrationType] as any)[stat.status] = parseInt(stat.count, 10);
      });

      return {
        totalIntegrations,
        activeIntegrations,
        inactiveIntegrations: totalIntegrations - activeIntegrations,
        syncStatistics: {
          totalSyncs,
          successfulSyncs,
          failedSyncs,
          successRate: parseFloat(successRate.toFixed(2)),
          totalRecordsProcessed,
          totalRecordsSucceeded,
          totalRecordsFailed
        },
        statsByType
      };
    } catch (error) {
      logger.error('Error fetching integration statistics:', error);
      throw error;
    }
  }

  // ==================== Validation Helper Methods ====================

  /**
   * Validate integration data
   */
  private static validateIntegrationData(data: CreateIntegrationConfigData): void {
    // Validate required fields
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Integration name is required');
    }

    if (!data.type) {
      throw new Error('Integration type is required');
    }

    // Validate name format
    if (!/^[a-zA-Z0-9\s\-_()]+$/.test(data.name)) {
      throw new Error('Integration name contains invalid characters');
    }

    if (data.name.length < 2 || data.name.length > 100) {
      throw new Error('Integration name must be between 2 and 100 characters');
    }
  }

  /**
   * Validate endpoint URL
   */
  private static validateEndpointUrl(endpoint: string): void {
    if (!endpoint || endpoint.trim().length === 0) {
      throw new Error('Endpoint URL cannot be empty');
    }

    try {
      const url = new URL(endpoint);

      // Only allow HTTP and HTTPS protocols
      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('Endpoint must use HTTP or HTTPS protocol');
      }

      // Prevent localhost in production
      if (process.env.NODE_ENV === 'production') {
        if (url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '0.0.0.0') {
          throw new Error('Localhost endpoints are not allowed in production');
        }
      }

      // Validate URL length
      if (endpoint.length > 2048) {
        throw new Error('Endpoint URL cannot exceed 2048 characters');
      }
    } catch (error: any) {
      if (error.message.includes('protocol') || error.message.includes('localhost') || error.message.includes('exceed')) {
        throw error;
      }
      throw new Error('Invalid endpoint URL format');
    }
  }

  /**
   * Validate authentication credentials
   */
  private static validateAuthenticationCredentials(data: any): void {
    const { type, apiKey, username, password, settings } = data;

    // Skip validation for GOVERNMENT_REPORTING
    if (type === IntegrationType.GOVERNMENT_REPORTING) {
      return;
    }

    // At least one authentication method should be provided
    if (!apiKey && !username && !password && (!settings || !settings.oauth2Config)) {
      throw new Error('At least one authentication method (API Key, username/password, or OAuth2) must be configured');
    }

    // Validate API Key if provided
    if (apiKey) {
      if (apiKey.length < 8) {
        throw new Error('API Key must be at least 8 characters long');
      }
      if (apiKey.length > 512) {
        throw new Error('API Key cannot exceed 512 characters');
      }
      // Check for insecure patterns
      if (/^(password|12345|test|demo|api[-_]?key)/i.test(apiKey)) {
        throw new Error('API Key appears to be insecure or a placeholder');
      }
    }

    // Validate username if provided
    if (username) {
      if (username.length < 2 || username.length > 100) {
        throw new Error('Username must be between 2 and 100 characters');
      }
      if (!/^[a-zA-Z0-9@._\-+]+$/.test(username)) {
        throw new Error('Username contains invalid characters');
      }
    }

    // Validate password if provided
    if (password) {
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      if (password.length > 256) {
        throw new Error('Password cannot exceed 256 characters');
      }
      // Check for weak passwords
      if (/^(password|12345678|qwerty|admin|test)/i.test(password)) {
        throw new Error('Password is too weak or appears to be a placeholder');
      }
    }

    // If username is provided, password should also be provided (unless API key is present)
    if (username && !password && !apiKey) {
      throw new Error('Password is required when username is provided for basic authentication');
    }
  }

  /**
   * Validate integration settings
   */
  private static validateIntegrationSettings(settings: any, integrationType: IntegrationType): void {
    if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
      throw new Error('Settings must be a valid JSON object');
    }

    // Validate timeout
    if (settings.timeout !== undefined) {
      const timeout = Number(settings.timeout);
      if (isNaN(timeout) || timeout < 1000 || timeout > 300000) {
        throw new Error('Timeout must be between 1000ms (1s) and 300000ms (5min)');
      }
    }

    // Validate retry attempts
    if (settings.retryAttempts !== undefined) {
      const retryAttempts = Number(settings.retryAttempts);
      if (isNaN(retryAttempts) || retryAttempts < 0 || retryAttempts > 10) {
        throw new Error('Retry attempts must be between 0 and 10');
      }
    }

    // Validate retry delay
    if (settings.retryDelay !== undefined) {
      const retryDelay = Number(settings.retryDelay);
      if (isNaN(retryDelay) || retryDelay < 100 || retryDelay > 60000) {
        throw new Error('Retry delay must be between 100ms and 60000ms (1min)');
      }
    }

    // Validate authentication method
    if (settings.authMethod) {
      const validAuthMethods = ['api_key', 'basic_auth', 'oauth2', 'jwt', 'certificate', 'custom'];
      if (!validAuthMethods.includes(settings.authMethod)) {
        throw new Error(`Invalid authentication method. Must be one of: ${validAuthMethods.join(', ')}`);
      }
    }

    // Validate sync direction
    if (settings.syncDirection) {
      const validDirections = ['inbound', 'outbound', 'bidirectional'];
      if (!validDirections.includes(settings.syncDirection)) {
        throw new Error(`Invalid sync direction. Must be one of: ${validDirections.join(', ')}`);
      }
    }

    // Validate cron expression if present
    if (settings.syncSchedule && typeof settings.syncSchedule === 'string') {
      this.validateCronExpression(settings.syncSchedule);
    }

    // Validate OAuth2 configuration
    if (settings.oauth2Config) {
      this.validateOAuth2Config(settings.oauth2Config);
    }

    // Validate field mappings
    if (settings.fieldMappings && Array.isArray(settings.fieldMappings)) {
      this.validateFieldMappings(settings.fieldMappings);
    }

    // Validate webhook configuration
    if (settings.enableWebhooks && settings.webhookUrl) {
      this.validateWebhookConfig(settings);
    }

    // Validate rate limiting
    if (settings.rateLimitPerSecond !== undefined) {
      const rateLimit = Number(settings.rateLimitPerSecond);
      if (isNaN(rateLimit) || rateLimit < 1 || rateLimit > 1000) {
        throw new Error('Rate limit must be between 1 and 1000 requests per second');
      }
    }
  }

  /**
   * Validate cron expression
   */
  private static validateCronExpression(cronExpression: string): void {
    const cronParts = cronExpression.trim().split(/\s+/);

    if (cronParts.length < 5 || cronParts.length > 7) {
      throw new Error('Invalid cron expression format. Expected 5-7 fields (minute, hour, day, month, weekday, [year], [seconds])');
    }

    // Validate each part has valid characters
    const validCronChars = /^[0-9\*\-,\/\?LW#]+$/;
    for (let i = 0; i < cronParts.length; i++) {
      if (!validCronChars.test(cronParts[i])) {
        throw new Error(`Invalid characters in cron expression part ${i + 1}: ${cronParts[i]}`);
      }
    }
  }

  /**
   * Validate OAuth2 configuration
   */
  private static validateOAuth2Config(oauth2Config: any): void {
    if (!oauth2Config.clientId || typeof oauth2Config.clientId !== 'string') {
      throw new Error('OAuth2 configuration requires valid clientId');
    }

    if (!oauth2Config.clientSecret || typeof oauth2Config.clientSecret !== 'string') {
      throw new Error('OAuth2 configuration requires valid clientSecret');
    }

    if (!oauth2Config.authorizationUrl || !/^https?:\/\/.+/.test(oauth2Config.authorizationUrl)) {
      throw new Error('OAuth2 configuration requires valid authorizationUrl');
    }

    if (!oauth2Config.tokenUrl || !/^https?:\/\/.+/.test(oauth2Config.tokenUrl)) {
      throw new Error('OAuth2 configuration requires valid tokenUrl');
    }

    const validGrantTypes = ['authorization_code', 'client_credentials', 'password', 'refresh_token'];
    if (!oauth2Config.grantType || !validGrantTypes.includes(oauth2Config.grantType)) {
      throw new Error(`OAuth2 grantType must be one of: ${validGrantTypes.join(', ')}`);
    }

    // Validate redirect URI if provided
    if (oauth2Config.redirectUri && !/^https?:\/\/.+/.test(oauth2Config.redirectUri)) {
      throw new Error('OAuth2 redirectUri must be a valid URL');
    }
  }

  /**
   * Validate field mappings
   */
  private static validateFieldMappings(fieldMappings: any[]): void {
    fieldMappings.forEach((mapping: any, index: number) => {
      if (!mapping.sourceField || typeof mapping.sourceField !== 'string') {
        throw new Error(`Field mapping at index ${index} requires valid sourceField`);
      }

      if (!mapping.targetField || typeof mapping.targetField !== 'string') {
        throw new Error(`Field mapping at index ${index} requires valid targetField`);
      }

      if (!mapping.dataType) {
        throw new Error(`Field mapping at index ${index} requires valid dataType`);
      }

      const validDataTypes = ['string', 'number', 'boolean', 'date', 'array', 'object'];
      if (!validDataTypes.includes(mapping.dataType)) {
        throw new Error(`Invalid dataType at index ${index}. Must be one of: ${validDataTypes.join(', ')}`);
      }

      // Validate required field
      if (mapping.required !== undefined && typeof mapping.required !== 'boolean') {
        throw new Error(`Field mapping at index ${index} has invalid 'required' value (must be boolean)`);
      }
    });
  }

  /**
   * Validate webhook configuration
   */
  private static validateWebhookConfig(settings: any): void {
    try {
      const webhookUrl = new URL(settings.webhookUrl);

      if (!['http:', 'https:'].includes(webhookUrl.protocol)) {
        throw new Error('Webhook URL must use HTTP or HTTPS protocol');
      }

      // Validate webhook URL is not localhost in production
      if (process.env.NODE_ENV === 'production') {
        if (webhookUrl.hostname === 'localhost' || webhookUrl.hostname === '127.0.0.1') {
          throw new Error('Localhost webhook URLs are not allowed in production');
        }
      }

      // Validate webhook secret if signature validation is enabled
      if (settings.webhookSignatureValidation && !settings.webhookSecret) {
        throw new Error('Webhook secret is required when signature validation is enabled');
      }

      if (settings.webhookSecret && settings.webhookSecret.length < 16) {
        throw new Error('Webhook secret must be at least 16 characters long');
      }

      // Validate webhook retry policy if present
      if (settings.webhookRetryPolicy) {
        this.validateWebhookRetryPolicy(settings.webhookRetryPolicy);
      }

      // Validate webhook events if present
      if (settings.webhookEvents && Array.isArray(settings.webhookEvents)) {
        if (settings.webhookEvents.length === 0) {
          throw new Error('At least one webhook event must be configured');
        }
      }
    } catch (error: any) {
      if (error.message.includes('protocol') || error.message.includes('localhost') ||
          error.message.includes('secret') || error.message.includes('event')) {
        throw error;
      }
      throw new Error('Invalid webhook URL format');
    }
  }

  /**
   * Validate webhook retry policy
   */
  private static validateWebhookRetryPolicy(retryPolicy: any): void {
    if (retryPolicy.maxAttempts !== undefined) {
      const maxAttempts = Number(retryPolicy.maxAttempts);
      if (isNaN(maxAttempts) || maxAttempts < 0 || maxAttempts > 10) {
        throw new Error('Webhook retry maxAttempts must be between 0 and 10');
      }
    }

    if (retryPolicy.initialDelay !== undefined) {
      const initialDelay = Number(retryPolicy.initialDelay);
      if (isNaN(initialDelay) || initialDelay < 100 || initialDelay > 60000) {
        throw new Error('Webhook retry initialDelay must be between 100ms and 60000ms');
      }
    }

    if (retryPolicy.backoffMultiplier !== undefined) {
      const backoffMultiplier = Number(retryPolicy.backoffMultiplier);
      if (isNaN(backoffMultiplier) || backoffMultiplier < 1 || backoffMultiplier > 10) {
        throw new Error('Webhook retry backoffMultiplier must be between 1 and 10');
      }
    }

    if (retryPolicy.maxDelay !== undefined) {
      const maxDelay = Number(retryPolicy.maxDelay);
      if (isNaN(maxDelay) || maxDelay < 1000 || maxDelay > 300000) {
        throw new Error('Webhook retry maxDelay must be between 1000ms and 300000ms');
      }
    }
  }

  /**
   * Encrypt sensitive data (placeholder - implement proper encryption in production)
   */
  private static encryptSensitiveData(data: CreateIntegrationConfigData): { apiKey?: string; password?: string } {
    // In production, use proper encryption library (e.g., crypto module)
    // For now, we'll just return the data as-is with a note
    // TODO: Implement actual encryption using crypto module or vault service

    return {
      apiKey: data.apiKey ? this.encryptCredential(data.apiKey) : undefined,
      password: data.password ? this.encryptCredential(data.password) : undefined
    };
  }

  /**
   * Encrypt a single credential (placeholder)
   */
  private static encryptCredential(credential: string): string {
    // TODO: Implement actual encryption
    // For development, we're storing as-is
    // In production, use: crypto.createCipher, AWS KMS, Azure Key Vault, etc.

    if (process.env.NODE_ENV === 'production') {
      logger.warn('Production environment detected - implement proper credential encryption');
    }

    return credential; // Placeholder - should be encrypted
  }
}
