# Communications Module API Documentation

## Overview

The Communications module provides comprehensive messaging capabilities for the White Cross Healthcare Platform, enabling secure communication between nurses, parents, students, and staff members. All endpoints are HIPAA-compliant with full audit trail support.

**Base Path:** `/api/v1/communications` and `/v1/communication`

**Authentication:** All endpoints require JWT Bearer token authentication

**Total Endpoints:** 21 (12 Messages + 8 Broadcasts + 1 Bulk Messaging)

---

## Table of Contents

1. [Messages API](#messages-api) (12 endpoints)
2. [Broadcasts API](#broadcasts-api) (8 endpoints)
3. [Bulk Messaging API](#bulk-messaging-api) (1 endpoint)
4. [Data Models](#data-models)
5. [Common Patterns](#common-patterns)
6. [Error Handling](#error-handling)

---

## Messages API

### 1. List Messages
**GET** `/api/v1/communications/messages`

Retrieve paginated list of messages with filtering options.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20, max: 100) - Items per page
- `senderId` (UUID) - Filter by sender
- `recipientId` (UUID) - Filter by recipient
- `category` (enum) - EMERGENCY, HEALTH_UPDATE, APPOINTMENT_REMINDER, MEDICATION_REMINDER, GENERAL, INCIDENT_NOTIFICATION, COMPLIANCE
- `priority` (enum) - LOW, MEDIUM, HIGH, URGENT
- `status` (enum) - PENDING, SENT, DELIVERED, FAILED
- `dateFrom` (ISO date) - Start date filter
- `dateTo` (ISO date) - End date filter

**Response:** Paginated list of message objects with delivery summaries

**Use Cases:**
- View message history
- Search messages by criteria
- Generate compliance reports

---

### 2. Get Message by ID
**GET** `/api/v1/communications/messages/{id}`

Retrieve detailed information about a specific message.

**Path Parameters:**
- `id` (UUID) - Message unique identifier

**Response:** Complete message object including all delivery records

**Use Cases:**
- View message details
- Track delivery status
- Audit trail review

---

### 3. Send Message
**POST** `/api/v1/communications/messages`

Send a new message to specific recipients (max 100 per message).

**Request Body:**
```json
{
  "recipients": [
    {
      "type": "PARENT",
      "id": "uuid",
      "email": "parent@example.com",
      "phoneNumber": "+1234567890"
    }
  ],
  "channels": ["EMAIL", "SMS"],
  "subject": "Health Update",
  "content": "Your child visited the nurse today.",
  "priority": "MEDIUM",
  "category": "HEALTH_UPDATE",
  "scheduledAt": null,
  "templateId": "uuid (optional)",
  "attachments": []
}
```

**Validation Rules:**
- Max 100 recipients (use broadcasts for more)
- EMAIL channel requires `subject` field
- `scheduledAt` must be in the future (if provided)
- Content max length: 5000 characters
- Attachments: max 5 files, 10MB each

**Response:** Message object with initial delivery statuses

**Use Cases:**
- Send individual messages
- Schedule messages for future delivery
- Use templates for consistent messaging

---

### 4. Update Message
**PUT** `/api/v1/communications/messages/{id}`

Update a scheduled message before it is sent.

**Path Parameters:**
- `id` (UUID) - Message identifier

**Request Body:** Partial message object with fields to update

**Restrictions:**
- Only scheduled messages can be updated
- Only message sender can update
- Messages already sent cannot be modified

**Use Cases:**
- Edit draft messages
- Reschedule delivery time
- Update content before scheduled send

---

### 5. Delete Message
**DELETE** `/api/v1/communications/messages/{id}`

Cancel a scheduled message before sending.

**Path Parameters:**
- `id` (UUID) - Message identifier

**Restrictions:**
- Only scheduled messages can be deleted
- Only message sender can delete
- Historical records preserved for audit trail

**Use Cases:**
- Cancel scheduled messages
- Remove draft messages

---

### 6. Reply to Message
**POST** `/api/v1/communications/messages/{id}/reply`

Send a reply to an existing message.

**Path Parameters:**
- `id` (UUID) - Original message identifier

**Request Body:**
```json
{
  "content": "Reply message content",
  "channels": ["EMAIL"],
  "priority": "MEDIUM"
}
```

**Behavior:**
- Reply sent to original sender
- Subject automatically prefixed with "Re:"
- Category inherited from original message

**Use Cases:**
- Two-way communication
- Parent responses to nurse messages

---

### 7. Get Inbox
**GET** `/api/v1/communications/messages/inbox`

Retrieve messages received by the current user.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)

**Response:** Paginated list of received messages

**Use Cases:**
- View received messages
- Check message notifications
- Track unread messages

---

### 8. Get Sent Messages
**GET** `/api/v1/communications/messages/sent`

Retrieve messages sent by the current user.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)

**Response:** Paginated list of sent messages with delivery statistics

**Use Cases:**
- View sent message history
- Track delivery success rates
- Monitor message status

---

### 9. List Templates
**GET** `/api/v1/communications/templates`

Retrieve available message templates.

**Query Parameters:**
- `type` (enum) - EMAIL, SMS, PUSH_NOTIFICATION, VOICE
- `category` (enum) - Message category
- `isActive` (boolean, default: true) - Filter active templates

**Response:** Array of template objects

**Use Cases:**
- Quick message composition
- Standardized messaging
- Consistent communication

---

### 10. Create Template
**POST** `/api/v1/communications/templates`

Create a new message template.

**Request Body:**
```json
{
  "name": "Appointment Reminder",
  "subject": "Upcoming Appointment for {{studentName}}",
  "content": "Hello {{parentName}}, reminder that {{studentName}} has an appointment on {{date}}.",
  "type": "EMAIL",
  "category": "APPOINTMENT_REMINDER",
  "isActive": true
}
```

**Template Syntax:**
- Use `{{variableName}}` for variable substitution
- Variables automatically extracted from content
- Common variables: `{{studentName}}`, `{{parentName}}`, `{{date}}`, `{{time}}`

**Permissions:** Requires NURSE or ADMIN role

**Use Cases:**
- Create reusable message templates
- Standardize communication
- Support multiple languages

---

### 11. Get Delivery Status
**GET** `/api/v1/communications/delivery-status/{messageId}`

Retrieve detailed delivery status for a message.

**Path Parameters:**
- `messageId` (UUID) - Message identifier

**Response:**
```json
{
  "deliveries": [
    {
      "recipientId": "uuid",
      "channel": "EMAIL",
      "status": "DELIVERED",
      "sentAt": "2025-10-23T10:30:15Z",
      "deliveredAt": "2025-10-23T10:31:22Z",
      "failureReason": null,
      "externalId": "sendgrid-abc123"
    }
  ],
  "summary": {
    "total": 5,
    "delivered": 4,
    "failed": 1,
    "pending": 0
  }
}
```

**Delivery Statuses:**
- `PENDING` - Queued for delivery
- `SENT` - Sent to external provider
- `DELIVERED` - Confirmed delivery
- `FAILED` - Delivery failed
- `BOUNCED` - Email bounced

**Use Cases:**
- Monitor message delivery
- Troubleshoot delivery issues
- Compliance reporting

---

### 12. Get Statistics
**GET** `/api/v1/communications/statistics`

Retrieve aggregated communication statistics.

**Query Parameters:**
- `dateFrom` (ISO date) - Start date
- `dateTo` (ISO date) - End date
- `senderId` (UUID) - Filter by sender

**Response:**
```json
{
  "stats": {
    "totalMessages": 1234,
    "byCategory": {
      "HEALTH_UPDATE": 456,
      "EMERGENCY": 12
    },
    "byPriority": {
      "LOW": 234,
      "HIGH": 198
    },
    "byChannel": {
      "EMAIL": 987,
      "SMS": 654
    },
    "deliveryStatus": {
      "DELIVERED": 1012,
      "FAILED": 32
    }
  }
}
```

**Privacy:** No PHI exposed - aggregated data only

**Use Cases:**
- Dashboard analytics
- Compliance reports
- System monitoring

---

## Broadcasts API

### 1. Create Broadcast
**POST** `/api/v1/communications/broadcasts`

Send broadcast message to targeted audience groups.

**Request Body:**
```json
{
  "audience": {
    "grades": ["9", "10", "11", "12"],
    "includeParents": true,
    "includeEmergencyContacts": false
  },
  "channels": ["EMAIL", "SMS", "PUSH_NOTIFICATION"],
  "subject": "Health Alert: Flu Season",
  "content": "Flu season is here. Please ensure your child receives vaccination.",
  "priority": "HIGH",
  "category": "HEALTH_UPDATE",
  "scheduledAt": null
}
```

**Audience Targeting Options:**
- `grades` - Filter by grade levels (K, 1-12)
- `nurseIds` - Filter by assigned nurse IDs
- `studentIds` - Specific student IDs (max 1000)
- `schoolIds` - Filter by school IDs
- `includeParents` - Include student parents/guardians
- `includeEmergencyContacts` - Include emergency contacts

**Broadcast Limits:**
- Maximum 5000 recipients per broadcast
- Emergency category requires URGENT priority

**Use Cases:**
- Emergency alerts
- School-wide announcements
- Health updates for specific grades

---

### 2. List Broadcasts
**GET** `/api/v1/communications/broadcasts`

Retrieve paginated list of broadcast messages.

**Query Parameters:**
- `page`, `limit` - Pagination
- `category`, `priority` - Filters
- `dateFrom`, `dateTo` - Date range

**Response:** Paginated list of broadcast messages with recipient counts

**Use Cases:**
- Broadcast history
- Compliance reporting

---

### 3. Get Broadcast by ID
**GET** `/api/v1/communications/broadcasts/{id}`

Retrieve detailed broadcast information.

**Path Parameters:**
- `id` (UUID) - Broadcast identifier

**Response:** Complete broadcast object with audience criteria and delivery summary

---

### 4. Cancel Broadcast
**POST** `/api/v1/communications/broadcasts/{id}/cancel`

Cancel a scheduled broadcast before sending.

**Restrictions:**
- Only scheduled broadcasts can be cancelled
- Only broadcast sender can cancel
- Cannot cancel broadcasts already sent

---

### 5. Get Broadcast Recipients
**GET** `/api/v1/communications/broadcasts/{id}/recipients`

Retrieve paginated list of broadcast recipients with delivery status.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 50, max: 100)

**Response:** Paginated list of recipients with per-channel delivery status

**Use Cases:**
- Delivery verification
- Troubleshooting failed deliveries

---

### 6. Get Delivery Report
**GET** `/api/v1/communications/broadcasts/{id}/delivery-report`

Retrieve comprehensive delivery report for a broadcast.

**Response:**
```json
{
  "report": {
    "summary": {
      "total": 342,
      "delivered": 328,
      "failed": 14
    },
    "byChannel": {
      "EMAIL": { "total": 342, "delivered": 330, "failed": 12 },
      "SMS": { "total": 342, "delivered": 326, "failed": 16 }
    },
    "byRecipientType": {
      "PARENT": { "total": 342, "delivered": 328, "failed": 14 }
    }
  }
}
```

**Use Cases:**
- Compliance reporting
- Delivery verification
- System monitoring

---

### 7. Schedule Message
**POST** `/api/v1/communications/scheduled`

Schedule a message for future delivery.

**Request Body:**
```json
{
  "subject": "Monthly Newsletter",
  "body": "Dear parents, here is your October newsletter...",
  "recipientType": "ALL_PARENTS",
  "channels": ["EMAIL", "PORTAL"],
  "scheduledFor": "2025-10-25T08:00:00Z",
  "timezone": "America/New_York",
  "priority": "NORMAL",
  "throttle": {
    "maxPerMinute": 100,
    "maxPerHour": 1000
  }
}
```

**Features:**
- Advanced recipient targeting
- Rate limiting/throttling
- Template substitution
- Timezone-aware scheduling

**Use Cases:**
- Planned communications
- Reminder campaigns
- Scheduled newsletters

---

### 8. List Scheduled Messages
**GET** `/api/v1/communications/scheduled`

Retrieve list of scheduled messages.

**Query Parameters:**
- `status` - PENDING, PROCESSING, SENT, FAILED, CANCELLED, PAUSED
- `scheduleType` - ONE_TIME, RECURRING, CAMPAIGN
- `campaignId` - Campaign filter
- `startDate`, `endDate` - Date range

**Use Cases:**
- Manage message queue
- Monitor scheduled communications

---

## Bulk Messaging API

### 1. Send Bulk Message
**POST** `/v1/communication/bulk-message`

Send bulk message to up to 1000 recipients per batch.

**Request Body:**
```json
{
  "recipients": [
    {
      "id": "parent-uuid",
      "type": "parent",
      "contactMethod": "email",
      "language": "en"
    }
  ],
  "message": {
    "subject": "School Closure Notice",
    "body": "Due to weather, school closed tomorrow.",
    "htmlBody": "<p><strong>School closed tomorrow</strong></p>",
    "attachments": []
  },
  "messageType": "general",
  "priority": "high",
  "channels": ["email", "sms", "app"],
  "scheduledTime": null,
  "deliveryOptions": {
    "sendImmediately": true,
    "retryAttempts": 3,
    "batchSize": 50,
    "throttleDelay": 0
  },
  "trackingOptions": {
    "trackOpens": true,
    "trackClicks": true,
    "trackReplies": true
  },
  "compliance": {
    "ferpaCompliant": true,
    "hipaaCompliant": false,
    "retentionPeriod": 365,
    "auditTrail": true
  }
}
```

**Message Types:**
- general, emergency, health-alert, attendance, academic
- behavior, event, reminder, newsletter, administrative

**Recipient Limits:**
- Max 1000 recipients per batch
- Larger sends split into multiple batches

**Attachment Limits:**
- Max 5 files
- 25MB per file

**Compliance:**
- FERPA compliant by default
- HIPAA required for health-alert type
- Configurable retention periods
- Full audit trail

**Use Cases:**
- School-wide announcements
- Newsletter distribution
- Emergency notifications
- Event reminders

---

## Data Models

### Message Object
```typescript
{
  id: string (UUID)
  senderId: string (UUID)
  senderName: string
  subject: string | null
  content: string
  category: MessageCategory
  priority: MessagePriority
  channels: MessageChannel[]
  recipientCount: number
  templateId: string (UUID) | null
  deliverySummary: {
    total: number
    pending: number
    sent: number
    delivered: number
    failed: number
    bounced: number
  }
  scheduledAt: Date | null
  createdAt: Date
  updatedAt: Date
}
```

### Delivery Status Object
```typescript
{
  id: string (UUID)
  messageId: string (UUID)
  recipientId: string (UUID)
  recipientType: RecipientType
  channel: MessageChannel
  recipientContact: string
  status: DeliveryStatus
  sentAt: Date | null
  deliveredAt: Date | null
  failureReason: string | null
  externalId: string | null
  createdAt: Date
  updatedAt: Date
}
```

### Template Object
```typescript
{
  id: string (UUID)
  name: string
  subject: string | null
  content: string
  type: MessageChannel
  category: MessageCategory
  variables: string[]
  isActive: boolean
  createdBy: string (UUID)
  createdAt: Date
  updatedAt: Date
}
```

---

## Common Patterns

### Pagination
All list endpoints support pagination:
```
?page=1&limit=20
```

Response includes pagination metadata:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "pages": 8
  }
}
```

### Date Filtering
Use ISO 8601 format for date filters:
```
?dateFrom=2025-10-01T00:00:00Z&dateTo=2025-10-23T23:59:59Z
```

### Authentication
All endpoints require JWT Bearer token:
```
Authorization: Bearer <your-token-here>
```

### Rate Limiting
- Authenticated users: 100 requests per minute
- Unauthenticated requests: 20 requests per minute

---

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": []
  }
}
```

### Common HTTP Status Codes

**200 OK** - Successful GET/PUT/DELETE request
**201 Created** - Successful POST request creating resource
**400 Bad Request** - Validation error or invalid data
**401 Unauthorized** - Missing or invalid JWT token
**403 Forbidden** - Insufficient permissions
**404 Not Found** - Resource not found
**500 Internal Server Error** - Server processing error

### Common Error Codes

**VALIDATION_ERROR** - Request validation failed
**MESSAGE_NOT_FOUND** - Message ID doesn't exist
**MESSAGE_ALREADY_SENT** - Cannot modify sent message
**UNAUTHORIZED** - Authentication required
**INSUFFICIENT_PERMISSIONS** - User lacks required permissions
**RECIPIENT_LIMIT_EXCEEDED** - Too many recipients
**INTERNAL_SERVER_ERROR** - Server processing error

---

## HIPAA Compliance Notes

All communications endpoints handling Protected Health Information (PHI) implement:

1. **Encryption:** Data encrypted at rest and in transit
2. **Access Control:** Role-based permissions enforced
3. **Audit Trail:** All PHI access logged with user, timestamp, action
4. **Data Retention:** Configurable retention policies (default 365 days)
5. **Delivery Tracking:** Complete delivery chain documented
6. **Content Validation:** PHI content automatically flagged and secured

**PHI Protected Endpoints** are marked in endpoint descriptions.

---

## Support

For API support, contact: support@whitecrosshealthcare.com

For Swagger/OpenAPI documentation, visit: `/documentation` endpoint
