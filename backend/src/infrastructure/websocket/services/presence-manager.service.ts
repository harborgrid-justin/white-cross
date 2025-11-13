/**
 * @fileoverview WebSocket Presence Manager Service
 * @module infrastructure/websocket/services
 * @description Handles user presence tracking and broadcasting for WebSocket connections
 */

import { Injectable, Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { AuthenticatedSocket } from '../interfaces';

import { BaseService } from '../../../common/base';
export interface PresenceStatus {
  status: 'online' | 'offline' | 'away';
  lastSeen: string;
}

@Injectable()
export class PresenceManagerService extends BaseService {
  /**
   * In-memory presence tracking
   * Maps userId to presence status
   */
  private readonly presenceMap = new Map<string, PresenceStatus>();

  /**
   * Handles presence update events
   * Updates and broadcasts user presence status
   *
   * @param client - The authenticated WebSocket client
   * @param server - The Socket.IO server instance
   * @param status - Presence status (online, offline, away)
   */
  handlePresenceUpdate(
    client: AuthenticatedSocket,
    server: Server,
    status: 'online' | 'offline' | 'away',
  ): void {
    const user = client.user;

    if (!user) {
      throw new WsException('Authentication required');
    }

    try {
      // Validate status
      if (!['online', 'offline', 'away'].includes(status)) {
        throw new WsException('Invalid presence status');
      }

      this.updatePresence(user.userId, status);
      this.broadcastPresenceUpdate(server, user.userId, user.organizationId, status);

      this.logDebug(`User ${user.userId} presence updated to ${status}`);
    } catch (error) {
      this.logError(`Presence update error for user ${user.userId}:`, error);
    }
  }

  /**
   * Sets user online when they connect
   *
   * @param userId - The user ID
   * @param server - The Socket.IO server instance
   * @param organizationId - The organization ID
   */
  setUserOnline(userId: string, server: Server, organizationId: string): void {
    this.updatePresence(userId, 'online');
    this.broadcastPresenceUpdate(server, userId, organizationId, 'online');
  }

  /**
   * Sets user offline when they disconnect
   *
   * @param userId - The user ID
   * @param server - The Socket.IO server instance
   * @param organizationId - The organization ID
   */
  setUserOffline(userId: string, server: Server, organizationId: string): void {
    this.updatePresence(userId, 'offline');
    this.broadcastPresenceUpdate(server, userId, organizationId, 'offline');
  }

  /**
   * Gets user presence status
   *
   * @param userId - The user ID
   * @returns Presence status or null if not found
   */
  getUserPresence(userId: string): PresenceStatus | null {
    return this.presenceMap.get(userId) || null;
  }

  /**
   * Gets all users' presence status for an organization
   *
   * @param _organizationId - The organization ID (unused in current implementation)
   * @returns Map of user IDs to presence status
   */
  getOrganizationPresence(): Map<string, PresenceStatus> {
    // In a real implementation, this would filter by organization
    // For now, returning all presence data
    return new Map(this.presenceMap);
  }

  /**
   * Updates user presence status in memory
   *
   * @param userId - The user ID
   * @param status - The presence status
   */
  private updatePresence(userId: string, status: 'online' | 'offline' | 'away'): void {
    this.presenceMap.set(userId, {
      status,
      lastSeen: new Date().toISOString(),
    });
  }

  /**
   * Broadcasts presence update to organization
   *
   * @param server - The Socket.IO server instance
   * @param userId - The user ID
   * @param organizationId - The organization ID
   * @param status - The presence status
   */
  private broadcastPresenceUpdate(
    server: Server,
    userId: string,
    organizationId: string,
    status: 'online' | 'offline' | 'away',
  ): void {
    const orgRoom = `org:${organizationId}`;
    server.to(orgRoom).emit('presence:update', {
      userId,
      status,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Cleans up stale presence data
   * Should be called periodically to remove old presence entries
   *
   * @param maxAge - Maximum age in milliseconds for presence data
   */
  cleanupStalePresence(maxAge: number = 24 * 60 * 60 * 1000): number {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [userId, presence] of this.presenceMap.entries()) {
      const lastSeenTime = new Date(presence.lastSeen).getTime();
      if (now - lastSeenTime > maxAge) {
        this.presenceMap.delete(userId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.logDebug(`Cleaned up ${cleanedCount} stale presence entries`);
    }

    return cleanedCount;
  }

  /**
   * Gets the total number of online users
   *
   * @returns Number of online users
   */
  getOnlineUserCount(): number {
    let count = 0;
    for (const presence of this.presenceMap.values()) {
      if (presence.status === 'online') {
        count++;
      }
    }
    return count;
  }

  /**
   * Gets presence statistics
   *
   * @returns Presence statistics object
   */
  getPresenceStats(): {
    total: number;
    online: number;
    offline: number;
    away: number;
  } {
    const stats = { total: 0, online: 0, offline: 0, away: 0 };

    for (const presence of this.presenceMap.values()) {
      stats.total++;
      switch (presence.status) {
        case 'online':
          stats.online++;
          break;
        case 'offline':
          stats.offline++;
          break;
        case 'away':
          stats.away++;
          break;
      }
    }

    return stats;
  }
}
