# White Cross Healthcare Platform - API Documentation Guide

## Table of Contents
- [Overview](#overview)
- [Quick Start](#quick-start)
- [Accessing Documentation](#accessing-documentation)
- [OpenAPI Specification](#openapi-specification)
- [Maintaining Documentation](#maintaining-documentation)
- [Testing the API](#testing-the-api)
- [Code Generation](#code-generation)
- [HIPAA Compliance](#hipaa-compliance)
- [Troubleshooting](#troubleshooting)

## Overview

The White Cross Healthcare Platform provides comprehensive API documentation through multiple interfaces:

1. **Hapi-Swagger UI** (`/documentation`) - Interactive browser-based documentation (auto-generated from routes)
2. **OpenAPI 3.0 Specification** (`swagger/openapi-full.yaml`) - Standalone specification for external tools
3. **JSON Endpoint** (`/swagger.json`) - Machine-readable API specification

### Key Statistics
- **Total Endpoints**: 100+ across 18 domains
- **API Version**: 1.0.0
- **OpenAPI Version**: 3.0.3
- **Authentication**: JWT Bearer Token
- **HIPAA Compliance**: Full PHI protection with audit logging

### API Domains
- **Core**: Authentication, Users, Access Control (5 endpoints)
- **Healthcare**: Health Records, Medications, Health Assessments (30+ endpoints)
- **Operations**: Students, Appointments, Inventory, Emergency Contacts (25+ endpoints)
- **Compliance**: Audit Logs, HIPAA Reporting (10+ endpoints)
- **Analytics**: Metrics, Trends, Dashboards, Reports (15+ endpoints)
- **Communications**: Messaging, Broadcasts (8+ endpoints)
- **System**: Configuration, Integrations (7+ endpoints)

## Quick Start

### 1. Start the Server

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

Server starts on: `http://localhost:3000`

### 2. Access Swagger Documentation

Open your browser and navigate to:

```
http://localhost:3000/documentation
```

### 3. Authenticate

1. Click the **"Authorize"** button (lock icon, top right)
2. Obtain a JWT token:
   - Use `/api/v1/auth/login` endpoint
   - Or register a new account at `/api/v1/auth/register`
3. Enter token in format: `Bearer <your-jwt-token>`
4. Click **"Authorize"**
5. Click **"Close"**

### 4. Test an Endpoint

1. Expand any endpoint (e.g., **GET /api/v1/students**)
2. Click **"Try it out"**
3. Fill in parameters (if any)
4. Click **"Execute"**
5. View the response below

## Accessing Documentation

### Local Development

#### Hapi-Swagger UI (Recommended)
```
http://localhost:3000/documentation
```

**Features**:
- ✅ Interactive "Try it out" functionality
- ✅ Auto-synced with code changes
- ✅ JWT authentication support
- ✅ Request/response validation
- ✅ Schema exploration
- ✅ Comprehensive examples

#### Swagger JSON Endpoint
```
http://localhost:3000/swagger.json
```

Use this for:
- API client generation
- Contract testing
- CI/CD integration
- External documentation tools

#### OpenAPI YAML File
```bash
cat backend/swagger/openapi-full.yaml
```

Or serve with ReDoc for a cleaner interface:
```bash
npx @redocly/cli preview-docs swagger/openapi-full.yaml
```

### Environment URLs

| Environment | Swagger UI | Swagger JSON |
|-------------|------------|--------------|
| Local | `http://localhost:3000/documentation` | `http://localhost:3000/swagger.json` |
| Development | `https://api-dev.whitecross.com/documentation` | `https://api-dev.whitecross.com/swagger.json` |
| Staging | `https://api-staging.whitecross.com/documentation` | `https://api-staging.whitecross.com/swagger.json` |
| Production | `https://api.whitecross.com/documentation` | `https://api.whitecross.com/swagger.json` |

## OpenAPI Specification

### File Structure

```
backend/swagger/
├── openapi-full.yaml            # Complete OpenAPI 3.0 spec (MAIN FILE)
├── error-responses.yaml         # Reusable error response schemas
├── security-schemes.yaml        # Security implementation patterns
├── API_DOCUMENTATION_GUIDE.md   # This file
├── README.md                    # Error response documentation
├── SECURITY_INTEGRATION_GUIDE.md
└── SECURITY_QUICK_REFERENCE.md
```

### OpenAPI Specification Highlights

**Key Features**:
- 🔐 JWT Bearer authentication with role-based access control
- 📊 Comprehensive schema definitions for all data models
- 📝 Detailed request/response examples
- 🛡️ HIPAA compliance documentation
- ⚠️ Complete error response documentation
- 📈 Pagination and filtering support
- 🔄 Reusable components for common patterns

**Schema Coverage**:
- User & Authentication
- Students & Demographics
- Health Records (Allergies, Chronic Conditions, Vaccinations, Vital Signs)
- Medications & Administration Logs
- Appointments & Scheduling
- Incidents & Safety Reports
- Analytics & Health Metrics
- Audit Logs & Compliance

### Validation Status

The OpenAPI specification is validated and compliant:

```bash
# Validate specification
npx swagger-cli validate swagger/openapi-full.yaml
# ✅ swagger/openapi-full.yaml is valid
```

## Maintaining Documentation

### Documentation Sources

The API documentation is maintained in **TWO locations**:

#### 1. Hapi Route Definitions (PRIMARY SOURCE)
**Location**: `src/routes/v1/**/*.routes.ts`

**Why Primary?**
- Auto-generates Swagger UI documentation
- Includes Joi validation schemas (auto-documented)
- Enforced by TypeScript type checking
- Validated at runtime

**Example**:
```typescript
// src/routes/v1/operations/routes/students.routes.ts
const listStudentsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/students',
  handler: asyncHandler(StudentsController.list),
  options: {
    auth: 'jwt',
    tags: ['api', 'Students', 'Operations', 'v1'],
    description: 'Get all students with pagination and filters',
    notes: '**PHI Protected Endpoint** - Returns paginated list of students. Supports filtering by grade, assigned nurse, active status, allergies, and medications.',
    validate: {
      query: listStudentsQuerySchema // Joi schema auto-documented
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Students retrieved successfully with pagination' },
          '401': { description: 'Unauthorized - Authentication required' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};
```

#### 2. OpenAPI YAML (SECONDARY REFERENCE)
**Location**: `swagger/openapi-full.yaml`

**Purpose**:
- External tool integration (Postman, Insomnia, code generators)
- Contract testing and validation
- API client generation
- Static documentation hosting

**Maintenance**: Must be manually synced when routes change

### Updating Documentation Workflow

#### Step 1: Update Hapi Route Definition

When adding or modifying an API endpoint:

```typescript
// 1. Define route with comprehensive documentation
const newEndpointRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/new-feature',
  handler: asyncHandler(NewFeatureController.create),
  options: {
    auth: 'jwt',
    tags: ['api', 'NewFeature', 'v1'],
    description: 'Create new feature',
    notes: `
      **PHI Protected Endpoint** (if applicable)

      Detailed description of what this endpoint does, including:
      - Business logic and validation rules
      - HIPAA compliance requirements (if PHI)
      - Rate limiting information
      - Required permissions
      - Side effects (notifications, audit logs, etc.)
    `,
    validate: {
      payload: createNewFeatureSchema // Joi validation
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': {
            description: 'Feature created successfully',
            schema: { /* Optional inline schema */ }
          },
          '400': { description: 'Validation error - Invalid input data' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Requires ADMIN role' },
          '409': { description: 'Conflict - Feature already exists' }
        }
      }
    }
  }
};

// 2. Export route
export const newFeatureRoutes: ServerRoute[] = [newEndpointRoute];

// 3. Register in domain index
// src/routes/v1/new-domain/index.ts
export { newFeatureRoutes } from './routes/newFeature.routes';

// 4. Add to v1 routes
// src/routes/v1/index.ts
import { newFeatureRoutes } from './new-domain';
// ... add to route array
```

#### Step 2: Update OpenAPI YAML (If Needed)

For external tool compatibility, update the OpenAPI spec:

```bash
# Method 1: Auto-extract from running server
npm start &
sleep 5
curl http://localhost:3000/swagger.json > swagger/generated.json
npx js-yaml swagger/generated.json > swagger/openapi-temp.yaml

# Method 2: Manual update (recommended for complex changes)
code swagger/openapi-full.yaml
# Add new paths, schemas, etc.
```

#### Step 3: Validate Changes

```bash
# Validate OpenAPI spec
npx swagger-cli validate swagger/openapi-full.yaml

# Start server and test in browser
npm run dev
# Navigate to http://localhost:3000/documentation

# Test the new endpoint
# Use "Try it out" functionality
```

#### Step 4: Update Tests

```typescript
// Add integration tests for new endpoint
describe('NewFeature API', () => {
  it('should create new feature', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/api/v1/new-feature',
      headers: {
        Authorization: `Bearer ${token}`
      },
      payload: {
        // test data
      }
    });

    expect(res.statusCode).to.equal(201);
  });
});
```

### Documentation Best Practices

#### 1. PHI Endpoint Marking

Always mark endpoints handling Protected Health Information:

| Sensitivity Level | Marking | Use Cases |
|-------------------|---------|-----------|
| Critical | `**CRITICAL PHI ENDPOINT**` | Allergies (life-threatening), emergency contacts |
| Highly Sensitive | `**HIGHLY SENSITIVE PHI ENDPOINT**` | Complete health records, mental health, diagnoses |
| Protected | `**PHI Protected Endpoint**` | Appointments, medications, general health info |
| Standard | No marking | Non-PHI data (system config, public data) |

**Example**:
```typescript
notes: '**CRITICAL PHI ENDPOINT** - Returns all allergies including life-threatening reactions. Access is logged for HIPAA compliance per 45 CFR § 164.308(a)(1)(ii)(D).'
```

#### 2. HIPAA References

Include specific HIPAA citations for compliance endpoints:

```typescript
notes: `
  HIPAA Compliance Requirements:
  - 45 CFR § 164.312(a)(2)(i): Unique user identification
  - 45 CFR § 164.312(b): Audit controls and logging
  - 45 CFR § 164.308(a)(1)(ii)(D): Information system activity review

  All access to PHI is logged with:
  - User ID and role
  - Timestamp (ISO 8601 UTC)
  - IP address
  - Action performed
  - Student ID accessed
`
```

#### 3. Comprehensive Response Documentation

Document all possible responses:

```typescript
plugins: {
  'hapi-swagger': {
    responses: {
      '200': {
        description: 'Operation successful',
        schema: successSchema
      },
      '400': {
        description: 'Validation error - [specific validation rules]'
      },
      '401': {
        description: 'Unauthorized - JWT token missing, invalid, or expired'
      },
      '403': {
        description: 'Forbidden - Requires [specific role] role'
      },
      '404': {
        description: 'Resource not found - [resource] with ID does not exist'
      },
      '409': {
        description: 'Conflict - [specific conflict scenario]'
      },
      '422': {
        description: 'Business logic validation failed - [specific business rule]'
      },
      '429': {
        description: 'Rate limit exceeded - Max [X] requests per [timeframe]'
      },
      '500': {
        description: 'Internal server error'
      }
    }
  }
}
```

#### 4. Example Payloads

Include realistic examples:

```typescript
validate: {
  payload: Joi.object({
    firstName: Joi.string().required().example('John'),
    lastName: Joi.string().required().example('Doe'),
    dateOfBirth: Joi.date().max('now').required().example('2010-05-15'),
    grade: Joi.string().valid('K', '1', '2', ...).required().example('5')
  })
}
```

## Testing the API

### Interactive Testing with Swagger UI

1. **Navigate to Swagger UI**: `http://localhost:3000/documentation`
2. **Find endpoint**: Expand domain and select endpoint
3. **Authorize**: Click lock icon, enter `Bearer <token>`
4. **Try it out**: Click button, fill parameters
5. **Execute**: Click execute button
6. **Review**: Check response status, headers, body

### Postman/Insomnia Integration

#### Import OpenAPI Spec into Postman
```bash
# Option 1: Import YAML file
# Postman → Import → File → Select swagger/openapi-full.yaml

# Option 2: Import from URL
# Postman → Import → Link → http://localhost:3000/swagger.json
```

#### Import into Insomnia
```bash
# Insomnia → Application → Preferences → Data → Import Data
# Select: swagger/openapi-full.yaml
# Format: OpenAPI 3
```

### cURL Examples

```bash
# 1. Login and get token
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nurse@school.edu","password":"password"}' \
  | jq -r '.data.token')

# 2. Get students list
curl -X GET "http://localhost:3000/api/v1/students?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# 3. Get specific student
curl -X GET "http://localhost:3000/api/v1/students/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer $TOKEN"

# 4. Create student
curl -X POST http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "dateOfBirth": "2012-03-15",
    "grade": "6",
    "schoolId": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

### Automated Testing

#### Contract Testing with Dredd
```bash
# Install Dredd
npm install --save-dev dredd

# Test API against OpenAPI spec
dredd swagger/openapi-full.yaml http://localhost:3000

# With authentication
dredd swagger/openapi-full.yaml http://localhost:3000 \
  --header "Authorization: Bearer YOUR_TOKEN"
```

#### Integration Tests
```typescript
// tests/integration/students.test.ts
import { expect } from '@hapi/code';
import { Server } from '@hapi/hapi';

describe('Students API', () => {
  let server: Server;
  let authToken: string;

  before(async () => {
    server = await initTestServer();
    authToken = await getAuthToken(server);
  });

  it('GET /api/v1/students should return students list', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/api/v1/students',
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    expect(res.statusCode).to.equal(200);
    expect(res.result.success).to.be.true();
    expect(res.result.data).to.be.array();
    expect(res.result.meta.pagination).to.exist();
  });

  it('POST /api/v1/students should create student', async () => {
    const newStudent = {
      firstName: 'Test',
      lastName: 'Student',
      dateOfBirth: '2010-01-01',
      grade: '5',
      schoolId: testSchoolId
    };

    const res = await server.inject({
      method: 'POST',
      url: '/api/v1/students',
      headers: {
        Authorization: `Bearer ${authToken}`
      },
      payload: newStudent
    });

    expect(res.statusCode).to.equal(201);
    expect(res.result.data.id).to.exist();
  });
});
```

## Code Generation

### TypeScript Client Generation

```bash
# Install OpenAPI Generator
npm install @openapitools/openapi-generator-cli -g

# Generate TypeScript Fetch client
openapi-generator-cli generate \
  -i swagger/openapi-full.yaml \
  -g typescript-fetch \
  -o ./generated/api-client \
  --additional-properties=npmName=@whitecross/api-client,npmVersion=1.0.0

# Use generated client
import { Configuration, StudentsApi } from './generated/api-client';

const config = new Configuration({
  basePath: 'http://localhost:3000',
  headers: { Authorization: `Bearer ${token}` }
});

const studentsApi = new StudentsApi(config);
const students = await studentsApi.listStudents({ page: 1, limit: 10 });
```

### Python Client Generation

```bash
openapi-generator-cli generate \
  -i swagger/openapi-full.yaml \
  -g python \
  -o ./generated/python-client \
  --additional-properties=packageName=whitecross_api,projectName=whitecross-api-client

# Use generated client
import whitecross_api
from whitecross_api.api import students_api

configuration = whitecross_api.Configuration(
    host = "http://localhost:3000",
    api_key = {'BearerAuth': token}
)

with whitecross_api.ApiClient(configuration) as api_client:
    api = students_api.StudentsApi(api_client)
    students = api.list_students(page=1, limit=10)
```

## HIPAA Compliance

### PHI Protection in Documentation

All endpoints handling PHI are clearly marked in documentation:

1. **Endpoint Description**: Includes PHI warning
2. **Route Notes**: Details protection measures
3. **Audit Logging**: Documented logging requirements
4. **Access Control**: Role restrictions clearly stated

### Compliance Checklist

- ✅ All PHI endpoints marked with sensitivity level
- ✅ HIPAA regulations cited (45 CFR references)
- ✅ Audit logging requirements documented
- ✅ Access control requirements specified
- ✅ Error responses sanitized (no PHI in errors)
- ✅ Rate limiting documented
- ✅ Session management described
- ✅ Encryption requirements stated

### Error Response Sanitization

PHI is automatically removed from error responses by error handling middleware:

```typescript
// Sanitized error response (production)
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "field": "email",
      "reason": "Invalid format"
    }
  }
}

// PHI patterns automatically redacted:
// - Email addresses → [EMAIL_REDACTED]
// - Phone numbers → [PHONE_REDACTED]
// - SSN → [SSN_REDACTED]
// - Stack traces → Removed (production only)
```

## Troubleshooting

### Common Issues

#### 1. Swagger UI Shows "Failed to Load API Definition"

**Cause**: Hapi-Swagger not properly registered or route configuration error

**Solution**:
```typescript
// Verify in src/index.ts:
await server.register([
  require('@hapi/inert'),
  require('@hapi/vision')
]);
await server.register(swaggerOptions);

// Check swaggerOptions in src/config/swagger.ts
```

#### 2. Authentication Not Working in Swagger UI

**Cause**: Incorrect token format or JWT strategy not configured

**Solution**:
```bash
# Correct format:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# NOT:
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (missing "Bearer")
```

Verify JWT strategy in `src/config/server.ts`:
```typescript
await server.auth.strategy('jwt', 'jwt', {
  key: process.env.JWT_SECRET,
  validate: validateJWT
});
```

#### 3. OpenAPI Validation Fails

**Cause**: Schema errors or invalid references

**Solution**:
```bash
# Detailed validation with error messages
npx @redocly/cli lint swagger/openapi-full.yaml --format=stylish

# Common issues:
# - Missing $ref targets
# - Invalid schema types
# - Duplicate operationIds
# - Missing required fields
```

#### 4. CORS Errors When Testing from Frontend

**Cause**: CORS not configured for frontend origin

**Solution**:
```typescript
// Update CORS in src/index.ts
const server = Hapi.server({
  port: 3000,
  routes: {
    cors: {
      origin: ['http://localhost:3001'], // Add your frontend URL
      credentials: true,
      additionalHeaders: ['Authorization']
    }
  }
});
```

#### 5. Rate Limiting Blocking Requests

**Cause**: Exceeded rate limit (300 req/min for authenticated users)

**Solution**:
```bash
# Check rate limit headers in response:
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1609459200

# Wait until reset time or use different IP/account
```

### Getting Help

For documentation issues:
- **Technical Support**: api-support@whitecross.com
- **HIPAA Compliance**: compliance@whitecross.com
- **GitHub Issues**: Create issue in repository
- **Security Concerns**: security@whitecross.com

## Additional Resources

### Official Documentation
- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Hapi.js Documentation](https://hapi.dev/)
- [Hapi-Swagger Plugin](https://github.com/glennjones/hapi-swagger)
- [Joi Validation](https://joi.dev/)

### Tools
- [Swagger Editor](https://editor.swagger.io/) - Online OpenAPI editor with validation
- [ReDoc](https://github.com/Redocly/redoc) - Beautiful OpenAPI documentation renderer
- [Postman](https://www.postman.com/) - API testing and development platform
- [Insomnia](https://insomnia.rest/) - Alternative REST client
- [Prism](https://stoplight.io/open-source/prism) - Mock API server from OpenAPI
- [Dredd](https://dredd.org/) - API contract testing tool

### HIPAA Resources
- [HHS HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/index.html)
- [45 CFR § 164.308](https://www.law.cornell.edu/cfr/text/45/164.308) - Administrative Safeguards
- [45 CFR § 164.312](https://www.law.cornell.edu/cfr/text/45/164.312) - Technical Safeguards
- [HIPAA Audit Controls](https://www.hhs.gov/hipaa/for-professionals/security/guidance/final-guidance-risk-analysis/index.html)

---

**Version**: 1.0.0
**Last Updated**: 2024-10-23
**Maintained By**: White Cross API Team
**Status**: Production-Ready ✅
