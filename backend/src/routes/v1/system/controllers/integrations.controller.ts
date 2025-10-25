/**
 * Integrations Controller
 * Business logic for integration management and data synchronization
 * Handles SIS, email, SMS, storage, and authentication integrations
 */

import { ResponseToolkit } from '@hapi/hapi';
import { AuthenticatedRequest } from '../../../shared/types/route.types';
import {
  successResponse,
  createdResponse,
  paginatedResponse
} from '../../../shared/utils';
import { parsePagination, buildPaginationMeta } from '../../../shared/utils';
import { IntegrationService } from '../../../../services/integration';
import { ConfigManager } from '../../../../services/integration/configManager';
import { ConnectionTester } from '../../../../services/integration/connectionTester';
import { SyncManager } from '../../../../services/integration/syncManager';
import { LogManager } from '../../../../services/integration/logManager';
import { SISConnector } from '../../../../services/integration/sisConnector';
import { GradeTransitionService } from '../../../../services/gradeTransitionService';
import { AdministrationService } from '../../../../services/administration';

export class IntegrationsController {
  /**
   * INTEGRATION CRUD
   */

  /**
   * List all integrations
   * GET /api/v1/system/integrations
   */
  static async listIntegrations(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { page, limit } = parsePagination(request.query);
    const { type, status } = request.query as any;

    // Get all integrations with optional type filter
    const integrations = await ConfigManager.getAllIntegrations(type);

    // Apply status filter if provided
    let filtered = integrations;
    if (status) {
      filtered = integrations.filter((int: any) => int.status === status);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    const paginatedIntegrations = filtered.slice(offset, offset + limit);

    return paginatedResponse(
      h,
      paginatedIntegrations,
      buildPaginationMeta(page, limit, filtered.length)
    );
  }

  /**
   * Get integration by ID
   * GET /api/v1/system/integrations/{id}
   */
  static async getIntegrationById(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const integration = await ConfigManager.getIntegrationById(id, false);

    // Get recent logs for this integration
    const logsResult = await LogManager.getIntegrationLogs(id, undefined, 1, 5);

    return successResponse(h, {
      integration,
      recentLogs: logsResult.logs,
      stats: {
        totalLogs: logsResult.pagination.total
      }
    });
  }

  /**
   * Create new integration
   * POST /api/v1/system/integrations
   */
  static async createIntegration(request: AuthenticatedRequest, h: ResponseToolkit) {
    const integrationData = request.payload as any;

    const integration = await ConfigManager.createIntegration(integrationData);

    return createdResponse(h, {
      integration,
      message: 'Integration created successfully'
    });
  }

  /**
   * Update integration configuration
   * PUT /api/v1/system/integrations/{id}
   */
  static async updateIntegration(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;
    const updateData = request.payload as any;

    const integration = await ConfigManager.updateIntegration(id, updateData);

    return successResponse(h, {
      integration,
      message: 'Integration updated successfully'
    });
  }

  /**
   * Delete integration
   * DELETE /api/v1/system/integrations/{id}
   */
  /**
   * Delete integration - REST standard: 204 No Content
   * Successful DELETE operations should return 204 with empty body
   */
  static async deleteIntegration(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;

    await ConfigManager.deleteIntegration(id);

    return h.response().code(204);
  }

  /**
   * INTEGRATION OPERATIONS
   */

  /**
   * Test integration connection
   * POST /api/v1/system/integrations/{id}/test
   */
  static async testConnection(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { id } = request.params;

    const testResult = await ConnectionTester.testConnection(id);

    return successResponse(h, {
      test: testResult,
      message: testResult.success
        ? 'Connection test successful'
        : `Connection test failed: ${testResult.message}`
    });
  }

  /**
   * SYNCHRONIZATION
   */

  /**
   * Sync student data from SIS
   * POST /api/v1/system/sync/students
   */
  static async syncStudents(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { integrationId, grade, fullSync, modifiedSince } = request.payload as any;

    // Get integration to verify it's a SIS integration
    const integration = await ConfigManager.getIntegrationById(integrationId, true);

    if (integration.type !== 'SIS') {
      return h.response({
        success: false,
        error: { message: 'Integration must be of type SIS for student sync' }
      }).code(400);
    }

    // Trigger sync using SIS connector
    const syncSession = await SISConnector.pullStudentData(
      integrationId,
      {
        grade,
        fullSync,
        modifiedSince: modifiedSince ? new Date(modifiedSince) : undefined
      }
    );

    return createdResponse(h, {
      sync: syncSession,
      message: `Student sync ${syncSession.status}. Processed ${syncSession.stats.studentsProcessed} students.`
    });
  }

  /**
   * Get sync status
   * GET /api/v1/system/sync/status
   */
  static async getSyncStatus(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { integrationId, status, limit = 10 } = request.query as any;

    // Get sync history from SIS connector
    let sessions: any[] = [];

    if (integrationId) {
      sessions = await SISConnector.getSyncHistory(integrationId, limit);
    } else {
      // Get all configurations and their sync history
      const configs = await SISConnector.getAllConfigurations();
      for (const config of configs.slice(0, limit)) {
        const history = await SISConnector.getSyncHistory(config.id, 1);
        if (history.length > 0) {
          sessions.push(...history);
        }
      }
    }

    // Apply status filter if provided
    if (status) {
      sessions = sessions.filter(s => s.status === status);
    }

    // Sort by most recent
    sessions.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());

    return successResponse(h, {
      sessions: sessions.slice(0, limit),
      total: sessions.length
    });
  }

  /**
   * Get sync logs
   * GET /api/v1/system/sync/logs
   */
  static async getSyncLogs(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { page, limit } = parsePagination(request.query);
    const { integrationId, status, action, startDate, endDate } = request.query as any;

    const result = await LogManager.getIntegrationLogs(
      integrationId,
      undefined,
      page,
      limit
    );

    // Apply additional filters if provided
    let logs = result.logs;

    if (status) {
      logs = logs.filter((log: any) => log.status === status);
    }

    if (action) {
      logs = logs.filter((log: any) => log.action === action);
    }

    if (startDate) {
      const start = new Date(startDate);
      logs = logs.filter((log: any) => new Date(log.createdAt) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      logs = logs.filter((log: any) => new Date(log.createdAt) <= end);
    }

    return paginatedResponse(
      h,
      logs,
      buildPaginationMeta(page, limit, result.pagination.total)
    );
  }

  /**
   * UTILITIES
   */

  /**
   * Trigger grade transition
   * POST /api/v1/system/grade-transition
   */
  static async gradeTransition(request: AuthenticatedRequest, h: ResponseToolkit) {
    const { effectiveDate, dryRun = false, grades } = request.payload as any;

    const result = await GradeTransitionService.performBulkTransition(
      effectiveDate ? new Date(effectiveDate) : new Date(),
      dryRun
    );

    // Filter by specific grades if provided
    let filteredResults = result.results;
    if (grades && grades.length > 0) {
      filteredResults = result.results.filter((r: any) =>
        grades.includes(r.oldGrade)
      );
    }

    return successResponse(h, {
      transition: {
        ...result,
        results: filteredResults,
        filtered: grades ? grades.length : 0
      },
      message: dryRun
        ? `Grade transition preview: ${result.successful} students would be transitioned`
        : `Grade transition complete: ${result.successful} students transitioned successfully`
    });
  }

  /**
   * Get system health status
   * GET /api/v1/system/health
   */
  static async getSystemHealth(request: AuthenticatedRequest, h: ResponseToolkit) {
    const health = await AdministrationService.getSystemHealth();

    // Add integration health
    const integrations = await ConfigManager.getAllIntegrations();
    const integrationHealth = {
      total: integrations.length,
      active: integrations.filter((int: any) => int.status === 'ACTIVE').length,
      error: integrations.filter((int: any) => int.status === 'ERROR').length,
      inactive: integrations.filter((int: any) => int.status === 'INACTIVE').length
    };

    return successResponse(h, {
      health: {
        ...health,
        integrations: integrationHealth,
        timestamp: new Date().toISOString()
      }
    });
  }
}
