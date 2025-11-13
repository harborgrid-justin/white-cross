import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { WebSocketService } from '../websocket.service';

/**
 * Base class for WebSocket event listeners
 *
 * Provides common functionality for broadcasting events to WebSocket rooms
 * with standardized error handling and logging patterns.
 */
@Injectable()
export abstract class BaseWebSocketEventListener implements OnModuleInit {
  protected readonly logger: Logger;
  protected websocketService: WebSocketService;

  constructor(
    protected readonly moduleRef: ModuleRef,
    loggerContext: string,
  ) {
    this.logger = new Logger(loggerContext);
  }

  async onModuleInit(): Promise<void> {
    // Get WebSocket service from module reference
    try {
      this.websocketService = this.moduleRef.get(WebSocketService, {
        strict: false,
      });
    } catch (error) {
      this.logger.warn('WebSocket service not available, notifications disabled');
    }
  }

  /**
   * Broadcast an event to specified rooms with standardized error handling
   *
   * @param eventName - The event name for logging
   * @param eventId - Unique identifier for the event (for logging)
   * @param payload - The payload to broadcast
   * @param rooms - Array of room identifiers to broadcast to
   * @param useParallelBroadcast - Whether to broadcast in parallel (default: true)
   */
  protected async broadcastEvent(
    eventName: string,
    eventId: string,
    payload: any,
    rooms: string[],
    useParallelBroadcast: boolean = true,
  ): Promise<void> {
    this.logger.log(`Broadcasting ${eventName}: ${eventId}`);

    if (!this.websocketService || !this.websocketService.isInitialized()) {
      this.logger.warn('WebSocket service not initialized, skipping notification');
      return;
    }

    try {
      const broadcastPromises = rooms.map((room) =>
        this.websocketService.broadcastToRoom(room, eventName, payload),
      );

      if (useParallelBroadcast) {
        await Promise.all(broadcastPromises);
      } else {
        for (const promise of broadcastPromises) {
          await promise;
        }
      }

      this.logger.log(`Successfully broadcasted ${eventName}: ${eventId}`);
    } catch (error) {
      this.logger.error(
        `Failed to broadcast ${eventName} event: ${error.message}`,
        error.stack,
      );
      // Don't throw - event listeners should not fail the main operation
    }
  }

  /**
   * Check if WebSocket service is available and initialized
   */
  protected isWebSocketAvailable(): boolean {
    return !!(this.websocketService && this.websocketService.isInitialized());
  }

  /**
   * Create standardized payload with timestamp
   *
   * @param basePayload - The base payload data
   * @param timestamp - ISO timestamp string (defaults to now)
   * @param eventType - Event type identifier
   */
  protected createPayload(
    basePayload: Record<string, any>,
    timestamp?: string,
    eventType?: string,
  ): Record<string, any> {
    return {
      ...basePayload,
      timestamp: timestamp || new Date().toISOString(),
      ...(eventType && { eventType }),
    };
  }
}