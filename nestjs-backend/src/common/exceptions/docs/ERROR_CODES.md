# Error Codes Reference

This document provides a complete reference of all error codes used in the NestJS backend.

## Error Code Format

Error codes follow the format: `CATEGORY_NNN`

- **CATEGORY**: 3-8 letter code indicating error category
- **NNN**: 3-digit sequential number

## Categories

### Authentication (AUTH_xxx)

| Code | Description | HTTP Status |
|------|-------------|-------------|
| AUTH_001 | Invalid credentials | 401 |
| AUTH_002 | Account locked | 401 |
| AUTH_003 | Account disabled | 401 |
| AUTH_004 | Token expired | 401 |
| AUTH_005 | Token invalid | 401 |
| AUTH_006 | Refresh token invalid | 401 |
| AUTH_007 | Session expired | 401 |
| AUTH_008 | MFA required | 401 |
| AUTH_009 | MFA invalid | 401 |
| AUTH_010 | Password expired | 401 |
| AUTH_011 | Weak password | 400 |

### Authorization (AUTHZ_xxx)

| Code | Description | HTTP Status |
|------|-------------|-------------|
| AUTHZ_001 | Insufficient permissions | 403 |
| AUTHZ_002 | Role required | 403 |
| AUTHZ_003 | Resource forbidden | 403 |
| AUTHZ_004 | Organization access denied | 403 |
| AUTHZ_005 | Feature not enabled | 403 |
| AUTHZ_006 | IP restricted | 403 |
| AUTHZ_007 | Time restricted | 403 |

### Validation (VALID_xxx)

| Code | Description | HTTP Status |
|------|-------------|-------------|
| VALID_001 | Required field missing | 400 |
| VALID_002 | Invalid format | 400 |
| VALID_003 | Invalid type | 400 |
| VALID_004 | Out of range | 400 |
| VALID_005 | Invalid length | 400 |
| VALID_006 | Invalid pattern | 400 |
| VALID_007 | Invalid enum value | 400 |
| VALID_008 | Invalid email | 400 |
| VALID_009 | Invalid phone | 400 |
| VALID_010 | Invalid date | 400 |
| VALID_011 | Invalid SSN | 400 |
| VALID_012 | Invalid MRN | 400 |
| VALID_013 | Invalid NPI | 400 |
| VALID_014 | Invalid ICD-10 | 400 |
| VALID_015 | Invalid dosage | 400 |
| VALID_016 | Invalid file type | 400 |
| VALID_017 | File too large | 400 |
| VALID_018 | Invalid JSON | 400 |
| VALID_019 | Invalid UUID | 400 |
| VALID_020 | Duplicate entry | 400 |

### Business Logic (BUSINESS_xxx)

| Code | Description | HTTP Status |
|------|-------------|-------------|
| BUSINESS_001 | Resource not found | 404 |
| BUSINESS_002 | Resource already exists | 409 |
| BUSINESS_003 | Invalid state transition | 400 |
| BUSINESS_004 | Constraint violation | 400 |
| BUSINESS_005 | Concurrent modification | 409 |
| BUSINESS_006 | Dependency exists | 400 |
| BUSINESS_007 | Dependency missing | 400 |
| BUSINESS_008 | Quota exceeded | 400 |
| BUSINESS_009 | Operation not allowed | 400 |
| BUSINESS_010 | Invalid operation | 400 |

### Healthcare (HEALTH_xxx)

#### Consent (HEALTH_001-099)

| Code | Description | HTTP Status |
|------|-------------|-------------|
| HEALTH_001 | Consent required | 400 |
| HEALTH_002 | Consent expired | 400 |
| HEALTH_003 | Consent revoked | 400 |
| HEALTH_004 | Parent authorization required | 400 |

#### Clinical Safety (HEALTH_101-199)

| Code | Description | HTTP Status |
|------|-------------|-------------|
| HEALTH_101 | Drug interaction detected | 400 |
| HEALTH_102 | Allergy conflict | 400 |
| HEALTH_103 | Dosage out of range | 400 |
| HEALTH_104 | Duplicate medication | 400 |
| HEALTH_105 | Contraindication detected | 400 |
| HEALTH_106 | Age restriction violated | 400 |

#### Medical Records (HEALTH_201-299)

| Code | Description | HTTP Status |
|------|-------------|-------------|
| HEALTH_201 | Invalid diagnosis code | 400 |
| HEALTH_202 | Incomplete medical history | 400 |
| HEALTH_203 | Vital signs out of range | 400 |
| HEALTH_204 | Vaccination overdue | 400 |
| HEALTH_205 | Vaccination too soon | 400 |

#### Appointments (HEALTH_301-399)

| Code | Description | HTTP Status |
|------|-------------|-------------|
| HEALTH_301 | Appointment conflict | 400 |
| HEALTH_302 | Appointment past due | 400 |
| HEALTH_303 | No available slots | 400 |
| HEALTH_304 | Provider unavailable | 400 |

#### Medication (HEALTH_401-499)

| Code | Description | HTTP Status |
|------|-------------|-------------|
| HEALTH_401 | Prescription expired | 400 |
| HEALTH_402 | Refill not allowed | 400 |
| HEALTH_403 | Medication discontinued | 400 |
| HEALTH_404 | Controlled substance violation | 400 |

#### Incidents (HEALTH_501-599)

| Code | Description | HTTP Status |
|------|-------------|-------------|
| HEALTH_501 | Incident requires review | 400 |
| HEALTH_502 | Incident notification required | 400 |

### Security (SECURITY_xxx)

| Code | Description | HTTP Status |
|------|-------------|-------------|
| SECURITY_001 | Rate limit exceeded | 429 |
| SECURITY_002 | Suspicious activity detected | 403 |
| SECURITY_003 | XSS attempt detected | 400 |
| SECURITY_004 | SQL injection attempt | 400 |
| SECURITY_005 | CSRF token invalid | 403 |
| SECURITY_006 | CSRF token missing | 403 |
| SECURITY_007 | IP blacklisted | 403 |
| SECURITY_008 | User agent blocked | 403 |
| SECURITY_009 | Encryption failed | 500 |
| SECURITY_010 | Decryption failed | 500 |

### System (SYSTEM_xxx)

| Code | Description | HTTP Status |
|------|-------------|-------------|
| SYSTEM_001 | Internal server error | 500 |
| SYSTEM_002 | Service unavailable | 503 |
| SYSTEM_003 | Database error | 500 |
| SYSTEM_004 | Database connection failed | 500 |
| SYSTEM_005 | Cache error | 500 |
| SYSTEM_006 | External service error | 500 |
| SYSTEM_007 | Timeout | 504 |
| SYSTEM_008 | Configuration error | 500 |
| SYSTEM_009 | Queue error | 500 |
| SYSTEM_010 | File system error | 500 |

### Compliance (COMPLY_xxx)

| Code | Description | HTTP Status |
|------|-------------|-------------|
| COMPLY_001 | HIPAA violation | 400 |
| COMPLY_002 | FERPA violation | 400 |
| COMPLY_003 | Audit log required | 400 |
| COMPLY_004 | Data retention violation | 400 |
| COMPLY_005 | PHI exposure risk | 400 |
| COMPLY_006 | Consent documentation missing | 400 |

## Client-Side Handling

### General Pattern

```typescript
try {
  await api.createStudent(data);
} catch (error) {
  switch (error.errorCode) {
    case 'AUTH_001':
      // Invalid credentials
      showLoginError();
      break;
    case 'VALID_009':
      // Invalid phone
      highlightPhoneField();
      break;
    case 'HEALTH_102':
      // Allergy conflict
      showAllergyWarning();
      break;
    default:
      // Generic error handling
      showGenericError(error.message);
  }
}
```

### Category-Based Handling

```typescript
const errorCategory = error.errorCode.split('_')[0];

switch (errorCategory) {
  case 'AUTH':
  case 'AUTHZ':
    // Redirect to login
    redirectToLogin();
    break;
  case 'VALID':
    // Show field-level errors
    showValidationErrors(error.errors);
    break;
  case 'HEALTH':
    // Show healthcare-specific warnings
    showHealthcareWarning(error);
    break;
  case 'SYSTEM':
    // Show retry option
    showRetryOption();
    break;
}
```

## Adding New Error Codes

1. Add code to appropriate category in `src/common/exceptions/constants/error-codes.ts`
2. Document in this file
3. Add to Swagger/OpenAPI documentation
4. Update client-side error handling
5. Add to monitoring/alerting rules if needed

## HIPAA Compliance

All error messages follow HIPAA compliance:

- Never include PHI in error messages
- Never include specific student/patient identifiers
- Use generic messages for client-facing errors
- Log detailed information server-side only
- Audit all security and healthcare errors
