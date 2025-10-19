/**
 * LOC: 56944D7E5D-VALID
 * WC-GEN-271-C | validators.ts - Integration Configuration Validators
 *
 * UPSTREAM (imports from):
 *   - enums.ts (database/types/enums.ts)
 *   - types.ts (local)
 *
 * DOWNSTREAM (imported by):
 *   - configManager.ts
 */

/**
 * WC-GEN-271-C | validators.ts - Integration Configuration Validators
 * Purpose: Comprehensive validation for integration configurations and settings
 * Upstream: ../database/types/enums, ./types | Dependencies: None
 * Downstream: configManager.ts | Called by: Configuration CRUD operations
 * Related: configManager.ts, types.ts
 * Exports: ValidationService class | Key Services: Data validation
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Input validation → Business logic → Database operations
 * LLM Context: HIPAA-compliant validation for healthcare integration configurations
 */

import { IntegrationType } from '../../database/types/enums';
import { CreateIntegrationConfigData } from './types';

/**
 * Service providing comprehensive validation for integration configurations
 * Ensures data integrity and security for healthcare integrations
 */
export class ValidationService {
  /**
   * Validate core integration data fields
   *
   * @param data - Integration configuration data to validate
   * @throws Error if validation fails
   */
  static validateIntegrationData(data: CreateIntegrationConfigData): void {
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
   * Validate endpoint URL format and security
   *
   * @param endpoint - The endpoint URL to validate
   * @throws Error if validation fails
   */
  static validateEndpointUrl(endpoint: string): void {
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
   *
   * @param data - Integration data containing authentication credentials
   * @throws Error if validation fails
   */
  static validateAuthenticationCredentials(data: any): void {
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
   * Validate integration settings object
   *
   * @param settings - Settings object to validate
   * @param integrationType - Type of integration for context-specific validation
   * @throws Error if validation fails
   */
  static validateIntegrationSettings(settings: any, integrationType: IntegrationType): void {
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
   * Validate cron expression syntax
   *
   * @param cronExpression - Cron expression string to validate
   * @throws Error if validation fails
   */
  static validateCronExpression(cronExpression: string): void {
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
   *
   * @param oauth2Config - OAuth2 configuration object
   * @throws Error if validation fails
   */
  static validateOAuth2Config(oauth2Config: any): void {
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
   * Validate field mappings array
   *
   * @param fieldMappings - Array of field mapping configurations
   * @throws Error if validation fails
   */
  static validateFieldMappings(fieldMappings: any[]): void {
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
   *
   * @param settings - Settings object containing webhook configuration
   * @throws Error if validation fails
   */
  static validateWebhookConfig(settings: any): void {
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
   *
   * @param retryPolicy - Webhook retry policy configuration
   * @throws Error if validation fails
   */
  static validateWebhookRetryPolicy(retryPolicy: any): void {
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
   * Validate sync frequency value
   *
   * @param syncFrequency - Sync frequency in minutes
   * @throws Error if validation fails
   */
  static validateSyncFrequency(syncFrequency: number): void {
    if (syncFrequency < 1 || syncFrequency > 43200) {
      throw new Error('Sync frequency must be between 1 and 43200 minutes');
    }
  }
}
