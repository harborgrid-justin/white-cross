/**
 * @fileoverview Centralized Guards Directory
 * @module common/guards
 *
 * This directory consolidates all authentication, authorization, and security guards
 * to provide better organization and easier management.
 *
 * GUARD INVENTORY (58 total guards found):
 *
 * === AUTHENTICATION GUARDS ===
 * - JwtAuthGuard (services/auth/guards/jwt-auth.guard.ts) - Main JWT authentication
 * - GlobalAuthGuard (app.module.ts) - Global wrapper for JWT auth
 * - WsJwtAuthGuard (infrastructure/websocket/guards/ws-jwt-auth.guard.ts) - WebSocket JWT auth
 * - GqlAuthGuard (infrastructure/graphql/guards/gql-auth.guard.ts) - GraphQL JWT auth
 * - OptionalJWTGuard (services/auth/guards/authentication-guard-composites.service.ts)
 * - FlexibleAuthGuard (services/auth/guards/authentication-guard-composites.service.ts)
 *
 * === AUTHORIZATION GUARDS ===
 * - RolesGuard (services/auth/guards/roles.guard.ts) - Role-based access
 * - PermissionsGuard (services/access-control/guards/permissions.guard.ts) - Permission-based access
 * - RbacGuard (middleware/core/guards/rbac.guard.ts) - Role-based access control
 * - GqlRolesGuard (infrastructure/graphql/guards/gql-roles.guard.ts) - GraphQL roles
 *
 * === SECURITY GUARDS ===
 * - IpRestrictionGuard (services/security/guards/ip-restriction.guard.ts) - IP filtering
 * - SecurityPolicyGuard (services/security/guards/security-policy.guard.ts) - Security policies
 * - CsrfGuard (middleware/security/csrf.guard.ts) - CSRF protection
 * - ApiKeyGuard (api-key-auth/guards/api-key.guard.ts) - API key authentication
 *
 * === RATE LIMITING GUARDS ===
 * - RateLimitGuard (middleware/security/rate-limit.guard.ts) - Rate limiting
 * - HealthRecordRateLimitGuard (health-record/guards/health-record-rate-limit.guard.ts)
 * - DiscoveryRateLimitGuard (discovery/guards/discovery-rate-limit.guard.ts)
 * - WsThrottleGuard (infrastructure/websocket/guards/ws-throttle.guard.ts)
 *
 * === CONTEXT GUARDS ===
 * - ContextGuard (common/context/context.interceptor.ts) - Request context validation **PROBLEMATIC**
 *
 * === HEALTHCARE/HIPAA GUARDS ===
 * - HIPAAComplianceGuard (services/auth/guards/authentication-guard-composites.service.ts)
 * - MedicalStaffGuard (services/auth/guards/authentication-guard-composites.service.ts)
 * - PatientConsentGuard (services/auth/guards/authentication-guard-composites.service.ts)
 *
 * === MULTI-FACTOR AUTH GUARDS ===
 * - MFAGuard (services/auth/guards/authentication-guard-composites.service.ts)
 * - TOTPGuard (services/auth/guards/authentication-guard-composites.service.ts)
 * - SMSVerificationGuard (services/auth/guards/authentication-guard-composites.service.ts)
 *
 * === TENANT/MULTI-TENANCY GUARDS ===
 * - TenantIsolationGuard (services/auth/guards/authentication-guard-composites.service.ts)
 * - CrossTenantAccessGuard (services/auth/guards/authentication-guard-composites.service.ts)
 *
 * === RESOURCE/OWNERSHIP GUARDS ===
 * - ResourceOwnershipGuard (infrastructure/graphql/guards/resource-ownership.guard.ts)
 *
 * === DISCOVERY/ADMIN GUARDS ===
 * - AdminDiscoveryGuard (discovery/guards/admin-discovery.guard.ts)
 * - GCSchedulerGuard (discovery/modules/guards/gc-scheduler.guard.ts)
 * - ResourceQuotaGuard (discovery/modules/guards/resource-quota.guard.ts)
 * - MemoryThresholdGuard (discovery/modules/guards/memory-threshold.guard.ts)
 *
 * === PUBLIC ROUTE GUARDS ===
 * - PublicRouteGuard (services/auth/guards/authentication-guard-composites.service.ts)
 *
 * === SESSION GUARDS ===
 * - SessionGuard (services/auth/guards/authentication-guard-composites.service.ts)
 * - SlidingSessionGuard (services/auth/guards/authentication-guard-composites.service.ts)
 *
 * === OAUTH/EXTERNAL AUTH GUARDS ===
 * - OAuth2Guard (services/auth/guards/authentication-guard-composites.service.ts)
 * - OpenIDConnectGuard (services/auth/guards/authentication-guard-composites.service.ts)
 *
 * === NETWORK/IP GUARDS ===
 * - InternalNetworkGuard (services/auth/guards/authentication-guard-composites.service.ts)
 * - IPWhitelistGuard (services/auth/guards/authentication-guard-composites.service.ts)
 *
 * === COMPOSITE GUARDS ===
 * - CombinedGuard (services/auth/guards/authentication-guard-composites.service.ts)
 * - ConditionalGuard (services/auth/guards/authentication-guard-composites.service.ts)
 * - RolesAndPermissionsGuard (services/auth/guards/authentication-guard-composites.service.ts)
 *
 * MIGRATION PLAN:
 * 1. Move critical/problematic guards here first
 * 2. Update imports across codebase
 * 3. Gradually consolidate remaining guards
 * 4. Remove duplicate implementations
 * 5. Standardize guard patterns
 */

// === MOVED GUARDS (imported from new consolidated location) ===
// TODO: Import moved guards here as they are migrated

// === EXISTING GUARDS (still in original locations) ===
// Export existing guards for backward compatibility during migration

// Authentication Guards
export { JwtAuthGuard } from '../../services/auth/guards/jwt-auth.guard';
export { RolesGuard } from '../../services/auth/guards/roles.guard';

// Security Guards
export { IpRestrictionGuard } from '../../services/security/guards/ip-restriction.guard';
export { CsrfGuard } from '../../middleware/security/csrf.guard';

// Access Control Guards
export { PermissionsGuard } from '../../services/access-control/guards/permissions.guard';
export { RolesGuard as AccessControlRolesGuard } from '../../services/access-control/guards/roles.guard';

// Context Guards (PROBLEMATIC - temporarily disabled)
export { ContextGuard } from '../../common/context/context.interceptor';

// Rate Limiting Guards
export { RateLimitGuard } from '../../middleware/security/rate-limit.guard';
export { HealthRecordRateLimitGuard } from '../../health-record/guards/health-record-rate-limit.guard';

// WebSocket Guards
export { WsJwtAuthGuard } from '../../infrastructure/websocket/guards/ws-jwt-auth.guard';
export { WsThrottleGuard } from '../../infrastructure/websocket/guards/ws-throttle.guard';

// GraphQL Guards
export { GqlAuthGuard } from '../../infrastructure/graphql/guards/gql-auth.guard';
export { GqlRolesGuard } from '../../infrastructure/graphql/guards/gql-roles.guard';
export { ResourceOwnershipGuard } from '../../infrastructure/graphql/guards/resource-ownership.guard';

// API Key Guards
export { ApiKeyGuard } from '../../api-key-auth/guards/api-key.guard';

// Discovery Guards
export { AdminDiscoveryGuard } from '../../discovery/guards/admin-discovery.guard';
export { DiscoveryRateLimitGuard } from '../../discovery/guards/discovery-rate-limit.guard';

// RBAC Guards
export { RbacGuard } from '../../middleware/core/guards/rbac.guard';
export { PermissionsGuard as CorePermissionsGuard } from '../../middleware/core/guards/permissions.guard';
export { BaseAuthorizationGuard } from '../../middleware/core/guards/base-authorization.guard';

/**
 * Guard Management Utilities
 */
export const PROBLEMATIC_GUARDS = [
  'ContextGuard', // Causing 403 errors due to context validation
  'ThrottlerGuard', // May interfere with public routes
  'GlobalAuthGuard', // Complex dependency injection
] as const;

export const CRITICAL_GUARDS = [
  'JwtAuthGuard', // Core authentication
  'RolesGuard', // Role-based access
  'PermissionsGuard', // Permission-based access
  'IpRestrictionGuard', // Security
] as const;

export const TESTING_DISABLED_GUARDS = [
  'ContextGuard',
  'ThrottlerGuard',
  'RolesGuard',
  'PermissionsGuard',
] as const;
