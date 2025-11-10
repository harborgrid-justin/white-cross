/**
 * LOC: RTTSCMP1234567
 * File: /reuse/threat/composites/real-time-threat-streaming-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../threat-intelligence-api-gateway-kit
 *   - ../threat-intelligence-platform-kit
 *   - ../threat-feeds-integration-kit
 *   - ../threat-sharing-kit
 *   - ../threat-intelligence-sharing-kit
 *
 * DOWNSTREAM (imported by):
 *   - Real-time threat streaming services
 *   - WebSocket gateway implementations
 *   - Event-driven architecture handlers
 *   - Pub/Sub message brokers
 *   - Stream processing pipelines
 */
import { type ThreatIntelligence, type IntelligenceSource, type ThreatSeverity, type IntelligenceType } from '../threat-intelligence-platform-kit';
import { type ThreatIndicator } from '../threat-feeds-integration-kit';
import { type TLPLevel } from '../threat-sharing-kit';
import { type STIXBundle, type STIXIndicator } from '../threat-intelligence-sharing-kit';
/**
 * WebSocket connection status
 */
export declare enum WebSocketStatus {
    CONNECTING = "CONNECTING",
    CONNECTED = "CONNECTED",
    AUTHENTICATED = "AUTHENTICATED",
    SUBSCRIBED = "SUBSCRIBED",
    DISCONNECTING = "DISCONNECTING",
    DISCONNECTED = "DISCONNECTED",
    ERROR = "ERROR"
}
/**
 * WebSocket message type
 */
export declare enum WebSocketMessageType {
    PING = "PING",
    PONG = "PONG",
    SUBSCRIBE = "SUBSCRIBE",
    UNSUBSCRIBE = "UNSUBSCRIBE",
    THREAT_UPDATE = "THREAT_UPDATE",
    IOC_UPDATE = "IOC_UPDATE",
    FEED_UPDATE = "FEED_UPDATE",
    SHARING_UPDATE = "SHARING_UPDATE",
    ALERT = "ALERT",
    ERROR = "ERROR"
}
/**
 * WebSocket connection configuration
 */
export interface WebSocketConfig {
    url: string;
    protocols?: string[];
    authentication: WebSocketAuthConfig;
    heartbeat: HeartbeatConfig;
    reconnect: ReconnectConfig;
    compression: boolean;
    maxMessageSize: number;
}
/**
 * WebSocket authentication configuration
 */
export interface WebSocketAuthConfig {
    type: 'token' | 'api_key' | 'certificate';
    credentials: Record<string, string>;
    timeout: number;
}
/**
 * Heartbeat configuration
 */
export interface HeartbeatConfig {
    enabled: boolean;
    interval: number;
    timeout: number;
    maxMissed: number;
}
/**
 * Reconnection configuration
 */
export interface ReconnectConfig {
    enabled: boolean;
    maxAttempts: number;
    initialDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
}
/**
 * WebSocket message structure
 */
export interface WebSocketMessage<T = any> {
    id: string;
    type: WebSocketMessageType;
    timestamp: Date;
    payload: T;
    metadata?: Record<string, any>;
}
/**
 * Subscription filter
 */
export interface SubscriptionFilter {
    severities?: ThreatSeverity[];
    types?: IntelligenceType[];
    tlpLevels?: TLPLevel[];
    sources?: string[];
    tags?: string[];
    customFilters?: Record<string, any>;
}
/**
 * Stream subscription
 */
export interface StreamSubscription {
    id: string;
    clientId: string;
    channel: string;
    filter: SubscriptionFilter;
    createdAt: Date;
    lastActivity: Date;
    messageCount: number;
}
/**
 * Server-Sent Events configuration
 */
export interface SSEConfig {
    endpoint: string;
    retry: number;
    keepAlive: number;
    compression: boolean;
}
/**
 * SSE event structure
 */
export interface SSEEvent {
    id: string;
    event: string;
    data: string;
    retry?: number;
}
/**
 * Pub/Sub channel configuration
 */
export interface PubSubChannelConfig {
    name: string;
    pattern: 'fanout' | 'topic' | 'direct';
    persistent: boolean;
    ttl?: number;
    maxSubscribers?: number;
}
/**
 * Message queue configuration
 */
export interface MessageQueueConfig {
    broker: 'rabbitmq' | 'kafka' | 'redis' | 'nats';
    connectionUrl: string;
    exchange?: string;
    queue?: string;
    topic?: string;
    options: Record<string, any>;
}
/**
 * Stream processing pipeline
 */
export interface StreamPipeline {
    id: string;
    name: string;
    source: StreamSource;
    processors: StreamProcessor[];
    sink: StreamSink;
    errorHandling: ErrorHandlingStrategy;
}
/**
 * Stream source configuration
 */
export interface StreamSource {
    type: 'websocket' | 'sse' | 'pubsub' | 'queue' | 'feed';
    config: any;
}
/**
 * Stream processor
 */
export interface StreamProcessor {
    id: string;
    type: 'filter' | 'transform' | 'enrich' | 'aggregate' | 'deduplicate';
    config: any;
}
/**
 * Stream sink configuration
 */
export interface StreamSink {
    type: 'websocket' | 'webhook' | 'database' | 'storage' | 'pubsub';
    config: any;
}
/**
 * Error handling strategy
 */
export interface ErrorHandlingStrategy {
    onError: 'retry' | 'skip' | 'deadletter' | 'halt';
    maxRetries: number;
    retryDelay: number;
    deadLetterQueue?: string;
}
/**
 * Stream metrics
 */
export interface StreamMetrics {
    messagesProcessed: number;
    messagesPerSecond: number;
    averageLatency: number;
    errorRate: number;
    activeSubscriptions: number;
    bytesTransferred: number;
}
/**
 * Real-time threat event
 */
export interface RealTimeThreatEvent {
    id: string;
    type: 'new_threat' | 'threat_update' | 'ioc_detected' | 'campaign_started' | 'alert_triggered';
    severity: ThreatSeverity;
    threat: ThreatIntelligence | ThreatIndicator;
    timestamp: Date;
    source: string;
    tlp: TLPLevel;
}
/**
 * Creates WebSocket server configuration
 * Composes: rate limiting, authentication, heartbeat setup
 */
export declare const createWebSocketServer: (config: Partial<WebSocketConfig>) => WebSocketConfig;
/**
 * Handles WebSocket connection lifecycle
 * Composes: authentication, subscription management, heartbeat
 */
export declare const handleWebSocketConnection: (clientId: string, authToken: string, subscriptionFilters: SubscriptionFilter) => Promise<{
    connectionId: string;
    status: WebSocketStatus;
    subscriptions: StreamSubscription[];
}>;
/**
 * Creates WebSocket message for threat updates
 * Composes: normalizeThreatData, filterIntelligence
 */
export declare const createThreatUpdateMessage: (threat: ThreatIntelligence, messageType?: WebSocketMessageType) => WebSocketMessage<ThreatIntelligence>;
/**
 * Filters WebSocket messages based on subscription
 * Composes: filterIntelligence, validateTLPSharing
 */
export declare const filterWebSocketMessage: (message: WebSocketMessage<ThreatIntelligence>, subscription: StreamSubscription) => boolean;
/**
 * Broadcasts threat intelligence to WebSocket clients
 * Composes: createThreatUpdateMessage, filterWebSocketMessage
 */
export declare const broadcastThreatUpdate: (threat: ThreatIntelligence, subscriptions: StreamSubscription[]) => Promise<{
    sent: number;
    filtered: number;
    errors: number;
}>;
/**
 * Manages WebSocket heartbeat mechanism
 * Composes: ping/pong messages, connection monitoring
 */
export declare const manageWebSocketHeartbeat: (config: HeartbeatConfig) => {
    start: () => void;
    stop: () => void;
    ping: () => WebSocketMessage;
    pong: () => WebSocketMessage;
};
/**
 * Implements WebSocket reconnection logic
 * Composes: exponential backoff, connection retry
 */
export declare const handleWebSocketReconnection: (config: ReconnectConfig, attemptNumber: number) => {
    shouldRetry: boolean;
    delay: number;
    nextAttempt: number;
};
/**
 * Compresses WebSocket message payload
 * Composes: JSON serialization, gzip compression
 */
export declare const compressWebSocketMessage: (message: WebSocketMessage) => {
    compressed: string;
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
};
/**
 * Creates SSE endpoint configuration
 * Composes: retry logic, keep-alive, compression
 */
export declare const createSSEEndpoint: (config: Partial<SSEConfig>) => SSEConfig;
/**
 * Formats threat intelligence as SSE event
 * Composes: normalizeThreatData, JSON serialization
 */
export declare const formatThreatAsSSE: (threat: ThreatIntelligence, eventType?: string) => SSEEvent;
/**
 * Streams threat feed updates via SSE
 * Composes: fetchIntelligenceFromSource, formatThreatAsSSE
 */
export declare const streamThreatFeedViaSSE: (source: IntelligenceSource, filters: SubscriptionFilter) => AsyncGenerator<SSEEvent>;
/**
 * Sends SSE keep-alive messages
 * Composes: heartbeat pattern for SSE
 */
export declare const sendSSEKeepAlive: () => SSEEvent;
/**
 * Manages SSE connection lifecycle
 * Composes: connection tracking, auto-reconnect
 */
export declare const manageSSEConnection: (clientId: string, endpoint: string) => {
    connect: () => void;
    disconnect: () => void;
    onMessage: (handler: (event: SSEEvent) => void) => void;
    onError: (handler: (error: Error) => void) => void;
};
/**
 * Creates Pub/Sub channel for threat intelligence
 * Composes: channel configuration, subscriber management
 */
export declare const createThreatPubSubChannel: (config: Partial<PubSubChannelConfig>) => PubSubChannelConfig;
/**
 * Publishes threat intelligence to Pub/Sub channel
 * Composes: normalizeThreatData, message serialization
 */
export declare const publishThreatToPubSub: (channel: string, threat: ThreatIntelligence, tlp: TLPLevel) => Promise<{
    published: boolean;
    messageId: string;
    subscribers: number;
}>;
/**
 * Subscribes to threat intelligence Pub/Sub channel
 * Composes: subscription management, message filtering
 */
export declare const subscribeToPubSubChannel: (channel: string, filters: SubscriptionFilter, handler: (threat: ThreatIntelligence) => void) => {
    subscriptionId: string;
    unsubscribe: () => void;
};
/**
 * Creates message queue consumer for threat feeds
 * Composes: queue connection, message processing
 */
export declare const createThreatQueueConsumer: (config: MessageQueueConfig) => {
    start: () => Promise<void>;
    stop: () => Promise<void>;
    onMessage: (handler: (message: any) => void) => void;
};
/**
 * Creates message queue producer for threat distribution
 * Composes: queue connection, message publishing
 */
export declare const createThreatQueueProducer: (config: MessageQueueConfig) => {
    publish: (threat: ThreatIntelligence) => Promise<void>;
    close: () => Promise<void>;
};
/**
 * Creates stream processing pipeline
 * Composes: source, processors, sink configuration
 */
export declare const createStreamProcessingPipeline: (config: Partial<StreamPipeline>) => StreamPipeline;
/**
 * Processes stream with filtering
 * Composes: filterIntelligence, normalizeThreatData
 */
export declare const processStreamWithFiltering: (source: AsyncIterable<ThreatIntelligence>, filters: SubscriptionFilter) => AsyncGenerator<ThreatIntelligence>;
/**
 * Processes stream with enrichment
 * Composes: enrichThreatIntelligence, findRelatedIntelligence
 */
export declare const processStreamWithEnrichment: (source: AsyncIterable<ThreatIntelligence>) => AsyncGenerator<ThreatIntelligence>;
/**
 * Processes stream with deduplication
 * Composes: deduplicateIndicators for threat intelligence
 */
export declare const processStreamWithDeduplication: (source: AsyncIterable<ThreatIntelligence>, timeWindow?: number) => AsyncGenerator<ThreatIntelligence>;
/**
 * Processes stream with aggregation
 * Composes: aggregateIntelligence across multiple sources
 */
export declare const processStreamWithAggregation: (sources: AsyncIterable<ThreatIntelligence>[], windowSize?: number) => AsyncGenerator<ThreatIntelligence[]>;
/**
 * Handles stream backpressure
 * Composes: buffer management, flow control
 */
export declare const handleStreamBackpressure: <T>(source: AsyncIterable<T>, bufferSize?: number) => AsyncGenerator<T>;
/**
 * Creates real-time threat event
 * Composes: normalizeThreatData, getTLPClassification
 */
export declare const createRealTimeThreatEvent: (threat: ThreatIntelligence, eventType: RealTimeThreatEvent["type"]) => RealTimeThreatEvent;
/**
 * Streams threat events to multiple channels
 * Composes: WebSocket, SSE, Pub/Sub broadcasting
 */
export declare const streamThreatEventToChannels: (event: RealTimeThreatEvent, channels: {
    websocket?: boolean;
    sse?: boolean;
    pubsub?: boolean;
    webhook?: boolean;
}) => Promise<{
    websocket: {
        sent: number;
    };
    sse: {
        sent: number;
    };
    pubsub: {
        sent: number;
    };
    webhook: {
        sent: number;
    };
}>;
/**
 * Filters real-time events by severity
 * Composes: severity-based filtering for streams
 */
export declare const filterRealTimeEventsBySeverity: (event: RealTimeThreatEvent, allowedSeverities: ThreatSeverity[]) => boolean;
/**
 * Batches real-time events for efficient delivery
 * Composes: event batching, compression
 */
export declare const batchRealTimeThreatEvents: (source: AsyncIterable<RealTimeThreatEvent>, batchSize?: number, timeWindow?: number) => AsyncGenerator<RealTimeThreatEvent[]>;
/**
 * Streams STIX bundles in real-time
 * Composes: createSTIXBundle, serializeSTIXBundle, streaming
 */
export declare const streamStixBundles: (source: AsyncIterable<ThreatIntelligence>) => AsyncGenerator<string>;
/**
 * Subscribes to TAXII collection stream
 * Composes: TAXII polling, STIX parsing, validation
 */
export declare const subscribeToTaxiiStream: (collectionUrl: string, credentials: any, pollInterval?: number) => AsyncGenerator<STIXBundle>;
/**
 * Converts threat stream to STIX indicators
 * Composes: generateSTIXPattern, createSTIXIndicator
 */
export declare const convertThreatStreamToStix: (source: AsyncIterable<ThreatIndicator>) => AsyncGenerator<STIXIndicator>;
/**
 * Calculates real-time stream metrics
 * Composes: message counting, latency tracking, throughput calculation
 */
export declare const calculateStreamMetrics: (messagesProcessed: number, startTime: number, endTime: number, errors: number, bytesTransferred: number) => StreamMetrics;
/**
 * Monitors stream health in real-time
 * Composes: monitorFeedHealth, stream metrics, error tracking
 */
export declare const monitorStreamHealth: (streamId: string, metrics: StreamMetrics) => Promise<{
    healthy: boolean;
    issues: string[];
    recommendations: string[];
}>;
/**
 * Aggregates metrics across multiple streams
 * Composes: metrics collection, aggregation, reporting
 */
export declare const aggregateStreamMetrics: (streamMetrics: Map<string, StreamMetrics>) => {
    total: StreamMetrics;
    perStream: Map<string, StreamMetrics>;
};
export { createWebSocketServer, handleWebSocketConnection, createThreatUpdateMessage, filterWebSocketMessage, broadcastThreatUpdate, manageWebSocketHeartbeat, handleWebSocketReconnection, compressWebSocketMessage, createSSEEndpoint, formatThreatAsSSE, streamThreatFeedViaSSE, sendSSEKeepAlive, manageSSEConnection, createThreatPubSubChannel, publishThreatToPubSub, subscribeToPubSubChannel, createThreatQueueConsumer, createThreatQueueProducer, createStreamProcessingPipeline, processStreamWithFiltering, processStreamWithEnrichment, processStreamWithDeduplication, processStreamWithAggregation, handleStreamBackpressure, createRealTimeThreatEvent, streamThreatEventToChannels, filterRealTimeEventsBySeverity, batchRealTimeThreatEvents, streamStixBundles, subscribeToTaxiiStream, convertThreatStreamToStix, calculateStreamMetrics, monitorStreamHealth, aggregateStreamMetrics, };
//# sourceMappingURL=real-time-threat-streaming-composite.d.ts.map