# Quick Reference - Common Patterns & Recipes

**Version**: 3.0.0
**Last Updated**: 2025-11-09

---

## Overview

Copy-paste ready code examples for common tasks. All examples are production-ready and follow best practices.

---

## Table of Contents

1. [Authentication & Security](#authentication--security)
2. [Background Jobs](#background-jobs)
3. [Email & Notifications](#email--notifications)
4. [File Storage](#file-storage)
5. [Payment Processing](#payment-processing)
6. [Caching](#caching)
7. [Database Operations](#database-operations)
8. [Error Handling](#error-handling)
9. [Validation](#validation)
10. [Construction Projects](#construction-projects)

---

## Authentication & Security

### User Registration with JWT

```typescript
import { 
  hashPassword, 
  generateAccessToken, 
  generateRefreshToken,
  JwtAuthGuard 
} from '@white-cross/reuse/core/auth';
import { Controller, Post, Body } from '@nestjs/common';

interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    // 1. Hash password
    const hashedPassword = await hashPassword(dto.password, {
      algorithm: 'argon2', // or 'bcrypt'
      rounds: 10
    });

    // 2. Create user in database
    const user = await this.userService.create({
      ...dto,
      password: hashedPassword
    });

    // 3. Generate tokens
    const accessToken = generateAccessToken({
      sub: user.id,
      email: user.email,
      roles: user.roles || []
    }, {
      expiresIn: '1h'
    });

    const refreshToken = generateRefreshToken({
      sub: user.id
    }, {
      expiresIn: '7d'
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      accessToken,
      refreshToken
    };
  }
}
```

### Protected Routes with Role-Based Access

```typescript
import { 
  JwtAuthGuard, 
  RolesGuard, 
  Roles 
} from '@white-cross/reuse/core/auth';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  
  @Get('dashboard')
  @Roles('admin', 'superadmin')
  async getDashboard() {
    return { message: 'Admin dashboard' };
  }

  @Get('users')
  @Roles('admin')
  async getUsers() {
    return { users: [] };
  }
}
```

### Two-Factor Authentication Setup

```typescript
import { 
  generate2FASecret, 
  verify2FAToken,
  generate2FAQRCode 
} from '@white-cross/reuse/core/auth';

@Controller('auth/2fa')
export class TwoFactorAuthController {
  
  @Post('setup')
  @UseGuards(JwtAuthGuard)
  async setup2FA(@Request() req) {
    const userId = req.user.id;
    
    // Generate TOTP secret
    const secret = generate2FASecret();
    
    // Save secret to user (encrypted)
    await this.userService.update(userId, {
      twoFactorSecret: secret.base32
    });
    
    // Generate QR code for authenticator app
    const qrCode = await generate2FAQRCode(secret.otpauth_url);
    
    return {
      secret: secret.base32,
      qrCode // base64 image
    };
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  async verify2FA(@Request() req, @Body() { token }: { token: string }) {
    const user = await this.userService.findById(req.user.id);
    
    const isValid = verify2FAToken(token, user.twoFactorSecret);
    
    if (isValid) {
      await this.userService.update(user.id, {
        twoFactorEnabled: true
      });
      return { success: true };
    }
    
    throw new UnauthorizedException('Invalid 2FA token');
  }
}
```

---

## Background Jobs

### Queue Email for Background Sending

```typescript
import { createJob } from '@white-cross/reuse/infrastructure/background-jobs';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class EmailQueueService {
  constructor(
    @InjectQueue('emails') private emailQueue: Queue
  ) {}

  async queueWelcomeEmail(userId: string) {
    const job = await createJob(this.emailQueue, {
      name: 'send-welcome-email',
      data: {
        userId,
        template: 'welcome',
        subject: 'Welcome to Our Platform!'
      },
      options: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000
        },
        removeOnComplete: true,
        removeOnFail: false
      }
    });

    return { jobId: job.id };
  }
}
```

### Schedule Recurring Daily Reports

```typescript
import { scheduleJob } from '@white-cross/reuse/infrastructure/background-jobs';
import { OnModuleInit, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ReportScheduler implements OnModuleInit {
  constructor(
    @InjectQueue('reports') private reportQueue: Queue
  ) {}

  async onModuleInit() {
    // Schedule daily report at 2 AM
    await scheduleJob(this.reportQueue, {
      name: 'daily-sales-report',
      cron: '0 2 * * *', // Every day at 2:00 AM
      data: {
        reportType: 'sales',
        recipients: ['admin@example.com']
      },
      options: {
        timezone: 'America/New_York'
      }
    });

    // Schedule weekly summary on Mondays
    await scheduleJob(this.reportQueue, {
      name: 'weekly-summary',
      cron: '0 9 * * 1', // Every Monday at 9:00 AM
      data: {
        reportType: 'weekly-summary'
      }
    });
  }
}
```

### Circuit Breaker for External API

```typescript
import { CircuitBreaker } from '@white-cross/reuse/infrastructure/background-jobs';
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ExternalApiService {
  private circuitBreaker: CircuitBreaker;

  constructor() {
    this.circuitBreaker = new CircuitBreaker({
      threshold: 5, // Open after 5 failures
      timeout: 30000, // Try again after 30 seconds
      resetTimeout: 60000 // Full reset after 1 minute of success
    });
  }

  async fetchExternalData(endpoint: string) {
    return await this.circuitBreaker.execute(async () => {
      const response = await axios.get(endpoint, {
        timeout: 5000
      });
      return response.data;
    });
  }
}
```

---

## Email & Notifications

### Send Email via SendGrid

```typescript
import { sendEmailViaSendGrid } from '@white-cross/reuse/infrastructure/notifications';

async function sendWelcomeEmail(user: User) {
  await sendEmailViaSendGrid({
    to: user.email,
    from: {
      email: 'noreply@example.com',
      name: 'Our Platform'
    },
    subject: 'Welcome to Our Platform!',
    html: `
      <h1>Welcome, ${user.firstName}!</h1>
      <p>Thank you for joining us.</p>
      <a href="${activationLink}">Activate Your Account</a>
    `,
    // Or use a template
    templateId: 'd-1234567890',
    dynamicTemplateData: {
      firstName: user.firstName,
      activationLink
    },
    // Track opens and clicks
    trackingSettings: {
      clickTracking: { enable: true },
      openTracking: { enable: true }
    }
  });
}
```

### Send SMS via Twilio

```typescript
import { sendSMSViaTwilio } from '@white-cross/reuse/infrastructure/notifications';

async function sendVerificationCode(phoneNumber: string, code: string) {
  await sendSMSViaTwilio({
    to: phoneNumber,
    from: process.env.TWILIO_PHONE_NUMBER,
    body: `Your verification code is: ${code}. Valid for 10 minutes.`
  });
}
```

### Send Push Notification via Firebase

```typescript
import { sendPushViaFCM } from '@white-cross/reuse/infrastructure/notifications';

async function sendOrderNotification(deviceToken: string, order: Order) {
  await sendPushViaFCM({
    token: deviceToken,
    notification: {
      title: 'Order Confirmed',
      body: `Your order #${order.id} has been confirmed!`
    },
    data: {
      orderId: order.id,
      type: 'order_confirmation'
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
          badge: 1
        }
      }
    },
    android: {
      priority: 'high',
      notification: {
        sound: 'default',
        color: '#00FF00'
      }
    }
  });
}
```

### Multi-Channel Notification

```typescript
import { 
  sendEmailViaSendGrid,
  sendSMSViaTwilio,
  sendPushViaFCM
} from '@white-cross/reuse/infrastructure/notifications';

async function notifyUser(user: User, message: string) {
  // Send via all channels in parallel
  await Promise.all([
    // Email
    sendEmailViaSendGrid({
      to: user.email,
      from: 'notifications@example.com',
      subject: 'Important Notification',
      html: `<p>${message}</p>`
    }),
    
    // SMS (if phone number exists)
    user.phoneNumber && sendSMSViaTwilio({
      to: user.phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
      body: message
    }),
    
    // Push (if device token exists)
    user.deviceToken && sendPushViaFCM({
      token: user.deviceToken,
      notification: {
        title: 'Notification',
        body: message
      }
    })
  ].filter(Boolean)); // Remove null/undefined promises
}
```

---

## File Storage

### Upload File to S3

```typescript
import { uploadFile } from '@white-cross/reuse/infrastructure/storage';

@Controller('upload')
export class UploadController {
  
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await uploadFile(file.buffer, {
      provider: 's3',
      bucket: process.env.S3_BUCKET,
      key: `uploads/${Date.now()}-${file.originalname}`,
      contentType: file.mimetype,
      acl: 'public-read' // or 'private'
    });

    return {
      url: result.url,
      key: result.key,
      size: result.size
    };
  }
}
```

### Resize Image on Upload

```typescript
import { uploadFile, resizeImage } from '@white-cross/reuse/infrastructure/storage';

async function uploadAndResizeImage(file: Express.Multer.File) {
  // Upload original
  const original = await uploadFile(file.buffer, {
    provider: 's3',
    bucket: process.env.S3_BUCKET,
    key: `originals/${Date.now()}-${file.originalname}`
  });

  // Create thumbnail (200x200)
  const thumbnail = await resizeImage(file.buffer, {
    width: 200,
    height: 200,
    fit: 'cover',
    format: 'jpeg',
    quality: 80
  });

  const thumbnailUpload = await uploadFile(thumbnail, {
    provider: 's3',
    bucket: process.env.S3_BUCKET,
    key: `thumbnails/${Date.now()}-thumb.jpg`,
    contentType: 'image/jpeg'
  });

  // Create medium size (800x600)
  const medium = await resizeImage(file.buffer, {
    width: 800,
    height: 600,
    fit: 'inside'
  });

  const mediumUpload = await uploadFile(medium, {
    provider: 's3',
    bucket: process.env.S3_BUCKET,
    key: `medium/${Date.now()}-medium.jpg`
  });

  return {
    original: original.url,
    thumbnail: thumbnailUpload.url,
    medium: mediumUpload.url
  };
}
```

### Generate Presigned URL for Private Files

```typescript
import { generatePresignedUrl } from '@white-cross/reuse/infrastructure/storage';

async function getDownloadLink(fileKey: string, userId: string) {
  // Verify user has access to file
  const hasAccess = await checkUserAccess(userId, fileKey);
  if (!hasAccess) {
    throw new ForbiddenException();
  }

  // Generate presigned URL (expires in 1 hour)
  const url = await generatePresignedUrl({
    provider: 's3',
    bucket: process.env.S3_BUCKET,
    key: fileKey,
    expires: 3600, // 1 hour
    operation: 'getObject'
  });

  return { downloadUrl: url };
}
```

---

## Payment Processing

### Create One-Time Payment with Stripe

```typescript
import { createPaymentIntent } from '@white-cross/reuse/infrastructure/payments';

@Controller('payments')
export class PaymentController {
  
  @Post('create-intent')
  @UseGuards(JwtAuthGuard)
  async createIntent(@Request() req, @Body() dto: CreatePaymentDto) {
    const intent = await createPaymentIntent({
      amount: dto.amount * 100, // Convert to cents
      currency: 'usd',
      provider: 'stripe',
      customerId: req.user.stripeCustomerId,
      metadata: {
        userId: req.user.id,
        orderId: dto.orderId
      },
      // 3D Secure
      paymentMethodOptions: {
        card: {
          request_three_d_secure: 'automatic'
        }
      }
    });

    return {
      clientSecret: intent.client_secret,
      intentId: intent.id
    };
  }
}
```

### Create Subscription

```typescript
import { createSubscription } from '@white-cross/reuse/infrastructure/payments';

async function subscribeUser(userId: string, planId: string) {
  const user = await userService.findById(userId);
  
  const subscription = await createSubscription({
    provider: 'stripe',
    customerId: user.stripeCustomerId,
    priceId: planId,
    metadata: {
      userId: user.id
    },
    // Trial period
    trialPeriodDays: 14,
    // Payment behavior
    paymentBehavior: 'default_incomplete',
    // Proration behavior
    prorationBehavior: 'create_prorations'
  });

  // Save subscription to database
  await userService.update(userId, {
    subscriptionId: subscription.id,
    subscriptionStatus: subscription.status,
    currentPlan: planId
  });

  return subscription;
}
```

### Handle Payment Webhook

```typescript
import { verifyWebhook } from '@white-cross/reuse/infrastructure/webhooks';

@Controller('webhooks')
export class WebhookController {
  
  @Post('stripe')
  async handleStripeWebhook(@Request() req) {
    const signature = req.headers['stripe-signature'];
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    
    // Verify webhook signature
    const isValid = verifyWebhook(
      req.body,
      signature,
      secret
    );
    
    if (!isValid) {
      throw new UnauthorizedException('Invalid signature');
    }
    
    const event = req.body;
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(event.data.object);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdate(event.data.object);
        break;
    }
    
    return { received: true };
  }
}
```

---

## Caching

### Basic Redis Caching

```typescript
import { CacheService } from '@white-cross/reuse/core/cache';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  constructor(private cache: CacheService) {}

  async getProduct(productId: string) {
    // Try cache first
    const cacheKey = `product:${productId}`;
    const cached = await this.cache.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }
    
    // Fetch from database
    const product = await this.database.findProduct(productId);
    
    // Cache for 1 hour
    await this.cache.set(
      cacheKey,
      JSON.stringify(product),
      { ttl: 3600 }
    );
    
    return product;
  }

  async updateProduct(productId: string, data: UpdateProductDto) {
    const product = await this.database.updateProduct(productId, data);
    
    // Invalidate cache
    await this.cache.del(`product:${productId}`);
    
    return product;
  }
}
```

### Cache-Aside Pattern with Decorator

```typescript
import { Cacheable } from '@white-cross/reuse/core/cache';

@Injectable()
export class UserService {
  
  @Cacheable({
    ttl: 3600,
    keyGenerator: (userId: string) => `user:${userId}`
  })
  async getUserById(userId: string) {
    return await this.database.findUser(userId);
  }
  
  @CacheInvalidate({
    keys: [(userId: string) => `user:${userId}`]
  })
  async updateUser(userId: string, data: UpdateUserDto) {
    return await this.database.updateUser(userId, data);
  }
}
```

---

## Database Operations

### Prevent N+1 Queries

```typescript
import { preventN1 } from '@white-cross/reuse/core/database/optimization';

// Bad: N+1 query problem
async function getBadOrders() {
  const orders = await Order.findAll();
  
  for (const order of orders) {
    order.customer = await Customer.findByPk(order.customerId); // N queries!
  }
  
  return orders;
}

// Good: Single query with eager loading
async function getGoodOrders() {
  const orders = await Order.findAll({
    include: [
      { model: Customer, as: 'customer' },
      { model: OrderItem, as: 'items' }
    ]
  });
  
  return orders;
}

// Better: Use DataLoader
import { DataLoaderService } from '@white-cross/reuse/core/database/optimization';

const customerLoader = DataLoaderService.createLoader(
  async (ids: string[]) => {
    const customers = await Customer.findAll({
      where: { id: ids }
    });
    return ids.map(id => customers.find(c => c.id === id));
  }
);

async function getOrdersWithLoader() {
  const orders = await Order.findAll();
  
  // Batched query - only 1 additional query!
  for (const order of orders) {
    order.customer = await customerLoader.load(order.customerId);
  }
  
  return orders;
}
```

### Bulk Operations

```typescript
import { bulkInsert, bulkUpdate } from '@white-cross/reuse/core/database/optimization';

// Bulk insert users
async function importUsers(userData: any[]) {
  await bulkInsert(User, userData, {
    batch: 1000, // Insert 1000 at a time
    updateOnDuplicate: ['email', 'firstName', 'lastName'],
    validate: true
  });
}

// Bulk update
async function deactivateUsers(userIds: string[]) {
  await bulkUpdate(User, 
    { status: 'inactive', deactivatedAt: new Date() },
    { where: { id: userIds } }
  );
}
```

---

## Error Handling

### Global Exception Filter

```typescript
import { GlobalExceptionFilter } from '@white-cross/reuse/core/errors';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter
    }
  ]
})
export class AppModule {}
```

### Custom Business Exception

```typescript
import { BusinessException } from '@white-cross/reuse/core/errors';

class InsufficientFundsException extends BusinessException {
  constructor(accountId: string, requested: number, available: number) {
    super(
      'INSUFFICIENT_FUNDS',
      `Account ${accountId} has insufficient funds. Requested: $${requested}, Available: $${available}`,
      {
        accountId,
        requested,
        available
      }
    );
  }
}

// Use it
if (account.balance < amount) {
  throw new InsufficientFundsException(account.id, amount, account.balance);
}
```

---

## Validation

### Zod Schema Validation

```typescript
import { createZodSchema } from '@white-cross/reuse/core/validation';
import { z } from 'zod';

const CreateUserSchema = createZodSchema({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  dateOfBirth: z.date().max(new Date())
});

@Post('users')
async createUser(@Body() dto: z.infer<typeof CreateUserSchema>) {
  // Validate
  const validated = CreateUserSchema.parse(dto);
  
  // Create user
  return await this.userService.create(validated);
}
```

---

## Construction Projects

### Create Construction Project

```typescript
import { createConstructionProject } from '@white-cross/reuse/domain/construction';

async function createProject(data: any) {
  const project = await createConstructionProject({
    projectNumber: 'PROJ-2024-001',
    projectName: 'Hospital Expansion Wing',
    projectDescription: 'New 50,000 sq ft expansion',
    status: ConstructionProjectStatus.PLANNING,
    phase: ProjectPhase.INITIATION,
    deliveryMethod: 'Design-Bid-Build',
    plannedStartDate: new Date('2024-01-01'),
    plannedEndDate: new Date('2025-12-31'),
    totalBudget: 5000000
  }, sequelize);
  
  return project;
}
```

---

**Last Updated**: 2025-11-09

**Navigation**: [← Back to Main](./README.md) | [Function Catalog →](./FUNCTION-CATALOG.md) | [Navigation →](./NAVIGATION.md)
