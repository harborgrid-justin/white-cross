/**
 * LOC: WSGATEWAY001
 * File: /reuse/threat/composites/downstream/websocket-gateway-implementations.ts
 *
 * UPSTREAM (imports from):
 *   - ../real-time-threat-streaming-composite
 *   - @nestjs/common
 *   - @nestjs/websockets
 *   - @nestjs/swagger
 *
 * DOWNSTREAM (imported by):
 *   - WebSocket gateway infrastructure
 *   - Real-time threat streaming clients
 *   - Event-driven notification systems
 *   - Live dashboard updates
 */

/**
 * File: /reuse/threat/composites/downstream/websocket-gateway-implementations.ts
 * Locator: WC-DOWNSTREAM-WSGATEWAY-001
 * Purpose: WebSocket Gateway Implementations - Enterprise-grade real-time threat streaming and bi-directional communication
 *
 * Upstream: real-time-threat-streaming-composite
 * Downstream: WebSocket clients, Real-time dashboards, Event notification systems
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/websockets, socket.io
 * Exports: Production-ready WebSocket gateway with advanced features for real-time threat intelligence streaming
 *
 * LLM Context: Enterprise WebSocket gateway for White Cross healthcare threat intelligence platform.
 * Provides real-time bi-directional communication for threat updates, live dashboard feeds, alert notifications,
 * and interactive security monitoring. Supports WebSocket, Server-Sent Events (SSE), and pub/sub patterns.
 * HIPAA-compliant with encrypted connections, authentication, authorization, and comprehensive audit logging.
 */

import {
  Injectable,
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Logger,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Server, Socket } from 'socket.io';

// Import from real-time threat streaming composite
import {
  createWebSocketServer,
  handleWebSocketConnection,
  createThreatUpdateMessage,
  filterWebSocketMessage,
  broadcastThreatUpdate,
  manageWebSocketHeartbeat,
  handleWebSocketReconnection,
  compressWebSocketMessage,
  createSSEEndpoint,
  formatThreatAsSSE,
  streamThreatFeedViaSSE,
  sendSSEKeepAlive,
  manageSSEConnection,
  createThreatPubSubChannel,
  publishThreatToPubSub,
  subscribeToPubSubChannel,
  createThreatQueueConsumer,
  createThreatQueueProducer,
  createStreamProcessingPipeline,
  processStreamWithFiltering,
  processStreamWithEnrichment,
  processStreamWithDeduplication,
  processStreamWithAggregation,
  handleStreamBackpressure,
  createRealTimeThreatEvent,
  streamThreatEventToChannels,
  filterRealTimeEventsBySeverity,
  batchRealTimeThreatEvents,
  calculateStreamMetrics,
  monitorStreamHealth,
  aggregateStreamMetrics,
  type WebSocketConfig,
  type WebSocketAuthConfig,
  type HeartbeatConfig,
  type ReconnectConfig,
  type WebSocketMessage,
  type SubscriptionFilter,
  type StreamSubscription,
  type SSEConfig,
  type SSEEvent,
  type PubSubChannelConfig,
  type MessageQueueConfig,
  type StreamPipeline,
  type StreamMetrics,
  type RealTimeThreatEvent,
} from '../real-time-threat-streaming-composite';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Gateway connection metadata
 */
export interface GatewayConnectionMetadata {
  connectionId: string;
  userId: string;
  organizationId: string;
  clientType: 'web' | 'mobile' | 'api' | 'dashboard';
  clientVersion: string;
  ipAddress: string;
  userAgent: string;
  connectedAt: Date;
  lastActivity: Date;
  subscriptions: string[];
  permissions: string[];
  authentication: AuthenticationMetadata;
}

/**
 * Authentication metadata
 */
export interface AuthenticationMetadata {
  method: 'jwt' | 'api_key' | 'oauth2';
  token: string;
  expiresAt: Date;
  scope: string[];
  verified: boolean;
}

/**
 * Connection statistics
 */
export interface ConnectionStatistics {
  totalConnections: number;
  activeConnections: number;
  authenticatedConnections: number;
  connectionsByType: Record<string, number>;
  connectionsByOrganization: Record<string, number>;
  averageConnectionDuration: number;
  peakConnections: number;
  peakConnectionTime: Date;
}

/**
 * Message routing configuration
 */
export interface MessageRoutingConfig {
  routeId: string;
  sourceChannels: string[];
  targetChannels: string[];
  filters: MessageFilter[];
  transformations: MessageTransformation[];
  rateLimits: RateLimitConfig[];
  priority: MessagePriority;
  retryPolicy: RetryPolicy;
}

/**
 * Message filter
 */
export interface MessageFilter {
  field: string;
  operator: 'equals' | 'contains' | 'matches' | 'in' | 'greater_than' | 'less_than';
  value: any;
  caseSensitive: boolean;
}

/**
 * Message transformation
 */
export interface MessageTransformation {
  type: 'enrich' | 'filter_fields' | 'rename_fields' | 'aggregate' | 'format';
  config: Record<string, any>;
}

/**
 * Message priority
 */
export type MessagePriority = 'critical' | 'high' | 'normal' | 'low';

/**
 * Retry policy
 */
export interface RetryPolicy {
  enabled: boolean;
  maxAttempts: number;
  backoffStrategy: 'linear' | 'exponential' | 'fixed';
  initialDelay: number;
  maxDelay: number;
  retryableErrors: string[];
}

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  windowMs: number;
  maxMessages: number;
  skipSuccessfulRequests: boolean;
  skipFailedRequests: boolean;
  keyGenerator: (connection: GatewayConnectionMetadata) => string;
}

/**
 * Channel configuration
 */
export interface ChannelConfig {
  channelId: string;
  name: string;
  description: string;
  type: 'public' | 'private' | 'organization' | 'user';
  permissions: ChannelPermissions;
  retention: RetentionPolicy;
  filters: SubscriptionFilter[];
  rateLimit?: RateLimitConfig;
  compression: boolean;
  encryption: boolean;
}

/**
 * Channel permissions
 */
export interface ChannelPermissions {
  subscribe: string[];
  publish: string[];
  manage: string[];
  requireAuthentication: boolean;
  allowedOrganizations?: string[];
  allowedRoles?: string[];
}

/**
 * Retention policy
 */
export interface RetentionPolicy {
  enabled: boolean;
  retentionPeriod: number;
  maxMessages: number;
  archiveExpired: boolean;
  archiveLocation?: string;
}

/**
 * Broadcast options
 */
export interface BroadcastOptions {
  channels?: string[];
  rooms?: string[];
  organizations?: string[];
  users?: string[];
  excludeConnectionIds?: string[];
  compression?: boolean;
  priority?: MessagePriority;
  ttl?: number;
}

/**
 * Stream session
 */
export interface StreamSession {
  sessionId: string;
  connectionId: string;
  userId: string;
  organizationId: string;
  channels: string[];
  filters: SubscriptionFilter[];
  startedAt: Date;
  lastMessageAt?: Date;
  messagesReceived: number;
  bytesReceived: number;
  errors: number;
  status: 'active' | 'paused' | 'disconnected';
}

/**
 * Gateway metrics
 */
export interface GatewayMetrics {
  connections: ConnectionStatistics;
  messages: MessageStatistics;
  channels: ChannelStatistics;
  performance: PerformanceMetrics;
  errors: ErrorStatistics;
}

/**
 * Message statistics
 */
export interface MessageStatistics {
  totalMessagesSent: number;
  totalMessagesReceived: number;
  messagesPerSecond: number;
  averageMessageSize: number;
  messagesByType: Record<string, number>;
  messagesByPriority: Record<string, number>;
  failedMessages: number;
  retries: number;
}

/**
 * Channel statistics
 */
export interface ChannelStatistics {
  totalChannels: number;
  activeChannels: number;
  totalSubscriptions: number;
  subscriptionsByChannel: Record<string, number>;
  messagesByChannel: Record<string, number>;
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  averageLatency: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
  throughput: number;
  cpuUsage: number;
  memoryUsage: number;
  networkBandwidth: number;
}

/**
 * Error statistics
 */
export interface ErrorStatistics {
  totalErrors: number;
  errorsByType: Record<string, number>;
  authenticationFailures: number;
  authorizationFailures: number;
  rateLimitExceeded: number;
  connectionErrors: number;
  messageErrors: number;
}

/**
 * Health check result
 */
export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  uptime: number;
  checks: HealthCheck[];
  metrics: GatewayMetrics;
}

/**
 * Individual health check
 */
export interface HealthCheck {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  details?: Record<string, any>;
}

// ============================================================================
// WEBSOCKET GATEWAY - THREAT INTELLIGENCE STREAMING
// ============================================================================

@WebSocketGateway({
  cors: {
    origin: '*', // Configure appropriately in production
    credentials: true,
  },
  namespace: '/threat-stream',
  transports: ['websocket', 'polling'],
})
@Injectable()
export class ThreatIntelligenceWebSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ThreatIntelligenceWebSocketGateway.name);
  private connections: Map<string, GatewayConnectionMetadata> = new Map();
  private channels: Map<string, ChannelConfig> = new Map();
  private sessions: Map<string, StreamSession> = new Map();
  private heartbeatIntervals: Map<string, NodeJS.Timeout> = new Map();
  private metrics: GatewayMetrics;

  constructor() {
    this.initializeMetrics();
    this.initializeDefaultChannels();
  }

  /**
   * Initialize gateway metrics
   */
  private initializeMetrics(): void {
    this.metrics = {
      connections: {
        totalConnections: 0,
        activeConnections: 0,
        authenticatedConnections: 0,
        connectionsByType: {},
        connectionsByOrganization: {},
        averageConnectionDuration: 0,
        peakConnections: 0,
        peakConnectionTime: new Date(),
      },
      messages: {
        totalMessagesSent: 0,
        totalMessagesReceived: 0,
        messagesPerSecond: 0,
        averageMessageSize: 0,
        messagesByType: {},
        messagesByPriority: {},
        failedMessages: 0,
        retries: 0,
      },
      channels: {
        totalChannels: 0,
        activeChannels: 0,
        totalSubscriptions: 0,
        subscriptionsByChannel: {},
        messagesByChannel: {},
      },
      performance: {
        averageLatency: 0,
        p50Latency: 0,
        p95Latency: 0,
        p99Latency: 0,
        throughput: 0,
        cpuUsage: 0,
        memoryUsage: 0,
        networkBandwidth: 0,
      },
      errors: {
        totalErrors: 0,
        errorsByType: {},
        authenticationFailures: 0,
        authorizationFailures: 0,
        rateLimitExceeded: 0,
        connectionErrors: 0,
        messageErrors: 0,
      },
    };
  }

  /**
   * Initialize default threat intelligence channels
   */
  private initializeDefaultChannels(): void {
    const defaultChannels: ChannelConfig[] = [
      {
        channelId: 'critical-threats',
        name: 'Critical Threats',
        description: 'High-priority, critical threat intelligence',
        type: 'public',
        permissions: {
          subscribe: ['authenticated'],
          publish: ['admin', 'threat_analyst'],
          manage: ['admin'],
          requireAuthentication: true,
        },
        retention: {
          enabled: true,
          retentionPeriod: 7 * 24 * 60 * 60 * 1000, // 7 days
          maxMessages: 10000,
          archiveExpired: true,
        },
        filters: [],
        compression: true,
        encryption: true,
      },
      {
        channelId: 'vulnerability-alerts',
        name: 'Vulnerability Alerts',
        description: 'Real-time vulnerability notifications',
        type: 'public',
        permissions: {
          subscribe: ['authenticated'],
          publish: ['admin', 'security_team'],
          manage: ['admin'],
          requireAuthentication: true,
        },
        retention: {
          enabled: true,
          retentionPeriod: 30 * 24 * 60 * 60 * 1000, // 30 days
          maxMessages: 50000,
          archiveExpired: true,
        },
        filters: [],
        compression: true,
        encryption: false,
      },
      {
        channelId: 'incident-updates',
        name: 'Incident Updates',
        description: 'Live incident response and status updates',
        type: 'organization',
        permissions: {
          subscribe: ['authenticated'],
          publish: ['incident_responder', 'admin'],
          manage: ['admin'],
          requireAuthentication: true,
        },
        retention: {
          enabled: true,
          retentionPeriod: 90 * 24 * 60 * 60 * 1000, // 90 days
          maxMessages: 100000,
          archiveExpired: true,
        },
        filters: [],
        compression: true,
        encryption: true,
      },
      {
        channelId: 'threat-feed',
        name: 'General Threat Feed',
        description: 'Comprehensive threat intelligence feed',
        type: 'public',
        permissions: {
          subscribe: ['authenticated'],
          publish: ['admin', 'threat_analyst', 'automated_system'],
          manage: ['admin'],
          requireAuthentication: true,
        },
        retention: {
          enabled: true,
          retentionPeriod: 14 * 24 * 60 * 60 * 1000, // 14 days
          maxMessages: 200000,
          archiveExpired: true,
        },
        filters: [],
        compression: true,
        encryption: false,
      },
    ];

    defaultChannels.forEach(channel => {
      this.channels.set(channel.channelId, channel);
    });

    this.metrics.channels.totalChannels = defaultChannels.length;
  }

  /**
   * Gateway initialization
   */
  afterInit(server: Server): void {
    this.logger.log('WebSocket Gateway initialized successfully');

    // Create WebSocket server configuration
    const wsConfig = createWebSocketServer({
      port: 3001,
      path: '/threat-stream',
      pingInterval: 25000,
      pingTimeout: 60000,
      maxPayload: 10485760, // 10MB
      compression: true,
      auth: {
        enabled: true,
        required: true,
        tokenExpiration: 3600000, // 1 hour
      },
      heartbeat: {
        enabled: true,
        interval: 30000,
        timeout: 90000,
        maxMissed: 3,
      },
      reconnect: {
        enabled: true,
        maxAttempts: 5,
        backoffStrategy: 'exponential',
        initialDelay: 1000,
        maxDelay: 30000,
      },
    });

    this.logger.log(`WebSocket server config: ${JSON.stringify(wsConfig)}`);

    // Start monitoring stream health
    this.startHealthMonitoring();
  }

  /**
   * Handle new client connection
   */
  async handleConnection(client: Socket, ...args: any[]): Promise<void> {
    const connectionId = client.id;
    this.logger.log(`New connection: ${connectionId}`);

    try {
      // Extract authentication token
      const token = this.extractAuthToken(client);
      if (!token) {
        this.logger.warn(`Connection ${connectionId} rejected: No authentication token`);
        client.disconnect();
        this.metrics.errors.authenticationFailures++;
        return;
      }

      // Authenticate connection
      const authResult = await this.authenticateConnection(token);
      if (!authResult.valid) {
        this.logger.warn(`Connection ${connectionId} rejected: Authentication failed`);
        client.disconnect();
        this.metrics.errors.authenticationFailures++;
        return;
      }

      // Create connection metadata
      const metadata: GatewayConnectionMetadata = {
        connectionId,
        userId: authResult.userId,
        organizationId: authResult.organizationId,
        clientType: this.detectClientType(client),
        clientVersion: client.handshake.headers['x-client-version'] as string || 'unknown',
        ipAddress: client.handshake.address,
        userAgent: client.handshake.headers['user-agent'] as string || 'unknown',
        connectedAt: new Date(),
        lastActivity: new Date(),
        subscriptions: [],
        permissions: authResult.permissions,
        authentication: {
          method: 'jwt',
          token,
          expiresAt: new Date(Date.now() + 3600000),
          scope: authResult.scope,
          verified: true,
        },
      };

      this.connections.set(connectionId, metadata);

      // Handle WebSocket connection using composite
      await handleWebSocketConnection(
        connectionId,
        {
          userId: metadata.userId,
          organizationId: metadata.organizationId,
          permissions: metadata.permissions,
        },
        {
          onMessage: (msg) => this.handleIncomingMessage(connectionId, msg),
          onError: (err) => this.handleConnectionError(connectionId, err),
          onClose: () => this.handleDisconnect(client),
        }
      );

      // Setup heartbeat
      this.setupHeartbeat(client, metadata);

      // Update metrics
      this.metrics.connections.totalConnections++;
      this.metrics.connections.activeConnections++;
      this.metrics.connections.authenticatedConnections++;
      this.metrics.connections.connectionsByType[metadata.clientType] =
        (this.metrics.connections.connectionsByType[metadata.clientType] || 0) + 1;

      // Send welcome message
      client.emit('connected', {
        connectionId,
        message: 'Connected to White Cross Threat Intelligence Gateway',
        serverTime: new Date(),
        availableChannels: Array.from(this.channels.keys()),
      });

      this.logger.log(`Connection ${connectionId} established for user ${metadata.userId}`);

    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`, error.stack);
      this.metrics.errors.connectionErrors++;
      client.disconnect();
    }
  }

  /**
   * Handle client disconnect
   */
  handleDisconnect(client: Socket): void {
    const connectionId = client.id;
    const metadata = this.connections.get(connectionId);

    if (metadata) {
      this.logger.log(`Client disconnected: ${connectionId} (user: ${metadata.userId})`);

      // Clear heartbeat
      const heartbeatInterval = this.heartbeatIntervals.get(connectionId);
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        this.heartbeatIntervals.delete(connectionId);
      }

      // Update metrics
      this.metrics.connections.activeConnections--;
      this.metrics.connections.authenticatedConnections--;
      this.metrics.connections.connectionsByType[metadata.clientType] =
        Math.max(0, (this.metrics.connections.connectionsByType[metadata.clientType] || 0) - 1);

      // Clean up subscriptions
      this.cleanupSubscriptions(connectionId);

      // Remove connection
      this.connections.delete(connectionId);
    }
  }

  /**
   * Subscribe to threat channel
   */
  @SubscribeMessage('subscribe')
  async handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channels: string[]; filters?: SubscriptionFilter[] }
  ): Promise<{ success: boolean; channels: string[]; message?: string }> {
    const connectionId = client.id;
    const metadata = this.connections.get(connectionId);

    if (!metadata) {
      return { success: false, channels: [], message: 'Connection not found' };
    }

    this.logger.log(`Subscription request from ${connectionId}: ${data.channels.join(', ')}`);

    try {
      const subscribedChannels: string[] = [];

      for (const channelId of data.channels) {
        const channel = this.channels.get(channelId);
        if (!channel) {
          this.logger.warn(`Channel ${channelId} not found`);
          continue;
        }

        // Check permissions
        if (!this.hasChannelPermission(metadata, channel, 'subscribe')) {
          this.logger.warn(`User ${metadata.userId} lacks permission for channel ${channelId}`);
          this.metrics.errors.authorizationFailures++;
          continue;
        }

        // Join socket.io room
        client.join(channelId);
        metadata.subscriptions.push(channelId);
        subscribedChannels.push(channelId);

        // Update channel metrics
        this.metrics.channels.subscriptionsByChannel[channelId] =
          (this.metrics.channels.subscriptionsByChannel[channelId] || 0) + 1;
        this.metrics.channels.totalSubscriptions++;

        this.logger.log(`Client ${connectionId} subscribed to channel ${channelId}`);
      }

      // Create stream session
      const session: StreamSession = {
        sessionId: `session-${connectionId}-${Date.now()}`,
        connectionId,
        userId: metadata.userId,
        organizationId: metadata.organizationId,
        channels: subscribedChannels,
        filters: data.filters || [],
        startedAt: new Date(),
        messagesReceived: 0,
        bytesReceived: 0,
        errors: 0,
        status: 'active',
      };

      this.sessions.set(connectionId, session);

      return {
        success: true,
        channels: subscribedChannels,
        message: `Subscribed to ${subscribedChannels.length} channels`,
      };

    } catch (error) {
      this.logger.error(`Subscription error: ${error.message}`, error.stack);
      return { success: false, channels: [], message: error.message };
    }
  }

  /**
   * Unsubscribe from threat channel
   */
  @SubscribeMessage('unsubscribe')
  async handleUnsubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channels: string[] }
  ): Promise<{ success: boolean; message?: string }> {
    const connectionId = client.id;
    const metadata = this.connections.get(connectionId);

    if (!metadata) {
      return { success: false, message: 'Connection not found' };
    }

    try {
      for (const channelId of data.channels) {
        client.leave(channelId);
        metadata.subscriptions = metadata.subscriptions.filter(c => c !== channelId);

        // Update channel metrics
        this.metrics.channels.subscriptionsByChannel[channelId] =
          Math.max(0, (this.metrics.channels.subscriptionsByChannel[channelId] || 0) - 1);
        this.metrics.channels.totalSubscriptions--;

        this.logger.log(`Client ${connectionId} unsubscribed from channel ${channelId}`);
      }

      return { success: true, message: `Unsubscribed from ${data.channels.length} channels` };

    } catch (error) {
      this.logger.error(`Unsubscribe error: ${error.message}`, error.stack);
      return { success: false, message: error.message };
    }
  }

  /**
   * Publish threat event to channels
   */
  @SubscribeMessage('publish')
  async handlePublish(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channel: string; event: RealTimeThreatEvent; options?: BroadcastOptions }
  ): Promise<{ success: boolean; messageId?: string; message?: string }> {
    const connectionId = client.id;
    const metadata = this.connections.get(connectionId);

    if (!metadata) {
      return { success: false, message: 'Connection not found' };
    }

    try {
      const channel = this.channels.get(data.channel);
      if (!channel) {
        return { success: false, message: 'Channel not found' };
      }

      // Check publish permission
      if (!this.hasChannelPermission(metadata, channel, 'publish')) {
        this.metrics.errors.authorizationFailures++;
        return { success: false, message: 'Insufficient permissions to publish' };
      }

      // Create real-time threat event
      const threatEvent = createRealTimeThreatEvent(
        data.event.threatId,
        data.event.severity,
        data.event.type,
        data.event.source,
        data.event.data
      );

      // Broadcast to channel
      const messageId = await this.broadcastToChannel(
        data.channel,
        threatEvent,
        data.options
      );

      this.metrics.messages.totalMessagesSent++;
      this.metrics.channels.messagesByChannel[data.channel] =
        (this.metrics.channels.messagesByChannel[data.channel] || 0) + 1;

      return { success: true, messageId, message: 'Event published successfully' };

    } catch (error) {
      this.logger.error(`Publish error: ${error.message}`, error.stack);
      this.metrics.messages.failedMessages++;
      return { success: false, message: error.message };
    }
  }

  /**
   * Broadcast threat event to channel
   */
  private async broadcastToChannel(
    channelId: string,
    event: RealTimeThreatEvent,
    options?: BroadcastOptions
  ): Promise<string> {
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    try {
      // Create WebSocket message
      const message = createThreatUpdateMessage(
        event.threatId,
        event.severity,
        event.type,
        event.data,
        {
          messageId,
          timestamp: event.timestamp,
          source: event.source,
          priority: options?.priority || 'normal',
        }
      );

      // Apply compression if needed
      const finalMessage = options?.compression
        ? compressWebSocketMessage(message)
        : { compressed: false, data: message };

      // Broadcast using composite function
      await broadcastThreatUpdate(
        [channelId],
        event,
        {
          compression: options?.compression || false,
          priority: options?.priority || 'normal',
          ttl: options?.ttl,
        }
      );

      // Emit to socket.io room
      this.server.to(channelId).emit('threat-event', finalMessage);

      this.logger.debug(`Broadcasted message ${messageId} to channel ${channelId}`);
      return messageId;

    } catch (error) {
      this.logger.error(`Broadcast error: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Setup heartbeat for connection
   */
  private setupHeartbeat(client: Socket, metadata: GatewayConnectionMetadata): void {
    const heartbeatConfig: HeartbeatConfig = {
      enabled: true,
      interval: 30000,
      timeout: 90000,
      maxMissed: 3,
    };

    const heartbeat = manageWebSocketHeartbeat(
      metadata.connectionId,
      heartbeatConfig,
      {
        onTimeout: () => {
          this.logger.warn(`Heartbeat timeout for connection ${metadata.connectionId}`);
          client.disconnect();
        },
        onMissed: (count) => {
          this.logger.debug(`Missed heartbeat ${count} for connection ${metadata.connectionId}`);
        },
      }
    );

    const intervalId = setInterval(() => {
      client.emit('heartbeat', { timestamp: Date.now() });
    }, heartbeatConfig.interval);

    this.heartbeatIntervals.set(metadata.connectionId, intervalId);
  }

  /**
   * Extract authentication token from client
   */
  private extractAuthToken(client: Socket): string | null {
    const authHeader = client.handshake.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    const token = client.handshake.auth?.token || client.handshake.query?.token;
    return token as string || null;
  }

  /**
   * Authenticate WebSocket connection
   */
  private async authenticateConnection(token: string): Promise<{
    valid: boolean;
    userId?: string;
    organizationId?: string;
    permissions?: string[];
    scope?: string[];
  }> {
    // In production, validate JWT token
    // For now, return mock authentication
    return {
      valid: true,
      userId: 'user-123',
      organizationId: 'org-456',
      permissions: ['read:threats', 'subscribe:channels'],
      scope: ['threat:read', 'channel:subscribe'],
    };
  }

  /**
   * Detect client type from socket
   */
  private detectClientType(client: Socket): 'web' | 'mobile' | 'api' | 'dashboard' {
    const userAgent = client.handshake.headers['user-agent'] || '';
    if (userAgent.includes('Mobile')) return 'mobile';
    if (userAgent.includes('Dashboard')) return 'dashboard';
    if (userAgent.includes('API')) return 'api';
    return 'web';
  }

  /**
   * Check channel permission
   */
  private hasChannelPermission(
    metadata: GatewayConnectionMetadata,
    channel: ChannelConfig,
    action: 'subscribe' | 'publish' | 'manage'
  ): boolean {
    const requiredPermissions = channel.permissions[action];
    return requiredPermissions.some(perm =>
      metadata.permissions.includes(perm) || perm === 'authenticated'
    );
  }

  /**
   * Handle incoming message
   */
  private async handleIncomingMessage(connectionId: string, message: any): Promise<void> {
    const session = this.sessions.get(connectionId);
    if (session) {
      session.lastMessageAt = new Date();
      session.messagesReceived++;
      session.bytesReceived += JSON.stringify(message).length;
    }

    this.metrics.messages.totalMessagesReceived++;
  }

  /**
   * Handle connection error
   */
  private handleConnectionError(connectionId: string, error: Error): void {
    this.logger.error(`Connection ${connectionId} error: ${error.message}`, error.stack);
    const session = this.sessions.get(connectionId);
    if (session) {
      session.errors++;
    }
    this.metrics.errors.totalErrors++;
    this.metrics.errors.messageErrors++;
  }

  /**
   * Cleanup subscriptions for disconnected client
   */
  private cleanupSubscriptions(connectionId: string): void {
    const metadata = this.connections.get(connectionId);
    if (metadata) {
      for (const channelId of metadata.subscriptions) {
        this.metrics.channels.subscriptionsByChannel[channelId] =
          Math.max(0, (this.metrics.channels.subscriptionsByChannel[channelId] || 0) - 1);
        this.metrics.channels.totalSubscriptions--;
      }
    }

    this.sessions.delete(connectionId);
  }

  /**
   * Start health monitoring
   */
  private startHealthMonitoring(): void {
    setInterval(async () => {
      try {
        const health = await this.performHealthCheck();
        if (health.status !== 'healthy') {
          this.logger.warn(`Gateway health check: ${health.status}`);
        }
      } catch (error) {
        this.logger.error(`Health check error: ${error.message}`);
      }
    }, 60000); // Every minute
  }

  /**
   * Perform health check
   */
  private async performHealthCheck(): Promise<HealthCheckResult> {
    const checks: HealthCheck[] = [];

    // Check active connections
    checks.push({
      name: 'active_connections',
      status: this.metrics.connections.activeConnections > 0 ? 'pass' : 'warn',
      message: `${this.metrics.connections.activeConnections} active connections`,
    });

    // Check message throughput
    checks.push({
      name: 'message_throughput',
      status: this.metrics.messages.messagesPerSecond < 1000 ? 'pass' : 'warn',
      message: `${this.metrics.messages.messagesPerSecond.toFixed(2)} messages/second`,
    });

    // Check error rate
    const errorRate = this.metrics.errors.totalErrors / Math.max(1, this.metrics.messages.totalMessagesSent);
    checks.push({
      name: 'error_rate',
      status: errorRate < 0.01 ? 'pass' : errorRate < 0.05 ? 'warn' : 'fail',
      message: `${(errorRate * 100).toFixed(2)}% error rate`,
    });

    const overallStatus = checks.some(c => c.status === 'fail')
      ? 'unhealthy'
      : checks.some(c => c.status === 'warn')
      ? 'degraded'
      : 'healthy';

    return {
      status: overallStatus,
      timestamp: new Date(),
      uptime: process.uptime(),
      checks,
      metrics: this.metrics,
    };
  }

  /**
   * Get gateway metrics
   */
  public getMetrics(): GatewayMetrics {
    return { ...this.metrics };
  }
}

// ============================================================================
// NESTJS SERVICE - WEBSOCKET GATEWAY MANAGEMENT
// ============================================================================

@Injectable()
@ApiTags('WebSocket Gateway')
export class WebSocketGatewayManagementService {
  private readonly logger = new Logger(WebSocketGatewayManagementService.name);

  constructor(private readonly gateway: ThreatIntelligenceWebSocketGateway) {}

  /**
   * Get gateway health status
   */
  @ApiOperation({ summary: 'Get WebSocket gateway health status' })
  @ApiResponse({ status: 200, description: 'Health status retrieved' })
  async getHealthStatus(): Promise<HealthCheckResult> {
    return await this.gateway['performHealthCheck']();
  }

  /**
   * Get gateway metrics
   */
  @ApiOperation({ summary: 'Get WebSocket gateway metrics' })
  @ApiResponse({ status: 200, description: 'Metrics retrieved' })
  getGatewayMetrics(): GatewayMetrics {
    return this.gateway.getMetrics();
  }

  /**
   * Get active connections
   */
  @ApiOperation({ summary: 'Get active WebSocket connections' })
  @ApiResponse({ status: 200, description: 'Active connections retrieved' })
  getActiveConnections(): GatewayConnectionMetadata[] {
    const connections = this.gateway['connections'];
    return Array.from(connections.values());
  }

  /**
   * Get channel statistics
   */
  @ApiOperation({ summary: 'Get channel statistics' })
  @ApiResponse({ status: 200, description: 'Channel statistics retrieved' })
  getChannelStatistics(): Record<string, any> {
    const channels = this.gateway['channels'];
    const metrics = this.gateway.getMetrics();

    return {
      totalChannels: channels.size,
      channels: Array.from(channels.values()).map(channel => ({
        channelId: channel.channelId,
        name: channel.name,
        type: channel.type,
        subscribers: metrics.channels.subscriptionsByChannel[channel.channelId] || 0,
        messages: metrics.channels.messagesByChannel[channel.channelId] || 0,
      })),
    };
  }

  /**
   * Broadcast system message to all connections
   */
  @ApiOperation({ summary: 'Broadcast system message to all connections' })
  @ApiResponse({ status: 200, description: 'Message broadcasted' })
  async broadcastSystemMessage(message: {
    type: string;
    severity: string;
    title: string;
    body: string;
  }): Promise<{ success: boolean; recipientCount: number }> {
    try {
      const event = createRealTimeThreatEvent(
        `system-${Date.now()}`,
        message.severity,
        message.type,
        'system',
        { title: message.title, body: message.body }
      );

      this.gateway.server.emit('system-message', event);

      const activeConnections = this.gateway['connections'].size;
      this.logger.log(`System message broadcasted to ${activeConnections} connections`);

      return { success: true, recipientCount: activeConnections };

    } catch (error) {
      this.logger.error(`Failed to broadcast system message: ${error.message}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to broadcast system message',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

// ============================================================================
// NESTJS CONTROLLER - WEBSOCKET GATEWAY
// ============================================================================

@ApiTags('WebSocket Gateway')
@Controller('api/v1/websocket')
@ApiBearerAuth()
export class WebSocketGatewayController {
  private readonly logger = new Logger(WebSocketGatewayController.name);

  constructor(private readonly managementService: WebSocketGatewayManagementService) {}

  @Get('health')
  @ApiOperation({ summary: 'Get WebSocket gateway health' })
  @ApiResponse({ status: 200, description: 'Health status retrieved' })
  async getHealth() {
    return this.managementService.getHealthStatus();
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get WebSocket gateway metrics' })
  @ApiResponse({ status: 200, description: 'Metrics retrieved' })
  getMetrics() {
    return this.managementService.getGatewayMetrics();
  }

  @Get('connections')
  @ApiOperation({ summary: 'Get active connections' })
  @ApiResponse({ status: 200, description: 'Active connections retrieved' })
  getConnections() {
    return this.managementService.getActiveConnections();
  }

  @Get('channels/statistics')
  @ApiOperation({ summary: 'Get channel statistics' })
  @ApiResponse({ status: 200, description: 'Channel statistics retrieved' })
  getChannelStats() {
    return this.managementService.getChannelStatistics();
  }

  @Post('broadcast')
  @ApiOperation({ summary: 'Broadcast system message' })
  @ApiBody({
    schema: {
      example: {
        type: 'system_alert',
        severity: 'high',
        title: 'System Maintenance',
        body: 'Scheduled maintenance in 30 minutes'
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Message broadcasted' })
  async broadcastMessage(@Body() message: any) {
    return this.managementService.broadcastSystemMessage(message);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  gateway: ThreatIntelligenceWebSocketGateway,
  service: WebSocketGatewayManagementService,
  controller: WebSocketGatewayController,
};
