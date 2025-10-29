# Architecture Notes - E2E Encryption Integration (E2E9C7)

## References to Other Agent Work
- **M7B2K9**: Real-time messaging infrastructure
- **MG5X2Y**: Message service implementation
- **MQ7B8C**: Database models and migrations
- **MS8G2V**: Conversation service
- **WS8M3G**: API controllers and endpoints

## High-Level Design Decisions

### 1. Encryption Architecture
- **Hybrid Encryption Model**: Use session keys (AES-256-GCM) for message content, RSA for key exchange
- **Per-Conversation Keys**: Each conversation has its own session key for efficient multi-message encryption
- **Key Rotation**: Support periodic key rotation without breaking message history
- **Graceful Degradation**: Fall back to unencrypted if user has no keys (backward compatibility)

### 2. Integration Strategy
- **Non-Breaking Changes**: Maintain existing API contracts
- **Transparent Encryption**: Encryption/decryption happens at service layer
- **Metadata Storage**: Store encryption metadata in JSONB for flexibility
- **Version Control**: Track encryption version for future algorithm updates

### 3. Security Principles
- **Zero Plaintext Logging**: Never log decrypted content or encryption keys
- **Authenticated Encryption**: Use AES-GCM for authentication tag verification
- **Key Isolation**: Per-conversation and per-user key isolation
- **Secure Key Storage**: Private keys encrypted at rest with user passphrase

## Integration Patterns

### Message Encryption Flow
```
1. User sends message with encrypted=true
2. Service checks if user has encryption keys
   - If not: Generate keys, store securely
3. Get or create session key for conversation
4. Encrypt message content with session key
5. Store encrypted content + metadata in database
6. Return success response
```

### Message Decryption Flow
```
1. User requests messages from conversation
2. Service retrieves messages from database
3. For each encrypted message:
   - Get session key from cache/storage
   - Decrypt content using metadata
   - Replace encrypted content with plaintext
4. Return decrypted messages to user
```

### Multi-Recipient Encryption
```
1. For group messages, use shared conversation session key
2. All participants can decrypt using same session key
3. New participants get access to session key when added
4. Rotated keys stored with grace period for old messages
```

## Type System Strategies

### Encryption Metadata Type
```typescript
interface EncryptionMetadata {
  algorithm: 'AES_256_GCM';
  iv: string; // Base64 initialization vector
  authTag: string; // Base64 authentication tag
  keyId: string; // Session key identifier
  timestamp: number;
  version: string; // Encryption version
}
```

### Message Attributes Enhancement
```typescript
interface MessageAttributes {
  // ... existing fields
  isEncrypted: boolean;
  encryptionMetadata: EncryptionMetadata | null;
  encryptionVersion: string | null;
}
```

### Encryption Service Interface
```typescript
interface IEncryptionService {
  encryptMessage(
    message: string,
    senderId: string,
    recipientIds: string[],
    conversationId: string
  ): Promise<EncryptedMessage>;

  decryptMessage(
    encryptedMessage: EncryptedMessage,
    recipientId: string
  ): Promise<DecryptionResult>;
}
```

## Performance Considerations

### Caching Strategy
- **Session Keys**: Cache in Redis with 24-hour TTL
- **Public Keys**: Cache in Redis for quick access
- **Key Lookups**: Minimize database queries via caching

### Encryption Overhead
- **AES-256-GCM**: Fast symmetric encryption (~100 MB/s)
- **Batch Processing**: Encrypt multiple messages in parallel
- **Lazy Decryption**: Only decrypt messages when accessed

### Database Impact
- **JSONB Indexing**: Use GIN index on encryptionMetadata if needed
- **Binary Storage**: Store encrypted content as TEXT (base64)
- **Minimal Overhead**: Additional fields add ~200 bytes per message

## Security Requirements

### Key Management
- **Key Generation**: RSA-4096 for key pairs, random 256-bit for session keys
- **Key Rotation**: Support rotation every 7 days (configurable)
- **Key Revocation**: Immediate revocation with grace period for decryption
- **Key Storage**: Private keys encrypted with PBKDF2-derived user passphrase

### Authentication & Authorization
- **Recipient Verification**: Verify user is participant before decryption
- **Key Access Control**: Users can only access their own private keys
- **Audit Logging**: Log all key operations (generation, rotation, revocation)

### Data Protection
- **At-Rest Encryption**: Database-level encryption + application-level E2E
- **In-Transit Encryption**: TLS for all network communication
- **Memory Protection**: Clear sensitive data from memory after use

## Error Handling Strategy

### Encryption Errors
- **Missing Keys**: Generate keys automatically on first encrypted message
- **Invalid Metadata**: Log error, return unencrypted fallback
- **Encryption Failure**: Log securely, return error to user

### Decryption Errors
- **Key Not Found**: Log warning, return encrypted content (partial failure)
- **Invalid Auth Tag**: Security breach indicator - alert and reject
- **Version Mismatch**: Attempt compatibility mode, warn user

## Testing Strategy

### Unit Tests
- Test encryption/decryption with known values
- Test key generation and rotation
- Test error handling and fallback scenarios

### Integration Tests
- Test full message flow (send → store → retrieve → decrypt)
- Test multi-recipient encryption
- Test backward compatibility with unencrypted messages

### Security Tests
- Verify no plaintext in logs
- Verify authentication tag validation
- Verify key isolation between users/conversations
