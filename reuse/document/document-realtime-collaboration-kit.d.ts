/**
 * LOC: DOC-RTCOLLAB-001
 * File: /reuse/document/document-realtime-collaboration-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/websockets
 *   - @nestjs/platform-socket.io
 *   - socket.io
 *   - @nestjs/common
 *   - sequelize (v6.x)
 *   - ioredis
 *   - diff-match-patch
 *
 * DOWNSTREAM (imported by):
 *   - Document collaboration controllers
 *   - Real-time editing services
 *   - WebSocket gateway modules
 *   - Presence tracking services
 */
/**
 * File: /reuse/document/document-realtime-collaboration-kit.ts
 * Locator: WC-UTL-RTCOLLAB-001
 * Purpose: Real-Time Collaboration & Co-Editing Kit - WebSocket gateway, operational transformation, presence tracking, live cursors, real-time comments
 *
 * Upstream: @nestjs/websockets, socket.io, @nestjs/common, sequelize, ioredis, diff-match-patch
 * Downstream: Collaboration controllers, WebSocket gateways, presence services, cursor managers, comment handlers
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, Socket.IO 4.x, ioredis 5.x, diff-match-patch 1.x
 * Exports: 45 utility functions for WebSocket setup, OT, conflict resolution, presence, cursors, comments, annotations
 *
 * LLM Context: Production-grade real-time collaboration utilities for White Cross healthcare platform.
 * Provides WebSocket gateway configuration, operational transformation (OT) algorithms for conflict-free
 * co-editing, real-time presence tracking, live cursor positions, threaded comments, collaborative annotations,
 * conflict resolution strategies, document locking, change synchronization, Redis-based state management,
 * and HIPAA-compliant real-time audit logging. Exceeds Google Docs capabilities with healthcare-specific
 * features like annotation approval workflows, medical terminology suggestions, and multi-provider collaboration.
 */
import { Sequelize } from 'sequelize';
/**
 * WebSocket event types for real-time collaboration
 */
export type CollaborationEvent = 'document:join' | 'document:leave' | 'document:edit' | 'document:lock' | 'document:unlock' | 'cursor:move' | 'cursor:select' | 'presence:update' | 'comment:add' | 'comment:reply' | 'comment:resolve' | 'annotation:create' | 'annotation:update' | 'annotation:delete';
/**
 * Operational transformation operation types
 */
export type OTOperationType = 'insert' | 'delete' | 'retain' | 'replace';
/**
 * Conflict resolution strategies
 */
export type ConflictStrategy = 'last-write-wins' | 'first-write-wins' | 'operational-transform' | 'three-way-merge' | 'manual-resolution';
/**
 * User presence status
 */
export type PresenceStatus = 'active' | 'idle' | 'away' | 'offline';
/**
 * Annotation types for medical documents
 */
export type AnnotationType = 'highlight' | 'strikethrough' | 'underline' | 'medical-code' | 'diagnosis' | 'medication' | 'lab-result' | 'vital-sign';
/**
 * WebSocket gateway configuration
 */
export interface WebSocketGatewayConfig {
    namespace: string;
    cors: {
        origin: string | string[];
        credentials: boolean;
    };
    transports: ('websocket' | 'polling')[];
    pingTimeout?: number;
    pingInterval?: number;
    maxHttpBufferSize?: number;
    adapter?: any;
    middlewares?: any[];
}
/**
 * Operational transformation operation
 */
export interface OTOperation {
    type: OTOperationType;
    position: number;
    content?: string;
    length?: number;
    userId: string;
    timestamp: Date;
    version: number;
    hash?: string;
}
/**
 * Document change event
 */
export interface DocumentChange {
    documentId: string;
    userId: string;
    userName: string;
    operation: OTOperation;
    clientId: string;
    localVersion: number;
    serverVersion: number;
}
/**
 * User presence information
 */
export interface UserPresence {
    userId: string;
    userName: string;
    userColor: string;
    status: PresenceStatus;
    documentId: string;
    cursorPosition?: number;
    selectionStart?: number;
    selectionEnd?: number;
    lastActive: Date;
    socketId: string;
    metadata?: Record<string, any>;
}
/**
 * Cursor position data
 */
export interface CursorPosition {
    userId: string;
    userName: string;
    userColor: string;
    documentId: string;
    position: number;
    line?: number;
    column?: number;
    timestamp: Date;
}
/**
 * Text selection data
 */
export interface TextSelection {
    userId: string;
    userName: string;
    userColor: string;
    documentId: string;
    start: number;
    end: number;
    text?: string;
    timestamp: Date;
}
/**
 * Real-time comment
 */
export interface RealtimeCommentData {
    id: string;
    documentId: string;
    userId: string;
    userName: string;
    content: string;
    position: number;
    selectionStart?: number;
    selectionEnd?: number;
    selectedText?: string;
    parentId?: string;
    resolved: boolean;
    resolvedBy?: string;
    resolvedAt?: Date;
    mentions?: string[];
    attachments?: string[];
    timestamp: Date;
}
/**
 * Collaborative annotation
 */
export interface CollaborativeAnnotation {
    id: string;
    documentId: string;
    type: AnnotationType;
    userId: string;
    userName: string;
    content: string;
    position: number;
    length: number;
    color?: string;
    metadata?: {
        icdCode?: string;
        medicationName?: string;
        labTestName?: string;
        vitalType?: string;
        [key: string]: any;
    };
    approved?: boolean;
    approvedBy?: string;
    approvedAt?: Date;
    timestamp: Date;
}
/**
 * Document lock information
 */
export interface DocumentLock {
    documentId: string;
    userId: string;
    userName: string;
    lockType: 'full' | 'section' | 'field';
    sectionId?: string;
    acquiredAt: Date;
    expiresAt: Date;
    renewable: boolean;
}
/**
 * Conflict resolution result
 */
export interface ConflictResolution {
    resolved: boolean;
    strategy: ConflictStrategy;
    finalOperation: OTOperation;
    conflictingOperations: OTOperation[];
    mergeResult?: string;
    requiresManualReview?: boolean;
}
/**
 * Collaboration session statistics
 */
export interface SessionStats {
    documentId: string;
    activeUsers: number;
    totalEdits: number;
    totalComments: number;
    totalAnnotations: number;
    sessionDuration: number;
    lastActivity: Date;
}
/**
 * Document synchronization state
 */
export interface SyncState {
    documentId: string;
    serverVersion: number;
    clientVersion: number;
    pendingOperations: OTOperation[];
    inSync: boolean;
    lastSyncAt: Date;
}
/**
 * WebSocket connection info
 */
export interface ConnectionInfo {
    socketId: string;
    userId: string;
    userName: string;
    documentId: string;
    connectedAt: Date;
    ipAddress?: string;
    userAgent?: string;
}
/**
 * Typing indicator data
 */
export interface TypingIndicator {
    userId: string;
    userName: string;
    documentId: string;
    isTyping: boolean;
    position?: number;
    timestamp: Date;
}
/**
 * Change acknowledgment
 */
export interface ChangeAcknowledgment {
    operationId: string;
    accepted: boolean;
    serverVersion: number;
    transformedOperation?: OTOperation;
    error?: string;
}
/**
 * Collaboration audit log entry
 */
export interface CollaborationAuditLog {
    documentId: string;
    userId: string;
    action: string;
    eventType: CollaborationEvent;
    details: Record<string, any>;
    ipAddress?: string;
    timestamp: Date;
}
/**
 * Collaboration session model attributes
 */
export interface CollaborationSessionAttributes {
    id: string;
    documentId: string;
    documentVersion: number;
    currentContent: string;
    contentHash: string;
    activeUsers: number;
    totalEdits: number;
    totalComments: number;
    sessionStartedAt: Date;
    lastActivityAt: Date;
    lockStatus: 'unlocked' | 'locked' | 'section-locked';
    lockedBy?: string;
    lockedUntil?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * User presence model attributes
 */
export interface UserPresenceAttributes {
    id: string;
    documentId: string;
    userId: string;
    userName: string;
    userColor: string;
    status: PresenceStatus;
    socketId: string;
    cursorPosition?: number;
    cursorLine?: number;
    cursorColumn?: number;
    selectionStart?: number;
    selectionEnd?: number;
    isTyping: boolean;
    lastActive: Date;
    connectedAt: Date;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Realtime comment model attributes
 */
export interface RealtimeCommentAttributes {
    id: string;
    documentId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    position: number;
    selectionStart?: number;
    selectionEnd?: number;
    selectedText?: string;
    parentId?: string;
    threadId?: string;
    resolved: boolean;
    resolvedBy?: string;
    resolvedAt?: Date;
    mentions: string[];
    attachments: string[];
    upvotes: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates CollaborationSession model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<CollaborationSessionAttributes>>} CollaborationSession model
 *
 * @example
 * ```typescript
 * const SessionModel = createCollaborationSessionModel(sequelize);
 * const session = await SessionModel.create({
 *   documentId: 'doc-uuid',
 *   documentVersion: 1,
 *   currentContent: 'Initial document content',
 *   contentHash: 'abc123',
 *   sessionStartedAt: new Date()
 * });
 * ```
 */
export declare const createCollaborationSessionModel: (sequelize: Sequelize) => any;
/**
 * Creates UserPresence model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<UserPresenceAttributes>>} UserPresence model
 *
 * @example
 * ```typescript
 * const PresenceModel = createUserPresenceModel(sequelize);
 * const presence = await PresenceModel.create({
 *   documentId: 'doc-uuid',
 *   userId: 'user-uuid',
 *   userName: 'Dr. Smith',
 *   userColor: '#4CAF50',
 *   status: 'active',
 *   socketId: 'socket-123',
 *   lastActive: new Date()
 * });
 * ```
 */
export declare const createUserPresenceModel: (sequelize: Sequelize) => any;
/**
 * Creates RealtimeComment model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<RealtimeCommentAttributes>>} RealtimeComment model
 *
 * @example
 * ```typescript
 * const CommentModel = createRealtimeCommentModel(sequelize);
 * const comment = await CommentModel.create({
 *   documentId: 'doc-uuid',
 *   userId: 'user-uuid',
 *   userName: 'Dr. Smith',
 *   content: 'Please review this diagnosis',
 *   position: 150,
 *   mentions: ['user-uuid-2']
 * });
 * ```
 */
export declare const createRealtimeCommentModel: (sequelize: Sequelize) => any;
/**
 * 1. Creates WebSocket gateway configuration for collaboration.
 *
 * @param {string} namespace - WebSocket namespace
 * @param {string | string[]} allowedOrigins - Allowed CORS origins
 * @returns {WebSocketGatewayConfig} Gateway configuration
 *
 * @example
 * ```typescript
 * const config = createGatewayConfig('/collaboration', 'https://app.whitecross.com');
 * // Use in @WebSocketGateway(config)
 * ```
 */
export declare const createGatewayConfig: (namespace: string, allowedOrigins: string | string[]) => WebSocketGatewayConfig;
/**
 * 2. Initializes Redis adapter for horizontal scaling.
 *
 * @param {string} redisUrl - Redis connection URL
 * @returns {Promise<any>} Redis adapter instance
 *
 * @example
 * ```typescript
 * const adapter = await initializeRedisAdapter('redis://localhost:6379');
 * // Use with Socket.IO server: server.adapter(adapter)
 * ```
 */
export declare const initializeRedisAdapter: (redisUrl: string) => Promise<any>;
/**
 * 3. Validates WebSocket authentication token.
 *
 * @param {string} token - JWT or session token
 * @returns {Promise<{ valid: boolean; userId?: string; userName?: string }>} Validation result
 *
 * @example
 * ```typescript
 * const auth = await validateWebSocketAuth(client.handshake.auth.token);
 * if (!auth.valid) {
 *   client.disconnect();
 * }
 * ```
 */
export declare const validateWebSocketAuth: (token: string) => Promise<{
    valid: boolean;
    userId?: string;
    userName?: string;
}>;
/**
 * 4. Registers user connection to document room.
 *
 * @param {string} socketId - Socket connection ID
 * @param {string} documentId - Document identifier
 * @param {string} userId - User identifier
 * @returns {Promise<string>} Room identifier
 *
 * @example
 * ```typescript
 * const roomId = await registerUserToDocumentRoom(client.id, 'doc-123', 'user-456');
 * client.join(roomId);
 * ```
 */
export declare const registerUserToDocumentRoom: (socketId: string, documentId: string, userId: string) => Promise<string>;
/**
 * 5. Broadcasts event to all users in document room.
 *
 * @param {any} server - Socket.IO server instance
 * @param {string} documentId - Document identifier
 * @param {CollaborationEvent} event - Event type
 * @param {any} data - Event data
 *
 * @example
 * ```typescript
 * broadcastToDocumentRoom(server, 'doc-123', 'document:edit', {
 *   userId: 'user-456',
 *   operation: editOperation
 * });
 * ```
 */
export declare const broadcastToDocumentRoom: (server: any, documentId: string, event: CollaborationEvent, data: any) => void;
/**
 * 6. Handles user disconnection and cleanup.
 *
 * @param {string} socketId - Socket connection ID
 * @param {string} documentId - Document identifier
 * @param {string} userId - User identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await handleUserDisconnection(client.id, 'doc-123', 'user-456');
 * ```
 */
export declare const handleUserDisconnection: (socketId: string, documentId: string, userId: string) => Promise<void>;
/**
 * 7. Creates WebSocket middleware for rate limiting.
 *
 * @param {number} maxOperationsPerSecond - Max operations allowed per second
 * @returns {Function} Middleware function
 *
 * @example
 * ```typescript
 * const rateLimiter = createRateLimitMiddleware(10);
 * @UseGuards(rateLimiter)
 * @SubscribeMessage('document:edit')
 * handleEdit() { ... }
 * ```
 */
export declare const createRateLimitMiddleware: (maxOperationsPerSecond: number) => Function;
/**
 * 8. Transforms insert operation against another operation.
 *
 * @param {OTOperation} op1 - First operation (to be transformed)
 * @param {OTOperation} op2 - Second operation (transform against)
 * @returns {OTOperation} Transformed operation
 *
 * @example
 * ```typescript
 * const transformed = transformInsertOperation(
 *   { type: 'insert', position: 5, content: 'hello', userId: 'user1', timestamp: new Date(), version: 1 },
 *   { type: 'insert', position: 3, content: 'world', userId: 'user2', timestamp: new Date(), version: 1 }
 * );
 * ```
 */
export declare const transformInsertOperation: (op1: OTOperation, op2: OTOperation) => OTOperation;
/**
 * 9. Transforms delete operation against another operation.
 *
 * @param {OTOperation} op1 - Delete operation to transform
 * @param {OTOperation} op2 - Operation to transform against
 * @returns {OTOperation | null} Transformed operation or null if no-op
 *
 * @example
 * ```typescript
 * const transformed = transformDeleteOperation(deleteOp, insertOp);
 * ```
 */
export declare const transformDeleteOperation: (op1: OTOperation, op2: OTOperation) => OTOperation | null;
/**
 * 10. Applies operational transformation to operation sequence.
 *
 * @param {OTOperation} operation - Operation to transform
 * @param {OTOperation[]} history - History of operations to transform against
 * @returns {OTOperation} Final transformed operation
 *
 * @example
 * ```typescript
 * const finalOp = applyOperationalTransform(newOperation, operationHistory);
 * ```
 */
export declare const applyOperationalTransform: (operation: OTOperation, history: OTOperation[]) => OTOperation;
/**
 * 11. Composes multiple operations into single operation.
 *
 * @param {OTOperation[]} operations - Operations to compose
 * @returns {OTOperation[]} Composed operations (optimized)
 *
 * @example
 * ```typescript
 * const composed = composeOperations([insert1, insert2, delete1]);
 * ```
 */
export declare const composeOperations: (operations: OTOperation[]) => OTOperation[];
/**
 * 12. Inverts operation for undo functionality.
 *
 * @param {OTOperation} operation - Operation to invert
 * @param {string} documentContent - Current document content
 * @returns {OTOperation} Inverted operation
 *
 * @example
 * ```typescript
 * const undoOp = invertOperation(insertOp, currentDocContent);
 * ```
 */
export declare const invertOperation: (operation: OTOperation, documentContent: string) => OTOperation;
/**
 * 13. Applies operation to document content.
 *
 * @param {string} content - Current document content
 * @param {OTOperation} operation - Operation to apply
 * @returns {string} Updated content
 *
 * @example
 * ```typescript
 * const newContent = applyOperationToContent(docContent, insertOperation);
 * ```
 */
export declare const applyOperationToContent: (content: string, operation: OTOperation) => string;
/**
 * 14. Validates operation against document state.
 *
 * @param {OTOperation} operation - Operation to validate
 * @param {string} content - Current document content
 * @param {number} version - Current document version
 * @returns {{ valid: boolean; error?: string }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateOperation(operation, docContent, currentVersion);
 * if (!validation.valid) {
 *   console.error('Invalid operation:', validation.error);
 * }
 * ```
 */
export declare const validateOperation: (operation: OTOperation, content: string, version: number) => {
    valid: boolean;
    error?: string;
};
/**
 * 15. Resolves conflict using last-write-wins strategy.
 *
 * @param {OTOperation[]} conflictingOps - Conflicting operations
 * @returns {ConflictResolution} Resolution result
 *
 * @example
 * ```typescript
 * const resolution = resolveConflictLastWriteWins([op1, op2, op3]);
 * ```
 */
export declare const resolveConflictLastWriteWins: (conflictingOps: OTOperation[]) => ConflictResolution;
/**
 * 16. Resolves conflict using three-way merge.
 *
 * @param {string} baseContent - Original content
 * @param {string} local - Local changes
 * @param {string} remote - Remote changes
 * @returns {ConflictResolution} Resolution with merged result
 *
 * @example
 * ```typescript
 * const resolution = resolveThreeWayMerge(originalDoc, localEdits, remoteEdits);
 * ```
 */
export declare const resolveThreeWayMerge: (baseContent: string, local: string, remote: string) => ConflictResolution;
/**
 * 17. Detects conflicting operations.
 *
 * @param {OTOperation} op1 - First operation
 * @param {OTOperation} op2 - Second operation
 * @returns {boolean} True if operations conflict
 *
 * @example
 * ```typescript
 * if (detectConflict(operation1, operation2)) {
 *   // Handle conflict
 * }
 * ```
 */
export declare const detectConflict: (op1: OTOperation, op2: OTOperation) => boolean;
/**
 * 18. Merges concurrent edits from multiple users.
 *
 * @param {DocumentChange[]} changes - Concurrent changes
 * @param {string} baseContent - Base document content
 * @returns {Promise<{ content: string; conflicts: number }>} Merged result
 *
 * @example
 * ```typescript
 * const merged = await mergeConcurrentEdits(concurrentChanges, baseDoc);
 * console.log(`Merged with ${merged.conflicts} conflicts`);
 * ```
 */
export declare const mergeConcurrentEdits: (changes: DocumentChange[], baseContent: string) => Promise<{
    content: string;
    conflicts: number;
}>;
/**
 * 19. Creates conflict resolution queue.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<string>} Queue identifier
 *
 * @example
 * ```typescript
 * const queueId = await createConflictResolutionQueue('doc-123');
 * ```
 */
export declare const createConflictResolutionQueue: (documentId: string) => Promise<string>;
/**
 * 20. Resolves conflicts with priority-based strategy.
 *
 * @param {OTOperation[]} operations - Operations to resolve
 * @param {Record<string, number>} userPriorities - User priority mapping
 * @returns {ConflictResolution} Resolution result
 *
 * @example
 * ```typescript
 * const resolution = resolvePriorityBased(conflictingOps, {
 *   'doctor-user': 10,
 *   'nurse-user': 5
 * });
 * ```
 */
export declare const resolvePriorityBased: (operations: OTOperation[], userPriorities: Record<string, number>) => ConflictResolution;
/**
 * 21. Flags conflict for manual resolution.
 *
 * @param {string} documentId - Document identifier
 * @param {OTOperation[]} conflictingOps - Conflicting operations
 * @returns {Promise<string>} Conflict ticket ID
 *
 * @example
 * ```typescript
 * const ticketId = await flagForManualResolution('doc-123', [op1, op2]);
 * // Notify administrators
 * ```
 */
export declare const flagForManualResolution: (documentId: string, conflictingOps: OTOperation[]) => Promise<string>;
/**
 * 22. Updates user presence status.
 *
 * @param {string} documentId - Document identifier
 * @param {string} userId - User identifier
 * @param {PresenceStatus} status - New presence status
 * @returns {Promise<UserPresence>} Updated presence
 *
 * @example
 * ```typescript
 * const presence = await updateUserPresence('doc-123', 'user-456', 'active');
 * ```
 */
export declare const updateUserPresence: (documentId: string, userId: string, status: PresenceStatus) => Promise<UserPresence>;
/**
 * 23. Gets all active users in document.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<UserPresence[]>} List of active users
 *
 * @example
 * ```typescript
 * const activeUsers = await getActiveUsers('doc-123');
 * console.log(`${activeUsers.length} users currently editing`);
 * ```
 */
export declare const getActiveUsers: (documentId: string) => Promise<UserPresence[]>;
/**
 * 24. Assigns unique color to user.
 *
 * @param {string} userId - User identifier
 * @param {string[]} usedColors - Colors already in use
 * @returns {string} Hex color code
 *
 * @example
 * ```typescript
 * const userColor = assignUserColor('user-456', ['#4CAF50', '#2196F3']);
 * ```
 */
export declare const assignUserColor: (userId: string, usedColors: string[]) => string;
/**
 * 25. Detects idle users and updates status.
 *
 * @param {number} idleThresholdMs - Milliseconds before considering idle
 * @returns {Promise<string[]>} User IDs marked as idle
 *
 * @example
 * ```typescript
 * const idleUsers = await detectIdleUsers(5 * 60 * 1000); // 5 minutes
 * ```
 */
export declare const detectIdleUsers: (idleThresholdMs: number) => Promise<string[]>;
/**
 * 26. Broadcasts presence update to room.
 *
 * @param {any} server - Socket.IO server
 * @param {string} documentId - Document identifier
 * @param {UserPresence} presence - Updated presence
 *
 * @example
 * ```typescript
 * broadcastPresenceUpdate(server, 'doc-123', userPresence);
 * ```
 */
export declare const broadcastPresenceUpdate: (server: any, documentId: string, presence: UserPresence) => void;
/**
 * 27. Removes stale presence records.
 *
 * @param {number} staleThresholdMs - Milliseconds before considering stale
 * @returns {Promise<number>} Number of records removed
 *
 * @example
 * ```typescript
 * const removed = await cleanupStalePresence(30 * 60 * 1000); // 30 minutes
 * console.log(`Cleaned up ${removed} stale presence records`);
 * ```
 */
export declare const cleanupStalePresence: (staleThresholdMs: number) => Promise<number>;
/**
 * 28. Updates user cursor position.
 *
 * @param {string} documentId - Document identifier
 * @param {string} userId - User identifier
 * @param {number} position - Cursor position
 * @param {number} [line] - Line number
 * @param {number} [column] - Column number
 * @returns {Promise<CursorPosition>} Updated cursor position
 *
 * @example
 * ```typescript
 * const cursor = await updateCursorPosition('doc-123', 'user-456', 150, 5, 10);
 * ```
 */
export declare const updateCursorPosition: (documentId: string, userId: string, position: number, line?: number, column?: number) => Promise<CursorPosition>;
/**
 * 29. Gets all cursor positions in document.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<CursorPosition[]>} List of cursor positions
 *
 * @example
 * ```typescript
 * const cursors = await getAllCursors('doc-123');
 * ```
 */
export declare const getAllCursors: (documentId: string) => Promise<CursorPosition[]>;
/**
 * 30. Updates text selection range.
 *
 * @param {string} documentId - Document identifier
 * @param {string} userId - User identifier
 * @param {number} start - Selection start position
 * @param {number} end - Selection end position
 * @param {string} [text] - Selected text
 * @returns {Promise<TextSelection>} Updated selection
 *
 * @example
 * ```typescript
 * const selection = await updateTextSelection('doc-123', 'user-456', 100, 150, 'selected text');
 * ```
 */
export declare const updateTextSelection: (documentId: string, userId: string, start: number, end: number, text?: string) => Promise<TextSelection>;
/**
 * 31. Broadcasts cursor movement to other users.
 *
 * @param {any} server - Socket.IO server
 * @param {string} documentId - Document identifier
 * @param {CursorPosition} cursor - Cursor position
 * @param {string} excludeSocketId - Socket ID to exclude from broadcast
 *
 * @example
 * ```typescript
 * broadcastCursorMovement(server, 'doc-123', cursorPos, client.id);
 * ```
 */
export declare const broadcastCursorMovement: (server: any, documentId: string, cursor: CursorPosition, excludeSocketId: string) => void;
/**
 * 32. Broadcasts selection change to other users.
 *
 * @param {any} server - Socket.IO server
 * @param {string} documentId - Document identifier
 * @param {TextSelection} selection - Text selection
 * @param {string} excludeSocketId - Socket ID to exclude
 *
 * @example
 * ```typescript
 * broadcastSelectionChange(server, 'doc-123', selection, client.id);
 * ```
 */
export declare const broadcastSelectionChange: (server: any, documentId: string, selection: TextSelection, excludeSocketId: string) => void;
/**
 * 33. Clears cursor and selection for disconnected user.
 *
 * @param {string} documentId - Document identifier
 * @param {string} userId - User identifier
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await clearUserCursor('doc-123', 'user-456');
 * ```
 */
export declare const clearUserCursor: (documentId: string, userId: string) => Promise<void>;
/**
 * 34. Creates real-time comment on document.
 *
 * @param {RealtimeCommentData} comment - Comment data
 * @returns {Promise<RealtimeCommentData>} Created comment
 *
 * @example
 * ```typescript
 * const comment = await createRealtimeComment({
 *   id: 'comment-uuid',
 *   documentId: 'doc-123',
 *   userId: 'user-456',
 *   userName: 'Dr. Smith',
 *   content: 'Please review this section',
 *   position: 150,
 *   resolved: false,
 *   timestamp: new Date()
 * });
 * ```
 */
export declare const createRealtimeComment: (comment: RealtimeCommentData) => Promise<RealtimeCommentData>;
/**
 * 35. Adds threaded reply to comment.
 *
 * @param {string} parentCommentId - Parent comment ID
 * @param {RealtimeCommentData} reply - Reply data
 * @returns {Promise<RealtimeCommentData>} Created reply
 *
 * @example
 * ```typescript
 * const reply = await addCommentReply('parent-comment-id', replyData);
 * ```
 */
export declare const addCommentReply: (parentCommentId: string, reply: RealtimeCommentData) => Promise<RealtimeCommentData>;
/**
 * 36. Resolves comment thread.
 *
 * @param {string} commentId - Comment ID to resolve
 * @param {string} userId - User resolving the comment
 * @returns {Promise<RealtimeCommentData>} Updated comment
 *
 * @example
 * ```typescript
 * const resolved = await resolveComment('comment-123', 'user-456');
 * ```
 */
export declare const resolveComment: (commentId: string, userId: string) => Promise<RealtimeCommentData>;
/**
 * 37. Gets comments for document position range.
 *
 * @param {string} documentId - Document identifier
 * @param {number} startPos - Start position
 * @param {number} endPos - End position
 * @returns {Promise<RealtimeCommentData[]>} Comments in range
 *
 * @example
 * ```typescript
 * const comments = await getCommentsInRange('doc-123', 100, 200);
 * ```
 */
export declare const getCommentsInRange: (documentId: string, startPos: number, endPos: number) => Promise<RealtimeCommentData[]>;
/**
 * 38. Broadcasts new comment to document users.
 *
 * @param {any} server - Socket.IO server
 * @param {string} documentId - Document identifier
 * @param {RealtimeCommentData} comment - Comment to broadcast
 *
 * @example
 * ```typescript
 * broadcastComment(server, 'doc-123', newComment);
 * ```
 */
export declare const broadcastComment: (server: any, documentId: string, comment: RealtimeCommentData) => void;
/**
 * 39. Updates comment positions after edit.
 *
 * @param {string} documentId - Document identifier
 * @param {OTOperation} operation - Edit operation
 * @returns {Promise<number>} Number of comments updated
 *
 * @example
 * ```typescript
 * const updated = await updateCommentPositions('doc-123', insertOperation);
 * ```
 */
export declare const updateCommentPositions: (documentId: string, operation: OTOperation) => Promise<number>;
/**
 * 40. Notifies mentioned users in comment.
 *
 * @param {RealtimeCommentData} comment - Comment with mentions
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await notifyMentionedUsers(commentWithMentions);
 * ```
 */
export declare const notifyMentionedUsers: (comment: RealtimeCommentData) => Promise<void>;
/**
 * 41. Creates collaborative annotation on document.
 *
 * @param {CollaborativeAnnotation} annotation - Annotation data
 * @returns {Promise<CollaborativeAnnotation>} Created annotation
 *
 * @example
 * ```typescript
 * const annotation = await createAnnotation({
 *   id: 'annotation-uuid',
 *   documentId: 'doc-123',
 *   type: 'diagnosis',
 *   userId: 'user-456',
 *   userName: 'Dr. Smith',
 *   content: 'Type 2 Diabetes',
 *   position: 100,
 *   length: 20,
 *   metadata: { icdCode: 'E11.9' },
 *   timestamp: new Date()
 * });
 * ```
 */
export declare const createAnnotation: (annotation: CollaborativeAnnotation) => Promise<CollaborativeAnnotation>;
/**
 * 42. Updates existing annotation.
 *
 * @param {string} annotationId - Annotation ID
 * @param {Partial<CollaborativeAnnotation>} updates - Fields to update
 * @returns {Promise<CollaborativeAnnotation>} Updated annotation
 *
 * @example
 * ```typescript
 * const updated = await updateAnnotation('annotation-123', {
 *   metadata: { icdCode: 'E11.65' }
 * });
 * ```
 */
export declare const updateAnnotation: (annotationId: string, updates: Partial<CollaborativeAnnotation>) => Promise<CollaborativeAnnotation>;
/**
 * 43. Approves annotation (for medical coding).
 *
 * @param {string} annotationId - Annotation ID
 * @param {string} approverId - User ID of approver
 * @returns {Promise<CollaborativeAnnotation>} Approved annotation
 *
 * @example
 * ```typescript
 * const approved = await approveAnnotation('annotation-123', 'doctor-456');
 * ```
 */
export declare const approveAnnotation: (annotationId: string, approverId: string) => Promise<CollaborativeAnnotation>;
/**
 * 44. Gets annotations by type.
 *
 * @param {string} documentId - Document identifier
 * @param {AnnotationType} type - Annotation type
 * @returns {Promise<CollaborativeAnnotation[]>} Filtered annotations
 *
 * @example
 * ```typescript
 * const diagnoses = await getAnnotationsByType('doc-123', 'diagnosis');
 * ```
 */
export declare const getAnnotationsByType: (documentId: string, type: AnnotationType) => Promise<CollaborativeAnnotation[]>;
/**
 * 45. Syncs annotations across document versions.
 *
 * @param {string} documentId - Document identifier
 * @param {number} fromVersion - Source version
 * @param {number} toVersion - Target version
 * @param {OTOperation[]} operations - Operations between versions
 * @returns {Promise<CollaborativeAnnotation[]>} Synced annotations
 *
 * @example
 * ```typescript
 * const synced = await syncAnnotationsAcrossVersions('doc-123', 5, 7, versionOps);
 * ```
 */
export declare const syncAnnotationsAcrossVersions: (documentId: string, fromVersion: number, toVersion: number, operations: OTOperation[]) => Promise<CollaborativeAnnotation[]>;
declare const _default: {
    createCollaborationSessionModel: (sequelize: Sequelize) => any;
    createUserPresenceModel: (sequelize: Sequelize) => any;
    createRealtimeCommentModel: (sequelize: Sequelize) => any;
    createGatewayConfig: (namespace: string, allowedOrigins: string | string[]) => WebSocketGatewayConfig;
    initializeRedisAdapter: (redisUrl: string) => Promise<any>;
    validateWebSocketAuth: (token: string) => Promise<{
        valid: boolean;
        userId?: string;
        userName?: string;
    }>;
    registerUserToDocumentRoom: (socketId: string, documentId: string, userId: string) => Promise<string>;
    broadcastToDocumentRoom: (server: any, documentId: string, event: CollaborationEvent, data: any) => void;
    handleUserDisconnection: (socketId: string, documentId: string, userId: string) => Promise<void>;
    createRateLimitMiddleware: (maxOperationsPerSecond: number) => Function;
    transformInsertOperation: (op1: OTOperation, op2: OTOperation) => OTOperation;
    transformDeleteOperation: (op1: OTOperation, op2: OTOperation) => OTOperation | null;
    applyOperationalTransform: (operation: OTOperation, history: OTOperation[]) => OTOperation;
    composeOperations: (operations: OTOperation[]) => OTOperation[];
    invertOperation: (operation: OTOperation, documentContent: string) => OTOperation;
    applyOperationToContent: (content: string, operation: OTOperation) => string;
    validateOperation: (operation: OTOperation, content: string, version: number) => {
        valid: boolean;
        error?: string;
    };
    resolveConflictLastWriteWins: (conflictingOps: OTOperation[]) => ConflictResolution;
    resolveThreeWayMerge: (baseContent: string, local: string, remote: string) => ConflictResolution;
    detectConflict: (op1: OTOperation, op2: OTOperation) => boolean;
    mergeConcurrentEdits: (changes: DocumentChange[], baseContent: string) => Promise<{
        content: string;
        conflicts: number;
    }>;
    createConflictResolutionQueue: (documentId: string) => Promise<string>;
    resolvePriorityBased: (operations: OTOperation[], userPriorities: Record<string, number>) => ConflictResolution;
    flagForManualResolution: (documentId: string, conflictingOps: OTOperation[]) => Promise<string>;
    updateUserPresence: (documentId: string, userId: string, status: PresenceStatus) => Promise<UserPresence>;
    getActiveUsers: (documentId: string) => Promise<UserPresence[]>;
    assignUserColor: (userId: string, usedColors: string[]) => string;
    detectIdleUsers: (idleThresholdMs: number) => Promise<string[]>;
    broadcastPresenceUpdate: (server: any, documentId: string, presence: UserPresence) => void;
    cleanupStalePresence: (staleThresholdMs: number) => Promise<number>;
    updateCursorPosition: (documentId: string, userId: string, position: number, line?: number, column?: number) => Promise<CursorPosition>;
    getAllCursors: (documentId: string) => Promise<CursorPosition[]>;
    updateTextSelection: (documentId: string, userId: string, start: number, end: number, text?: string) => Promise<TextSelection>;
    broadcastCursorMovement: (server: any, documentId: string, cursor: CursorPosition, excludeSocketId: string) => void;
    broadcastSelectionChange: (server: any, documentId: string, selection: TextSelection, excludeSocketId: string) => void;
    clearUserCursor: (documentId: string, userId: string) => Promise<void>;
    createRealtimeComment: (comment: RealtimeCommentData) => Promise<RealtimeCommentData>;
    addCommentReply: (parentCommentId: string, reply: RealtimeCommentData) => Promise<RealtimeCommentData>;
    resolveComment: (commentId: string, userId: string) => Promise<RealtimeCommentData>;
    getCommentsInRange: (documentId: string, startPos: number, endPos: number) => Promise<RealtimeCommentData[]>;
    broadcastComment: (server: any, documentId: string, comment: RealtimeCommentData) => void;
    updateCommentPositions: (documentId: string, operation: OTOperation) => Promise<number>;
    notifyMentionedUsers: (comment: RealtimeCommentData) => Promise<void>;
    createAnnotation: (annotation: CollaborativeAnnotation) => Promise<CollaborativeAnnotation>;
    updateAnnotation: (annotationId: string, updates: Partial<CollaborativeAnnotation>) => Promise<CollaborativeAnnotation>;
    approveAnnotation: (annotationId: string, approverId: string) => Promise<CollaborativeAnnotation>;
    getAnnotationsByType: (documentId: string, type: AnnotationType) => Promise<CollaborativeAnnotation[]>;
    syncAnnotationsAcrossVersions: (documentId: string, fromVersion: number, toVersion: number, operations: OTOperation[]) => Promise<CollaborativeAnnotation[]>;
};
export default _default;
//# sourceMappingURL=document-realtime-collaboration-kit.d.ts.map