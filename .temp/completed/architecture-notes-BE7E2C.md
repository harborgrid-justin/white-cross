# Encryption Architecture Notes - Backend Message Encryption

**Agent**: backend-encryption-architect
**Task**: message-encryption-e2e-BE7E2C
**Date**: 2025-10-29

## References to Other Agent Work
- Existing cache infrastructure: `/home/user/white-cross/backend/src/infrastructure/cache/cache.service.ts`
- Message models: `/home/user/white-cross/backend/src/database/models/message.model.ts`
- Communication DTOs: `/home/user/white-cross/backend/src/communication/dto/`

## High-level Design Decisions

### Hybrid Encryption Architecture
**Decision**: Use RSA-4096 for key exchange and AES-256-GCM for message content

**Rationale**:
- RSA provides asymmetric encryption for secure key exchange between parties
- AES-256-GCM offers fast symmetric encryption with built-in authentication (AEAD)
- Hybrid approach balances security and performance
- GCM mode provides authentication, preventing tampering

**Trade-offs**:
- Slightly more complex implementation than single-algorithm approach
- Performance overhead of RSA key operations (mitigated by caching session keys)
- Benefit: Strong security guarantees with reasonable performance

### Key Management Strategy
**Decision**: Generate unique encryption keys per conversation with Redis caching

**Rationale**:
- Per-conversation keys limit exposure if a key is compromised
- Redis provides distributed, TTL-based temporary storage
- Leverages existing infrastructure
- Supports key rotation without service interruption

**Implementation**:
- User public/private key pairs stored securely
- Ephemeral session keys for each conversation
- Session keys encrypted with recipient public keys
- Redis TTL auto-expires old keys

## Integration Patterns

### Message Service Integration
- Encryption happens before message storage
- Decryption happens on message retrieval
- Support both encrypted and non-encrypted messages (backward compatibility)
- Add encryption metadata to message model

### Cache Service Integration
- Use existing `CacheService` for Redis operations
- Namespace: `encryption:keys:`
- TTL: Configurable, default 24 hours
- Store encrypted session keys, not private keys

## Type System Strategies

### Type Safety for Cryptographic Operations
```typescript
// Branded types for different key types
type PrivateKey = string & { readonly __brand: 'PrivateKey' };
type PublicKey = string & { readonly __brand: 'PublicKey' };
type EncryptedData = string & { readonly __brand: 'EncryptedData' };

// Result types for operations
type EncryptionResult =
  | { success: true; data: EncryptedData; metadata: EncryptionMetadata }
  | { success: false; error: EncryptionError };
```

**Rationale**: Branded types prevent mixing different key types, Result types force error handling

### Generic Constraints for Encryption
```typescript
interface Encryptable {
  serialize(): string;
}

class EncryptionService {
  encrypt<T extends Encryptable>(data: T): Promise<EncryptedData>;
}
```

**Rationale**: Ensures only serializable data can be encrypted

## Performance Considerations

### Algorithmic Complexity
- RSA operations: O(n³) where n is key size - expensive, minimize usage
- AES operations: O(n) where n is data size - fast for bulk encryption
- Key caching: O(1) Redis lookup

### Optimization Strategies
1. **Cache Session Keys**: Avoid repeated RSA operations
2. **Lazy Key Generation**: Generate keys on-demand, not upfront
3. **Buffer Pooling**: Reuse buffers for crypto operations
4. **Stream Processing**: For large messages, use streaming encryption

### Memory Management
- Clear sensitive buffers immediately after use
- Avoid keeping decrypted data in memory longer than necessary
- Use `crypto.timingSafeEqual` for comparisons to prevent timing attacks

## Security Requirements

### Key Security
- **Private Keys**: Never logged, never transmitted, encrypted at rest
- **Session Keys**: Stored in Redis with TTL, encrypted with public keys
- **Key Generation**: Use `crypto.randomBytes()` for secure random generation
- **Key Size**: Minimum RSA-4096, AES-256

### Data Security
- **Encryption**: AES-256-GCM (authenticated encryption)
- **IV/Nonce**: Unique per message, stored with ciphertext
- **Authentication**: GCM tag validates integrity
- **Padding**: GCM doesn't require padding (stream cipher mode)

### Error Handling Security
- **No Information Leakage**: Generic error messages for encryption failures
- **Timing Attack Prevention**: Constant-time comparisons
- **Audit Logging**: Log operations (not data) for security monitoring

## Implementation Details

### Directory Structure
```
backend/src/infrastructure/encryption/
├── dto/
│   ├── encrypted-message.dto.ts
│   ├── key-exchange.dto.ts
│   ├── encryption-keys.dto.ts
│   └── index.ts
├── interfaces/
│   ├── encryption.interfaces.ts
│   ├── key-management.interfaces.ts
│   └── index.ts
├── encryption.service.ts
├── key-management.service.ts
├── encryption.module.ts
└── index.ts
```

### Service Dependencies
- `CacheService`: For Redis key storage
- `ConfigService`: For encryption configuration
- `Logger`: For audit logging (no sensitive data)
- `EventEmitter`: For encryption events

### Configuration
```typescript
interface EncryptionConfig {
  algorithm: 'aes-256-gcm';
  keySize: 4096; // RSA key size
  sessionKeyTTL: 86400; // 24 hours
  enableKeyRotation: boolean;
  keyRotationInterval: 604800; // 7 days
}
```

## Testing Strategy

### Unit Tests
- Key generation produces valid keys
- Encryption/decryption round-trip
- Error handling for invalid keys
- Memory cleanup after operations

### Integration Tests
- Redis key storage and retrieval
- Message service integration
- Key rotation workflow
- Concurrent encryption operations

### Security Tests
- No sensitive data in logs
- Proper error messages (no leakage)
- Key isolation between conversations
- Timing attack resistance

## Future Enhancements

1. **Forward Secrecy**: Implement key ratcheting for forward secrecy
2. **Multi-Device Support**: Key synchronization across devices
3. **Key Backup**: Secure key backup and recovery mechanism
4. **Hardware Security**: Integration with HSM for key storage
5. **Quantum Resistance**: Add post-quantum cryptography algorithms
