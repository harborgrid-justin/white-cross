/**
 * Admin WebSocket Gateway
 *
 * Dedicated WebSocket namespace for admin real-time features.
 * Provides real-time system monitoring, admin activity tracking,
 * and administrative tool integration via WebSocket.
 *
 * @module infrastructure/websocket/gateways/admin.gateway
 * @category WebSocket Gateways
 * @requires AdminMetricsService
 * @since 2025-11-05
 */

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, UseGuards, UseFilters, UseInterceptors } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WsJwtAuthGuard } from '../guards/ws-jwt-auth.guard';
import { WsExceptionFilter } from '../filters/ws-exception.filter';
import { WsLoggingInterceptor } from '../interceptors/ws-logging.interceptor';
import { AdminMetricsService, SystemMetrics, AdminActivity, SystemAlert } from '../services/admin-metrics.service';
import type { AuthenticatedSocket } from '../interfaces/authenticated-socket.interface';

/**
 * Admin client connection tracking
 */
interface AdminClient {
  socketId: string;
  userId: string;
  userName: string;
  role: string;
  connectedAt: Date;
  subscriptions: Set<string>;
}

/**
 * WebSocket events for admin namespace
 */
interface AdminServerToClientEvents {
  'admin:metrics:update': (data: {
    metrics: SystemMetrics;
    trend: any;
    alerts: SystemAlert[];
  }) => void;
  'admin:alert:new': (alert: SystemAlert) => void;
  'admin:alert:acknowledged': (data: { alertId: string; userId: string; timestamp: string }) => void;
  'admin:activity:new': (activity: AdminActivity) => void;
  'admin:client:connected': (data: { clientId: string; userName: string; timestamp: string }) => void;
  'admin:client:disconnected': (data: { clientId: string; userName: string; timestamp: string }) => void;
  'admin:system:status': (data: { status: 'healthy' | 'degraded' | 'critical'; timestamp: string }) => void;
  'admin:tools:result': (data: { toolId: string; result: any; timestamp: string }) => void;
}

interface AdminClientToServerEvents {
  'admin:subscribe': (channel: string) => void;
  'admin:unsubscribe': (channel: string) => void;
  'admin:metrics:request': () => void;
  'admin:alerts:acknowledge': (alertId: string) => void;
  'admin:tools:execute': (data: { toolId: string; params?: any }) => void;
  'admin:activity:request': (limit?: number) => void;
  'admin:ping': () => void;
}

@UseFilters(new WsExceptionFilter())
@UseInterceptors(WsLoggingInterceptor)
@WebSocketGateway({
  namespace: '/admin',
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 30000,
  pingInterval: 10000,
})
export class AdminWebSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server<AdminClientToServerEvents, AdminServerToClientEvents>;

  private readonly logger = new Logger(AdminWebSocketGateway.name);
  private readonly connectedClients = new Map<string, AdminClient>();
  
  // Available subscription channels
  private readonly availableChannels = new Set([
    'metrics',
    'alerts', 
    'activity',
    'system-status',
    'tools-results',
  ]);

  constructor(
    private readonly adminMetricsService: AdminMetricsService,
  ) {}

  /**
   * Gateway initialization
   */
  afterInit(server: Server): void {
    this.logger.log('Admin WebSocket Gateway initialized');
    
    // Set up admin-specific rooms
    this.setupAdminRooms();
  }

  /**
   * Handle new admin client connections
   */
  async handleConnection(client: AuthenticatedSocket): Promise<void> {
    try {
      const user = client.user;
      if (!user) {
        this.logger.warn(`Admin WebSocket connection rejected: No user context`);
        client.disconnect();
        return;
      }

      // Check if user has admin privileges
      if (!['admin', 'system_administrator', 'super_admin'].includes(user.role)) {
        this.logger.warn(`Admin WebSocket connection rejected: Insufficient privileges for user ${user.userId}`);
        client.disconnect();
        return;
      }

      // Track connected admin client
      const adminClient: AdminClient = {
        socketId: client.id,
        userId: user.userId,
        userName: user.email.split('@')[0] || `User ${user.userId}`, // Use email prefix as username
        role: user.role,
        connectedAt: new Date(),
        subscriptions: new Set(),
      };

      this.connectedClients.set(client.id, adminClient);

      // Join admin rooms
      await client.join('admin:metrics');
      await client.join('admin:alerts');
      await client.join('admin:activity');
      await client.join('admin:system-status');

      this.logger.log(`Admin client connected: ${adminClient.userName} (${user.userId}) - Role: ${user.role}`);

      // Send current system status
      const currentMetrics = await this.adminMetricsService.getCurrentMetrics();
      const activeAlerts = this.adminMetricsService.getActiveAlerts();
      const systemStatus = this.adminMetricsService.getSystemHealthStatus();

      if (currentMetrics) {
        client.emit('admin:metrics:update', {
          metrics: currentMetrics,
          trend: this.calculateTrend(),
          alerts: activeAlerts,
        });
      }

      client.emit('admin:system:status', {
        status: systemStatus,
        timestamp: new Date().toISOString(),
      });

      // Broadcast new admin connection to other admins
      this.server.to('admin:activity').emit('admin:client:connected', {
        clientId: client.id,
        userName: adminClient.userName,
        timestamp: new Date().toISOString(),
      });

      // Log admin connection activity
      await this.adminMetricsService.logAdminActivity({
        userId: user.userId,
        userName: adminClient.userName,
        action: 'admin_dashboard_connected',
        resource: 'admin_websocket',
        ipAddress: client.handshake.address,
        userAgent: client.handshake.headers['user-agent'] || '',
        severity: 'info',
        details: {
          socketId: client.id,
          namespace: '/admin',
        },
      });

    } catch (error) {
      this.logger.error(`Admin connection error for ${client.id}:`, error);
      client.disconnect();
    }
  }

  /**
   * Handle admin client disconnections
   */
  handleDisconnect(client: AuthenticatedSocket): void {
    const adminClient = this.connectedClients.get(client.id);
    
    if (adminClient) {
      this.logger.log(`Admin client disconnected: ${adminClient.userName} (${adminClient.userId})`);

      // Broadcast disconnection to other admins
      this.server.to('admin:activity').emit('admin:client:disconnected', {
        clientId: client.id,
        userName: adminClient.userName,
        timestamp: new Date().toISOString(),
      });

      // Log admin disconnection activity
      this.adminMetricsService.logAdminActivity({
        userId: adminClient.userId,
        userName: adminClient.userName,
        action: 'admin_dashboard_disconnected',
        resource: 'admin_websocket',
        ipAddress: client.handshake.address,
        userAgent: client.handshake.headers['user-agent'] || '',
        severity: 'info',
        details: {
          socketId: client.id,
          sessionDuration: Date.now() - adminClient.connectedAt.getTime(),
        },
      });

      this.connectedClients.delete(client.id);
    }
  }

  /**
   * Handle admin ping for health checks
   */
  @SubscribeMessage('admin:ping')
  handlePing(@ConnectedSocket() client: AuthenticatedSocket): void {
    client.emit('admin:pong', { 
      timestamp: new Date().toISOString(),
      serverTime: Date.now(),
    });
  }

  /**
   * Handle subscription to admin channels
   */
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('admin:subscribe')
  async handleSubscribe(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() channel: string,
  ): Promise<void> {
    const adminClient = this.connectedClients.get(client.id);
    if (!adminClient) return;

    if (!this.availableChannels.has(channel)) {
      this.logger.warn(`Invalid subscription channel: ${channel} requested by ${adminClient.userName}`);
      return;
    }

    adminClient.subscriptions.add(channel);
    await client.join(`admin:${channel}`);

    this.logger.debug(`Admin client ${adminClient.userName} subscribed to ${channel}`);

    // Send initial data for the subscribed channel
    await this.sendChannelData(client, channel);
  }

  /**
   * Handle unsubscription from admin channels
   */
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('admin:unsubscribe')
  async handleUnsubscribe(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() channel: string,
  ): Promise<void> {
    const adminClient = this.connectedClients.get(client.id);
    if (!adminClient) return;

    adminClient.subscriptions.delete(channel);
    await client.leave(`admin:${channel}`);

    this.logger.debug(`Admin client ${adminClient.userName} unsubscribed from ${channel}`);
  }

  /**
   * Handle metrics request
   */
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('admin:metrics:request')
  async handleMetricsRequest(@ConnectedSocket() client: AuthenticatedSocket): Promise<void> {
    const currentMetrics = await this.adminMetricsService.getCurrentMetrics();
    const activeAlerts = this.adminMetricsService.getActiveAlerts();
    const metricsHistory = this.adminMetricsService.getMetricsHistory(20);

    if (currentMetrics) {
      client.emit('admin:metrics:update', {
        metrics: currentMetrics,
        trend: this.calculateTrend(),
        alerts: activeAlerts,
      });

      // Also send historical data for charts
      client.emit('admin:metrics:history', {
        history: metricsHistory,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Handle alert acknowledgment
   */
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('admin:alerts:acknowledge')
  async handleAlertAcknowledge(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() alertId: string,
  ): Promise<void> {
    const adminClient = this.connectedClients.get(client.id);
    if (!adminClient) return;

    await this.adminMetricsService.acknowledgeAlert(alertId, adminClient.userId);

    // Log the acknowledgment
    await this.adminMetricsService.logAdminActivity({
      userId: adminClient.userId,
      userName: adminClient.userName,
      action: 'alert_acknowledged',
      resource: `alert:${alertId}`,
      ipAddress: client.handshake.address,
      userAgent: client.handshake.headers['user-agent'] || '',
      severity: 'info',
      details: { alertId },
    });
  }

  /**
   * Handle admin tool execution
   */
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('admin:tools:execute')
  async handleToolExecution(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { toolId: string; params?: any },
  ): Promise<void> {
    const adminClient = this.connectedClients.get(client.id);
    if (!adminClient) return;

    try {
      this.logger.log(`Admin tool execution: ${data.toolId} by ${adminClient.userName}`);

      // Execute the admin tool (placeholder - implement actual tools)
      const result = await this.executeAdminTool(data.toolId, data.params);

      // Send result back to client
      client.emit('admin:tools:result', {
        toolId: data.toolId,
        result,
        timestamp: new Date().toISOString(),
      });

      // Log the tool execution
      await this.adminMetricsService.logAdminActivity({
        userId: adminClient.userId,
        userName: adminClient.userName,
        action: 'admin_tool_executed',
        resource: `tool:${data.toolId}`,
        ipAddress: client.handshake.address,
        userAgent: client.handshake.headers['user-agent'] || '',
        severity: 'warning', // Tool executions are significant
        details: { toolId: data.toolId, params: data.params },
      });

    } catch (error) {
      this.logger.error(`Admin tool execution failed: ${data.toolId}`, error);
      
      client.emit('admin:tools:result', {
        toolId: data.toolId,
        result: { success: false, error: error.message },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Handle admin activity request
   */
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('admin:activity:request')
  async handleActivityRequest(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() limit = 50,
  ): Promise<void> {
    // In a real implementation, you'd fetch from database
    // For now, return empty array as placeholder
    client.emit('admin:activity:list', {
      activities: [],
      limit,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Set up admin-specific rooms
   */
  private setupAdminRooms(): void {
    // Admin rooms are created dynamically when clients connect
    this.logger.debug('Admin rooms setup completed');
  }

  /**
   * Send initial data for a subscribed channel
   */
  private async sendChannelData(client: AuthenticatedSocket, channel: string): Promise<void> {
    switch (channel) {
      case 'metrics':
        const metrics = await this.adminMetricsService.getCurrentMetrics();
        if (metrics) {
          client.emit('admin:metrics:update', {
            metrics,
            trend: this.calculateTrend(),
            alerts: this.adminMetricsService.getActiveAlerts(),
          });
        }
        break;

      case 'alerts':
        const alerts = this.adminMetricsService.getActiveAlerts();
        alerts.forEach(alert => {
          client.emit('admin:alert:new', alert);
        });
        break;

      case 'system-status':
        const status = this.adminMetricsService.getSystemHealthStatus();
        client.emit('admin:system:status', {
          status,
          timestamp: new Date().toISOString(),
        });
        break;
    }
  }

  /**
   * Calculate trend data (placeholder)
   */
  private calculateTrend(): any {
    return {
      cpu: 'stable',
      memory: 'stable', 
      disk: 'stable',
    };
  }

  /**
   * Execute admin tool (placeholder)
   */
  private async executeAdminTool(toolId: string, params?: any): Promise<any> {
    // Placeholder implementation - add actual admin tools
    const tools: Record<string, () => Promise<any>> = {
      'cache-clear': async () => ({ success: true, message: 'Cache cleared successfully' }),
      'database-backup': async () => ({ success: true, message: 'Database backup initiated' }),
      'log-cleanup': async () => ({ success: true, message: 'Log cleanup completed' }),
      'system-restart': async () => ({ success: true, message: 'System restart scheduled' }),
      'health-check': async () => ({ 
        success: true, 
        message: 'Health check completed',
        results: await this.adminMetricsService.getCurrentMetrics(),
      }),
    };

    const tool = tools[toolId];
    if (!tool) {
      throw new Error(`Unknown admin tool: ${toolId}`);
    }

    return await tool();
  }

  /**
   * Get connected admin clients count
   */
  getConnectedAdminCount(): number {
    return this.connectedClients.size;
  }

  /**
   * Get connected admin clients info
   */
  getConnectedAdmins(): AdminClient[] {
    return Array.from(this.connectedClients.values());
  }
}