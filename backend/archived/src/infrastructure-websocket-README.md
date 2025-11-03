# WebSocket Infrastructure

This module provides real-time WebSocket communication infrastructure for the White Cross platform using Socket.io and NestJS.

## Architecture

The WebSocket infrastructure is organized into the following components:

### Core Components

- **WebSocketModule** (`websocket.module.ts`): Main module that configures and exports WebSocket infrastructure
- **WebSocketGateway** (`websocket.gateway.ts`): Handles WebSocket connections, authentication, and event routing
- **WebSocketService** (`websocket.service.ts`): Provides high-level methods for broadcasting messages

### Supporting Components

- **Guards** (`guards/`): Authentication guards for WebSocket connections
  - `WsJwtAuthGuard`: JWT-based authentication for WebSocket handlers

- **Interfaces** (`interfaces/`): Type definitions for type-safe WebSocket communication
  - `AuthPayload`: JWT payload structure
  - `AuthenticatedSocket`: Extended Socket.io socket with user data

- **DTOs** (`dto/`): Data Transfer Objects for WebSocket messages
  - `ConnectionConfirmedDto`: Connection confirmation message
  - `BroadcastMessageDto`: Generic broadcast message with timestamp

## Migration from Backend

This module was migrated from `backend/src/infrastructure/websocket/` and adapted to NestJS architecture:

### Key Changes

1. **Framework Adaptation**
   - Migrated from Hapi.js plugin to NestJS Gateway
   - Uses `@WebSocketGateway` decorator instead of Hapi plugin registration
   - Implements NestJS lifecycle interfaces (`OnGatewayConnection`, `OnGatewayDisconnect`)

2. **Authentication**
   - Replaces manual JWT verification with `WsJwtAuthGuard`
   - Integrates with existing NestJS JWT infrastructure
   - Uses `@UseGuards` decorator for event handler protection

3. **Dependency Injection**
   - Service now uses constructor injection instead of singleton pattern
   - Gateway and service are properly registered in module providers
   - Module is marked as `@Global()` for application-wide availability

4. **Type Safety**
   - Added comprehensive TypeScript interfaces
   - Created DTOs with proper class structures
   - Enhanced JSDoc documentation for all public methods

## Usage

### Import the Module

Add `WebSocketModule` to your app module or feature modules:

```typescript
import { WebSocketModule } from './infrastructure/websocket';

@Module({
  imports: [
    WebSocketModule, // Available globally, but explicit import is recommended
    // ... other modules
  ],
})
export class AppModule {}
```

### Inject the Service

Use the `WebSocketService` in any service or controller:

```typescript
import { WebSocketService } from './infrastructure/websocket';

@Injectable()
export class AlertService {
  constructor(private readonly websocketService: WebSocketService) {}

  async sendEmergencyAlert(organizationId: string, alert: any) {
    await this.websocketService.broadcastEmergencyAlert(organizationId, alert);
  }
}
```

## Broadcasting Methods

### Room-Based Broadcasting

```typescript
// Broadcast to a specific room
await websocketService.broadcastToRoom('school:123', 'event:name', { data });

// Broadcast to multiple rooms
await websocketService.broadcastToRooms(['room1', 'room2'], 'event:name', { data });

// Broadcast to a school
await websocketService.broadcastToSchool('school-id', 'event:name', { data });

// Broadcast to a user
await websocketService.broadcastToUser('user-id', 'event:name', { data });

// Broadcast to a student context
await websocketService.broadcastToStudent('student-id', 'event:name', { data });
```

### Domain-Specific Broadcasting

```typescript
// Emergency alerts (CRITICAL priority, sent to organization)
await websocketService.broadcastEmergencyAlert('org-id', {
  id: 'alert-id',
  severity: 'high',
  message: 'Emergency situation',
});

// User notifications
await websocketService.sendUserNotification('user-id', {
  id: 'notification-id',
  type: 'health',
  message: 'Health notification',
});

// Medication reminders
await websocketService.broadcastMedicationReminder('org-id', {
  medicationId: 'med-id',
  studentId: 'student-id',
  message: 'Time for medication',
});

// Student health alerts
await websocketService.broadcastStudentHealthAlert('org-id', {
  studentId: 'student-id',
  type: 'health-change',
  message: 'Student health status updated',
});
```

## Client-Side Events

### Events Emitted by Server

- `connection:confirmed`: Sent when client successfully connects
- `emergency:alert`: Emergency alerts with CRITICAL priority
- `health:notification`: Health notifications to users
- `medication:reminder`: Medication reminders
- `student:health:alert`: Student health status alerts
- `notification:read`: Notification read status synchronization
- `pong`: Response to ping health check
- `subscribed`: Confirmation of channel subscription
- `unsubscribed`: Confirmation of channel unsubscription
- `error`: Error messages

### Events Received from Client

- `ping`: Health check request
- `subscribe`: Subscribe to a notification channel
- `unsubscribe`: Unsubscribe from a notification channel
- `notification:read`: Mark a notification as read

## Room Conventions

The WebSocket infrastructure uses the following room naming conventions:

- `org:{organizationId}`: Organization-wide broadcasts
- `user:{userId}`: User-specific messages (all sessions)
- `school:{schoolId}`: School-specific broadcasts
- `student:{studentId}`: Student-context broadcasts
- `org:{organizationId}:{channel}`: Organization-scoped channels

## Authentication

Clients must authenticate using JWT tokens:

### Connection Authentication

```javascript
// Option 1: Using auth object
const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token'
  }
});

// Option 2: Using authorization header
const socket = io('http://localhost:3000', {
  extraHeaders: {
    authorization: 'Bearer your-jwt-token'
  }
});
```

### JWT Payload Requirements

The JWT token must include:
- `sub` or `userId`: User identifier
- `email`: User email
- `role`: User role
- `organizationId`, `schoolId`, or `districtId`: Organization context

## Security

### Multi-Tenant Isolation

- Users are automatically joined to their organization room
- Channel subscriptions are validated against user's organization
- Unauthorized subscription attempts are rejected and logged

### Authentication Guards

- `WsJwtAuthGuard` validates JWT tokens for WebSocket handlers
- Can be applied to individual message handlers using `@UseGuards`
- Automatically attaches user data to socket instance

## Monitoring

The service provides monitoring capabilities:

```typescript
// Check if server is initialized
const isInitialized = websocketService.isInitialized();

// Get connected socket count
const count = websocketService.getConnectedSocketsCount();
```

All broadcast operations are logged with appropriate log levels:
- `debug`: Message broadcasts with metadata
- `info`: Significant events (connections, alerts, notifications)
- `warn`: Warnings (server not initialized, unauthorized access)
- `error`: Errors with full error details

## Configuration

WebSocket configuration is controlled by environment variables:

- `CORS_ORIGIN`: Allowed CORS origin (default: `http://localhost:5173`)
- `JWT_SECRET`: Secret for JWT token verification (required)
- `JWT_EXPIRATION`: Token expiration time (default: `24h`)

## Dependencies

### Required Packages

- `@nestjs/websockets`: NestJS WebSocket integration
- `@nestjs/platform-socket.io`: Socket.io platform adapter
- `socket.io`: Socket.io server
- `@types/socket.io`: TypeScript definitions
- `@nestjs/jwt`: JWT utilities
- `@nestjs/config`: Configuration management

### Installation

```bash
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io @types/socket.io
```

## Migration Notes

### Differences from Original Implementation

1. **No Singleton Pattern**: Service is properly dependency-injected
2. **No Hapi Server Dependency**: Uses NestJS WebSocket infrastructure
3. **Enhanced Type Safety**: Full TypeScript types and interfaces
4. **Guards Instead of Middleware**: Uses NestJS guard pattern for authentication
5. **Global Module**: Available application-wide without explicit imports in every module

### Compatibility

The migrated implementation maintains API compatibility with the original service methods, making it a drop-in replacement for consuming code that imports the WebSocketService.

### Future Enhancements

Potential improvements to consider:

1. Redis adapter for horizontal scaling across multiple server instances
2. Rate limiting for message broadcasts
3. Message queuing for reliability
4. Metrics and analytics integration
5. Enhanced error recovery mechanisms
6. WebSocket connection pooling strategies
