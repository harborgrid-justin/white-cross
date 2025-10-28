/**
 * WebSocket Service
 *
 * Provides high-level methods for broadcasting real-time messages to WebSocket clients.
 * Abstracts the complexity of Socket.io server interactions behind a clean service API.
 *
 * Key Features:
 * - Room-based message broadcasting
 * - Type-safe message payloads with automatic timestamping
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
 * @class WebSocketService
 */
import { Injectable, Logger } from '@nestjs/common';
import { WebSocketGateway } from './websocket.gateway';
import { BroadcastMessageDto } from './dto';

@Injectable()
export class WebSocketService {
  private readonly logger = new Logger(WebSocketService.name);

  constructor(private readonly websocketGateway: WebSocketGateway) {}

  /**
   * Broadcasts a message to a specific room
   *
   * @param room - The room identifier (e.g., 'school:123', 'user:456')
   * @param event - The event name to emit
   * @param data - The data payload to send
   * @throws Error if broadcast fails
   */
  async broadcastToRoom(room: string, event: string, data: any): Promise<void> {
    try {
      const server = this.getServer();

      if (!server) {
        this.logger.warn('WebSocket server not initialized, cannot broadcast message');
        return;
      }

      const message = new BroadcastMessageDto(data);

      server.to(room).emit(event, message);

      this.logger.debug(`Broadcasted ${event} to room ${room}`, {
        event,
        room,
        dataKeys: Object.keys(data),
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
  async broadcastEmergencyAlert(organizationId: string, alert: any): Promise<void> {
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

      this.logger.info(`Emergency alert broadcasted to organization ${organizationId}`, {
        alertId: alert.id,
        severity: alert.severity,
      });
    } catch (error) {
      this.logger.error(`Failed to broadcast emergency alert to organization ${organizationId}`, error);
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
  async sendUserNotification(userId: string, notification: any): Promise<void> {
    try {
      const server = this.getServer();

      if (!server) {
        this.logger.warn('WebSocket server not initialized, cannot send notification');
        return;
      }

      const room = `user:${userId}`;
      const message = new BroadcastMessageDto(notification);

      server.to(room).emit('health:notification', message);

      this.logger.info(`Notification sent to user ${userId}`, {
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
  async broadcastMedicationReminder(organizationId: string, reminder: any): Promise<void> {
    try {
      const server = this.getServer();

      if (!server) {
        this.logger.warn('WebSocket server not initialized, cannot broadcast reminder');
        return;
      }

      const room = `org:${organizationId}`;
      const message = new BroadcastMessageDto(reminder);

      server.to(room).emit('medication:reminder', message);

      this.logger.info(`Medication reminder broadcasted to organization ${organizationId}`, {
        medicationId: reminder.medicationId,
        studentId: reminder.studentId,
      });
    } catch (error) {
      this.logger.error(`Failed to broadcast medication reminder to organization ${organizationId}`, error);
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
  async broadcastStudentHealthAlert(organizationId: string, alert: any): Promise<void> {
    try {
      const server = this.getServer();

      if (!server) {
        this.logger.warn('WebSocket server not initialized, cannot broadcast alert');
        return;
      }

      const room = `org:${organizationId}`;
      const message = new BroadcastMessageDto(alert);

      server.to(room).emit('student:health:alert', message);

      this.logger.info(`Student health alert broadcasted to organization ${organizationId}`, {
        studentId: alert.studentId,
        alertType: alert.type,
      });
    } catch (error) {
      this.logger.error(`Failed to broadcast student health alert to organization ${organizationId}`, error);
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
  async broadcastToRooms(rooms: string[], event: string, data: any): Promise<void> {
    try {
      const server = this.getServer();

      if (!server) {
        this.logger.warn('WebSocket server not initialized, cannot broadcast message');
        return;
      }

      const message = new BroadcastMessageDto(data);

      for (const room of rooms) {
        server.to(room).emit(event, message);
      }

      this.logger.debug(`Broadcasted ${event} to ${rooms.length} rooms`, {
        event,
        rooms,
        dataKeys: Object.keys(data),
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
  async broadcastToSchool(schoolId: string, event: string, data: any): Promise<void> {
    await this.broadcastToRoom(`school:${schoolId}`, event, data);
  }

  /**
   * Broadcasts a generic alert to a user
   *
   * @param userId - The user ID
   * @param event - The event name
   * @param data - The alert data
   */
  async broadcastToUser(userId: string, event: string, data: any): Promise<void> {
    await this.broadcastToRoom(`user:${userId}`, event, data);
  }

  /**
   * Broadcasts a generic alert to a student's context
   *
   * @param studentId - The student ID
   * @param event - The event name
   * @param data - The alert data
   */
  async broadcastToStudent(studentId: string, event: string, data: any): Promise<void> {
    await this.broadcastToRoom(`student:${studentId}`, event, data);
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
