/**
 * @fileoverview Shared WebSocket Utilities
 * @module infrastructure/websocket/shared
 * @description Common utilities and patterns shared between WebSocket services
 */

import { Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthenticatedSocket } from '../interfaces';
import { RateLimiterService } from '../services/rate-limiter.service';

/**
 * Common WebSocket utilities for handlers
 */
export class WebSocketUtilities {
  /**
   * Validates user authentication and returns user info
   */
  static validateAuth(client: AuthenticatedSocket): { userId: string; organizationId: string } {
    const user = client.user;
    if (!user) {
      throw new WsException('Authentication required');
    }
    return {
      userId: user.userId,
      organizationId: user.organizationId,
    };
  }

  /**
   * Checks rate limits and handles limit exceeded case
   */
  static async checkRateLimit(
    rateLimiter: RateLimiterService,
    client: AuthenticatedSocket,
    userId: string,
    action: string,
    logger: Logger,
  ): Promise<boolean> {
    const allowed = await rateLimiter.checkLimit(userId, action);
    if (!allowed) {
      client.emit('error', {
        type: 'RATE_LIMIT_EXCEEDED',
        message: `${action} rate limit exceeded. Please slow down.`,
      });
      logger.debug(`Rate limit exceeded for user ${userId} on action ${action}`);
      return false;
    }
    return true;
  }

  /**
   * Validates DTO and handles validation errors
   */
  static validateDto<T extends { validateUser?: (userId: string) => boolean; validateOrganization?: (orgId: string) => boolean }>(
    dto: T,
    userId: string,
    organizationId: string,
    client: AuthenticatedSocket,
    logger: Logger,
    actionType: string,
  ): boolean {
    try {
      // Validate user if method exists
      if (dto.validateUser && !dto.validateUser(userId)) {
        throw new WsException('Invalid user');
      }

      // Validate organization if method exists
      if (dto.validateOrganization && !dto.validateOrganization(organizationId)) {
        throw new WsException('Invalid organization');
      }

      return true;
    } catch (error) {
      logger.error(`${actionType} validation error for user ${userId}:`, error);
      client.emit('error', {
        type: `${actionType.toUpperCase()}_VALIDATION_FAILED`,
        message: (error as Error).message || `${actionType} validation failed`,
      });
      return false;
    }
  }

  /**
   * Handles common error scenarios
   */
  static handleError(
    error: unknown,
    client: AuthenticatedSocket,
    userId: string,
    actionType: string,
    logger: Logger,
  ): void {
    logger.error(`${actionType} error for user ${userId}:`, error);
    client.emit('error', {
      type: `${actionType.toUpperCase()}_FAILED`,
      message: (error as Error).message || `Failed to ${actionType.toLowerCase()}`,
    });
  }

  /**
   * Creates standardized success confirmation
   */
  static sendConfirmation(
    client: AuthenticatedSocket,
    eventType: string,
    data: Record<string, any>,
  ): void {
    client.emit(eventType, data);
  }

  /**
   * Gets room ID for conversation
   */
  static getConversationRoom(conversationId: string): string {
    return `conversation:${conversationId}`;
  }

  /**
   * Gets room ID for user
   */
  static getUserRoom(userId: string): string {
    return `user:${userId}`;
  }

  /**
   * Logs action with standardized format
   */
  static logAction(
    logger: Logger,
    action: string,
    userId: string,
    details: Record<string, any> = {},
  ): void {
    const detailsStr = Object.keys(details).length > 0 
      ? ` - ${Object.entries(details).map(([k, v]) => `${k}: ${v}`).join(', ')}`
      : '';
    logger.log(`${action} by user ${userId}${detailsStr}`);
  }

  /**
   * Executes WebSocket handler with common error handling and validation
   */
  static async executeWithCommonHandling<T, R>(
    params: {
      client: AuthenticatedSocket;
      rateLimiter: RateLimiterService;
      logger: Logger;
      action: string;
      createDto: () => T;
      validate?: (dto: T, userId: string, organizationId: string) => boolean;
      execute: (dto: T, userId: string, organizationId: string) => Promise<R> | R;
      onSuccess?: (result: R, dto: T) => void;
      skipRateLimit?: boolean;
    },
  ): Promise<void> {
    const { client, rateLimiter, logger, action, createDto, validate, execute, onSuccess, skipRateLimit } = params;

    try {
      // Validate authentication
      const { userId, organizationId } = this.validateAuth(client);

      // Check rate limits
      if (!skipRateLimit) {
        const allowed = await this.checkRateLimit(rateLimiter, client, userId, action, logger);
        if (!allowed) return;
      }

      // Create and validate DTO
      const dto = createDto();

      // Custom validation if provided
      if (validate && !validate(dto, userId, organizationId)) {
        return;
      }

      // Execute the handler logic
      const result = await execute(dto, userId, organizationId);

      // Handle success callback
      if (onSuccess) {
        onSuccess(result, dto);
      }

      // Log success
      this.logAction(logger, action, userId);
    } catch (error) {
      const user = client.user;
      const userId = user?.userId || 'unknown';
      this.handleError(error, client, userId, action, logger);
    }
  }
}
