# Routes Migration Guide

## Overview

This guide documents the migration from the flat routes structure to the new enterprise-grade modular architecture with API versioning.

## Migration Status

### Phase 1: Foundation ✅ COMPLETE
- [x] Create new directory structure
- [x] Create shared infrastructure
- [x] Create response helpers
- [x] Create pagination helpers
- [x] Create filter helpers
- [x] Create async handler wrapper
- [x] Create PHI audit middleware
- [x] Create RBAC middleware
- [x] Create common validation schemas

### Phase 2: Core Module ✅ COMPLETE
- [x] Migrate auth routes (5 endpoints)
- [x] Migrate users routes (11 endpoints)
- [ ] Migrate access control routes (8 endpoints)

### Phase 3: Healthcare Module ⏳ PENDING
- [ ] Migrate medications routes (17 endpoints)
- [ ] Migrate health records routes (20+ endpoints)
- [ ] Migrate emergency contacts routes (8 endpoints)

### Phase 4: Operations Module ⏳ PENDING
- [ ] Migrate students routes (11 endpoints)
- [ ] Migrate appointments routes (17 endpoints)

### Phase 5: Other Modules ⏳ PENDING
- [ ] Compliance module
- [ ] Communication module
- [ ] System module
- [ ] Incidents module

## File Mapping

### Before → After

| Old Location | New Location | Status |
|--------------|--------------|--------|
| `routes/auth.ts` | `routes/v1/core/routes/auth.routes.ts` + `routes/v1/core/controllers/auth.controller.ts` | ✅ Migrated |
| `routes/users.ts` | `routes/v1/core/routes/users.routes.ts` + `routes/v1/core/controllers/users.controller.ts` | ✅ Migrated |
| `routes/students.ts` | `routes/v1/operations/routes/students.routes.ts` + `routes/v1/operations/controllers/students.controller.ts` | ⏳ Pending |
| `routes/medications.ts` | `routes/v1/healthcare/routes/medications.routes.ts` + `routes/v1/healthcare/controllers/medications.controller.ts` | ⏳ Pending |
| ... | ... | ... |

## Migration Checklist

For each route file being migrated:

### 1. Create Controller
- [ ] Create `controllers/{resource}.controller.ts`
- [ ] Move business logic from handlers to controller methods
- [ ] Use shared response helpers
- [ ] Use async/await consistently
- [ ] Add JSDoc comments

### 2. Create Validators
- [ ] Create `validators/{resource}.validators.ts`
- [ ] Extract Joi schemas from route options
- [ ] Use common schemas where applicable
- [ ] Add descriptive error messages

### 3. Create Routes
- [ ] Create `routes/{resource}.routes.ts`
- [ ] Update paths to include `/api/v1/`
- [ ] Wrap handlers with `asyncHandler`
- [ ] Add/update Swagger documentation
- [ ] Configure authentication and authorization

### 4. Update Module Index
- [ ] Import new routes in module `index.ts`
- [ ] Export routes array

### 5. Testing
- [ ] Create controller unit tests
- [ ] Create route integration tests
- [ ] Update E2E tests with new paths
- [ ] Verify Swagger docs generation

### 6. Update References
- [ ] Update frontend API calls
- [ ] Update Postman collection
- [ ] Update API documentation
- [ ] Notify dependent teams

## Example Migration

### Before (Old Structure)
```typescript
// routes/auth.ts
const loginHandler = async (request: any, h: any) => {
  try {
    const { email, password } = request.payload;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return h.response({ success: false, error: { message: 'Invalid credentials' }}).code(401);
    }
    // ... more logic
    return h.response({ success: true, data: { token, user } });
  } catch (error) {
    return h.response({ success: false, error: { message: error.message }}).code(500);
  }
};

export const authRoutes: ServerRoute[] = [{
  method: 'POST',
  path: '/api/auth/login',
  handler: loginHandler,
  options: {
    auth: false,
    validate: {
      payload: Joi.object({ email: Joi.string().email().required(), password: Joi.string().required() })
    }
  }
}];
```

### After (New Structure)

**Controller:**
```typescript
// routes/v1/core/controllers/auth.controller.ts
import { successResponse, unauthorizedResponse } from '../../../shared/utils';

export class AuthController {
  static async login(request: any, h: ResponseToolkit) {
    const { email, password } = request.payload;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return unauthorizedResponse(h, 'Invalid credentials');
    }

    // ... more logic
    return successResponse(h, { token, user });
  }
}
```

**Validator:**
```typescript
// routes/v1/core/validators/auth.validators.ts
import { emailSchema } from '../../../shared/validators';

export const loginSchema = Joi.object({
  email: emailSchema,
  password: Joi.string().required()
});
```

**Route:**
```typescript
// routes/v1/core/routes/auth.routes.ts
import { asyncHandler } from '../../../shared/utils';
import { AuthController } from '../controllers/auth.controller';
import { loginSchema } from '../validators/auth.validators';

export const authRoutes: ServerRoute[] = [{
  method: 'POST',
  path: '/api/v1/auth/login',  // Note: v1 prefix
  handler: asyncHandler(AuthController.login),  // Note: wrapped with asyncHandler
  options: {
    auth: false,
    tags: ['api', 'Authentication', 'v1'],
    validate: { payload: loginSchema }
  }
}];
```

## Benefits of New Structure

✅ **Separation of Concerns**: Routes, controllers, and validators in separate files
✅ **Code Reuse**: Shared utilities eliminate 2,000+ lines of duplication
✅ **Type Safety**: Consistent TypeScript interfaces
✅ **Error Handling**: Automatic via `asyncHandler` wrapper
✅ **HIPAA Compliance**: Built-in PHI audit middleware
✅ **API Versioning**: Future-proof with v1 prefix
✅ **Testability**: Controllers can be unit tested in isolation
✅ **Maintainability**: Modular structure easier to navigate
✅ **Documentation**: Better Swagger docs with consistent patterns

## Rollback Plan

If issues arise:

1. **Parallel Run**: Old and new routes run simultaneously
2. **Feature Flag**: Toggle between old/new implementations
3. **Monitoring**: Track error rates for new vs old routes
4. **Quick Revert**: Keep old files until migration is 100% complete

## Timeline

- **Week 1**: Foundation + Core module (auth, users)
- **Week 2**: Healthcare module (medications, health records)
- **Week 3**: Operations module (students, appointments)
- **Week 4**: Remaining modules
- **Week 5**: Testing, cleanup, documentation

## Questions?

Contact the Platform Team for migration support.
