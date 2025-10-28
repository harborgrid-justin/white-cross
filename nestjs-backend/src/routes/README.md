# Routes Module

## Overview
NestJS implementation of the White Cross Healthcare API routes, maintaining backward compatibility with the legacy Hapi.js backend while leveraging modern NestJS patterns.

## Directory Structure

```
routes/
├── README.md                           # This file
├── MIGRATION_GUIDE.md                  # Comprehensive migration guide
├── routes.module.ts                    # Top-level routes module
├── shared/                             # Shared utilities and decorators
│   ├── decorators/
│   │   ├── public.decorator.ts        # @Public() - marks public routes
│   │   ├── roles.decorator.ts         # @Roles() - role-based access
│   │   └── index.ts
│   ├── interceptors/
│   │   └── response-transform.interceptor.ts  # Standardizes responses
│   ├── guards/                         # Custom guards (future)
│   └── dto/                            # Common DTOs (future)
└── v1/                                 # API v1 routes
    ├── v1-routes.module.ts            # V1 routes aggregator
    ├── core/                           # Core functionality
    │   ├── core.module.ts
    │   └── auth.controller.ts         # ✅ IMPLEMENTED
    ├── healthcare/                     # Healthcare management
    │   └── medications.controller.example.ts  # 📝 EXAMPLE
    ├── operations/                     # Operations management
    ├── documents/                      # Document management
    ├── compliance/                     # Compliance and audit
    ├── communications/                 # Messaging and broadcasts
    ├── incidents/                      # Incident reporting
    ├── analytics/                      # Analytics and reporting
    ├── system/                         # System administration
    ├── alerts/                         # Real-time alerting
    └── clinical/                       # Clinical operations
```

## Migration Status

### ✅ Completed Routes (1/12 groups - 8%)

#### Core/Auth - Authentication (6 endpoints)
**Controller:** `routes/v1/core/auth.controller.ts`

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/v1/auth/register` | User registration | ✅ |
| POST | `/api/v1/auth/login` | User login | ✅ |
| POST | `/api/v1/auth/verify` | Token verification | ✅ |
| POST | `/api/v1/auth/refresh` | Token refresh | ✅ |
| GET | `/api/v1/auth/me` | Get current user | ✅ |
| GET | `/api/v1/auth/test-login` | E2E test login | ✅ |

### 🔄 Pending Routes (11/12 groups - 92%)

#### High Priority
- **Core/Users** - User management CRUD
- **Core/AccessControl** - RBAC operations
- **Core/Health** - Health checks
- **Core/Contacts** - Contact management
- **Healthcare/Medications** - 7 endpoints
- **Healthcare/HealthRecords** - Health record CRUD
- **Healthcare/HealthAssessments** - Assessment forms

#### Medium Priority
- **Operations/Students** - Student management
- **Operations/Appointments** - Scheduling
- **Operations/EmergencyContacts** - Emergency contacts
- **Operations/Inventory** - Inventory tracking
- **Operations/StudentManagement** - Advanced operations
- **Documents** - Document management
- **Compliance** - Audit and compliance
- **Communications** - Messages and broadcasts (2 modules)
- **Incidents** - Incident reporting
- **Analytics** - Analytics and reporting
- **System** - System administration

#### Low Priority
- **Alerts** - Real-time alerting (14 endpoints)
- **Clinical** - Clinical operations (32 endpoints)

## Usage

### Importing Routes Module
```typescript
// In app.module.ts
import { RoutesModule } from './routes/routes.module';

@Module({
  imports: [
    // ... other imports
    RoutesModule,  // Add here
  ],
})
export class AppModule {}
```

### Creating a New Route Controller

1. **Create Controller:**
```typescript
// routes/v1/{module}/{module}.controller.ts
import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('{Module} v1')
@Controller('api/v1/{module}')
export class {Module}V1Controller {
  constructor(private readonly service: {Module}Service) {}

  @Get()
  async list() {
    return { success: true, data: [] };
  }
}
```

2. **Create Module:**
```typescript
// routes/v1/{module}/{module}.module.ts
import { Module } from '@nestjs/common';
import { {Module}V1Controller } from './{module}.controller';

@Module({
  controllers: [{Module}V1Controller],
})
export class {Module}V1Module {}
```

3. **Register in V1 Routes:**
```typescript
// routes/v1/v1-routes.module.ts
import { {Module}V1Module } from './{module}/{module}.module';

@Module({
  imports: [
    CoreV1Module,
    {Module}V1Module,  // Add here
  ],
})
export class V1RoutesModule {}
```

## Features

### Response Transformation
All controller responses are automatically transformed to the standard format:
```typescript
{
  success: true,
  data: { ... },
  message?: string
}
```

### Authentication
- **Public routes:** Use `@Public()` decorator
- **Protected routes:** Default behavior (requires JWT)
- **Role-based routes:** Use `@Roles('ADMIN', 'NURSE')`

### Error Handling
Use NestJS exceptions for consistent error responses:
```typescript
throw new UnauthorizedException('Invalid credentials');
throw new NotFoundException('Resource not found');
throw new BadRequestException('Invalid input');
```

### API Documentation
All routes automatically documented via Swagger:
- Available at `/api/docs` (when configured)
- Uses `@ApiTags()`, `@ApiOperation()`, `@ApiResponse()` decorators

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "user": { ... }
  },
  "message": "Optional message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": { ... }
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "currentPage": 1,
    "itemsPerPage": 20,
    "totalItems": 100,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## Development Guidelines

### Route Naming
- Follow RESTful conventions
- Use plural nouns for resources: `/users`, `/medications`
- Use nested routes for relationships: `/students/:id/medications`

### HTTP Methods
- **GET** - Retrieve resources
- **POST** - Create resources
- **PUT/PATCH** - Update resources
- **DELETE** - Delete resources

### Status Codes
- **200** - Success (GET, PUT, PATCH)
- **201** - Created (POST)
- **204** - No Content (DELETE)
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (authentication required)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (resource doesn't exist)
- **409** - Conflict (duplicate resource)
- **500** - Internal Server Error

## Testing

### Manual Testing
```bash
# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Protected endpoint
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer <token>"
```

### Integration Testing
```typescript
describe('AuthV1Controller', () => {
  it('should login user', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });
});
```

## Troubleshooting

### Common Issues

1. **Routes not found (404)**
   - Verify module is imported in v1-routes.module.ts
   - Check controller path matches expected route
   - Ensure app.module.ts imports RoutesModule

2. **Authentication errors**
   - Check JWT_SECRET environment variable
   - Verify token format: "Bearer <token>"
   - Ensure @Public() decorator on public routes

3. **Validation errors**
   - Verify DTOs have proper class-validator decorators
   - Check global validation pipe is enabled
   - Ensure @Body() decorator is used

4. **Response format issues**
   - ResponseTransformInterceptor should be applied globally
   - Return plain objects or use custom format with success/data keys

## Resources

- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Detailed migration instructions
- [NestJS Documentation](https://docs.nestjs.com/)
- [Legacy Backend](../../backend/src/routes/) - Original Hapi.js routes

## Next Steps

1. Complete Core routes migration (users, accessControl, health, contacts)
2. Migrate Healthcare routes (medications, healthRecords, healthAssessments)
3. Migrate Operations routes (students, appointments, emergencyContacts, inventory)
4. Continue with Supporting and Advanced routes
5. Comprehensive testing and performance benchmarks

## Support

For migration questions or issues:
1. Consult MIGRATION_GUIDE.md
2. Review completed controllers as examples
3. Check NestJS documentation
4. Contact team lead or senior developers
