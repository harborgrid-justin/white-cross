/**
 * @fileoverview Presence Service
 * @module infrastructure/websocket/services
 * @description Service for managing user presence and online status
 */

import { Injectable, Logger } from '@nestjs/common';
import { WebSocketGateway } from '../websocket.gateway';
import { BroadcastService } from './broadcast.service';
import { PresenceData, UserPresence } from '../types/websocket.types';

import { BaseService } from '@/common/base';
@Injectable()
export class PresenceService extends BaseService {
  constructor(
    private readonly websocketGateway: WebSocketGateway,
    private readonly broadcastService: BroadcastService,
  ) {
    super("PresenceService");}

  /**
   * Updates and broadcasts user presence status
   */
  async updateUserPresence(
    userId: string,
    organizationId: string,
    status: 'online' | 'offline' | 'away',
  ): Promise<void> {
    try {
      const presenceData: PresenceData = {
        userId,
        status,
        timestamp: new Date().toISOString(),
      };

      await this.broadcastService.broadcastToOrganization(
        organizationId,
        'presence:update',
        presenceData,
      );

      this.logDebug(`Presence update broadcasted for user ${userId}`, {
        status,
        organizationId,
      });
    } catch (error) {
      this.logError(`Failed to broadcast presence update for user ${userId}`, error);
      throw error;
    }
  }

  /**
   * Gets user presence status from the gateway
   */
  getUserPresence(userId: string): UserPresence | null {
    return this.websocketGateway.getUserPresence(userId);
  }

  /**
   * Broadcasts user online status
   */
  async broadcastUserOnline(userId: string, organizationId: string): Promise<void> {
    await this.updateUserPresence(userId, organizationId, 'online');
  }

  /**
   * Broadcasts user offline status
   */
  async broadcastUserOffline(userId: string, organizationId: string): Promise<void> {
    await this.updateUserPresence(userId, organizationId, 'offline');
  }

  /**
   * Broadcasts user away status
   */
  async broadcastUserAway(userId: string, organizationId: string): Promise<void> {
    await this.updateUserPresence(userId, organizationId, 'away');
  }

  /**
   * Gets the count of currently connected sockets
   */
  getConnectedSocketsCount(): number {
    return this.websocketGateway.getConnectedSocketsCount();
  }

  /**
   * Checks if WebSocket server is initialized
   */
  isInitialized(): boolean {
    return this.websocketGateway.isInitialized();
  }
}
