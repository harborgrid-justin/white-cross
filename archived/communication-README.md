# Communication Module - NestJS Implementation

## Overview

The Communication Module provides comprehensive multi-channel messaging capabilities for the White Cross system. This module has been migrated from the legacy backend to NestJS following best practices and modern architecture patterns.

## Features

### 1. Message Templates
- Create, read, update, and delete message templates
- Support for variables in templates
- Template categorization by type and category
- Active/inactive status management

### 2. Direct Messaging
- Send messages to specific recipients
- Multi-channel delivery (Email, SMS, Push, Voice)
- Support for attachments
- Scheduled message delivery
- Multi-language support with translation
- Priority levels (LOW, NORMAL, HIGH, URGENT)

### 3. Broadcast Messaging
- Target audiences by grades, nurse IDs, or student IDs
- Include parents and emergency contacts
- Bulk message delivery with recipient limits
- Category-based messaging (appointments, emergencies, etc.)

### 4. Emergency Alerts
- Severity levels (LOW, MEDIUM, HIGH, CRITICAL)
- Audience targeting (ALL_STAFF, NURSES_ONLY, SPECIFIC_GROUPS)
- Multi-channel simultaneous delivery
- Urgent priority enforcement

### 5. Delivery Tracking
- Real-time delivery status updates
- Status types: PENDING, SENT, DELIVERED, FAILED, BOUNCED
- Delivery summary statistics
- Failed delivery retry capability
- External provider tracking IDs

### 6. Real-time Communication
- WebSocket gateway for live updates
- Delivery status push notifications
- Subscribe to specific message updates
- Room-based message organization

### 7. Communication Channels
- **Email**: SMTP, SendGrid, AWS SES support
- **SMS**: Twilio, AWS SNS, Vonage support
- **Push Notifications**: FCM, APNS, OneSignal support
- **Voice**: Twilio Voice, AWS Connect, Plivo support

### 8. Message Scheduling
- Schedule messages for future delivery
- Recurring message patterns
- Campaign management
- Automated processing via cron jobs

### 9. Statistics & Analytics
- Total message counts
- Breakdown by category, priority, and channel
- Delivery success rates
- Sender-specific statistics
- Time-range filtering

### 10. HIPAA Compliance
- Content validation for PHI
- Encryption requirements for sensitive data
- Audit logging for all communications
- Compliance validation before sending

## Architecture

### Directory Structure

```
communication/
├── communication.module.ts         # Module configuration
├── controllers/
│   └── communication.controller.ts # REST API endpoints
├── services/
│   ├── communication.service.ts    # Main service with business logic
│   └── channel.service.ts          # Channel-specific integrations
├── gateways/
│   └── communication.gateway.ts    # WebSocket gateway
├── dto/
│   ├── create-message-template.dto.ts
│   ├── update-message-template.dto.ts
│   ├── create-message.dto.ts
│   ├── recipient.dto.ts
│   ├── broadcast-message.dto.ts
│   └── emergency-alert.dto.ts
├── enums/
│   ├── message-type.enum.ts
│   ├── message-priority.enum.ts
│   ├── message-category.enum.ts
│   ├── recipient-type.enum.ts
│   └── delivery-status.enum.ts
├── interfaces/
│   └── index.ts                    # Type definitions
└── README.md                        # This file
```

### Module Pattern

The module follows NestJS best practices:
- Dependency injection for all services
- DTOs with class-validator for input validation
- Interface-based design for extensibility
- WebSocket integration for real-time features
- Controller-service separation

## API Endpoints

### Template Management
- `POST /communication/templates` - Create a new template
- `GET /communication/templates` - List templates (with filters)
- `PUT /communication/templates/:id` - Update template
- `DELETE /communication/templates/:id` - Delete template

### Messaging
- `POST /communication/messages` - Send message
- `POST /communication/broadcast` - Send broadcast message
- `POST /communication/emergency-alert` - Send emergency alert
- `GET /communication/messages` - List messages (paginated)
- `GET /communication/messages/:id` - Get specific message
- `GET /communication/messages/:id/delivery-status` - Get delivery status

### Statistics
- `GET /communication/statistics` - Get communication statistics

## WebSocket Events

### Client Events
- `subscribe-delivery-updates` - Subscribe to message delivery updates

### Server Events
- `delivery-status-update` - Emitted when delivery status changes

## Configuration

### Environment Variables

#### Email Configuration
```
EMAIL_PROVIDER=smtp|sendgrid|ses
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=user@example.com
SMTP_PASS=password
SMTP_FROM=noreply@whitecross.health

SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM=noreply@whitecross.health

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
SES_FROM=noreply@whitecross.health
```

#### SMS Configuration
```
SMS_PROVIDER=twilio|sns|vonage
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

VONAGE_API_KEY=your_api_key
VONAGE_API_SECRET=your_api_secret
VONAGE_PHONE_NUMBER=+1234567890
```

#### Push Notification Configuration
```
PUSH_PROVIDER=fcm|apns|onesignal
FCM_SERVER_KEY=your_server_key
FCM_PROJECT_ID=your_project_id
FCM_CLIENT_EMAIL=your_client_email
FCM_PRIVATE_KEY=your_private_key

APNS_KEY_ID=your_key_id
APNS_TEAM_ID=your_team_id
APNS_KEY_PATH=/path/to/key.p8
APNS_TOPIC=com.whitecross.app

ONESIGNAL_APP_ID=your_app_id
ONESIGNAL_API_KEY=your_api_key
```

#### Voice Configuration
```
VOICE_PROVIDER=twilio|connect|plivo
AWS_CONNECT_INSTANCE_ID=your_instance_id
AWS_CONNECT_FLOW_ID=your_flow_id
AWS_CONNECT_PHONE_NUMBER=+1234567890

PLIVO_AUTH_ID=your_auth_id
PLIVO_AUTH_TOKEN=your_auth_token
PLIVO_PHONE_NUMBER=+1234567890
```

#### Translation Configuration
```
TRANSLATION_PROVIDER=google|aws|azure
GOOGLE_TRANSLATE_API_KEY=your_api_key
GOOGLE_CLOUD_PROJECT_ID=your_project_id

AZURE_TRANSLATOR_KEY=your_key
AZURE_TRANSLATOR_ENDPOINT=your_endpoint
AZURE_TRANSLATOR_REGION=your_region
```

## Dependencies Required

### Core NestJS
```bash
npm install @nestjs/common @nestjs/core @nestjs/platform-express
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
```

### Validation
```bash
npm install class-validator class-transformer
npm install @nestjs/mapped-types
```

### Database (TypeORM)
```bash
npm install @nestjs/typeorm typeorm pg
```

### Message Queue
```bash
npm install @nestjs/bull bull ioredis
```

### Email Providers
```bash
npm install nodemailer
npm install @sendgrid/mail
npm install @aws-sdk/client-ses
```

### SMS Providers
```bash
npm install twilio
npm install @aws-sdk/client-sns
npm install @vonage/server-sdk
```

### Push Notification Providers
```bash
npm install firebase-admin
npm install apn
npm install onesignal-node
```

### Voice Providers
```bash
npm install @aws-sdk/client-connect
npm install plivo
```

### Translation Services
```bash
npm install @google-cloud/translate
npm install @aws-sdk/client-translate
```

## Migration from Legacy Backend

### Key Changes
1. **ORM Migration**: Sequelize → TypeORM
2. **Validation**: Joi → class-validator
3. **Dependency Injection**: Manual → NestJS DI
4. **Module Organization**: Flat files → Feature-based modules
5. **Real-time**: None → WebSocket Gateway
6. **Queue System**: Custom → Bull/Redis

### Completed
- ✅ Module structure created
- ✅ DTOs with validation implemented
- ✅ Enums migrated
- ✅ Core services created
- ✅ Channel service abstraction
- ✅ WebSocket gateway for real-time updates
- ✅ Controller endpoints defined
- ✅ Interfaces and types defined

### Remaining Work
- ⏳ TypeORM entities (map from Sequelize models)
- ⏳ Database repository integration
- ⏳ HIPAA compliance validation utilities
- ⏳ Channel provider implementations
- ⏳ Message queue setup (Bull)
- ⏳ Authentication guards
- ⏳ Authorization (RBAC)
- ⏳ Unit tests
- ⏳ Integration tests
- ⏳ API documentation (Swagger)

## Usage Examples

### Send a Direct Message
```typescript
const message = await communicationService.sendMessage({
  recipients: [
    {
      type: RecipientType.PARENT,
      id: 'parent-id',
      email: 'parent@example.com',
      phoneNumber: '+1234567890',
    }
  ],
  channels: [MessageType.EMAIL, MessageType.SMS],
  subject: 'Appointment Reminder',
  content: 'Your child has an appointment tomorrow at 10 AM.',
  priority: MessagePriority.NORMAL,
  category: MessageCategory.APPOINTMENT,
  senderId: 'nurse-id',
});
```

### Send a Broadcast
```typescript
const broadcast = await communicationService.sendBroadcastMessage({
  audience: {
    grades: ['K', '1', '2'],
    includeParents: true,
  },
  channels: [MessageType.EMAIL],
  subject: 'School Closure Notice',
  content: 'School will be closed tomorrow due to weather.',
  priority: MessagePriority.HIGH,
  category: MessageCategory.ANNOUNCEMENT,
  senderId: 'admin-id',
});
```

### Subscribe to Delivery Updates
```typescript
// Client-side
socket.emit('subscribe-delivery-updates', { messageId: 'msg-123' });

socket.on('delivery-status-update', (status) => {
  console.log('Delivery status updated:', status);
});
```

## Testing

### Run Tests
```bash
npm test                  # Unit tests
npm run test:e2e         # E2E tests
npm run test:cov         # Coverage report
```

### Test Coverage
- Unit tests for all services
- Integration tests for message flow
- E2E tests for API endpoints
- WebSocket tests for real-time features

## Security Considerations

1. **Authentication**: All endpoints require authentication
2. **Authorization**: Role-based access control (RBAC)
3. **HIPAA Compliance**: PHI validation before sending
4. **Data Encryption**: TLS for transmission, encryption at rest
5. **Rate Limiting**: Prevent message spam
6. **Input Validation**: Class-validator for all inputs
7. **Audit Logging**: Track all communication events

## Performance Optimization

1. **Message Queue**: Async processing for bulk messages
2. **Caching**: Redis for frequently accessed data
3. **Connection Pooling**: Database connection optimization
4. **Batch Processing**: Group similar messages
5. **WebSocket**: Efficient real-time updates

## Troubleshooting

### Common Issues

1. **Channel Provider Not Configured**
   - Check environment variables
   - Verify API keys are valid
   - Review provider-specific documentation

2. **Message Delivery Failures**
   - Check delivery status endpoint
   - Review failure reasons in logs
   - Verify recipient contact information

3. **WebSocket Connection Issues**
   - Ensure socket.io client matches server version
   - Check CORS configuration
   - Verify namespace is correct

## Support

For issues or questions, contact the development team or refer to the main project documentation.
