# Queue Monitoring API Endpoints

This document describes the new API endpoints added to the Enhanced Message Controller for monitoring and managing the message queue system.

## Overview

These endpoints allow you to:
- Monitor queue health and metrics
- View failed jobs
- Retry failed jobs
- Track message delivery status

All endpoints are prefixed with `/api/messages/` and require JWT authentication.

---

## Endpoints

### 1. Get Queue Metrics

**GET** `/api/messages/queue/metrics`

Retrieves comprehensive metrics for all message queues.

#### Request

```http
GET /api/messages/queue/metrics HTTP/1.1
Host: localhost:3001
Authorization: Bearer <jwt_token>
```

#### Response

**Status Code:** `200 OK`

```json
{
  "MESSAGE_DELIVERY": {
    "waiting": 45,
    "active": 3,
    "completed": 1234,
    "failed": 5,
    "delayed": 0,
    "paused": 0
  },
  "MESSAGE_NOTIFICATION": {
    "waiting": 12,
    "active": 8,
    "completed": 890,
    "failed": 2,
    "delayed": 0,
    "paused": 0
  },
  "MESSAGE_ENCRYPTION": {
    "waiting": 0,
    "active": 2,
    "completed": 567,
    "failed": 1,
    "delayed": 0,
    "paused": 0
  },
  "MESSAGE_INDEXING": {
    "waiting": 23,
    "active": 1,
    "completed": 445,
    "failed": 3,
    "delayed": 0,
    "paused": 0
  },
  "BATCH_MESSAGE_SENDING": {
    "waiting": 2,
    "active": 0,
    "completed": 34,
    "failed": 0,
    "delayed": 0,
    "paused": 0
  },
  "MESSAGE_CLEANUP": {
    "waiting": 0,
    "active": 0,
    "completed": 12,
    "failed": 0,
    "delayed": 0,
    "paused": 0
  }
}
```

#### Fields Explanation

- `waiting`: Number of jobs in the queue waiting to be processed
- `active`: Number of jobs currently being processed
- `completed`: Total number of successfully completed jobs
- `failed`: Number of jobs that failed after all retry attempts
- `delayed`: Number of jobs scheduled for future execution
- `paused`: Number of jobs in paused state

#### Use Cases

- Dashboard overview of queue health
- Monitoring queue backlog
- Alerting on failed jobs
- Performance tracking

---

### 2. Get Queue Health

**GET** `/api/messages/queue/:queueName/health`

Retrieves detailed health information for a specific queue.

#### Parameters

- `queueName` (path parameter): Name of the queue to check
  - Valid values: `MESSAGE_DELIVERY`, `MESSAGE_NOTIFICATION`, `MESSAGE_ENCRYPTION`, `MESSAGE_INDEXING`, `BATCH_MESSAGE_SENDING`, `MESSAGE_CLEANUP`

#### Request

```http
GET /api/messages/queue/MESSAGE_DELIVERY/health HTTP/1.1
Host: localhost:3001
Authorization: Bearer <jwt_token>
```

#### Response

**Status Code:** `200 OK`

```json
{
  "queueName": "MESSAGE_DELIVERY",
  "healthy": true,
  "metrics": {
    "waiting": 45,
    "active": 3,
    "completed": 1234,
    "failed": 5,
    "delayed": 0,
    "paused": 0
  },
  "processingRate": {
    "perMinute": 42.5,
    "perHour": 2550
  },
  "failureRate": 0.004,
  "averageProcessingTime": 850,
  "lastChecked": "2025-10-29T22:30:45.123Z"
}
```

#### Fields Explanation

- `healthy`: Boolean indicating overall queue health
- `metrics`: Current queue counts (same as metrics endpoint)
- `processingRate`: Messages processed per unit time
- `failureRate`: Ratio of failed jobs to total jobs (0-1)
- `averageProcessingTime`: Average job duration in milliseconds
- `lastChecked`: ISO timestamp of health check

#### Health Criteria

A queue is considered healthy when:
- Failure rate < 5%
- Active jobs > 0 (queue is processing)
- No paused jobs
- Waiting jobs < 1000 (no excessive backlog)

#### Use Cases

- Real-time queue monitoring
- Automated health checks
- Performance optimization
- Capacity planning

---

### 3. Get Failed Jobs

**GET** `/api/messages/queue/:queueName/failed?limit=50`

Retrieves a list of failed jobs for a specific queue.

#### Parameters

- `queueName` (path parameter): Name of the queue
- `limit` (query parameter, optional): Maximum number of failed jobs to return
  - Default: `50`
  - Max: `500`

#### Request

```http
GET /api/messages/queue/MESSAGE_DELIVERY/failed?limit=10 HTTP/1.1
Host: localhost:3001
Authorization: Bearer <jwt_token>
```

#### Response

**Status Code:** `200 OK`

```json
{
  "queueName": "MESSAGE_DELIVERY",
  "failedCount": 5,
  "jobs": [
    {
      "id": "12345",
      "name": "send-message",
      "data": {
        "messageId": "msg-abc-123",
        "senderId": "user-456",
        "recipientId": "user-789",
        "content": "Hello, how are you?",
        "conversationId": "conv-xyz-001",
        "requiresEncryption": true
      },
      "failedReason": "Connection timeout to WebSocket service",
      "attemptsMade": 5,
      "stackTrace": "Error: Connection timeout...",
      "timestamp": "2025-10-29T22:15:30.456Z",
      "finishedOn": "2025-10-29T22:15:35.789Z"
    },
    {
      "id": "12346",
      "name": "send-message",
      "data": {
        "messageId": "msg-def-456",
        "senderId": "user-111",
        "recipientId": "user-222",
        "content": "Meeting at 3pm",
        "conversationId": "conv-abc-002",
        "requiresEncryption": false
      },
      "failedReason": "Recipient not found",
      "attemptsMade": 3,
      "stackTrace": "Error: Recipient not found...",
      "timestamp": "2025-10-29T22:10:12.345Z",
      "finishedOn": "2025-10-29T22:10:18.678Z"
    }
  ]
}
```

#### Fields Explanation

- `failedCount`: Total number of failed jobs in the queue
- `jobs`: Array of failed job details
  - `id`: Unique job identifier
  - `name`: Job processor name
  - `data`: Original job data
  - `failedReason`: Error message explaining the failure
  - `attemptsMade`: Number of retry attempts made
  - `stackTrace`: Full error stack trace
  - `timestamp`: When the job was created
  - `finishedOn`: When the job failed permanently

#### Use Cases

- Debugging failed message deliveries
- Identifying systematic errors
- Manual intervention on failed jobs
- Error pattern analysis

---

### 4. Retry Failed Job

**POST** `/api/messages/queue/:queueName/failed/:jobId/retry`

Attempts to retry a specific failed job.

#### Parameters

- `queueName` (path parameter): Name of the queue
- `jobId` (path parameter): ID of the failed job to retry

#### Request

```http
POST /api/messages/queue/MESSAGE_DELIVERY/failed/12345/retry HTTP/1.1
Host: localhost:3001
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "Job 12345 queued for retry",
  "newJobId": "12347",
  "retryTimestamp": "2025-10-29T22:35:00.123Z"
}
```

#### Error Response

**Status Code:** `404 Not Found`

```json
{
  "statusCode": 404,
  "message": "Job 12345 not found in MESSAGE_DELIVERY queue",
  "error": "Not Found"
}
```

**Status Code:** `400 Bad Request`

```json
{
  "statusCode": 400,
  "message": "Job 12345 is not in failed state",
  "error": "Bad Request"
}
```

#### Use Cases

- Manual recovery from transient failures
- Retrying after fixing underlying issues
- Testing job processing after code updates

---

## Integration Examples

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/messages';
const authToken = 'your-jwt-token';

// Get all queue metrics
async function getQueueMetrics() {
  const response = await axios.get(`${API_BASE_URL}/queue/metrics`, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  return response.data;
}

// Get health of specific queue
async function getQueueHealth(queueName: string) {
  const response = await axios.get(`${API_BASE_URL}/queue/${queueName}/health`, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  return response.data;
}

// Get failed jobs
async function getFailedJobs(queueName: string, limit: number = 50) {
  const response = await axios.get(
    `${API_BASE_URL}/queue/${queueName}/failed?limit=${limit}`,
    { headers: { Authorization: `Bearer ${authToken}` } }
  );
  return response.data;
}

// Retry a failed job
async function retryFailedJob(queueName: string, jobId: string) {
  const response = await axios.post(
    `${API_BASE_URL}/queue/${queueName}/failed/${jobId}/retry`,
    {},
    { headers: { Authorization: `Bearer ${authToken}` } }
  );
  return response.data;
}

// Example: Monitor queue and retry failed jobs
async function monitorAndRetryFailedJobs() {
  // Get metrics
  const metrics = await getQueueMetrics();

  // Check each queue
  for (const [queueName, queueMetrics] of Object.entries(metrics)) {
    if (queueMetrics.failed > 0) {
      console.log(`Queue ${queueName} has ${queueMetrics.failed} failed jobs`);

      // Get failed jobs
      const failedJobs = await getFailedJobs(queueName);

      // Retry jobs with transient errors
      for (const job of failedJobs.jobs) {
        if (job.failedReason.includes('timeout') ||
            job.failedReason.includes('ECONNREFUSED')) {
          console.log(`Retrying job ${job.id}...`);
          await retryFailedJob(queueName, job.id);
        }
      }
    }
  }
}
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';
import axios from 'axios';

export function useQueueMetrics(refreshInterval: number = 5000) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('/api/messages/queue/metrics', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setMetrics(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { metrics, loading, error };
}
```

---

## Monitoring Best Practices

### 1. Regular Health Checks

Poll the `/queue/metrics` endpoint every 30-60 seconds to monitor overall queue health.

```typescript
setInterval(async () => {
  const metrics = await getQueueMetrics();

  // Alert if any queue has too many failed jobs
  Object.entries(metrics).forEach(([queueName, stats]) => {
    if (stats.failed > 10) {
      alertOps(`Queue ${queueName} has ${stats.failed} failed jobs`);
    }
  });
}, 30000);
```

### 2. Failed Job Processing

Check failed jobs daily and categorize by error type:

```typescript
const failedJobs = await getFailedJobs('MESSAGE_DELIVERY', 100);

const errorCategories = {
  transient: [], // Timeout, connection errors
  permanent: [], // Recipient not found, invalid data
  unknown: []
};

failedJobs.jobs.forEach(job => {
  if (job.failedReason.match(/timeout|ECONNREFUSED|ETIMEDOUT/i)) {
    errorCategories.transient.push(job);
  } else if (job.failedReason.match(/not found|invalid|forbidden/i)) {
    errorCategories.permanent.push(job);
  } else {
    errorCategories.unknown.push(job);
  }
});

// Auto-retry transient errors
for (const job of errorCategories.transient) {
  await retryFailedJob('MESSAGE_DELIVERY', job.id);
}
```

### 3. Performance Monitoring

Track processing rates to identify bottlenecks:

```typescript
const health = await getQueueHealth('MESSAGE_DELIVERY');

if (health.processingRate.perMinute < 10) {
  console.warn('MESSAGE_DELIVERY queue processing slowly');
  // Consider scaling workers or investigating performance issues
}

if (health.failureRate > 0.05) {
  console.error('MESSAGE_DELIVERY has high failure rate');
  // Investigate common failure reasons
}
```

---

## Security Considerations

1. **Authentication Required**: All endpoints require valid JWT authentication
2. **Authorization**: Users should only access queue information for their organization/tenant
3. **Rate Limiting**: Apply rate limits to prevent abuse of retry endpoint
4. **Sensitive Data**: Failed job data may contain sensitive information - log access appropriately
5. **Admin Only**: Consider restricting queue management endpoints to admin users

---

## Queue Names Reference

| Queue Name | Purpose | Typical Volume |
|-----------|---------|----------------|
| `MESSAGE_DELIVERY` | Real-time message delivery via WebSocket | High |
| `MESSAGE_NOTIFICATION` | Push notifications and email alerts | High |
| `MESSAGE_ENCRYPTION` | E2E encryption/decryption operations | Medium |
| `MESSAGE_INDEXING` | Search index updates | Medium |
| `BATCH_MESSAGE_SENDING` | Bulk message operations | Low |
| `MESSAGE_CLEANUP` | Maintenance and cleanup tasks | Very Low |

---

## Troubleshooting

### High Failed Job Count

**Symptoms**: `/queue/metrics` shows high `failed` count for a queue

**Solutions**:
1. Check `/queue/:queueName/failed` to see error messages
2. Look for patterns in `failedReason` field
3. Check if external services (WebSocket, database) are healthy
4. Review recent code deployments that might have introduced bugs
5. Retry transient errors using `/queue/:queueName/failed/:jobId/retry`

### Queue Processing Slowly

**Symptoms**: `waiting` count growing, `processingRate` low

**Solutions**:
1. Check queue health: `/queue/:queueName/health`
2. Verify Redis connection is healthy
3. Check server CPU/memory usage
4. Consider scaling queue workers (increase concurrency)
5. Look for slow job processing (check `averageProcessingTime`)

### Jobs Stuck in Active State

**Symptoms**: High `active` count that doesn't decrease

**Solutions**:
1. Check for hung job processors
2. Restart queue workers
3. Review job timeout settings in queue configuration
4. Check for deadlocks or infinite loops in processor code

---

## Related Documentation

- [Message Queue Architecture](./MESSAGE_QUEUE_ARCHITECTURE.md)
- [Queue Configuration Guide](./QUEUE_CONFIGURATION.md)
- [Enhanced Message Service API](./ENHANCED_MESSAGE_API.md)
- [WebSocket Integration](../infrastructure/websocket/README.md)
- [Encryption Service](../infrastructure/encryption/README.md)
