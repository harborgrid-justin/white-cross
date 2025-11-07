/**
 * WebSocket Service
 *
 * Provides high-level methods for broadcasting real-time messages to WebSocket clients.
 * Abstracts the complexity of Socket.io server interactions behind a clean service API.
 *
 * Key Features:
 * - Room-based message broadcasting
 * - Type-safe message payloads with automatic timestamping
 * - Real-time messaging methods for conversations
 * - Typing indicators and read receipts
 * - Message delivery confirmations
 * - Presence tracking and updates
 * - Domain-specific broadcast methods (alerts, notifications, reminders)
 * - Graceful degradation when server is not initialized
 * - Comprehensive logging for monitoring and debugging
 *
 * Broadcasting Methods:
 * - broadcastToRoom: Send to a specific room
 * - broadcastToRooms: Send to multiple rooms
 * - broadcastToSchool: Send to a school's room
 * - broadcastToUser: Send to a user's room
 * - broadcastToStudent: Send to a student's room
 * - broadcastEmergencyAlert: Critical alerts to organization
 * - broadcastMedicationReminder: Medication reminders to organization
 * - broadcastStudentHealthAlert: Student health alerts to organization
 * - sendUserNotification: Notifications to specific user
 *
 * Messaging Methods:
 * - sendMessageToConversation: Send message to conversation room
 * - sendMessageToUsers: Send direct message to specific users
 * - broadcastTypingIndicator: Broadcast typing status to conversation
 * - broadcastReadReceipt: Broadcast read receipt to conversation
 * - broadcastMessageDelivery: Broadcast delivery confirmation
 * - updateUserPresence: Update and broadcast user presence
 *
 * @class WebSocketService
 */
import { Injectable, Logger, OnModuleDestroy, Optional } from '@nestjs/common';
import { WebSocketGateway } from './websocket.gateway';
import { AppConfigService } from '@/config';
import {
  BroadcastMessageDto,
  MessageDeliveryDto,
  MessageEventDto,
  ReadReceiptDto,
  TypingIndicatorDto,
} from './dto';

/**
 * Alert data structure
 */
interface AlertData {
  id?: string;
  message: string;
  severity?: string;
  timestamp?: string;
  [key: string]: unknown;
}

/**
 * Notification data structure
 */
interface NotificationData {
  id?: string;
  title?: string;
  message: string;
  type?: string;
  [key: string]: unknown;
}

/**
 * Reminder data structure
 */
interface ReminderData {
  id?: string;
  message: string;
  dueDate?: string;
  [key: string]: unknown;
}

@Injectable()
export class WebSocketService implements OnModuleDestroy {
  private readonly logger = new Logger(WebSocketService.name);

  constructor(
    private readonly websocketGateway: WebSocketGateway,
    private readonly config: AppConfigService,
  ) {
    this.logger.log('WebSocketService initialized');
  }

  /**
   * Cleanup resources on module destroy
   * Implements graceful shutdown for WebSocket connections
   */
  async onModuleDestroy() {
    this.logger.log('WebSocketService shutting down - cleaning up resources');

    // Get current connection count for logging
    const connectedSockets = this.getConnectedSocketsCount();
    if (connectedSockets > 0) {
      this.logger.log(`Disconnecting ${connectedSockets} active WebSocket connections`);

      // Notify all connected clients about server shutdown if enabled
      if (this.config.get<boolean>('websocket.notifyOnShutdown', true)) {
        const server = this.getServer();
        if (server) {
          server.emit('server:shutdown', {
            message: 'Server is shutting down',
            timestamp: new Date().toISOString(),
          });
        }
      }
    }

    this.logger.log('WebSocketService destroyed, resources cleaned up');
  }

  /**
   * Broadcasts a message to a specific room
   *
   * @param room - The room identifier (e.g., 'school:123', 'user:456')
   * @param event - The event name to emit
   * @param data - The data payload to send
   * @throws Error if broadcast fails
   */
  async broadcastToRoom(room: string, event: string, data: unknown): Promise<void> {
    try {
      const server = this.getServer();

      if (!server) {
        this.logger.warn('WebSocket server not initialized, cannot broadcast message');
        return;
      }

      const message = new BroadcastMessageDto(data as any);

      server.to(room).emit(event, message);

      this.logger.debug(`Broadcasted ${event} to room ${room}`, {
        event,
        room,
        dataKeys: Object.keys(data as any),
      });
    } catch (error) {
      this.logger.error(`Failed to broadcast to room ${room}`, error);
      throw error;
    }
  }

  /**
   * Broadcasts an emergency alert to an organization
   *
   * @param organizationId - The organization ID
   * @param alert - The alert data
   * @throws Error if broadcast fails
   */
  async broadcastEmergencyAlert(organizationId: string, alert: AlertData): Promise<void> {
    try {
      const server = this.getServer();

      if (!server) {
        this.logger.warn('WebSocket server not initialized, cannot broadcast alert');
        return;
      }

      const room = `org:${organizationId}`;
      const message = new BroadcastMessageDto({
        ...alert,
        priority: 'CRITICAL',
      });

      server.to(room).emit('emergency:alert', message);

      this.logger.log(`Emergency alert broadcasted to organization ${organizationId}`, {
        alertId: alert.id,
        severity: alert.severity,
      });
    } catch (error) {
      this.logger.error(
        `Failed to broadcast emergency alert to organization ${organizationId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Sends a notification to a specific user
   *
   * @param userId - The user ID
   * @param notification - The notification data
   * @throws Error if send fails
   */
  async sendUserNotification(userId: string, notification: NotificationData): Promise<void> {
    try {
      const server = this.getServer();

      if (!server) {
        this.logger.warn('WebSocket server not initialized, cannot send notification');
        return;
      }

      const room = `user:${userId}`;
      const message = new BroadcastMessageDto(notification as any);

      server.to(room).emit('health:notification', message);

      this.logger.log(`Notification sent to user ${userId}`, {
        notificationId: notification.id,
        type: notification.type,
      });
    } catch (error) {
      this.logger.error(`Failed to send notification to user ${userId}`, error);
      throw error;
    }
  }

  /**
   * Broadcasts a medication reminder to an organization
   *
   * @param organizationId - The organization ID
   * @param reminder - The reminder data
   * @throws Error if broadcast fails
   */
  async broadcastMedicationReminder(organizationId: string, reminder: ReminderData): Promise<void> {
    try {
      const server = this.getServer();

      if (!server) {
        this.logger.warn('WebSocket server not initialized, cannot broadcast reminder');
        return;
      }

      const room = `org:${organizationId}`;
      const message = new BroadcastMessageDto(reminder as any);

      server.to(room).emit('medication:reminder', message);

      this.logger.log(`Medication reminder broadcasted to organization ${organizationId}`, {
        medicationId: reminder.medicationId,
        studentId: reminder.studentId,
      });
    } catch (error) {
      this.logger.error(
        `Failed to broadcast medication reminder to organization ${organizationId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Broadcasts a student health alert to an organization
   *
   * @param organizationId - The organization ID
   * @param alert - The alert data
   * @throws Error if broadcast fails
   */
  async broadcastStudentHealthAlert(organizationId: string, alert: AlertData): Promise<void> {
    try {
      const server = this.getServer();

      if (!server) {
        this.logger.warn('WebSocket server not initialized, cannot broadcast alert');
        return;
      }

      const room = `org:${organizationId}`;
      const message = new BroadcastMessageDto(alert as any);

      server.to(room).emit('student:health:alert', message);

      this.logger.log(`Student health alert broadcasted to organization ${organizationId}`, {
        studentId: alert.studentId,
        alertType: alert.type,
      });
    } catch (error) {
      this.logger.error(
        `Failed to broadcast student health alert to organization ${organizationId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Broadcasts a message to multiple rooms
   *
   * @param rooms - Array of room identifiers
   * @param event - The event name to emit
   * @param data - The data payload to send
   * @throws Error if broadcast fails
   */
  async broadcastToRooms(rooms: string[], event: string, data: unknown): Promise<void> {
    try {
      const server = this.getServer();

      if (!server) {
        this.logger.warn('WebSocket server not initialized, cannot broadcast message');
        return;
      }

      const message = new BroadcastMessageDto(data as Record<string, any>);

      for (const room of rooms) {
        server.to(room).emit(event, message);
      }

      this.logger.debug(`Broadcasted ${event} to ${rooms.length} rooms`, {
        event,
        rooms,
        dataKeys: Object.keys(data as any),
      });
    } catch (error) {
      this.logger.error('Failed to broadcast to multiple rooms', error);
      throw error;
    }
  }

  /**
   * Gets the count of currently connected sockets
   *
   * @returns The number of connected sockets
   */
  getConnectedSocketsCount(): number {
    return this.websocketGateway.getConnectedSocketsCount();
  }

  /**
   * Checks if WebSocket server is initialized
   *
   * @returns True if initialized, false otherwise
   */
  isInitialized(): boolean {
    return this.websocketGateway.isInitialized();
  }

  /**
   * Broadcasts a generic alert to a school
   *
   * @param schoolId - The school ID
   * @param event - The event name
   * @param data - The alert data
   */
  async broadcastToSchool(schoolId: string, event: string, data: unknown): Promise<void> {
    await this.broadcastToRoom(`school:${schoolId}`, event, data);
  }

  /**
   * Broadcasts a generic alert to a user
   *
   * @param userId - The user ID
   * @param event - The event name
   * @param data - The alert data
   */
  async broadcastToUser(userId: string, event: string, data: unknown): Promise<void> {
    await this.broadcastToRoom(`user:${userId}`, event, data);
  }

  /**
   * Broadcasts a generic alert to a student's context
   *
   * @param studentId - The student ID
   * @param event - The event name
   * @param data - The alert data
   */
  async broadcastToStudent(studentId: string, event: string, data: unknown): Promise<void> {
    await this.broadcastToRoom(`student:${studentId}`, event, data);
  }

  /**
   * Sends a message to a conversation room
   * Broadcasts to all participants in the conversation
   *
   * @param conversationId - The conversation ID
   * @param message - The message event DTO
   * @throws Error if broadcast fails
   */
  async sendMessageToConversation(conversationId: string, message: MessageEventDto): Promise<void> {
    try {
      const server = this.getServer();

      if (!server) {
        this.logger.warn('WebSocket server not initialized, cannot send message');
        return;
      }

      const room = `conversation:${conversationId}`;
      server.to(room).emit('message:send', message.toPayload());

      this.logger.log(`Message sent to conversation ${conversationId}`, {
        messageId: message.messageId,
        senderId: message.senderId,
      });
    } catch (error) {
      this.logger.error(`Failed to send message to conversation ${conversationId}`, error);
      throw error;
    }
  }

  /**
   * Sends a direct message to specific users
   * Broadcasts to each user's personal room
   *
   * @param userIds - Array of user IDs to send to
   * @param message - The message event DTO
   * @throws Error if broadcast fails
   */
  async sendMessageToUsers(userIds: string[], message: MessageEventDto): Promise<void> {
    try {
      const server = this.getServer();

      if (!server) {
        this.logger.warn('WebSocket server not initialized, cannot send message');
        return;
      }

      // Send to each user's room
      for (const userId of userIds) {
        const room = `user:${userId}`;
        server.to(room).emit('message:send', message.toPayload());
      }

      this.logger.log(`Direct message sent to ${userIds.length} users`, {
        messageId: message.messageId,
        senderId: message.senderId,
        recipientCount: userIds.length,
      });
    } catch (error) {
      this.logger.error('Failed to send direct message', error);
      throw error;
    }
  }

  /**
   * Broadcasts a typing indicator to conversation participants
   *
   * @param conversationId - The conversation ID
   * @param typingIndicator - The typing indicator DTO
   * @throws Error if broadcast fails
   */
  async broadcastTypingIndicator(
    conversationId: string,
    typingIndicator: TypingIndicatorDto,
  ): Promise<void> {
    try {
      const server = this.getServer();

      if (!server) {
        this.logger.warn('WebSocket server not initialized, cannot broadcast typing indicator');
        return;
      }

      const room = `conversation:${conversationId}`;
      server.to(room).emit('message:typing', typingIndicator.toPayload());

      this.logger.debug(`Typing indicator broadcasted to conversation ${conversationId}`, {
        userId: typingIndicator.userId,
        isTyping: typingIndicator.isTyping,
      });
    } catch (error) {
      this.logger.error(
        `Failed to broadcast typing indicator to conversation ${conversationId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Broadcasts a read receipt to conversation participants
   *
   * @param conversationId - The conversation ID
   * @param readReceipt - The read receipt DTO
   * @throws Error if broadcast fails
   */
  async broadcastReadReceipt(conversationId: string, readReceipt: ReadReceiptDto): Promise<void> {
    try {
      const server = this.getServer();

      if (!server) {
        this.logger.warn('WebSocket server not initialized, cannot broadcast read receipt');
        return;
      }

      const room = `conversation:${conversationId}`;
      server.to(room).emit('message:read', readReceipt.toPayload());

      this.logger.log(`Read receipt broadcasted to conversation ${conversationId}`, {
        messageId: readReceipt.messageId,
        userId: readReceipt.userId,
      });
    } catch (error) {
      this.logger.error(
        `Failed to broadcast read receipt to conversation ${conversationId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Broadcasts a message delivery confirmation
   * Sends to the message sender's room
   *
   * @param senderId - The sender's user ID
   * @param delivery - The delivery confirmation DTO
   * @throws Error if broadcast fails
   */
  async broadcastMessageDelivery(senderId: string, delivery: MessageDeliveryDto): Promise<void> {
    try {
      const server = this.getServer();

      if (!server) {
        this.logger.warn('WebSocket server not initialized, cannot broadcast delivery');
        return;
      }

      const room = `user:${senderId}`;
      server.to(room).emit('message:delivered', delivery.toPayload());

      this.logger.debug(`Delivery confirmation sent to user ${senderId}`, {
        messageId: delivery.messageId,
        status: delivery.status,
      });
    } catch (error) {
      this.logger.error(`Failed to broadcast delivery confirmation to user ${senderId}`, error);
      throw error;
    }
  }

  /**
   * Updates and broadcasts user presence status
   * Broadcasts to the user's organization room
   *
   * @param userId - The user ID
   * @param organizationId - The organization ID
   * @param status - The presence status (online, offline, away)
   * @throws Error if broadcast fails
   */
  async updateUserPresence(
    userId: string,
    organizationId: string,
    status: 'online' | 'offline' | 'away',
  ): Promise<void> {
    try {
      const server = this.getServer();

      if (!server) {
        this.logger.warn('WebSocket server not initialized, cannot update presence');
        return;
      }

      const room = `org:${organizationId}`;
      server.to(room).emit('presence:update', {
        userId,
        status,
        timestamp: new Date().toISOString(),
      });

      this.logger.debug(`Presence update broadcasted for user ${userId}`, {
        status,
        organizationId,
      });
    } catch (error) {
      this.logger.error(`Failed to broadcast presence update for user ${userId}`, error);
      throw error;
    }
  }

  /**
   * Gets user presence status from the gateway
   *
   * @param userId - The user ID
   * @returns Presence status or null if not found
   */
  getUserPresence(userId: string): { status: string; lastSeen: string } | null {
    return this.websocketGateway.getUserPresence(userId);
  }

  /**
   * Gets the Socket.io server instance from the gateway
   * Provides defensive access with null checking
   *
   * @returns The Socket.io Server instance or null if not initialized
   */
  private getServer() {
    return this.websocketGateway?.server || null;
  }
}
