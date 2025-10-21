# API v1 Routes - Enterprise Architecture

## Overview

This directory contains the refactored v1 API routes following enterprise best practices with clear separation of concerns, HIPAA compliance, and scalable architecture.

## Architecture

```
v1/
├── core/                    # Authentication, users, access control
│   ├── controllers/         # Business logic orchestration
│   ├── routes/              # HTTP route definitions
│   ├── validators/          # Joi validation schemas
│   └── index.ts             # Module aggregator
│
├── healthcare/              # Clinical data (health records, medications, allergies)
│   ├── controllers/
│   ├── routes/
│   ├── validators/
│   └── index.ts
│
├── operations/              # Daily operations (appointments, students)
│   ├── controllers/
│   ├── routes/
│   ├── validators/
│   └── index.ts
│
├── compliance/              # Regulatory compliance (audit, reports, documents)
│   ├── controllers/
│   ├── routes/
│   ├── validators/
│   └── index.ts
│
├── communication/           # Messaging and notifications
│   ├── controllers/
│   ├── routes/
│   ├── validators/
│   └── index.ts
│
├── system/                  # System administration (districts, schools, config)
│   ├── controllers/
│   ├── routes/
│   ├── validators/
│   └── index.ts
│
├── incidents/               # Incident reporting and tracking
│   ├── controllers/
│   ├── routes/
│   ├── validators/
│   └── index.ts
│
└── index.ts                 # v1 routes aggregator
```

## Shared Infrastructure

All modules have access to:

- **`../shared/types/`** - Common TypeScript interfaces
- **`../shared/utils/`** - Helper functions (response, pagination, filters)
- **`../shared/middleware/`** - Reusable middleware (RBAC, PHI audit)
- **`../shared/validators/`** - Common validation schemas

## Module Structure

Each module follows this consistent pattern:

### Controllers (`controllers/`)
- Business logic orchestration
- Service layer calls
- Response formatting
- Error handling

### Routes (`routes/`)
- HTTP method and path definitions
- Middleware configuration
- Swagger/OpenAPI documentation
- Request validation

### Validators (`validators/`)
- Joi validation schemas
- Input sanitization rules
- Type definitions

## URL Structure

All v1 routes follow this pattern:
```
/api/v1/{module}/{resource}[/{id}][/{sub-resource}]
```

**Examples:**
- `POST /api/v1/auth/login`
- `GET /api/v1/students?page=1&limit=20`
- `GET /api/v1/students/{id}/health-records`
- `POST /api/v1/medications/assign`

## Authentication

### Public Endpoints
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/verify`
- `POST /api/v1/auth/refresh`

All other endpoints require JWT authentication via `Authorization: Bearer <token>` header.

## Authorization

Routes use role-based access control (RBAC):

- `requireAdmin` - ADMIN, DISTRICT_ADMIN only
- `requireNurse` - ADMIN, DISTRICT_ADMIN, NURSE
- `requireCounselor` - ADMIN, DISTRICT_ADMIN, COUNSELOR, MENTAL_HEALTH_SPECIALIST
- `requireStaff` - All roles except VIEWER

**Usage:**
```typescript
options: {
  auth: 'jwt',
  pre: [requireNurse]
}
```

## HIPAA Compliance

### PHI Audit Logging
Routes accessing Protected Health Information automatically log:
- User ID and role
- Action performed
- Resource accessed
- IP address and user agent
- API version
- Timestamp

PHI routes are tagged with:
- `Students`
- `Health Records`
- `Medications`
- `Incident Reports`
- `Mental Health`

### Audit Failure Handling
If audit logging fails, the request is blocked and returns 500 error (HIPAA requirement).

## Response Format

All responses follow this consistent format:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "pagination": {  // For list endpoints
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": { ... }  // Optional
  }
}
```

## Pagination

List endpoints support pagination via query parameters:
- `page` - Page number (default: 1, min: 1)
- `limit` - Items per page (default: 20, max: 100)

## Filtering

Common filter parameters:
- `search` - Full-text search
- `isActive` - Active status filter (true/false)
- `dateFrom` - Start date (ISO 8601)
- `dateTo` - End date (ISO 8601)

Module-specific filters are documented in each module's README.

## Error Handling

The `asyncHandler` wrapper automatically handles common errors:
- **404** - "not found" in error message
- **409** - "already exists" or "duplicate" in error message
- **403** - "permission", "forbidden", or "access denied" in error message
- **401** - "unauthorized" or "not authenticated" in error message
- **500** - All other errors

## Migration Status

### ✅ Migrated
- **Core Module**
  - ✅ Authentication routes (5 endpoints)

### 🔄 In Progress
- Users routes
- Access Control routes

### ⏳ Pending
- Healthcare module
- Operations module
- Compliance module
- Communication module
- System module
- Incidents module

## Development Guidelines

### Adding a New Route

1. **Create Controller**
   ```typescript
   // controllers/resource.controller.ts
   export class ResourceController {
     static async list(request: AuthenticatedRequest, h: ResponseToolkit) {
       // Implementation
     }
   }
   ```

2. **Create Validator**
   ```typescript
   // validators/resource.validators.ts
   export const createResourceSchema = Joi.object({
     // Schema definition
   });
   ```

3. **Create Route**
   ```typescript
   // routes/resource.routes.ts
   export const resourceRoutes: ServerRoute[] = [
     {
       method: 'POST',
       path: '/api/v1/resources',
       handler: asyncHandler(ResourceController.create),
       options: {
         auth: 'jwt',
         pre: [requireStaff],
         validate: { payload: createResourceSchema }
       }
     }
   ];
   ```

4. **Update Module Index**
   ```typescript
   // index.ts
   import { resourceRoutes } from './routes/resource.routes';
   export const moduleRoutes = [...existingRoutes, ...resourceRoutes];
   ```

### Testing Routes

Each route should have:
- Unit tests for controllers (isolated logic testing)
- Integration tests for full request/response cycle
- E2E tests for critical user flows

**Example:**
```typescript
describe('AuthController', () => {
  describe('login', () => {
    it('should return JWT token for valid credentials', async () => {
      // Test implementation
    });
  });
});
```

## API Documentation

Swagger documentation is automatically generated from route definitions:
- **Development:** http://localhost:3001/docs
- **Staging:** https://api-staging.whitecross.health/docs
- **Production:** https://api.whitecross.health/docs

## Support

For questions about this architecture or migration process, contact the Platform Team.

## Version History

- **v1.0.0** (2025-10-21) - Initial v1 API with refactored architecture
