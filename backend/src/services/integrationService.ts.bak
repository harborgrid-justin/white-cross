import { PrismaClient, Prisma } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// Integration Configuration
export interface CreateIntegrationConfigData {
  name: string;
  type: 'SIS' | 'EHR' | 'PHARMACY' | 'LABORATORY' | 'INSURANCE' | 'PARENT_PORTAL' | 'HEALTH_APP' | 'GOVERNMENT_REPORTING';
  endpoint?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  settings?: any;
  syncFrequency?: number;
}

export interface UpdateIntegrationConfigData {
  name?: string;
  endpoint?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  settings?: any;
  syncFrequency?: number;
  isActive?: boolean;
}

export interface IntegrationTestResult {
  success: boolean;
  message: string;
  responseTime?: number;
  details?: any;
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
      const where = type ? { type: type as any } : {};
      
      const integrations = await prisma.integrationConfig.findMany({
        where,
        orderBy: [{ type: 'asc' }, { name: 'asc' }],
        include: {
          logs: {
            take: 5,
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      // Mask sensitive data
      return integrations.map(integration => ({
        ...integration,
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
  static async getIntegrationById(id: string, includeSensitive: boolean = false) {
    try {
      const integration = await prisma.integrationConfig.findUnique({
        where: { id },
        include: {
          logs: {
            take: 10,
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!integration) {
        throw new Error('Integration not found');
      }

      // Mask sensitive data unless explicitly requested
      if (!includeSensitive) {
        return {
          ...integration,
          apiKey: integration.apiKey ? '***MASKED***' : null,
          password: integration.password ? '***MASKED***' : null,
        };
      }

      return integration;
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
      const integration = await prisma.integrationConfig.create({
        data: {
          name: data.name,
          type: data.type,
          status: 'INACTIVE',
          endpoint: data.endpoint,
          apiKey: data.apiKey, // In production, encrypt this
          username: data.username,
          password: data.password, // In production, encrypt this
          settings: data.settings,
          syncFrequency: data.syncFrequency,
          isActive: true
        }
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

      // Mask sensitive data in response
      return {
        ...integration,
        apiKey: integration.apiKey ? '***MASKED***' : null,
        password: integration.password ? '***MASKED***' : null,
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
      const integration = await prisma.integrationConfig.update({
        where: { id },
        data: {
          name: data.name,
          endpoint: data.endpoint,
          apiKey: data.apiKey, // In production, encrypt this
          username: data.username,
          password: data.password, // In production, encrypt this
          settings: data.settings,
          syncFrequency: data.syncFrequency,
          isActive: data.isActive
        }
      });

      logger.info(`Integration updated: ${integration.name} (${integration.type})`);
      
      // Log the update
      await this.createIntegrationLog({
        integrationId: integration.id,
        integrationType: integration.type,
        action: 'update',
        status: 'success',
        details: { message: 'Integration configuration updated' }
      });

      // Mask sensitive data in response
      return {
        ...integration,
        apiKey: integration.apiKey ? '***MASKED***' : null,
        password: integration.password ? '***MASKED***' : null,
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
      const integration = await prisma.integrationConfig.findUnique({
        where: { id }
      });

      if (!integration) {
        throw new Error('Integration not found');
      }

      await prisma.integrationConfig.delete({
        where: { id }
      });

      logger.info(`Integration deleted: ${integration.name} (${integration.type})`);
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
      await prisma.integrationConfig.update({
        where: { id },
        data: { status: 'TESTING' }
      });

      // Simulate connection test based on integration type
      // In production, this would make actual API calls
      const testResult = await this.performConnectionTest(integration);
      
      const responseTime = Date.now() - startTime;

      // Update status based on result
      await prisma.integrationConfig.update({
        where: { id },
        data: { 
          status: testResult.success ? 'ACTIVE' : 'ERROR',
          lastSyncStatus: testResult.success ? 'success' : 'failed'
        }
      });

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
      
      await prisma.integrationConfig.update({
        where: { id },
        data: { status: 'ERROR', lastSyncStatus: 'failed' }
      });

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
  private static async performConnectionTest(integration: any): Promise<IntegrationTestResult> {
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
      await prisma.integrationConfig.update({
        where: { id },
        data: { status: 'SYNCING' }
      });

      // Perform the sync operation
      const syncResult = await this.performSync(integration);
      
      const duration = Date.now() - startTime;

      // Update integration with sync results
      await prisma.integrationConfig.update({
        where: { id },
        data: { 
          status: syncResult.success ? 'ACTIVE' : 'ERROR',
          lastSyncAt: new Date(),
          lastSyncStatus: syncResult.success ? 'success' : 'failed'
        }
      });

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
      
      await prisma.integrationConfig.update({
        where: { id },
        data: { 
          status: 'ERROR',
          lastSyncAt: new Date(),
          lastSyncStatus: 'failed'
        }
      });

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
  private static async performSync(_integration: any): Promise<IntegrationSyncResult> {
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
      const log = await prisma.integrationLog.create({
        data: {
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
        }
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
      const where: any = {};
      if (integrationId) where.integrationId = integrationId;
      if (type) where.integrationType = type;

      const skip = (page - 1) * limit;

      const [logs, total] = await Promise.all([
        prisma.integrationLog.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            integration: {
              select: {
                name: true,
                type: true
              }
            }
          }
        }),
        prisma.integrationLog.count({ where })
      ]);

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
        prisma.integrationConfig.count(),
        prisma.integrationConfig.count({ where: { status: 'ACTIVE' } }),
        prisma.integrationLog.findMany({
          take: 100,
          orderBy: { createdAt: 'desc' },
          where: {
            action: 'sync',
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          }
        }),
        prisma.integrationLog.groupBy({
          by: ['integrationType', 'status'],
          where: {
            action: 'sync',
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          },
          _count: true
        })
      ]);

      // Calculate sync statistics
      const totalSyncs = recentLogs.length;
      const successfulSyncs = recentLogs.filter(log => log.status === 'success').length;
      const failedSyncs = recentLogs.filter(log => log.status === 'failed').length;
      const successRate = totalSyncs > 0 ? (successfulSyncs / totalSyncs) * 100 : 0;

      // Calculate total records processed
      const totalRecordsProcessed = recentLogs.reduce((sum, log) => sum + (log.recordsProcessed || 0), 0);
      const totalRecordsSucceeded = recentLogs.reduce((sum, log) => sum + (log.recordsSucceeded || 0), 0);
      const totalRecordsFailed = recentLogs.reduce((sum, log) => sum + (log.recordsFailed || 0), 0);

      // Group stats by type
      const statsByType: any = {};
      syncStats.forEach(stat => {
        if (!statsByType[stat.integrationType]) {
          statsByType[stat.integrationType] = {
            success: 0,
            failed: 0
          };
        }
        statsByType[stat.integrationType][stat.status] = stat._count;
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
}
