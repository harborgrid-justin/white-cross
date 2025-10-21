# Middleware Directory - Enterprise Architecture

## Overview
This directory contains all HTTP middleware components organized following enterprise best practices, SOLID principles, and service-oriented architecture (SOA) patterns.

## Architecture Principles

### 1. Single Responsibility Principle
Each middleware has a single, well-defined responsibility and clear boundaries.

### 2. Service-Oriented Architecture
- **Core Services**: Authentication, authorization, logging
- **Cross-Cutting Concerns**: Security, performance, error handling
- **Domain Services**: Healthcare-specific compliance and audit

### 3. Enterprise Standards
- Standardized naming conventions
- Comprehensive error handling
- Audit logging for compliance
- Performance monitoring
- Security-first approach

## Directory Structure

```
middleware/
├── core/                    # Core middleware services
│   ├── authentication/      # Authentication middleware
│   ├── authorization/       # RBAC and permissions
│   ├── validation/         # Request/response validation
│   └── session/            # Session management
├── security/               # Security middleware
│   ├── headers/           # Security headers
│   ├── rate-limiting/     # API rate limiting
│   ├── cors/              # CORS configuration
│   └── csp/               # Content Security Policy
├── monitoring/            # Observability middleware
│   ├── performance/       # Performance tracking
│   ├── audit/            # HIPAA compliance logging
│   ├── metrics/          # Application metrics
│   └── tracing/          # Request tracing
├── error-handling/        # Error management
│   ├── handlers/         # Error handlers
│   ├── not-found/        # 404 handlers
│   └── validation/       # Validation error handling
├── adapters/             # Framework adapters
│   ├── hapi/            # Hapi.js specific middleware
│   ├── express/         # Express.js specific middleware
│   └── shared/          # Framework-agnostic middleware
└── utils/               # Middleware utilities
    ├── factories/       # Middleware factory functions
    ├── decorators/      # Middleware decorators
    └── types/          # TypeScript type definitions
```

## Middleware Categories

### Core Middleware
- **Authentication**: JWT validation, user loading, session management
- **Authorization**: Role-based access control, permission checking
- **Validation**: Request/response schema validation
- **Session**: Session state management

### Security Middleware
- **Headers**: OWASP security headers, CSP, HSTS
- **Rate Limiting**: API abuse prevention, brute force protection
- **CORS**: Cross-origin resource sharing configuration
- **CSP**: Content Security Policy management

### Monitoring Middleware
- **Performance**: Request timing, memory tracking, bottleneck detection
- **Audit**: HIPAA-compliant audit logging, PHI access tracking
- **Metrics**: Application performance metrics
- **Tracing**: Distributed request tracing

### Error Handling
- **Handlers**: Centralized error processing, HIPAA-compliant error sanitization
- **Not Found**: 404 error handling
- **Validation**: Input validation error formatting

## Naming Conventions

### Files
- Use kebab-case: `rate-limiting.middleware.ts`
- Include type suffix: `.middleware.ts`, `.handler.ts`, `.factory.ts`
- Clear, descriptive names that indicate purpose

### Classes and Functions
- Use PascalCase for classes: `AuthenticationMiddleware`
- Use camelCase for functions: `validateJwtToken`
- Use descriptive names that indicate action and domain

### Constants and Enums
- Use SCREAMING_SNAKE_CASE: `RATE_LIMIT_CONFIGS`
- Group related constants in enums or configuration objects

## Integration Patterns

### Factory Pattern
Create middleware instances with different configurations:
```typescript
const authMiddleware = createAuthenticationMiddleware({
  jwtSecret: process.env.JWT_SECRET,
  userLoader: userService.loadUser
});
```

### Decorator Pattern
Compose middleware functionality:
```typescript
@WithPerformanceMonitoring
@WithAuditLogging
@WithRateLimit('api')
class ProtectedRouteMiddleware { }
```

### Adapter Pattern
Support multiple frameworks:
```typescript
const middleware = createFrameworkAgnosticMiddleware();
const hapiMiddleware = adaptForHapi(middleware);
const expressMiddleware = adaptForExpress(middleware);
```

## Compliance and Security

### HIPAA Compliance
- All PHI access must be logged through audit middleware
- Error messages must not leak PHI information
- Security headers must protect data transmission

### OWASP Guidelines
- Implement security headers middleware
- Rate limiting to prevent abuse
- Input validation for all requests
- CSP to prevent XSS attacks

### Enterprise Standards
- Comprehensive error handling with sanitization
- Performance monitoring for SLA compliance
- Audit logging for compliance reporting
- Security-first configuration defaults

## Migration Strategy

### Phase 1: Core Reorganization
1. Move existing middleware to appropriate subdirectories
2. Standardize naming conventions
3. Add comprehensive documentation

### Phase 2: Framework Separation
1. Create framework-specific adapters
2. Extract shared business logic
3. Implement factory patterns

### Phase 3: Enhancement
1. Add missing middleware (tracing, metrics)
2. Implement decorator patterns
3. Add comprehensive testing

## Usage Examples

### Basic Authentication
```typescript
import { createAuthenticationMiddleware } from './core/authentication';

const authMiddleware = createAuthenticationMiddleware({
  strategy: 'jwt',
  config: jwtConfig
});
```

### Rate Limited Endpoint
```typescript
import { withRateLimit } from './security/rate-limiting';

const protectedEndpoint = withRateLimit('api', {
  windowMs: 60000,
  maxRequests: 100
})(baseHandler);
```

### Audit Logged Operation
```typescript
import { withAuditLogging } from './monitoring/audit';

const phiAccessHandler = withAuditLogging({
  entityType: 'HealthRecord',
  action: 'READ'
})(baseHandler);
```

## Best Practices

1. **Single Responsibility**: Each middleware should have one clear purpose
2. **Configuration**: Make middleware configurable through dependency injection
3. **Error Handling**: Always handle errors gracefully and log appropriately
4. **Performance**: Monitor middleware performance impact
5. **Security**: Security should be the default, not an afterthought
6. **Testing**: All middleware should have comprehensive unit tests
7. **Documentation**: Clear documentation for usage and configuration

## Dependencies

- Framework agnostic core logic
- Minimal external dependencies
- Clear separation of concerns
- Proper dependency injection

## Future Considerations

- GraphQL middleware support
- WebSocket middleware patterns
- Microservice communication middleware
- Event-driven middleware patterns
