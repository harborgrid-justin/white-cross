# Hapi.js Compliance Checklist

This 30-point checklist ensures routes, handlers, and configurations follow Hapi.js best practices and the White Cross platform standards.

## Authentication & Authorization (Points 1-6)

- [ ] **1. Authentication Strategy Specified**
  - All routes explicitly define `options.auth` (either `'jwt'`, `false`, or custom strategy)
  - No routes rely on implicit default authentication behavior without documentation

- [ ] **2. Authorization Checks Implemented**
  - Routes with sensitive data have proper authorization checks in handlers
  - RBAC permissions validated via middleware or handler logic
  - User credentials accessed via `request.auth.credentials`

- [ ] **3. Public Routes Explicitly Marked**
  - Routes that should be public have `options.auth: false`
  - Public routes are intentional and documented (e.g., `/health`, `/docs`, login endpoints)

- [ ] **4. JWT Validation Configured**
  - JWT strategy uses proper `verifyOptions` (algorithms, audience, issuer)
  - Token expiration is enforced
  - Invalid tokens return 401 responses

- [ ] **5. Credentials Properly Typed**
  - `request.auth.credentials` contains expected user properties (userId, email, role, etc.)
  - Handler code safely accesses credentials with proper type checking

- [ ] **6. Session Management**
  - Session data is validated and sanitized
  - No sensitive data stored in client-side sessions without encryption

## Route Configuration (Points 7-12)

- [ ] **7. HTTP Method Correctness**
  - GET routes do not modify data
  - POST routes create resources
  - PUT/PATCH routes update resources
  - DELETE routes remove resources
  - Method semantics match REST conventions

- [ ] **8. Path Parameters Defined**
  - Path parameters use proper syntax: `/users/{userId}`
  - Required vs optional parameters are clearly defined
  - Parameter names are consistent across related routes

- [ ] **9. Route Options Complete**
  - `tags` specified for Swagger grouping (e.g., `['api', 'users']`)
  - `description` provides clear route purpose
  - `notes` includes additional context when needed

- [ ] **10. CORS Configuration**
  - CORS settings appropriate for route security level
  - Credentials handling matches authentication requirements
  - Origins are properly restricted (not `*` in production for sensitive routes)

- [ ] **11. Response Schema Defined**
  - Routes specify expected response structure in `options.response.schema`
  - Success and error responses documented
  - Response validation enabled when appropriate

- [ ] **12. Route Grouping and Naming**
  - Routes logically grouped by domain/resource
  - Path prefixes consistent (e.g., `/api/v1/...`)
  - Related routes co-located in same file or module

## Validation (Points 13-18)

- [ ] **13. Request Payload Validation**
  - POST/PUT/PATCH routes have `options.validate.payload` with Joi schema
  - Required fields explicitly marked with `.required()`
  - Optional fields use `.optional()` or have defaults

- [ ] **14. Query Parameter Validation**
  - GET routes with query params have `options.validate.query`
  - Pagination params validated (page, limit, offset)
  - Filter/search params properly typed and constrained

- [ ] **15. Path Parameter Validation**
  - Routes validate path params via `options.validate.params`
  - IDs validated as UUID/integer as appropriate
  - Parameter constraints match database schema

- [ ] **16. Headers Validation**
  - Custom headers validated when required
  - Authorization headers properly handled by auth strategy
  - Content-Type restrictions enforced when needed

- [ ] **17. Validation Error Handling**
  - Custom `failAction` defined for clear error messages
  - Validation errors return appropriate status codes (400)
  - Error responses follow consistent format

- [ ] **18. Input Sanitization**
  - String inputs trimmed and sanitized
  - XSS prevention via validation and escaping
  - SQL injection prevented via parameterized queries (ORM usage)

## Error Handling (Points 19-22)

- [ ] **19. Error Responses Standardized**
  - All errors use Boom or consistent error format
  - Error responses include `success: false` and error details
  - Stack traces excluded from production error responses

- [ ] **20. HTTP Status Codes Appropriate**
  - 200 for successful GET/PUT/PATCH
  - 201 for successful POST (resource creation)
  - 204 for successful DELETE
  - 400 for validation errors
  - 401 for authentication failures
  - 403 for authorization failures
  - 404 for not found
  - 500 for server errors

- [ ] **21. Error Logging**
  - Errors logged with appropriate context (request path, method, user)
  - Sensitive data excluded from logs (passwords, tokens, PHI)
  - Error severity properly categorized

- [ ] **22. Graceful Degradation**
  - Database connection failures handled
  - External service failures don't crash the server
  - Timeout handling implemented for long operations

## Documentation (Points 23-26)

- [ ] **23. Swagger Documentation Complete**
  - Routes properly tagged for Swagger UI organization
  - Request/response schemas documented via `plugins['hapi-swagger']`
  - Examples provided for complex payloads

- [ ] **24. JSDoc Comments Present**
  - Route handlers have JSDoc with `@description`, `@param`, `@returns`
  - Complex business logic documented
  - Security considerations noted

- [ ] **25. Route Purpose Clear**
  - Description explains what the route does
  - Notes explain why certain design decisions were made
  - Related routes cross-referenced

- [ ] **26. API Versioning Documented**
  - Version number in path (e.g., `/api/v1/`)
  - Version changes documented
  - Deprecation notices for old versions

## Performance & Best Practices (Points 27-30)

- [ ] **27. Handler Logic Efficient**
  - Database queries optimized (avoid N+1 problems)
  - Unnecessary data fetching avoided
  - Async/await properly used (no blocking operations)

- [ ] **28. Response Payload Optimized**
  - Only necessary data included in responses
  - Pagination implemented for list endpoints
  - Large datasets streamed when appropriate

- [ ] **29. Rate Limiting Configured**
  - Rate limiting applied to sensitive routes
  - Appropriate limits for different route types
  - Rate limit headers included in responses

- [ ] **30. Security Best Practices**
  - Helmet or security headers middleware enabled
  - CSRF protection for state-changing operations
  - File upload size limits enforced
  - Content-Type validation for uploads
  - No sensitive data in URL query parameters

## Quick Audit Commands

```bash
# Find routes without authentication config
grep -r "method:" backend/src/routes/v1 | grep -v "auth:"

# Find routes without validation
grep -r "method:" backend/src/routes/v1 | grep -v "validate:"

# Find routes without tags
grep -r "method:" backend/src/routes/v1 | grep -v "tags:"

# Check for proper error handling
grep -r "throw new Error" backend/src/routes/v1  # Should use Boom instead
```

## Common Issues to Watch For

1. **Missing `auth: false`** on public routes (inherits default strategy unintentionally)
2. **Incomplete validation** (payload validated but not query params)
3. **Inconsistent error formats** (mix of Boom and plain Error objects)
4. **Missing pagination** on list endpoints (can cause performance issues)
5. **Hardcoded credentials** or secrets in route files
6. **Overly permissive CORS** (`origin: '*'` in production)
7. **Missing rate limiting** on authentication endpoints
8. **Synchronous blocking code** in handlers (should be async)
9. **Direct database queries** in handlers (should use service/repository layer)
10. **Unclear route grouping** (mixing domains in same file)

## Compliance Check Example

```typescript
// ✅ GOOD - Compliant Hapi Route
server.route({
  method: 'POST',
  path: '/api/v1/students',
  handler: async (request, h) => {
    const { userId } = request.auth.credentials;
    const studentData = request.payload;

    try {
      const student = await studentService.create(studentData, userId);
      return h.response({ success: true, data: student }).code(201);
    } catch (error) {
      logger.error('Failed to create student:', error);
      throw Boom.badImplementation('Failed to create student');
    }
  },
  options: {
    auth: 'jwt',
    tags: ['api', 'students'],
    description: 'Create a new student record',
    notes: 'Requires nurse or admin role. Audit logged per HIPAA requirements.',
    validate: {
      payload: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        dateOfBirth: Joi.date().required(),
        studentNumber: Joi.string().required()
      })
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Student created successfully' },
          '400': { description: 'Invalid student data' },
          '401': { description: 'Not authenticated' },
          '403': { description: 'Insufficient permissions' }
        }
      }
    }
  }
});

// ❌ BAD - Non-compliant Route
server.route({
  method: 'POST',
  path: '/students',  // Missing version prefix
  handler: async (request, h) => {  // No error handling
    const student = await Student.create(request.payload);  // No validation
    return student;  // Missing proper response format
  }
  // Missing: auth, validation, tags, documentation
});
```

## Automated Compliance Tools

Consider implementing:
- ESLint rules for route structure validation
- Custom Hapi plugins for enforcing standards
- Pre-commit hooks for route validation
- Automated Swagger spec validation
- Security scanning tools (npm audit, Snyk)
