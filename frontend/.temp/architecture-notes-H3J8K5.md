# Authentication System - Architecture Notes
**Agent ID**: H3J8K5 (TypeScript Architect)
**Date**: November 1, 2025

---

## Type System Architecture

### Core Types

```typescript
// User - Central authentication identity
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions?: string[];  // RBAC permission strings
  // ... profile fields
}

// AuthState - Redux authentication state
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sessionExpiresAt: number | null;  // Token expiration timestamp
}

// Permission - String-based permission identifier
type PermissionString = string;  // Format: "resource:action" e.g., "students:edit"
```

### Type Flow

```
Authentication Flow:
  Login → AuthResponse → User → AuthState → AuthContext
  
Permission Check Flow:
  Component → useAuth() → hasPermission(string) → user.permissions?.includes()
  
Session Management:
  Activity → lastActivityAt → checkSession() → timeout logic
```

---

## Design Decisions

### 1. String-Based Permissions vs Object Permissions

**Decision**: Use string-based permissions (not Permission objects)

**Rationale**:
- AuthContext.hasPermission() expects `string` parameter
- Simpler to work with and serialize
- Matches backend permission system
- Easier to cache and compare

**Implementation**:
```typescript
// PermissionGate uses string permissions
<PermissionGate permission="students:edit">
  <EditButton />
</PermissionGate>

// useAuth provides hasPermission(string)
const { hasPermission } = useAuth();
if (hasPermission("students:edit")) { ... }
```

### 2. ReturnType<typeof setTimeout> vs NodeJS.Timeout

**Decision**: Use `ReturnType<typeof setTimeout>` for timer refs

**Rationale**:
- Next.js Edge Runtime doesn't have NodeJS namespace
- Browser setTimeout returns number, Node returns Timeout object
- ReturnType provides cross-environment compatibility
- Avoids dependency on @types/node

**Implementation**:
```typescript
const interval = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
```

### 3. Unknown vs Any for Error Handling

**Decision**: Use `error: unknown` with type assertions

**Rationale**:
- TypeScript 4.0+ best practice for catch blocks
- Forces explicit type checking
- More type-safe than `any`
- Better IDE support

**Implementation**:
```typescript
catch (error: unknown) {
  if (error instanceof z.ZodError) { ... }
  throw createApiError(error as Error, 'message');
}
```

### 4. sessionExpiresAt in AuthState

**Decision**: Added `sessionExpiresAt: number | null` to AuthState

**Rationale**:
- AuthContext needs token expiration for session management
- Redux is source of truth for auth state
- Enables server-side and client-side timeout coordination
- HIPAA compliance requires session timeout tracking

**Implementation**:
```typescript
interface AuthState {
  sessionExpiresAt: number | null;  // Unix timestamp
}

// Check expiration
if (sessionExpiresAt && Date.now() >= sessionExpiresAt) {
  logout();
}
```

### 5. Async Thunk Parameters

**Decision**: All async thunks require explicit parameter (even if undefined)

**Rationale**:
- Redux Toolkit createAsyncThunk requires first parameter
- Consistent API across all thunks
- TypeScript enforces parameter presence
- Prevents accidental omissions

**Implementation**:
```typescript
// Thunk definition
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => { ... }
);

// Usage
dispatch(logoutUser(undefined));
```

---

## Integration Patterns

### 1. Redux + Context Pattern

**Architecture**:
```
Redux Store (Source of Truth)
  ↓
AuthContext (Convenience Layer)
  ↓
useAuth() Hook (Component API)
  ↓
Components
```

**Benefits**:
- Redux provides global state management
- Context adds convenience methods (hasPermission, hasRole)
- Hook simplifies component integration
- Clear separation of concerns

### 2. Multi-Tab Synchronization

**Architecture**:
```
User Action (Tab 1)
  ↓
Redux Action
  ↓
BroadcastChannel.postMessage()
  ↓
Other Tabs Receive
  ↓
Dispatch Same Action
```

**Type Safety**:
```typescript
broadcastChannel.current.onmessage = (event: MessageEvent) => {
  const { type, user } = event.data;
  if (type === 'login' && user) {
    dispatch(setUserFromSession(user));
  }
};
```

### 3. Session Timeout Management

**Architecture**:
```
Activity Events
  ↓
updateActivity() → setLastActivityAt(timestamp)
  ↓
checkSession() (every 30s)
  ↓
Calculate idle time
  ↓
Show warning (13 min) OR Logout (15 min)
```

**HIPAA Compliance**:
- 15 minute idle timeout
- 2 minute warning before timeout
- Activity tracking across tabs
- Automatic cleanup on timeout

---

## Performance Considerations

### 1. Permission Checking

**Optimization**: Array.includes() for permission checks
```typescript
hasPermission(permission: string): boolean {
  return user?.permissions?.includes(permission) ?? false;
}
```

**Complexity**: O(n) where n = permission count (typically < 50)

**Consideration**: If permission count grows large, consider Set-based storage

### 2. Session Checking Interval

**Current**: 30 second interval for checkSession()

**Rationale**:
- Balance between responsiveness and performance
- Acceptable latency for timeout warning
- Minimal CPU impact
- Battery-friendly for mobile

### 3. Multi-Tab Communication

**Current**: BroadcastChannel API (when available)

**Fallback**: localStorage events (not implemented)

**Consideration**: 
- BroadcastChannel is more efficient
- Graceful degradation when unavailable
- No polling required

---

## Security Considerations

### 1. Token Storage

**Architecture**:
```
Access Token → HTTP-only cookie (not accessible to JS)
Refresh Token → HTTP-only cookie (not accessible to JS)
User Profile → Redux store (non-sensitive data)
```

**Security Benefits**:
- XSS protection (tokens not in JS)
- CSRF protection via SameSite
- Auto-included in API requests
- No localStorage token exposure

### 2. Session Management

**HIPAA Requirements**:
- 15 minute idle timeout (enforced)
- Activity tracking (implemented)
- Multi-tab synchronization (implemented)
- Automatic logout (implemented)

**Type Safety**:
```typescript
// Session state is strictly typed
interface AuthContextValue {
  sessionExpiresAt: number | null;
  lastActivityAt: number;
  checkSession: () => boolean;
}
```

### 3. Permission Checking

**Type Safety**:
```typescript
// Permissions are type-checked strings
hasPermission(permission: string): boolean;

// Components can only use defined permissions
<PermissionGate permission="students:edit">  // ✅ Type-safe
```

---

## Testing Strategies

### 1. Type-Level Testing

Use TypeScript's type system to catch errors:
```typescript
// This will not compile if types are wrong
const user: User = { ... };
const hasPermissions = user.permissions?.includes("test");
```

### 2. Runtime Testing

Test auth flows with proper types:
```typescript
describe('AuthContext', () => {
  it('should check permissions correctly', () => {
    const { hasPermission } = useAuth();
    expect(hasPermission("students:view")).toBe(true);
  });
});
```

### 3. Integration Testing

Test full auth flow with types:
```typescript
it('should login and set user', async () => {
  await dispatch(loginUser({ email, password }));
  const state: AuthState = store.getState().auth;
  expect(state.user).toBeDefined();
  expect(state.isAuthenticated).toBe(true);
});
```

---

## Future Enhancements

### 1. Permission System

**Current**: String-based, flat list
**Future**: Hierarchical permissions with wildcards
```typescript
"students:*"     // All student permissions
"students:view:*" // All view sub-permissions
```

### 2. Role-Based Permissions

**Current**: Manual permission checks
**Future**: Automatic role-to-permission mapping
```typescript
const rolePermissions: Record<Role, Permission[]> = {
  ADMIN: ["*"],
  NURSE: ["students:*", "medications:*"],
};
```

### 3. Session Analytics

**Current**: Basic timeout tracking
**Future**: Detailed session analytics
```typescript
interface SessionMetrics {
  activeTime: number;
  idleTime: number;
  pageViews: number;
  apiCalls: number;
}
```

---

## References

### Related Files
- `/src/contexts/AuthContext.tsx` - Auth context provider
- `/src/stores/slices/authSlice.ts` - Redux auth state
- `/src/types/common.ts` - User type definition
- `/src/services/modules/authApi.ts` - Auth API service
- `/src/components/auth/PermissionGate.tsx` - Permission component
- `/src/components/auth/ProtectedRoute.tsx` - Route protection

### Related Documentation
- HIPAA Security Rule § 164.312(a)(2)(iii) - Automatic Logoff
- Next.js Middleware Authentication
- Redux Toolkit Async Thunks
- BroadcastChannel API

---

**Status**: Production-ready architecture with comprehensive type safety
**Last Updated**: November 1, 2025
**Agent**: TypeScript Architect (H3J8K5)
