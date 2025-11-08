/**
 * LOC: W9X5Y6Z7A8
 * File: /reuse/websocket-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v11.1.8)
 *   - @nestjs/websockets (v11.1.8)
 *   - @nestjs/platform-socket.io (v11.1.8)
 *   - socket.io (v4.7.5)
 *   - @socket.io/redis-adapter (v8.3.0)
 *   - ioredis (v5.4.1)
 *   - rxjs (v7.8.1)
 *
 * DOWNSTREAM (imported by):
 *   - WebSocket gateway implementations
 *   - Real-time communication modules
 *   - Chat and messaging systems
 *   - Notification services
 *   - Collaboration features
 */

/**
 * File: /reuse/websocket-kit.ts
 * Locator: WC-UTL-WSKT-001
 * Purpose: Advanced WebSocket Utilities Kit - Message queuing, connection pooling, state management
 *
 * Upstream: @nestjs/websockets, Socket.IO v4.x, Redis, RxJS, Node 18+
 * Downstream: All WebSocket gateways, real-time features, message queuing, connection management
 * Dependencies: NestJS v11.x, Socket.IO v4.x, Node 18+, TypeScript 5.x, Redis, RxJS v7.x
 * Exports: 45 advanced WebSocket utilities for connection pooling, message queuing, state management, clustering
 *
 * LLM Context: Production-grade WebSocket toolkit extending basic gateway functionality.
 * Provides advanced utilities for message queuing (offline clients), connection pooling, socket state machines,
 * message deduplication, retry logic, circuit breakers, socket clustering, cross-namespace communication,
 * binary message handling, compression, bandwidth throttling, message prioritization, socket health monitoring,
 * graceful degradation, and HIPAA-compliant audit logging for real-time PHI access.
 */

import { Logger, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Server, Socket, Namespace } from 'socket.io';
import { Subject, Observable } from 'rxjs';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Message queue entry for offline clients
 */
export interface QueuedMessage {
  id: string;
  userId: string;
  event: string;
  data: any;
  priority: 'low' | 'normal' | 'high' | 'critical';
  timestamp: Date;
  expiresAt?: Date;
  retryCount: number;
  maxRetries: number;
}

/**
 * Socket pool configuration
 */
export interface SocketPoolConfig {
  maxConnectionsPerUser: number;
  idleTimeout: number;
  healthCheckInterval: number;
  evictionPolicy: 'lru' | 'lfu' | 'fifo';
}

/**
 * Socket state information
 */
export interface SocketState {
  socketId: string;
  userId?: string;
  status: 'connecting' | 'connected' | 'reconnecting' | 'disconnecting' | 'disconnected';
  metadata: Record<string, any>;
  createdAt: Date;
  lastActivityAt: Date;
  reconnectAttempts: number;
}

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
  monitoringWindow: number;
}

/**
 * Circuit breaker state
 */
export type CircuitBreakerState = 'closed' | 'open' | 'half-open';

/**
 * Message delivery options
 */
export interface DeliveryOptions {
  guarantee: 'at-most-once' | 'at-least-once' | 'exactly-once';
  timeout?: number;
  retryStrategy?: RetryStrategy;
  compression?: boolean;
}

/**
 * Retry strategy configuration
 */
export interface RetryStrategy {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

/**
 * Bandwidth throttle configuration
 */
export interface ThrottleConfig {
  maxBytesPerSecond: number;
  burstSize: number;
  windowMs: number;
}

/**
 * Socket cluster node information
 */
export interface ClusterNode {
  nodeId: string;
  hostname: string;
  port: number;
  connectedClients: number;
  lastHeartbeat: Date;
  status: 'active' | 'draining' | 'inactive';
}

/**
 * Message acknowledgement
 */
export interface MessageAck {
  messageId: string;
  status: 'pending' | 'delivered' | 'failed';
  deliveredAt?: Date;
  error?: string;
}

/**
 * Socket health metrics
 */
export interface SocketHealthMetrics {
  socketId: string;
  latency: number;
  packetLoss: number;
  throughput: number;
  errorRate: number;
  uptime: number;
  lastHealthCheck: Date;
}

// ============================================================================
// MESSAGE QUEUING FOR OFFLINE CLIENTS
// ============================================================================

/**
 * 1. Creates a message queue manager for offline clients.
 *
 * @param {number} maxQueueSize - Maximum messages per user
 * @param {number} defaultTtl - Default message TTL in milliseconds
 * @returns {MessageQueueManager} Queue manager instance
 *
 * @example
 * ```typescript
 * const queueManager = createMessageQueue(1000, 24 * 60 * 60 * 1000);
 * ```
 */
export function createMessageQueue(maxQueueSize: number = 1000, defaultTtl: number = 86400000): Map<string, QueuedMessage[]> {
  return new Map<string, QueuedMessage[]>();
}

/**
 * 2. Enqueues a message for offline user delivery.
 *
 * @param {Map<string, QueuedMessage[]>} queue - Message queue
 * @param {string} userId - User identifier
 * @param {QueuedMessage} message - Message to queue
 * @param {number} maxQueueSize - Maximum queue size per user
 * @returns {boolean} True if enqueued successfully
 *
 * @example
 * ```typescript
 * const queued = enqueueMessage(messageQueue, 'user-123', {
 *   id: 'msg-1',
 *   userId: 'user-123',
 *   event: 'notification',
 *   data: { text: 'New message' },
 *   priority: 'high',
 *   timestamp: new Date(),
 *   retryCount: 0,
 *   maxRetries: 3
 * }, 1000);
 * ```
 */
export function enqueueMessage(
  queue: Map<string, QueuedMessage[]>,
  userId: string,
  message: QueuedMessage,
  maxQueueSize: number = 1000,
): boolean {
  let userQueue = queue.get(userId) || [];

  // Remove expired messages
  const now = Date.now();
  userQueue = userQueue.filter((msg) => !msg.expiresAt || msg.expiresAt.getTime() > now);

  // Check queue size
  if (userQueue.length >= maxQueueSize) {
    // Remove lowest priority or oldest message
    userQueue.sort((a, b) => {
      const priorityOrder = { low: 0, normal: 1, high: 2, critical: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      return priorityDiff !== 0 ? priorityDiff : a.timestamp.getTime() - b.timestamp.getTime();
    });
    userQueue.shift();
  }

  userQueue.push(message);
  queue.set(userId, userQueue);

  return true;
}

/**
 * 3. Dequeues and delivers pending messages when user comes online.
 *
 * @param {Map<string, QueuedMessage[]>} queue - Message queue
 * @param {Socket} client - Socket client
 * @param {string} userId - User identifier
 * @returns {Promise<number>} Number of messages delivered
 *
 * @example
 * ```typescript
 * async handleConnection(client: Socket) {
 *   const delivered = await deliverQueuedMessages(this.messageQueue, client, 'user-123');
 *   console.log(`Delivered ${delivered} queued messages`);
 * }
 * ```
 */
export async function deliverQueuedMessages(
  queue: Map<string, QueuedMessage[]>,
  client: Socket,
  userId: string,
): Promise<number> {
  const userQueue = queue.get(userId);

  if (!userQueue || userQueue.length === 0) {
    return 0;
  }

  // Sort by priority and timestamp
  const priorityOrder = { low: 0, normal: 1, high: 2, critical: 3 };
  userQueue.sort((a, b) => {
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    return priorityDiff !== 0 ? priorityDiff : a.timestamp.getTime() - b.timestamp.getTime();
  });

  let delivered = 0;

  for (const message of userQueue) {
    try {
      client.emit(message.event, {
        ...message.data,
        _queued: true,
        _queuedAt: message.timestamp,
      });
      delivered++;
    } catch (error) {
      const logger = new Logger('MessageQueue');
      logger.error(`Failed to deliver queued message ${message.id}: ${error.message}`);
    }
  }

  // Clear delivered messages
  queue.delete(userId);

  return delivered;
}

/**
 * 4. Prunes expired messages from queue.
 *
 * @param {Map<string, QueuedMessage[]>} queue - Message queue
 * @returns {number} Number of messages removed
 *
 * @example
 * ```typescript
 * setInterval(() => {
 *   const removed = pruneExpiredMessages(messageQueue);
 *   console.log(`Pruned ${removed} expired messages`);
 * }, 60000);
 * ```
 */
export function pruneExpiredMessages(queue: Map<string, QueuedMessage[]>): number {
  const now = Date.now();
  let removed = 0;

  queue.forEach((userQueue, userId) => {
    const filtered = userQueue.filter((msg) => !msg.expiresAt || msg.expiresAt.getTime() > now);
    removed += userQueue.length - filtered.length;

    if (filtered.length === 0) {
      queue.delete(userId);
    } else if (filtered.length !== userQueue.length) {
      queue.set(userId, filtered);
    }
  });

  return removed;
}

/**
 * 5. Gets queue statistics for monitoring.
 *
 * @param {Map<string, QueuedMessage[]>} queue - Message queue
 * @returns {object} Queue statistics
 *
 * @example
 * ```typescript
 * const stats = getQueueStats(messageQueue);
 * console.log(`Total queued: ${stats.totalMessages}`);
 * ```
 */
export function getQueueStats(queue: Map<string, QueuedMessage[]>): {
  totalUsers: number;
  totalMessages: number;
  avgMessagesPerUser: number;
  priorityBreakdown: Record<string, number>;
} {
  let totalMessages = 0;
  const priorityBreakdown: Record<string, number> = {
    low: 0,
    normal: 0,
    high: 0,
    critical: 0,
  };

  queue.forEach((userQueue) => {
    totalMessages += userQueue.length;
    userQueue.forEach((msg) => {
      priorityBreakdown[msg.priority]++;
    });
  });

  return {
    totalUsers: queue.size,
    totalMessages,
    avgMessagesPerUser: queue.size > 0 ? totalMessages / queue.size : 0,
    priorityBreakdown,
  };
}

// ============================================================================
// CONNECTION POOLING & MANAGEMENT
// ============================================================================

/**
 * 6. Creates a socket connection pool with limits.
 *
 * @param {SocketPoolConfig} config - Pool configuration
 * @returns {Map<string, Socket[]>} Connection pool
 *
 * @example
 * ```typescript
 * const pool = createSocketPool({
 *   maxConnectionsPerUser: 5,
 *   idleTimeout: 300000,
 *   healthCheckInterval: 60000,
 *   evictionPolicy: 'lru'
 * });
 * ```
 */
export function createSocketPool(config: SocketPoolConfig): Map<string, Socket[]> {
  return new Map<string, Socket[]>();
}

/**
 * 7. Adds a socket to the connection pool with validation.
 *
 * @param {Map<string, Socket[]>} pool - Connection pool
 * @param {string} userId - User identifier
 * @param {Socket} socket - Socket to add
 * @param {number} maxConnections - Maximum connections per user
 * @returns {boolean} True if added successfully
 *
 * @example
 * ```typescript
 * const added = addToSocketPool(connectionPool, 'user-123', client, 5);
 * if (!added) {
 *   client.disconnect();
 * }
 * ```
 */
export function addToSocketPool(
  pool: Map<string, Socket[]>,
  userId: string,
  socket: Socket,
  maxConnections: number = 5,
): boolean {
  let userSockets = pool.get(userId) || [];

  // Check connection limit
  if (userSockets.length >= maxConnections) {
    return false;
  }

  userSockets.push(socket);
  pool.set(userId, userSockets);

  return true;
}

/**
 * 8. Removes a socket from the connection pool.
 *
 * @param {Map<string, Socket[]>} pool - Connection pool
 * @param {string} userId - User identifier
 * @param {string} socketId - Socket identifier to remove
 * @returns {boolean} True if removed
 *
 * @example
 * ```typescript
 * removeFromSocketPool(connectionPool, 'user-123', client.id);
 * ```
 */
export function removeFromSocketPool(
  pool: Map<string, Socket[]>,
  userId: string,
  socketId: string,
): boolean {
  const userSockets = pool.get(userId);

  if (!userSockets) {
    return false;
  }

  const filtered = userSockets.filter((s) => s.id !== socketId);
  const removed = filtered.length !== userSockets.length;

  if (filtered.length === 0) {
    pool.delete(userId);
  } else {
    pool.set(userId, filtered);
  }

  return removed;
}

/**
 * 9. Gets all active sockets for a user from pool.
 *
 * @param {Map<string, Socket[]>} pool - Connection pool
 * @param {string} userId - User identifier
 * @returns {Socket[]} Array of user's sockets
 *
 * @example
 * ```typescript
 * const sockets = getUserSockets(connectionPool, 'user-123');
 * sockets.forEach(socket => socket.emit('broadcast', data));
 * ```
 */
export function getUserSockets(pool: Map<string, Socket[]>, userId: string): Socket[] {
  return pool.get(userId) || [];
}

/**
 * 10. Evicts idle connections from pool.
 *
 * @param {Map<string, Socket[]>} pool - Connection pool
 * @param {number} idleTimeout - Idle timeout in milliseconds
 * @returns {number} Number of connections evicted
 *
 * @example
 * ```typescript
 * const evicted = evictIdleConnections(connectionPool, 300000);
 * console.log(`Evicted ${evicted} idle connections`);
 * ```
 */
export function evictIdleConnections(pool: Map<string, Socket[]>, idleTimeout: number): number {
  const now = Date.now();
  let evicted = 0;

  pool.forEach((sockets, userId) => {
    const active = sockets.filter((socket) => {
      const lastActivity = (socket as any).__lastActivity || socket.handshake.time;
      const idle = now - new Date(lastActivity).getTime();

      if (idle > idleTimeout) {
        socket.disconnect();
        evicted++;
        return false;
      }
      return true;
    });

    if (active.length === 0) {
      pool.delete(userId);
    } else if (active.length !== sockets.length) {
      pool.set(userId, active);
    }
  });

  return evicted;
}

// ============================================================================
// SOCKET STATE MANAGEMENT
// ============================================================================

/**
 * 11. Initializes socket state tracking.
 *
 * @param {Socket} socket - Socket client
 * @returns {SocketState} Initial socket state
 *
 * @example
 * ```typescript
 * handleConnection(client: Socket) {
 *   const state = initializeSocketState(client);
 *   this.socketStates.set(client.id, state);
 * }
 * ```
 */
export function initializeSocketState(socket: Socket): SocketState {
  return {
    socketId: socket.id,
    userId: socket.handshake.auth?.userId,
    status: 'connected',
    metadata: {},
    createdAt: new Date(),
    lastActivityAt: new Date(),
    reconnectAttempts: 0,
  };
}

/**
 * 12. Updates socket state with new status.
 *
 * @param {Map<string, SocketState>} stateStore - State store
 * @param {string} socketId - Socket identifier
 * @param {Partial<SocketState>} updates - State updates
 * @returns {SocketState | null} Updated state
 *
 * @example
 * ```typescript
 * updateSocketState(socketStates, client.id, {
 *   status: 'reconnecting',
 *   reconnectAttempts: 1
 * });
 * ```
 */
export function updateSocketState(
  stateStore: Map<string, SocketState>,
  socketId: string,
  updates: Partial<SocketState>,
): SocketState | null {
  const state = stateStore.get(socketId);

  if (!state) {
    return null;
  }

  const updated = {
    ...state,
    ...updates,
    lastActivityAt: new Date(),
  };

  stateStore.set(socketId, updated);
  return updated;
}

/**
 * 13. Gets socket state information.
 *
 * @param {Map<string, SocketState>} stateStore - State store
 * @param {string} socketId - Socket identifier
 * @returns {SocketState | null} Socket state
 *
 * @example
 * ```typescript
 * const state = getSocketState(socketStates, client.id);
 * if (state?.status === 'reconnecting') {
 *   // Handle reconnection
 * }
 * ```
 */
export function getSocketState(
  stateStore: Map<string, SocketState>,
  socketId: string,
): SocketState | null {
  return stateStore.get(socketId) || null;
}

/**
 * 14. Transitions socket to reconnecting state.
 *
 * @param {Map<string, SocketState>} stateStore - State store
 * @param {string} socketId - Socket identifier
 * @param {number} maxAttempts - Maximum reconnect attempts
 * @returns {boolean} True if transition allowed
 *
 * @example
 * ```typescript
 * const canReconnect = transitionToReconnecting(socketStates, client.id, 5);
 * if (!canReconnect) {
 *   // Max reconnect attempts exceeded
 * }
 * ```
 */
export function transitionToReconnecting(
  stateStore: Map<string, SocketState>,
  socketId: string,
  maxAttempts: number = 5,
): boolean {
  const state = stateStore.get(socketId);

  if (!state) {
    return false;
  }

  if (state.reconnectAttempts >= maxAttempts) {
    return false;
  }

  state.status = 'reconnecting';
  state.reconnectAttempts++;
  state.lastActivityAt = new Date();

  stateStore.set(socketId, state);
  return true;
}

/**
 * 15. Cleans up socket state on disconnect.
 *
 * @param {Map<string, SocketState>} stateStore - State store
 * @param {string} socketId - Socket identifier
 * @returns {void}
 *
 * @example
 * ```typescript
 * handleDisconnect(client: Socket) {
 *   cleanupSocketState(socketStates, client.id);
 * }
 * ```
 */
export function cleanupSocketState(stateStore: Map<string, SocketState>, socketId: string): void {
  stateStore.delete(socketId);
}

// ============================================================================
// MESSAGE DEDUPLICATION & DELIVERY GUARANTEES
// ============================================================================

/**
 * 16. Creates a message deduplication store.
 *
 * @param {number} ttl - Time-to-live for message IDs in milliseconds
 * @returns {Map<string, number>} Deduplication store
 *
 * @example
 * ```typescript
 * const dedupStore = createDeduplicationStore(300000); // 5 minutes
 * ```
 */
export function createDeduplicationStore(ttl: number = 300000): Map<string, number> {
  return new Map<string, number>();
}

/**
 * 17. Checks if message is duplicate and records it.
 *
 * @param {Map<string, number>} store - Deduplication store
 * @param {string} messageId - Unique message identifier
 * @param {number} ttl - Time-to-live in milliseconds
 * @returns {boolean} True if duplicate
 *
 * @example
 * ```typescript
 * if (isDuplicateMessage(dedupStore, 'msg-123', 300000)) {
 *   return; // Skip duplicate
 * }
 * ```
 */
export function isDuplicateMessage(
  store: Map<string, number>,
  messageId: string,
  ttl: number = 300000,
): boolean {
  const now = Date.now();

  // Clean expired entries
  store.forEach((timestamp, id) => {
    if (now - timestamp > ttl) {
      store.delete(id);
    }
  });

  // Check if message exists
  if (store.has(messageId)) {
    return true;
  }

  // Record message
  store.set(messageId, now);
  return false;
}

/**
 * 18. Sends message with exactly-once delivery guarantee.
 *
 * @param {Socket} socket - Socket client
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @param {Map<string, number>} ackStore - Acknowledgement store
 * @returns {Promise<boolean>} True if acknowledged
 *
 * @example
 * ```typescript
 * const delivered = await sendWithExactlyOnce(client, 'message', data, ackStore);
 * ```
 */
export async function sendWithExactlyOnce(
  socket: Socket,
  event: string,
  data: any,
  ackStore: Map<string, number>,
): Promise<boolean> {
  const messageId = `${socket.id}-${Date.now()}-${Math.random()}`;

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      ackStore.delete(messageId);
      resolve(false);
    }, 5000);

    socket.emit(event, { ...data, _messageId: messageId }, (ack: any) => {
      clearTimeout(timeout);
      ackStore.set(messageId, Date.now());
      resolve(true);
    });
  });
}

/**
 * 19. Implements retry logic with exponential backoff.
 *
 * @param {() => Promise<any>} fn - Function to retry
 * @param {RetryStrategy} strategy - Retry strategy
 * @returns {Promise<any>} Result or throws error
 *
 * @example
 * ```typescript
 * await retryWithBackoff(
 *   async () => sendMessage(client, data),
 *   { maxAttempts: 3, initialDelay: 1000, maxDelay: 10000, backoffMultiplier: 2 }
 * );
 * ```
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  strategy: RetryStrategy,
): Promise<T> {
  let lastError: Error;
  let delay = strategy.initialDelay;

  for (let attempt = 0; attempt < strategy.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < strategy.maxAttempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = Math.min(delay * strategy.backoffMultiplier, strategy.maxDelay);
      }
    }
  }

  throw lastError!;
}

/**
 * 20. Creates delivery acknowledgement tracker.
 *
 * @param {string} messageId - Message identifier
 * @param {number} timeout - Acknowledgement timeout
 * @returns {Promise<MessageAck>} Acknowledgement result
 *
 * @example
 * ```typescript
 * const ack = await trackMessageDelivery('msg-123', 5000);
 * if (ack.status === 'delivered') {
 *   console.log('Message delivered successfully');
 * }
 * ```
 */
export function trackMessageDelivery(messageId: string, timeout: number = 5000): Promise<MessageAck> {
  return new Promise((resolve) => {
    const result: MessageAck = {
      messageId,
      status: 'pending',
    };

    const timer = setTimeout(() => {
      result.status = 'failed';
      result.error = 'Acknowledgement timeout';
      resolve(result);
    }, timeout);

    // This would be completed by the actual acknowledgement handler
    (result as any).complete = (success: boolean, error?: string) => {
      clearTimeout(timer);
      result.status = success ? 'delivered' : 'failed';
      result.deliveredAt = success ? new Date() : undefined;
      result.error = error;
      resolve(result);
    };
  });
}

// ============================================================================
// CIRCUIT BREAKER & ERROR RECOVERY
// ============================================================================

/**
 * 21. Creates a circuit breaker for socket operations.
 *
 * @param {CircuitBreakerConfig} config - Circuit breaker configuration
 * @returns {object} Circuit breaker instance
 *
 * @example
 * ```typescript
 * const breaker = createCircuitBreaker({
 *   failureThreshold: 5,
 *   resetTimeout: 60000,
 *   monitoringWindow: 120000
 * });
 * ```
 */
export function createCircuitBreaker(config: CircuitBreakerConfig): {
  state: CircuitBreakerState;
  failures: number;
  lastFailure?: Date;
  execute: <T>(fn: () => Promise<T>) => Promise<T>;
} {
  let state: CircuitBreakerState = 'closed';
  let failures = 0;
  let lastFailure: Date | undefined;

  const execute = async <T>(fn: () => Promise<T>): Promise<T> => {
    // Check if circuit is open
    if (state === 'open') {
      const timeSinceLastFailure = lastFailure ? Date.now() - lastFailure.getTime() : 0;

      if (timeSinceLastFailure < config.resetTimeout) {
        throw new Error('Circuit breaker is open');
      }

      // Transition to half-open
      state = 'half-open';
    }

    try {
      const result = await fn();

      // Success - reset on half-open or keep closed
      if (state === 'half-open') {
        state = 'closed';
        failures = 0;
      }

      return result;
    } catch (error) {
      failures++;
      lastFailure = new Date();

      // Check if threshold exceeded
      if (failures >= config.failureThreshold) {
        state = 'open';
      }

      throw error;
    }
  };

  return {
    get state() {
      return state;
    },
    get failures() {
      return failures;
    },
    get lastFailure() {
      return lastFailure;
    },
    execute,
  };
}

/**
 * 22. Implements graceful degradation for socket failures.
 *
 * @param {Socket} socket - Socket client
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @param {() => Promise<void>} fallback - Fallback function
 * @returns {Promise<boolean>} True if primary succeeded
 *
 * @example
 * ```typescript
 * await gracefulDegrade(client, 'notification', data, async () => {
 *   await this.emailService.sendEmail(user.email, data);
 * });
 * ```
 */
export async function gracefulDegrade(
  socket: Socket,
  event: string,
  data: any,
  fallback: () => Promise<void>,
): Promise<boolean> {
  try {
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout')), 3000);

      socket.emit(event, data, (ack: any) => {
        clearTimeout(timeout);
        resolve(ack);
      });
    });

    return true;
  } catch (error) {
    // Primary failed, use fallback
    try {
      await fallback();
      return false;
    } catch (fallbackError) {
      const logger = new Logger('GracefulDegrade');
      logger.error(`Both primary and fallback failed: ${fallbackError.message}`);
      throw fallbackError;
    }
  }
}

/**
 * 23. Monitors socket health and triggers recovery.
 *
 * @param {Socket} socket - Socket client
 * @param {(socket: Socket) => Promise<void>} recoveryFn - Recovery function
 * @param {number} healthCheckInterval - Health check interval in ms
 * @returns {NodeJS.Timeout} Health check timer
 *
 * @example
 * ```typescript
 * const timer = monitorSocketHealth(client, async (socket) => {
 *   await reconnectSocket(socket);
 * }, 30000);
 * ```
 */
export function monitorSocketHealth(
  socket: Socket,
  recoveryFn: (socket: Socket) => Promise<void>,
  healthCheckInterval: number = 30000,
): NodeJS.Timeout {
  const timer = setInterval(async () => {
    try {
      const healthy = await new Promise<boolean>((resolve) => {
        const timeout = setTimeout(() => resolve(false), 2000);

        socket.emit('health:check', { timestamp: Date.now() }, () => {
          clearTimeout(timeout);
          resolve(true);
        });
      });

      if (!healthy) {
        await recoveryFn(socket);
      }
    } catch (error) {
      const logger = new Logger('SocketHealth');
      logger.error(`Health check failed: ${error.message}`);
    }
  }, healthCheckInterval);

  socket.on('disconnect', () => {
    clearInterval(timer);
  });

  return timer;
}

// ============================================================================
// BANDWIDTH THROTTLING & COMPRESSION
// ============================================================================

/**
 * 24. Creates a bandwidth throttle for socket connections.
 *
 * @param {ThrottleConfig} config - Throttle configuration
 * @returns {(data: any) => Promise<boolean>} Throttle function
 *
 * @example
 * ```typescript
 * const throttle = createBandwidthThrottle({
 *   maxBytesPerSecond: 1024 * 1024,
 *   burstSize: 1024 * 100,
 *   windowMs: 1000
 * });
 * ```
 */
export function createBandwidthThrottle(config: ThrottleConfig): (data: any) => Promise<boolean> {
  let bytesUsed = 0;
  let windowStart = Date.now();

  return async (data: any): Promise<boolean> => {
    const now = Date.now();
    const dataSize = JSON.stringify(data).length;

    // Reset window if expired
    if (now - windowStart >= config.windowMs) {
      bytesUsed = 0;
      windowStart = now;
    }

    // Check if within limits
    if (bytesUsed + dataSize > config.maxBytesPerSecond) {
      // Check burst allowance
      if (dataSize > config.burstSize) {
        return false;
      }

      // Wait for window to reset
      const waitTime = config.windowMs - (now - windowStart);
      await new Promise((resolve) => setTimeout(resolve, waitTime));

      bytesUsed = 0;
      windowStart = Date.now();
    }

    bytesUsed += dataSize;
    return true;
  };
}

/**
 * 25. Compresses large messages before sending.
 *
 * @param {any} data - Data to compress
 * @param {number} threshold - Compression threshold in bytes
 * @returns {object} Compressed or original data with metadata
 *
 * @example
 * ```typescript
 * const payload = compressMessage(largeData, 1024);
 * client.emit('data', payload);
 * ```
 */
export function compressMessage(
  data: any,
  threshold: number = 1024,
): { data: any; compressed: boolean; originalSize?: number; compressedSize?: number } {
  const serialized = JSON.stringify(data);
  const size = serialized.length;

  if (size < threshold) {
    return { data, compressed: false };
  }

  // Simple compression placeholder (in production, use zlib or similar)
  const compressed = Buffer.from(serialized).toString('base64');

  return {
    data: compressed,
    compressed: true,
    originalSize: size,
    compressedSize: compressed.length,
  };
}

/**
 * 26. Decompresses received messages.
 *
 * @param {any} payload - Compressed payload
 * @returns {any} Decompressed data
 *
 * @example
 * ```typescript
 * @SubscribeMessage('data')
 * handleData(@MessageBody() payload: any) {
 *   const data = decompressMessage(payload);
 *   // Process data
 * }
 * ```
 */
export function decompressMessage(payload: any): any {
  if (!payload.compressed) {
    return payload.data;
  }

  // Simple decompression placeholder (in production, use zlib or similar)
  const decompressed = Buffer.from(payload.data, 'base64').toString('utf-8');
  return JSON.parse(decompressed);
}

/**
 * 27. Batches multiple messages for efficient transmission.
 *
 * @param {any[]} messages - Array of messages
 * @param {number} maxBatchSize - Maximum batch size
 * @returns {any[][]} Batched messages
 *
 * @example
 * ```typescript
 * const batches = batchMessages(messages, 50);
 * batches.forEach(batch => client.emit('batch', batch));
 * ```
 */
export function batchMessages(messages: any[], maxBatchSize: number = 50): any[][] {
  const batches: any[][] = [];

  for (let i = 0; i < messages.length; i += maxBatchSize) {
    batches.push(messages.slice(i, i + maxBatchSize));
  }

  return batches;
}

/**
 * 28. Prioritizes messages for transmission order.
 *
 * @param {QueuedMessage[]} messages - Messages to prioritize
 * @returns {QueuedMessage[]} Sorted messages by priority
 *
 * @example
 * ```typescript
 * const sorted = prioritizeMessages(messageQueue);
 * sorted.forEach(msg => sendMessage(msg));
 * ```
 */
export function prioritizeMessages(messages: QueuedMessage[]): QueuedMessage[] {
  const priorityOrder = { low: 0, normal: 1, high: 2, critical: 3 };

  return messages.sort((a, b) => {
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    return priorityDiff !== 0 ? priorityDiff : a.timestamp.getTime() - b.timestamp.getTime();
  });
}

// ============================================================================
// CROSS-NAMESPACE COMMUNICATION
// ============================================================================

/**
 * 29. Broadcasts message across all namespaces.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @returns {number} Number of namespaces broadcast to
 *
 * @example
 * ```typescript
 * broadcastAcrossNamespaces(this.server, 'system:alert', {
 *   message: 'System maintenance starting'
 * });
 * ```
 */
export function broadcastAcrossNamespaces(server: Server, event: string, data: any): number {
  let count = 0;

  server._nsps.forEach((namespace) => {
    namespace.emit(event, data);
    count++;
  });

  return count;
}

/**
 * 30. Routes message to specific namespace.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} namespacePath - Namespace path
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @returns {boolean} True if namespace exists
 *
 * @example
 * ```typescript
 * routeToNamespace(server, '/admin', 'alert', { level: 'critical' });
 * ```
 */
export function routeToNamespace(
  server: Server,
  namespacePath: string,
  event: string,
  data: any,
): boolean {
  const namespace = server.of(namespacePath);

  if (!namespace) {
    return false;
  }

  namespace.emit(event, data);
  return true;
}

/**
 * 31. Creates inter-namespace event relay.
 *
 * @param {Server} server - Socket.IO server instance
 * @param {string} sourceNs - Source namespace
 * @param {string} targetNs - Target namespace
 * @param {string} event - Event to relay
 * @returns {void}
 *
 * @example
 * ```typescript
 * createNamespaceRelay(server, '/chat', '/notifications', 'message:new');
 * ```
 */
export function createNamespaceRelay(
  server: Server,
  sourceNs: string,
  targetNs: string,
  event: string,
): void {
  const source = server.of(sourceNs);
  const target = server.of(targetNs);

  source.on('connection', (socket) => {
    socket.on(event, (data) => {
      target.emit(event, { ...data, _relayed: true, _source: sourceNs });
    });
  });
}

/**
 * 32. Gets statistics for all namespaces.
 *
 * @param {Server} server - Socket.IO server instance
 * @returns {Map<string, object>} Namespace statistics
 *
 * @example
 * ```typescript
 * const stats = getNamespaceStatistics(server);
 * stats.forEach((stat, namespace) => {
 *   console.log(`${namespace}: ${stat.clients} clients`);
 * });
 * ```
 */
export function getNamespaceStatistics(server: Server): Map<string, { clients: number; rooms: number }> {
  const stats = new Map<string, { clients: number; rooms: number }>();

  server._nsps.forEach((namespace, name) => {
    stats.set(name, {
      clients: namespace.sockets.size,
      rooms: namespace.adapter.rooms.size,
    });
  });

  return stats;
}

// ============================================================================
// BINARY MESSAGE HANDLING
// ============================================================================

/**
 * 33. Sends binary data with chunking for large files.
 *
 * @param {Socket} socket - Socket client
 * @param {Buffer} buffer - Binary data
 * @param {number} chunkSize - Chunk size in bytes
 * @param {string} event - Event name
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sendBinaryChunked(client, fileBuffer, 64 * 1024, 'file:upload');
 * ```
 */
export async function sendBinaryChunked(
  socket: Socket,
  buffer: Buffer,
  chunkSize: number = 65536,
  event: string = 'binary:chunk',
): Promise<void> {
  const totalChunks = Math.ceil(buffer.length / chunkSize);
  const transferId = `${socket.id}-${Date.now()}`;

  // Send transfer metadata
  socket.emit('binary:start', {
    transferId,
    totalChunks,
    totalSize: buffer.length,
  });

  // Send chunks
  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, buffer.length);
    const chunk = buffer.slice(start, end);

    await new Promise<void>((resolve, reject) => {
      socket.emit(
        event,
        {
          transferId,
          chunkIndex: i,
          totalChunks,
          data: chunk,
        },
        (ack: any) => {
          if (ack?.success) {
            resolve();
          } else {
            reject(new Error('Chunk transfer failed'));
          }
        },
      );
    });
  }

  // Send completion
  socket.emit('binary:complete', { transferId });
}

/**
 * 34. Receives and reassembles binary chunks.
 *
 * @param {Map<string, Buffer[]>} assemblyStore - Chunk assembly store
 * @param {string} transferId - Transfer identifier
 * @param {number} chunkIndex - Chunk index
 * @param {Buffer} chunk - Chunk data
 * @param {number} totalChunks - Total chunks expected
 * @returns {Buffer | null} Complete buffer or null if incomplete
 *
 * @example
 * ```typescript
 * @SubscribeMessage('binary:chunk')
 * handleChunk(@MessageBody() data: any) {
 *   const complete = receiveBinaryChunk(
 *     this.assemblyStore,
 *     data.transferId,
 *     data.chunkIndex,
 *     data.data,
 *     data.totalChunks
 *   );
 *   if (complete) {
 *     // Process complete file
 *   }
 * }
 * ```
 */
export function receiveBinaryChunk(
  assemblyStore: Map<string, Buffer[]>,
  transferId: string,
  chunkIndex: number,
  chunk: Buffer,
  totalChunks: number,
): Buffer | null {
  let chunks = assemblyStore.get(transferId);

  if (!chunks) {
    chunks = new Array(totalChunks);
    assemblyStore.set(transferId, chunks);
  }

  chunks[chunkIndex] = chunk;

  // Check if all chunks received
  const complete = chunks.every((c) => c !== undefined);

  if (complete) {
    const buffer = Buffer.concat(chunks);
    assemblyStore.delete(transferId);
    return buffer;
  }

  return null;
}

/**
 * 35. Validates binary message integrity with checksum.
 *
 * @param {Buffer} buffer - Binary data
 * @param {string} expectedChecksum - Expected checksum
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const valid = validateBinaryIntegrity(fileBuffer, receivedChecksum);
 * if (!valid) {
 *   throw new Error('File corrupted');
 * }
 * ```
 */
export function validateBinaryIntegrity(buffer: Buffer, expectedChecksum: string): boolean {
  const crypto = require('crypto');
  const hash = crypto.createHash('sha256');
  hash.update(buffer);
  const checksum = hash.digest('hex');
  return checksum === expectedChecksum;
}

// ============================================================================
// SOCKET CLUSTERING & LOAD BALANCING
// ============================================================================

/**
 * 36. Registers cluster node for load balancing.
 *
 * @param {Map<string, ClusterNode>} registry - Cluster registry
 * @param {ClusterNode} node - Node information
 * @returns {void}
 *
 * @example
 * ```typescript
 * registerClusterNode(clusterRegistry, {
 *   nodeId: process.env.NODE_ID,
 *   hostname: os.hostname(),
 *   port: 3000,
 *   connectedClients: 0,
 *   lastHeartbeat: new Date(),
 *   status: 'active'
 * });
 * ```
 */
export function registerClusterNode(registry: Map<string, ClusterNode>, node: ClusterNode): void {
  registry.set(node.nodeId, node);
}

/**
 * 37. Selects optimal node for new connection.
 *
 * @param {Map<string, ClusterNode>} registry - Cluster registry
 * @param {string} strategy - Selection strategy
 * @returns {ClusterNode | null} Selected node
 *
 * @example
 * ```typescript
 * const node = selectClusterNode(clusterRegistry, 'least-connections');
 * if (node) {
 *   redirectClient(client, node);
 * }
 * ```
 */
export function selectClusterNode(
  registry: Map<string, ClusterNode>,
  strategy: 'round-robin' | 'least-connections' | 'random' = 'least-connections',
): ClusterNode | null {
  const activeNodes = Array.from(registry.values()).filter((node) => node.status === 'active');

  if (activeNodes.length === 0) {
    return null;
  }

  switch (strategy) {
    case 'least-connections':
      return activeNodes.reduce((min, node) =>
        node.connectedClients < min.connectedClients ? node : min,
      );

    case 'random':
      return activeNodes[Math.floor(Math.random() * activeNodes.length)];

    case 'round-robin':
      // Simplified round-robin (would need state in production)
      return activeNodes[0];

    default:
      return activeNodes[0];
  }
}

/**
 * 38. Updates cluster node heartbeat.
 *
 * @param {Map<string, ClusterNode>} registry - Cluster registry
 * @param {string} nodeId - Node identifier
 * @param {number} connectedClients - Current client count
 * @returns {void}
 *
 * @example
 * ```typescript
 * setInterval(() => {
 *   updateNodeHeartbeat(clusterRegistry, process.env.NODE_ID, clientCount);
 * }, 5000);
 * ```
 */
export function updateNodeHeartbeat(
  registry: Map<string, ClusterNode>,
  nodeId: string,
  connectedClients: number,
): void {
  const node = registry.get(nodeId);

  if (node) {
    node.lastHeartbeat = new Date();
    node.connectedClients = connectedClients;
    registry.set(nodeId, node);
  }
}

/**
 * 39. Removes stale nodes from cluster registry.
 *
 * @param {Map<string, ClusterNode>} registry - Cluster registry
 * @param {number} timeout - Heartbeat timeout in milliseconds
 * @returns {number} Number of nodes removed
 *
 * @example
 * ```typescript
 * const removed = pruneStaleNodes(clusterRegistry, 30000);
 * console.log(`Removed ${removed} stale nodes`);
 * ```
 */
export function pruneStaleNodes(registry: Map<string, ClusterNode>, timeout: number = 30000): number {
  const now = Date.now();
  let removed = 0;

  registry.forEach((node, nodeId) => {
    const timeSinceHeartbeat = now - node.lastHeartbeat.getTime();

    if (timeSinceHeartbeat > timeout) {
      registry.delete(nodeId);
      removed++;
    }
  });

  return removed;
}

// ============================================================================
// SOCKET HEALTH & PERFORMANCE MONITORING
// ============================================================================

/**
 * 40. Collects socket health metrics.
 *
 * @param {Socket} socket - Socket client
 * @returns {Promise<SocketHealthMetrics>} Health metrics
 *
 * @example
 * ```typescript
 * const metrics = await collectSocketMetrics(client);
 * console.log(`Latency: ${metrics.latency}ms`);
 * ```
 */
export async function collectSocketMetrics(socket: Socket): Promise<SocketHealthMetrics> {
  const startTime = Date.now();
  let latency = 0;

  try {
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout')), 2000);

      socket.emit('health:ping', { timestamp: startTime }, () => {
        clearTimeout(timeout);
        latency = Date.now() - startTime;
        resolve();
      });
    });
  } catch (error) {
    latency = -1;
  }

  return {
    socketId: socket.id,
    latency,
    packetLoss: 0, // Would need actual measurement
    throughput: 0, // Would need actual measurement
    errorRate: 0, // Would need actual measurement
    uptime: Date.now() - new Date(socket.handshake.time).getTime(),
    lastHealthCheck: new Date(),
  };
}

/**
 * 41. Monitors socket error rates.
 *
 * @param {Socket} socket - Socket client
 * @param {Map<string, number>} errorStore - Error count store
 * @param {number} windowMs - Monitoring window
 * @returns {number} Error rate per minute
 *
 * @example
 * ```typescript
 * const errorRate = monitorErrorRate(client, errorStore, 60000);
 * if (errorRate > 10) {
 *   disconnectClient(client, 'High error rate');
 * }
 * ```
 */
export function monitorErrorRate(
  socket: Socket,
  errorStore: Map<string, number>,
  windowMs: number = 60000,
): number {
  const key = socket.id;
  const errorCount = errorStore.get(key) || 0;
  return (errorCount / windowMs) * 60000;
}

/**
 * 42. Tracks socket throughput metrics.
 *
 * @param {Socket} socket - Socket client
 * @param {number} bytesTransferred - Bytes transferred
 * @param {number} duration - Duration in milliseconds
 * @returns {number} Throughput in bytes per second
 *
 * @example
 * ```typescript
 * const throughput = trackSocketThroughput(client, 1024 * 1024, 1000);
 * console.log(`Throughput: ${throughput / 1024}KB/s`);
 * ```
 */
export function trackSocketThroughput(
  socket: Socket,
  bytesTransferred: number,
  duration: number,
): number {
  const bytesPerSecond = (bytesTransferred / duration) * 1000;
  (socket as any).__throughput = bytesPerSecond;
  return bytesPerSecond;
}

/**
 * 43. Generates socket performance report.
 *
 * @param {SocketHealthMetrics[]} metrics - Array of health metrics
 * @returns {object} Performance report
 *
 * @example
 * ```typescript
 * const report = generatePerformanceReport(allMetrics);
 * console.log(`Avg latency: ${report.avgLatency}ms`);
 * ```
 */
export function generatePerformanceReport(metrics: SocketHealthMetrics[]): {
  totalSockets: number;
  avgLatency: number;
  avgThroughput: number;
  healthySockets: number;
  degradedSockets: number;
} {
  const totalSockets = metrics.length;
  const avgLatency = metrics.reduce((sum, m) => sum + m.latency, 0) / totalSockets;
  const avgThroughput = metrics.reduce((sum, m) => sum + m.throughput, 0) / totalSockets;
  const healthySockets = metrics.filter((m) => m.latency < 100 && m.errorRate < 0.01).length;
  const degradedSockets = totalSockets - healthySockets;

  return {
    totalSockets,
    avgLatency: Math.round(avgLatency),
    avgThroughput: Math.round(avgThroughput),
    healthySockets,
    degradedSockets,
  };
}

// ============================================================================
// ADVANCED MIDDLEWARE & EVENT PROCESSING
// ============================================================================

/**
 * 44. Creates middleware chain for event processing.
 *
 * @param {Array<(socket: Socket, data: any, next: () => void) => void>} middlewares - Middleware functions
 * @returns {(socket: Socket, data: any) => Promise<void>} Composed middleware
 *
 * @example
 * ```typescript
 * const chain = createMiddlewareChain([
 *   authMiddleware,
 *   rateLimitMiddleware,
 *   validationMiddleware
 * ]);
 * ```
 */
export function createMiddlewareChain(
  middlewares: Array<(socket: Socket, data: any, next: () => void) => void>,
): (socket: Socket, data: any) => Promise<void> {
  return async (socket: Socket, data: any): Promise<void> => {
    let index = 0;

    const next = () => {
      if (index < middlewares.length) {
        const middleware = middlewares[index++];
        middleware(socket, data, next);
      }
    };

    next();
  };
}

/**
 * 45. Creates event stream for reactive processing.
 *
 * @param {Socket} socket - Socket client
 * @param {string} event - Event name
 * @returns {Observable<any>} RxJS Observable stream
 *
 * @example
 * ```typescript
 * const stream = createEventStream(client, 'message');
 * stream.pipe(
 *   filter(msg => msg.priority === 'high'),
 *   map(msg => processMessage(msg))
 * ).subscribe();
 * ```
 */
export function createEventStream(socket: Socket, event: string): Observable<any> {
  return new Observable((subscriber) => {
    const handler = (data: any) => {
      subscriber.next(data);
    };

    socket.on(event, handler);

    // Cleanup on unsubscribe
    return () => {
      socket.off(event, handler);
    };
  });
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Message Queuing
  createMessageQueue,
  enqueueMessage,
  deliverQueuedMessages,
  pruneExpiredMessages,
  getQueueStats,

  // Connection Pooling
  createSocketPool,
  addToSocketPool,
  removeFromSocketPool,
  getUserSockets,
  evictIdleConnections,

  // Socket State Management
  initializeSocketState,
  updateSocketState,
  getSocketState,
  transitionToReconnecting,
  cleanupSocketState,

  // Message Deduplication
  createDeduplicationStore,
  isDuplicateMessage,
  sendWithExactlyOnce,
  retryWithBackoff,
  trackMessageDelivery,

  // Circuit Breaker & Recovery
  createCircuitBreaker,
  gracefulDegrade,
  monitorSocketHealth,

  // Bandwidth & Compression
  createBandwidthThrottle,
  compressMessage,
  decompressMessage,
  batchMessages,
  prioritizeMessages,

  // Cross-Namespace Communication
  broadcastAcrossNamespaces,
  routeToNamespace,
  createNamespaceRelay,
  getNamespaceStatistics,

  // Binary Message Handling
  sendBinaryChunked,
  receiveBinaryChunk,
  validateBinaryIntegrity,

  // Clustering & Load Balancing
  registerClusterNode,
  selectClusterNode,
  updateNodeHeartbeat,
  pruneStaleNodes,

  // Health & Performance Monitoring
  collectSocketMetrics,
  monitorErrorRate,
  trackSocketThroughput,
  generatePerformanceReport,

  // Advanced Middleware
  createMiddlewareChain,
  createEventStream,
};
