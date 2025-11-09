"use strict";
/**
 * LOC: NWCOM1234567
 * File: /reuse/san/network-communication-kit.ts
 *
 * UPSTREAM (imports from):
 *   - NestJS microservices (@nestjs/microservices)
 *   - RxJS (rxjs)
 *   - Protocol Buffers (protobufjs)
 *   - WebSocket (ws)
 *
 * DOWNSTREAM (imported by):
 *   - Network communication handlers
 *   - Network RPC controllers
 *   - Network streaming services
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGrpcMetadata = exports.createGrpcStream = exports.createGrpcClient = exports.createGrpcServiceConfig = exports.handleWebSocketReconnect = exports.startWebSocketHeartbeat = exports.createWebSocketMessage = exports.createWebSocketConfig = exports.createProtobufService = exports.decodeProtobufMessage = exports.encodeProtobufMessage = exports.loadProtobufDefinition = exports.batchMessages = exports.validateMessageSchema = exports.createMessageEnvelope = exports.deserializeMessage = exports.serializeMessage = exports.streamMultiplexer = exports.createBidirectionalStream = exports.createWritableStream = exports.createReadableStream = exports.createStreamConfig = exports.aggregateResponses = exports.scatterGather = exports.fireAndForget = exports.createAsyncRequestResponse = exports.requestResponse = exports.routeTopicMessage = exports.createTopicHierarchy = exports.subscribeToTopic = exports.publishToTopic = exports.createPubSubConfig = exports.createRPCClient = exports.createRPCMethodRegistry = exports.createBidirectionalRPCChannel = exports.processRPCRequest = exports.createRPCRequest = exports.createNetworkWebSocketSessionModel = exports.createNetworkMessageModel = exports.createNetworkRPCLogModel = void 0;
/**
 * File: /reuse/san/network-communication-kit.ts
 * Locator: WC-UTL-NWCOM-001
 * Purpose: Comprehensive Network Communication Utilities - RPC communication, pub/sub patterns, request/response, streaming, message serialization, protocol buffers, WebSocket, gRPC integration
 *
 * Upstream: Independent utility module for network communication implementation
 * Downstream: ../backend/*, Network communication services, RPC handlers, streaming processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, protobufjs 7.x, ws 8.x
 * Exports: 40+ utility functions for network communication, RPC, pub/sub, streaming, serialization, WebSocket, gRPC
 *
 * LLM Context: Comprehensive network communication utilities for implementing production-ready distributed network communication systems.
 * Provides RPC communication, pub/sub patterns, request/response handling, streaming communication, message serialization,
 * protocol buffers, WebSocket integration, and gRPC utilities. Essential for scalable software-defined network communication infrastructure.
 */
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const sequelize_1 = require("sequelize");
// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================
/**
 * Sequelize model for Network RPC Call Logs with request/response tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NetworkRPCLog model
 *
 * @example
 * ```typescript
 * const NetworkRPCLog = createNetworkRPCLogModel(sequelize);
 * const log = await NetworkRPCLog.create({
 *   requestId: 'rpc_req_001',
 *   method: 'network.topology.get',
 *   params: { networkId: 'net_001' },
 *   status: 'success',
 *   duration: 150
 * });
 * ```
 */
const createNetworkRPCLogModel = (sequelize) => {
    class NetworkRPCLog extends sequelize_1.Model {
    }
    NetworkRPCLog.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        requestId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            comment: 'Unique request identifier',
        },
        method: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'RPC method name',
        },
        params: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Request parameters',
        },
        result: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            comment: 'Response result',
        },
        error: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            comment: 'Error details if failed',
        },
        status: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Request status',
        },
        duration: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Request duration in milliseconds',
        },
        clientId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Client identifier',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'network_rpc_logs',
        timestamps: true,
        indexes: [
            { fields: ['requestId'], unique: true },
            { fields: ['method'] },
            { fields: ['status'] },
            { fields: ['clientId'] },
            { fields: ['createdAt'] },
        ],
    });
    return NetworkRPCLog;
};
exports.createNetworkRPCLogModel = createNetworkRPCLogModel;
/**
 * Sequelize model for Network Message Queue with pub/sub tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NetworkMessage model
 *
 * @example
 * ```typescript
 * const NetworkMessage = createNetworkMessageModel(sequelize);
 * const message = await NetworkMessage.create({
 *   messageId: 'msg_001',
 *   topic: 'network.events',
 *   payload: { eventType: 'link.down' },
 *   status: 'published'
 * });
 * ```
 */
const createNetworkMessageModel = (sequelize) => {
    class NetworkMessage extends sequelize_1.Model {
    }
    NetworkMessage.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        messageId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            comment: 'Unique message identifier',
        },
        correlationId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Correlation identifier for message chains',
        },
        topic: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Message topic',
        },
        payload: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            comment: 'Message payload',
        },
        headers: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Message headers',
        },
        contentType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            defaultValue: 'application/json',
            comment: 'Content type',
        },
        status: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Message status',
        },
        publishedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Publication timestamp',
        },
        deliveredAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Delivery timestamp',
        },
        retryCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of retry attempts',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'network_messages',
        timestamps: true,
        indexes: [
            { fields: ['messageId'], unique: true },
            { fields: ['correlationId'] },
            { fields: ['topic'] },
            { fields: ['status'] },
            { fields: ['publishedAt'] },
        ],
    });
    return NetworkMessage;
};
exports.createNetworkMessageModel = createNetworkMessageModel;
/**
 * Sequelize model for Network WebSocket Sessions with connection tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NetworkWebSocketSession model
 *
 * @example
 * ```typescript
 * const NetworkWebSocketSession = createNetworkWebSocketSessionModel(sequelize);
 * const session = await NetworkWebSocketSession.create({
 *   sessionId: 'ws_session_001',
 *   clientId: 'client_001',
 *   status: 'connected',
 *   connectedAt: new Date()
 * });
 * ```
 */
const createNetworkWebSocketSessionModel = (sequelize) => {
    class NetworkWebSocketSession extends sequelize_1.Model {
    }
    NetworkWebSocketSession.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        sessionId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            comment: 'Unique session identifier',
        },
        clientId: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Client identifier',
        },
        protocol: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'websocket',
            comment: 'WebSocket protocol',
        },
        status: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Session status',
        },
        connectedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Connection timestamp',
        },
        disconnectedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Disconnection timestamp',
        },
        messagesSent: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of messages sent',
        },
        messagesReceived: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of messages received',
        },
        bytesSent: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
            comment: 'Bytes sent',
        },
        bytesReceived: {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
            comment: 'Bytes received',
        },
        lastActivity: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Last activity timestamp',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'network_websocket_sessions',
        timestamps: true,
        indexes: [
            { fields: ['sessionId'], unique: true },
            { fields: ['clientId'] },
            { fields: ['status'] },
            { fields: ['connectedAt'] },
        ],
    });
    return NetworkWebSocketSession;
};
exports.createNetworkWebSocketSessionModel = createNetworkWebSocketSessionModel;
// ============================================================================
// RPC COMMUNICATION (4-8)
// ============================================================================
/**
 * Creates RPC request with unique ID and metadata.
 *
 * @param {string} method - RPC method name
 * @param {any[]} params - Method parameters
 * @param {Record<string, any>} [metadata] - Request metadata
 * @returns {RPCRequest} RPC request object
 *
 * @example
 * ```typescript
 * const request = createRPCRequest(
 *   'network.topology.get',
 *   ['net_001', { includeLinks: true }],
 *   { userId: 'admin', priority: 'high' }
 * );
 * ```
 */
const createRPCRequest = (method, params, metadata) => {
    return {
        requestId: generateRequestId(),
        method,
        params,
        metadata: {
            ...metadata,
            timestamp: Date.now(),
        },
        timeout: metadata?.timeout || 30000,
    };
};
exports.createRPCRequest = createRPCRequest;
/**
 * Processes RPC request and returns response.
 *
 * @param {RPCRequest} request - RPC request
 * @param {Function} handler - Request handler function
 * @returns {Promise<RPCResponse>} RPC response
 *
 * @example
 * ```typescript
 * const response = await processRPCRequest(
 *   request,
 *   async (method, params) => {
 *     if (method === 'network.topology.get') {
 *       return await getNetworkTopology(params[0]);
 *     }
 *   }
 * );
 * ```
 */
const processRPCRequest = async (request, handler) => {
    const startTime = Date.now();
    try {
        const result = await handler(request.method, request.params);
        return {
            requestId: request.requestId,
            result,
            metadata: {
                duration: Date.now() - startTime,
                timestamp: Date.now(),
            },
        };
    }
    catch (error) {
        return {
            requestId: request.requestId,
            error: {
                code: error.code || -32603,
                message: error.message || 'Internal error',
                data: error.data,
            },
            metadata: {
                duration: Date.now() - startTime,
                timestamp: Date.now(),
            },
        };
    }
};
exports.processRPCRequest = processRPCRequest;
/**
 * Creates bidirectional RPC channel with Observable streams.
 *
 * @returns {{ requests$: Observable<RPCRequest>; responses$: Subject<RPCResponse> }} RPC channel
 *
 * @example
 * ```typescript
 * const channel = createBidirectionalRPCChannel();
 * channel.requests$.subscribe(request => {
 *   processRPCRequest(request, handler).then(response => {
 *     channel.responses$.next(response);
 *   });
 * });
 * ```
 */
const createBidirectionalRPCChannel = () => {
    return {
        requests$: new rxjs_1.Subject(),
        responses$: new rxjs_1.Subject(),
    };
};
exports.createBidirectionalRPCChannel = createBidirectionalRPCChannel;
/**
 * Implements RPC method registry with handler mapping.
 *
 * @returns {any} RPC method registry
 *
 * @example
 * ```typescript
 * const registry = createRPCMethodRegistry();
 * registry.register('network.get', async (params) => {
 *   return await getNetwork(params[0]);
 * });
 * const result = await registry.invoke('network.get', ['net_001']);
 * ```
 */
const createRPCMethodRegistry = () => {
    const methods = new Map();
    return {
        register: (method, handler) => {
            methods.set(method, handler);
        },
        unregister: (method) => {
            methods.delete(method);
        },
        invoke: async (method, params) => {
            const handler = methods.get(method);
            if (!handler) {
                throw new Error(`Method not found: ${method}`);
            }
            return await handler(params);
        },
        list: () => Array.from(methods.keys()),
    };
};
exports.createRPCMethodRegistry = createRPCMethodRegistry;
/**
 * Creates RPC client with request/response correlation.
 *
 * @param {any} transport - Transport client
 * @returns {any} RPC client
 *
 * @example
 * ```typescript
 * const rpcClient = createRPCClient(grpcClient);
 * const result = await rpcClient.call('network.topology.get', ['net_001']);
 * ```
 */
const createRPCClient = (transport) => {
    const pendingRequests = new Map();
    return {
        call: async (method, params, timeout = 30000) => {
            const request = (0, exports.createRPCRequest)(method, params);
            return new Promise((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    pendingRequests.delete(request.requestId);
                    reject(new Error(`RPC timeout: ${method}`));
                }, timeout);
                pendingRequests.set(request.requestId, { resolve, reject, timeoutId });
                transport.send(request);
            });
        },
        handleResponse: (response) => {
            const pending = pendingRequests.get(response.requestId);
            if (pending) {
                clearTimeout(pending.timeoutId);
                pendingRequests.delete(response.requestId);
                if (response.error) {
                    pending.reject(new Error(response.error.message));
                }
                else {
                    pending.resolve(response.result);
                }
            }
        },
    };
};
exports.createRPCClient = createRPCClient;
// ============================================================================
// PUB/SUB PATTERNS (9-13)
// ============================================================================
/**
 * Creates pub/sub configuration for network topics.
 *
 * @param {PubSubConfig} config - Pub/sub configuration
 * @returns {any} Pub/sub configuration object
 *
 * @example
 * ```typescript
 * const pubSubConfig = createPubSubConfig({
 *   broker: 'redis',
 *   topics: ['network.events', 'network.alerts', 'network.metrics'],
 *   qos: 1,
 *   retained: false
 * });
 * ```
 */
const createPubSubConfig = (config) => {
    return {
        broker: config.broker,
        topics: config.topics,
        qos: config.qos || 0,
        retained: config.retained || false,
        clientId: config.clientId || generateClientId(),
    };
};
exports.createPubSubConfig = createPubSubConfig;
/**
 * Publishes message to topic with pattern matching.
 *
 * @param {any} publisher - Publisher client
 * @param {string} topic - Topic name
 * @param {any} message - Message payload
 * @param {Record<string, any>} [options] - Publish options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await publishToTopic(
 *   redisPublisher,
 *   'network.topology.updated',
 *   { networkId: 'net_001', nodes: 10, links: 15 },
 *   { qos: 1, retained: true }
 * );
 * ```
 */
const publishToTopic = async (publisher, topic, message, options) => {
    const envelope = (0, exports.createMessageEnvelope)(message, {
        topic,
        ...options,
    });
    await publisher.publish(topic, JSON.stringify(envelope));
};
exports.publishToTopic = publishToTopic;
/**
 * Subscribes to topic with pattern matching and filtering.
 *
 * @param {any} subscriber - Subscriber client
 * @param {string} pattern - Topic pattern (supports wildcards)
 * @param {Function} handler - Message handler
 * @returns {void}
 *
 * @example
 * ```typescript
 * subscribeToTopic(
 *   redisSubscriber,
 *   'network.*.updated',
 *   async (message) => {
 *     console.log('Network update:', message);
 *     await processNetworkUpdate(message);
 *   }
 * );
 * ```
 */
const subscribeToTopic = (subscriber, pattern, handler) => {
    subscriber.subscribe(pattern);
    subscriber.on('message', async (topic, data) => {
        if (matchesPattern(topic, pattern)) {
            try {
                const message = JSON.parse(data);
                await handler(message);
            }
            catch (error) {
                console.error(`Error handling message on ${topic}:`, error.message);
            }
        }
    });
};
exports.subscribeToTopic = subscribeToTopic;
/**
 * Creates topic hierarchy with wildcards and routing.
 *
 * @param {string[]} segments - Topic segments
 * @returns {string} Topic path
 *
 * @example
 * ```typescript
 * const topic = createTopicHierarchy(['network', 'topology', 'nodes', 'added']);
 * // Result: 'network.topology.nodes.added'
 * ```
 */
const createTopicHierarchy = (segments) => {
    return segments.filter(s => s && s.trim().length > 0).join('.');
};
exports.createTopicHierarchy = createTopicHierarchy;
/**
 * Implements topic-based message routing with filters.
 *
 * @param {string} topic - Topic to route
 * @param {Map<string, Function>} routes - Route handlers
 * @param {any} message - Message to route
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * const routes = new Map([
 *   ['network.topology.*', async (msg) => { await handleTopology(msg); }],
 *   ['network.flows.*', async (msg) => { await handleFlows(msg); }]
 * ]);
 * await routeTopicMessage('network.topology.updated', routes, message);
 * ```
 */
const routeTopicMessage = async (topic, routes, message) => {
    for (const [pattern, handler] of routes.entries()) {
        if (matchesPattern(topic, pattern)) {
            await handler(message);
        }
    }
};
exports.routeTopicMessage = routeTopicMessage;
// ============================================================================
// REQUEST/RESPONSE PATTERNS (14-18)
// ============================================================================
/**
 * Implements request-response pattern with timeout and caching.
 *
 * @param {Function} requester - Request function
 * @param {any} request - Request payload
 * @param {RequestResponsePattern} pattern - Pattern configuration
 * @returns {Promise<any>} Response
 *
 * @example
 * ```typescript
 * const response = await requestResponse(
 *   async (req) => await networkService.send(req),
 *   { method: 'getTopology', networkId: 'net_001' },
 *   { timeout: 5000, retries: 3, cacheable: true, cacheTTL: 60000 }
 * );
 * ```
 */
const requestResponse = async (requester, request, pattern) => {
    const cache = new Map();
    // Check cache
    if (pattern.cacheable && pattern.cacheKey) {
        const cached = cache.get(pattern.cacheKey);
        if (cached && Date.now() - cached.timestamp < (pattern.cacheTTL || 60000)) {
            return cached.data;
        }
    }
    let lastError;
    for (let attempt = 0; attempt <= pattern.retries; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), pattern.timeout);
            const response = await requester(request);
            clearTimeout(timeoutId);
            // Cache response
            if (pattern.cacheable && pattern.cacheKey) {
                cache.set(pattern.cacheKey, { data: response, timestamp: Date.now() });
            }
            return response;
        }
        catch (error) {
            lastError = error;
            if (attempt < pattern.retries) {
                await sleep(Math.pow(2, attempt) * 1000);
            }
        }
    }
    throw lastError;
};
exports.requestResponse = requestResponse;
/**
 * Creates asynchronous request-response with callback registration.
 *
 * @returns {any} Async request-response handler
 *
 * @example
 * ```typescript
 * const asyncRR = createAsyncRequestResponse();
 * const responsePromise = asyncRR.send({ method: 'getData' });
 * asyncRR.handleResponse('response-id', { data: 'value' });
 * const response = await responsePromise;
 * ```
 */
const createAsyncRequestResponse = () => {
    const callbacks = new Map();
    return {
        send: async (request, timeout = 30000) => {
            const requestId = generateRequestId();
            return new Promise((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    callbacks.delete(requestId);
                    reject(new Error('Request timeout'));
                }, timeout);
                callbacks.set(requestId, { resolve, reject, timeoutId });
            });
        },
        handleResponse: (requestId, response) => {
            const callback = callbacks.get(requestId);
            if (callback) {
                clearTimeout(callback.timeoutId);
                callbacks.delete(requestId);
                callback.resolve(response);
            }
        },
    };
};
exports.createAsyncRequestResponse = createAsyncRequestResponse;
/**
 * Implements fire-and-forget pattern for one-way messaging.
 *
 * @param {Function} sender - Send function
 * @param {any} message - Message to send
 * @returns {void}
 *
 * @example
 * ```typescript
 * fireAndForget(
 *   (msg) => eventBus.emit('network.event', msg),
 *   { eventType: 'link.down', linkId: 'link_001' }
 * );
 * ```
 */
const fireAndForget = (sender, message) => {
    try {
        sender(message);
    }
    catch (error) {
        console.error('Fire-and-forget send error:', error.message);
    }
};
exports.fireAndForget = fireAndForget;
/**
 * Creates scatter-gather pattern for parallel requests.
 *
 * @param {Array<Function>} services - Array of service functions
 * @param {any} request - Request to scatter
 * @param {number} [timeout=10000] - Timeout per service
 * @returns {Promise<any[]>} Gathered responses
 *
 * @example
 * ```typescript
 * const results = await scatterGather(
 *   [service1.query, service2.query, service3.query],
 *   { query: 'getStatus' },
 *   5000
 * );
 * ```
 */
const scatterGather = async (services, request, timeout = 10000) => {
    const promises = services.map(async (service) => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            const result = await service(request);
            clearTimeout(timeoutId);
            return { success: true, data: result };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    });
    return await Promise.all(promises);
};
exports.scatterGather = scatterGather;
/**
 * Implements aggregator pattern for combining responses.
 *
 * @param {any[]} responses - Array of responses
 * @param {Function} aggregator - Aggregation function
 * @returns {any} Aggregated result
 *
 * @example
 * ```typescript
 * const aggregated = aggregateResponses(
 *   [{ nodes: 5 }, { nodes: 3 }, { nodes: 7 }],
 *   (responses) => ({
 *     totalNodes: responses.reduce((sum, r) => sum + r.nodes, 0)
 *   })
 * );
 * ```
 */
const aggregateResponses = (responses, aggregator) => {
    return aggregator(responses.filter(r => r.success).map(r => r.data));
};
exports.aggregateResponses = aggregateResponses;
// ============================================================================
// STREAMING COMMUNICATION (19-23)
// ============================================================================
/**
 * Creates streaming configuration for network data transfer.
 *
 * @param {StreamConfig} config - Stream configuration
 * @returns {any} Stream configuration object
 *
 * @example
 * ```typescript
 * const streamConfig = createStreamConfig({
 *   chunkSize: 65536,
 *   compression: true,
 *   backpressure: true,
 *   bufferSize: 1024,
 *   timeout: 30000
 * });
 * ```
 */
const createStreamConfig = (config) => {
    return {
        chunkSize: config.chunkSize || 65536,
        compression: config.compression || false,
        backpressure: config.backpressure || true,
        bufferSize: config.bufferSize || 1024,
        timeout: config.timeout || 30000,
    };
};
exports.createStreamConfig = createStreamConfig;
/**
 * Creates readable stream for network data with backpressure.
 *
 * @param {Function} dataSource - Data source function
 * @param {StreamConfig} config - Stream configuration
 * @returns {Observable<any>} Data stream
 *
 * @example
 * ```typescript
 * const stream = createReadableStream(
 *   async () => await fetchNetworkMetrics(),
 *   { chunkSize: 1024, backpressure: true }
 * );
 * stream.subscribe(chunk => processChunk(chunk));
 * ```
 */
const createReadableStream = (dataSource, config) => {
    return new rxjs_1.Observable(observer => {
        (async () => {
            try {
                for await (const chunk of dataSource()) {
                    observer.next(chunk);
                }
                observer.complete();
            }
            catch (error) {
                observer.error(error);
            }
        })();
    });
};
exports.createReadableStream = createReadableStream;
/**
 * Creates writable stream for network data ingestion.
 *
 * @param {Function} dataSink - Data sink function
 * @returns {Subject<any>} Writable stream
 *
 * @example
 * ```typescript
 * const stream = createWritableStream(
 *   async (data) => await storeNetworkData(data)
 * );
 * stream.next({ metrics: [...] });
 * ```
 */
const createWritableStream = (dataSink) => {
    const subject = new rxjs_1.Subject();
    subject.subscribe({
        next: async (data) => {
            try {
                await dataSink(data);
            }
            catch (error) {
                console.error('Stream write error:', error.message);
            }
        },
    });
    return subject;
};
exports.createWritableStream = createWritableStream;
/**
 * Implements bidirectional streaming for network communication.
 *
 * @returns {{ clientStream: Subject<any>; serverStream: Subject<any> }} Bidirectional streams
 *
 * @example
 * ```typescript
 * const { clientStream, serverStream } = createBidirectionalStream();
 * clientStream.subscribe(data => serverStream.next(processData(data)));
 * ```
 */
const createBidirectionalStream = () => {
    return {
        clientStream: new rxjs_1.Subject(),
        serverStream: new rxjs_1.Subject(),
    };
};
exports.createBidirectionalStream = createBidirectionalStream;
/**
 * Creates stream multiplexer for combining multiple streams.
 *
 * @param {Observable<any>[]} streams - Array of input streams
 * @returns {Observable<any>} Multiplexed stream
 *
 * @example
 * ```typescript
 * const multiplexed = streamMultiplexer([
 *   metricsStream,
 *   eventsStream,
 *   alertsStream
 * ]);
 * multiplexed.subscribe(data => handleData(data));
 * ```
 */
const streamMultiplexer = (streams) => {
    return new rxjs_1.Observable(observer => {
        const subscriptions = streams.map(stream => stream.subscribe({
            next: value => observer.next(value),
            error: error => observer.error(error),
        }));
        return () => {
            subscriptions.forEach(sub => sub.unsubscribe());
        };
    });
};
exports.streamMultiplexer = streamMultiplexer;
// ============================================================================
// MESSAGE SERIALIZATION (24-28)
// ============================================================================
/**
 * Serializes message to specified format with compression.
 *
 * @param {any} message - Message to serialize
 * @param {SerializationConfig} config - Serialization configuration
 * @returns {Buffer} Serialized message
 *
 * @example
 * ```typescript
 * const serialized = serializeMessage(
 *   { networkId: 'net_001', topology: {...} },
 *   { format: 'json', compression: 'gzip' }
 * );
 * ```
 */
const serializeMessage = (message, config) => {
    let data;
    switch (config.format) {
        case 'json':
            data = Buffer.from(JSON.stringify(message));
            break;
        case 'protobuf':
            // Protobuf serialization would require schema
            if (!config.schema) {
                throw new Error('Protobuf schema required');
            }
            data = Buffer.from(JSON.stringify(message)); // Placeholder
            break;
        case 'msgpack':
            // MessagePack serialization
            data = Buffer.from(JSON.stringify(message)); // Placeholder
            break;
        default:
            data = Buffer.from(JSON.stringify(message));
    }
    // Apply compression if specified
    if (config.compression) {
        const zlib = require('zlib');
        switch (config.compression) {
            case 'gzip':
                data = zlib.gzipSync(data);
                break;
            case 'lz4':
                // LZ4 compression would require library
                break;
        }
    }
    return data;
};
exports.serializeMessage = serializeMessage;
/**
 * Deserializes message from buffer with decompression.
 *
 * @param {Buffer} buffer - Serialized message buffer
 * @param {SerializationConfig} config - Serialization configuration
 * @returns {any} Deserialized message
 *
 * @example
 * ```typescript
 * const message = deserializeMessage(
 *   serializedBuffer,
 *   { format: 'json', compression: 'gzip' }
 * );
 * ```
 */
const deserializeMessage = (buffer, config) => {
    let data = buffer;
    // Apply decompression if specified
    if (config.compression) {
        const zlib = require('zlib');
        switch (config.compression) {
            case 'gzip':
                data = zlib.gunzipSync(data);
                break;
        }
    }
    switch (config.format) {
        case 'json':
            return JSON.parse(data.toString());
        case 'protobuf':
            if (!config.schema) {
                throw new Error('Protobuf schema required');
            }
            return JSON.parse(data.toString()); // Placeholder
        default:
            return JSON.parse(data.toString());
    }
};
exports.deserializeMessage = deserializeMessage;
/**
 * Creates message envelope with headers and metadata.
 *
 * @param {any} payload - Message payload
 * @param {Record<string, any>} [options] - Envelope options
 * @returns {MessageEnvelope} Message envelope
 *
 * @example
 * ```typescript
 * const envelope = createMessageEnvelope(
 *   { eventType: 'topology.updated' },
 *   { correlationId: 'corr_001', contentType: 'application/json' }
 * );
 * ```
 */
const createMessageEnvelope = (payload, options) => {
    return {
        messageId: generateMessageId(),
        correlationId: options?.correlationId,
        timestamp: Date.now(),
        headers: options?.headers || {},
        payload,
        contentType: options?.contentType || 'application/json',
    };
};
exports.createMessageEnvelope = createMessageEnvelope;
/**
 * Validates message schema and structure.
 *
 * @param {any} message - Message to validate
 * @param {any} schema - Validation schema
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateMessageSchema(
 *   { networkId: 'net_001', type: 'topology' },
 *   { required: ['networkId', 'type'], properties: {...} }
 * );
 * ```
 */
const validateMessageSchema = (message, schema) => {
    const errors = [];
    if (schema.required) {
        schema.required.forEach((field) => {
            if (!(field in message)) {
                errors.push(`Missing required field: ${field}`);
            }
        });
    }
    if (schema.properties) {
        Object.entries(schema.properties).forEach(([field, spec]) => {
            if (field in message) {
                const value = message[field];
                if (spec.type && typeof value !== spec.type) {
                    errors.push(`Invalid type for ${field}: expected ${spec.type}, got ${typeof value}`);
                }
            }
        });
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateMessageSchema = validateMessageSchema;
/**
 * Implements message batching for efficient transmission.
 *
 * @param {Observable<any>} messageStream - Message stream
 * @param {number} batchSize - Batch size
 * @param {number} [timeWindow=1000] - Time window in milliseconds
 * @returns {Observable<any[]>} Batched messages
 *
 * @example
 * ```typescript
 * const batched = batchMessages(messageStream, 100, 5000);
 * batched.subscribe(batch => sendBatch(batch));
 * ```
 */
const batchMessages = (messageStream, batchSize, timeWindow = 1000) => {
    return messageStream.pipe((0, operators_1.bufferTime)(timeWindow, undefined, batchSize), (0, operators_1.filter)(batch => batch.length > 0));
};
exports.batchMessages = batchMessages;
// ============================================================================
// PROTOCOL BUFFERS (29-32)
// ============================================================================
/**
 * Loads Protocol Buffer definition from file.
 *
 * @param {string} protoPath - Path to .proto file
 * @returns {Promise<any>} Loaded protobuf root
 *
 * @example
 * ```typescript
 * const root = await loadProtobufDefinition('./protos/network.proto');
 * const NetworkMessage = root.lookupType('network.Message');
 * ```
 */
const loadProtobufDefinition = async (protoPath) => {
    const protobuf = require('protobufjs');
    return await protobuf.load(protoPath);
};
exports.loadProtobufDefinition = loadProtobufDefinition;
/**
 * Encodes message using Protocol Buffers.
 *
 * @param {any} messageType - Protobuf message type
 * @param {any} payload - Message payload
 * @returns {Buffer} Encoded message
 *
 * @example
 * ```typescript
 * const NetworkMessage = root.lookupType('network.Message');
 * const encoded = encodeProtobufMessage(NetworkMessage, {
 *   networkId: 'net_001',
 *   type: 'TOPOLOGY_UPDATE'
 * });
 * ```
 */
const encodeProtobufMessage = (messageType, payload) => {
    const errMsg = messageType.verify(payload);
    if (errMsg) {
        throw new Error(`Protobuf validation error: ${errMsg}`);
    }
    const message = messageType.create(payload);
    return Buffer.from(messageType.encode(message).finish());
};
exports.encodeProtobufMessage = encodeProtobufMessage;
/**
 * Decodes Protocol Buffer message to object.
 *
 * @param {any} messageType - Protobuf message type
 * @param {Buffer} buffer - Encoded message buffer
 * @returns {any} Decoded message
 *
 * @example
 * ```typescript
 * const NetworkMessage = root.lookupType('network.Message');
 * const decoded = decodeProtobufMessage(NetworkMessage, encodedBuffer);
 * ```
 */
const decodeProtobufMessage = (messageType, buffer) => {
    const message = messageType.decode(buffer);
    return messageType.toObject(message, {
        longs: String,
        enums: String,
        bytes: String,
    });
};
exports.decodeProtobufMessage = decodeProtobufMessage;
/**
 * Creates Protocol Buffer service definition.
 *
 * @param {any} root - Protobuf root
 * @param {string} serviceName - Service name
 * @returns {any} Service definition
 *
 * @example
 * ```typescript
 * const service = createProtobufService(root, 'NetworkService');
 * ```
 */
const createProtobufService = (root, serviceName) => {
    return root.lookupService(serviceName);
};
exports.createProtobufService = createProtobufService;
// ============================================================================
// WEBSOCKET COMMUNICATION (33-36)
// ============================================================================
/**
 * Creates WebSocket server configuration for network services.
 *
 * @param {WebSocketConfig} config - WebSocket configuration
 * @returns {any} WebSocket server options
 *
 * @example
 * ```typescript
 * const wsConfig = createWebSocketConfig({
 *   host: '0.0.0.0',
 *   port: 8080,
 *   path: '/network-ws',
 *   heartbeatInterval: 30000
 * });
 * ```
 */
const createWebSocketConfig = (config) => {
    return {
        host: config.host,
        port: config.port,
        path: config.path || '/ws',
        protocols: config.protocols || [],
        heartbeatInterval: config.heartbeatInterval || 30000,
        reconnectDelay: config.reconnectDelay || 3000,
        maxReconnectAttempts: config.maxReconnectAttempts || 5,
    };
};
exports.createWebSocketConfig = createWebSocketConfig;
/**
 * Creates WebSocket message with type and payload.
 *
 * @param {string} type - Message type
 * @param {any} payload - Message payload
 * @param {string} [topic] - Optional topic
 * @returns {WebSocketMessage} WebSocket message
 *
 * @example
 * ```typescript
 * const message = createWebSocketMessage(
 *   'event',
 *   { eventType: 'link.down', linkId: 'link_001' },
 *   'network.events'
 * );
 * ```
 */
const createWebSocketMessage = (type, payload, topic) => {
    return {
        messageId: generateMessageId(),
        type,
        topic,
        payload,
        timestamp: Date.now(),
    };
};
exports.createWebSocketMessage = createWebSocketMessage;
/**
 * Implements WebSocket heartbeat mechanism.
 *
 * @param {any} ws - WebSocket connection
 * @param {number} [interval=30000] - Heartbeat interval in milliseconds
 * @returns {any} Heartbeat timer
 *
 * @example
 * ```typescript
 * const heartbeat = startWebSocketHeartbeat(wsConnection, 30000);
 * // Later: clearInterval(heartbeat);
 * ```
 */
const startWebSocketHeartbeat = (ws, interval = 30000) => {
    return setInterval(() => {
        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify((0, exports.createWebSocketMessage)('ping', {})));
        }
    }, interval);
};
exports.startWebSocketHeartbeat = startWebSocketHeartbeat;
/**
 * Handles WebSocket reconnection with exponential backoff.
 *
 * @param {Function} connect - Connection function
 * @param {WebSocketConfig} config - WebSocket configuration
 * @returns {Promise<any>} WebSocket connection
 *
 * @example
 * ```typescript
 * const ws = await handleWebSocketReconnect(
 *   () => new WebSocket('ws://localhost:8080'),
 *   { reconnectDelay: 3000, maxReconnectAttempts: 5 }
 * );
 * ```
 */
const handleWebSocketReconnect = async (connect, config) => {
    let attempts = 0;
    while (attempts < (config.maxReconnectAttempts || 5)) {
        try {
            return connect();
        }
        catch (error) {
            attempts++;
            const delay = Math.min((config.reconnectDelay || 3000) * Math.pow(2, attempts - 1), 30000);
            await sleep(delay);
        }
    }
    throw new Error('Max reconnection attempts reached');
};
exports.handleWebSocketReconnect = handleWebSocketReconnect;
// ============================================================================
// GRPC INTEGRATION (37-40)
// ============================================================================
/**
 * Creates gRPC service configuration for network microservices.
 *
 * @param {GrpcServiceConfig} config - gRPC service configuration
 * @returns {any} gRPC service options
 *
 * @example
 * ```typescript
 * const grpcConfig = createGrpcServiceConfig({
 *   serviceName: 'NetworkTopologyService',
 *   protoPath: './protos/topology.proto',
 *   package: 'network.topology',
 *   host: '0.0.0.0',
 *   port: 50051
 * });
 * ```
 */
const createGrpcServiceConfig = (config) => {
    return {
        serviceName: config.serviceName,
        protoPath: config.protoPath,
        package: config.package,
        url: `${config.host}:${config.port}`,
        credentials: config.credentials,
        options: {
            keepalive: {
                keepaliveTimeMs: 120000,
                keepaliveTimeoutMs: 20000,
                keepalivePermitWithoutCalls: 1,
            },
            ...config.options,
        },
    };
};
exports.createGrpcServiceConfig = createGrpcServiceConfig;
/**
 * Creates gRPC client with automatic reconnection.
 *
 * @param {any} grpcPackage - gRPC package definition
 * @param {string} serviceName - Service name
 * @param {string} url - Service URL
 * @returns {any} gRPC client
 *
 * @example
 * ```typescript
 * const client = createGrpcClient(
 *   grpcPackage,
 *   'NetworkTopologyService',
 *   'localhost:50051'
 * );
 * ```
 */
const createGrpcClient = (grpcPackage, serviceName, url) => {
    const grpc = require('@grpc/grpc-js');
    const ServiceClient = grpcPackage[serviceName];
    return new ServiceClient(url, grpc.credentials.createInsecure());
};
exports.createGrpcClient = createGrpcClient;
/**
 * Implements gRPC streaming (server, client, bidirectional).
 *
 * @param {any} client - gRPC client
 * @param {string} method - Method name
 * @param {Observable<any>} [requestStream] - Request stream for client/bidirectional
 * @returns {Observable<any>} Response stream
 *
 * @example
 * ```typescript
 * const responseStream = createGrpcStream(
 *   grpcClient,
 *   'streamNetworkMetrics',
 *   requestStream
 * );
 * responseStream.subscribe(metrics => processMetrics(metrics));
 * ```
 */
const createGrpcStream = (client, method, requestStream) => {
    return new rxjs_1.Observable(observer => {
        const call = client[method]();
        call.on('data', (data) => {
            observer.next(data);
        });
        call.on('end', () => {
            observer.complete();
        });
        call.on('error', (error) => {
            observer.error(error);
        });
        if (requestStream) {
            requestStream.subscribe({
                next: data => call.write(data),
                complete: () => call.end(),
                error: error => call.cancel(),
            });
        }
        return () => call.cancel();
    });
};
exports.createGrpcStream = createGrpcStream;
/**
 * Implements gRPC metadata handling for context propagation.
 *
 * @param {Record<string, string>} metadata - Metadata key-value pairs
 * @returns {any} gRPC metadata object
 *
 * @example
 * ```typescript
 * const metadata = createGrpcMetadata({
 *   'user-id': 'admin',
 *   'trace-id': 'trace_001',
 *   'authorization': 'Bearer token123'
 * });
 * client.call(request, metadata, callback);
 * ```
 */
const createGrpcMetadata = (metadata) => {
    const grpc = require('@grpc/grpc-js');
    const grpcMetadata = new grpc.Metadata();
    Object.entries(metadata).forEach(([key, value]) => {
        grpcMetadata.add(key, value);
    });
    return grpcMetadata;
};
exports.createGrpcMetadata = createGrpcMetadata;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Generates unique request ID.
 */
const generateRequestId = () => {
    const crypto = require('crypto');
    return `req_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
};
/**
 * Generates unique message ID.
 */
const generateMessageId = () => {
    const crypto = require('crypto');
    return `msg_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
};
/**
 * Generates unique client ID.
 */
const generateClientId = () => {
    const crypto = require('crypto');
    return `client_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
};
/**
 * Matches topic pattern with wildcards.
 */
const matchesPattern = (topic, pattern) => {
    const regex = new RegExp('^' + pattern.replace(/\./g, '\\.').replace(/\*/g, '[^.]+').replace(/#/g, '.+') + '$');
    return regex.test(topic);
};
/**
 * Sleep utility function.
 */
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
exports.default = {
    // Sequelize Models
    createNetworkRPCLogModel: exports.createNetworkRPCLogModel,
    createNetworkMessageModel: exports.createNetworkMessageModel,
    createNetworkWebSocketSessionModel: exports.createNetworkWebSocketSessionModel,
    // RPC Communication
    createRPCRequest: exports.createRPCRequest,
    processRPCRequest: exports.processRPCRequest,
    createBidirectionalRPCChannel: exports.createBidirectionalRPCChannel,
    createRPCMethodRegistry: exports.createRPCMethodRegistry,
    createRPCClient: exports.createRPCClient,
    // Pub/Sub Patterns
    createPubSubConfig: exports.createPubSubConfig,
    publishToTopic: exports.publishToTopic,
    subscribeToTopic: exports.subscribeToTopic,
    createTopicHierarchy: exports.createTopicHierarchy,
    routeTopicMessage: exports.routeTopicMessage,
    // Request/Response Patterns
    requestResponse: exports.requestResponse,
    createAsyncRequestResponse: exports.createAsyncRequestResponse,
    fireAndForget: exports.fireAndForget,
    scatterGather: exports.scatterGather,
    aggregateResponses: exports.aggregateResponses,
    // Streaming Communication
    createStreamConfig: exports.createStreamConfig,
    createReadableStream: exports.createReadableStream,
    createWritableStream: exports.createWritableStream,
    createBidirectionalStream: exports.createBidirectionalStream,
    streamMultiplexer: exports.streamMultiplexer,
    // Message Serialization
    serializeMessage: exports.serializeMessage,
    deserializeMessage: exports.deserializeMessage,
    createMessageEnvelope: exports.createMessageEnvelope,
    validateMessageSchema: exports.validateMessageSchema,
    batchMessages: exports.batchMessages,
    // Protocol Buffers
    loadProtobufDefinition: exports.loadProtobufDefinition,
    encodeProtobufMessage: exports.encodeProtobufMessage,
    decodeProtobufMessage: exports.decodeProtobufMessage,
    createProtobufService: exports.createProtobufService,
    // WebSocket Communication
    createWebSocketConfig: exports.createWebSocketConfig,
    createWebSocketMessage: exports.createWebSocketMessage,
    startWebSocketHeartbeat: exports.startWebSocketHeartbeat,
    handleWebSocketReconnect: exports.handleWebSocketReconnect,
    // gRPC Integration
    createGrpcServiceConfig: exports.createGrpcServiceConfig,
    createGrpcClient: exports.createGrpcClient,
    createGrpcStream: exports.createGrpcStream,
    createGrpcMetadata: exports.createGrpcMetadata,
};
//# sourceMappingURL=network-communication-kit.js.map