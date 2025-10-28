# API Routes Migration Guide

## Overview
This guide documents the migration of API routes from the Hapi.js backend (`backend/src/routes`) to the NestJS backend (`nestjs-backend/src/routes`).

## Migration Status

### ✅ Completed
1. **Infrastructure Setup**
   - Created routes module structure (`/routes/v1/`)
   - Implemented response transform interceptor
   - Created shared decorators (@Public, @Roles)
   - Set up validation configuration
   - Integrated routes module into app.module.ts

2. **Core Routes - Authentication**
   - Migrated auth controller with 6 endpoints:
     - POST `/api/v1/auth/register` - User registration
     - POST `/api/v1/auth/login` - User login
     - POST `/api/v1/auth/verify` - Token verification
     - POST `/api/v1/auth/refresh` - Token refresh
     - GET `/api/v1/auth/me` - Get current user
     - GET `/api/v1/auth/test-login` - E2E test login
   - Extended AuthService with `verifyToken()` method
   - Maintained backward compatibility with legacy API responses

### 🔄 In Progress
The following route groups need to be migrated following the established pattern:

#### Core Routes (Priority: High)
- **users** - User management CRUD operations
- **accessControl** - RBAC and permission management
- **health** - Health check endpoints
- **contacts** - Contact management

#### Healthcare Routes (Priority: High)
- **medications** - Medication management (7 routes)
- **healthRecords** - Health record CRUD
- **healthAssessments** - Health assessment forms

#### Operations Routes (Priority: Medium)
- **students** - Student management operations
- **appointments** - Appointment scheduling
- **emergencyContacts** - Emergency contact management
- **inventory** - Inventory tracking
- **studentManagement** - Advanced student operations

#### Supporting Routes (Priority: Medium)
- **documents** - Document management
- **compliance** - Audit logs and compliance
- **communications** - Messages and broadcasts (2 modules)
- **incidents** - Incident reporting
- **analytics** - Analytics and reporting
- **system** - System administration

#### Advanced Routes (Priority: Low)
- **alerts** - Real-time alerting (14 routes)
- **clinical** - Clinical operations (32 routes)

## Migration Pattern

### 1. Controller Migration

**From (Hapi.js):**
```typescript
// backend/src/routes/v1/core/controllers/auth.controller.ts
export class AuthController {
  static async login(request: any, h: ResponseToolkit) {
    const { email, password } = request.payload;
    // ... logic
    return successResponse(h, { token, user });
  }
}
```

**To (NestJS):**
```typescript
// nestjs-backend/src/routes/v1/core/auth.controller.ts
@Controller('api/v1/auth')
export class AuthV1Controller {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      success: true,
      data: {
        token: result.accessToken,
        user: result.user,
      },
    };
  }
}
```

### 2. Route Definition Migration

**From (Hapi.js):**
```typescript
{
  method: 'POST',
  path: '/api/v1/auth/login',
  handler: asyncHandler(AuthController.login),
  options: {
    auth: false,
    tags: ['api', 'Authentication', 'v1'],
    validate: { payload: loginSchema }
  }
}
```

**To (NestJS):**
```typescript
@Public()
@Post('login')
@HttpCode(HttpStatus.OK)
@ApiTags('Authentication v1')
@ApiOperation({ summary: 'Authenticate user' })
async login(@Body() loginDto: LoginDto) {
  // Implementation
}
```

### 3. Validator to DTO Migration

**From (Joi):**
```typescript
// backend/src/routes/v1/core/validators/auth.validators.ts
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});
```

**To (class-validator DTO):**
```typescript
// nestjs-backend/src/auth/dto/login.dto.ts
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
```

### 4. Response Format Migration

**Standard Response Format (maintained for backward compatibility):**
```typescript
// Success response
{
  success: true,
  data: { ... },
  message?: string
}

// Error response
{
  success: false,
  error: {
    message: string,
    code: string,
    details?: any
  }
}

// Paginated response
{
  success: true,
  data: [...],
  pagination: {
    currentPage: number,
    itemsPerPage: number,
    totalItems: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean
  }
}
```

## Step-by-Step Migration Process

### For Each Route Group:

1. **Analyze Existing Routes**
   ```bash
   # Examine route structure
   cat backend/src/routes/v1/{module}/index.ts
   cat backend/src/routes/v1/{module}/routes/*.ts
   cat backend/src/routes/v1/{module}/controllers/*.ts
   cat backend/src/routes/v1/{module}/validators/*.ts
   ```

2. **Create Module Structure**
   ```bash
   mkdir -p nestjs-backend/src/routes/v1/{module}
   ```

3. **Create Controller**
   ```typescript
   // nestjs-backend/src/routes/v1/{module}/{module}.controller.ts
   import { Controller } from '@nestjs/common';
   import { ApiTags } from '@nestjs/swagger';

   @ApiTags('{Module} v1')
   @Controller('api/v1/{module}')
   export class {Module}V1Controller {
     constructor(private readonly service: {Module}Service) {}

     // Migrate endpoints here
   }
   ```

4. **Create DTOs** (if not already in existing module)
   ```typescript
   // Use class-validator decorators
   import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

   export class Create{Entity}Dto {
     @IsString()
     @IsNotEmpty()
     name: string;

     @IsString()
     @IsOptional()
     description?: string;
   }
   ```

5. **Create Module**
   ```typescript
   // nestjs-backend/src/routes/v1/{module}/{module}.module.ts
   import { Module } from '@nestjs/common';
   import { {Module}V1Controller } from './{module}.controller';
   import { {Module}Module } from '../../../{module}/{module}.module';

   @Module({
     imports: [{Module}Module],
     controllers: [{Module}V1Controller],
   })
   export class {Module}V1Module {}
   ```

6. **Register in V1 Routes Module**
   ```typescript
   // nestjs-backend/src/routes/v1/v1-routes.module.ts
   import { {Module}V1Module } from './{module}/{module}.module';

   @Module({
     imports: [
       CoreV1Module,
       {Module}V1Module, // Add here
       // ...
     ],
   })
   export class V1RoutesModule {}
   ```

7. **Test Endpoints**
   ```bash
   # Start server and test
   npm run start:dev
   curl -X POST http://localhost:3000/api/v1/{module}/test
   ```

## Key Differences Between Hapi.js and NestJS

| Aspect | Hapi.js | NestJS |
|--------|---------|---------|
| Route Definition | Object with method, path, handler, options | Decorators (@Get, @Post, etc.) |
| Controllers | Static classes with static methods | Injectable classes with instance methods |
| Validation | Joi schemas in route options | class-validator DTOs with decorators |
| Response Helpers | Manual h.response() calls | Direct returns or exceptions |
| Error Handling | asyncHandler wrapper + response helpers | Built-in exception filters |
| Authentication | auth: 'jwt' or auth: false | @UseGuards(JwtAuthGuard) or @Public() |
| Dependency Injection | Manual imports | Constructor injection |
| Swagger/OpenAPI | hapi-swagger plugin | @nestjs/swagger decorators |

## Authentication & Authorization

### Public Routes (No Auth Required)
```typescript
@Public()
@Post('login')
async login(@Body() loginDto: LoginDto) {
  // Public endpoint
}
```

### Protected Routes (Auth Required)
```typescript
// No decorator needed - auth is default with global JWT guard
@Get('profile')
async getProfile(@CurrentUser() user: any) {
  // Requires authentication
}
```

### Role-Based Routes
```typescript
@Roles('ADMIN', 'NURSE')
@Post('sensitive-action')
async sensitiveAction() {
  // Only ADMIN and NURSE roles can access
}
```

## Response Transformation

The `ResponseTransformInterceptor` automatically formats responses:

```typescript
// Controller returns:
return { token, user };

// Client receives:
{
  success: true,
  data: { token, user }
}
```

To return custom format:
```typescript
return {
  success: true,
  message: 'Custom message',
  data: { ... }
};
```

## Error Handling

### Using NestJS Exceptions
```typescript
// Instead of:
return unauthorizedResponse(h, 'Invalid credentials');

// Use:
throw new UnauthorizedException('Invalid credentials');

// Common exceptions:
throw new BadRequestException('Invalid input');
throw new NotFoundException('Resource not found');
throw new ConflictException('Resource already exists');
throw new ForbiddenException('Access denied');
```

## Testing

### Testing Migrated Endpoints
```bash
# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Protected endpoint
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer <token>"
```

## Migration Checklist Template

For each route group, copy this checklist:

- [ ] Analyze existing routes and controllers
- [ ] Create module directory structure
- [ ] Create or reference existing DTOs
- [ ] Create v1 controller with migrated endpoints
- [ ] Create module file
- [ ] Register module in v1-routes.module.ts
- [ ] Test all endpoints
- [ ] Verify response formats match legacy API
- [ ] Verify authentication and authorization
- [ ] Update API documentation

## Common Issues & Solutions

### Issue: Token verification fails
**Solution:** Ensure JWT secret matches between old and new backend. Check `JWT_SECRET` in `.env`.

### Issue: Response format doesn't match legacy API
**Solution:** Return object with `success`, `data`, `message` keys or use ResponseTransformInterceptor.

### Issue: Validation errors differ from Joi
**Solution:** Map class-validator decorators to match Joi rules. Use custom validators if needed.

### Issue: Service not found in controller
**Solution:** Import and register the service's module in the route module's imports array.

## Next Steps

1. **Migrate Core Routes** (users, accessControl, health, contacts)
2. **Migrate Healthcare Routes** (medications, healthRecords, healthAssessments)
3. **Migrate Operations Routes** (students, appointments, emergencyContacts, inventory)
4. **Migrate Supporting Routes** (documents, compliance, communications, incidents, analytics, system)
5. **Migrate Advanced Routes** (alerts, clinical)
6. **Comprehensive Testing** - Test all endpoints with integration tests
7. **Performance Testing** - Ensure no regression in response times
8. **Documentation** - Update OpenAPI/Swagger documentation

## Resources

- [NestJS Controllers](https://docs.nestjs.com/controllers)
- [NestJS Validation](https://docs.nestjs.com/techniques/validation)
- [NestJS OpenAPI](https://docs.nestjs.com/openapi/introduction)
- [class-validator Decorators](https://github.com/typestack/class-validator)
- [Hapi.js Migration Guide](https://hapi.dev/)

## Contact & Support

For questions or issues during migration, consult:
- NestJS documentation
- Existing migrated modules as examples
- Team lead or senior developers
