# Navigation Guide - Visual Reference

**Version**: 3.0.0
**Last Updated**: 2025-11-09

---

## Overview

This guide provides visual navigation through the reuse library with decision trees, dependency diagrams, and usage flowcharts to help you quickly find the right utilities.

---

## Table of Contents

1. [Quick Decision Trees](#quick-decision-trees)
2. [Library Structure Overview](#library-structure-overview)
3. [Import Path Patterns](#import-path-patterns)
4. [Common User Journeys](#common-user-journeys)
5. [Category Dependencies](#category-dependencies)
6. [Technology Stack Map](#technology-stack-map)

---

## Quick Decision Trees

### Decision Tree: "I need to..."

```
START: What do you need to do?
│
├─ 📧 Send notifications
│   ├─ Email? → infrastructure/notifications → sendEmailViaSendGrid()
│   ├─ SMS? → infrastructure/notifications → sendSMSViaTwilio()
│   └─ Push? → infrastructure/notifications → sendPushViaFCM()
│
├─ 🔐 Authenticate users
│   ├─ JWT tokens? → core/auth → generateAccessToken()
│   ├─ Password hashing? → core/auth → hashPassword()
│   ├─ 2FA? → core/auth → generate2FASecret()
│   └─ API keys? → core/auth → generateApiKey()
│
├─ 💾 Store data
│   ├─ Database? → core/database
│   │   ├─ Sequelize models? → core/database/models
│   │   ├─ Migrations? → core/database/migrations
│   │   └─ Queries? → core/database/queries
│   ├─ Files? → infrastructure/storage
│   │   ├─ Images? → resizeImage()
│   │   ├─ Videos? → transcodeVideo()
│   │   └─ S3/Azure? → uploadFile()
│   └─ Cache? → core/cache
│       ├─ Redis? → RedisCacheService
│       └─ Memory? → LRUCache
│
├─ ⚙️ Process in background
│   └─ infrastructure/background-jobs
│       ├─ One-time job? → createJob()
│       ├─ Recurring? → scheduleJob()
│       └─ Distributed? → DistributedLock
│
├─ 💳 Process payments
│   └─ infrastructure/payments
│       ├─ One-time? → createPaymentIntent()
│       ├─ Subscription? → createSubscription()
│       └─ Refund? → refundPayment()
│
├─ 🔍 Search data
│   └─ infrastructure/search
│       ├─ Full-text? → search()
│       ├─ Faceted? → facetedSearch()
│       └─ Geo? → geoSearch()
│
├─ ✅ Validate input
│   └─ core/validation
│       ├─ Email? → validateEmail()
│       ├─ Phone? → validatePhone()
│       ├─ Healthcare? → validateMRN()
│       └─ Custom? → createZodSchema()
│
├─ 🏗️ Construction project
│   └─ domain/construction
│       ├─ Create project? → createConstructionProject()
│       ├─ Track progress? → trackProjectProgress()
│       └─ Cost control? → calculateEarnedValue()
│
├─ 💰 Financial operations
│   └─ domain/financial
│       ├─ AML compliance? → domain/financial/aml-compliance
│       ├─ Accounting? → domain/financial/accounting
│       └─ Treasury? → domain/financial/treasury
│
└─ 📊 Logging & monitoring
    └─ infrastructure/logging
        ├─ Structured logs? → LoggerService
        ├─ Metrics? → MetricsService
        ├─ Tracing? → TracingService
        └─ Health checks? → HealthCheckService
```

---

## Library Structure Overview

```
reuse/
│
├─ 🎯 CORE - Platform Fundamentals
│   ├─ core/api/           - API design, versioning, documentation
│   ├─ core/auth/          - Authentication, authorization, security
│   ├─ core/cache/         - Caching strategies, Redis, LRU
│   ├─ core/config/        - Configuration, secrets, feature flags
│   ├─ core/database/      - Sequelize, queries, migrations, optimization
│   ├─ core/errors/        - Error handling, exceptions, monitoring
│   └─ core/validation/    - Input validation, sanitization, Zod
│
├─ 🏗️ INFRASTRUCTURE - Cloud Services
│   ├─ infrastructure/background-jobs/    - Queues, scheduling, sagas
│   ├─ infrastructure/notifications/      - Email, SMS, push
│   ├─ infrastructure/payments/           - Stripe, PayPal, Square
│   ├─ infrastructure/storage/            - S3, Azure, GCP, media processing
│   ├─ infrastructure/webhooks/           - Webhook delivery, verification
│   ├─ infrastructure/logging/            - Logging, metrics, tracing
│   ├─ infrastructure/rate-limiting/      - Rate limits, DDoS protection
│   └─ infrastructure/search/             - Elasticsearch, full-text search
│
├─ 🏢 DOMAIN - Industry-Specific
│   ├─ domain/construction/    - 18 kits for construction projects
│   ├─ domain/consulting/      - 10 kits for management consulting
│   ├─ domain/education/       - 26 kits for educational institutions
│   ├─ domain/engineering/     - 22 kits for engineering operations
│   ├─ domain/financial/       - 40 kits for financial services & AML
│   ├─ domain/property/        - 20 kits for property management
│   └─ domain/san/             - 69 kits for SAN/network/Oracle
│
├─ 🔌 INTEGRATIONS - Third-Party
│   ├─ integrations/aws/           - AWS SDK utilities
│   ├─ integrations/azure/         - Azure SDK utilities
│   ├─ integrations/google-cloud/  - GCP utilities
│   ├─ integrations/sendgrid/      - SendGrid helpers
│   ├─ integrations/twilio/        - Twilio helpers
│   └─ integrations/stripe/        - Stripe helpers
│
├─ 🚀 NESTJS - Framework Integration
│   ├─ nestjs/controllers/     - Controller utilities
│   ├─ nestjs/decorators/      - Custom decorators
│   ├─ nestjs/guards/          - Auth guards
│   ├─ nestjs/interceptors/    - Request/response interceptors
│   ├─ nestjs/middlewares/     - Custom middleware
│   ├─ nestjs/pipes/           - Validation pipes
│   └─ nestjs/services/        - Injectable services
│
├─ 📦 TYPES - TypeScript Definitions
│   ├─ types/common.ts         - Common types
│   ├─ types/healthcare.ts     - Healthcare-specific types
│   ├─ types/financial.ts      - Financial types
│   └─ types/[domain].ts       - Domain-specific types
│
└─ 🛠️ UTILS - General Utilities
    ├─ utils/data/             - Data transformation, import/export
    ├─ utils/http/             - HTTP client, interceptors
    ├─ utils/security/         - Encryption, hashing, sanitization
    └─ utils/typescript/       - TypeScript helpers
```

---

## Import Path Patterns

### Pattern 1: Import from Main Index (Everything)
```typescript
import { createJob, sendEmail, hashPassword } from '@white-cross/reuse';
```
**Use when**: Prototyping, need multiple utilities from different categories

---

### Pattern 2: Import from Category
```typescript
import { JwtAuthGuard, hashPassword } from '@white-cross/reuse/core/auth';
import { createJob, scheduleJob } from '@white-cross/reuse/infrastructure/background-jobs';
```
**Use when**: Production code, clear separation of concerns

---

### Pattern 3: Import Namespace
```typescript
import * as Jobs from '@white-cross/reuse/infrastructure/background-jobs';
import * as Auth from '@white-cross/reuse/core/auth';

await Jobs.createJob(...);
const token = Auth.generateAccessToken(...);
```
**Use when**: Using many functions from same category, avoiding naming conflicts

---

### Pattern 4: Import Specific Kit
```typescript
import { createConstructionProject } from '@white-cross/reuse/domain/construction';
import { validateMRN } from '@white-cross/reuse/core/validation';
```
**Use when**: Domain-specific functionality, clear intent

---

## Common User Journeys

### Journey 1: Building Authentication System

```
1. START: Need user authentication
   ↓
2. Choose: core/auth
   ↓
3. Install dependencies:
   - @nestjs/passport
   - @nestjs/jwt
   - bcrypt or argon2
   ↓
4. Import functions:
   - hashPassword()
   - validatePassword()
   - generateAccessToken()
   - JwtAuthGuard
   ↓
5. Create NestJS controller:
   ```typescript
   import { JwtAuthGuard, hashPassword } from '@white-cross/reuse/core/auth';
   
   @Controller('auth')
   export class AuthController {
     @Post('register')
     async register(@Body() dto: RegisterDto) {
       const hash = await hashPassword(dto.password);
       // Save user...
       const token = generateAccessToken(user);
       return { token };
     }
   }
   ```
   ↓
6. Add guards to protected routes:
   ```typescript
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles('admin')
   @Get('protected')
   async protected() { }
   ```
   ↓
7. DONE ✅
```

---

### Journey 2: Sending Transactional Emails

```
1. START: Need to send emails
   ↓
2. Choose: infrastructure/notifications
   ↓
3. Install dependencies:
   - @sendgrid/mail (or AWS SDK)
   - handlebars (for templates)
   ↓
4. Configure environment:
   SENDGRID_API_KEY=...
   ↓
5. Create email template:
   templates/welcome-email.hbs
   ↓
6. Import and send:
   ```typescript
   import { sendEmailViaSendGrid } from '@white-cross/reuse/infrastructure/notifications';
   
   await sendEmailViaSendGrid({
     to: 'user@example.com',
     from: 'noreply@app.com',
     subject: 'Welcome!',
     template: 'welcome-email',
     data: { name: 'John' }
   });
   ```
   ↓
7. (Optional) Queue for background:
   ```typescript
   import { createJob } from '@white-cross/reuse/infrastructure/background-jobs';
   
   await createJob(emailQueue, {
     name: 'send-email',
     data: emailData
   });
   ```
   ↓
8. DONE ✅
```

---

### Journey 3: Processing Payments

```
1. START: Need payment processing
   ↓
2. Choose: infrastructure/payments
   ↓
3. Install dependencies:
   - stripe (or paypal-rest-sdk)
   ↓
4. Configure API keys:
   STRIPE_SECRET_KEY=...
   ↓
5. Create payment intent:
   ```typescript
   import { createPaymentIntent } from '@white-cross/reuse/infrastructure/payments';
   
   const intent = await createPaymentIntent(5000, 'usd', {
     provider: 'stripe',
     customerId: 'cus_123',
     metadata: { orderId: 'ord_456' }
   });
   ```
   ↓
6. Handle webhook (optional):
   ```typescript
   import { verifyWebhook } from '@white-cross/reuse/infrastructure/webhooks';
   
   const isValid = verifyWebhook(req.body, signature, secret);
   if (isValid) {
     // Process payment confirmation
   }
   ```
   ↓
7. DONE ✅
```

---

### Journey 4: Background Job Processing

```
1. START: Need background jobs
   ↓
2. Choose: infrastructure/background-jobs
   ↓
3. Install dependencies:
   - @nestjs/bull
   - bull
   - redis or ioredis
   ↓
4. Configure Redis:
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ↓
5. Create job queue:
   ```typescript
   import { createJob } from '@white-cross/reuse/infrastructure/background-jobs';
   
   const job = await createJob(reportQueue, {
     name: 'generate-report',
     data: { userId: '123', month: 'January' },
     options: {
       attempts: 3,
       backoff: { type: 'exponential', delay: 5000 }
     }
   });
   ```
   ↓
6. Create job processor:
   ```typescript
   @Processor('reports')
   export class ReportProcessor {
     @Process('generate-report')
     async process(job: Job) {
       // Generate report
       return { success: true };
     }
   }
   ```
   ↓
7. Schedule recurring jobs:
   ```typescript
   import { scheduleJob } from '@white-cross/reuse/infrastructure/background-jobs';
   
   await scheduleJob(reportQueue, {
     name: 'daily-cleanup',
     cron: '0 2 * * *',
     data: {}
   });
   ```
   ↓
8. DONE ✅
```

---

## Category Dependencies

### Core Dependencies
```
core/
├─ auth
│   └─ depends on: validation, errors, cache (for sessions)
├─ cache
│   └─ depends on: config (for Redis connection)
├─ database
│   └─ depends on: config, errors, validation
├─ config
│   └─ depends on: validation, errors
├─ errors
│   └─ depends on: (no dependencies)
└─ validation
    └─ depends on: errors
```

### Infrastructure Dependencies
```
infrastructure/
├─ background-jobs
│   └─ depends on: core/config, core/errors
├─ notifications
│   └─ depends on: background-jobs, core/validation
├─ payments
│   └─ depends on: webhooks, core/validation
├─ storage
│   └─ depends on: core/config, core/errors
└─ webhooks
    └─ depends on: background-jobs, core/validation
```

### Domain Dependencies
```
domain/
├─ construction
│   └─ depends on: core/database, core/validation
├─ financial
│   └─ depends on: core/database, core/validation, core/auth (RBAC)
└─ [other domains]
    └─ depends on: core/*, infrastructure/* as needed
```

---

## Technology Stack Map

```
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                        │
│         (Your NestJS Controllers & Services)                 │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   REUSE LIBRARY (This)                       │
│  ┌──────────────┬──────────────┬──────────────────────────┐ │
│  │ CORE         │ INFRA        │ DOMAIN                   │ │
│  │ - Auth       │ - Jobs       │ - Construction           │ │
│  │ - Cache      │ - Notify     │ - Financial              │ │
│  │ - Database   │ - Payments   │ - Property               │ │
│  │ - Validation │ - Storage    │ - [Others]               │ │
│  └──────────────┴──────────────┴──────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  FRAMEWORK & LIBRARIES                       │
│  NestJS | Sequelize | Zod | Bull | Winston | Prometheus    │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 EXTERNAL SERVICES                            │
│  PostgreSQL | Redis | S3 | SendGrid | Stripe | Twilio      │
└─────────────────────────────────────────────────────────────┘
```

---

## Search Strategy

### By Use Case
1. Check [Quick Decision Trees](#quick-decision-trees)
2. Follow the flowchart to your category
3. Import and use

### By Technology
1. Know what tech you're using? (e.g., "Stripe")
2. Search for "Stripe" in this file
3. Find: `infrastructure/payments`

### By Domain
1. Building construction app?
2. Go to: `domain/construction/`
3. Browse available kits

---

## Quick Reference

| I need to... | Go to | Key Functions |
|-------------|-------|---------------|
| Authenticate users | `core/auth` | `generateAccessToken()`, `JwtAuthGuard` |
| Send emails | `infrastructure/notifications` | `sendEmailViaSendGrid()` |
| Queue background jobs | `infrastructure/background-jobs` | `createJob()`, `scheduleJob()` |
| Process payments | `infrastructure/payments` | `createPaymentIntent()` |
| Upload files | `infrastructure/storage` | `uploadFile()`, `resizeImage()` |
| Cache data | `core/cache` | `CacheService`, `RedisCacheService` |
| Validate input | `core/validation` | `validateEmail()`, `createZodSchema()` |
| Handle errors | `core/errors` | `GlobalExceptionFilter`, `CircuitBreaker` |
| Manage construction projects | `domain/construction` | `createConstructionProject()` |
| AML compliance | `domain/financial/aml-compliance` | Transaction monitoring kits |

---

**Last Updated**: 2025-11-09
**Maintained By**: Development Team

**Navigation**: [← Back to Main](./README.md) | [Function Catalog →](./FUNCTION-CATALOG.md) | [Quick Reference →](./QUICK-REFERENCE.md)
