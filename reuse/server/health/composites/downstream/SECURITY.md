# Security Implementation for Healthcare Downstream Composites

## Overview

This document describes the comprehensive security infrastructure implemented for all healthcare downstream composite services in compliance with HIPAA Security Rule and DEA EPCS regulations.

## Table of Contents

1. [Security Architecture](#security-architecture)
2. [Authentication & Authorization](#authentication--authorization)
3. [PHI Access Control](#phi-access-control)
4. [Audit Logging](#audit-logging)
5. [Input Validation](#input-validation)
6. [Encryption](#encryption)
7. [Rate Limiting](#rate-limiting)
8. [HIPAA Compliance](#hipaa-compliance)
9. [Implementation Guide](#implementation-guide)

## Security Architecture

### Layered Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway / Load Balancer              │
│                     (Rate Limiting, DDoS Protection)         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     JWT Authentication Guard                 │
│                     (Token Validation)                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     RBAC Guard                               │
│                     (Role-Based Access Control)              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     PHI Access Guard                         │
│                     (HIPAA-Compliant PHI Protection)         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     Input Validation Pipe                    │
│                     (DTO Validation with class-validator)    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                            │
│                     (Business Logic)                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     Audit Logging Interceptor                │
│                     (HIPAA Audit Trail)                      │
└─────────────────────────────────────────────────────────────┘
```

### Shared Security Infrastructure

Located in `/reuse/server/health/composites/shared/`:

```
shared/
├── guards/
│   ├── jwt-auth.guard.ts          # JWT token validation
│   ├── rbac.guard.ts               # Role-based access control
│   └── phi-access.guard.ts         # PHI access verification
├── services/
│   ├── audit-logging.service.ts   # HIPAA-compliant audit logging
│   └── encryption.service.ts      # Data encryption (AES-256-GCM)
├── decorators/
│   ├── auth.decorators.ts         # @Roles, @RequirePhiAccess, etc.
│   └── audit-log.decorator.ts     # @AuditLog decorator
├── interceptors/
│   └── audit-logging.interceptor.ts # Automatic audit logging
├── pipes/
│   └── validation.pipe.ts         # Input validation with sanitization
├── dto/
│   ├── common.dto.ts              # Common DTOs
│   ├── medication.dto.ts          # Medication/prescription DTOs
│   └── clinical.dto.ts            # Clinical data DTOs
└── index.ts                        # Centralized exports
```

## Authentication & Authorization

### JWT Authentication

All API endpoints require valid JWT tokens in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

**JWT Payload Structure:**
```typescript
{
  id: string;              // User ID
  email: string;           // User email
  role: UserRole;          // User role (enum)
  permissions: string[];   // Granular permissions
  facilityId?: string;     // Associated facility
  providerId?: string;     // Provider ID (for clinicians)
  iat: number;             // Issued at
  exp: number;             // Expiration
}
```

**Token Expiration:**
- Access tokens: 15 minutes
- Refresh tokens: 7 days
- Token refresh warning: 5 minutes before expiration

### Role-Based Access Control (RBAC)

**User Roles (Hierarchical):**
```typescript
enum UserRole {
  SUPER_ADMIN = 'super_admin',      // Full system access
  ADMIN = 'admin',                   // Facility administration
  PHYSICIAN = 'physician',           // Full clinical access
  NURSE = 'nurse',                   // Clinical care access
  PHARMACIST = 'pharmacist',         // Medication access
  LAB_TECH = 'lab_tech',            // Laboratory access
  BILLING = 'billing',               // Billing/insurance access
  PATIENT = 'patient',               // Self-access only
  CARE_COORDINATOR = 'care_coordinator',
  SOCIAL_WORKER = 'social_worker',
  RADIOLOGIST = 'radiologist',
  THERAPIST = 'therapist',
  EMERGENCY_RESPONDER = 'emergency_responder',
}
```

**Usage Example:**
```typescript
@Controller('medications')
export class MedicationsController {
  @Post()
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Roles(UserRole.PHYSICIAN, UserRole.NURSE)
  @RequirePermissions('medications:write')
  async prescribeMedication(@Body() dto: PrescriptionDto) {
    // Only physicians and nurses with medications:write permission
  }
}
```

## PHI Access Control

### HIPAA-Compliant Access Verification

The `PhiAccessGuard` enforces:
1. **Legitimate Relationship** - User must have active relationship with patient
2. **Patient Consent** - Consent must be current and not revoked
3. **Minimum Necessary** - Only access data required for task
4. **Access Reason** - All PHI access requires documented reason

### PHI Access Types
```typescript
enum PhiAccessType {
  VIEW_BASIC = 'view_basic',
  VIEW_MEDICAL_RECORDS = 'view_medical_records',
  VIEW_LAB_RESULTS = 'view_lab_results',
  VIEW_MEDICATIONS = 'view_medications',
  VIEW_PRESCRIPTIONS = 'view_prescriptions',
  EDIT_MEDICAL_RECORDS = 'edit_medical_records',
  PRESCRIBE_MEDICATIONS = 'prescribe_medications',
  VIEW_BILLING = 'view_billing',
  VIEW_INSURANCE = 'view_insurance',
  EMERGENCY_ACCESS = 'emergency_access',
}
```

### Break-Glass Emergency Access

For true emergencies, providers can use break-glass access:

**HTTP Headers:**
```
X-Break-Glass: true
X-Emergency-Reason: "Patient experiencing cardiac arrest, need immediate access to medication history"
```

**Automatic Actions:**
- Immediate security alert to security team
- Critical severity audit log
- Email notification to compliance officer
- Real-time SIEM alert

**Usage Example:**
```typescript
@Get('patients/:id/emergency-records')
@UseGuards(JwtAuthGuard, RbacGuard, PhiAccessGuard)
@Roles(UserRole.PHYSICIAN, UserRole.NURSE, UserRole.EMERGENCY_RESPONDER)
@AllowBreakGlass()
async getEmergencyRecords(@Param('id') patientId: string) {
  // Break-glass access allowed with audit
}
```

## Audit Logging

### HIPAA-Required Audit Trail

All PHI access is logged with:
- User ID and role
- Patient ID
- Action performed
- Timestamp (UTC)
- IP address
- User agent
- Access reason
- Data fields accessed
- Outcome (success/failure)

### Audit Event Types
```typescript
enum AuditEventType {
  // Authentication
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,

  // PHI Access
  PHI_VIEW,
  PHI_CREATE,
  PHI_UPDATE,
  PHI_DELETE,

  // Medications
  MEDICATION_PRESCRIBED,
  MEDICATION_ADMINISTERED,
  CONTROLLED_SUBSTANCE_PRESCRIBED,
  EPCS_PRESCRIPTION,

  // Emergency
  BREAK_GLASS_ACCESS,

  // Security
  UNAUTHORIZED_ACCESS_ATTEMPT,
  SUSPICIOUS_ACTIVITY,
  SECURITY_VIOLATION,
}
```

### Automatic Audit Logging

Use the `@AuditLog` decorator for automatic audit logging:

```typescript
@Post('medications')
@AuditLog({
  eventType: AuditEventType.MEDICATION_PRESCRIBED,
  severity: AuditSeverity.HIGH,
  includeRequestBody: true,
  resourceType: 'prescription'
})
async prescribeMedication(@Body() dto: PrescriptionDto) {
  // Automatically logged
}
```

### Audit Log Retention

- **Standard audit logs:** 6 years (HIPAA requirement)
- **Controlled substance logs:** 7 years (DEA requirement)
- **EPCS logs:** 10 years (DEA EPCS requirement)
- **Break-glass access logs:** Permanent retention

## Input Validation

### DTO Validation with class-validator

All request bodies, query parameters, and route parameters are validated:

**Example DTO:**
```typescript
export class CreatePrescriptionDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  patientId: string;

  @ApiProperty({ description: 'Medication name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  medicationName: string;

  @ApiProperty({ description: 'Dosage' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  dosage: string;

  @ApiProperty({ description: 'Route', enum: MedicationRoute })
  @IsEnum(MedicationRoute)
  route: MedicationRoute;

  // ... more fields
}
```

### Input Sanitization

The `SecureValidationPipe` automatically:
- Removes null bytes
- Detects SQL injection patterns (logged, not blocked - use parameterized queries)
- Escapes HTML entities (XSS prevention)
- Strips unknown properties (whitelist mode)
- Validates against DTO schema

## Encryption

### Data Encryption at Rest

**Algorithm:** AES-256-GCM (Galois/Counter Mode)

**Fields Requiring Encryption:**
- Social Security Numbers (SSN)
- Tax ID Numbers
- Credit Card Numbers
- Bank Account Numbers
- Driver's License Numbers
- Other government-issued IDs

**Usage:**
```typescript
// Encrypt sensitive data before storage
const encryptedSSN = this.encryptionService.encrypt(patient.ssn);

// Decrypt when needed
const decryptedSSN = this.encryptionService.decrypt(encryptedSSN);

// Mask for display
const maskedSSN = this.encryptionService.maskData(ssn, 4); // "*****6789"
```

### Password Hashing

**Algorithm:** bcrypt with 12 salt rounds

```typescript
const hashedPassword = await this.encryptionService.hashPassword(password);
const isValid = await this.encryptionService.comparePassword(password, hash);
```

### Data in Transit

All API endpoints MUST be served over HTTPS/TLS 1.3:
- Certificate: Minimum 2048-bit RSA or 256-bit ECC
- Cipher suites: Strong ciphers only (no RC4, no weak DH)
- HSTS enabled with preload directive

## Rate Limiting

### Throttle Configuration

**Global limits:**
- 60 requests per minute per user
- 10 requests per minute for unauthenticated endpoints

**Endpoint-specific limits:**
```typescript
@Post('login')
@ThrottleLimit(5)      // 5 requests
@ThrottleTtl(60)       // per minute
async login(@Body() dto: LoginDto) {
  // Rate limited to prevent brute force
}

@Post('prescriptions/epcs')
@ThrottleLimit(10)     // 10 EPCS prescriptions
@ThrottleTtl(3600)     // per hour
async createEPCSPrescription(@Body() dto: EPCSPrescriptionDto) {
  // Rate limited controlled substance prescriptions
}
```

## HIPAA Compliance

### Security Rule Implementation

| HIPAA Requirement | Implementation |
|-------------------|----------------|
| § 164.308(a)(1)(ii)(D) - Audit Controls | `AuditLoggingService` logs all PHI access |
| § 164.308(a)(3) - Access Control | `JwtAuthGuard`, `RbacGuard`, `PhiAccessGuard` |
| § 164.308(a)(4) - Transmission Security | TLS 1.3 for all traffic |
| § 164.308(a)(5)(ii)(C) - Login Monitoring | Failed login tracking with account lockout |
| § 164.312(a)(1) - Unique User Identification | JWT with unique user IDs |
| § 164.312(a)(2)(i) - Emergency Access | Break-glass access with audit |
| § 164.312(a)(2)(iv) - Encryption | AES-256-GCM for sensitive data |
| § 164.312(b) - Audit Logs | Immutable audit trail with 6+ year retention |
| § 164.312(c)(1) - Integrity Controls | Digital signatures for EPCS |
| § 164.312(d) - Person or Entity Authentication | Multi-factor authentication for EPCS |

### Privacy Rule Implementation

- **Minimum Necessary:** PHI access limited by role and relationship
- **Authorization:** Patient consent verification before PHI access
- **Accounting of Disclosures:** All PHI disclosures logged
- **Patient Rights:** Patients can view audit logs of their PHI access

## Implementation Guide

### Step 1: Add Security Infrastructure to Service

```typescript
import {
  Injectable,
  Logger,
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  JwtAuthGuard,
  RbacGuard,
  PhiAccessGuard,
  UserRole,
  PhiAccessType,
  AuditLoggingService,
  EncryptionService,
  AuditLoggingInterceptor,
  UserPayload,
} from '../shared';
import {
  Roles,
  RequirePhiAccess,
  CurrentUser,
  IpAddress,
  AccessReason,
} from '../shared/decorators/auth.decorators';

@Injectable()
export class YourService {
  constructor(
    private readonly auditService: AuditLoggingService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async yourMethod(data: any, user: UserPayload, ip: string) {
    // Log PHI access
    await this.auditService.logPhiAccess({
      userId: user.id,
      userRole: user.role,
      patientId: data.patientId,
      action: PhiAccessType.VIEW_MEDICAL_RECORDS,
      resourceType: 'medical_records',
      resourceId: data.patientId,
      accessReason: 'Routine patient care',
      ipAddress: ip,
      outcome: 'success',
    });

    // Your business logic
  }
}
```

### Step 2: Create DTOs with Validation

```typescript
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class YourDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  patientId: string;

  // Add all fields with validators
}
```

### Step 3: Add Controller with Guards

```typescript
@Controller('api/v1/your-endpoint')
@ApiTags('Your Service')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RbacGuard, PhiAccessGuard)
@UseInterceptors(AuditLoggingInterceptor)
export class YourController {
  constructor(private readonly yourService: YourService) {}

  @Post()
  @ApiOperation({ summary: 'Your endpoint description' })
  @Roles(UserRole.PHYSICIAN, UserRole.NURSE)
  @RequirePhiAccess(PhiAccessType.VIEW_MEDICAL_RECORDS)
  async yourEndpoint(
    @Body() dto: YourDto,
    @CurrentUser() user: UserPayload,
    @IpAddress() ip: string,
    @AccessReason() reason: string,
  ) {
    return this.yourService.yourMethod(dto, user, ip);
  }
}
```

### Step 4: Register Global Pipes

In `main.ts`:
```typescript
import { ValidationPipe } from '@nestjs/common';
import { SecureValidationPipe } from './shared/pipes/validation.pipe';

app.useGlobalPipes(
  new SecureValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

## Security Testing

### Required Security Tests

1. **Authentication Tests**
   - Invalid JWT tokens rejected
   - Expired tokens rejected
   - Malformed tokens rejected

2. **Authorization Tests**
   - Role restrictions enforced
   - Permission checks working
   - PHI access verification

3. **Input Validation Tests**
   - Invalid data rejected
   - SQL injection attempts logged
   - XSS attempts sanitized

4. **Audit Logging Tests**
   - All PHI access logged
   - Log integrity maintained
   - Break-glass access triggers alerts

5. **Encryption Tests**
   - Sensitive data encrypted
   - Decryption works correctly
   - Key rotation supported

## Security Incident Response

### Incident Types and Actions

| Incident | Automatic Action | Manual Action Required |
|----------|------------------|------------------------|
| Break-glass access | Alert security team | Review within 1 hour |
| Failed login (5x) | Lock account 30 minutes | Review suspicious IPs |
| Unauthorized access attempt | Log and block | Investigate user |
| Controlled substance discrepancy | Alert pharmacy/DEA | Investigate within 24h |
| EPCS 2FA failure | Block prescription | Contact prescriber |
| Suspicious data export | Alert compliance | Review export reason |

### Contact Information

- **Security Team:** security@whitecross.health
- **Compliance Officer:** compliance@whitecross.health
- **HIPAA Privacy Officer:** privacy@whitecross.health
- **Incident Hotline:** 1-800-XXX-XXXX (24/7)

## Compliance Audits

### Audit Preparation

**Required documentation:**
1. Security policies and procedures
2. Audit log samples (last 90 days)
3. Access control matrices
4. Encryption key management procedures
5. Incident response logs
6. Security training records

**Automated audit reports available:**
- PHI access by user
- Break-glass access events
- Failed authentication attempts
- Controlled substance prescriptions
- Data export activities

## References

- [HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/index.html)
- [DEA EPCS Requirements](https://www.deadiversion.usdoj.gov/ecomm/e_rx/)
- [NestJS Security Best Practices](https://docs.nestjs.com/security/authentication)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

**Last Updated:** 2025-11-10
**Version:** 1.0.0
**Maintained by:** White Cross Security Team
