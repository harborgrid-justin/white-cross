# Architecture Notes - Middleware Consolidation - N4W8Q2

## References to Other Agent Work
- TypeScript architecture: `.temp/architecture-notes-M7B2K9.md`
- Frontend architecture: `.temp/architecture-notes-MS8G2V.md`

## Current Architecture

### File Structure
```
/frontend/src/
├── middleware.ts                    # ← Target location (Next.js convention)
├── middleware.backup.ts             # To be removed
├── middleware.production.ts         # To be removed (source for middleware.ts)
├── middleware/                      # Modular components (KEEP)
│   ├── auth.ts                      # Authentication logic
│   ├── rbac.ts                      # Role-based access control
│   ├── security.ts                  # Security headers and CORS
│   ├── rateLimit.ts                 # Rate limiting
│   ├── audit.ts                     # Audit logging
│   └── sanitization.ts              # Request sanitization
└── lib/security/                    # Security utilities (KEEP)
    ├── config.ts                    # Security configuration
    └── csrf.ts                      # CSRF token management
```

## Design Decisions

### 1. Modular Architecture
- **Decision**: Keep modular components in `/src/middleware/` directory
- **Rationale**: Separation of concerns, easier testing, better maintainability
- **Implementation**: Main middleware.ts orchestrates modular components

### 2. Import Paths
- **From**: `./middleware/auth` (relative from root)
- **Valid**: ✓ Works correctly when middleware.ts is at /src/ root
- **Alternative**: Could use `@/middleware/auth` but relative is clearer

### 3. Security Layers
The middleware implements defense-in-depth:
1. Security headers (all requests)
2. Preflight/CORS handling
3. Rate limiting
4. CSRF validation
5. Authentication
6. RBAC authorization
7. Audit logging
8. Request sanitization

### 4. Next.js Conventions
- **Matcher Pattern**: Excludes static files and Next.js internals
- **Edge Runtime**: Uses Edge-compatible functions only
- **Request/Response**: Proper NextRequest/NextResponse usage
- **Export**: Named export `middleware` and `config`

## Type System Strategy

### Type Safety Guarantees
1. **TokenPayload**: Strongly typed JWT payload with required fields
2. **UserRole Enum**: Prevents invalid role strings
3. **Permission Strings**: Type-safe permission format "resource:action"
4. **Route Matching**: Type-safe route-to-permission mapping

### Import Dependencies
All imports are type-safe and fully resolved:
- Next.js types: `NextRequest`, `NextResponse`
- Internal types: Imported from modular components
- Config types: Imported from lib/security

## Integration Patterns

### Middleware Orchestration
```typescript
1. Preflight → 2. Security Headers → 3. Rate Limit
         ↓
4. CSRF → 5. Auth → 6. RBAC → 7. Audit → 8. Sanitize
         ↓
   Final Response
```

### Component Communication
- Components return `NextResponse | null`
- Null means "continue to next middleware"
- Response means "short-circuit and return"

## Performance Considerations

### Algorithmic Complexity
- Route matching: O(n) where n is number of routes
- Rate limiting: O(1) map lookup
- RBAC check: O(m) where m is number of permissions
- Overall per-request: O(n + m) - acceptable for typical use

### Optimization Opportunities
1. Cache compiled regex patterns for routes
2. Use Bloom filters for public route checks
3. Implement Redis for distributed rate limiting
4. Add request response caching where appropriate

## Security Requirements

### HIPAA Compliance
- Audit logging for all PHI access
- Session timeout enforcement (15 minutes)
- Encryption in transit (HTTPS headers)
- Access control (RBAC)

### Type Safety for Security
- No `any` types in security-critical code
- Strict token validation with proper types
- Validated role enums prevent role injection
- CSP headers prevent XSS attacks

### Error Handling
- Never expose internal errors to client
- Log security events for monitoring
- Graceful degradation on non-critical failures
- Clear error messages for authentication failures
