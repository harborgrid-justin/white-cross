/**
 * LOC: 56944D7E5D
 * WC-GEN-271 | index.ts - Integration Service Main Export
 *
 * UPSTREAM (imports from):
 *   - All integration service modules
 *
 * DOWNSTREAM (imported by):
 *   - integration.ts (routes/integration.ts)
 *   - integrations.ts (routes/integrations.ts)
 */

/**
 * WC-GEN-271 | index.ts - Integration Service Main Export
 * Purpose: Facade pattern - unified interface for integration service operations
 * Upstream: All integration modules | Dependencies: Module delegation
 * Downstream: Routes, controllers | Called by: Application routes
 * Related: All integration modules
 * Exports: IntegrationService class | Key Services: Complete integration API
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Route → IntegrationService → Specific module → Database → Response
 * LLM Context: Central integration service for healthcare platform with modular architecture
 */

// Re-export types for convenience
export * from './types';

// Import all modules
import { ConfigManager } from './configManager';
import { ConnectionTester } from './connectionTester';
import { SyncManager } from './syncManager';
import { LogManager } from './logManager';
import { StatisticsService } from './statisticsService';
import { ValidationService } from './validators';
import { EncryptionService } from './encryption';

import type {
  CreateIntegrationConfigData,
  UpdateIntegrationConfigData,
  IntegrationTestResult,
  IntegrationSyncResult,
  IntegrationStatistics
} from './types';

/**
 * Main Integration Service class
 * Provides a unified interface to all integration functionality
 * Uses the Facade pattern to delegate to specialized modules
 */
export class IntegrationService {
  // ==================== Configuration Management ====================

  /**
   * Get all integration configurations
   * @param type - Optional integration type filter
   * @returns Array of integration configurations with masked credentials
   */
  static async getAllIntegrations(type?: string) {
    return ConfigManager.getAllIntegrations(type);
  }

  /**
   * Get integration by ID
   * @param id - Integration ID
   * @param includeSensitive - Whether to include unmasked sensitive data
   * @returns Integration configuration
   */
  static async getIntegrationById(id: string, includeSensitive: boolean = false): Promise<any> {
    return ConfigManager.getIntegrationById(id, includeSensitive);
  }

  /**
   * Create new integration configuration
   * @param data - Integration configuration data
   * @returns Created integration with masked credentials
   */
  static async createIntegration(data: CreateIntegrationConfigData) {
    return ConfigManager.createIntegration(data);
  }

  /**
   * Update integration configuration
   * @param id - Integration ID
   * @param data - Updated configuration data
   * @returns Updated integration with masked credentials
   */
  static async updateIntegration(id: string, data: UpdateIntegrationConfigData) {
    return ConfigManager.updateIntegration(id, data);
  }

  /**
   * Delete integration configuration
   * @param id - Integration ID
   */
  static async deleteIntegration(id: string) {
    return ConfigManager.deleteIntegration(id);
  }

  // ==================== Integration Operations ====================

  /**
   * Test integration connection
   * @param id - Integration ID
   * @returns Test result with success status and response time
   */
  static async testConnection(id: string): Promise<IntegrationTestResult> {
    return ConnectionTester.testConnection(id);
  }

  /**
   * Trigger integration sync
   * @param id - Integration ID
   * @returns Sync result with processed record counts and duration
   */
  static async syncIntegration(id: string): Promise<IntegrationSyncResult> {
    return SyncManager.syncIntegration(id);
  }

  // ==================== Integration Logs ====================

  /**
   * Create integration log entry
   * @param data - Log entry data
   * @returns Created log entry
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
    return LogManager.createIntegrationLog(data);
  }

  /**
   * Get integration logs with pagination and filtering
   * @param integrationId - Optional integration ID filter
   * @param type - Optional integration type filter
   * @param page - Page number (1-based)
   * @param limit - Records per page
   * @returns Paginated log entries
   */
  static async getIntegrationLogs(
    integrationId?: string,
    type?: string,
    page: number = 1,
    limit: number = 20
  ) {
    return LogManager.getIntegrationLogs(integrationId, type, page, limit);
  }

  // ==================== Statistics ====================

  /**
   * Get comprehensive integration statistics
   * @returns Complete statistics object
   */
  static async getIntegrationStatistics(): Promise<IntegrationStatistics> {
    return StatisticsService.getIntegrationStatistics();
  }

  // ==================== Validation Helpers ====================
  // These are typically not exposed publicly but included for internal use

  /**
   * Validate integration data
   * @internal
   */
  static validateIntegrationData(data: CreateIntegrationConfigData): void {
    return ValidationService.validateIntegrationData(data);
  }

  /**
   * Validate endpoint URL
   * @internal
   */
  static validateEndpointUrl(endpoint: string): void {
    return ValidationService.validateEndpointUrl(endpoint);
  }

  /**
   * Encrypt sensitive data
   * @internal
   */
  static encryptSensitiveData(data: CreateIntegrationConfigData): { apiKey?: string; password?: string } {
    return EncryptionService.encryptSensitiveData(data);
  }

  /**
   * Encrypt credential
   * @internal
   */
  static encryptCredential(credential: string): string {
    return EncryptionService.encryptCredential(credential);
  }
}
