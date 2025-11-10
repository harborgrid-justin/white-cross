/**
 * WebSocket Infrastructure Barrel Export
 *
 * Centralized export point for the entire WebSocket infrastructure.
 * Provides clean imports for consumers throughout the application.
 *
 * Exported Components:
 * - WebSocketModule: Main module for importing
 * - WebSocketService: Service for broadcasting messages
 * - WebSocketGateway: Gateway for direct server access
 * - Interfaces: Type definitions for authenticated sockets and payloads
 * - DTOs: Data transfer objects for messages
 * - Guards: Authentication guards for WebSocket handlers
 *
 * @example
 * // Import the module
 * import { WebSocketModule } from './infrastructure/websocket';
 *
 * // Import the service
 * import { WebSocketService } from './infrastructure/websocket';
 *
 * // Import types
 * import { AuthenticatedSocket, AuthPayload } from './infrastructure/websocket';
 */
export * from './websocket.module';
export * from './websocket.service';
export * from './websocket.gateway';
export * from './interfaces';
export * from './dto';
export * from './guards';
export * from './filters/ws-exception.filter';
export * from './adapters/redis-io.adapter';
export * from './services';

// NEW: Enhanced WebSocket components
export * from './pipes';
export * from './interceptors';
export * from './middleware';

export * from './websocket-enhanced.gateway';
