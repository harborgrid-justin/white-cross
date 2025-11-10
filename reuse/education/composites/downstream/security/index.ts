/**
 * Security Module Exports
 * Centralized exports for all security components
 */

// Authentication
export { JwtAuthenticationService } from './auth/jwt-authentication.service';
export type { User, LoginResponse } from './auth/jwt-authentication.service';

// Strategies
export { JwtStrategy } from './strategies/jwt.strategy';
export { LocalStrategy } from './strategies/local.strategy';
export type { JwtPayload } from './strategies/jwt.strategy';

// Guards
export { JwtAuthGuard } from './guards/jwt-auth.guard';
export { RolesGuard } from './guards/roles.guard';
export { PermissionsGuard } from './guards/permissions.guard';
export { ApiKeyGuard } from './guards/api-key.guard';

// Decorators
export { Roles } from './decorators/roles.decorator';
export { RequirePermissions } from './decorators/permissions.decorator';
export { Public } from './decorators/public.decorator';
export { RequireApiKey } from './decorators/api-key.decorator';

// Services
export { EncryptionService } from './services/encryption.service';
export { AuditService } from './services/audit.service';
export type { AuditLogEntry, SecurityEvent } from './services/audit.service';

// Interceptors
export { AuditInterceptor } from './interceptors/audit.interceptor';

// Configuration
export { SecurityConfig } from './config/security.config';
