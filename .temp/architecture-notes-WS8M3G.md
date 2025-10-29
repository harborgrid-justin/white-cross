# Architecture Notes - WebSocket Messaging Enhancement

**Task ID**: WS8M3G
**Agent**: Backend WebSocket Gateway Architect
**Date**: October 29, 2025

---

## References to Other Agent Work

- **TypeScript Quality Standards (TS9A4F)**: Following strict type safety guidelines, avoiding `any` types
- **UX Review (UX4R7K)**: Ensuring consistent patterns across the platform

---

## High-level Design Decisions

### 1. Event-Driven Messaging Architecture
- **Pattern**: Command-Query pattern for WebSocket events
- **Rationale**: Clear separation between commands (send, edit, delete) and queries (read, delivery status)
- **Type Safety**: Each event has a dedicated DTO with strict validation

### 2. Multi-Tenant Isolation Strategy
- **Pattern**: Room-based authorization with organization-scoped validation
- **Implementation**:
  - Conversation rooms: `conversation:{conversationId}`
  - Organization validation on join
  - User can only access conversations within their organization
- **Security**: Prevent cross-organization message leakage

### 3. Rate Limiting Design
- **Algorithm**: Token Bucket for burst handling with sustained rate limiting
- **Configuration**:
  - `message:send`: 10 messages/minute
  - `message:typing`: 5 updates/10 seconds
  - `message:edit`: 3 edits/minute
  - `message:delete`: 3 deletes/minute
- **Storage**: In-memory Map with sliding window cleanup
- **Rationale**: Prevents spam while allowing natural conversation flow

### 4. Presence Tracking
- **Storage**: In-memory Map `userId -> PresenceState`
- **States**: online, offline, away, typing
- **Cleanup**: On disconnect, broadcast offline status to relevant users
- **Typing Indicators**: Broadcast to conversation participants only

---

## Integration Patterns

### 1. Authentication Flow
```
Client Connection → Extract JWT → WsJwtAuthGuard → Validate Token → Attach User to Socket → Join Rooms
```

### 2. Message Flow
```
Client Event → Rate Limit Check → Auth Guard → DTO Validation → Multi-tenant Check → Process → Broadcast to Room
```

### 3. Presence Flow
```
Connection → Set Online → Typing Event → Update Status → Disconnect → Set Offline → Cleanup
```

---

## Type System Strategies

### 1. DTO Validation Pattern
- All DTOs use class-based validation with constructor assignment
- JSDoc documentation for all properties
- No optional properties without explicit defaults
- Type narrowing for enum values

### 2. Generic Constraints
```typescript
// Example: Type-safe room validation
type RoomType = 'user' | 'org' | 'conversation';
type RoomIdentifier<T extends RoomType> = `${T}:${string}`;
```

### 3. Discriminated Unions for Events
```typescript
type MessageEvent =
  | { type: 'send'; data: MessageEventDto }
  | { type: 'edit'; data: MessageEventDto }
  | { type: 'delete'; data: { messageId: string } }
  | { type: 'delivered'; data: MessageDeliveryDto }
  | { type: 'read'; data: ReadReceiptDto };
```

---

## Performance Considerations

### 1. Room Broadcasting Optimization
- Use Socket.io's built-in room optimization
- Avoid broadcasting to empty rooms
- Limit payload size for typing indicators

### 2. Presence Tracking
- In-memory storage for low latency
- Periodic cleanup of stale presence data (5-minute TTL)
- Batch presence updates to reduce broadcast frequency

### 3. Rate Limiting Overhead
- O(1) lookup using Map
- Minimal memory footprint with automatic cleanup
- Non-blocking implementation

### 4. Algorithmic Complexity
- Message routing: O(1) room lookup
- User presence lookup: O(1) Map access
- Rate limit check: O(1) token bucket calculation

---

## Security Requirements

### 1. Authentication & Authorization
- JWT validation on all message events
- Multi-tenant isolation enforced at conversation level
- Message ownership validation for edit/delete operations
- No cross-organization message access

### 2. Input Validation
- All DTOs validate input structure
- Message content sanitization (handled by application layer)
- Conversation ID format validation
- User ID verification against JWT claims

### 3. Rate Limiting Security
- Prevent DoS attacks via message flooding
- Prevent typing indicator spam
- Per-user rate limits (not per-connection)
- Graceful degradation on limit exceeded

### 4. Error Handling
- No sensitive information in error messages
- Consistent error format across all events
- Logged errors for security monitoring
- Client disconnect on repeated auth failures

---

## SOLID Principles Application

### Single Responsibility
- **WebSocketGateway**: Event handling and routing only
- **WebSocketService**: Broadcasting and business logic
- **RateLimiterService**: Rate limiting logic only
- **DTOs**: Data structure and validation only

### Open/Closed
- Gateway extensible with new event handlers
- Service methods can be extended without modification
- DTOs can be extended via inheritance

### Liskov Substitution
- All DTOs implement consistent constructor pattern
- AuthenticatedSocket extends Socket without breaking contracts

### Interface Segregation
- Separate interfaces for different socket types
- Focused DTO interfaces per event type
- Service methods grouped by functionality

### Dependency Inversion
- Gateway depends on Service abstraction
- Rate limiter injected as dependency
- JWT service injected, not instantiated

---

## Error Handling Strategy

### 1. Client Errors (4xx)
- Authentication failures → Disconnect client
- Authorization failures → Emit error event
- Rate limit exceeded → Emit rate-limit-exceeded event
- Invalid data → Emit validation-error event

### 2. Server Errors (5xx)
- Broadcasting failures → Log and retry once
- Database failures → Emit error, continue operation
- Unexpected errors → Log, emit generic error

### 3. Graceful Degradation
- Continue operation on non-critical failures
- Fallback to basic messaging if presence fails
- Queue messages if broadcast temporarily fails

---

## Testing Strategy

### 1. Unit Tests
- DTO validation logic
- Rate limiter token bucket algorithm
- Auth guard token extraction
- Service broadcasting methods

### 2. Integration Tests
- End-to-end message flow
- Multi-tenant isolation verification
- Rate limiting enforcement
- Presence tracking accuracy

### 3. Security Tests
- Cross-organization access attempts
- JWT tampering detection
- Rate limit bypass attempts
- Message injection prevention

---

## Monitoring & Observability

### 1. Logging Strategy
- Connection/disconnection events
- Authentication failures
- Rate limit violations
- Message routing (debug level)
- Error conditions (error level)

### 2. Metrics to Track
- Active connections per organization
- Messages sent per minute
- Rate limit violations count
- Average message latency
- Presence update frequency

---

## Future Enhancements

1. **Message Persistence**: Integrate with database for offline message delivery
2. **Read Receipt Aggregation**: Track multiple readers in group conversations
3. **Delivery Guarantees**: Implement message acknowledgment system
4. **Horizontal Scaling**: Add Redis adapter for multi-server deployment
5. **Message History**: Sync recent messages on connection
6. **File Attachments**: Support media message events
7. **Reactions**: Add message reaction events
8. **Presence Expiry**: Automatic away status after inactivity
