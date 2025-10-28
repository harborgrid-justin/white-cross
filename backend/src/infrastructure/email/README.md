# Email Service - Production Implementation

Production-ready email service for White Cross Healthcare with nodemailer integration, templating, queuing, retry logic, and rate limiting.

## Features

- **Nodemailer Integration**: SMTP, SendGrid, AWS SES, or any nodemailer-compatible transport
- **Template System**: Handlebars-based HTML and text email templates
- **Email Queue**: BullMQ-powered reliable email delivery with retry logic
- **Rate Limiting**: Global and per-recipient rate limiting to prevent abuse
- **Attachment Support**: Send emails with file attachments
- **Email Tracking**: Comprehensive logging and statistics
- **Type Safety**: Full TypeScript support with validated DTOs
- **Error Handling**: Graceful error handling with detailed error messages

## Installation

Dependencies are already installed:
- `nodemailer` - Email sending
- `@types/nodemailer` - TypeScript definitions
- `handlebars` - Template engine
- `@types/handlebars` - TypeScript definitions
- `email-validator` - Email validation
- `bullmq` - Queue management (already in project)

## Configuration

### Environment Variables

```bash
# Email Transport
EMAIL_TRANSPORT=smtp                    # Transport type (smtp, sendgrid, ses)
EMAIL_FROM=noreply@whitecross.healthcare # Default sender address
EMAIL_REPLY_TO=support@whitecross.healthcare # Default reply-to address

# SMTP Configuration
EMAIL_SMTP_HOST=smtp.example.com        # SMTP server host
EMAIL_SMTP_PORT=587                     # SMTP server port
EMAIL_SMTP_SECURE=false                 # Use TLS (true for port 465)
EMAIL_SMTP_USER=username                # SMTP username
EMAIL_SMTP_PASS=password                # SMTP password
EMAIL_SMTP_MAX_CONNECTIONS=5            # Max concurrent connections
EMAIL_SMTP_MAX_MESSAGES=100             # Max messages per connection
EMAIL_SMTP_RATE_DELTA=1000              # Rate limiting window (ms)
EMAIL_SMTP_RATE_LIMIT=5                 # Max emails per rate window

# Queue Configuration
EMAIL_QUEUE_ENABLED=true                # Enable email queueing
EMAIL_QUEUE_MAX_RETRIES=3               # Max retry attempts
EMAIL_QUEUE_BACKOFF_DELAY=5000          # Initial backoff delay (ms)

# Redis Configuration (for queue)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=                         # Optional

# Rate Limiting
EMAIL_RATE_LIMIT_ENABLED=true           # Enable rate limiting
EMAIL_RATE_LIMIT_GLOBAL_MAX=100         # Max emails per hour (global)
EMAIL_RATE_LIMIT_GLOBAL_WINDOW=3600000  # Time window in ms (1 hour)
EMAIL_RATE_LIMIT_RECIPIENT_MAX=10       # Max emails per recipient per hour
EMAIL_RATE_LIMIT_RECIPIENT_WINDOW=3600000 # Time window in ms (1 hour)

# Templates
EMAIL_TEMPLATE_CACHE_ENABLED=true       # Enable template caching
EMAIL_TEMPLATE_DIR=templates            # Template directory (relative to service)
```

### SMTP Providers

#### Gmail
```bash
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_SECURE=false
EMAIL_SMTP_USER=your-email@gmail.com
EMAIL_SMTP_PASS=your-app-password      # Use app-specific password
```

#### SendGrid
```bash
EMAIL_SMTP_HOST=smtp.sendgrid.net
EMAIL_SMTP_PORT=587
EMAIL_SMTP_SECURE=false
EMAIL_SMTP_USER=apikey
EMAIL_SMTP_PASS=your-sendgrid-api-key
```

#### AWS SES
```bash
EMAIL_SMTP_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_SECURE=false
EMAIL_SMTP_USER=your-ses-smtp-username
EMAIL_SMTP_PASS=your-ses-smtp-password
```

## Usage

### Basic Email Sending

```typescript
import { EmailService } from './infrastructure/email/email.service';
import { GenericEmailData } from './infrastructure/email/dto/email.dto';

@Injectable()
export class MyService {
  constructor(private readonly emailService: EmailService) {}

  async sendWelcomeEmail(userEmail: string, userName: string) {
    const emailData: GenericEmailData = {
      subject: 'Welcome to White Cross Healthcare',
      body: `Hello ${userName}, welcome to our platform!`,
      html: `<p>Hello <strong>${userName}</strong>, welcome to our platform!</p>`,
    };

    const result = await this.emailService.sendEmail(userEmail, emailData);

    if (result.success) {
      console.log('Email sent successfully:', result.messageId);
    } else {
      console.error('Email failed:', result.error);
    }
  }
}
```

### Alert Emails

```typescript
import { AlertEmailData, AlertSeverity, AlertCategory } from './dto/email.dto';

async sendAlert() {
  const alertData: AlertEmailData = {
    title: 'Critical Alert',
    message: 'Student requires immediate attention',
    severity: AlertSeverity.CRITICAL,
    category: AlertCategory.MEDICATION,
    alertId: 'uuid-here',
    timestamp: new Date(),
    additionalInfo: {
      studentName: 'John Doe',
      location: 'Room 101',
    },
  };

  await this.emailService.sendAlertEmail('nurse@example.com', alertData);
}
```

### Templated Emails

```typescript
import { SendEmailDto, EmailTemplate } from './dto/email.dto';

async sendWelcomeWithTemplate() {
  const emailData: SendEmailDto = {
    to: ['user@example.com'],
    subject: 'Welcome to White Cross Healthcare',
    body: 'Welcome!', // Fallback text
    template: EmailTemplate.WELCOME,
    templateData: {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Nurse',
      loginUrl: 'https://app.whitecross.healthcare/login',
      docsUrl: 'https://docs.whitecross.healthcare',
    },
  };

  await this.emailService.sendTemplatedEmail(emailData);
}
```

### Emails with Attachments

```typescript
async sendWithAttachment() {
  const emailData: SendEmailDto = {
    to: ['recipient@example.com'],
    subject: 'Your Report',
    body: 'Please find your report attached.',
    attachments: [
      {
        filename: 'report.pdf',
        content: pdfBuffer, // Buffer or base64 string
        contentType: 'application/pdf',
      },
      {
        filename: 'logo.png',
        content: logoBuffer,
        contentType: 'image/png',
        disposition: 'inline',
        cid: 'logo@whitecross', // For embedding in HTML
      },
    ],
  };

  await this.emailService.sendTemplatedEmail(emailData);
}
```

### Bulk Emails

```typescript
async sendBulkEmail() {
  const recipients = [
    'user1@example.com',
    'user2@example.com',
    'user3@example.com',
  ];

  const emailData: GenericEmailData = {
    subject: 'System Maintenance Notice',
    body: 'We will perform maintenance on...',
  };

  // Sends to all recipients with batching and rate limiting
  const results = await this.emailService.sendBulkEmail(recipients, emailData);

  const successful = results.filter(r => r.success).length;
  console.log(`Sent ${successful} out of ${results.length} emails`);
}
```

### Personalized Batch Emails

```typescript
async sendPersonalizedEmails() {
  const emails = [
    {
      to: 'user1@example.com',
      data: { subject: 'Hello User 1', body: 'Personalized content for user 1' }
    },
    {
      to: 'user2@example.com',
      data: { subject: 'Hello User 2', body: 'Personalized content for user 2' }
    },
  ];

  const results = await this.emailService.sendBatchEmails(emails);
}
```

### Priority Emails

```typescript
import { EmailPriority } from './dto/email.dto';

async sendUrgentEmail() {
  const emailData: SendEmailDto = {
    to: ['admin@example.com'],
    subject: 'Urgent: System Alert',
    body: 'Immediate action required',
    priority: EmailPriority.URGENT, // Will be processed first in queue
  };

  await this.emailService.sendTemplatedEmail(emailData);
}
```

### Delayed Emails

```typescript
async scheduleEmail() {
  const emailData: SendEmailDto = {
    to: ['user@example.com'],
    subject: 'Reminder',
    body: 'This is your scheduled reminder',
    delay: 3600000, // Send in 1 hour (milliseconds)
  };

  await this.emailService.sendTemplatedEmail(emailData);
}
```

### Email Validation

```typescript
validateEmailAddress() {
  const result = this.emailService.validateEmail('user@example.com');

  if (result.valid) {
    console.log('Email is valid');
  } else {
    console.log('Email is invalid:', result.reason);
  }
}
```

### Statistics

```typescript
getEmailStats() {
  const stats = this.emailService.getStatistics();

  console.log(`Sent: ${stats.totalSent}`);
  console.log(`Failed: ${stats.totalFailed}`);
  console.log(`Queued: ${stats.totalQueued}`);
  console.log(`Success Rate: ${stats.successRate}%`);
  console.log(`Avg Delivery Time: ${stats.averageDeliveryTime}ms`);
}
```

## Available Templates

### Alert Template
**Template**: `EmailTemplate.ALERT`

**Required Data**:
```typescript
{
  title: string;
  message: string;
  severity: AlertSeverity;
  category: AlertCategory;
  alertId: string;
  timestamp?: Date;
  additionalInfo?: Record<string, unknown>;
}
```

### Welcome Template
**Template**: `EmailTemplate.WELCOME`

**Required Data**:
```typescript
{
  name: string;
  email: string;
  role?: string;
  loginUrl: string;
  docsUrl: string;
}
```

### Notification Template
**Template**: `EmailTemplate.NOTIFICATION`

**Required Data**:
```typescript
{
  title?: string;
  body: string;
  actionUrl?: string;
  actionText?: string;
}
```

### Password Reset Template
**Template**: `EmailTemplate.PASSWORD_RESET`

**Required Data**:
```typescript
{
  name: string;
  resetUrl: string;
  expiresInHours: number;
}
```

### Custom Template
**Template**: `EmailTemplate.CUSTOM`

**Required Data**:
```typescript
{
  title?: string;
  body: string; // HTML content
}
```

## Queue Management

### Queue Service

Access the queue service directly for advanced operations:

```typescript
import { EmailQueueService } from './email-queue.service';

@Injectable()
export class MyService {
  constructor(private readonly queueService: EmailQueueService) {}

  async manageQueue() {
    // Get queue statistics
    const stats = await this.queueService.getQueueStats();
    console.log('Queue stats:', stats);

    // Get job status
    const jobStatus = await this.queueService.getJobStatus('job-id');
    console.log('Job status:', jobStatus);

    // Cancel a job
    await this.queueService.cancelJob('job-id');

    // Retry failed jobs
    const retriedCount = await this.queueService.retryFailedJobs();

    // Clear completed jobs
    await this.queueService.clearCompleted();

    // Pause/resume queue
    await this.queueService.pauseQueue();
    await this.queueService.resumeQueue();

    // Health check
    const health = await this.queueService.healthCheck();
    console.log('Queue healthy:', health.healthy);
  }
}
```

## Rate Limiting

### Rate Limiter Service

Access rate limiter directly:

```typescript
import { EmailRateLimiterService } from './email-rate-limiter.service';

@Injectable()
export class MyService {
  constructor(private readonly rateLimiter: EmailRateLimiterService) {}

  async checkLimits() {
    // Check if sending is allowed
    const status = this.rateLimiter.checkLimit('user@example.com');

    if (status.allowed) {
      console.log(`Can send. Remaining: ${status.remaining}`);
    } else {
      console.log(`Rate limited. Resets at: ${status.resetAt}`);
    }

    // Get rate limiter stats
    const stats = this.rateLimiter.getStats();
    console.log('Rate limiter stats:', stats);

    // Reset limits
    this.rateLimiter.resetLimit('user@example.com');
    this.rateLimiter.resetAll();

    // Wait for limit to allow sending
    await this.rateLimiter.waitForLimit('user@example.com');
  }
}
```

## Error Handling

The service returns structured error information:

```typescript
async sendEmailWithErrorHandling() {
  const result = await this.emailService.sendEmail('user@example.com', {
    subject: 'Test',
    body: 'Test',
  });

  if (!result.success) {
    console.error('Email failed:', result.error);

    // Handle specific error cases
    if (result.error.includes('Rate limit')) {
      // Handle rate limit error
    } else if (result.error.includes('Invalid email')) {
      // Handle validation error
    } else {
      // Handle other errors
    }
  }
}
```

## Testing

Run the test suite:

```bash
# Unit tests
npm test email.service.spec.ts
npm test email-template.service.spec.ts
npm test email-rate-limiter.service.spec.ts

# All email service tests
npm test -- email/__tests__

# With coverage
npm test -- --coverage email/__tests__
```

## Production Checklist

Before deploying to production:

1. **Configure SMTP Provider**
   - Set up SMTP credentials with your provider
   - Test connection with `testConnection()` method
   - Verify SPF, DKIM, and DMARC records

2. **Configure Redis**
   - Ensure Redis is running for queue
   - Configure Redis password if needed
   - Consider Redis persistence settings

3. **Set Environment Variables**
   - Configure all EMAIL_* environment variables
   - Set appropriate rate limits
   - Configure retry settings

4. **Template Testing**
   - Test all templates with real data
   - Verify HTML rendering in major email clients
   - Test with both HTML and text-only clients

5. **Monitoring**
   - Monitor queue statistics
   - Track email delivery rates
   - Set up alerts for failures

6. **Security**
   - Use environment variables for credentials
   - Never commit credentials to version control
   - Use app-specific passwords where available
   - Enable TLS for SMTP connections

## Architecture

```
EmailModule
├── EmailService (main service)
│   ├── Nodemailer integration
│   ├── Email sending logic
│   ├── Validation
│   └── Statistics tracking
├── EmailTemplateService
│   ├── Template loading
│   ├── Handlebars rendering
│   └── Template caching
├── EmailQueueService
│   ├── BullMQ queue management
│   ├── Job processing
│   └── Retry logic
└── EmailRateLimiterService
    ├── Rate limit checking
    ├── Counter management
    └── Reset logic
```

## Performance Considerations

- **Template Caching**: Templates are cached in memory for fast rendering
- **Connection Pooling**: SMTP connections are pooled for efficiency
- **Batching**: Bulk sends are automatically batched
- **Queue Processing**: Emails are processed asynchronously
- **Rate Limiting**: Prevents overwhelming email servers

## Troubleshooting

### Emails not sending

1. Check SMTP credentials
2. Verify SMTP host and port
3. Check firewall rules
4. Review application logs
5. Test with `testConnection()` method

### Rate limit errors

1. Check current rate limits with `getStats()`
2. Adjust `EMAIL_RATE_LIMIT_*` variables
3. Use `resetLimit()` for testing
4. Consider increasing limits for legitimate use cases

### Queue issues

1. Verify Redis is running
2. Check Redis connection settings
3. Review queue statistics with `getQueueStats()`
4. Check for failed jobs with `getJobsByStatus('failed')`
5. Retry failed jobs with `retryFailedJobs()`

### Template errors

1. Verify template files exist in templates directory
2. Check template data matches required fields
3. Review Handlebars syntax
4. Clear template cache with `clearCache()`

## Support

For issues or questions, refer to:
- Application logs for detailed error messages
- Queue statistics for delivery issues
- Rate limiter stats for limit issues
- Template service cache stats for template issues
