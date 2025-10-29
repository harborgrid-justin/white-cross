# E2E Encryption Integration Checklist - E2E9C7

## Phase 1: Model & Migration Updates
- [ ] Update Message model with `isEncrypted` column
- [ ] Update Message model with `encryptionMetadata` JSONB column
- [ ] Update Message model with `encryptionVersion` column
- [ ] Update Conversation model with `encryptionKeyId` column (for shared keys)
- [ ] Create database migration file
- [ ] Test migration syntax

## Phase 2: Encryption Initialization Service
- [ ] Create `encryption-initialization.service.ts` file
- [ ] Implement `initializeUserEncryption()` method
- [ ] Implement `checkUserEncryptionStatus()` method
- [ ] Implement `verifyEncryptionSetup()` method
- [ ] Add error handling and logging
- [ ] Add unit tests for initialization service

## Phase 3: EnhancedMessageService Integration
- [ ] Inject KeyManagementService into EnhancedMessageService
- [ ] Update `sendDirectMessage()` to use `encryptMessage()`
- [ ] Update `sendGroupMessage()` to encrypt for all recipients
- [ ] Add `decryptMessageContent()` private helper method
- [ ] Update `getMessageHistory()` to decrypt messages
- [ ] Update `searchMessages()` to handle encrypted content
- [ ] Add encryption status to message responses
- [ ] Implement graceful fallback for missing keys
- [ ] Add comprehensive logging (no plaintext)
- [ ] Update error handling

## Phase 4: Controller & Endpoints
- [ ] Check if EnhancedMessageController exists
- [ ] Create POST `/messages/encryption/setup` endpoint
- [ ] Create GET `/messages/encryption/public-key/:userId` endpoint
- [ ] Create POST `/messages/encryption/rotate-keys` endpoint
- [ ] Create GET `/messages/:messageId/encryption-status` endpoint
- [ ] Add proper authentication guards
- [ ] Add Swagger documentation
- [ ] Add validation decorators

## Phase 5: Module Configuration
- [ ] Update CommunicationModule imports
- [ ] Add EncryptionModule to imports
- [ ] Add Message model to SequelizeModule
- [ ] Add Conversation model to SequelizeModule
- [ ] Add ConversationParticipant model to SequelizeModule
- [ ] Register EncryptionInitializationService
- [ ] Export encryption-related services
- [ ] Verify module dependencies

## Phase 6: Testing & Validation
- [ ] Test encrypted direct message sending
- [ ] Test encrypted group message sending
- [ ] Test message decryption on retrieval
- [ ] Test multi-recipient encryption
- [ ] Test key rotation flow
- [ ] Test missing key fallback
- [ ] Test encryption status endpoints
- [ ] Test backward compatibility (unencrypted messages)
- [ ] Run integration tests
- [ ] Verify no plaintext in logs

## Phase 7: Documentation
- [ ] Update architecture notes
- [ ] Update integration map
- [ ] Create completion summary
- [ ] Move files to completed/
