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
import { Server, Socket } from 'socket.io';
import { Observable } from 'rxjs';
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
export declare function createMessageQueue(maxQueueSize?: number, defaultTtl?: number): Map<string, QueuedMessage[]>;
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
export declare function enqueueMessage(queue: Map<string, QueuedMessage[]>, userId: string, message: QueuedMessage, maxQueueSize?: number): boolean;
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
export declare function deliverQueuedMessages(queue: Map<string, QueuedMessage[]>, client: Socket, userId: string): Promise<number>;
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
export declare function pruneExpiredMessages(queue: Map<string, QueuedMessage[]>): number;
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
export declare function getQueueStats(queue: Map<string, QueuedMessage[]>): {
    totalUsers: number;
    totalMessages: number;
    avgMessagesPerUser: number;
    priorityBreakdown: Record<string, number>;
};
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
export declare function createSocketPool(config: SocketPoolConfig): Map<string, Socket[]>;
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
export declare function addToSocketPool(pool: Map<string, Socket[]>, userId: string, socket: Socket, maxConnections?: number): boolean;
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
export declare function removeFromSocketPool(pool: Map<string, Socket[]>, userId: string, socketId: string): boolean;
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
export declare function getUserSockets(pool: Map<string, Socket[]>, userId: string): Socket[];
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
export declare function evictIdleConnections(pool: Map<string, Socket[]>, idleTimeout: number): number;
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
export declare function initializeSocketState(socket: Socket): SocketState;
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
export declare function updateSocketState(stateStore: Map<string, SocketState>, socketId: string, updates: Partial<SocketState>): SocketState | null;
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
export declare function getSocketState(stateStore: Map<string, SocketState>, socketId: string): SocketState | null;
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
export declare function transitionToReconnecting(stateStore: Map<string, SocketState>, socketId: string, maxAttempts?: number): boolean;
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
export declare function cleanupSocketState(stateStore: Map<string, SocketState>, socketId: string): void;
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
export declare function createDeduplicationStore(ttl?: number): Map<string, number>;
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
export declare function isDuplicateMessage(store: Map<string, number>, messageId: string, ttl?: number): boolean;
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
export declare function sendWithExactlyOnce(socket: Socket, event: string, data: any, ackStore: Map<string, number>): Promise<boolean>;
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
export declare function retryWithBackoff<T>(fn: () => Promise<T>, strategy: RetryStrategy): Promise<T>;
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
export declare function trackMessageDelivery(messageId: string, timeout?: number): Promise<MessageAck>;
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
export declare function createCircuitBreaker(config: CircuitBreakerConfig): {
    state: CircuitBreakerState;
    failures: number;
    lastFailure?: Date;
    execute: <T>(fn: () => Promise<T>) => Promise<T>;
};
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
export declare function gracefulDegrade(socket: Socket, event: string, data: any, fallback: () => Promise<void>): Promise<boolean>;
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
export declare function monitorSocketHealth(socket: Socket, recoveryFn: (socket: Socket) => Promise<void>, healthCheckInterval?: number): NodeJS.Timeout;
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
export declare function createBandwidthThrottle(config: ThrottleConfig): (data: any) => Promise<boolean>;
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
export declare function compressMessage(data: any, threshold?: number): {
    data: any;
    compressed: boolean;
    originalSize?: number;
    compressedSize?: number;
};
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
export declare function decompressMessage(payload: any): any;
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
export declare function batchMessages(messages: any[], maxBatchSize?: number): any[][];
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
export declare function prioritizeMessages(messages: QueuedMessage[]): QueuedMessage[];
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
export declare function broadcastAcrossNamespaces(server: Server, event: string, data: any): number;
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
export declare function routeToNamespace(server: Server, namespacePath: string, event: string, data: any): boolean;
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
export declare function createNamespaceRelay(server: Server, sourceNs: string, targetNs: string, event: string): void;
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
export declare function getNamespaceStatistics(server: Server): Map<string, {
    clients: number;
    rooms: number;
}>;
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
export declare function sendBinaryChunked(socket: Socket, buffer: Buffer, chunkSize?: number, event?: string): Promise<void>;
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
export declare function receiveBinaryChunk(assemblyStore: Map<string, Buffer[]>, transferId: string, chunkIndex: number, chunk: Buffer, totalChunks: number): Buffer | null;
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
export declare function validateBinaryIntegrity(buffer: Buffer, expectedChecksum: string): boolean;
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
export declare function registerClusterNode(registry: Map<string, ClusterNode>, node: ClusterNode): void;
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
export declare function selectClusterNode(registry: Map<string, ClusterNode>, strategy?: 'round-robin' | 'least-connections' | 'random'): ClusterNode | null;
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
export declare function updateNodeHeartbeat(registry: Map<string, ClusterNode>, nodeId: string, connectedClients: number): void;
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
export declare function pruneStaleNodes(registry: Map<string, ClusterNode>, timeout?: number): number;
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
export declare function collectSocketMetrics(socket: Socket): Promise<SocketHealthMetrics>;
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
export declare function monitorErrorRate(socket: Socket, errorStore: Map<string, number>, windowMs?: number): number;
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
export declare function trackSocketThroughput(socket: Socket, bytesTransferred: number, duration: number): number;
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
export declare function generatePerformanceReport(metrics: SocketHealthMetrics[]): {
    totalSockets: number;
    avgLatency: number;
    avgThroughput: number;
    healthySockets: number;
    degradedSockets: number;
};
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
export declare function createMiddlewareChain(middlewares: Array<(socket: Socket, data: any, next: () => void) => void>): (socket: Socket, data: any) => Promise<void>;
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
export declare function createEventStream(socket: Socket, event: string): Observable<any>;
declare const _default: {
    createMessageQueue: typeof createMessageQueue;
    enqueueMessage: typeof enqueueMessage;
    deliverQueuedMessages: typeof deliverQueuedMessages;
    pruneExpiredMessages: typeof pruneExpiredMessages;
    getQueueStats: typeof getQueueStats;
    createSocketPool: typeof createSocketPool;
    addToSocketPool: typeof addToSocketPool;
    removeFromSocketPool: typeof removeFromSocketPool;
    getUserSockets: typeof getUserSockets;
    evictIdleConnections: typeof evictIdleConnections;
    initializeSocketState: typeof initializeSocketState;
    updateSocketState: typeof updateSocketState;
    getSocketState: typeof getSocketState;
    transitionToReconnecting: typeof transitionToReconnecting;
    cleanupSocketState: typeof cleanupSocketState;
    createDeduplicationStore: typeof createDeduplicationStore;
    isDuplicateMessage: typeof isDuplicateMessage;
    sendWithExactlyOnce: typeof sendWithExactlyOnce;
    retryWithBackoff: typeof retryWithBackoff;
    trackMessageDelivery: typeof trackMessageDelivery;
    createCircuitBreaker: typeof createCircuitBreaker;
    gracefulDegrade: typeof gracefulDegrade;
    monitorSocketHealth: typeof monitorSocketHealth;
    createBandwidthThrottle: typeof createBandwidthThrottle;
    compressMessage: typeof compressMessage;
    decompressMessage: typeof decompressMessage;
    batchMessages: typeof batchMessages;
    prioritizeMessages: typeof prioritizeMessages;
    broadcastAcrossNamespaces: typeof broadcastAcrossNamespaces;
    routeToNamespace: typeof routeToNamespace;
    createNamespaceRelay: typeof createNamespaceRelay;
    getNamespaceStatistics: typeof getNamespaceStatistics;
    sendBinaryChunked: typeof sendBinaryChunked;
    receiveBinaryChunk: typeof receiveBinaryChunk;
    validateBinaryIntegrity: typeof validateBinaryIntegrity;
    registerClusterNode: typeof registerClusterNode;
    selectClusterNode: typeof selectClusterNode;
    updateNodeHeartbeat: typeof updateNodeHeartbeat;
    pruneStaleNodes: typeof pruneStaleNodes;
    collectSocketMetrics: typeof collectSocketMetrics;
    monitorErrorRate: typeof monitorErrorRate;
    trackSocketThroughput: typeof trackSocketThroughput;
    generatePerformanceReport: typeof generatePerformanceReport;
    createMiddlewareChain: typeof createMiddlewareChain;
    createEventStream: typeof createEventStream;
};
export default _default;
//# sourceMappingURL=websocket-kit.d.ts.map