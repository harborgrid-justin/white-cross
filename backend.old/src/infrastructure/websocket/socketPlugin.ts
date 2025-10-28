/**
 * Socket.io Server Plugin for Hapi.js
 *
 * Provides real-time WebSocket communication for the White Cross platform.
 * Features:
 * - JWT authentication for WebSocket connections
 * - Room-based messaging for multi-tenant isolation
 * - Emergency alert broadcasting
 * - Health notification system
 * - Auto-reconnection support
 *
 * @module infrastructure/websocket/socketPlugin
 */

import { Server as HapiServer } from '@hapi/hapi';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';
import { logger } from '../../utils/logger';

/**
 * Socket.io authentication payload
 */
interface AuthPayload {
  userId: string;
  organizationId: string;
  role: string;
  email: string;
}

/**
 * Extended Socket with user data
 */
interface AuthenticatedSocket extends Socket {
  user?: AuthPayload;
}

/**
 * Socket.io server plugin for Hapi.js
 */
export class WebSocketPlugin {
  private io: SocketIOServer | null = null;
  private httpServer: any = null;

  /**
   * Register Socket.io with Hapi server
   */
  async register(server: HapiServer): Promise<void> {
    try {
      // Get the underlying HTTP server from Hapi
      this.httpServer = server.listener;

      // Create Socket.io server
      this.io = new SocketIOServer(this.httpServer, {
        cors: {
          origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
          credentials: true,
          methods: ['GET', 'POST']
        },
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        pingTimeout: 60000,
        pingInterval: 25000
      });

      // Authentication middleware
      this.io.use(this.authenticate.bind(this));

      // Connection handling
      this.io.on('connection', this.handleConnection.bind(this));

      logger.info('Socket.io server initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Socket.io server', error);
      throw error;
    }
  }

  /**
   * Authenticate WebSocket connection using JWT
   */
  private async authenticate(socket: AuthenticatedSocket, next: (err?: Error) => void): Promise<void> {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Authentication token required'));
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as AuthPayload;

      // Attach user data to socket
      socket.user = decoded;

      logger.info(`WebSocket authenticated: userId=${decoded.userId}, org=${decoded.organizationId}`);
      next();
    } catch (error) {
      logger.error('WebSocket authentication failed', error);
      next(new Error('Authentication failed'));
    }
  }

  /**
   * Handle new WebSocket connection
   */
  private handleConnection(socket: AuthenticatedSocket): void {
    const user = socket.user;

    if (!user) {
      socket.disconnect();
      return;
    }

    logger.info(`WebSocket connected: ${socket.id} (user: ${user.userId})`);

    // Join organization room for multi-tenant isolation
    const orgRoom = `org:${user.organizationId}`;
    socket.join(orgRoom);
    socket.join(`user:${user.userId}`);

    logger.info(`Socket ${socket.id} joined rooms: ${orgRoom}, user:${user.userId}`);

    // Send connection confirmation
    socket.emit('connection:confirmed', {
      socketId: socket.id,
      userId: user.userId,
      organizationId: user.organizationId,
      connectedAt: new Date().toISOString()
    });

    // Register event handlers
    this.registerEventHandlers(socket);

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      logger.info(`WebSocket disconnected: ${socket.id} (reason: ${reason})`);
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error(`WebSocket error for ${socket.id}:`, error);
    });
  }

  /**
   * Register event handlers for the socket
   */
  private registerEventHandlers(socket: AuthenticatedSocket): void {
    const user = socket.user!;

    // Ping/pong for connection health
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: new Date().toISOString() });
    });

    // Subscribe to specific notification channels
    socket.on('subscribe', (channel: string) => {
      // Ensure users can only subscribe to their organization's channels
      if (channel.startsWith(`org:${user.organizationId}:`)) {
        socket.join(channel);
        logger.info(`Socket ${socket.id} subscribed to ${channel}`);
        socket.emit('subscribed', { channel });
      } else {
        logger.warn(`Socket ${socket.id} attempted to subscribe to unauthorized channel: ${channel}`);
        socket.emit('error', { message: 'Unauthorized channel subscription' });
      }
    });

    // Unsubscribe from channels
    socket.on('unsubscribe', (channel: string) => {
      socket.leave(channel);
      logger.info(`Socket ${socket.id} unsubscribed from ${channel}`);
      socket.emit('unsubscribed', { channel });
    });

    // Mark notification as read
    socket.on('notification:read', (notificationId: string) => {
      logger.info(`Notification ${notificationId} marked as read by user ${user.userId}`);
      // Broadcast to other user sessions that notification was read
      socket.to(`user:${user.userId}`).emit('notification:read', { notificationId });
    });
  }

  /**
   * Broadcast emergency alert to organization
   */
  broadcastEmergencyAlert(organizationId: string, alert: any): void {
    if (!this.io) {
      logger.error('Socket.io not initialized');
      return;
    }

    const room = `org:${organizationId}`;
    this.io.to(room).emit('emergency:alert', {
      ...alert,
      timestamp: new Date().toISOString(),
      priority: 'CRITICAL'
    });

    logger.info(`Emergency alert broadcasted to ${room}`, { alertId: alert.id });
  }

  /**
   * Send health notification to specific user
   */
  sendHealthNotification(userId: string, notification: any): void {
    if (!this.io) {
      logger.error('Socket.io not initialized');
      return;
    }

    this.io.to(`user:${userId}`).emit('health:notification', {
      ...notification,
      timestamp: new Date().toISOString()
    });

    logger.info(`Health notification sent to user ${userId}`, { notificationId: notification.id });
  }

  /**
   * Broadcast medication reminder to organization
   */
  broadcastMedicationReminder(organizationId: string, reminder: any): void {
    if (!this.io) {
      logger.error('Socket.io not initialized');
      return;
    }

    const room = `org:${organizationId}`;
    this.io.to(room).emit('medication:reminder', {
      ...reminder,
      timestamp: new Date().toISOString()
    });

    logger.info(`Medication reminder broadcasted to ${room}`);
  }

  /**
   * Broadcast student health alert
   */
  broadcastStudentHealthAlert(organizationId: string, alert: any): void {
    if (!this.io) {
      logger.error('Socket.io not initialized');
      return;
    }

    const room = `org:${organizationId}`;
    this.io.to(room).emit('student:health:alert', {
      ...alert,
      timestamp: new Date().toISOString()
    });

    logger.info(`Student health alert broadcasted to ${room}`, { studentId: alert.studentId });
  }

  /**
   * Get connected socket count
   */
  getConnectedSocketsCount(): number {
    return this.io?.sockets.sockets.size || 0;
  }

  /**
   * Get Socket.io server instance
   */
  getIO(): SocketIOServer | null {
    return this.io;
  }

  /**
   * Gracefully shutdown Socket.io server
   */
  async shutdown(): Promise<void> {
    if (this.io) {
      logger.info('Shutting down Socket.io server...');

      // Notify all connected clients
      this.io.emit('server:shutdown', {
        message: 'Server is shutting down',
        timestamp: new Date().toISOString()
      });

      // Close all connections
      this.io.close();
      this.io = null;

      logger.info('Socket.io server shutdown complete');
    }
  }
}

// Singleton instance
let webSocketPlugin: WebSocketPlugin | null = null;

/**
 * Get or create WebSocket plugin instance
 */
export function getWebSocketPlugin(): WebSocketPlugin {
  if (!webSocketPlugin) {
    webSocketPlugin = new WebSocketPlugin();
  }
  return webSocketPlugin;
}

/**
 * Hapi plugin registration
 */
export const webSocketPluginDefinition = {
  name: 'websocket',
  version: '1.0.0',
  register: async (server: HapiServer) => {
    const plugin = getWebSocketPlugin();
    await plugin.register(server);

    // Expose plugin methods to server
    server.decorate('server', 'websocket', plugin);
  }
};

export default webSocketPluginDefinition;
