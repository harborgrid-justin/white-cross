/**
 * LOC: MAILRTUP1234567
 * File: /reuse/server/mail/mail-realtime-updates-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS WebSocket gateways
 *   - Mail services
 *   - Real-time notification services
 *   - Socket.IO adapters
 *   - Redis pub/sub services
 *   - Sequelize models
 */
/**
 * Real-time event types for mail system WebSocket notifications.
 */
type MailRealtimeEventType = 'mail:new' | 'mail:updated' | 'mail:deleted' | 'mail:moved' | 'mail:copied' | 'mail:flag-changed' | 'mail:read-status-changed' | 'folder:created' | 'folder:updated' | 'folder:deleted' | 'folder:unread-count-changed' | 'typing:start' | 'typing:stop' | 'presence:online' | 'presence:offline' | 'presence:away' | 'presence:busy' | 'sync:started' | 'sync:completed' | 'sync:failed' | 'connection:established' | 'connection:reconnected' | 'subscription:confirmed' | 'heartbeat:ping' | 'heartbeat:pong';
/**
 * Base real-time event payload structure.
 */
interface RealtimeEvent {
    id: string;
    eventType: MailRealtimeEventType;
    timestamp: Date;
    userId: string;
    data: any;
    metadata?: Record<string, any>;
}
/**
 * New mail event payload.
 */
interface NewMailEvent extends RealtimeEvent {
    eventType: 'mail:new';
    data: {
        messageId: string;
        folderId: string;
        subject: string;
        from: EmailAddress;
        bodyPreview: string;
        importance: 'low' | 'normal' | 'high';
        hasAttachments: boolean;
        receivedDateTime: Date;
        conversationId?: string;
    };
}
/**
 * Mail updated event payload.
 */
interface MailUpdatedEvent extends RealtimeEvent {
    eventType: 'mail:updated';
    data: {
        messageId: string;
        folderId: string;
        changes: {
            subject?: string;
            isRead?: boolean;
            isFlagged?: boolean;
            categories?: string[];
            importance?: 'low' | 'normal' | 'high';
        };
    };
}
/**
 * Mail moved event payload.
 */
interface MailMovedEvent extends RealtimeEvent {
    eventType: 'mail:moved';
    data: {
        messageId: string;
        sourceFolderId: string;
        destinationFolderId: string;
        conversationId?: string;
    };
}
/**
 * Folder update event payload.
 */
interface FolderUpdateEvent extends RealtimeEvent {
    eventType: 'folder:created' | 'folder:updated' | 'folder:deleted' | 'folder:unread-count-changed';
    data: {
        folderId: string;
        folderName?: string;
        parentFolderId?: string;
        unreadCount?: number;
        totalCount?: number;
        folderPath?: string;
    };
}
/**
 * Typing indicator event payload.
 */
interface TypingEvent extends RealtimeEvent {
    eventType: 'typing:start' | 'typing:stop';
    data: {
        conversationId?: string;
        messageId?: string;
        recipientAddress: string;
    };
}
/**
 * Presence event payload.
 */
interface PresenceEvent extends RealtimeEvent {
    eventType: 'presence:online' | 'presence:offline' | 'presence:away' | 'presence:busy';
    data: {
        status: 'online' | 'offline' | 'away' | 'busy';
        statusMessage?: string;
        lastActiveAt: Date;
    };
}
/**
 * Sync status event payload.
 */
interface SyncEvent extends RealtimeEvent {
    eventType: 'sync:started' | 'sync:completed' | 'sync:failed';
    data: {
        syncId: string;
        folderId?: string;
        itemsProcessed?: number;
        totalItems?: number;
        progress?: number;
        error?: string;
    };
}
interface EmailAddress {
    name?: string;
    address: string;
}
/**
 * WebSocket connection state.
 */
interface WebSocketConnection {
    id: string;
    socketId: string;
    userId: string;
    deviceId?: string;
    deviceType?: 'web' | 'mobile' | 'desktop';
    connectionState: 'connecting' | 'connected' | 'reconnecting' | 'disconnected';
    connectedAt: Date;
    lastActiveAt: Date;
    lastHeartbeatAt: Date;
    clientVersion?: string;
    ipAddress?: string;
    userAgent?: string;
    rooms: string[];
    subscriptions: EventSubscription[];
    metadata?: Record<string, any>;
}
/**
 * Event subscription configuration.
 */
interface EventSubscription {
    id: string;
    userId: string;
    socketId: string;
    eventTypes: MailRealtimeEventType[];
    folderIds?: string[];
    filters?: EventFilter;
    createdAt: Date;
    expiresAt?: Date;
}
/**
 * Event filtering criteria.
 */
interface EventFilter {
    importance?: ('low' | 'normal' | 'high')[];
    senderAddresses?: string[];
    categories?: string[];
    hasAttachments?: boolean;
    isRead?: boolean;
    customFilters?: Record<string, any>;
}
/**
 * Room configuration for Socket.IO.
 */
interface RoomConfiguration {
    roomId: string;
    roomType: 'user' | 'folder' | 'conversation' | 'broadcast';
    members: string[];
    createdAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Presence tracking record.
 */
interface PresenceRecord {
    id: string;
    userId: string;
    status: 'online' | 'offline' | 'away' | 'busy';
    statusMessage?: string;
    connections: string[];
    lastActiveAt: Date;
    lastStatusChangeAt: Date;
    metadata?: Record<string, any>;
}
/**
 * Typing indicator tracking.
 */
interface TypingIndicator {
    id: string;
    userId: string;
    conversationId?: string;
    messageId?: string;
    recipientAddress: string;
    startedAt: Date;
    expiresAt: Date;
}
/**
 * Heartbeat configuration.
 */
interface HeartbeatConfig {
    interval: number;
    timeout: number;
    maxMissed: number;
    enabled: boolean;
}
/**
 * WebSocket gateway configuration.
 */
interface GatewayConfiguration {
    namespace: string;
    port?: number;
    cors: {
        origin: string | string[];
        credentials: boolean;
    };
    transports: ('websocket' | 'polling')[];
    pingInterval: number;
    pingTimeout: number;
    maxConnections?: number;
    redis?: {
        host: string;
        port: number;
        password?: string;
        db?: number;
    };
    authentication: {
        required: boolean;
        jwtSecret?: string;
        tokenHeader?: string;
    };
}
/**
 * Reconnection attempt tracking.
 */
interface ReconnectionAttempt {
    id: string;
    userId: string;
    socketId: string;
    previousSocketId: string;
    attemptNumber: number;
    disconnectedAt: Date;
    reconnectedAt?: Date;
    success: boolean;
    error?: string;
}
/**
 * Exchange Server streaming notification subscription.
 */
interface ExchangeStreamingSubscription {
    id: string;
    userId: string;
    subscriptionId: string;
    connectionId: string;
    folderIds: string[];
    eventTypes: string[];
    watermark: string;
    createdAt: Date;
    expiresAt: Date;
    lastEventAt?: Date;
    isActive: boolean;
}
/**
 * Real-time event delivery status.
 */
interface EventDeliveryStatus {
    id: string;
    eventId: string;
    socketId: string;
    userId: string;
    deliveryStatus: 'pending' | 'sent' | 'acknowledged' | 'failed';
    sentAt?: Date;
    acknowledgedAt?: Date;
    attempts: number;
    lastAttemptAt: Date;
    error?: string;
}
/**
 * WebSocket metrics and statistics.
 */
interface WebSocketMetrics {
    totalConnections: number;
    activeConnections: number;
    reconnections: number;
    disconnections: number;
    eventsSent: number;
    eventsReceived: number;
    eventsAcknowledged: number;
    averageLatency: number;
    peakConnections: number;
    errorRate: number;
    byEventType: Record<MailRealtimeEventType, number>;
    byRoom: Record<string, number>;
}
/**
 * Swagger WebSocket event schema.
 */
interface SwaggerWebSocketSchema {
    eventName: string;
    description: string;
    payload: any;
    example: any;
    acknowledgement?: boolean;
}
/**
 * Sequelize WebSocketConnection model attributes for websocket_connections table.
 *
 * @example
 * ```typescript
 * class WebSocketConnection extends Model {}
 * WebSocketConnection.init(getWebSocketConnectionModelAttributes(), {
 *   sequelize,
 *   tableName: 'websocket_connections',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['userId'] },
 *     { fields: ['socketId'], unique: true },
 *     { fields: ['connectionState'] },
 *     { fields: ['lastActiveAt'] }
 *   ]
 * });
 * ```
 */
export declare const getWebSocketConnectionModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    socketId: {
        type: string;
        allowNull: boolean;
        unique: boolean;
        comment: string;
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    deviceId: {
        type: string;
        allowNull: boolean;
    };
    deviceType: {
        type: string;
        values: string[];
        allowNull: boolean;
    };
    connectionState: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    connectedAt: {
        type: string;
        allowNull: boolean;
    };
    lastActiveAt: {
        type: string;
        allowNull: boolean;
    };
    lastHeartbeatAt: {
        type: string;
        allowNull: boolean;
    };
    clientVersion: {
        type: string;
        allowNull: boolean;
    };
    ipAddress: {
        type: string;
        allowNull: boolean;
    };
    userAgent: {
        type: string;
        allowNull: boolean;
    };
    rooms: {
        type: string;
        defaultValue: never[];
    };
    metadata: {
        type: string;
        allowNull: boolean;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize EventSubscription model attributes for event_subscriptions table.
 *
 * @example
 * ```typescript
 * class EventSubscription extends Model {}
 * EventSubscription.init(getEventSubscriptionModelAttributes(), {
 *   sequelize,
 *   tableName: 'event_subscriptions',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['userId', 'socketId'] },
 *     { fields: ['eventTypes'], using: 'gin' },
 *     { fields: ['expiresAt'] }
 *   ]
 * });
 * ```
 */
export declare const getEventSubscriptionModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    socketId: {
        type: string;
        allowNull: boolean;
    };
    eventTypes: {
        type: string;
        allowNull: boolean;
        defaultValue: never[];
        comment: string;
    };
    folderIds: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    filters: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    expiresAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize PresenceRecord model attributes for presence_records table.
 *
 * @example
 * ```typescript
 * class PresenceRecord extends Model {}
 * PresenceRecord.init(getPresenceRecordModelAttributes(), {
 *   sequelize,
 *   tableName: 'presence_records',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['userId'], unique: true },
 *     { fields: ['status'] },
 *     { fields: ['lastActiveAt'] }
 *   ]
 * });
 * ```
 */
export declare const getPresenceRecordModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    userId: {
        type: string;
        allowNull: boolean;
        unique: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    status: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    statusMessage: {
        type: string;
        allowNull: boolean;
    };
    connections: {
        type: string;
        defaultValue: never[];
        comment: string;
    };
    lastActiveAt: {
        type: string;
        allowNull: boolean;
    };
    lastStatusChangeAt: {
        type: string;
        allowNull: boolean;
    };
    metadata: {
        type: string;
        allowNull: boolean;
        defaultValue: {};
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Sequelize ExchangeStreamingSubscription model attributes for exchange_streaming_subscriptions table.
 *
 * @example
 * ```typescript
 * class ExchangeStreamingSubscription extends Model {}
 * ExchangeStreamingSubscription.init(getExchangeStreamingSubscriptionModelAttributes(), {
 *   sequelize,
 *   tableName: 'exchange_streaming_subscriptions',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['userId'] },
 *     { fields: ['subscriptionId'], unique: true },
 *     { fields: ['isActive'] }
 *   ]
 * });
 * ```
 */
export declare const getExchangeStreamingSubscriptionModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    subscriptionId: {
        type: string;
        allowNull: boolean;
        unique: boolean;
        comment: string;
    };
    connectionId: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    folderIds: {
        type: string;
        allowNull: boolean;
        defaultValue: never[];
    };
    eventTypes: {
        type: string;
        allowNull: boolean;
        defaultValue: string[];
    };
    watermark: {
        type: string;
        allowNull: boolean;
        comment: string;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    expiresAt: {
        type: string;
        allowNull: boolean;
    };
    lastEventAt: {
        type: string;
        allowNull: boolean;
    };
    isActive: {
        type: string;
        defaultValue: boolean;
    };
};
/**
 * Sequelize EventDeliveryStatus model attributes for event_delivery_status table.
 *
 * @example
 * ```typescript
 * class EventDeliveryStatus extends Model {}
 * EventDeliveryStatus.init(getEventDeliveryStatusModelAttributes(), {
 *   sequelize,
 *   tableName: 'event_delivery_status',
 *   timestamps: true,
 *   indexes: [
 *     { fields: ['eventId'] },
 *     { fields: ['socketId', 'deliveryStatus'] },
 *     { fields: ['userId'] }
 *   ]
 * });
 * ```
 */
export declare const getEventDeliveryStatusModelAttributes: () => {
    id: {
        type: string;
        defaultValue: string;
        primaryKey: boolean;
    };
    eventId: {
        type: string;
        allowNull: boolean;
    };
    socketId: {
        type: string;
        allowNull: boolean;
    };
    userId: {
        type: string;
        allowNull: boolean;
        references: {
            model: string;
            key: string;
        };
    };
    deliveryStatus: {
        type: string;
        values: string[];
        defaultValue: string;
    };
    sentAt: {
        type: string;
        allowNull: boolean;
    };
    acknowledgedAt: {
        type: string;
        allowNull: boolean;
    };
    attempts: {
        type: string;
        defaultValue: number;
    };
    lastAttemptAt: {
        type: string;
        allowNull: boolean;
    };
    error: {
        type: string;
        allowNull: boolean;
    };
    createdAt: {
        type: string;
        allowNull: boolean;
    };
    updatedAt: {
        type: string;
        allowNull: boolean;
    };
};
/**
 * Creates default WebSocket gateway configuration for NestJS.
 *
 * @param {Partial<GatewayConfiguration>} options - Configuration options
 * @returns {GatewayConfiguration} Complete gateway configuration
 *
 * @example
 * ```typescript
 * const config = createGatewayConfiguration({
 *   namespace: '/mail',
 *   port: 3001,
 *   cors: {
 *     origin: ['http://localhost:3000', 'https://app.whitecross.com'],
 *     credentials: true
 *   },
 *   redis: {
 *     host: 'localhost',
 *     port: 6379
 *   }
 * });
 * ```
 */
export declare const createGatewayConfiguration: (options: Partial<GatewayConfiguration>) => GatewayConfiguration;
/**
 * Creates heartbeat configuration for connection monitoring.
 *
 * @param {Partial<HeartbeatConfig>} options - Heartbeat options
 * @returns {HeartbeatConfig} Complete heartbeat configuration
 *
 * @example
 * ```typescript
 * const heartbeat = createHeartbeatConfiguration({
 *   interval: 30000,
 *   timeout: 5000,
 *   maxMissed: 3
 * });
 * ```
 */
export declare const createHeartbeatConfiguration: (options?: Partial<HeartbeatConfig>) => HeartbeatConfig;
/**
 * Creates a new WebSocket connection record.
 *
 * @param {string} socketId - Socket.IO connection ID
 * @param {string} userId - User ID
 * @param {object} metadata - Connection metadata
 * @returns {WebSocketConnection} Connection record
 *
 * @example
 * ```typescript
 * const connection = createWebSocketConnection('socket-123', 'user-456', {
 *   deviceType: 'web',
 *   clientVersion: '2.1.0',
 *   ipAddress: '192.168.1.1',
 *   userAgent: 'Mozilla/5.0...'
 * });
 * ```
 */
export declare const createWebSocketConnection: (socketId: string, userId: string, metadata?: any) => WebSocketConnection;
/**
 * Updates connection state and last active timestamp.
 *
 * @param {WebSocketConnection} connection - Connection record
 * @param {string} state - New connection state
 * @returns {WebSocketConnection} Updated connection
 *
 * @example
 * ```typescript
 * const updated = updateConnectionState(connection, 'reconnecting');
 * ```
 */
export declare const updateConnectionState: (connection: WebSocketConnection, state: "connecting" | "connected" | "reconnecting" | "disconnected") => WebSocketConnection;
/**
 * Handles client disconnection and cleanup.
 *
 * @param {string} socketId - Socket ID that disconnected
 * @param {string} userId - User ID
 * @returns {object} Disconnection result
 *
 * @example
 * ```typescript
 * const result = await handleClientDisconnection('socket-123', 'user-456');
 * console.log('Rooms cleaned:', result.roomsCleaned);
 * console.log('Subscriptions removed:', result.subscriptionsRemoved);
 * ```
 */
export declare const handleClientDisconnection: (socketId: string, userId: string) => {
    socketId: string;
    userId: string;
    disconnectedAt: Date;
    roomsCleaned: number;
    subscriptionsRemoved: number;
};
/**
 * Handles client reconnection and state restoration.
 *
 * @param {string} newSocketId - New socket ID
 * @param {string} previousSocketId - Previous socket ID
 * @param {string} userId - User ID
 * @returns {ReconnectionAttempt} Reconnection record
 *
 * @example
 * ```typescript
 * const reconnection = await handleClientReconnection(
 *   'socket-new-123',
 *   'socket-old-456',
 *   'user-789'
 * );
 * console.log('Reconnection successful:', reconnection.success);
 * ```
 */
export declare const handleClientReconnection: (newSocketId: string, previousSocketId: string, userId: string) => ReconnectionAttempt;
/**
 * Validates WebSocket authentication token.
 *
 * @param {string} token - JWT or auth token
 * @param {string} secret - JWT secret
 * @returns {object} Validation result with user info
 *
 * @example
 * ```typescript
 * const auth = validateWebSocketAuthentication(token, process.env.JWT_SECRET);
 * if (auth.valid) {
 *   console.log('User ID:', auth.userId);
 * }
 * ```
 */
export declare const validateWebSocketAuthentication: (token: string, secret: string) => {
    valid: boolean;
    userId?: string;
    error?: string;
};
/**
 * Generates room ID for user-specific events.
 *
 * @param {string} userId - User ID
 * @returns {string} Room ID
 *
 * @example
 * ```typescript
 * const roomId = generateUserRoomId('user-123');
 * // Returns: 'user:user-123'
 * ```
 */
export declare const generateUserRoomId: (userId: string) => string;
/**
 * Generates room ID for folder-specific events.
 *
 * @param {string} userId - User ID
 * @param {string} folderId - Folder ID
 * @returns {string} Room ID
 *
 * @example
 * ```typescript
 * const roomId = generateFolderRoomId('user-123', 'folder-456');
 * // Returns: 'user:user-123:folder:folder-456'
 * ```
 */
export declare const generateFolderRoomId: (userId: string, folderId: string) => string;
/**
 * Generates room ID for conversation threads.
 *
 * @param {string} userId - User ID
 * @param {string} conversationId - Conversation ID
 * @returns {string} Room ID
 *
 * @example
 * ```typescript
 * const roomId = generateConversationRoomId('user-123', 'conv-789');
 * // Returns: 'user:user-123:conversation:conv-789'
 * ```
 */
export declare const generateConversationRoomId: (userId: string, conversationId: string) => string;
/**
 * Joins a client to specific rooms based on subscriptions.
 *
 * @param {string} socketId - Socket ID
 * @param {string} userId - User ID
 * @param {string[]} folderIds - Folder IDs to subscribe to
 * @returns {string[]} Array of joined room IDs
 *
 * @example
 * ```typescript
 * const rooms = joinUserRooms('socket-123', 'user-456', ['inbox', 'sent', 'drafts']);
 * console.log('Joined rooms:', rooms);
 * ```
 */
export declare const joinUserRooms: (socketId: string, userId: string, folderIds?: string[]) => string[];
/**
 * Creates room configuration for Socket.IO namespace.
 *
 * @param {string} roomType - Room type
 * @param {string} identifier - Room identifier
 * @param {string[]} members - Initial members
 * @returns {RoomConfiguration} Room configuration
 *
 * @example
 * ```typescript
 * const room = createRoomConfiguration('folder', 'inbox-123', ['socket-1', 'socket-2']);
 * ```
 */
export declare const createRoomConfiguration: (roomType: "user" | "folder" | "conversation" | "broadcast", identifier: string, members?: string[]) => RoomConfiguration;
/**
 * Creates a new mail event for real-time notification.
 *
 * @param {string} userId - User ID
 * @param {any} mailData - Mail message data
 * @returns {NewMailEvent} New mail event
 *
 * @example
 * ```typescript
 * const event = createNewMailEvent('user-123', {
 *   id: 'msg-456',
 *   folderId: 'inbox-789',
 *   subject: 'Patient Update',
 *   from: { name: 'Dr. Smith', address: 'smith@whitecross.com' },
 *   bodyPreview: 'The patient has been discharged...',
 *   importance: 'high',
 *   hasAttachments: true,
 *   receivedDateTime: new Date()
 * });
 * ```
 */
export declare const createNewMailEvent: (userId: string, mailData: any) => NewMailEvent;
/**
 * Creates a mail updated event for real-time notification.
 *
 * @param {string} userId - User ID
 * @param {string} messageId - Message ID
 * @param {string} folderId - Folder ID
 * @param {object} changes - Changed fields
 * @returns {MailUpdatedEvent} Mail updated event
 *
 * @example
 * ```typescript
 * const event = createMailUpdatedEvent('user-123', 'msg-456', 'inbox-789', {
 *   isRead: true,
 *   isFlagged: true,
 *   categories: ['important', 'follow-up']
 * });
 * ```
 */
export declare const createMailUpdatedEvent: (userId: string, messageId: string, folderId: string, changes: any) => MailUpdatedEvent;
/**
 * Creates a mail moved event for real-time notification.
 *
 * @param {string} userId - User ID
 * @param {string} messageId - Message ID
 * @param {string} sourceFolderId - Source folder ID
 * @param {string} destinationFolderId - Destination folder ID
 * @param {string} conversationId - Optional conversation ID
 * @returns {MailMovedEvent} Mail moved event
 *
 * @example
 * ```typescript
 * const event = createMailMovedEvent('user-123', 'msg-456', 'inbox', 'archive', 'conv-789');
 * ```
 */
export declare const createMailMovedEvent: (userId: string, messageId: string, sourceFolderId: string, destinationFolderId: string, conversationId?: string) => MailMovedEvent;
/**
 * Creates a folder update event for real-time notification.
 *
 * @param {string} userId - User ID
 * @param {string} folderId - Folder ID
 * @param {MailRealtimeEventType} eventType - Event type
 * @param {object} folderData - Folder data
 * @returns {FolderUpdateEvent} Folder update event
 *
 * @example
 * ```typescript
 * const event = createFolderUpdateEvent('user-123', 'folder-456', 'folder:unread-count-changed', {
 *   folderName: 'Inbox',
 *   unreadCount: 5,
 *   totalCount: 150
 * });
 * ```
 */
export declare const createFolderUpdateEvent: (userId: string, folderId: string, eventType: "folder:created" | "folder:updated" | "folder:deleted" | "folder:unread-count-changed", folderData: any) => FolderUpdateEvent;
/**
 * Creates a typing indicator event.
 *
 * @param {string} userId - User ID
 * @param {boolean} isTyping - Whether user is typing or stopped
 * @param {object} context - Typing context
 * @returns {TypingEvent} Typing event
 *
 * @example
 * ```typescript
 * const event = createTypingEvent('user-123', true, {
 *   conversationId: 'conv-456',
 *   recipientAddress: 'johnson@whitecross.com'
 * });
 * ```
 */
export declare const createTypingEvent: (userId: string, isTyping: boolean, context: {
    conversationId?: string;
    messageId?: string;
    recipientAddress: string;
}) => TypingEvent;
/**
 * Creates a presence event for user status changes.
 *
 * @param {string} userId - User ID
 * @param {string} status - Presence status
 * @param {string} statusMessage - Optional status message
 * @returns {PresenceEvent} Presence event
 *
 * @example
 * ```typescript
 * const event = createPresenceEvent('user-123', 'busy', 'In a meeting until 3 PM');
 * ```
 */
export declare const createPresenceEvent: (userId: string, status: "online" | "offline" | "away" | "busy", statusMessage?: string) => PresenceEvent;
/**
 * Creates a sync status event.
 *
 * @param {string} userId - User ID
 * @param {string} syncId - Sync operation ID
 * @param {MailRealtimeEventType} eventType - Sync event type
 * @param {object} syncData - Sync data
 * @returns {SyncEvent} Sync event
 *
 * @example
 * ```typescript
 * const event = createSyncEvent('user-123', 'sync-456', 'sync:started', {
 *   folderId: 'inbox',
 *   totalItems: 100
 * });
 * ```
 */
export declare const createSyncEvent: (userId: string, syncId: string, eventType: "sync:started" | "sync:completed" | "sync:failed", syncData: any) => SyncEvent;
/**
 * Creates an event subscription for a WebSocket connection.
 *
 * @param {string} userId - User ID
 * @param {string} socketId - Socket ID
 * @param {MailRealtimeEventType[]} eventTypes - Event types to subscribe to
 * @param {object} options - Subscription options
 * @returns {EventSubscription} Event subscription
 *
 * @example
 * ```typescript
 * const subscription = createEventSubscription('user-123', 'socket-456',
 *   ['mail:new', 'mail:updated', 'folder:unread-count-changed'],
 *   {
 *     folderIds: ['inbox', 'sent'],
 *     filters: {
 *       importance: ['high', 'urgent'],
 *       hasAttachments: true
 *     },
 *     expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
 *   }
 * );
 * ```
 */
export declare const createEventSubscription: (userId: string, socketId: string, eventTypes: MailRealtimeEventType[], options?: {
    folderIds?: string[];
    filters?: EventFilter;
    expiresAt?: Date;
}) => EventSubscription;
/**
 * Updates an existing event subscription.
 *
 * @param {EventSubscription} subscription - Existing subscription
 * @param {object} updates - Subscription updates
 * @returns {EventSubscription} Updated subscription
 *
 * @example
 * ```typescript
 * const updated = updateEventSubscription(subscription, {
 *   eventTypes: ['mail:new', 'mail:updated', 'mail:deleted'],
 *   folderIds: ['inbox', 'sent', 'drafts']
 * });
 * ```
 */
export declare const updateEventSubscription: (subscription: EventSubscription, updates: {
    eventTypes?: MailRealtimeEventType[];
    folderIds?: string[];
    filters?: EventFilter;
    expiresAt?: Date;
}) => EventSubscription;
/**
 * Filters events based on subscription criteria.
 *
 * @param {RealtimeEvent} event - Event to filter
 * @param {EventSubscription} subscription - Subscription with filters
 * @returns {boolean} True if event matches subscription filters
 *
 * @example
 * ```typescript
 * const shouldDeliver = filterEventBySubscription(newMailEvent, subscription);
 * if (shouldDeliver) {
 *   await emitEventToSocket(socketId, newMailEvent);
 * }
 * ```
 */
export declare const filterEventBySubscription: (event: RealtimeEvent, subscription: EventSubscription) => boolean;
/**
 * Removes expired event subscriptions.
 *
 * @param {EventSubscription[]} subscriptions - Array of subscriptions
 * @returns {EventSubscription[]} Active subscriptions
 *
 * @example
 * ```typescript
 * const active = removeExpiredSubscriptions(allSubscriptions);
 * console.log('Active subscriptions:', active.length);
 * ```
 */
export declare const removeExpiredSubscriptions: (subscriptions: EventSubscription[]) => EventSubscription[];
/**
 * Updates user presence status.
 *
 * @param {string} userId - User ID
 * @param {string} status - Presence status
 * @param {string} socketId - Socket ID
 * @param {string} statusMessage - Optional status message
 * @returns {PresenceRecord} Updated presence record
 *
 * @example
 * ```typescript
 * const presence = updateUserPresence('user-123', 'busy', 'socket-456', 'In a meeting');
 * ```
 */
export declare const updateUserPresence: (userId: string, status: "online" | "offline" | "away" | "busy", socketId: string, statusMessage?: string) => PresenceRecord;
/**
 * Gets current presence status for a user.
 *
 * @param {string} userId - User ID
 * @returns {PresenceRecord} Current presence record
 *
 * @example
 * ```typescript
 * const presence = getUserPresence('user-123');
 * console.log('User status:', presence.status);
 * console.log('Active connections:', presence.connections.length);
 * ```
 */
export declare const getUserPresence: (userId: string) => PresenceRecord;
/**
 * Adds a socket connection to user presence.
 *
 * @param {PresenceRecord} presence - Current presence record
 * @param {string} socketId - Socket ID to add
 * @returns {PresenceRecord} Updated presence record
 *
 * @example
 * ```typescript
 * const updated = addConnectionToPresence(presence, 'socket-new-789');
 * ```
 */
export declare const addConnectionToPresence: (presence: PresenceRecord, socketId: string) => PresenceRecord;
/**
 * Removes a socket connection from user presence.
 *
 * @param {PresenceRecord} presence - Current presence record
 * @param {string} socketId - Socket ID to remove
 * @returns {PresenceRecord} Updated presence record
 *
 * @example
 * ```typescript
 * const updated = removeConnectionFromPresence(presence, 'socket-old-456');
 * if (updated.connections.length === 0) {
 *   // User is fully offline
 * }
 * ```
 */
export declare const removeConnectionFromPresence: (presence: PresenceRecord, socketId: string) => PresenceRecord;
/**
 * Starts a typing indicator for a user.
 *
 * @param {string} userId - User ID
 * @param {string} recipientAddress - Recipient email address
 * @param {object} context - Typing context
 * @returns {TypingIndicator} Typing indicator record
 *
 * @example
 * ```typescript
 * const indicator = startTypingIndicator('user-123', 'johnson@whitecross.com', {
 *   conversationId: 'conv-456'
 * });
 * ```
 */
export declare const startTypingIndicator: (userId: string, recipientAddress: string, context?: {
    conversationId?: string;
    messageId?: string;
}) => TypingIndicator;
/**
 * Checks if a typing indicator is still valid.
 *
 * @param {TypingIndicator} indicator - Typing indicator
 * @returns {boolean} True if indicator is still valid
 *
 * @example
 * ```typescript
 * const isValid = isTypingIndicatorValid(indicator);
 * if (!isValid) {
 *   await stopTypingIndicator(indicator.id);
 * }
 * ```
 */
export declare const isTypingIndicatorValid: (indicator: TypingIndicator) => boolean;
/**
 * Creates an Exchange Server streaming notification subscription.
 *
 * @param {string} userId - User ID
 * @param {string} connectionId - WebSocket connection ID
 * @param {string[]} folderIds - Folder IDs to monitor
 * @returns {ExchangeStreamingSubscription} Streaming subscription
 *
 * @example
 * ```typescript
 * const subscription = createExchangeStreamingSubscription(
 *   'user-123',
 *   'socket-456',
 *   ['inbox-folder-id', 'sent-folder-id']
 * );
 * ```
 */
export declare const createExchangeStreamingSubscription: (userId: string, connectionId: string, folderIds: string[]) => ExchangeStreamingSubscription;
/**
 * Processes an Exchange Server streaming notification.
 *
 * @param {ExchangeStreamingSubscription} subscription - Streaming subscription
 * @param {any} exchangeEvent - Exchange event data
 * @returns {RealtimeEvent} Converted real-time event
 *
 * @example
 * ```typescript
 * const event = processExchangeStreamingEvent(subscription, {
 *   eventType: 'NewMail',
 *   itemId: 'msg-789',
 *   parentFolderId: 'inbox',
 *   watermark: 'AQAAAA=='
 * });
 * ```
 */
export declare const processExchangeStreamingEvent: (subscription: ExchangeStreamingSubscription, exchangeEvent: any) => RealtimeEvent;
/**
 * Renews an Exchange streaming subscription.
 *
 * @param {ExchangeStreamingSubscription} subscription - Subscription to renew
 * @returns {ExchangeStreamingSubscription} Renewed subscription
 *
 * @example
 * ```typescript
 * const renewed = renewExchangeStreamingSubscription(subscription);
 * console.log('New expiry:', renewed.expiresAt);
 * ```
 */
export declare const renewExchangeStreamingSubscription: (subscription: ExchangeStreamingSubscription) => ExchangeStreamingSubscription;
/**
 * Records event delivery attempt to a socket.
 *
 * @param {string} eventId - Event ID
 * @param {string} socketId - Socket ID
 * @param {string} userId - User ID
 * @returns {EventDeliveryStatus} Delivery status record
 *
 * @example
 * ```typescript
 * const delivery = recordEventDelivery('event-123', 'socket-456', 'user-789');
 * ```
 */
export declare const recordEventDelivery: (eventId: string, socketId: string, userId: string) => EventDeliveryStatus;
/**
 * Acknowledges event receipt from client.
 *
 * @param {EventDeliveryStatus} delivery - Delivery status record
 * @returns {EventDeliveryStatus} Updated delivery status
 *
 * @example
 * ```typescript
 * const acknowledged = acknowledgeEventDelivery(delivery);
 * console.log('Acknowledged at:', acknowledged.acknowledgedAt);
 * ```
 */
export declare const acknowledgeEventDelivery: (delivery: EventDeliveryStatus) => EventDeliveryStatus;
/**
 * Retries failed event delivery.
 *
 * @param {EventDeliveryStatus} delivery - Failed delivery record
 * @returns {EventDeliveryStatus} Updated delivery status
 *
 * @example
 * ```typescript
 * const retried = retryEventDelivery(failedDelivery);
 * console.log('Retry attempt:', retried.attempts);
 * ```
 */
export declare const retryEventDelivery: (delivery: EventDeliveryStatus) => EventDeliveryStatus;
/**
 * Initializes WebSocket metrics structure.
 *
 * @returns {WebSocketMetrics} Initial metrics
 *
 * @example
 * ```typescript
 * const metrics = initializeWebSocketMetrics();
 * ```
 */
export declare const initializeWebSocketMetrics: () => WebSocketMetrics;
/**
 * Updates WebSocket metrics with new data.
 *
 * @param {WebSocketMetrics} metrics - Current metrics
 * @param {object} update - Metric updates
 * @returns {WebSocketMetrics} Updated metrics
 *
 * @example
 * ```typescript
 * const updated = updateWebSocketMetrics(metrics, {
 *   eventsSent: 1,
 *   eventType: 'mail:new',
 *   roomId: 'user:user-123'
 * });
 * ```
 */
export declare const updateWebSocketMetrics: (metrics: WebSocketMetrics, update: {
    eventsSent?: number;
    eventsReceived?: number;
    eventsAcknowledged?: number;
    newConnection?: boolean;
    disconnection?: boolean;
    reconnection?: boolean;
    eventType?: MailRealtimeEventType;
    roomId?: string;
    latency?: number;
}) => WebSocketMetrics;
/**
 * Generates Swagger schema for new mail event.
 *
 * @returns {SwaggerWebSocketSchema} Swagger schema
 *
 * @example
 * ```typescript
 * const schema = getNewMailEventSwaggerSchema();
 * // Use in NestJS WebSocket documentation
 * ```
 */
export declare const getNewMailEventSwaggerSchema: () => SwaggerWebSocketSchema;
/**
 * Generates Swagger schema for folder update event.
 *
 * @returns {SwaggerWebSocketSchema} Swagger schema
 *
 * @example
 * ```typescript
 * const schema = getFolderUpdateEventSwaggerSchema();
 * ```
 */
export declare const getFolderUpdateEventSwaggerSchema: () => SwaggerWebSocketSchema;
/**
 * Generates Swagger schema for typing indicator event.
 *
 * @returns {SwaggerWebSocketSchema} Swagger schema
 *
 * @example
 * ```typescript
 * const schema = getTypingEventSwaggerSchema();
 * ```
 */
export declare const getTypingEventSwaggerSchema: () => SwaggerWebSocketSchema;
/**
 * Generates Swagger schema for presence event.
 *
 * @returns {SwaggerWebSocketSchema} Swagger schema
 *
 * @example
 * ```typescript
 * const schema = getPresenceEventSwaggerSchema();
 * ```
 */
export declare const getPresenceEventSwaggerSchema: () => SwaggerWebSocketSchema;
declare const _default: {
    getWebSocketConnectionModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        socketId: {
            type: string;
            allowNull: boolean;
            unique: boolean;
            comment: string;
        };
        userId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        deviceId: {
            type: string;
            allowNull: boolean;
        };
        deviceType: {
            type: string;
            values: string[];
            allowNull: boolean;
        };
        connectionState: {
            type: string;
            values: string[];
            defaultValue: string;
        };
        connectedAt: {
            type: string;
            allowNull: boolean;
        };
        lastActiveAt: {
            type: string;
            allowNull: boolean;
        };
        lastHeartbeatAt: {
            type: string;
            allowNull: boolean;
        };
        clientVersion: {
            type: string;
            allowNull: boolean;
        };
        ipAddress: {
            type: string;
            allowNull: boolean;
        };
        userAgent: {
            type: string;
            allowNull: boolean;
        };
        rooms: {
            type: string;
            defaultValue: never[];
        };
        metadata: {
            type: string;
            allowNull: boolean;
            defaultValue: {};
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    getEventSubscriptionModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        userId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        socketId: {
            type: string;
            allowNull: boolean;
        };
        eventTypes: {
            type: string;
            allowNull: boolean;
            defaultValue: never[];
            comment: string;
        };
        folderIds: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        filters: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        expiresAt: {
            type: string;
            allowNull: boolean;
        };
    };
    getPresenceRecordModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        userId: {
            type: string;
            allowNull: boolean;
            unique: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        status: {
            type: string;
            values: string[];
            defaultValue: string;
        };
        statusMessage: {
            type: string;
            allowNull: boolean;
        };
        connections: {
            type: string;
            defaultValue: never[];
            comment: string;
        };
        lastActiveAt: {
            type: string;
            allowNull: boolean;
        };
        lastStatusChangeAt: {
            type: string;
            allowNull: boolean;
        };
        metadata: {
            type: string;
            allowNull: boolean;
            defaultValue: {};
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    getExchangeStreamingSubscriptionModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        userId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        subscriptionId: {
            type: string;
            allowNull: boolean;
            unique: boolean;
            comment: string;
        };
        connectionId: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        folderIds: {
            type: string;
            allowNull: boolean;
            defaultValue: never[];
        };
        eventTypes: {
            type: string;
            allowNull: boolean;
            defaultValue: string[];
        };
        watermark: {
            type: string;
            allowNull: boolean;
            comment: string;
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        expiresAt: {
            type: string;
            allowNull: boolean;
        };
        lastEventAt: {
            type: string;
            allowNull: boolean;
        };
        isActive: {
            type: string;
            defaultValue: boolean;
        };
    };
    getEventDeliveryStatusModelAttributes: () => {
        id: {
            type: string;
            defaultValue: string;
            primaryKey: boolean;
        };
        eventId: {
            type: string;
            allowNull: boolean;
        };
        socketId: {
            type: string;
            allowNull: boolean;
        };
        userId: {
            type: string;
            allowNull: boolean;
            references: {
                model: string;
                key: string;
            };
        };
        deliveryStatus: {
            type: string;
            values: string[];
            defaultValue: string;
        };
        sentAt: {
            type: string;
            allowNull: boolean;
        };
        acknowledgedAt: {
            type: string;
            allowNull: boolean;
        };
        attempts: {
            type: string;
            defaultValue: number;
        };
        lastAttemptAt: {
            type: string;
            allowNull: boolean;
        };
        error: {
            type: string;
            allowNull: boolean;
        };
        createdAt: {
            type: string;
            allowNull: boolean;
        };
        updatedAt: {
            type: string;
            allowNull: boolean;
        };
    };
    createGatewayConfiguration: (options: Partial<GatewayConfiguration>) => GatewayConfiguration;
    createHeartbeatConfiguration: (options?: Partial<HeartbeatConfig>) => HeartbeatConfig;
    createWebSocketConnection: (socketId: string, userId: string, metadata?: any) => WebSocketConnection;
    updateConnectionState: (connection: WebSocketConnection, state: "connecting" | "connected" | "reconnecting" | "disconnected") => WebSocketConnection;
    handleClientDisconnection: (socketId: string, userId: string) => {
        socketId: string;
        userId: string;
        disconnectedAt: Date;
        roomsCleaned: number;
        subscriptionsRemoved: number;
    };
    handleClientReconnection: (newSocketId: string, previousSocketId: string, userId: string) => ReconnectionAttempt;
    validateWebSocketAuthentication: (token: string, secret: string) => {
        valid: boolean;
        userId?: string;
        error?: string;
    };
    generateUserRoomId: (userId: string) => string;
    generateFolderRoomId: (userId: string, folderId: string) => string;
    generateConversationRoomId: (userId: string, conversationId: string) => string;
    joinUserRooms: (socketId: string, userId: string, folderIds?: string[]) => string[];
    createRoomConfiguration: (roomType: "user" | "folder" | "conversation" | "broadcast", identifier: string, members?: string[]) => RoomConfiguration;
    createNewMailEvent: (userId: string, mailData: any) => NewMailEvent;
    createMailUpdatedEvent: (userId: string, messageId: string, folderId: string, changes: any) => MailUpdatedEvent;
    createMailMovedEvent: (userId: string, messageId: string, sourceFolderId: string, destinationFolderId: string, conversationId?: string) => MailMovedEvent;
    createFolderUpdateEvent: (userId: string, folderId: string, eventType: "folder:created" | "folder:updated" | "folder:deleted" | "folder:unread-count-changed", folderData: any) => FolderUpdateEvent;
    createTypingEvent: (userId: string, isTyping: boolean, context: {
        conversationId?: string;
        messageId?: string;
        recipientAddress: string;
    }) => TypingEvent;
    createPresenceEvent: (userId: string, status: "online" | "offline" | "away" | "busy", statusMessage?: string) => PresenceEvent;
    createSyncEvent: (userId: string, syncId: string, eventType: "sync:started" | "sync:completed" | "sync:failed", syncData: any) => SyncEvent;
    createEventSubscription: (userId: string, socketId: string, eventTypes: MailRealtimeEventType[], options?: {
        folderIds?: string[];
        filters?: EventFilter;
        expiresAt?: Date;
    }) => EventSubscription;
    updateEventSubscription: (subscription: EventSubscription, updates: {
        eventTypes?: MailRealtimeEventType[];
        folderIds?: string[];
        filters?: EventFilter;
        expiresAt?: Date;
    }) => EventSubscription;
    filterEventBySubscription: (event: RealtimeEvent, subscription: EventSubscription) => boolean;
    removeExpiredSubscriptions: (subscriptions: EventSubscription[]) => EventSubscription[];
    updateUserPresence: (userId: string, status: "online" | "offline" | "away" | "busy", socketId: string, statusMessage?: string) => PresenceRecord;
    getUserPresence: (userId: string) => PresenceRecord;
    addConnectionToPresence: (presence: PresenceRecord, socketId: string) => PresenceRecord;
    removeConnectionFromPresence: (presence: PresenceRecord, socketId: string) => PresenceRecord;
    startTypingIndicator: (userId: string, recipientAddress: string, context?: {
        conversationId?: string;
        messageId?: string;
    }) => TypingIndicator;
    isTypingIndicatorValid: (indicator: TypingIndicator) => boolean;
    createExchangeStreamingSubscription: (userId: string, connectionId: string, folderIds: string[]) => ExchangeStreamingSubscription;
    processExchangeStreamingEvent: (subscription: ExchangeStreamingSubscription, exchangeEvent: any) => RealtimeEvent;
    renewExchangeStreamingSubscription: (subscription: ExchangeStreamingSubscription) => ExchangeStreamingSubscription;
    recordEventDelivery: (eventId: string, socketId: string, userId: string) => EventDeliveryStatus;
    acknowledgeEventDelivery: (delivery: EventDeliveryStatus) => EventDeliveryStatus;
    retryEventDelivery: (delivery: EventDeliveryStatus) => EventDeliveryStatus;
    initializeWebSocketMetrics: () => WebSocketMetrics;
    updateWebSocketMetrics: (metrics: WebSocketMetrics, update: {
        eventsSent?: number;
        eventsReceived?: number;
        eventsAcknowledged?: number;
        newConnection?: boolean;
        disconnection?: boolean;
        reconnection?: boolean;
        eventType?: MailRealtimeEventType;
        roomId?: string;
        latency?: number;
    }) => WebSocketMetrics;
    getNewMailEventSwaggerSchema: () => SwaggerWebSocketSchema;
    getFolderUpdateEventSwaggerSchema: () => SwaggerWebSocketSchema;
    getTypingEventSwaggerSchema: () => SwaggerWebSocketSchema;
    getPresenceEventSwaggerSchema: () => SwaggerWebSocketSchema;
};
export default _default;
//# sourceMappingURL=mail-realtime-updates-kit.d.ts.map