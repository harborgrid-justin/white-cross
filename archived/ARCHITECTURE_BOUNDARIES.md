/**
 * Architectural Boundaries - Frontend Code Organization
 *
 * This document defines the clear separation between lib/ and services/
 * to eliminate overlaps and establish maintainable boundaries.
 *
 * @version 1.0.0
 * @updated 2025-11-12
 */

# Frontend Architecture Boundaries

## Directory Structure

### `frontend/src/lib/` - Framework & Infrastructure Layer
**Purpose**: Framework-specific utilities, Next.js integrations, and low-level infrastructure

**Contains**:
- Framework integrations (Next.js v16 features, React utilities)
- Low-level utilities (cn, date formatting, validation)
- Infrastructure components (error handling, logging infrastructure)
- UI utilities (className manipulation, form helpers)
- Authentication infrastructure (token management, session handling)
- Security infrastructure (encryption, sanitization)
- API client infrastructure (HTTP client, request/response handling)

**Examples**:
- `api-client.ts` - Next.js v16 enhanced HTTP client
- `utils.ts` - Tailwind CSS utilities (cn function)
- `errorHandler.ts` - Framework-level error handling
- `auth/` - Authentication infrastructure
- `security/` - Low-level security utilities
- `cache/config.ts` - Next.js v16 cache strategies

### `frontend/src/services/` - Business Logic Layer
**Purpose**: Domain-specific business logic, API services, and enterprise features

**Contains**:
- Domain API services (students, medications, health records)
- Business logic services (audit, monitoring, offline management)
- Enterprise features (caching, security policies, monitoring)
- Service orchestration (ServiceManager, service registry)
- Data transformation and validation
- Integration services (external APIs, messaging)

**Examples**:
- `modules/` - Domain-specific API services
- `audit/AuditService.ts` - Business-level audit logging
- `cache/CacheManager.ts` - Enterprise caching with persistence
- `monitoring/Logger.ts` - Structured business logging
- `offline/OfflineQueueManager.ts` - Enterprise offline management
- `security/CsrfProtection.ts` - Enterprise security policies

## Consolidation Strategy

### Phase 1: Critical Infrastructure (Security, Monitoring, Caching)
1. **Security**: Consolidate into `services/security/` (enterprise-grade)
2. **Monitoring**: Consolidate into `services/monitoring/` (comprehensive logging)
3. **Caching**: Consolidate into `services/cache/` (business-level caching)

### Phase 2: Communication & Data Management
4. **Offline**: Consolidate into `services/offline/` (enterprise queue management)
5. **Socket**: Consolidate into `services/socket/` (connection management)
6. **Documents**: Consolidate into `services/documents/` (upload management)

### Phase 3: Business Logic
7. **Messaging**: Consolidate into `services/messaging/` (API clients)
8. **Audit**: Consolidate into `services/audit/` (business audit)

### Phase 4: Cleanup & Optimization
9. **Utils**: Consolidate utility functions appropriately
10. **API**: Maintain clear separation between infrastructure and business APIs

## Migration Rules

### What Stays in `lib/`
- Framework-specific code (Next.js v16 features)
- Low-level utilities used across the application
- Infrastructure components
- UI-related utilities

### What Moves to `services/`
- Business logic and domain services
- Enterprise features and policies
- API service orchestration
- Data transformation and validation

### Backward Compatibility
- Maintain barrel exports in `lib/` for existing imports
- Use re-exports to maintain compatibility during migration
- Update imports gradually to avoid breaking changes

## Implementation Priority

1. **High Priority**: Security, monitoring, caching (critical infrastructure)
2. **Medium Priority**: Offline, socket, documents (data management)
3. **Low Priority**: Messaging, audit, utils (business logic cleanup)

This boundary definition ensures maintainable, scalable architecture with clear separation of concerns.</content>
<parameter name="filePath">/workspaces/white-cross/frontend/src/ARCHITECTURE_BOUNDARIES.md