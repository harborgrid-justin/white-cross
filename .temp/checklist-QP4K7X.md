# Queue Processor Implementation Checklist

**Task ID**: QP4K7X
**Status**: In Progress

## Phase 1: Service Integration Setup
- [ ] Read EnhancedMessageService methods and interfaces
- [ ] Read WebSocketService broadcasting methods
- [ ] Read EncryptionService encrypt/decrypt methods
- [ ] Identify Message model structure
- [ ] Identify MessageDelivery model structure
- [ ] Identify Conversation model structure
- [ ] Identify MessageRead model structure
- [ ] Plan constructor injection pattern

## Phase 2: SendMessageJob Processor
- [ ] Inject EnhancedMessageService
- [ ] Inject WebSocketService
- [ ] Validate message content
- [ ] Check recipient exists (use validateUser)
- [ ] Send message via EnhancedMessageService
- [ ] Broadcast via WebSocket to conversation
- [ ] Update message status (sending → sent)
- [ ] Create delivery records for recipients
- [ ] Track delivery status per recipient
- [ ] Implement retry logic for failures
- [ ] Add comprehensive error handling
- [ ] Update progress tracking

## Phase 3: DeliveryConfirmationJob Processor
- [ ] Inject Message repository
- [ ] Inject MessageDelivery repository
- [ ] Update message delivery status in database
- [ ] Update MessageDelivery records
- [ ] Update MessageRead records if status is 'read'
- [ ] Broadcast delivery confirmation via WebSocket
- [ ] Handle multiple recipients
- [ ] Send acknowledgment to sender
- [ ] Error handling for database failures

## Phase 4: EncryptionJob Processor
- [ ] Inject EncryptionService
- [ ] Inject Message repository
- [ ] Retrieve encryption key (if keyId provided)
- [ ] Call EncryptionService.encrypt() for encrypt operation
- [ ] Call EncryptionService.decrypt() for decrypt operation
- [ ] Store encrypted/decrypted content in database
- [ ] Update encryption metadata
- [ ] Handle encryption failures gracefully
- [ ] Log encryption operations

## Phase 5: IndexingJob Processor
- [ ] Determine indexing strategy (PostgreSQL full-text or external)
- [ ] Implement index operation
- [ ] Implement update operation
- [ ] Implement delete operation
- [ ] Index message content, sender, recipients
- [ ] Index conversation context
- [ ] Handle indexing failures gracefully
- [ ] Log indexing statistics

## Phase 6: BatchMessageProcessor
- [ ] Inject EnhancedMessageService
- [ ] Inject MessageQueueService (for queuing individual jobs)
- [ ] Split recipientIds into chunks
- [ ] Process each chunk with delay
- [ ] Track overall progress (percentage)
- [ ] Queue individual send-message jobs
- [ ] Handle partial failures (continue processing)
- [ ] Return summary (success/failure counts)
- [ ] Log batch statistics

## Phase 7: MessageCleanupProcessor
- [ ] Inject Message repository
- [ ] Inject Conversation repository
- [ ] Implement cleanupOldMessages method
  - [ ] Query messages older than retention period
  - [ ] Process in batches to avoid long queries
  - [ ] Soft delete (set deletedAt) or hard delete
  - [ ] Delete related attachments
- [ ] Implement cleanupDeletedConversations method
  - [ ] Find soft-deleted conversations
  - [ ] Delete messages from those conversations
  - [ ] Clean up conversation data
- [ ] Implement cleanupExpiredAttachments method
  - [ ] Find expired attachments
  - [ ] Delete from storage
  - [ ] Update database records
- [ ] Log cleanup statistics

## Phase 8: NotificationJob Processor Enhancement
- [ ] Create/identify NotificationService
- [ ] Create/identify EmailService stub if not exists
- [ ] Create/identify SMSService stub if not exists
- [ ] Implement sendPushNotification (Firebase/APNs)
- [ ] Implement sendEmailNotification
- [ ] Implement sendSmsNotification
- [ ] Implement sendInAppNotification (database storage)
- [ ] Handle notification preferences
- [ ] Track notification delivery status
- [ ] Error handling per notification type

## Phase 9: Queue Integration Service
- [ ] Create QueueIntegrationService file
- [ ] Inject all queue instances
- [ ] Implement bulk job creation method
- [ ] Implement queue health check method
- [ ] Implement failed job analysis method
- [ ] Implement retry all failed jobs method
- [ ] Add comprehensive logging

## Phase 10: Module Updates
- [ ] Import EnhancedMessageService in module
- [ ] Import ConversationService in module
- [ ] Import WebSocketService in module
- [ ] Import EncryptionService in module
- [ ] Import database models
- [ ] Inject services into processors
- [ ] Register QueueIntegrationService
- [ ] Export QueueIntegrationService

## Phase 11: Testing
- [ ] Create test file for message-queue.processor.ts
- [ ] Test SendMessageJob processor
- [ ] Test DeliveryConfirmationJob processor
- [ ] Test EncryptionJob processor
- [ ] Test IndexingJob processor
- [ ] Test BatchMessageProcessor
- [ ] Test MessageCleanupProcessor
- [ ] Test NotificationJob processor
- [ ] Create test file for queue-integration.service.ts
- [ ] Test QueueIntegrationService methods
- [ ] Run all tests and verify passing

## Phase 12: Documentation
- [ ] Update JSDoc comments with implementation details
- [ ] Document integration points
- [ ] Document error handling strategies
- [ ] Create architecture notes
- [ ] Update completion summary
