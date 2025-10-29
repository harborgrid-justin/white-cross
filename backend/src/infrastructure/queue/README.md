# Message Queue Module

Comprehensive message queue system using Bull and Redis for asynchronous message processing in the White Cross messaging platform.

## Overview

This module provides robust, scalable, and type-safe background job processing for messaging operations including:

- **Message Delivery**: Asynchronous message sending and delivery confirmation
- **Notifications**: Push notifications, emails, and SMS alerts
- **Encryption**: CPU-intensive encryption/decryption operations
- **Indexing**: Search index updates for message content
- **Batch Operations**: Bulk message sending to multiple recipients
- **Cleanup**: Scheduled maintenance and message cleanup tasks

## Features

- ✅ Redis-backed job persistence with Bull
- ✅ Exponential backoff retry strategy
- ✅ Job priority levels (LOW, NORMAL, HIGH, CRITICAL)
- ✅ Comprehensive monitoring and metrics
- ✅ Dead letter queue for failed jobs
- ✅ Type-safe DTOs with runtime validation
- ✅ Queue-specific concurrency controls
- ✅ Progress tracking for long-running jobs
- ✅ Health monitoring and failure rate tracking
- ✅ Horizontal scalability

## Installation

The module is already set up with required dependencies:

```json
{
  "@nestjs/bull": "^11.0.4",
  "bull": "^4.16.5",
  "redis": "^5.9.0"
}
```

## Quick Start

### 1. Import the Module

```typescript
import { Module } from '@nestjs/common';
import { MessageQueueModule } from './infrastructure/queue';

@Module({
  imports: [MessageQueueModule],
  // ...
})
export class AppModule {}
```

### 2. Inject the Service

```typescript
import { Injectable } from '@nestjs/common';
import { MessageQueueService, SendMessageJobDto, JobPriority } from './infrastructure/queue';

@Injectable()
export class MessageService {
  constructor(private readonly messageQueue: MessageQueueService) {}

  async sendMessage(messageData: any) {
    // Add message delivery job
    const job = await this.messageQueue.addMessageDeliveryJob(
      {
        messageId: messageData.id,
        senderId: messageData.senderId,
        recipientId: messageData.recipientId,
        content: messageData.content,
        conversationId: messageData.conversationId,
        createdAt: new Date(),
      },
      {
        priority: JobPriority.HIGH,
      },
    );

    return { jobId: job.id };
  }
}
```

## Queue Types

### MESSAGE_DELIVERY
Handles real-time message delivery and delivery confirmations.

**Configuration**:
- Concurrency: 10
- Max Attempts: 5
- Backoff: Exponential (2s base)
- Timeout: 30s

**Job Types**:
- `send-message`: Send message to recipient
- `delivery-confirmation`: Track delivery status

### MESSAGE_NOTIFICATION
Handles push notifications, emails, and SMS alerts.

**Configuration**:
- Concurrency: 15
- Max Attempts: 3
- Backoff: Exponential (1s base)
- Timeout: 20s

**Job Types**:
- `send-notification`: Send notification (push/email/SMS/in-app)

### MESSAGE_INDEXING
Updates search index for message content.

**Configuration**:
- Concurrency: 3
- Max Attempts: 3
- Backoff: Exponential (3s base)
- Timeout: 60s

**Job Types**:
- `index-message`: Index, update, or delete message in search engine

### MESSAGE_ENCRYPTION
Handles CPU-intensive encryption/decryption operations.

**Configuration**:
- Concurrency: 5
- Max Attempts: 3
- Backoff: Exponential (2s base)
- Timeout: 45s

**Job Types**:
- `encrypt-decrypt`: Encrypt or decrypt message content

### BATCH_MESSAGE_SENDING
Processes bulk message operations.

**Configuration**:
- Concurrency: 2
- Max Attempts: 3
- Backoff: Exponential (5s base)
- Timeout: 5 minutes

**Job Types**:
- `batch-send`: Send messages to multiple recipients in chunks

### MESSAGE_CLEANUP
Scheduled cleanup and maintenance tasks.

**Configuration**:
- Concurrency: 1 (sequential)
- Max Attempts: 2
- Backoff: Fixed (10s)
- Timeout: 10 minutes

**Job Types**:
- `cleanup-messages`: Delete old messages, clean attachments

## Usage Examples

### Send a Message

```typescript
await messageQueue.addMessageDeliveryJob({
  messageId: 'uuid-here',
  senderId: 'sender-uuid',
  recipientId: 'recipient-uuid',
  content: 'Hello, World!',
  conversationId: 'conversation-uuid',
  requiresEncryption: true,
  createdAt: new Date(),
});
```

### Send a Notification

```typescript
await messageQueue.addNotificationJob({
  recipientId: 'user-uuid',
  type: NotificationType.PUSH,
  title: 'New Message',
  message: 'You have a new message from John',
  messageId: 'message-uuid',
  pushPayload: {
    title: 'New Message',
    body: 'You have a new message from John',
    icon: '/icons/message.png',
    clickAction: '/messages/conversation-uuid',
  },
  createdAt: new Date(),
}, {
  priority: JobPriority.HIGH,
});
```

### Encrypt Message Content

```typescript
await messageQueue.addEncryptionJob({
  messageId: 'message-uuid',
  operation: 'encrypt',
  content: 'Sensitive message content',
  algorithm: 'AES-256-GCM',
  createdAt: new Date(),
}, {
  priority: JobPriority.NORMAL,
});
```

### Index Message for Search

```typescript
await messageQueue.addIndexingJob({
  messageId: 'message-uuid',
  operation: 'index',
  content: 'Message content to index',
  senderId: 'sender-uuid',
  conversationId: 'conversation-uuid',
  messageTimestamp: new Date(),
  createdAt: new Date(),
});
```

### Send Batch Messages

```typescript
await messageQueue.addBatchMessageJob({
  senderId: 'sender-uuid',
  recipientIds: ['user1-uuid', 'user2-uuid', 'user3-uuid'],
  content: 'Announcement: System maintenance scheduled',
  chunkSize: 10,
  chunkDelay: 100,
  createdAt: new Date(),
}, {
  priority: JobPriority.LOW,
});
```

### Schedule Cleanup Job

```typescript
await messageQueue.addCleanupJob({
  cleanupType: 'old_messages',
  retentionDays: 90,
  batchSize: 1000,
  dryRun: false,
  createdAt: new Date(),
});
```

## Monitoring and Metrics

### Get Queue Metrics

```typescript
const metrics = await messageQueue.getQueueMetrics();
console.log(metrics);
// {
//   queues: {
//     'message-delivery': { waiting: 5, active: 2, completed: 1000, failed: 3, ... },
//     'message-notification': { waiting: 10, active: 5, completed: 5000, failed: 12, ... },
//     ...
//   },
//   totals: { waiting: 20, active: 10, completed: 10000, failed: 30, ... },
//   timestamp: 2025-10-29T21:00:00.000Z
// }
```

### Check Queue Health

```typescript
const health = await messageQueue.getQueueHealth(QueueName.MESSAGE_DELIVERY);
console.log(health);
// {
//   name: 'message-delivery',
//   status: 'healthy',
//   checks: { redis: true, accepting: true, processing: true, highFailureRate: false },
//   failureRate: 0.003,
//   checkedAt: 2025-10-29T21:00:00.000Z
// }
```

### Get Failed Jobs

```typescript
const failedJobs = await messageQueue.getFailedJobs(QueueName.MESSAGE_DELIVERY, 50);
console.log(failedJobs);
// [
//   {
//     jobId: 'job-123',
//     queueName: 'message-delivery',
//     data: { messageId: '...', ... },
//     error: { message: 'Connection timeout', stack: '...' },
//     attempts: 5,
//     failedAt: 2025-10-29T20:00:00.000Z,
//     createdAt: 2025-10-29T19:00:00.000Z
//   }
// ]
```

### Retry Failed Job

```typescript
await messageQueue.retryFailedJob(QueueName.MESSAGE_DELIVERY, 'job-123');
```

### Queue Management

```typescript
// Pause a queue
await messageQueue.pauseQueue(QueueName.MESSAGE_CLEANUP);

// Resume a queue
await messageQueue.resumeQueue(QueueName.MESSAGE_CLEANUP);

// Clean old jobs
await messageQueue.cleanQueue(QueueName.MESSAGE_DELIVERY, 86400000); // 24 hours
```

## Job Priority

Jobs can be assigned priority levels:

```typescript
enum JobPriority {
  LOW = 1,       // Batch operations, cleanup
  NORMAL = 5,    // Standard messages, background tasks
  HIGH = 10,     // Real-time messages, critical notifications
  CRITICAL = 20, // Urgent system messages, alerts
}
```

Higher priority jobs are processed first.

## Job Options

All job methods accept optional `QueueJobOptions`:

```typescript
interface QueueJobOptions {
  priority?: JobPriority;        // Job priority
  delay?: number;                // Delay in ms before processing
  attempts?: number;             // Number of retry attempts
  timeout?: number;              // Job timeout in ms
  backoff?: {                    // Retry backoff strategy
    type: 'fixed' | 'exponential';
    delay: number;
  };
  removeOnComplete?: boolean;    // Remove after completion
  removeOnFail?: boolean;        // Remove after failure
  repeat?: {                     // Repeatable job config
    cron?: string;
    every?: number;
    limit?: number;
  };
}
```

## Environment Variables

Configure Redis connection via environment variables:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-password
REDIS_USERNAME=default
REDIS_QUEUE_DB=1
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Message Service Layer                     │
│                  (Controllers, Services)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              MessageQueueService (Queue Manager)             │
│  - addMessageDeliveryJob()   - addNotificationJob()         │
│  - addEncryptionJob()        - addIndexingJob()             │
│  - addBatchMessageJob()      - addCleanupJob()              │
│  - getQueueMetrics()         - getQueueHealth()             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Bull Queues (Redis)                        │
│  ┌──────────────┬──────────────┬──────────────┐            │
│  │   DELIVERY   │ NOTIFICATION │  ENCRYPTION  │   + 3 more │
│  └──────────────┴──────────────┴──────────────┘            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                Job Processors (Workers)                      │
│  - MessageDeliveryProcessor   - NotificationProcessor       │
│  - EncryptionProcessor        - IndexingProcessor           │
│  - BatchMessageProcessor      - CleanupProcessor            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              External Services & Storage                     │
│  - Database  - WebSocket  - Email  - Push  - Search        │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
queue/
├── dtos/
│   ├── batch-message-job.dto.ts      # Batch and cleanup job DTOs
│   ├── message-job.dto.ts            # Message delivery and encryption DTOs
│   ├── notification-job.dto.ts       # Notification job DTOs
│   └── index.ts
├── enums/
│   ├── job-priority.enum.ts          # Priority levels
│   ├── queue-name.enum.ts            # Queue names
│   └── index.ts
├── interfaces/
│   ├── queue-job.interface.ts        # Job interfaces
│   ├── queue-metrics.interface.ts    # Metrics interfaces
│   └── index.ts
├── message-queue.module.ts           # Main module
├── message-queue.service.ts          # Queue management service
├── message-queue.processor.ts        # All job processors
├── queue.config.ts                   # Queue configuration
├── index.ts                          # Barrel export
└── README.md                         # This file
```

## Error Handling

All processors implement comprehensive error handling:

1. **Try-catch blocks** in all processor methods
2. **Structured error logging** with stack traces
3. **JobResult interface** with success/error information
4. **Automatic retries** with exponential backoff
5. **Dead letter queue** for permanently failed jobs

## Performance Considerations

- **Concurrency controls** prevent overwhelming downstream services
- **Chunked processing** for batch operations
- **Job cleanup policies** prevent memory bloat
- **Redis pipeline** for bulk operations
- **Queue-specific timeouts** prevent hanging jobs

## Testing

```typescript
import { Test } from '@nestjs/testing';
import { MessageQueueService } from './message-queue.service';
import { getQueueToken } from '@nestjs/bull';

describe('MessageQueueService', () => {
  let service: MessageQueueService;
  let mockQueue: any;

  beforeEach(async () => {
    mockQueue = {
      add: jest.fn(),
      getWaitingCount: jest.fn().mockResolvedValue(0),
      // ... other queue methods
    };

    const module = await Test.createTestingModule({
      providers: [
        MessageQueueService,
        {
          provide: getQueueToken(QueueName.MESSAGE_DELIVERY),
          useValue: mockQueue,
        },
        // ... other queue tokens
      ],
    }).compile();

    service = module.get<MessageQueueService>(MessageQueueService);
  });

  it('should add message delivery job', async () => {
    const jobData = { /* ... */ };
    await service.addMessageDeliveryJob(jobData);
    expect(mockQueue.add).toHaveBeenCalledWith('send-message', jobData, expect.any(Object));
  });
});
```

## Contributing

When adding new job types:

1. Add queue name to `QueueName` enum
2. Create DTO in `dtos/` with validation
3. Add processor method in `message-queue.processor.ts`
4. Add service method in `message-queue.service.ts`
5. Register queue in `message-queue.module.ts`
6. Update configuration in `queue.config.ts`
7. Add tests

## License

MIT - White Cross Team

## Support

For issues or questions, contact the Backend Architecture team.
