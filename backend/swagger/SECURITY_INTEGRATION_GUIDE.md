# White Cross API - Security Documentation Integration Guide

## Overview

This guide explains how to integrate the comprehensive security documentation from `security-schemes.yaml` into your OpenAPI/Swagger specification and how to properly apply security requirements to API endpoints.

**Document Location**: `backend/swagger/security-schemes.yaml`
**Last Updated**: 2025-10-23
**Maintained By**: API Architecture Team

---

## Table of Contents

1. [Integration with OpenAPI Specification](#integration-with-openapi-specification)
2. [Applying Security to Endpoints](#applying-security-to-endpoints)
3. [Security Scheme Reference](#security-scheme-reference)
4. [Endpoint-Specific Security Examples](#endpoint-specific-security-examples)
5. [Testing Authentication](#testing-authentication)
6. [Documentation Best Practices](#documentation-best-practices)

---

## Integration with OpenAPI Specification

### Method 1: Direct Inclusion (Recommended)

Include the security schemes directly in your main OpenAPI specification:

```yaml
# backend/swagger/openapi.yaml
openapi: 3.0.3
info:
  title: White Cross Healthcare Platform API
  version: 1.0.0
  description: |
    HIPAA-compliant school health management system API

    ## Authentication

    This API uses JWT Bearer token authentication as the primary method.
    OAuth 2.0 (Google/Microsoft) is available for enterprise SSO.

    See the Security Schemes section for detailed authentication documentation.

servers:
  - url: https://api.whitecross.health
    description: Production server
  - url: https://staging-api.whitecross.health
    description: Staging server
  - url: http://localhost:3001
    description: Local development server

# Import security schemes
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: |
        JWT Bearer token authentication. Include token in Authorization header.

        Example: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

        Obtain token via POST /api/auth/login

    GoogleOAuth:
      type: oauth2
      description: Google OAuth 2.0 Single Sign-On
      flows:
        authorizationCode:
          authorizationUrl: https://accounts.google.com/o/oauth2/v2/auth
          tokenUrl: https://oauth2.googleapis.com/token
          scopes:
            openid: OpenID Connect authentication
            email: Access user email address
            profile: Access basic profile information

    MicrosoftOAuth:
      type: oauth2
      description: Microsoft OAuth 2.0 Single Sign-On
      flows:
        authorizationCode:
          authorizationUrl: https://login.microsoftonline.com/common/oauth2/v2.0/authorize
          tokenUrl: https://login.microsoftonline.com/common/oauth2/v2.0/token
          scopes:
            user.read: Read user profile information

    SessionAuth:
      type: apiKey
      in: cookie
      name: white-cross-session
      description: Session-based cookie authentication for web UI

    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key
      description: API key for integration partners and service-to-service communication

# Default security requirement (can be overridden per endpoint)
security:
  - BearerAuth: []

paths:
  # Your API endpoints here
  /api/students:
    get:
      summary: List all students
      description: Retrieve a paginated list of students accessible to the authenticated user
      tags:
        - Students
      security:
        - BearerAuth: []
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 10
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  students:
                    type: array
                    items:
                      $ref: '#/components/schemas/Student'
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '403':
          $ref: '#/components/responses/ForbiddenError'
```

### Method 2: External Reference

Reference the security schemes file as an external document:

```yaml
# backend/swagger/openapi.yaml
openapi: 3.0.3
info:
  title: White Cross Healthcare Platform API
  version: 1.0.0

externalDocs:
  description: Security Documentation
  url: ./security-schemes.yaml

components:
  securitySchemes:
    $ref: './security-schemes.yaml#/components/securitySchemes'
```

---

## Applying Security to Endpoints

### Global Security (All Endpoints)

Apply security to all endpoints by default:

```yaml
# Applies BearerAuth to all endpoints unless overridden
security:
  - BearerAuth: []
```

### Endpoint-Specific Security

Override global security for specific endpoints:

```yaml
paths:
  # Public endpoint - no authentication required
  /api/auth/login:
    post:
      summary: User login
      security: []  # Empty array = no security required
      # ...

  # JWT authentication required
  /api/students:
    get:
      summary: List students
      security:
        - BearerAuth: []
      # ...

  # Multiple authentication options (OR logic)
  /api/integration/status:
    get:
      summary: Integration status
      security:
        - BearerAuth: []
        - ApiKeyAuth: []
      # Either Bearer token OR API key accepted
      # ...

  # Multiple schemes required (AND logic - rare)
  /api/admin/critical-operation:
    post:
      summary: Critical admin operation
      security:
        - BearerAuth: []
          ApiKeyAuth: []
      # Both Bearer token AND API key required
      # ...
```

---

## Security Scheme Reference

### Available Security Schemes

| Scheme | Type | Use Case | Header/Cookie |
|--------|------|----------|---------------|
| **BearerAuth** | HTTP Bearer | Primary API authentication | `Authorization: Bearer <token>` |
| **GoogleOAuth** | OAuth 2.0 | Enterprise SSO (Google) | Managed by OAuth flow |
| **MicrosoftOAuth** | OAuth 2.0 | Enterprise SSO (Microsoft) | Managed by OAuth flow |
| **SessionAuth** | API Key (Cookie) | Browser-based web UI | `Cookie: white-cross-session=...` |
| **ApiKeyAuth** | API Key (Header) | Integration partners | `X-API-Key: wc_live_...` |

### Security Scheme Selection Guide

**Use BearerAuth when:**
- Building mobile apps
- Building SPAs (if not using cookies)
- Building CLI tools
- Building backend services

**Use SessionAuth when:**
- Building traditional web applications
- Need browser session management
- Want automatic cookie handling

**Use GoogleOAuth/MicrosoftOAuth when:**
- Enterprise SSO required
- Organization uses Google Workspace or Microsoft 365
- Want simplified login flow for users

**Use ApiKeyAuth when:**
- Building integrations with external systems
- Service-to-service communication
- Webhook endpoints
- No user context needed

---

## Endpoint-Specific Security Examples

### Example 1: Authentication Endpoints (Public)

```yaml
paths:
  /api/auth/login:
    post:
      summary: User login
      description: Authenticate with email and password
      tags:
        - Authentication
      security: []  # No authentication required (public endpoint)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
                - password
              properties:
                email:
                  type: string
                  format: email
                  example: nurse@school.edu
                password:
                  type: string
                  format: password
                  example: SecurePassword123!
      responses:
        '200':
          description: Login successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string
                    description: JWT access token
                    example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                  user:
                    $ref: '#/components/schemas/User'
                  expiresIn:
                    type: integer
                    description: Token expiration time in seconds
                    example: 28800
        '401':
          description: Invalid credentials
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '429':
          description: Too many login attempts
          headers:
            Retry-After:
              schema:
                type: integer
              description: Number of seconds to wait before retrying
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RateLimitError'
```

### Example 2: Protected Resource (JWT Required)

```yaml
paths:
  /api/students/{id}:
    get:
      summary: Get student details
      description: |
        Retrieve detailed information about a specific student.

        **Required Permissions:**
        - `read_student_basic` - Basic student information
        - `read_student_health` - PHI and health records

        **Required Roles:**
        - school_nurse or higher
      tags:
        - Students
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
          description: Student UUID
      responses:
        '200':
          description: Student details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Student'
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '403':
          $ref: '#/components/responses/ForbiddenError'
        '404':
          $ref: '#/components/responses/NotFoundError'
```

### Example 3: Mutation with CSRF Protection

```yaml
paths:
  /api/health-records:
    post:
      summary: Create health record
      description: |
        Create a new health record for a student.

        **Security Requirements:**
        1. Valid JWT token in Authorization header
        2. CSRF token in X-CSRF-Token header
        3. User must have `create_health_records` permission

        **HIPAA Notice:** All PHI access is logged for audit compliance.
      tags:
        - Health Records
      security:
        - BearerAuth: []
      parameters:
        - name: X-CSRF-Token
          in: header
          required: true
          schema:
            type: string
          description: CSRF protection token (obtained from GET requests)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/HealthRecordInput'
      responses:
        '201':
          description: Health record created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HealthRecord'
        '400':
          $ref: '#/components/responses/ValidationError'
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '403':
          description: Forbidden - CSRF validation failed or insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
```

### Example 4: Integration Endpoint (API Key)

```yaml
paths:
  /api/integration/sync:
    post:
      summary: Trigger data synchronization
      description: |
        Trigger synchronization between White Cross and external systems.

        **Authentication:** API Key required in X-API-Key header
        **Required Scopes:** integration:sync
      tags:
        - Integration
      security:
        - ApiKeyAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                system:
                  type: string
                  enum: [ehr, sis, pharmacy]
                  description: External system to sync with
      responses:
        '202':
          description: Synchronization started
          content:
            application/json:
              schema:
                type: object
                properties:
                  jobId:
                    type: string
                    description: Sync job identifier
                  status:
                    type: string
                    enum: [pending, running]
        '401':
          description: Invalid or missing API key
        '403':
          description: API key lacks required scope
        '429':
          description: Rate limit exceeded
          headers:
            X-RateLimit-Limit:
              schema:
                type: integer
            X-RateLimit-Remaining:
              schema:
                type: integer
            X-RateLimit-Reset:
              schema:
                type: integer
```

### Example 5: OAuth Initiation

```yaml
paths:
  /api/auth/google:
    get:
      summary: Initiate Google OAuth flow
      description: |
        Redirects user to Google for authentication.

        **Flow:**
        1. User visits this endpoint
        2. Redirected to Google login
        3. User authenticates with Google
        4. Google redirects to /api/auth/google/callback
        5. Backend issues JWT token
      tags:
        - Authentication
      security: []  # No auth required to initiate OAuth
      responses:
        '302':
          description: Redirect to Google OAuth
          headers:
            Location:
              schema:
                type: string
                example: https://accounts.google.com/o/oauth2/v2/auth?client_id=...

  /api/auth/google/callback:
    get:
      summary: Google OAuth callback
      description: |
        Handles redirect from Google after authentication.
        Internal endpoint - not for direct client use.
      tags:
        - Authentication
      security: []
      parameters:
        - name: code
          in: query
          required: true
          schema:
            type: string
          description: Authorization code from Google
        - name: state
          in: query
          schema:
            type: string
          description: CSRF protection state
      responses:
        '302':
          description: Redirect to application with JWT token
          headers:
            Location:
              schema:
                type: string
                example: https://app.whitecross.health/dashboard?token=...
```

---

## Testing Authentication

### Using cURL

**Login and obtain token:**
```bash
# Login
curl -X POST https://api.whitecross.health/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "nurse@school.edu", "password": "SecurePassword123!"}'

# Response:
# {
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "user": { "id": "...", "email": "nurse@school.edu", "role": "school_nurse" },
#   "expiresIn": 28800
# }

# Use token in subsequent requests
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET https://api.whitecross.health/api/students \
  -H "Authorization: Bearer $TOKEN"
```

**With CSRF protection:**
```bash
# 1. Get CSRF token (from any GET request)
curl -X GET https://api.whitecross.health/api/students \
  -H "Authorization: Bearer $TOKEN" \
  -i  # Include headers in output

# Look for X-CSRF-Token header in response
# X-CSRF-Token: AbCdEf123456...

# 2. Include CSRF token in mutation
CSRF_TOKEN="AbCdEf123456..."

curl -X POST https://api.whitecross.health/api/health-records \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-CSRF-Token: $CSRF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"studentId": "...", "type": "immunization", ...}'
```

### Using Postman

**Setup:**
1. Create environment variables:
   - `base_url`: https://api.whitecross.health
   - `token`: (leave empty, will be set by login request)

**Login Request:**
```
POST {{base_url}}/api/auth/login
Body (JSON):
{
  "email": "nurse@school.edu",
  "password": "SecurePassword123!"
}

Tests (JavaScript):
var jsonData = pm.response.json();
pm.environment.set("token", jsonData.token);
```

**Protected Request:**
```
GET {{base_url}}/api/students
Headers:
Authorization: Bearer {{token}}
```

**CSRF-Protected Request:**
```
POST {{base_url}}/api/health-records
Headers:
Authorization: Bearer {{token}}
X-CSRF-Token: {{csrf_token}}
Body (JSON):
{ ... }

Pre-request Script:
// Get CSRF token from cookie or previous response
pm.environment.set("csrf_token", pm.cookies.get("_csrf"));
```

### Using Swagger UI

**Try It Out Feature:**

1. Open Swagger UI at `/docs`
2. Click "Authorize" button (top right)
3. For BearerAuth:
   - First, use POST /api/auth/login to get token
   - Copy token from response
   - Paste into "Value" field (without "Bearer" prefix)
   - Click "Authorize"
4. Now all "Try it out" requests will include token automatically

**OAuth Flow in Swagger UI:**

1. Click "Authorize"
2. Select GoogleOAuth or MicrosoftOAuth
3. Check required scopes
4. Click "Authorize"
5. Complete OAuth flow in popup
6. Token automatically included in requests

---

## Documentation Best Practices

### 1. Always Document Security Requirements

Every endpoint should clearly state:
- Required authentication method
- Required roles or permissions
- Any additional security requirements (CSRF, rate limits)

**Example:**
```yaml
paths:
  /api/medications/{id}/administer:
    post:
      summary: Administer medication
      description: |
        Record medication administration for a student.

        **Security Requirements:**
        - Authentication: JWT Bearer token
        - Role: school_nurse or higher
        - Permission: administer_medications
        - CSRF: Required for POST requests

        **Audit:** All medication administrations are logged for compliance.
```

### 2. Include Security in Response Examples

Show security-related responses:

```yaml
responses:
  '200':
    description: Success
    # ...
  '401':
    description: Unauthorized - Invalid or expired token
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/Error'
        example:
          error: "Unauthorized"
          code: "TOKEN_EXPIRED"
          message: "Session expired, please login again"
  '403':
    description: Forbidden - Insufficient permissions
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/Error'
        example:
          error: "Forbidden"
          code: "INSUFFICIENT_PERMISSIONS"
          message: "User lacks required permission: administer_medications"
  '429':
    description: Too Many Requests - Rate limit exceeded
    headers:
      Retry-After:
        schema:
          type: integer
        example: 60
    content:
      application/json:
        example:
          error: "Too many requests. Please try again later."
          retryAfter: 60
```

### 3. Document Rate Limits

Include rate limit information in endpoint descriptions:

```yaml
/api/auth/login:
  post:
    summary: User login
    description: |
      Authenticate with email and password.

      **Rate Limits:**
      - Per user: 5 attempts per 15 minutes
      - Per IP: 10 attempts per 15 minutes
      - Lockout: 30 minutes after exceeding limit

      **Rate Limit Headers:**
      - X-RateLimit-Limit: Maximum requests allowed
      - X-RateLimit-Remaining: Requests remaining in window
      - X-RateLimit-Reset: Unix timestamp when limit resets
```

### 4. Use Reusable Response Components

Define common security responses once:

```yaml
components:
  responses:
    UnauthorizedError:
      description: Unauthorized - Authentication required or token invalid/expired
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          examples:
            missing_token:
              summary: Missing authentication token
              value:
                error: "Unauthorized"
                code: "AUTH_REQUIRED"
                message: "Authentication required"
            expired_token:
              summary: Expired token
              value:
                error: "Unauthorized"
                code: "TOKEN_EXPIRED"
                message: "Session expired, please login again"

    ForbiddenError:
      description: Forbidden - Insufficient permissions
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          examples:
            insufficient_role:
              summary: Insufficient role
              value:
                error: "Forbidden"
                code: "INSUFFICIENT_ROLE"
                message: "Required role: school_nurse, Current: student"
            missing_permission:
              summary: Missing permission
              value:
                error: "Forbidden"
                code: "INSUFFICIENT_PERMISSIONS"
                message: "Missing required permission: administer_medications"

    RateLimitError:
      description: Too Many Requests - Rate limit exceeded
      headers:
        Retry-After:
          schema:
            type: integer
          description: Seconds to wait before retrying
        X-RateLimit-Limit:
          schema:
            type: integer
        X-RateLimit-Remaining:
          schema:
            type: integer
        X-RateLimit-Reset:
          schema:
            type: integer
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/RateLimitError'
```

Then reference them:

```yaml
paths:
  /api/students:
    get:
      responses:
        '200':
          description: Success
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '403':
          $ref: '#/components/responses/ForbiddenError'
```

### 5. Document HIPAA/Compliance Requirements

For PHI endpoints, include compliance notes:

```yaml
/api/health-records/{id}:
  get:
    summary: Get health record
    description: |
      Retrieve detailed health record including PHI.

      **HIPAA Compliance:**
      - All access logged to audit trail
      - Minimum necessary access principle enforced
      - User must have legitimate need to access
      - PHI transmission encrypted via HTTPS

      **Audit Log Includes:**
      - User ID and role
      - Timestamp of access
      - Patient/student ID
      - IP address
      - User agent
```

---

## Maintenance Notes

**When adding new endpoints:**
1. ✅ Specify security requirements explicitly
2. ✅ Document required roles/permissions
3. ✅ Include CSRF requirements for mutations
4. ✅ Add security-related response codes (401, 403, 429)
5. ✅ Update this guide if new security patterns emerge

**When modifying security:**
1. ✅ Update `security-schemes.yaml`
2. ✅ Update examples in this guide
3. ✅ Update client SDK documentation
4. ✅ Notify API consumers of changes
5. ✅ Version the API if breaking changes

**Security scheme versioning:**
- Security changes are documented in API changelog
- Breaking security changes require major version bump
- Backward-compatible security enhancements can be minor version

---

## Additional Resources

- **Main Security Documentation**: `backend/swagger/security-schemes.yaml`
- **OpenAPI Specification**: `backend/swagger/openapi.yaml`
- **Authentication Service**: `backend/src/services/passport.ts`
- **RBAC Middleware**: `backend/src/middleware/core/authorization/rbac.middleware.ts`
- **JWT Middleware**: `backend/src/middleware/core/authentication/jwt.middleware.ts`
- **Security Headers**: `backend/src/middleware/security/headers/security-headers.middleware.ts`

---

## Support

For questions about API security documentation:
- **Email**: api-team@whitecross.health
- **Security Issues**: security@whitecross.health
- **Documentation**: https://api.whitecross.health/docs

---

**Last Updated**: 2025-10-23
**Maintained By**: API Architecture Team
**Review Schedule**: Quarterly or when security changes occur
