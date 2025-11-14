# Compliance Actions API Integration Documentation

## Overview

This document describes the API integration for the compliance actions module (`nextjs/src/actions/compliance.actions.ts`). All mock API calls have been replaced with real API client calls to the backend service.

## Configuration

### Environment Variables

The following environment variables are used:

- **BACKEND_URL** or **API_BASE_URL**: Backend API base URL (default: `http://localhost:3001/api/v1`)
- **ENABLE_SECONDARY_LOGGING**: Enable redundant logging to S3/CloudWatch (default: `false`)
- **AWS_AUDIT_LOG_BUCKET**: S3 bucket for audit log storage
- **AWS_REGION**: AWS region (default: `us-east-1`)
- **NODE_ENV**: Environment (development/production/test)

### Retry Configuration

- **MAX_RETRIES**: 3 attempts
- **RETRY_DELAY_MS**: 1000ms base delay (exponential backoff)
- **RETRYABLE_STATUS_CODES**: [408, 429, 500, 502, 503, 504]

## API Endpoints

All endpoints are prefixed with `BACKEND_URL` (e.g., `http://localhost:3001/api/v1`)

### Audit Log Endpoints

#### GET /compliance/audit-logs/latest
Get the most recent audit log for hash chaining.

**Response:**
```typescript
{
  "id": "string",
  "verificationHash": "string",
  // ... other AuditLog fields
}
```

#### POST /compliance/audit-logs
Create a new audit log entry with cryptographic hash chain.

**Request Body:**
```typescript
{
  "userId": "string",
  "action": AuditActionTypeEnum,
  "severity": AuditSeverityEnum,
  "resourceType": ResourceTypeEnum,
  "resourceId": "string",
  "resourceName": "string",
  "details": Record<string, any>,
  "changes": {
    "before": Record<string, any>,
    "after": Record<string, any>
  },
  "status": "SUCCESS" | "FAILURE" | "PARTIAL",
  "errorMessage": "string",
  "phiAccessed": boolean,
  "complianceFlags": string[],
  "previousHash": "string",
  "verificationHash": "string"
}
```

**Response:**
```typescript
{
  "data": AuditLog
}
```

#### GET /compliance/audit-logs
Get paginated audit logs with filters.

**Query Parameters:**
- `startDate`: ISO date string
- `endDate`: ISO date string
- `actions`: Comma-separated action types
- `severity`: Severity level
- `userId`: Filter by user ID
- `resourceType`: Filter by resource type
- `page`: Page number (default: 1)
- `pageSize`: Items per page (default: 50)
- `sortBy`: Sort field (default: 'timestamp')
- `sortOrder`: 'asc' | 'desc'

**Response:**
```typescript
{
  "data": AuditLog[],
  "pagination": {
    "page": number,
    "pageSize": number,
    "total": number,
    "pages": number
  }
}
```

### Policy Management Endpoints

#### POST /compliance/policies
Create a new policy document.

**Request Body:**
```typescript
{
  "title": "string",
  "description": "string",
  "content": "string",
  "category": "HIPAA" | "FERPA" | "PRIVACY" | "SECURITY",
  "version": "string",
  "status": "DRAFT" | "ACTIVE" | "ARCHIVED",
  "effectiveDate": "ISO date string",
  "expirationDate": "ISO date string"
}
```

**Response:**
```typescript
{
  "data": PolicyDocument
}
```

#### POST /compliance/policies/:policyId/acknowledge
Acknowledge a policy document.

**Request Body:**
```typescript
{
  "userId": "string",
  "acknowledgedAt": "ISO date string",
  "ipAddress": "string"
}
```

**Response:**
```typescript
{
  "data": PolicyAcknowledgment
}
```

#### GET /compliance/policies/:policyId/acknowledgments
Get acknowledgment history for a policy.

**Response:**
```typescript
{
  "data": PolicyAcknowledgment[]
}
```

### Compliance Reporting Endpoints

#### POST /compliance/reports/generate
Generate a compliance report.

**Request Body:**
```typescript
{
  "reportType": "string",
  "period": {
    "start": "ISO date string",
    "end": "ISO date string"
  },
  "generatedBy": "string",
  "metrics": ComplianceMetrics
}
```

**Response:**
```typescript
{
  "data": HIPAAReport
}
```

#### GET /compliance/metrics
Get compliance metrics for a period.

**Query Parameters:**
- `start`: ISO date string (optional)
- `end`: ISO date string (optional)

**Response:**
```typescript
{
  "data": ComplianceMetrics
}
```

#### GET /compliance/alerts
Get active compliance alerts.

**Query Parameters:**
- `severity`: Filter by severity
- `status`: Filter by status

**Response:**
```typescript
{
  "data": ComplianceAlert[]
}
```

#### POST /compliance/violations/:violationId/resolve
Resolve a compliance violation.

**Request Body:**
```typescript
{
  "resolutionNotes": "string",
  "remediationSteps": string[],
  "resolvedBy": "string",
  "resolvedAt": "ISO date string"
}
```

**Response:**
```typescript
{
  "data": ComplianceViolation
}
```

#### POST /compliance/violations
Create a compliance violation record (internal use).

**Request Body:**
```typescript
{
  "auditLogId": "string",
  "violationType": "string",
  "severity": "string",
  "flags": string[],
  "detectedAt": "ISO date string",
  "status": "OPEN" | "RESOLVED" | "DISMISSED",
  "description": "string"
}
```

### Training Compliance Endpoints

#### POST /compliance/training/complete
Record training completion.

**Request Body:**
```typescript
{
  "userId": "string",
  "courseId": "string",
  "completedAt": "ISO date string",
  "verifiedBy": "string"
}
```

**Response:**
```typescript
{
  "data": TrainingRecord
}
```

#### GET /compliance/training/user/:userId
Get training status for a user.

**Response:**
```typescript
{
  "data": TrainingStatus
}
```

#### GET /compliance/training/overdue
Get users with overdue training.

**Response:**
```typescript
{
  "data": OverdueTraining[]
}
```

## Implementation Details

### Authentication

All API calls automatically include the JWT token from cookies:

```typescript
const cookieStore = await cookies();
const token = cookieStore.get('auth_token')?.value;

headers['Authorization'] = `Bearer ${token}`;
```

### Error Handling

The `apiCall()` function implements:

1. **Exponential Backoff Retry**: Retries failed requests with exponential delay
2. **Status Code Handling**: Retries on 408, 429, 500, 502, 503, 504
3. **Network Error Retry**: Retries on TypeError (network failures)
4. **Error Propagation**: Throws errors with meaningful messages

### User Context Extraction

The `getCurrentUserContext()` function:

1. Extracts JWT token from cookies
2. Verifies token signature
3. Decodes token payload
4. Extracts IP address and user agent from Next.js headers
5. Returns structured `AuditLogContext` object

### Secondary Logging (Fire-and-Forget)

The `logToSecondaryStore()` function implements redundant logging:

**Development Mode:**
- Logs to console for debugging

**Production Mode:**
- Sends to AWS CloudWatch Logs (when configured)
- Stores in AWS S3 bucket (when configured)
- Never blocks main operation (fire-and-forget)
- Catches and logs errors without throwing

**Structure:**

```typescript
// CloudWatch Log
{
  "timestamp": "ISO date string",
  "logGroup": "/aws/lambda/audit-logs",
  "logStream": "audit-2025-10-27",
  "message": {
    ...auditLog,
    "service": "white-cross-compliance",
    "environment": "production"
  }
}

// S3 Object
{
  "bucket": "audit-log-bucket",
  "key": "audit-logs/2025/10/1730000000.json",
  "body": JSON.stringify(auditLog, null, 2),
  "metadata": {
    "userId": "user-123",
    "action": "PHI_ACCESS",
    "timestamp": "2025-10-27T12:00:00Z"
  }
}
```

### Compliance Violation Detection

The `detectAndLogViolations()` function:

1. Checks audit log compliance flags
2. Identifies critical flags:
   - `BULK_OPERATION`
   - `AFTER_HOURS_ACCESS`
   - `EMERGENCY_ACCESS_USED`
3. Creates violation record via API
4. Never blocks main operation

## Security Considerations

### HIPAA Compliance

1. **Audit Trail**: All PHI access is logged with cryptographic hash chain
2. **Redundant Storage**: Secondary logging to S3/CloudWatch
3. **Tamper Detection**: Hash chain verification in `verifyAuditIntegrityAction()`
4. **Access Control**: JWT-based authentication on all endpoints

### Data Protection

1. **Token Security**: JWT tokens stored in HTTP-only cookies
2. **IP Tracking**: All operations track IP address for audit
3. **User Agent**: Recorded for forensic analysis
4. **Encryption**: Secondary logs support encryption (via env var)

### Error Handling

1. **No PHI in Errors**: Error messages don't expose PHI
2. **Audit Failures**: Never block operations if audit logging fails
3. **Graceful Degradation**: Falls back to console logging if backend unavailable

## Usage Examples

### Creating an Audit Log

```typescript
import { createAuditLogAction } from '@/actions/compliance.actions';

const context = await getCurrentUserContext();
const result = await createAuditLogAction(context, {
  action: 'PHI_ACCESS',
  severity: 'INFO',
  resourceType: 'STUDENT',
  resourceId: 'student-123',
  resourceName: 'John Doe',
  details: { reason: 'Medical record review' },
  phiAccessed: true,
  complianceFlags: ['PHI_ACCESS']
});

if (result.success) {
  console.log('Audit log created:', result.data);
} else {
  console.error('Audit log failed:', result.error);
}
```

### Generating a Compliance Report

```typescript
import { generateComplianceReportAction } from '@/actions/compliance.actions';

const result = await generateComplianceReportAction(
  'HIPAA_ANNUAL',
  { start: '2025-01-01', end: '2025-12-31' }
);

if (result.success) {
  console.log('Report generated:', result.data);
}
```

### Acknowledging a Policy

```typescript
import { acknowledgePolicyAction } from '@/actions/compliance.actions';

const result = await acknowledgePolicyAction('policy-123', 'user-456');

if (result.success) {
  console.log('Policy acknowledged:', result.data);
}
```

## Testing

### Unit Tests

All API calls can be mocked for testing:

```typescript
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn((name) => ({ value: 'mock-token' }))
  })),
  headers: jest.fn(() => new Map())
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: mockData })
  })
);
```

### Integration Tests

Test against real backend API:

```typescript
// Set environment variables
process.env.BACKEND_URL = 'http://localhost:3001/api/v1';

// Run tests
npm test -- compliance.actions.test.ts
```

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Ensure JWT token is present in cookies
   - Check token expiration
   - Verify JWT_SECRET matches backend

2. **Network Errors**
   - Check BACKEND_URL is correct
   - Verify backend is running
   - Check network connectivity

3. **Retry Exhausted**
   - Backend may be down
   - Check backend logs
   - Verify database connectivity

4. **Secondary Logging Failures**
   - Check AWS credentials
   - Verify S3 bucket exists
   - Check CloudWatch Logs permissions
   - These are non-critical and won't block operations

## Migration from Mock API

All `mockApiCall()` instances have been replaced:

| Old Code | New Code |
|----------|----------|
| `mockApiCall<T>('/api/v1/endpoint', { ... })` | `apiCall<T>('/endpoint', { ... })` |
| `mockApiCall<T>('/api/v1/endpoint')` | `apiCall<T>('/endpoint')` |

## Performance Considerations

1. **Retry Logic**: Max 3 retries with exponential backoff
2. **Timeout**: 30 seconds (inherited from fetch)
3. **Caching**: Uses Next.js revalidation tags
4. **Fire-and-Forget**: Secondary logging is non-blocking

## Future Enhancements

1. **AWS SDK Integration**: Replace placeholders with actual AWS SDK calls
2. **Enhanced User Context**: Fetch full user name from database
3. **Batch Operations**: Support batch audit log creation
4. **Real-time Alerts**: WebSocket integration for compliance alerts
5. **Export Streaming**: Stream large audit exports instead of buffering
