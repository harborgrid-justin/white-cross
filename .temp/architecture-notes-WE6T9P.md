# Architecture Notes - WebSocket Encryption Integration (WE6T9P)

## References to Other Agent Work

- **Encryption Service (MG5X2Y)**: Provides `encryptMessage()` and `decryptMessage()` methods
- **Key Management**: Handles RSA key pairs and session keys
- **WebSocket Infrastructure (WS8M3G, M7B2K9)**: Existing real-time messaging architecture

## High-Level Design Decisions

### 1. Hybrid Encryption Architecture
- **AES-256-GCM** for message content (fast, symmetric)
- **RSA-4096** for key exchange (secure, asymmetric)
- Session keys cached per conversation for performance
- Graceful fallback to unencrypted when encryption fails

### 2. Event-Driven Encryption
New WebSocket events:
- `message:encrypt` - Explicit encryption request from client
- `message:key-exchange` - Key negotiation between clients
- Enhanced `message:send` - Auto-encrypt if recipients have keys
- Enhanced `presence:update` - Include encryption capability status

### 3. Backward Compatibility Strategy
- `isEncrypted` field in MessageEventDto (optional, defaults to false)
- Existing clients without encryption continue to work
- Server attempts encryption but falls back gracefully
- Mixed encrypted/unencrypted messages in same conversation

## Integration Patterns

### Encryption Helper Pattern
```typescript
// Centralized encryption logic in helper
class EncryptionHelper {
  async encryptMessageContent(): Promise<EncryptedMessageResult>
  async canEncryptMessage(): Promise<boolean>
  handleKeyExchange(): Promise<void>
  verifyEncryptionStatus(): Promise<EncryptionStatus>
}
```

### Dependency Injection
```typescript
// Gateway constructor
constructor(
  private readonly rateLimiter: RateLimiterService,
  private readonly encryptionService: EncryptionService,
  private readonly keyManagementService: KeyManagementService,
) {}
```

### Graceful Degradation
```typescript
// Try encryption, fall back to unencrypted
const encryptionResult = await this.tryEncrypt(content, options);
const messageDto = {
  content: encryptionResult.success ? encryptionResult.data : content,
  isEncrypted: encryptionResult.success,
  encryptionMetadata: encryptionResult.metadata,
};
```

## Type System Strategies

### Discriminated Unions for Encryption Results
```typescript
type EncryptionResult =
  | { success: true; data: string; metadata: EncryptionMetadata }
  | { success: false; error: EncryptionStatus; message: string };
```

### Enhanced MessageEventDto
```typescript
interface MessageEventDto {
  // ... existing fields
  isEncrypted?: boolean;
  encryptionMetadata?: EncryptionMetadata;
}
```

### Type-Safe Event Handlers
```typescript
@SubscribeMessage('message:encrypt')
async handleMessageEncrypt(
  @ConnectedSocket() client: AuthenticatedSocket,
  @MessageBody() data: EncryptMessageDto,
): Promise<void>
```

## Performance Considerations

### Caching Strategy
- Session keys cached in Redis with TTL (24 hours)
- Public keys cached per user
- Conversation-level encryption capability cached
- Minimize crypto operations through caching

### Asynchronous Encryption
- Non-blocking encryption operations
- Promise-based API for all crypto operations
- Background key rotation support

### Rate Limiting
- Existing rate limiting applies to encrypted messages
- Key exchange operations have separate rate limits
- Prevent cryptographic DoS attacks

## Security Requirements

### Secure Data Handling
- **NEVER log decrypted content or keys**
- **NEVER log encryption metadata containing IVs or auth tags**
- Only log: success/failure, keyIds, userIds (sanitized)
- Use constant-time comparisons where applicable

### Input Validation
- Validate all encryption metadata before use
- Verify sender/recipient authorization
- Check key expiration before encryption
- Validate message integrity with auth tags

### Error Handling
- Generic error messages to clients (avoid information leakage)
- Detailed error logging server-side (sanitized)
- Automatic fallback prevents service disruption
- Track encryption failures for monitoring

## Encryption Workflow

### Message Send with Encryption
1. Client sends message via `message:send` event
2. Gateway validates authentication and authorization
3. Gateway checks if recipients have encryption keys
4. If keys available: encrypt message content
5. Broadcast encrypted message with metadata
6. If encryption fails: broadcast unencrypted with warning
7. Send delivery confirmation with encryption status

### Key Exchange Flow
1. Client emits `message:key-exchange` with public key
2. Gateway validates sender identity
3. Store/cache public key for sender
4. Broadcast key availability to conversation participants
5. Recipients can now send encrypted messages to sender

### Presence with Encryption Status
1. Client connects and joins rooms
2. Gateway checks if user has encryption keys
3. Presence update includes `hasEncryptionKeys: boolean`
4. Other clients know who can receive encrypted messages

## Error Handling Strategy

### Encryption Failures
- Log error with sanitized details
- Emit `encryption:failed` event to sender
- Fall back to unencrypted message
- Continue message delivery

### Key Not Found
- Check cache first, then database
- If not found, broadcast unencrypted
- Emit `encryption:key-missing` to sender
- Suggest key exchange to client

### Decryption Failures
- Never expose decrypted content on error
- Return generic error to client
- Log detailed error server-side
- Support for old key versions (rotation)

## Testing Strategy

### Unit Tests
- Encryption helper methods
- DTO validation with encryption fields
- Key exchange logic
- Error handling paths

### Integration Tests
- End-to-end encrypted message flow
- Mixed encrypted/unencrypted scenarios
- Key exchange between multiple clients
- Encryption failure fallback
- Presence with encryption status

### Security Tests
- Verify no sensitive data in logs
- Test unauthorized decryption prevention
- Validate auth tag verification
- Test replay attack prevention (via unique IVs)

## Future Enhancements

1. **End-to-End Encryption Verification**
   - Client-side verification of encryption
   - Visual indicators for encrypted messages
   - Encryption key fingerprints

2. **Advanced Key Management**
   - Automatic key rotation scheduling
   - Multi-device key synchronization
   - Key backup and recovery

3. **Performance Optimization**
   - Batch encryption for multiple recipients
   - WebWorker-based encryption on client
   - Compression before encryption

4. **Compliance Features**
   - Audit trail for encryption operations
   - Key escrow for regulatory compliance
   - Data retention with encryption
