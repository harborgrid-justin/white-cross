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
import { Observable, Subject } from 'rxjs';
import { Sequelize } from 'sequelize';
interface RPCRequest {
    requestId: string;
    method: string;
    params: any[];
    metadata?: Record<string, any>;
    timeout?: number;
}
interface RPCResponse {
    requestId: string;
    result?: any;
    error?: RPCError;
    metadata?: Record<string, any>;
}
interface RPCError {
    code: number;
    message: string;
    data?: any;
}
interface PubSubConfig {
    broker: 'redis' | 'nats' | 'mqtt' | 'kafka';
    topics: string[];
    qos?: number;
    retained?: boolean;
    clientId?: string;
}
interface StreamConfig {
    chunkSize: number;
    compression?: boolean;
    backpressure?: boolean;
    bufferSize?: number;
    timeout?: number;
}
interface WebSocketConfig {
    host: string;
    port: number;
    path?: string;
    protocols?: string[];
    heartbeatInterval?: number;
    reconnectDelay?: number;
    maxReconnectAttempts?: number;
}
interface WebSocketMessage {
    messageId: string;
    type: 'request' | 'response' | 'event' | 'ping' | 'pong';
    topic?: string;
    payload: any;
    timestamp: number;
}
interface GrpcServiceConfig {
    serviceName: string;
    protoPath: string;
    package: string;
    host: string;
    port: number;
    credentials?: any;
    options?: Record<string, any>;
}
interface MessageEnvelope {
    messageId: string;
    correlationId?: string;
    timestamp: number;
    headers: Record<string, string>;
    payload: any;
    contentType: string;
}
interface SerializationConfig {
    format: 'json' | 'protobuf' | 'msgpack' | 'avro';
    compression?: 'gzip' | 'lz4' | 'snappy';
    schema?: any;
}
interface RequestResponsePattern {
    timeout: number;
    retries: number;
    cacheable: boolean;
    cacheKey?: string;
    cacheTTL?: number;
}
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
export declare const createNetworkRPCLogModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        requestId: string;
        method: string;
        params: Record<string, any>;
        result: Record<string, any> | null;
        error: Record<string, any> | null;
        status: string;
        duration: number;
        clientId: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
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
export declare const createNetworkMessageModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        messageId: string;
        correlationId: string | null;
        topic: string;
        payload: Record<string, any>;
        headers: Record<string, string>;
        contentType: string;
        status: string;
        publishedAt: Date;
        deliveredAt: Date | null;
        retryCount: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
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
export declare const createNetworkWebSocketSessionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        sessionId: string;
        clientId: string;
        protocol: string;
        status: string;
        connectedAt: Date;
        disconnectedAt: Date | null;
        messagesSent: number;
        messagesReceived: number;
        bytesSent: number;
        bytesReceived: number;
        lastActivity: Date;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
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
export declare const createRPCRequest: (method: string, params: any[], metadata?: Record<string, any>) => RPCRequest;
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
export declare const processRPCRequest: (request: RPCRequest, handler: (method: string, params: any[]) => Promise<any>) => Promise<RPCResponse>;
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
export declare const createBidirectionalRPCChannel: () => {
    requests$: Subject<RPCRequest>;
    responses$: Subject<RPCResponse>;
};
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
export declare const createRPCMethodRegistry: () => any;
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
export declare const createRPCClient: (transport: any) => any;
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
export declare const createPubSubConfig: (config: PubSubConfig) => any;
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
export declare const publishToTopic: (publisher: any, topic: string, message: any, options?: Record<string, any>) => Promise<void>;
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
export declare const subscribeToTopic: (subscriber: any, pattern: string, handler: (message: any) => Promise<void> | void) => void;
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
export declare const createTopicHierarchy: (segments: string[]) => string;
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
export declare const routeTopicMessage: (topic: string, routes: Map<string, Function>, message: any) => Promise<void>;
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
export declare const requestResponse: (requester: (request: any) => Promise<any>, request: any, pattern: RequestResponsePattern) => Promise<any>;
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
export declare const createAsyncRequestResponse: () => any;
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
export declare const fireAndForget: (sender: (message: any) => void, message: any) => void;
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
export declare const scatterGather: (services: Array<(request: any) => Promise<any>>, request: any, timeout?: number) => Promise<any[]>;
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
export declare const aggregateResponses: (responses: any[], aggregator: (responses: any[]) => any) => any;
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
export declare const createStreamConfig: (config: StreamConfig) => any;
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
export declare const createReadableStream: (dataSource: () => AsyncGenerator<any>, config: StreamConfig) => Observable<any>;
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
export declare const createWritableStream: (dataSink: (data: any) => Promise<void>) => Subject<any>;
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
export declare const createBidirectionalStream: () => {
    clientStream: Subject<any>;
    serverStream: Subject<any>;
};
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
export declare const streamMultiplexer: (streams: Observable<any>[]) => Observable<any>;
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
export declare const serializeMessage: (message: any, config: SerializationConfig) => Buffer;
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
export declare const deserializeMessage: (buffer: Buffer, config: SerializationConfig) => any;
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
export declare const createMessageEnvelope: (payload: any, options?: Record<string, any>) => MessageEnvelope;
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
export declare const validateMessageSchema: (message: any, schema: any) => {
    valid: boolean;
    errors: string[];
};
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
export declare const batchMessages: (messageStream: Observable<any>, batchSize: number, timeWindow?: number) => Observable<any[]>;
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
export declare const loadProtobufDefinition: (protoPath: string) => Promise<any>;
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
export declare const encodeProtobufMessage: (messageType: any, payload: any) => Buffer;
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
export declare const decodeProtobufMessage: (messageType: any, buffer: Buffer) => any;
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
export declare const createProtobufService: (root: any, serviceName: string) => any;
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
export declare const createWebSocketConfig: (config: WebSocketConfig) => any;
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
export declare const createWebSocketMessage: (type: "request" | "response" | "event" | "ping" | "pong", payload: any, topic?: string) => WebSocketMessage;
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
export declare const startWebSocketHeartbeat: (ws: any, interval?: number) => any;
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
export declare const handleWebSocketReconnect: (connect: () => any, config: WebSocketConfig) => Promise<any>;
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
export declare const createGrpcServiceConfig: (config: GrpcServiceConfig) => any;
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
export declare const createGrpcClient: (grpcPackage: any, serviceName: string, url: string) => any;
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
export declare const createGrpcStream: (client: any, method: string, requestStream?: Observable<any>) => Observable<any>;
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
export declare const createGrpcMetadata: (metadata: Record<string, string>) => any;
declare const _default: {
    createNetworkRPCLogModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            requestId: string;
            method: string;
            params: Record<string, any>;
            result: Record<string, any> | null;
            error: Record<string, any> | null;
            status: string;
            duration: number;
            clientId: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createNetworkMessageModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            messageId: string;
            correlationId: string | null;
            topic: string;
            payload: Record<string, any>;
            headers: Record<string, string>;
            contentType: string;
            status: string;
            publishedAt: Date;
            deliveredAt: Date | null;
            retryCount: number;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createNetworkWebSocketSessionModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            sessionId: string;
            clientId: string;
            protocol: string;
            status: string;
            connectedAt: Date;
            disconnectedAt: Date | null;
            messagesSent: number;
            messagesReceived: number;
            bytesSent: number;
            bytesReceived: number;
            lastActivity: Date;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createRPCRequest: (method: string, params: any[], metadata?: Record<string, any>) => RPCRequest;
    processRPCRequest: (request: RPCRequest, handler: (method: string, params: any[]) => Promise<any>) => Promise<RPCResponse>;
    createBidirectionalRPCChannel: () => {
        requests$: Subject<RPCRequest>;
        responses$: Subject<RPCResponse>;
    };
    createRPCMethodRegistry: () => any;
    createRPCClient: (transport: any) => any;
    createPubSubConfig: (config: PubSubConfig) => any;
    publishToTopic: (publisher: any, topic: string, message: any, options?: Record<string, any>) => Promise<void>;
    subscribeToTopic: (subscriber: any, pattern: string, handler: (message: any) => Promise<void> | void) => void;
    createTopicHierarchy: (segments: string[]) => string;
    routeTopicMessage: (topic: string, routes: Map<string, Function>, message: any) => Promise<void>;
    requestResponse: (requester: (request: any) => Promise<any>, request: any, pattern: RequestResponsePattern) => Promise<any>;
    createAsyncRequestResponse: () => any;
    fireAndForget: (sender: (message: any) => void, message: any) => void;
    scatterGather: (services: Array<(request: any) => Promise<any>>, request: any, timeout?: number) => Promise<any[]>;
    aggregateResponses: (responses: any[], aggregator: (responses: any[]) => any) => any;
    createStreamConfig: (config: StreamConfig) => any;
    createReadableStream: (dataSource: () => AsyncGenerator<any>, config: StreamConfig) => Observable<any>;
    createWritableStream: (dataSink: (data: any) => Promise<void>) => Subject<any>;
    createBidirectionalStream: () => {
        clientStream: Subject<any>;
        serverStream: Subject<any>;
    };
    streamMultiplexer: (streams: Observable<any>[]) => Observable<any>;
    serializeMessage: (message: any, config: SerializationConfig) => Buffer;
    deserializeMessage: (buffer: Buffer, config: SerializationConfig) => any;
    createMessageEnvelope: (payload: any, options?: Record<string, any>) => MessageEnvelope;
    validateMessageSchema: (message: any, schema: any) => {
        valid: boolean;
        errors: string[];
    };
    batchMessages: (messageStream: Observable<any>, batchSize: number, timeWindow?: number) => Observable<any[]>;
    loadProtobufDefinition: (protoPath: string) => Promise<any>;
    encodeProtobufMessage: (messageType: any, payload: any) => Buffer;
    decodeProtobufMessage: (messageType: any, buffer: Buffer) => any;
    createProtobufService: (root: any, serviceName: string) => any;
    createWebSocketConfig: (config: WebSocketConfig) => any;
    createWebSocketMessage: (type: "request" | "response" | "event" | "ping" | "pong", payload: any, topic?: string) => WebSocketMessage;
    startWebSocketHeartbeat: (ws: any, interval?: number) => any;
    handleWebSocketReconnect: (connect: () => any, config: WebSocketConfig) => Promise<any>;
    createGrpcServiceConfig: (config: GrpcServiceConfig) => any;
    createGrpcClient: (grpcPackage: any, serviceName: string, url: string) => any;
    createGrpcStream: (client: any, method: string, requestStream?: Observable<any>) => Observable<any>;
    createGrpcMetadata: (metadata: Record<string, string>) => any;
};
export default _default;
//# sourceMappingURL=network-communication-kit.d.ts.map