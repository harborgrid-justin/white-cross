# White Cross Clinic Composites - Security Documentation

## Overview

This document outlines the comprehensive security measures implemented in the White Cross clinic composites to ensure HIPAA compliance, data protection, and secure healthcare operations.

## Security Architecture

### 1. Defense in Depth

The clinic composites implement multiple layers of security:

1. **Input Validation Layer** - All user inputs are validated and sanitized
2. **Authentication Layer** - JWT-based authentication with refresh tokens
3. **Authorization Layer** - Role-based access control (RBAC) with fine-grained permissions
4. **Data Protection Layer** - Encryption at rest and in transit
5. **Audit Layer** - Comprehensive HIPAA-compliant audit logging
6. **Rate Limiting Layer** - Protection against abuse and DDoS

### 2. HIPAA Compliance

All Protected Health Information (PHI) handling follows HIPAA requirements:

- **Access Controls**: Only authorized healthcare professionals can access PHI
- **Audit Trails**: All PHI access is logged with timestamp, user, and purpose
- **Data Minimization**: Only necessary PHI is collected and stored
- **Encryption**: PHI is encrypted in transit (TLS 1.3) and at rest (AES-256)
- **Breach Notification**: Security events are logged and monitored
- **Business Associate Agreements**: All third-party integrations require BAAs

## Security Features

### Input Validation and Sanitization

**Location**: `security-utils.ts` - `InputValidator` class

All user inputs are validated using the `InputValidator` utility class:

```typescript
import { InputValidator } from './security-utils';

// UUID validation
const studentId = InputValidator.validateUUID(req.studentId, 'Student ID');

// Search term sanitization (prevents SQL injection)
const searchTerm = InputValidator.sanitizeSearchTerm(req.searchTerm);

// String validation with length constraints
const complaint = InputValidator.validateString(
  req.complaint,
  'Chief Complaint',
  3,
  500
);

// Email validation
const email = InputValidator.validateEmail(req.email);

// Phone validation
const phone = InputValidator.validatePhone(req.phone);

// Enum validation
const severity = InputValidator.validateEnum(
  req.severity,
  TriageSeverity,
  'Triage Severity'
);

// Numeric range validation
const temperature = InputValidator.validateNumber(
  req.temperature,
  'Temperature',
  90,
  110
);
```

**Security Benefits**:
- Prevents SQL injection attacks
- Prevents XSS (Cross-Site Scripting)
- Prevents buffer overflow
- Ensures data integrity
- Provides clear error messages without leaking system information

### SQL Injection Prevention

**Implemented in**: All database query functions

**Protection Mechanisms**:

1. **Parameterized Queries**: All Sequelize queries use parameterized inputs
2. **Input Sanitization**: Search terms are sanitized to remove SQL metacharacters
3. **Query Builder**: Sequelize ORM prevents direct SQL injection
4. **Whitelist Validation**: Sort fields are validated against allowed list

**Example**:
```typescript
// BEFORE (Vulnerable):
const orders = await MedicationOrder.findAll({
  where: {
    medicationName: { [Op.iLike]: `%${searchTerm}%` }
  }
});

// AFTER (Secure):
const sanitizedTerm = InputValidator.sanitizeSearchTerm(searchTerm);
const orders = await MedicationOrder.findAll({
  where: {
    medicationName: { [Op.iLike]: `%${sanitizedTerm}%` }
  },
  limit: 100 // Prevent DOS via excessive results
});
```

### Authentication and Authorization

**Location**: `security-guards.ts`

#### Available Guards:

1. **RolesGuard** - Verifies user has required role
2. **HIPAAGuard** - Ensures PHI access is authorized and logged
3. **SchoolIsolationGuard** - Prevents cross-school data access
4. **ClinicSecurityGuard** - Comprehensive security check (combines all)
5. **RateLimitGuard** - Prevents abuse (100 requests/minute per user)

#### Usage Example:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ClinicSecurityGuard,
  Roles,
  HIPAAResource,
  RequireSameSchool,
  ClinicRole
} from './security-guards';

@Controller('clinic/medications')
@UseGuards(ClinicSecurityGuard)
export class MedicationController {

  @Get(':orderId')
  @Roles(ClinicRole.NURSE, ClinicRole.PHYSICIAN)
  @HIPAAResource('medication_order')
  @RequireSameSchool()
  async getMedicationOrder(@Param('orderId') orderId: string) {
    // Only nurses and physicians from the same school can access
    // PHI access is automatically logged
    return this.medicationService.getOrder(orderId);
  }
}
```

### HIPAA-Compliant Audit Logging

**Location**: `security-utils.ts` - `AuditLogger` class

All PHI access and security events are logged:

```typescript
import { AuditLogger } from './security-utils';

// Log PHI access (HIPAA requirement)
AuditLogger.logPHIAccess(
  'READ',
  'student_health_visit',
  visitId,
  userId,
  schoolId
);

// Log medication events
AuditLogger.logMedicationEvent(
  'ADMINISTERED',
  orderId,
  nurseId,
  schoolId
);

// Log security events
AuditLogger.logSecurityEvent(
  'AUTHZ_FAILURE',
  'Cross-school access attempt',
  userId,
  ipAddress
);

// Log data modifications
AuditLogger.logDataModification(
  'UPDATE',
  'medication_order',
  orderId,
  userId,
  changes
);
```

**Audit Log Contents**:
- Event type
- Timestamp (ISO 8601)
- User ID (who accessed)
- Resource type and ID (what was accessed)
- Operation (READ, CREATE, UPDATE, DELETE)
- School ID (organizational context)
- IP address (for security events)
- **NO PHI VALUES** (only metadata logged)

### Data Masking and Redaction

**Location**: `security-utils.ts` - `DataMasker` class

Sensitive data is masked when displayed or logged:

```typescript
import { DataMasker } from './security-utils';

// Mask SSN: 123-45-6789 → ***-**-6789
const maskedSSN = DataMasker.maskSSN(student.ssn);

// Mask phone: (555) 123-4567 → ***-***-4567
const maskedPhone = DataMasker.maskPhone(parent.phone);

// Mask email: john.doe@email.com → j***e@email.com
const maskedEmail = DataMasker.maskEmail(parent.email);

// Mask MRN: MRN123456 → ***3456
const maskedMRN = DataMasker.maskMRN(patient.mrn);

// Redact sensitive fields from objects
const safeObject = DataMasker.redactSensitiveFields(patientData);
// Returns: { ...patientData, ssn: '[REDACTED]', password: '[REDACTED]' }
```

### Rate Limiting

**Location**: `security-guards.ts` - `RateLimitGuard`

Prevents abuse and denial-of-service attacks:

- **Default**: 100 requests per minute per user
- **Tracking**: By user ID (authenticated) or IP (unauthenticated)
- **Window**: Rolling 1-minute window
- **Response**: 403 Forbidden when limit exceeded

```typescript
@Controller('clinic/search')
@UseGuards(RateLimitGuard)
export class SearchController {
  @Get('medications')
  async searchMedications(@Query('term') term: string) {
    // Maximum 100 searches per minute per user
    return this.medicationService.search(term);
  }
}
```

### Error Handling

All errors are handled securely without leaking sensitive information:

**Bad Example** (Information Leakage):
```typescript
// DON'T DO THIS
catch (error) {
  throw new Error(`Failed to find student ${studentId} in database table students: ${error.message}`);
}
```

**Good Example** (Secure):
```typescript
// DO THIS
catch (error) {
  logger.error(`Database error in getStudent: ${error.message}`, error.stack);
  throw new NotFoundException('Student not found');
}
```

### Query Sanitization

**Location**: `security-utils.ts` - `QuerySanitizer` class

Prevents SQL injection in dynamic queries:

```typescript
import { QuerySanitizer } from './security-utils';

// Sanitize ORDER BY clause
const allowedFields = ['visitDate', 'visitTime', 'severity'];
const orderBy = QuerySanitizer.sanitizeOrderBy(
  req.query.orderBy,
  allowedFields
);

// Sanitize pagination
const { limit, offset } = QuerySanitizer.sanitizePagination(
  req.query.limit,
  req.query.offset
);

// Validate WHERE parameters
QuerySanitizer.validateWhereParams(req.query);
```

## Security Best Practices

### For Developers

1. **Always validate input** - Use `InputValidator` for all user inputs
2. **Use guards on controllers** - Apply `@UseGuards(ClinicSecurityGuard)`
3. **Log PHI access** - Call `AuditLogger.logPHIAccess()` when reading PHI
4. **Mask sensitive data** - Use `DataMasker` before displaying or logging
5. **No hardcoded secrets** - Use environment variables
6. **No PHI in logs** - Log IDs, not values
7. **Parameterized queries** - Always use Sequelize ORM, never raw SQL
8. **Validate UUIDs** - Use `InputValidator.validateUUID()`
9. **Check authorization** - Use `AuthorizationHelper` in business logic
10. **Handle errors securely** - Don't leak internal details in error messages

### For Security Auditors

#### Checklist:

- [x] Input validation on all endpoints
- [x] SQL injection prevention
- [x] XSS prevention
- [x] Authentication required for all PHI access
- [x] Role-based authorization
- [x] School-level data isolation
- [x] HIPAA audit logging
- [x] Rate limiting
- [x] Secure error handling
- [x] Data masking
- [x] Query sanitization
- [x] No hardcoded credentials
- [x] No PHI in application logs

## Vulnerability Mitigations

### OWASP Top 10 Coverage

1. **A01:2021 - Broken Access Control**
   - ✅ Role-based access control (RolesGuard)
   - ✅ School-level isolation (SchoolIsolationGuard)
   - ✅ HIPAA authorization (HIPAAGuard)

2. **A02:2021 - Cryptographic Failures**
   - ✅ TLS 1.3 for data in transit
   - ✅ AES-256 for data at rest
   - ✅ JWT tokens with secure signing
   - ✅ Password hashing with bcrypt (12 rounds)

3. **A03:2021 - Injection**
   - ✅ Parameterized queries
   - ✅ Input sanitization
   - ✅ ORM usage (Sequelize)
   - ✅ SQL metacharacter filtering

4. **A04:2021 - Insecure Design**
   - ✅ Defense in depth architecture
   - ✅ Principle of least privilege
   - ✅ Secure defaults

5. **A05:2021 - Security Misconfiguration**
   - ✅ Helmet security headers
   - ✅ CORS configuration
   - ✅ No directory listing
   - ✅ Error messages don't leak info

6. **A06:2021 - Vulnerable Components**
   - ✅ Regular dependency updates
   - ✅ npm audit monitoring
   - ✅ Snyk security scanning

7. **A07:2021 - Authentication Failures**
   - ✅ JWT with refresh tokens
   - ✅ Rate limiting on auth endpoints
   - ✅ Account lockout after failed attempts
   - ✅ Session timeout

8. **A08:2021 - Data Integrity Failures**
   - ✅ Input validation
   - ✅ Digital signatures
   - ✅ Audit logging

9. **A09:2021 - Logging Failures**
   - ✅ Comprehensive audit logging
   - ✅ PHI access tracking
   - ✅ Security event monitoring
   - ✅ No PHI in logs

10. **A10:2021 - Server-Side Request Forgery**
    - ✅ URL validation
    - ✅ Whitelist-based external calls
    - ✅ No user-controlled URLs

## Compliance Standards

### HIPAA

- ✅ **164.308(a)(1)** - Security Management Process
- ✅ **164.308(a)(3)** - Workforce Security
- ✅ **164.308(a)(4)** - Access Management
- ✅ **164.310(d)** - Device and Media Controls
- ✅ **164.312(a)** - Access Control
- ✅ **164.312(b)** - Audit Controls
- ✅ **164.312(c)** - Integrity Controls
- ✅ **164.312(d)** - Person/Entity Authentication
- ✅ **164.312(e)** - Transmission Security

### FERPA

- ✅ School-level data isolation
- ✅ Parent consent tracking
- ✅ Student record access controls
- ✅ Audit trails for educational records

## Incident Response

### Security Event Types

1. **AUTH_FAILURE** - Failed authentication attempts
2. **AUTHZ_FAILURE** - Failed authorization (insufficient permissions)
3. **INVALID_ACCESS** - Unauthorized PHI access attempts
4. **SUSPICIOUS_ACTIVITY** - Rate limit violations, unusual patterns

### Automated Responses

- Rate limit violations → Temporary block
- Multiple auth failures → Account lockout
- Cross-school access → Access denied + alert
- Invalid PHI access → Access denied + escalation

### Manual Review Required

- 5+ failed login attempts in 10 minutes
- Any INVALID_ACCESS events
- Cross-school access attempts
- Bulk PHI exports

## Testing

### Security Test Coverage

```bash
# Run security tests
npm run test:security

# Run OWASP ZAP scan
npm run test:zap

# Run SQL injection tests
npm run test:sql-injection

# Run authentication tests
npm run test:auth

# Run authorization tests
npm run test:authz
```

### Penetration Testing

Regular penetration testing should include:

- SQL injection attempts
- XSS attempts
- CSRF attacks
- Authentication bypass
- Authorization bypass
- Rate limiting bypass
- Session hijacking
- PHI access without authorization

## Contact

For security concerns or to report vulnerabilities:

- **Security Team**: security@whitecross.health
- **Bug Bounty**: Available for responsible disclosure
- **Encryption**: PGP key available on website

## Version History

- **1.0.0** (2025-01-11) - Initial security implementation
  - Input validation
  - SQL injection prevention
  - HIPAA-compliant audit logging
  - Role-based access control
  - Rate limiting
  - Data masking

---

**Last Updated**: 2025-01-11
**Next Security Review**: 2025-04-11 (Quarterly)
