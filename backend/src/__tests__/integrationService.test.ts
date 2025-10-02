import { IntegrationService } from '../services/integrationService';

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    integrationConfig: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    integrationLog: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
  })),
}));

const { PrismaClient } = require('@prisma/client');
const mockPrisma = new PrismaClient();

describe('IntegrationService', () => {
  let testIntegrationId: string;

  beforeEach(() => {
    jest.clearAllMocks();
    testIntegrationId = 'test-integration-id';
  });

  describe('Integration Configuration Management', () => {
    test('should create a new integration configuration', async () => {
      const integrationData = {
        name: 'Test SIS Integration',
        type: 'SIS' as const,
        endpoint: 'https://sis.example.com/api',
        apiKey: 'test-api-key-123',
        syncFrequency: 60
      };

      const mockIntegration = {
        id: testIntegrationId,
        name: integrationData.name,
        type: integrationData.type,
        status: 'INACTIVE',
        endpoint: integrationData.endpoint,
        apiKey: integrationData.apiKey,
        username: null,
        password: null,
        settings: null,
        isActive: true,
        lastSyncAt: null,
        lastSyncStatus: null,
        syncFrequency: integrationData.syncFrequency,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockLog = {
        id: 'log-id',
        integrationId: testIntegrationId,
        integrationType: 'SIS',
        action: 'create',
        status: 'success',
        startedAt: new Date(),
        createdAt: new Date()
      };

      // Create needs to return the integration first, then log
      mockPrisma.integrationConfig.create.mockResolvedValue(mockIntegration);
      mockPrisma.integrationLog.create.mockResolvedValue(mockLog);

      const integration = await IntegrationService.createIntegration(integrationData);

      expect(integration).toBeDefined();
      expect(integration.name).toBe(integrationData.name);
      expect(integration.type).toBe(integrationData.type);
      expect(integration.endpoint).toBe(integrationData.endpoint);
      expect(integration.apiKey).toBe('***MASKED***'); // Should be masked
      expect(mockPrisma.integrationConfig.create).toHaveBeenCalled();
    });

    test('should get all integrations', async () => {
      const mockIntegrations = [
        {
          id: testIntegrationId,
          name: 'Test SIS Integration',
          type: 'SIS',
          status: 'INACTIVE',
          endpoint: 'https://sis.example.com/api',
          apiKey: 'test-key',
          username: null,
          password: null,
          settings: null,
          isActive: true,
          lastSyncAt: null,
          lastSyncStatus: null,
          syncFrequency: 60,
          createdAt: new Date(),
          updatedAt: new Date(),
          logs: []
        }
      ];

      mockPrisma.integrationConfig.findMany.mockResolvedValue(mockIntegrations);

      const integrations = await IntegrationService.getAllIntegrations();

      expect(Array.isArray(integrations)).toBe(true);
      expect(integrations.length).toBeGreaterThan(0);
      expect(integrations[0]).toHaveProperty('name');
      expect(integrations[0]).toHaveProperty('type');
      expect(integrations[0].apiKey).toBe('***MASKED***');
      expect(mockPrisma.integrationConfig.findMany).toHaveBeenCalled();
    });

    test('should get integrations by type', async () => {
      const mockIntegrations = [
        {
          id: testIntegrationId,
          name: 'Test SIS Integration',
          type: 'SIS',
          status: 'INACTIVE',
          endpoint: 'https://sis.example.com/api',
          apiKey: 'test-key',
          username: null,
          password: null,
          settings: null,
          isActive: true,
          lastSyncAt: null,
          lastSyncStatus: null,
          syncFrequency: 60,
          createdAt: new Date(),
          updatedAt: new Date(),
          logs: []
        }
      ];

      mockPrisma.integrationConfig.findMany.mockResolvedValue(mockIntegrations);

      const integrations = await IntegrationService.getAllIntegrations('SIS');

      expect(Array.isArray(integrations)).toBe(true);
      integrations.forEach(integration => {
        expect(integration.type).toBe('SIS');
      });
      expect(mockPrisma.integrationConfig.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { type: 'SIS' }
        })
      );
    });

    test('should get integration by ID', async () => {
      const mockIntegration = {
        id: testIntegrationId,
        name: 'Test SIS Integration',
        type: 'SIS',
        status: 'INACTIVE',
        endpoint: 'https://sis.example.com/api',
        apiKey: 'test-key',
        username: null,
        password: null,
        settings: null,
        isActive: true,
        lastSyncAt: null,
        lastSyncStatus: null,
        syncFrequency: 60,
        createdAt: new Date(),
        updatedAt: new Date(),
        logs: []
      };

      mockPrisma.integrationConfig.findUnique.mockResolvedValue(mockIntegration);

      const integration = await IntegrationService.getIntegrationById(testIntegrationId);

      expect(integration).toBeDefined();
      expect(integration.id).toBe(testIntegrationId);
      expect(integration.name).toBe('Test SIS Integration');
      expect(integration.apiKey).toBe('***MASKED***');
      expect(mockPrisma.integrationConfig.findUnique).toHaveBeenCalled();
    });

    test('should update integration configuration', async () => {
      const updateData = {
        name: 'Updated SIS Integration',
        endpoint: 'https://sis-new.example.com/api',
        syncFrequency: 120
      };

      const mockUpdatedIntegration = {
        id: testIntegrationId,
        name: updateData.name,
        type: 'SIS',
        status: 'INACTIVE',
        endpoint: updateData.endpoint,
        apiKey: 'test-key',
        username: null,
        password: null,
        settings: null,
        isActive: true,
        lastSyncAt: null,
        lastSyncStatus: null,
        syncFrequency: updateData.syncFrequency,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockLog = {
        id: 'log-id',
        integrationId: testIntegrationId,
        integrationType: 'SIS',
        action: 'update',
        status: 'success',
        startedAt: new Date(),
        createdAt: new Date()
      };

      mockPrisma.integrationConfig.update.mockResolvedValueOnce(mockUpdatedIntegration);
      mockPrisma.integrationLog.create.mockResolvedValueOnce(mockLog);

      const updated = await IntegrationService.updateIntegration(testIntegrationId, updateData);

      expect(updated.name).toBe(updateData.name);
      expect(updated.endpoint).toBe(updateData.endpoint);
      expect(updated.syncFrequency).toBe(updateData.syncFrequency);
      expect(mockPrisma.integrationConfig.update).toHaveBeenCalled();
    });

    test('should throw error when getting non-existent integration', async () => {
      mockPrisma.integrationConfig.findUnique.mockResolvedValue(null);

      await expect(
        IntegrationService.getIntegrationById('non-existent-id')
      ).rejects.toThrow('Integration not found');
    });
  });

  describe('Integration Operations', () => {
    test('should test connection successfully', async () => {
      const mockIntegration = {
        id: testIntegrationId,
        name: 'Test SIS Integration',
        type: 'SIS',
        status: 'INACTIVE',
        endpoint: 'https://sis.example.com/api',
        apiKey: 'test-key',
        username: null,
        password: null,
        settings: null,
        isActive: true,
        lastSyncAt: null,
        lastSyncStatus: null,
        syncFrequency: 60,
        createdAt: new Date(),
        updatedAt: new Date(),
        logs: []
      };

      const mockLog = {
        id: 'log-id',
        integrationId: testIntegrationId,
        integrationType: 'SIS',
        action: 'test_connection',
        status: 'success',
        startedAt: new Date(),
        createdAt: new Date()
      };

      mockPrisma.integrationConfig.findUnique.mockResolvedValueOnce(mockIntegration);
      mockPrisma.integrationConfig.update.mockResolvedValueOnce(mockIntegration).mockResolvedValueOnce(mockIntegration);
      mockPrisma.integrationLog.create.mockResolvedValueOnce(mockLog);

      const result = await IntegrationService.testConnection(testIntegrationId);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.message).toContain('Successfully connected');
      expect(result.responseTime).toBeGreaterThan(0);
      expect(mockPrisma.integrationConfig.update).toHaveBeenCalled();
    });

    test('should sync integration successfully', async () => {
      const mockIntegration = {
        id: testIntegrationId,
        name: 'Test SIS Integration',
        type: 'SIS',
        status: 'ACTIVE',
        endpoint: 'https://sis.example.com/api',
        apiKey: 'test-key',
        username: null,
        password: null,
        settings: null,
        isActive: true,
        lastSyncAt: null,
        lastSyncStatus: null,
        syncFrequency: 60,
        createdAt: new Date(),
        updatedAt: new Date(),
        logs: []
      };

      const mockLog = {
        id: 'log-id',
        integrationId: testIntegrationId,
        integrationType: 'SIS',
        action: 'sync',
        status: 'success',
        startedAt: new Date(),
        createdAt: new Date()
      };

      mockPrisma.integrationConfig.findUnique.mockResolvedValueOnce(mockIntegration);
      mockPrisma.integrationConfig.update.mockResolvedValueOnce(mockIntegration).mockResolvedValueOnce(mockIntegration);
      mockPrisma.integrationLog.create.mockResolvedValueOnce(mockLog);

      const result = await IntegrationService.syncIntegration(testIntegrationId);

      expect(result).toBeDefined();
      expect(result.success).toBeDefined();
      expect(result.recordsProcessed).toBeGreaterThanOrEqual(0);
      expect(result.recordsSucceeded).toBeGreaterThanOrEqual(0);
      expect(result.recordsFailed).toBeGreaterThanOrEqual(0);
      expect(result.duration).toBeGreaterThan(0);
      expect(mockPrisma.integrationConfig.update).toHaveBeenCalled();
    });
  });

  describe('Integration Logs', () => {
    test('should create integration log', async () => {
      const logData = {
        integrationId: testIntegrationId,
        integrationType: 'SIS' as const,
        action: 'test_action',
        status: 'success',
        recordsProcessed: 100,
        recordsSucceeded: 95,
        recordsFailed: 5,
        duration: 5000
      };

      const mockLog = {
        id: 'log-id',
        ...logData,
        startedAt: new Date(),
        completedAt: new Date(),
        errorMessage: null,
        details: null,
        createdAt: new Date()
      };

      mockPrisma.integrationLog.create.mockResolvedValue(mockLog);

      const log = await IntegrationService.createIntegrationLog(logData);

      expect(log).toBeDefined();
      expect(log.integrationId).toBe(testIntegrationId);
      expect(log.integrationType).toBe('SIS');
      expect(log.action).toBe('test_action');
      expect(log.status).toBe('success');
      expect(log.recordsProcessed).toBe(100);
      expect(mockPrisma.integrationLog.create).toHaveBeenCalled();
    });

    test('should get integration logs for specific integration', async () => {
      const mockLogs = [
        {
          id: 'log-1',
          integrationId: testIntegrationId,
          integrationType: 'SIS',
          action: 'sync',
          status: 'success',
          recordsProcessed: 100,
          recordsSucceeded: 100,
          recordsFailed: 0,
          startedAt: new Date(),
          completedAt: new Date(),
          duration: 1000,
          errorMessage: null,
          details: null,
          createdAt: new Date(),
          integration: {
            name: 'Test SIS Integration',
            type: 'SIS'
          }
        }
      ];

      mockPrisma.integrationLog.findMany.mockResolvedValue(mockLogs);
      mockPrisma.integrationLog.count.mockResolvedValue(1);

      const result = await IntegrationService.getIntegrationLogs(testIntegrationId);

      expect(result).toBeDefined();
      expect(result.logs).toBeDefined();
      expect(Array.isArray(result.logs)).toBe(true);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.total).toBeGreaterThan(0);
      expect(mockPrisma.integrationLog.findMany).toHaveBeenCalled();
    });
  });

  describe('Integration Statistics', () => {
    test('should get integration statistics', async () => {
      mockPrisma.integrationConfig.count.mockResolvedValueOnce(5).mockResolvedValueOnce(3);
      mockPrisma.integrationLog.findMany.mockResolvedValue([
        {
          id: 'log-1',
          status: 'success',
          recordsProcessed: 100,
          recordsSucceeded: 100,
          recordsFailed: 0,
          createdAt: new Date()
        },
        {
          id: 'log-2',
          status: 'failed',
          recordsProcessed: 50,
          recordsSucceeded: 40,
          recordsFailed: 10,
          createdAt: new Date()
        }
      ]);
      mockPrisma.integrationLog.groupBy.mockResolvedValue([
        { integrationType: 'SIS', status: 'success', _count: 10 },
        { integrationType: 'SIS', status: 'failed', _count: 2 }
      ]);

      const stats = await IntegrationService.getIntegrationStatistics();

      expect(stats).toBeDefined();
      expect(stats.totalIntegrations).toBe(5);
      expect(stats.activeIntegrations).toBe(3);
      expect(stats.inactiveIntegrations).toBe(2);
      expect(stats.syncStatistics).toBeDefined();
      expect(stats.syncStatistics.totalSyncs).toBeGreaterThanOrEqual(0);
      expect(stats.syncStatistics.successRate).toBeGreaterThanOrEqual(0);
      expect(stats.syncStatistics.successRate).toBeLessThanOrEqual(100);
      expect(stats.statsByType).toBeDefined();
    });
  });

  describe('Different Integration Types', () => {
    test('should create different integration types', async () => {
      const integrationTypes = ['EHR', 'PHARMACY', 'LABORATORY', 'INSURANCE', 'PARENT_PORTAL', 'HEALTH_APP', 'GOVERNMENT_REPORTING'];
      
      for (const type of integrationTypes) {
        const mockIntegration = {
          id: `test-${type}-id`,
          name: `Test ${type} Integration`,
          type,
          status: 'INACTIVE',
          endpoint: `https://${type.toLowerCase()}.example.com/api`,
          apiKey: 'test-key',
          username: null,
          password: null,
          settings: null,
          isActive: true,
          lastSyncAt: null,
          lastSyncStatus: null,
          syncFrequency: 60,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const mockLog = {
          id: 'log-id',
          integrationId: mockIntegration.id,
          integrationType: type,
          action: 'create',
          status: 'success',
          startedAt: new Date(),
          createdAt: new Date()
        };

        mockPrisma.integrationConfig.create.mockResolvedValue(mockIntegration);
        mockPrisma.integrationLog.create.mockResolvedValue(mockLog);

        const integration = await IntegrationService.createIntegration({
          name: `Test ${type} Integration`,
          type: type as any,
          endpoint: `https://${type.toLowerCase()}.example.com/api`
        });

        expect(integration.type).toBe(type);
      }
    });
  });

  describe('Integration Deletion', () => {
    test('should delete integration successfully', async () => {
      const mockIntegration = {
        id: testIntegrationId,
        name: 'Test SIS Integration',
        type: 'SIS'
      };

      mockPrisma.integrationConfig.findUnique.mockResolvedValue(mockIntegration);
      mockPrisma.integrationConfig.delete.mockResolvedValue(mockIntegration);

      await IntegrationService.deleteIntegration(testIntegrationId);

      expect(mockPrisma.integrationConfig.delete).toHaveBeenCalledWith({
        where: { id: testIntegrationId }
      });
    });

    test('should throw error when deleting non-existent integration', async () => {
      mockPrisma.integrationConfig.findUnique.mockResolvedValue(null);

      await expect(
        IntegrationService.deleteIntegration('non-existent-id')
      ).rejects.toThrow('Integration not found');
    });
  });
});
