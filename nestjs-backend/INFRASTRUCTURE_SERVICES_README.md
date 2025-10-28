# Infrastructure Services - White Cross NestJS Backend

## Overview

The White Cross platform includes three major infrastructure services that provide essential capabilities for API access, real-time communication, and background job processing.

## Services

### 1. GraphQL Module ✨ NEW

**Location:** `src/infrastructure/graphql/`

A complete GraphQL API layer built with NestJS GraphQL and Apollo Server, providing a flexible, type-safe alternative to REST endpoints.

#### Features
- **Code-First Schema:** Automatic schema generation from TypeScript types
- **Apollo Server Integration:** Industry-standard GraphQL server
- **JWT Authentication:** Secured with existing authentication system
- **GraphQL Playground:** Interactive API explorer (development only)
- **Type Safety:** End-to-end TypeScript type checking

#### Available Operations

**Contact Operations:**
- `contacts` - List with pagination and filtering
- `contact(id)` - Get single contact
- `contactsByRelation(relationTo)` - Get related contacts
- `searchContacts(query)` - Search contacts
- `contactStats` - Get statistics
- `createContact(input)` - Create new contact
- `updateContact(id, input)` - Update contact
- `deleteContact(id)` - Delete contact
- `deactivateContact(id)` - Deactivate contact
- `reactivateContact(id)` - Reactivate contact

**Student Operations:**
- `students` - List with pagination and filtering
- `student(id)` - Get single student

#### GraphQL Endpoint

```
POST/GET http://localhost:3001/graphql
```

**Authentication:** Include JWT token in Authorization header
```
Authorization: Bearer <your-jwt-token>
```

#### Example Query

```graphql
query GetContacts {
  contacts(page: 1, limit: 20, filters: { type: guardian }) {
    contacts {
      id
      fullName
      email
      phone
      type
    }
    pagination {
      total
      totalPages
    }
  }
}
```

#### Example Mutation

```graphql
mutation CreateContact($input: ContactInputDto!) {
  createContact(input: $input) {
    id
    fullName
    email
    type
  }
}

# Variables
{
  "input": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "type": "guardian"
  }
}
```

#### Frontend Integration

```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

---

### 2. WebSocket Module 🔴 VERIFIED

**Location:** `src/infrastructure/websocket/`

Real-time bidirectional communication using Socket.IO, enabling live notifications, alerts, and updates.

#### Features
- **Socket.IO Integration:** WebSocket with polling fallback
- **JWT Authentication:** Secure connection establishment
- **Room Management:** Multi-tenant isolation (org, user, student rooms)
- **Event Broadcasting:** Efficient message distribution
- **Connection Management:** Lifecycle handling and error recovery

#### Capabilities
- Emergency alerts
- Medication reminders
- Student health alerts
- Real-time notifications
- Presence tracking
- Multi-user messaging

#### WebSocket Connection

```
ws://localhost:3001/socket.io
```

**Authentication:** Include JWT token in connection handshake

#### Frontend Integration

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3001', {
  auth: {
    token: localStorage.getItem('token')
  },
  transports: ['websocket', 'polling'],
});

// Listen for connection confirmation
socket.on('connection:confirmed', (data) => {
  console.log('Connected:', data);
});

// Listen for medication reminders
socket.on('medication:reminder', (reminder) => {
  console.log('Medication reminder:', reminder);
});

// Listen for emergency alerts
socket.on('emergency:alert', (alert) => {
  console.log('Emergency alert:', alert);
});
```

#### Backend Usage

```typescript
import { WebSocketService } from './infrastructure/websocket/websocket.service';

@Injectable()
export class MedicationService {
  constructor(private websocketService: WebSocketService) {}

  async sendReminder(organizationId: string, reminder: any) {
    await this.websocketService.broadcastMedicationReminder(
      organizationId,
      reminder
    );
  }
}
```

---

### 3. Jobs/Queue Module 🔄 VERIFIED

**Location:** `src/infrastructure/jobs/`

Background job processing with BullMQ and Redis, enabling asynchronous task execution, scheduled jobs, and queue management.

#### Features
- **BullMQ Integration:** Redis-backed persistent queues
- **Multiple Job Types:** Type-safe job categories
- **Retry Logic:** Exponential backoff for failed jobs
- **Job Scheduling:** Cron-like patterns for recurring jobs
- **Job Monitoring:** Statistics and status tracking
- **Worker Concurrency:** Parallel job processing

#### Job Types

```typescript
enum JobType {
  MEDICATION_REMINDER = 'medication-reminder',
  IMMUNIZATION_ALERT = 'immunization-alert',
  APPOINTMENT_REMINDER = 'appointment-reminder',
  INVENTORY_MAINTENANCE = 'inventory-maintenance',
  REPORT_GENERATION = 'report-generation',
  DATA_EXPORT = 'data-export',
  NOTIFICATION_BATCH = 'notification-batch',
  CLEANUP_TASK = 'cleanup-task'
}
```

#### Processors

- **Medication Reminder Processor:** Sends medication reminders
- **Inventory Maintenance Processor:** Checks inventory levels

#### Backend Usage

```typescript
import { QueueManagerService } from './infrastructure/jobs/services/queue-manager.service';
import { JobType } from './infrastructure/jobs/enums/job-type.enum';

@Injectable()
export class MedicationService {
  constructor(private queueManager: QueueManagerService) {}

  // Add a one-time job
  async scheduleMedicationReminder(medicationId: string, studentId: string) {
    await this.queueManager.addJob(
      JobType.MEDICATION_REMINDER,
      { medicationId, studentId },
      { delay: 60000 } // Delay by 1 minute
    );
  }

  // Schedule a recurring job
  async scheduleRecurringReminder(data: any) {
    await this.queueManager.scheduleJob(
      JobType.MEDICATION_REMINDER,
      data,
      '0 9 * * *' // Every day at 9 AM
    );
  }

  // Get queue statistics
  async getJobStats() {
    return await this.queueManager.getAllQueueStats();
  }
}
```

---

## Configuration

### Environment Variables

```env
# GraphQL Configuration
NODE_ENV=development

# WebSocket Configuration
CORS_ORIGIN=http://localhost:5173

# Jobs/Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h
```

### Module Registration

All infrastructure modules are registered in `app.module.ts`:

```typescript
@Module({
  imports: [
    // ... other modules
    WebSocketModule,
    GraphQLModule,
    JobsModule,
    // ... other modules
  ],
})
export class AppModule {}
```

---

## Testing

### GraphQL Testing

1. Start the server:
```bash
npm run start:dev
```

2. Open GraphQL Playground:
```
http://localhost:3001/graphql
```

3. Add authentication header:
```json
{
  "Authorization": "Bearer <your-jwt-token>"
}
```

4. Run queries and mutations

### WebSocket Testing

```javascript
const socket = io('http://localhost:3001', {
  auth: { token: '<your-jwt-token>' }
});

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('connection:confirmed', (data) => {
  console.log('Connection confirmed:', data);
});
```

### Jobs Testing

```typescript
// Inject QueueManagerService in your test
await this.queueManager.addJob(
  JobType.MEDICATION_REMINDER,
  { test: true }
);

// Check job statistics
const stats = await this.queueManager.getQueueStats(
  JobType.MEDICATION_REMINDER
);
console.log('Queue stats:', stats);
```

---

## Performance

### GraphQL
- Automatic query result caching
- Pagination for large datasets
- Field-level resolution
- Schema introspection caching

### WebSocket
- Connection pooling
- Room-based message filtering
- Efficient event broadcasting
- Automatic reconnection

### Jobs
- 5 concurrent jobs per queue
- 100 jobs per minute rate limit
- Automatic cleanup (completed: 24h, failed: 7d)
- Redis-backed persistence

---

## Security

### GraphQL
- JWT authentication on all resolvers
- Input validation with class-validator
- Error sanitization (no stack traces in production)
- CORS configuration

### WebSocket
- JWT authentication on connection
- Room access based on organization
- Multi-tenant isolation
- Connection limits

### Jobs
- Queue isolation by job type
- Data validation before processing
- Graceful error handling
- Audit logging

---

## Future Enhancements

### GraphQL
- [ ] Add more entity resolvers (Medication, Appointment, Health Records)
- [ ] Implement GraphQL subscriptions for real-time updates
- [ ] Add DataLoader for batch loading and N+1 prevention
- [ ] Implement field-level RBAC permissions
- [ ] Add query complexity analysis

### WebSocket
- [ ] Add presence tracking
- [ ] Implement chat functionality
- [ ] Add message history
- [ ] Implement typing indicators

### Jobs
- [ ] Add report generation processor
- [ ] Add email queue processor
- [ ] Add SMS queue processor
- [ ] Implement job dashboard
- [ ] Add job performance metrics

---

## Documentation

- **GraphQL Schema:** Auto-generated at `src/schema.gql`
- **API Examples:** See `/docs` for Swagger documentation
- **Architecture Notes:** See `.temp/completed/architecture-notes-INF14S.md`
- **Implementation Summary:** See `.temp/completed/INFRASTRUCTURE_SERVICES_SUMMARY.md`

---

## Support

For issues or questions:
1. Check GraphQL Playground for schema documentation
2. Review error logs in console
3. Check queue statistics for job processing issues
4. Verify WebSocket connection in browser console

---

**Last Updated:** 2025-10-28
**Agent:** INF14S (Infrastructure Services)
