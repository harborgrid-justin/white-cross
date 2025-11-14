# API Versioning Guidelines
**White Cross Healthcare API**
**Version:** 1.0
**Last Updated:** 2025-11-14

---

## Table of Contents
1. [Overview](#overview)
2. [Versioning Strategy](#versioning-strategy)
3. [When to Create a New Version](#when-to-create-a-new-version)
4. [Deprecation Policy](#deprecation-policy)
5. [Implementation Guide](#implementation-guide)
6. [Best Practices](#best-practices)
7. [Migration Process](#migration-process)

---

## Overview

The White Cross Healthcare API uses **URI-based versioning** to enable safe API evolution while maintaining backward compatibility. This approach provides clear, predictable version management for API consumers.

### Versioning Type
- **Method:** URI-based versioning
- **Pattern:** `/api/{version}/{resource}`
- **Current Version:** v1
- **Example:** `GET /api/v1/students`

### Key Principles
1. **Stability:** Existing versions remain stable and unchanged
2. **Backward Compatibility:** No breaking changes within a version
3. **Clear Communication:** Deprecation notices with sunset dates
4. **Gradual Migration:** Multiple versions supported during transitions
5. **Documentation:** Complete migration guides for all version changes

---

## Versioning Strategy

### URI-Based Versioning

All API endpoints include the version in the URL path:

```
https://api.whitecross.health/api/v1/students
                                    ^^
                                    Version
```

### Version Neutral Endpoints

Some endpoints remain unversioned for infrastructure compatibility:

```
https://api.whitecross.health/health
https://api.whitecross.health/health/ready
https://api.whitecross.health/health/live
```

**Reason:** Kubernetes health probes require stable, unversioned endpoints.

### Configuration

Versioning is configured in `main.ts`:

```typescript
app.enableVersioning({
  type: VersioningType.URI,
  defaultVersion: '1',
  prefix: 'v',
});

app.setGlobalPrefix('api', {
  exclude: ['health', 'health/ready', 'health/live'],
});
```

---

## When to Create a New Version

### Breaking Changes (Require New Major Version)

The following changes REQUIRE a new API version:

#### ❌ Endpoint Changes
- Removing an endpoint
- Renaming an endpoint path
- Changing HTTP method (GET → POST)
- Changing URL structure (`/students` → `/users/students`)

#### ❌ Request Changes
- Removing required fields
- Changing field types (string → number)
- Changing validation rules (making optional field required)
- Changing request format (JSON → XML)

#### ❌ Response Changes
- Removing response fields
- Changing response structure
- Changing field types in responses
- Changing response format

#### ❌ Authentication Changes
- Changing authentication method
- Changing token format
- Changing authorization rules

#### ❌ Behavior Changes
- Changing resource semantics
- Changing side effects
- Changing error codes or messages

### Non-Breaking Changes (Same Version)

The following changes can be made WITHOUT a new version:

#### ✅ Additions
- Adding new endpoints
- Adding optional request parameters
- Adding new fields to responses
- Adding new HTTP headers

#### ✅ Enhancements
- Performance improvements
- Bug fixes
- Additional validation (warnings, not errors)
- Additional error codes (for new scenarios)

#### ✅ Documentation
- Updating documentation
- Adding examples
- Clarifying behavior

---

## Deprecation Policy

### Timeline

When introducing a breaking change:

1. **Announcement:** Minimum 6 months before removal
2. **Deprecation Period:** 6-12 months of dual support
3. **Sunset Date:** Clearly communicated removal date
4. **Removal:** Old version removed after sunset date

### Deprecation Process

#### Step 1: Announce Deprecation (Immediate)

Update Swagger documentation:

```typescript
@ApiOperation({
  summary: 'Get students (DEPRECATED)',
  description:
    'This endpoint is deprecated and will be removed on 2026-06-01.\n' +
    'Please migrate to /api/v2/students.\n' +
    'See migration guide: /docs/migrations/v1-to-v2.md',
  deprecated: true,
})
@Header('Sunset', 'Sat, 01 Jun 2026 00:00:00 GMT')
@Header('Deprecation', 'true')
@Header('Link', '</api/v2/students>; rel="successor-version"')
```

#### Step 2: Monitor Usage (Ongoing)

Track deprecated endpoint usage:

```typescript
@UseInterceptors(DeprecationTrackingInterceptor)
export class StudentV1Controller {
  // Logs all calls to deprecated endpoints
}
```

#### Step 3: Notify Consumers (3 months before sunset)

- Email notifications to API consumers
- In-app notifications (if applicable)
- Dashboard warnings for authenticated users
- Social media announcements

#### Step 4: Final Warning (1 month before sunset)

- Increased frequency of notifications
- Error logs with deprecation warnings
- Contact heavy users directly

#### Step 5: Remove Old Version (After sunset date)

```typescript
@Get('students')
@HttpCode(HttpStatus.GONE)
removed() {
  throw new HttpException({
    message: 'This endpoint was removed on 2026-06-01. Use /api/v2/students',
    successorVersion: 'v2',
    migrationGuide: '/docs/migrations/v1-to-v2.md'
  }, HttpStatus.GONE);
}
```

---

## Implementation Guide

### Creating a New Version

#### 1. Create Versioned Controllers

```typescript
// Keep v1 controller
@Version('1')
@Controller('students')
export class StudentV1Controller {
  // Existing implementation
}

// Create v2 controller
@Version('2')
@Controller('students')
export class StudentV2Controller {
  // New implementation with breaking changes
}
```

#### 2. Update DTOs

Create version-specific DTOs:

```typescript
// v1 DTOs
export class CreateStudentDtoV1 {
  firstName: string;
  lastName: string;
  grade: string;
}

// v2 DTOs (breaking change: grade becomes number)
export class CreateStudentDtoV2 {
  firstName: string;
  lastName: string;
  grade: number;  // Changed from string to number
}
```

#### 3. Share Common Logic

Extract shared business logic:

```typescript
// Shared service
@Injectable()
export class StudentService {
  async createStudent(data: CreateStudentDtoV1 | CreateStudentDtoV2) {
    // Common logic
  }
}

// V1 controller uses it
export class StudentV1Controller {
  constructor(private studentService: StudentService) {}

  @Post()
  async create(@Body() dto: CreateStudentDtoV1) {
    return this.studentService.createStudent(dto);
  }
}

// V2 controller uses it
export class StudentV2Controller {
  constructor(private studentService: StudentService) {}

  @Post()
  async create(@Body() dto: CreateStudentDtoV2) {
    return this.studentService.createStudent(dto);
  }
}
```

#### 4. Update Main Configuration

```typescript
app.enableVersioning({
  type: VersioningType.URI,
  defaultVersion: ['1', '2'],  // Support both versions
  prefix: 'v',
});
```

#### 5. Update Swagger Tags

```typescript
.addTag('students-v1', 'Student management (v1) - DEPRECATED')
.addTag('students-v2', 'Student management (v2)')
```

---

## Best Practices

### 1. Design for Evolvability

When creating new endpoints:

```typescript
// ❌ Avoid: Tightly coupled to specific structure
interface Student {
  name: string;
  age: number;
}

// ✅ Better: Extensible structure
interface Student {
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
  };
  academicInfo: {
    grade: string;
    enrollmentDate: string;
  };
}
```

### 2. Use Optional Fields for New Features

```typescript
// Adding new feature to existing version
export class StudentDto {
  firstName: string;      // Required (existing)
  lastName: string;       // Required (existing)
  middleName?: string;    // Optional (new) ✅
  preferredName?: string; // Optional (new) ✅
}
```

### 3. Maintain Consistent Error Handling

```typescript
// All versions should use the same error format
interface ApiError {
  success: false;
  statusCode: number;
  error: string;
  message: string | string[];
  errorCode: string;
  timestamp: string;
}
```

### 4. Document All Changes

Create migration guides for each version:

```markdown
# Migration Guide: v1 to v2

## Breaking Changes

### 1. Student Grade Field Type Changed
**v1:** `grade: string` (e.g., "9th Grade")
**v2:** `grade: number` (e.g., 9)

Migration:
```typescript
// v1
const student = { grade: "9th Grade" };

// v2
const student = { grade: 9 };
```
```

### 5. Test All Versions

```typescript
describe('Student API', () => {
  describe('v1', () => {
    it('should create student with string grade', async () => {
      const response = await request(app)
        .post('/api/v1/students')
        .send({ grade: '9th Grade' });
      expect(response.status).toBe(201);
    });
  });

  describe('v2', () => {
    it('should create student with number grade', async () => {
      const response = await request(app)
        .post('/api/v2/students')
        .send({ grade: 9 });
      expect(response.status).toBe(201);
    });
  });
});
```

---

## Migration Process

### For API Consumers

#### 1. Check Deprecation Notices

Monitor response headers:
```
Sunset: Sat, 01 Jun 2026 00:00:00 GMT
Deprecation: true
Link: </api/v2/students>; rel="successor-version"
```

#### 2. Read Migration Guide

Access migration documentation:
- Swagger UI: Check endpoint descriptions
- Documentation: `/docs/migrations/v1-to-v2.md`
- Changelog: `/CHANGELOG.md`

#### 3. Update Client Code

```typescript
// Before (v1)
const apiClient = axios.create({
  baseURL: 'https://api.whitecross.health/api/v1',
});

// After (v2)
const apiClient = axios.create({
  baseURL: 'https://api.whitecross.health/api/v2',
});
```

#### 4. Test in Staging

- Test all affected endpoints
- Verify data format changes
- Check error handling
- Validate authentication flow

#### 5. Deploy to Production

- Update production configuration
- Monitor for errors
- Roll back if issues occur

### For API Developers

#### 1. Identify Breaking Changes

Review proposed changes:
- Does it remove functionality?
- Does it change data types?
- Does it modify behavior?

#### 2. Create New Version

Follow implementation guide above.

#### 3. Maintain Old Version

- Keep v1 stable during deprecation period
- Only bug fixes, no new features
- Monitor usage metrics

#### 4. Communicate Changes

- Update Swagger documentation
- Create migration guide
- Notify API consumers
- Update internal documentation

#### 5. Remove After Sunset

- Archive old version code
- Return 410 Gone status
- Redirect to migration guide

---

## Version History

### v1 (Current)
- **Released:** 2025-11-14
- **Status:** Active
- **Deprecation:** None planned
- **Endpoints:** 400+ endpoints across 107 controllers

---

## Questions & Support

For questions about API versioning:
- **Documentation:** https://docs.whitecross.health
- **Support:** support@whitecross.health
- **GitHub Issues:** https://github.com/whitecross/api/issues

---

**Document Version:** 1.0
**Last Updated:** 2025-11-14
**Maintained By:** API Architecture Team
