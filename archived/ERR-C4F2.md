# ERR-C4F2: API Client Token Extraction Failure After Cookie Name Change

**Error ID:** ERR-C4F2  
**Date Reported:** 2025-11-05  
**Severity:** High  
**Status:** Resolved  
**Component:** API Client / Authentication  
**Related To:** ERR-A7B9

## Summary

After fixing the `__Host-` cookie prefix issue (ERR-A7B9), the Next.js API client failed to extract authentication tokens from cookies because the `getAuthToken()` function was hardcoded to use the production cookie name (`__Host-auth.token`) instead of the environment-aware cookie name.

## Symptoms

- Login succeeds and cookies are set correctly with `auth.token` (development)
- Dashboard page loads but shows no data
- API client logs show: `[Next API Client] Auth check: { hasToken: false, tokenStart: undefined }`
- Error message: `[Next API Client] No auth token found for protected endpoint: /dashboard/stats`
- Causes redirect loop: Server redirects to `/login` with digest: `NEXT_REDIRECT`
- User appears authenticated but all API requests fail

## Root Cause

The `getAuthToken()` function in `src/lib/api/nextjs-client.ts` was directly hardcoded to look for `__Host-auth.token`:

```typescript
async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('__Host-auth.token')?.value || null;  // ❌ Hardcoded
  } catch (error) {
    console.error('[Next API Client] Failed to get auth token:', error);
    return null;
  }
}
```

After fixing ERR-A7B9, cookie names became environment-dependent:
- **Development**: `auth.token`
- **Production**: `__Host-auth.token`

The hardcoded value prevented the API client from finding the development cookie, causing all authenticated API requests to fail.

## Error Flow

1. User logs in successfully
2. Login action sets cookie with name `auth.token` (development)
3. Dashboard page loads and attempts to fetch data
4. `getDashboardStats()` calls `nextFetch()` which calls `getAuthToken()`
5. `getAuthToken()` looks for `__Host-auth.token` cookie ❌
6. Cookie not found, returns `null`
7. API client detects missing token for protected endpoint
8. Redirects to `/login` with `NEXT_REDIRECT` error
9. User experiences redirect loop or blank dashboard

## Technical Details

### Before Fix
```typescript
// src/lib/api/nextjs-client.ts
async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('__Host-auth.token')?.value || null;  // Hardcoded
  } catch (error) {
    console.error('[Next API Client] Failed to get auth token:', error);
    return null;
  }
}
```

### After Fix
```typescript
// Added import
import { COOKIE_NAMES } from '@/identity-access/lib/config/cookies';

// Updated function to use centralized configuration
async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    // Use centralized cookie name configuration (environment-aware)
    return cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value || null;
  } catch (error) {
    console.error('[Next API Client] Failed to get auth token:', error);
    return null;
  }
}
```

### Cookie Configuration (Centralized)
```typescript
// src/identity-access/lib/config/cookies.ts
export const COOKIE_NAMES = {
  ACCESS_TOKEN: process.env.NODE_ENV === 'production' 
    ? '__Host-auth.token'   // Production (HTTPS)
    : 'auth.token',         // Development (localhost)
  // ...
} as const;
```

## Resolution Steps

1. Added import for `COOKIE_NAMES` from centralized cookie configuration
2. Updated `getAuthToken()` to use `COOKIE_NAMES.ACCESS_TOKEN` constant
3. Function now automatically adapts to environment (dev/prod)
4. Verified token extraction works in both environments

## Files Modified

- `frontend/src/lib/api/nextjs-client.ts`
  - Added import: `import { COOKIE_NAMES } from '@/identity-access/lib/config/cookies';`
  - Updated `getAuthToken()` function to use constant instead of hardcoded value

## Prevention

### Code Review Checklist
- [ ] Always use centralized constants for cookie names
- [ ] Never hardcode cookie names in API client code
- [ ] Search for all references when changing cookie configuration
- [ ] Test API client authentication in development environment
- [ ] Verify cookie extraction after authentication changes

### Recommended Patterns

**✅ Good - Use Centralized Constants:**
```typescript
import { COOKIE_NAMES } from '@/identity-access/lib/config/cookies';

const token = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
```

**❌ Bad - Hardcode Cookie Names:**
```typescript
const token = cookieStore.get('__Host-auth.token')?.value;
const refresh = cookieStore.get('__Host-auth.refresh')?.value;
```

### Testing Guidelines

1. **After Cookie Configuration Changes:**
   - Grep search for all occurrences of old cookie names
   - Update all references to use centralized constants
   - Test authentication flow end-to-end
   - Verify API calls succeed after login

2. **Development Testing:**
   - Clear all cookies before testing
   - Complete full login flow
   - Check browser DevTools > Application > Cookies
   - Verify correct cookie names are set
   - Confirm API requests include Authorization header

3. **Integration Testing:**
   - Add test to verify `getAuthToken()` returns correct value
   - Mock cookie store in different environments
   - Test token extraction in both dev and prod modes

## Related Issues

- **ERR-A7B9**: Root cause - `__Host-` prefix incompatibility with localhost
- Cookie management across environments
- API client authentication integration
- Server-side cookie extraction in Next.js

## Log Examples

### Before Fix
```
[Login Action] Setting auth token: { cookieName: 'auth.token' }
[Login Action] Auth token cookie set, verifying: { cookieExists: true }
[Next API Client] Auth check: {
  endpoint: '/dashboard/stats',
  hasToken: false,           // ❌ Token not found
  tokenStart: undefined,
  requiresAuth: true
}
[Next API Client] No auth token found for protected endpoint: /dashboard/stats
Error: NEXT_REDIRECT { digest: 'NEXT_REDIRECT;push;/login;307;' }
```

### After Fix
```
[Login Action] Setting auth token: { cookieName: 'auth.token' }
[Login Action] Auth token cookie set, verifying: { cookieExists: true }
[Next API Client] Auth check: {
  endpoint: '/dashboard/stats',
  hasToken: true,            // ✅ Token found
  tokenStart: 'eyJhbGciOiJIUzI1NiIs',
  requiresAuth: true
}
[Next API Client] Added Authorization header
[Dashboard] Dashboard statistics loaded successfully
```

## Impact

- **Severity**: High - Complete API authentication failure
- **Scope**: All authenticated API requests from server components/actions
- **Users Affected**: All users in development environment
- **Data Loss**: None - authentication state preserved
- **Workaround**: None - requires code fix

## Additional Notes

This is a cascading issue from ERR-A7B9. When fixing cookie prefix issues, it's critical to:

1. **Use centralized configuration** - Single source of truth for cookie names
2. **Update all consumers** - Search entire codebase for hardcoded references
3. **Test comprehensively** - Verify end-to-end authentication flow
4. **Document dependencies** - Link related error reports

The fix ensures that cookie name changes are automatically propagated to all consumers through the centralized `COOKIE_NAMES` constant, preventing similar issues in the future.

## References

- ERR-A7B9: __Host- Cookie Prefix Authentication Failure
- `frontend/src/identity-access/lib/config/cookies.ts` - Centralized cookie configuration
- `frontend/src/lib/api/nextjs-client.ts` - API client implementation
- Next.js `cookies()` API documentation
- Cookie extraction patterns in Server Components
