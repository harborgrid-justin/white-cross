# Swagger Error Response Documentation

## Overview
This directory contains comprehensive error response documentation for the White Cross Healthcare Platform API.

## File: error-responses.yaml

**Purpose**: Reusable error response schemas for OpenAPI/Swagger documentation

**Size**: 1,025 lines

**Format**: OpenAPI 3.0.0 YAML

## Quick Start

### 1. Reference in OpenAPI Specifications

Add error responses to your API endpoint definitions:

```yaml
paths:
  /api/students/{id}:
    get:
      summary: Get student by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        200:
          description: Student found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Student'
        400:
          $ref: './error-responses.yaml#/components/responses/ValidationError'
        401:
          $ref: './error-responses.yaml#/components/responses/AuthenticationError'
        403:
          $ref: './error-responses.yaml#/components/responses/AuthorizationError'
        404:
          $ref: './error-responses.yaml#/components/responses/NotFoundError'
        500:
          $ref: './error-responses.yaml#/components/responses/InternalServerError'
```

### 2. Available Response Components

| HTTP Status | Component | Use Case |
|-------------|-----------|----------|
| 400 | ValidationError | Input validation failures, invalid formats |
| 401 | AuthenticationError | Authentication required or failed |
| 403 | AuthorizationError | Insufficient permissions |
| 404 | NotFoundError | Resource not found |
| 409 | ConflictError | Duplicate records, state conflicts |
| 429 | RateLimitError | Rate limit exceeded |
| 500 | InternalServerError | System errors |
| 503 | ServiceUnavailableError | Database/service unavailable |

### 3. Standard Error Response Format

All errors follow this structure:

```json
{
  "success": false,
  "error": {
    "code": "VAL_VALIDATION_FAILED",
    "message": "Human-readable error message",
    "type": "VALIDATION",
    "severity": "LOW",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    },
    "timestamp": "2025-10-23T16:30:00.000Z",
    "requestId": "req-abc123",
    "traceId": "trace-xyz789"
  }
}
```

## Error Types

- **VALIDATION**: Input validation failures
- **AUTHENTICATION**: Authentication failures
- **AUTHORIZATION**: Permission denied
- **NOT_FOUND**: Resource not found
- **RATE_LIMIT**: Rate limiting violations
- **DATABASE**: Database errors
- **NETWORK**: Network/connectivity errors
- **BUSINESS_LOGIC**: Business rule violations
- **SYSTEM**: Internal system errors
- **UNKNOWN**: Unclassified errors

## Error Severity Levels

- **LOW**: Expected errors (validation, not found)
- **MEDIUM**: Auth failures, rate limits
- **HIGH**: Database errors, network failures
- **CRITICAL**: System failures, data loss

## Error Code Ranges

- **0-99**: Generic errors
- **100-199**: Authentication errors
- **200-299**: Medication errors
- **300-399**: Student errors
- **400-499**: Health record errors
- **500-599**: Contact errors
- **600-699**: Permission errors
- **700-799**: Database errors
- **800-899**: Validation errors
- **900-999**: Network/external errors

## HIPAA Compliance

All error responses are automatically sanitized by the ErrorHandlerMiddleware to remove PHI:
- Email addresses redacted
- Phone numbers redacted
- SSN patterns redacted
- Credit card numbers redacted
- Medical record numbers redacted
- Stack traces only in development

## Examples

See `error-responses.yaml` for 30+ comprehensive examples including:
- Missing field validation
- Invalid format validation
- Multiple field validation errors
- Invalid/expired authentication tokens
- Insufficient permissions
- Resource not found scenarios
- Duplicate record conflicts
- Rate limit exceeded with retry information
- Database connection errors
- Service timeouts

## Integration Checklist

- [ ] Reference error-responses.yaml in all OpenAPI specs
- [ ] Replace inline error definitions with component references
- [ ] Update frontend TypeScript interfaces
- [ ] Configure monitoring alerts based on error severity
- [ ] Add integration tests for error response formats
- [ ] Update API documentation portal

## Related Files

- `backend/src/shared/errors/ErrorCode.ts` - Error code enumerations
- `backend/src/shared/errors/ServiceErrors.ts` - Service error classes
- `backend/src/errors/ServiceError.ts` - HTTP error classes
- `backend/src/middleware/error-handling/handlers/error-handler.middleware.ts` - Error handler

## Support

For questions about error handling:
1. Review the comprehensive documentation in error-responses.yaml
2. Check the error handler middleware implementation
3. Consult the ErrorCode.ts file for all error codes
4. Review integration examples in the YAML file

---

**Version**: 1.0.0
**Author**: White Cross Platform Team
**Date**: 2025-10-23
**Status**: Production-ready
