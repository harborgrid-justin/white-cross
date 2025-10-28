# SMS Infrastructure Module

## Overview

The SMS Infrastructure Module provides SMS sending capabilities for alerts, notifications, and emergency communications in the White Cross School Health Platform. This is a NestJS-based implementation migrated from the legacy backend.

## Features

- **Alert SMS**: Send structured alert notifications with severity levels
- **Generic SMS**: Send generic text messages
- **Bulk SMS**: Send messages to multiple recipients simultaneously
- **Phone Validation**: E.164 and US format phone number validation
- **Message Truncation**: Automatic truncation with ellipsis for long messages
- **Configurable Length**: Adjustable character limits (1-1600 characters)
- **Environment Awareness**: Different behavior for development vs production
- **Connection Testing**: Built-in test functionality

## Module Structure

```
infrastructure/sms/
├── dto/
│   ├── alert-sms.dto.ts       # DTO for alert SMS with validation
│   ├── generic-sms.dto.ts     # DTO for generic SMS with validation
│   └── index.ts               # Barrel export for DTOs
├── sms.module.ts              # NestJS module definition
├── sms.service.ts             # Core SMS service implementation
├── sms.service.spec.ts        # Comprehensive unit tests
├── index.ts                   # Barrel export for module
└── README.md                  # This file
```

## Installation

The module is already registered in `app.module.ts`:

```typescript
import { SmsModule } from './infrastructure/sms/sms.module';

@Module({
  imports: [
    // ... other imports
    SmsModule,
  ],
})
export class AppModule {}
```

## Usage

### 1. Inject the Service

```typescript
import { Injectable } from '@nestjs/common';
import { SmsService } from './infrastructure/sms';
import { AlertSmsDto, GenericSmsDto } from './infrastructure/sms/dto';
import { AlertSeverity } from './alerts/dto/create-alert.dto';

@Injectable()
export class MyService {
  constructor(private readonly smsService: SmsService) {}

  async sendEmergencyAlert() {
    const alertData: AlertSmsDto = {
      title: 'Emergency Alert',
      message: 'Student requires immediate medical attention',
      severity: AlertSeverity.CRITICAL,
    };

    await this.smsService.sendAlertSMS('+15551234567', alertData);
  }
}
```

### 2. Send Alert SMS

```typescript
// Send a structured alert with severity
const alertData: AlertSmsDto = {
  title: 'Medication Reminder',
  message: 'Student John Doe needs to take asthma medication',
  severity: AlertSeverity.WARNING,
};

await smsService.sendAlertSMS('+15551234567', alertData);
```

### 3. Send Generic SMS

```typescript
// Send a generic text message
const smsData: GenericSmsDto = {
  message: 'Your appointment is scheduled for tomorrow at 2:00 PM',
};

await smsService.sendSMS('+15551234567', smsData);
```

### 4. Send Bulk SMS

```typescript
// Send to multiple recipients
const recipients = ['+15551234567', '+15559876543', '+15555555555'];
const smsData: GenericSmsDto = {
  message: 'School-wide notification: Early dismissal today at 1:00 PM',
};

await smsService.sendBulkSMS(recipients, smsData);
```

### 5. Test Connection

```typescript
// Test SMS service configuration
const isConnected = await smsService.testConnection('+15551234567');
if (isConnected) {
  console.log('SMS service is configured correctly');
} else {
  console.error('SMS service test failed');
}
```

### 6. Configure Message Length

```typescript
// Set custom maximum length (default is 160 characters)
smsService.setMaxLength(320); // For concatenated SMS

// Get current maximum length
const maxLength = smsService.getMaxLength(); // returns 320
```

## Phone Number Formats

The service validates phone numbers and accepts:

### E.164 Format (Recommended)
- `+15551234567` (US)
- `+442071234567` (UK)
- `+61234567890` (Australia)

### US Format
- `5551234567` (10 digits without country code)
- `+15551234567` (with +1 country code)

### Invalid Formats
- `555-123-4567` (dashes not supported)
- `(555) 123-4567` (parentheses not supported)
- Short numbers or non-numeric characters

## DTOs

### AlertSmsDto

```typescript
{
  title: string;        // Max 100 characters
  message: string;      // Max 500 characters
  severity: AlertSeverity; // INFO, WARNING, URGENT, CRITICAL
}
```

### GenericSmsDto

```typescript
{
  message: string;      // Max 1600 characters
}
```

## Alert Severity Levels

Import from `alerts/dto/create-alert.dto`:

```typescript
enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  URGENT = 'urgent',
  CRITICAL = 'critical',
}
```

## Environment Configuration

### Development Mode
In development (`NODE_ENV !== 'production'`), the service logs SMS messages to the console:

```
========== SMS ==========
To: +15551234567
Message: [CRITICAL] Emergency Alert: Student requires immediate attention
Length: 68 chars
=========================
```

### Production Mode
In production, the service currently logs a warning that a production SMS provider needs to be configured. To integrate with a real SMS provider:

1. Install the provider SDK (e.g., Twilio, AWS SNS)
2. Add credentials to `.env`:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+15551234567
   ```
3. Update `smsService.sendSMS()` to use the provider SDK

## Production Integration

### Twilio Integration Example

```typescript
// Add to sms.service.ts
import * as twilio from 'twilio';

constructor(private readonly configService: ConfigService) {
  this.isProduction = this.configService.get<string>('NODE_ENV') === 'production';

  if (this.isProduction) {
    this.twilioClient = twilio(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN'),
    );
  }
}

async sendSMS(to: string, data: GenericSmsDto): Promise<void> {
  // ... validation ...

  if (this.isProduction && this.twilioClient) {
    await this.twilioClient.messages.create({
      body: truncatedMessage,
      from: this.configService.get('TWILIO_PHONE_NUMBER'),
      to: to,
    });
  } else {
    // Development mode logging
  }
}
```

### AWS SNS Integration Example

```typescript
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

constructor(private readonly configService: ConfigService) {
  this.isProduction = this.configService.get<string>('NODE_ENV') === 'production';

  if (this.isProduction) {
    this.snsClient = new SNSClient({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }
}

async sendSMS(to: string, data: GenericSmsDto): Promise<void> {
  // ... validation ...

  if (this.isProduction && this.snsClient) {
    const command = new PublishCommand({
      Message: truncatedMessage,
      PhoneNumber: to,
    });
    await this.snsClient.send(command);
  } else {
    // Development mode logging
  }
}
```

## Testing

Run the unit tests:

```bash
# Run SMS service tests
npm test -- sms.service.spec.ts

# Run with coverage
npm test -- --coverage sms.service.spec.ts
```

The test suite includes:
- Alert SMS sending with various severities
- Generic SMS sending
- Bulk SMS operations
- Phone number validation (valid and invalid formats)
- Message truncation
- Connection testing
- Max length configuration

## Error Handling

The service throws `BadRequestException` for:
- Invalid phone number formats
- Invalid max length values (outside 1-1600 range)

```typescript
try {
  await smsService.sendSMS('invalid-phone', { message: 'Test' });
} catch (error) {
  if (error instanceof BadRequestException) {
    console.error('Invalid phone number');
  }
}
```

## Migration Notes

### Changes from Legacy Backend

1. **Dependency Injection**: Uses NestJS `@Injectable()` decorator and constructor injection
2. **Configuration**: Uses `ConfigService` instead of direct `process.env` access
3. **Error Handling**: Uses NestJS `BadRequestException` instead of generic `Error`
4. **Logging**: Uses NestJS `Logger` instead of `console.log`
5. **DTOs**: Separate DTO files with class-validator decorators
6. **Testing**: NestJS Testing utilities with proper mocking

### Preserved Functionality

All original functionality has been preserved:
- Alert SMS formatting with severity
- Generic SMS sending
- Bulk SMS operations
- Phone number validation (E.164 and US formats)
- Message truncation
- Configurable max length
- Connection testing
- Environment awareness

## Future Enhancements

Potential improvements for future iterations:

1. **Provider Integration**: Complete integration with Twilio, AWS SNS, or other providers
2. **Delivery Tracking**: Track delivery status and implement retry logic
3. **Rate Limiting**: Implement rate limiting to prevent SMS flooding
4. **Template Support**: Add SMS templates for common notifications
5. **Scheduled SMS**: Support for scheduling SMS delivery
6. **Multi-language**: Support for international SMS with Unicode
7. **Cost Tracking**: Track SMS costs per message or campaign
8. **Analytics**: Track delivery rates, response times, and user engagement

## Dependencies

- `@nestjs/common`: Core NestJS functionality
- `@nestjs/config`: Configuration management
- `@nestjs/swagger`: API documentation decorators
- `class-validator`: DTO validation
- `class-transformer`: DTO transformation

## Related Modules

- `AlertsModule`: Provides alert system and severity definitions
- `EmailModule`: Companion infrastructure module for email delivery
- `EmergencyBroadcastModule`: Uses SMS service for emergency communications

## Support

For issues or questions about the SMS service:
1. Check the unit tests for usage examples
2. Review the service documentation in the code
3. Check the NestJS documentation for dependency injection patterns

## License

Part of the White Cross School Health Platform - Proprietary
