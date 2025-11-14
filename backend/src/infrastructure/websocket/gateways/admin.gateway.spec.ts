/**
 * @fileoverview Tests for Admin WebSocket Gateway
 * @module infrastructure/websocket/gateways
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AdminWebSocketGateway } from './admin.gateway';
import { AdminMetricsService, SystemMetrics, SystemAlert } from '../services/admin-metrics.service';
import type { AuthenticatedSocket } from '../interfaces';
import { Server } from 'socket.io';

describe('AdminWebSocketGateway', () => {
  let gateway: AdminWebSocketGateway;
  let mockAdminMetricsService: jest.Mocked<AdminMetricsService>;
  let mockServer: jest.Mocked<Server>;
  let mockClient: jest.Mocked<AuthenticatedSocket>;

  const mockMetrics: SystemMetrics = {
    timestamp: new Date().toISOString(),
    system: { uptime: 1000, loadAverage: [1, 2, 3], platform: 'linux', hostname: 'test', version: '1.0' },
    cpu: { usage: 50, cores: 4, model: 'Intel', speed: 2400 },
    memory: { total: 8000000000, used: 4000000000, free: 4000000000, percentage: 50 },
    disk: { total: 1000000000000, used: 500000000000, free: 500000000000, percentage: 50 },
    network: { bytesIn: 1000, bytesOut: 2000, packetsIn: 100, packetsOut: 200 },
    database: { connections: 10, activeQueries: 5, slowQueries: 1, uptime: 10000 },
    websocket: { connectedClients: 5, totalMessages: 1000, errors: 2 },
  };

  beforeEach(async () => {
    mockAdminMetricsService = {
      getCurrentMetrics: jest.fn().mockResolvedValue(mockMetrics),
      getActiveAlerts: jest.fn().mockReturnValue([]),
      getSystemHealthStatus: jest.fn().mockReturnValue('healthy'),
      logAdminActivity: jest.fn().mockResolvedValue(undefined),
      getMetricsHistory: jest.fn().mockReturnValue([]),
      acknowledgeAlert: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<AdminMetricsService>;

    mockServer = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    } as unknown as jest.Mocked<Server>;

    mockClient = {
      id: 'client-123',
      user: {
        userId: 'admin-user-123',
        email: 'admin@test.com',
        role: 'admin',
        organizationId: 'org-123',
      },
      join: jest.fn().mockResolvedValue(undefined),
      leave: jest.fn().mockResolvedValue(undefined),
      emit: jest.fn(),
      to: jest.fn().mockReturnThis(),
      disconnect: jest.fn(),
      handshake: {
        address: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      },
    } as unknown as jest.Mocked<AuthenticatedSocket>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminWebSocketGateway,
        {
          provide: AdminMetricsService,
          useValue: mockAdminMetricsService,
        },
      ],
    }).compile();

    gateway = module.get<AdminWebSocketGateway>(AdminWebSocketGateway);
    gateway.server = mockServer;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should be defined', () => {
      expect(gateway).toBeDefined();
    });

    it('should initialize on afterInit', () => {
      gateway.afterInit();
      expect(gateway).toBeDefined();
    });
  });

  describe('handleConnection()', () => {
    it('should accept connection from admin user', async () => {
      await gateway.handleConnection(mockClient);

      expect(mockClient.join).toHaveBeenCalledWith('admin:metrics');
      expect(mockClient.join).toHaveBeenCalledWith('admin:alerts');
      expect(mockClient.join).toHaveBeenCalledWith('admin:activity');
      expect(mockClient.emit).toHaveBeenCalledWith(
        'admin:metrics:update',
        expect.objectContaining({ metrics: mockMetrics }),
      );
    });

    it('should reject connection without user context', async () => {
      mockClient.user = null as unknown as typeof mockClient.user;

      await gateway.handleConnection(mockClient);

      expect(mockClient.disconnect).toHaveBeenCalled();
    });

    it('should reject connection from non-admin user', async () => {
      mockClient.user.role = 'user';

      await gateway.handleConnection(mockClient);

      expect(mockClient.disconnect).toHaveBeenCalled();
    });

    it('should accept super_admin role', async () => {
      mockClient.user.role = 'super_admin';

      await gateway.handleConnection(mockClient);

      expect(mockClient.disconnect).not.toHaveBeenCalled();
      expect(mockClient.join).toHaveBeenCalled();
    });

    it('should log admin activity on connection', async () => {
      await gateway.handleConnection(mockClient);

      expect(mockAdminMetricsService.logAdminActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'admin_dashboard_connected',
          userId: mockClient.user.userId,
        }),
      );
    });

    it('should broadcast connection to other admins', async () => {
      await gateway.handleConnection(mockClient);

      expect(mockServer.to).toHaveBeenCalledWith('admin:activity');
      expect(mockServer.emit).toHaveBeenCalledWith(
        'admin:client:connected',
        expect.objectContaining({ clientId: mockClient.id }),
      );
    });

    it('should handle connection errors', async () => {
      mockClient.join.mockRejectedValueOnce(new Error('Join failed'));

      await gateway.handleConnection(mockClient);

      expect(mockClient.disconnect).toHaveBeenCalled();
    });
  });

  describe('handleDisconnect()', () => {
    beforeEach(async () => {
      await gateway.handleConnection(mockClient);
      jest.clearAllMocks();
    });

    it('should handle disconnection', () => {
      gateway.handleDisconnect(mockClient);

      expect(mockServer.to).toHaveBeenCalledWith('admin:activity');
      expect(mockServer.emit).toHaveBeenCalledWith(
        'admin:client:disconnected',
        expect.objectContaining({ clientId: mockClient.id }),
      );
    });

    it('should log disconnection activity', () => {
      gateway.handleDisconnect(mockClient);

      expect(mockAdminMetricsService.logAdminActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'admin_dashboard_disconnected',
          userId: mockClient.user.userId,
        }),
      );
    });
  });

  describe('handleMetricsRequest()', () => {
    beforeEach(async () => {
      await gateway.handleConnection(mockClient);
      jest.clearAllMocks();
    });

    it('should send current metrics on request', async () => {
      await gateway.handleMetricsRequest(mockClient);

      expect(mockAdminMetricsService.getCurrentMetrics).toHaveBeenCalled();
      expect(mockClient.emit).toHaveBeenCalledWith(
        'admin:metrics:update',
        expect.objectContaining({ metrics: mockMetrics }),
      );
    });

    it('should send metrics history', async () => {
      await gateway.handleMetricsRequest(mockClient);

      expect(mockAdminMetricsService.getMetricsHistory).toHaveBeenCalledWith(20);
      expect(mockClient.emit).toHaveBeenCalledWith(
        'admin:metrics:history',
        expect.any(Object),
      );
    });
  });

  describe('handleAlertAcknowledge()', () => {
    beforeEach(async () => {
      await gateway.handleConnection(mockClient);
      jest.clearAllMocks();
    });

    it('should acknowledge alert', async () => {
      const alertId = 'alert-123';

      await gateway.handleAlertAcknowledge(mockClient, alertId);

      expect(mockAdminMetricsService.acknowledgeAlert).toHaveBeenCalledWith(
        alertId,
        mockClient.user.userId,
      );
    });

    it('should log alert acknowledgment', async () => {
      const alertId = 'alert-123';

      await gateway.handleAlertAcknowledge(mockClient, alertId);

      expect(mockAdminMetricsService.logAdminActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'alert_acknowledged',
          resource: `alert:${alertId}`,
        }),
      );
    });
  });

  describe('handleSubscribe()', () => {
    beforeEach(async () => {
      await gateway.handleConnection(mockClient);
      jest.clearAllMocks();
    });

    it('should allow subscription to valid channel', async () => {
      await gateway.handleSubscribe(mockClient, 'metrics');

      expect(mockClient.join).toHaveBeenCalledWith('admin:metrics');
    });

    it('should reject invalid channel subscription', async () => {
      await gateway.handleSubscribe(mockClient, 'invalid-channel');

      expect(mockClient.join).not.toHaveBeenCalled();
    });
  });

  describe('handleUnsubscribe()', () => {
    beforeEach(async () => {
      await gateway.handleConnection(mockClient);
      await gateway.handleSubscribe(mockClient, 'metrics');
      jest.clearAllMocks();
    });

    it('should unsubscribe from channel', async () => {
      await gateway.handleUnsubscribe(mockClient, 'metrics');

      expect(mockClient.leave).toHaveBeenCalledWith('admin:metrics');
    });
  });

  describe('Admin Tool Execution', () => {
    beforeEach(async () => {
      await gateway.handleConnection(mockClient);
      jest.clearAllMocks();
    });

    it('should execute cache-clear tool', async () => {
      await gateway.handleToolExecution(mockClient, { toolId: 'cache-clear' });

      expect(mockClient.emit).toHaveBeenCalledWith(
        'admin:tools:result',
        expect.objectContaining({ success: true }),
      );
    });

    it('should handle unknown tool error', async () => {
      await gateway.handleToolExecution(mockClient, { toolId: 'unknown-tool' });

      expect(mockClient.emit).toHaveBeenCalledWith(
        'admin:tools:result',
        expect.objectContaining({
          result: expect.objectContaining({ success: false }),
        }),
      );
    });

    it('should log tool execution', async () => {
      await gateway.handleToolExecution(mockClient, { toolId: 'cache-clear' });

      expect(mockAdminMetricsService.logAdminActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'admin_tool_executed',
          resource: 'tool:cache-clear',
        }),
      );
    });
  });

  describe('getConnectedAdminCount()', () => {
    it('should return count of connected admins', async () => {
      await gateway.handleConnection(mockClient);

      const count = gateway.getConnectedAdminCount();

      expect(count).toBe(1);
    });
  });

  describe('getConnectedAdmins()', () => {
    it('should return list of connected admins', async () => {
      await gateway.handleConnection(mockClient);

      const admins = gateway.getConnectedAdmins();

      expect(admins).toHaveLength(1);
      expect(admins[0].userId).toBe(mockClient.user.userId);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing admin metrics service', async () => {
      const moduleWithoutService: TestingModule = await Test.createTestingModule({
        providers: [AdminWebSocketGateway],
      }).compile();

      const gatewayWithoutService = moduleWithoutService.get<AdminWebSocketGateway>(
        AdminWebSocketGateway,
      );

      await gatewayWithoutService.handleConnection(mockClient);

      expect(mockClient.disconnect).not.toHaveBeenCalled();
    });

    it('should handle concurrent connections', async () => {
      const mockClient2 = { ...mockClient, id: 'client-456', user: { ...mockClient.user, userId: 'admin-456' } } as unknown as AuthenticatedSocket;

      await gateway.handleConnection(mockClient);
      await gateway.handleConnection(mockClient2);

      expect(gateway.getConnectedAdminCount()).toBe(2);
    });
  });
});
