# ERR-A7B9: __Host- Cookie Prefix Authentication Failure in Development

**Error ID:** ERR-A7B9  
**Date Reported:** 2025-11-05  
**Severity:** High  
**Status:** Resolved  
**Component:** Authentication / Cookie Management  

## Summary

Authentication cookies using the `__Host-` security prefix failed to work in development environment (localhost), causing "Invalid token" errors in middleware despite successful login.

## Symptoms

- Login action successfully sets authentication cookie
- Logs show cookie being set: `cookieName: '__Host-auth.token'`
- Middleware immediately fails with "Invalid token" error
- Token verification fails even though token was just created
- Issue occurs only in development (localhost), not in production (HTTPS)

## Root Cause

The `__Host-` cookie prefix is a security feature that requires:
1. `Secure` flag must be set to `true`
2. Cookie must be set over HTTPS
3. No `Domain` attribute allowed
4. `Path` must be `/`

In development environments (localhost with HTTP), browsers **reject** cookies with the `__Host-` prefix when `secure: false`. The cookie appeared to be set in application logs but was silently rejected by the browser, causing the middleware to fail authentication.

## Technical Details

### Before Fix
```typescript
export const COOKIE_NAMES = {
  ACCESS_TOKEN: '__Host-auth.token',     // Always used __Host- prefix
  REFRESH_TOKEN: '__Host-auth.refresh',
  SESSION_ID: '__Host-auth.session',
} as const;
```

### After Fix
```typescript
export const COOKIE_NAMES = {
  // Use __Host- prefix only in production (HTTPS)
  // Use regular names in development (localhost HTTP)
  ACCESS_TOKEN: process.env.NODE_ENV === 'production' 
    ? '__Host-auth.token' 
    : 'auth.token',
  REFRESH_TOKEN: process.env.NODE_ENV === 'production' 
    ? '__Host-auth.refresh' 
    : 'auth.refresh',
  SESSION_ID: process.env.NODE_ENV === 'production' 
    ? '__Host-auth.session' 
    : 'auth.session',
} as const;
```

## Resolution Steps

1. Modified `frontend/src/identity-access/lib/config/cookies.ts`
2. Added conditional cookie naming based on `NODE_ENV`
3. Production environments continue to use secure `__Host-` prefix
4. Development environments use regular cookie names without prefix
5. Maintains security in production while allowing development workflow

## Files Modified

- `frontend/src/identity-access/lib/config/cookies.ts`

## Prevention

- Always test authentication flows in development environment
- Document browser security requirements for cookie prefixes
- Consider adding warnings when security features are disabled in development
- Add integration tests that verify cookie setting/reading in both environments

## Related Issues

- Browser security policies for cookie prefixes
- HTTPS requirements for secure cookies
- Next.js middleware cookie extraction

## References

- [MDN: Cookie Prefixes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#cookie_prefixes)
- [Chrome Cookie Prefix Requirements](https://web.dev/first-party-cookie-recipes/)
- Next.js Cookie Handling in Middleware

## Testing

### Verification Steps
1. Start development server with `npm run dev`
2. Navigate to login page
3. Complete login with valid credentials
4. Verify redirect to dashboard succeeds
5. Check browser DevTools > Application > Cookies
6. Confirm `auth.token` cookie is present (not `__Host-auth.token`)
7. Verify no "Invalid token" errors in console
8. Confirm middleware successfully authenticates requests

### Production Testing
1. Deploy to production environment with HTTPS
2. Verify cookies use `__Host-` prefix
3. Confirm authentication flow works end-to-end
4. Validate cookie security attributes (secure, httpOnly, sameSite)

## Additional Notes

This is a common pitfall when implementing strict security measures in cookies. The `__Host-` prefix provides excellent security in production but requires proper environment detection to work in development. Always balance security requirements with developer experience.
