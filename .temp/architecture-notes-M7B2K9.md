# Architecture Notes - Backend Message Service Enhancement (M7B2K9)

## High-Level Design Decisions

### 1. Service Architecture
- **Separate Service Pattern**: Created `EnhancedMessageService` and `ConversationService` as distinct services
  - Maintains backward compatibility with existing `MessageService`
  - Clear separation of concerns: messaging vs conversation management
  - Easier to test and maintain independently

### 2. Data Model Design
- **Conversation-Centric Model**: Messages belong to conversations, not standalone
  - Supports DIRECT (1-to-1), GROUP (small groups), CHANNEL (broadcast)
  - Flexible for future expansion (voice channels, video rooms, etc.)

- **Soft Delete Pattern**: Used Sequelize `paranoid: true` for data retention
  - GDPR compliance: data can be recovered if needed
  - Audit trail preservation
  - No breaking foreign key constraints

- **Threading Support**: Dual approach with `parentId` and `threadId`
  - `parentId`: Direct reply relationship
  - `threadId`: Groups all messages in a thread
  - Supports nested conversations and reply chains

### 3. Type System Strategy
- **Strict Type Safety**: All models have proper TypeScript interfaces
  - `MessageAttributes` and `MessageCreationAttributes` separation
  - Optional fields properly typed with `?` operator
  - Enum types for status fields (no magic strings)

- **Generic Constraints**: Leveraged Sequelize's `Optional<>` type utility
  - Auto-generated fields (id, timestamps) marked as optional in creation
  - Compile-time validation of required fields

### 4. Permission Model
- **Role-Based Access Control (RBAC)**:
  - OWNER: Full control, can delete conversation
  - ADMIN: Can manage participants, update settings
  - MEMBER: Can send/receive messages
  - VIEWER: Read-only access

- **Permission Checks**: Centralized in `checkPermission()` helper
  - Throws `ForbiddenException` with clear error messages
  - Prevents permission escalation attacks

## Integration Patterns

### 1. Encryption Integration
- **Optional E2E Encryption**: Uses existing `EncryptionService`
  - `encrypted` flag in DTOs enables encryption
  - Stores both plain and encrypted content (for search and audit)
  - AES-256-GCM with authentication tags

### 2. Multi-Tenant Isolation
- **Tenant ID in All Queries**: Every query includes `tenantId` in WHERE clause
  - Prevents cross-tenant data access
  - Index on `tenantId` for performance
  - Enforced at service layer, not controller

### 3. Real-Time Delivery (WebSocket Integration Points)
- **Service returns data suitable for WebSocket emission**:
  - Message sent → emit to conversation participants
  - Read status updated → emit to sender
  - Participant added → emit to all participants
  - Integration via event emitters (to be added)

### 4. Async Processing (Queue Integration Points)
- **Prepared for queue integration**:
  - Delivery record creation can be queued
  - Notification sending can be async
  - Search indexing can be background job
  - Bulk operations ready for queue processing

## Performance Considerations

### 1. Database Indexes
- **Strategic Indexing**:
  - `conversationId + userId` (unique) on participants
  - `messageId + userId` (unique) on message reads
  - `conversationId` on messages for fast conversation queries
  - `threadId` and `parentId` for threading queries
  - `tenantId` on all tenant-isolated tables

### 2. Query Optimization
- **Pagination**: All list endpoints support offset-based pagination
- **Selective Loading**: Include associations only when needed
- **Count Queries**: Separate count and data queries for large datasets

### 3. N+1 Query Prevention
- **Eager Loading**: Uses Sequelize `include` for related data
- **Batch Operations**: `Promise.all()` for parallel async operations
- **Unread Count**: Optimized with participant `lastReadAt` timestamp

### 4. Caching Opportunities (Future)
- Conversation participant lists
- Unread counts
- User permission levels
- Recent message history

## Security Requirements

### 1. Input Validation
- **Class-Validator Decorators**: All DTOs have comprehensive validation
  - `@IsUUID()` for IDs
  - `@MinLength()` / `@MaxLength()` for strings
  - `@IsEnum()` for constrained values
  - `@ArrayMinSize()` for arrays

### 2. Authorization Checks
- **Participant Verification**: Every operation checks if user is a participant
- **Permission Verification**: Role-based checks for sensitive operations
- **Tenant Isolation**: All queries filtered by `tenantId`

### 3. Data Sanitization
- **No Raw SQL**: All queries use Sequelize ORM
- **Parameterized Queries**: Protection against SQL injection
- **Content Escaping**: HTML content handling (if needed)

### 4. Audit Trail
- **Timestamps**: `createdAt`, `updatedAt`, `deletedAt` on all models
- **Edit History**: Stored in message `metadata.editHistory`
- **Read Tracking**: Separate `MessageRead` table for audit

## SOLID Principles Application

### 1. Single Responsibility
- Each service has a single, well-defined purpose
- DTOs are pure data transfer objects
- Models represent database entities only

### 2. Open/Closed
- Services extensible through dependency injection
- Strategy pattern for encryption (can add other encryption methods)
- Metadata fields allow extension without schema changes

### 3. Liskov Substitution
- All models extend Sequelize base classes correctly
- Services can be mocked/stubbed for testing
- DTOs properly inherit from base validation classes

### 4. Interface Segregation
- Separate DTOs for each operation (not one giant DTO)
- Role interfaces clearly define permissions
- Service methods have focused, specific signatures

### 5. Dependency Inversion
- Services depend on Sequelize models (abstractions)
- EncryptionService injected via constructor
- Easy to swap implementations for testing

## Design Patterns Used

### 1. Repository Pattern
- Sequelize models act as repositories
- Services orchestrate model interactions
- Clear data access layer

### 2. DTO Pattern
- All external data validated through DTOs
- Clear contract between API and service layer
- Type safety end-to-end

### 3. Builder Pattern
- Fluent WHERE clause construction
- Query building with filters and pagination
- Flexible conversation creation

### 4. Strategy Pattern
- Optional encryption strategy
- Different conversation types (DIRECT/GROUP/CHANNEL)
- Role-based permission strategies

### 5. Observer Pattern (Prepared)
- Ready for WebSocket event emission
- Message sent → notify participants
- Read status → notify sender

## Error Handling Strategy

### 1. Custom Exceptions
- `NotFoundException`: Entity doesn't exist
- `ForbiddenException`: Permission denied
- `BadRequestException`: Validation errors

### 2. Error Messages
- Clear, user-friendly messages
- No sensitive information in errors
- Consistent error format across all endpoints

### 3. Logging
- Debug logs for development
- Info logs for operations
- Error logs with stack traces

## Testing Strategy

### 1. Unit Tests (Recommended)
- Service method tests with mocked models
- DTO validation tests
- Helper method tests

### 2. Integration Tests (Recommended)
- Full endpoint tests with test database
- Multi-user conversation scenarios
- Permission boundary tests

### 3. E2E Tests (Recommended)
- Complete user workflows
- Real-time message delivery
- Concurrent access scenarios

## Future Enhancements

### 1. Real-Time Features
- WebSocket gateway implementation
- Online presence tracking
- Typing indicators
- Message delivery confirmations

### 2. Advanced Features
- Message reactions (model exists)
- Thread summaries
- Message forwarding
- Rich media support (images, videos)

### 3. Performance Optimizations
- Redis caching for unread counts
- ElasticSearch for full-text search
- Message archival to cold storage
- Read-replica for read-heavy operations

### 4. Analytics
- Message delivery metrics
- User engagement tracking
- Conversation activity monitoring
- Performance dashboards
