# Guards Directory

This directory centralizes all authentication, authorization, and security guards for easier management and debugging.

## Current Status

✅ **Login Working**: Basic authentication endpoint now works (401 "Invalid email or password" instead of 403 Forbidden)

🚫 **Temporarily Disabled Guards** (for testing):
- `ContextGuard` (was causing 403 Forbidden errors)
- `ContextInterceptor` (was causing 500 Internal Server errors) 
- `ThrottlerGuard` (global rate limiting)
- `JwtAuthGuard` (global authentication)
- `RolesGuard` (global role-based access)

## Guard Inventory (58 Total)

### 🔴 Problematic Guards (causing login issues)
- `ContextGuard` - Request context validation causing 403 errors
- `ThrottlerGuard` - May block public routes 
- `GlobalAuthGuard` - Complex dependency injection issues

### 🟢 Critical Guards (core functionality)
- `JwtAuthGuard` - Main JWT authentication
- `RolesGuard` - Role-based access control
- `PermissionsGuard` - Permission-based access
- `IpRestrictionGuard` - IP filtering

### 📊 Guard Categories
1. **Authentication** (6 guards) - JWT, OAuth, API keys
2. **Authorization** (4 guards) - Roles, permissions, RBAC  
3. **Security** (4 guards) - CSRF, IP restrictions, policies
4. **Rate Limiting** (4 guards) - Various rate limiting implementations
5. **Healthcare/HIPAA** (3 guards) - Medical staff, patient consent
6. **Multi-Factor Auth** (3 guards) - MFA, TOTP, SMS
7. **WebSocket** (2 guards) - WebSocket-specific auth/throttling
8. **GraphQL** (3 guards) - GraphQL-specific auth/roles
9. **Discovery/Admin** (4 guards) - Admin tools, resource management
10. **Tenant/Multi-tenancy** (2 guards) - Tenant isolation
11. **Session** (2 guards) - Session management
12. **Network/IP** (2 guards) - Network access controls
13. **Composite** (3 guards) - Combined guard functionality

## File Locations

All guards are currently exported from `index.ts` with their original file paths preserved for backward compatibility during migration.

## Next Steps

1. ✅ **Phase 1**: Identify and disable problematic guards (COMPLETED)
2. 🔄 **Phase 2**: Test login functionality (IN PROGRESS)  
3. ⏳ **Phase 3**: Gradually re-enable guards with proper configurations
4. ⏳ **Phase 4**: Move guards to centralized location
5. ⏳ **Phase 5**: Standardize guard patterns and remove duplicates

## Testing Commands

```bash
# Test login endpoint
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpassword"}'

# Expected: 401 "Invalid email or password" (good - endpoint works)
# Not expected: 403 "Forbidden resource" (bad - guards blocking)
```

## Guard Disabling Locations

- `backend/src/app.module.ts` - Disabled ThrottlerGuard, JwtAuthGuard
- `backend/src/core/core.module.ts` - Disabled RolesGuard  
- `backend/src/common/context/context.module.ts` - Disabled ContextGuard, ContextInterceptor

## Re-enabling Guards

When ready to re-enable guards, uncomment the respective sections in the module files and ensure:

1. **Public routes** are properly decorated with `@Public()`
2. **Guard order** follows security best practices
3. **Dependencies** are properly injected
4. **Error handling** provides clear feedback
