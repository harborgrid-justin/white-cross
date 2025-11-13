/**
 * @fileoverview Broadcast Service
 * @module infrastructure/websocket/services
 * @description Service for broadcasting messages to WebSocket rooms
 */

import { Injectable, Logger } from '@nestjs/common';
import { WebSocketGateway } from '../websocket.gateway';
import { BroadcastMessageDto } from '../types/websocket.types';

import { BaseService } from '@/common/base';
@Injectable()
export class BroadcastService extends BaseService {
  constructor(private readonly websocketGateway: WebSocketGateway) {}

  /**
   * Broadcasts a message to a specific room
   */
  async broadcastToRoom(room: string, event: string, data: unknown): Promise<void> {
    try {
      const server = this.getServer();

      if (!server) {
        this.logWarning('WebSocket server not initialized, cannot broadcast message');
        return;
      }

      const message = new BroadcastMessageDto({
        ...data as Record<string, any>,
        timestamp: new Date().toISOString(),
      });

      server.to(room).emit(event, message);

      this.logDebug(`Broadcasted ${event} to room ${room}`, {
        event,
        room,
        dataKeys: Object.keys(data as any),
      });
    } catch (error) {
      this.logError(`Failed to broadcast to room ${room}`, error);
      throw error;
    }
  }

  /**
   * Broadcasts a message to multiple rooms
   */
  async broadcastToRooms(rooms: string[], event: string, data: unknown): Promise<void> {
    try {
      const server = this.getServer();

      if (!server) {
        this.logWarning('WebSocket server not initialized, cannot broadcast message');
        return;
      }

      const message = new BroadcastMessageDto({
        ...data as Record<string, any>,
        timestamp: new Date().toISOString(),
      });

      for (const room of rooms) {
        server.to(room).emit(event, message);
      }

      this.logDebug(`Broadcasted ${event} to ${rooms.length} rooms`, {
        event,
        rooms,
        dataKeys: Object.keys(data as any),
      });
    } catch (error) {
      this.logError('Failed to broadcast to multiple rooms', error);
      throw error;
    }
  }

  /**
   * Broadcasts to a school room
   */
  async broadcastToSchool(schoolId: string, event: string, data: unknown): Promise<void> {
    await this.broadcastToRoom(`school:${schoolId}`, event, data);
  }

  /**
   * Broadcasts to a user room
   */
  async broadcastToUser(userId: string, event: string, data: unknown): Promise<void> {
    await this.broadcastToRoom(`user:${userId}`, event, data);
  }

  /**
   * Broadcasts to a student room
   */
  async broadcastToStudent(studentId: string, event: string, data: unknown): Promise<void> {
    await this.broadcastToRoom(`student:${studentId}`, event, data);
  }

  /**
   * Broadcasts to an organization room
   */
  async broadcastToOrganization(organizationId: string, event: string, data: unknown): Promise<void> {
    await this.broadcastToRoom(`org:${organizationId}`, event, data);
  }

  /**
   * Gets the Socket.io server instance
   */
  private getServer() {
    return this.websocketGateway?.server || null;
  }
}
