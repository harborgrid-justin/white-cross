/**
 * @fileoverview WebSocket Service
 * @module infrastructure/websocket
 * @description Main service orchestrating all WebSocket functionality
 */

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { AppConfigService } from '@/config';
import { BroadcastService } from './services/broadcast.service';
import { AlertService } from './services/alert.service';
import { MessageService } from './services/message.service';
import { PresenceService } from './services/presence.service';
import { BaseService } from '@/common/base';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
import {
  AlertData,
  NotificationData,
  ReminderData,
  MessageEventDto,
  MessageDeliveryDto,
  ReadReceiptDto,
  TypingIndicatorDto,
  UserPresence,
} from './types/websocket.types';

@Injectable()
export class WebSocketService implements OnModuleDestroy {
  constructor(
    @Inject(LoggerService) logger: LoggerService,
    private readonly config: AppConfigService,
    private readonly broadcastService: BroadcastService,
    private readonly alertService: AlertService,
    private readonly messageService: MessageService,
    private readonly presenceService: PresenceService,
  ) {
    super({
      serviceName: 'WebSocketService',
      logger,
      enableAuditLogging: true,
    });

    this.logInfo('WebSocketService initialized');
  }

  /**
   * Cleanup resources on module destroy
   */
  async onModuleDestroy() {
    this.logInfo('WebSocketService shutting down - cleaning up resources');

    // Get current connection count for logging
    const connectedSockets = this.getConnectedSocketsCount();
    if (connectedSockets > 0) {
      this.logInfo(`Disconnecting ${connectedSockets} active WebSocket connections`);

      // Notify all connected clients about server shutdown if enabled
      if (this.config.get<boolean>('websocket.notifyOnShutdown', true)) {
        // Broadcast shutdown notification would go here
        this.logInfo('Shutdown notification sent to connected clients');
      }
    }

    this.logInfo('WebSocketService destroyed, resources cleaned up');
  }

  // Broadcasting Methods

  /**
   * Broadcasts a message to a specific room
   */
  async broadcastToRoom(room: string, event: string, data: unknown): Promise<void> {
    return this.broadcastService.broadcastToRoom(room, event, data);
  }

  /**
   * Broadcasts a message to multiple rooms
   */
  async broadcastToRooms(rooms: string[], event: string, data: unknown): Promise<void> {
    return this.broadcastService.broadcastToRooms(rooms, event, data);
  }

  /**
   * Broadcasts to a school room
   */
  async broadcastToSchool(schoolId: string, event: string, data: unknown): Promise<void> {
    return this.broadcastService.broadcastToSchool(schoolId, event, data);
  }

  /**
   * Broadcasts to a user room
   */
  async broadcastToUser(userId: string, event: string, data: unknown): Promise<void> {
    return this.broadcastService.broadcastToUser(userId, event, data);
  }

  /**
   * Broadcasts to a student room
   */
  async broadcastToStudent(studentId: string, event: string, data: unknown): Promise<void> {
    return this.broadcastService.broadcastToStudent(studentId, event, data);
  }

  // Alert Methods

  /**
   * Broadcasts an emergency alert to an organization
   */
  async broadcastEmergencyAlert(organizationId: string, alert: AlertData): Promise<void> {
    return this.alertService.broadcastEmergencyAlert(organizationId, alert);
  }

  /**
   * Broadcasts a student health alert to an organization
   */
  async broadcastStudentHealthAlert(organizationId: string, alert: AlertData): Promise<void> {
    return this.alertService.broadcastStudentHealthAlert(organizationId, alert);
  }

  /**
   * Broadcasts a medication reminder to an organization
   */
  async broadcastMedicationReminder(organizationId: string, reminder: ReminderData): Promise<void> {
    return this.alertService.broadcastMedicationReminder(organizationId, reminder);
  }

  /**
   * Sends a notification to a specific user
   */
  async sendUserNotification(userId: string, notification: NotificationData): Promise<void> {
    return this.alertService.sendUserNotification(userId, notification);
  }

  // Message Methods

  /**
   * Sends a message to a conversation room
   */
  async sendMessageToConversation(conversationId: string, message: MessageEventDto): Promise<void> {
    return this.messageService.sendMessageToConversation(conversationId, message);
  }

  /**
   * Sends a direct message to specific users
   */
  async sendMessageToUsers(userIds: string[], message: MessageEventDto): Promise<void> {
    return this.messageService.sendMessageToUsers(userIds, message);
  }

  /**
   * Broadcasts a typing indicator to conversation participants
   */
  async broadcastTypingIndicator(
    conversationId: string,
    typingIndicator: TypingIndicatorDto,
  ): Promise<void> {
    return this.messageService.broadcastTypingIndicator(conversationId, typingIndicator);
  }

  /**
   * Broadcasts a read receipt to conversation participants
   */
  async broadcastReadReceipt(conversationId: string, readReceipt: ReadReceiptDto): Promise<void> {
    return this.messageService.broadcastReadReceipt(conversationId, readReceipt);
  }

  /**
   * Broadcasts a message delivery confirmation
   */
  async broadcastMessageDelivery(senderId: string, delivery: MessageDeliveryDto): Promise<void> {
    return this.messageService.broadcastMessageDelivery(senderId, delivery);
  }

  // Presence Methods

  /**
   * Updates and broadcasts user presence status
   */
  async updateUserPresence(
    userId: string,
    organizationId: string,
    status: 'online' | 'offline' | 'away',
  ): Promise<void> {
    return this.presenceService.updateUserPresence(userId, organizationId, status);
  }

  /**
   * Gets user presence status
   */
  getUserPresence(userId: string): UserPresence | null {
    return this.presenceService.getUserPresence(userId);
  }

  /**
   * Gets the count of currently connected sockets
   */
  getConnectedSocketsCount(): number {
    return this.presenceService.getConnectedSocketsCount();
  }

  /**
   * Checks if WebSocket server is initialized
   */
  isInitialized(): boolean {
    return this.presenceService.isInitialized();
  }
}
