# WebSocket Messaging Enhancement Checklist

**Task ID**: WS8M3G
**Agent**: Backend WebSocket Gateway Architect

---

## Phase 1: DTOs & Infrastructure

### Message DTOs
- [ ] Create `message-event.dto.ts`
- [ ] Create `typing-indicator.dto.ts`
- [ ] Create `read-receipt.dto.ts`
- [ ] Create `message-delivery.dto.ts`
- [ ] Create `conversation-event.dto.ts`
- [ ] Update DTO barrel export (`dto/index.ts`)

### Rate Limiting
- [ ] Create `services/rate-limiter.service.ts`
- [ ] Implement token bucket algorithm
- [ ] Add configurable rate limits
- [ ] Create rate limit decorator/guard

---

## Phase 2: Gateway Event Handlers

### Message Events
- [ ] Implement `message:send` handler
- [ ] Implement `message:edit` handler
- [ ] Implement `message:delete` handler
- [ ] Implement `message:delivered` handler
- [ ] Implement `message:read` handler

### Conversation Events
- [ ] Implement `conversation:join` handler
- [ ] Implement `conversation:leave` handler

### Presence Events
- [ ] Implement `message:typing` handler
- [ ] Implement `presence:update` handler
- [ ] Enhance `handleConnection` for presence
- [ ] Enhance `handleDisconnect` for presence cleanup

---

## Phase 3: Service Enhancements

### Messaging Methods
- [ ] Add `sendMessageToUsers()` method
- [ ] Add `sendMessageToConversation()` method
- [ ] Add `broadcastTypingIndicator()` method
- [ ] Add `broadcastReadReceipt()` method
- [ ] Add `updateUserPresence()` method
- [ ] Add `broadcastMessageDelivery()` method

---

## Phase 4: Security & Validation

### Authentication & Authorization
- [ ] Apply `@UseGuards(WsJwtAuthGuard)` to all handlers
- [ ] Validate user access to conversations
- [ ] Enforce multi-tenant isolation
- [ ] Validate message ownership for edit/delete

### Rate Limiting
- [ ] Apply rate limiting to `message:send`
- [ ] Apply rate limiting to `message:typing`
- [ ] Configure appropriate limits
- [ ] Add rate limit exceeded error handling

---

## Phase 5: Documentation & Testing

### Documentation
- [ ] Add comprehensive JSDoc to all DTOs
- [ ] Document event handler contracts
- [ ] Update architecture notes
- [ ] Create usage examples

### Validation
- [ ] Verify type safety (no `any` types)
- [ ] Test JWT authentication flow
- [ ] Test multi-tenant isolation
- [ ] Test rate limiting
- [ ] Test room-based messaging
- [ ] Test presence tracking

---

## Final Steps

- [ ] Update all tracking documents
- [ ] Create completion summary
- [ ] Move files to `.temp/completed/`
