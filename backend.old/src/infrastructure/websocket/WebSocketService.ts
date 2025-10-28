/**
 * WebSocket Service
 * 
 * Provides a service layer wrapper around the Socket.io plugin
 * for broadcasting real-time alerts and notifications.
 * 
 * @module infrastructure/websocket/WebSocketService
 */

import { getWebSocketPlugin } from './socketPlugin';
import { logger } from '../../utils/logger';

/**
 * WebSocket Service class
 * Handles real-time communication for alerts and notifications
 */
export class WebSocketService {
  private plugin: ReturnType<typeof getWebSocketPlugin>;

  constructor() {
    this.plugin = getWebSocketPlugin();
  }

  /**
   * Broadcast a message to a specific room
   * 
   * @param room - The room identifier (e.g., 'school:123', 'user:456')
   * @param event - The event name to emit
   * @param data - The data payload to send
   */
  async broadcastToRoom(room: string, event: string, data: any): Promise<void> {
    try {
      const io = this.plugin.getIO();
      
      if (!io) {
        logger.warn('WebSocket server not initialized, cannot broadcast message');
        return;
      }

      io.to(room).emit(event, {
        ...data,
        timestamp: new Date().toISOString()
      });

      logger.debug(`Broadcasted ${event} to room ${room}`, { 
        event, 
        room, 
        dataKeys: Object.keys(data) 
      });
    } catch (error) {
      logger.error(`Failed to broadcast to room ${room}`, error);
      throw error;
    }
  }

  /**
   * Broadcast an emergency alert to an organization
   * 
   * @param organizationId - The organization ID
   * @param alert - The alert data
   */
  async broadcastEmergencyAlert(organizationId: string, alert: any): Promise<void> {
    try {
      this.plugin.broadcastEmergencyAlert(organizationId, alert);
      logger.info(`Emergency alert broadcasted to organization ${organizationId}`, {
        alertId: alert.id,
        severity: alert.severity
      });
    } catch (error) {
      logger.error(`Failed to broadcast emergency alert to organization ${organizationId}`, error);
      throw error;
    }
  }

  /**
   * Send a notification to a specific user
   * 
   * @param userId - The user ID
   * @param notification - The notification data
   */
  async sendUserNotification(userId: string, notification: any): Promise<void> {
    try {
      this.plugin.sendHealthNotification(userId, notification);
      logger.info(`Notification sent to user ${userId}`, {
        notificationId: notification.id,
        type: notification.type
      });
    } catch (error) {
      logger.error(`Failed to send notification to user ${userId}`, error);
      throw error;
    }
  }

  /**
   * Broadcast a medication reminder to an organization
   * 
   * @param organizationId - The organization ID
   * @param reminder - The reminder data
   */
  async broadcastMedicationReminder(organizationId: string, reminder: any): Promise<void> {
    try {
      this.plugin.broadcastMedicationReminder(organizationId, reminder);
      logger.info(`Medication reminder broadcasted to organization ${organizationId}`, {
        medicationId: reminder.medicationId,
        studentId: reminder.studentId
      });
    } catch (error) {
      logger.error(`Failed to broadcast medication reminder to organization ${organizationId}`, error);
      throw error;
    }
  }

  /**
   * Broadcast a student health alert to an organization
   * 
   * @param organizationId - The organization ID
   * @param alert - The alert data
   */
  async broadcastStudentHealthAlert(organizationId: string, alert: any): Promise<void> {
    try {
      this.plugin.broadcastStudentHealthAlert(organizationId, alert);
      logger.info(`Student health alert broadcasted to organization ${organizationId}`, {
        studentId: alert.studentId,
        alertType: alert.type
      });
    } catch (error) {
      logger.error(`Failed to broadcast student health alert to organization ${organizationId}`, error);
      throw error;
    }
  }

  /**
   * Broadcast a message to multiple rooms
   * 
   * @param rooms - Array of room identifiers
   * @param event - The event name to emit
   * @param data - The data payload to send
   */
  async broadcastToRooms(rooms: string[], event: string, data: any): Promise<void> {
    try {
      const io = this.plugin.getIO();
      
      if (!io) {
        logger.warn('WebSocket server not initialized, cannot broadcast message');
        return;
      }

      for (const room of rooms) {
        io.to(room).emit(event, {
          ...data,
          timestamp: new Date().toISOString()
        });
      }

      logger.debug(`Broadcasted ${event} to ${rooms.length} rooms`, { 
        event, 
        rooms, 
        dataKeys: Object.keys(data) 
      });
    } catch (error) {
      logger.error('Failed to broadcast to multiple rooms', error);
      throw error;
    }
  }

  /**
   * Get the count of currently connected sockets
   * 
   * @returns The number of connected sockets
   */
  getConnectedSocketsCount(): number {
    return this.plugin.getConnectedSocketsCount();
  }

  /**
   * Check if WebSocket server is initialized
   * 
   * @returns True if initialized, false otherwise
   */
  isInitialized(): boolean {
    return this.plugin.getIO() !== null;
  }

  /**
   * Broadcast a generic alert to a school
   * 
   * @param schoolId - The school ID
   * @param event - The event name
   * @param data - The alert data
   */
  async broadcastToSchool(schoolId: string, event: string, data: any): Promise<void> {
    await this.broadcastToRoom(`school:${schoolId}`, event, data);
  }

  /**
   * Broadcast a generic alert to a user
   * 
   * @param userId - The user ID
   * @param event - The event name
   * @param data - The alert data
   */
  async broadcastToUser(userId: string, event: string, data: any): Promise<void> {
    await this.broadcastToRoom(`user:${userId}`, event, data);
  }

  /**
   * Broadcast a generic alert to a student's context
   * 
   * @param studentId - The student ID
   * @param event - The event name
   * @param data - The alert data
   */
  async broadcastToStudent(studentId: string, event: string, data: any): Promise<void> {
    await this.broadcastToRoom(`student:${studentId}`, event, data);
  }
}

export default WebSocketService;
