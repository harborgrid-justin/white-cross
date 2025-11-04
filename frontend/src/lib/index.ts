/**
 * Library exports - Centralized export for all lib utilities
 *
 * @module lib
 * @category Core
 */

// API Client
export { apiClient, default as defaultApiClient, API_ENDPOINTS } from './api-client';

// Authentication
export {
  extractToken,
  verifyAccessToken,
  verifyRefreshToken,
  authenticateRequest,
  hasRole,
  hasMinimumRole,
  auth,
  type TokenPayload,
  type AuthenticatedUser,
} from './auth';

// Session Management
export {
  getServerSession,
  requireSession,
  getSessionUserId,
  getServerAuth,
  getServerAuthOptional,
  requireRole,
  requireMinimumRole,
  hasRole as hasRoleSession,
  hasMinimumRole as hasMinimumRoleSession,
  createSession,
  createSessionWithRefresh,
  destroySession,
  refreshSession,
  hasSession,
  getSessionExpiration,
  validateSessionOrRedirect,
  type SessionUser,
  type Session,
  type SessionOptions,
} from './session';

// Permissions
export {
  checkPermission,
  checkFormAccess,
  requirePermission,
  requireFormAccess,
  getPermissions,
  clearPermissionCache,
  clearAllPermissionCaches,
  checkMultiplePermissions,
  checkAnyPermission,
  checkPermissionDetailed,
  hasPermission,
  checkResourceOwnership,
  getAccessibleResources,
  requirePermissionForSession,
  FORM_PERMISSIONS,
  type PermissionAction,
  type ResourceType,
  type Permission,
  type AccessResult,
} from './permissions';

// PHI Detection
export {
  isPHIField,
  containsPHI,
  detectPHI,
  getPHIFields,
  classifyDataSensitivity,
  filterPHI,
  validatePHICompliance,
  PHI_FIELD_NAMES,
  type PHIDetectionResult,
  type PHIPatternType,
  type PHIPattern,
  type SensitivityLevel,
  type PHIFieldDetail,
  type PHIComplianceCheck,
} from './phi';

// Error Handling
export { ErrorHandler } from './errorHandler';
export type { ErrorHandlerContext } from './errorHandler';

// Audit Logging
export {
  auditLog,
  logPHIAccess,
  auditLogWithContext,
  createAuditContext,
  createAuditContextFromServer,
  extractIPAddress,
  extractUserAgent,
  getClientIP,
  getUserAgent,
  parseUserAgent,
  PHI_ACTIONS,
  AUDIT_ACTIONS,
  type AuditLogEntry,
} from './audit';

// Admin Utilities
export {
  logAdminAction,
  convertToCSV,
  downloadCSV,
  downloadJSON,
  exportData,
  executeBulkOperation,
  hasRole as hasRoleAdmin,
  isAdmin,
  sanitizePHIData,
  maskSensitiveString,
  formatDate,
  formatDateTime,
  debounce,
  type AuditLogEntry as AdminAuditLogEntry,
  type ExportFormat,
  type ExportOptions,
  type BulkOperationResult,
} from './admin-utils';

// API Proxy
export {
  proxyToBackend,
  createProxyHandler,
  type ProxyConfig,
} from './apiProxy';

// Rate Limiting
export {
  checkRateLimit,
  cleanupRateLimits,
  RATE_LIMITS,
  type RateLimitConfig,
} from './rateLimit';

// Utilities
export { cn } from './utils';
