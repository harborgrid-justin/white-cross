/**
 * @fileoverview Authentication & Authorization API Endpoints
 * @module constants/api/auth
 * @category API - Authentication
 * 
 * Authentication, authorization, MFA, and RBAC endpoint definitions.
 */

// ==========================================
// AUTHENTICATION & AUTHORIZATION
// ==========================================
export const AUTH_ENDPOINTS = {
  LOGIN: `/api/v1/auth/login`,
  LOGOUT: `/api/v1/auth/logout`,
  REFRESH: `/api/v1/auth/refresh`,
  VERIFY: `/api/v1/auth/verify`,
  REGISTER: `/api/v1/auth/register`,
  PROFILE: `/api/v1/auth/me`,
  CHANGE_PASSWORD: `/api/v1/auth/change-password`,
  FORGOT_PASSWORD: `/api/v1/auth/forgot-password`,
  RESET_PASSWORD: `/api/v1/auth/reset-password`,
} as const;

// ==========================================
// USERS & ACCESS CONTROL
// ==========================================
export const USERS_ENDPOINTS = {
  BASE: `/api/v1/users`,
  BY_ID: (id: string) => `/api/v1/users/${id}`,
  ME: `/api/v1/users/me`,
  PROFILE: `/api/v1/users/profile`,
  UPDATE_PROFILE: `/api/v1/users/profile`,
} as const;

export const RBAC_ENDPOINTS = {
  ROLES: `/api/v1/access-control/roles`,
  PERMISSIONS: `/api/v1/access-control/permissions`,
  USER_ROLES: (userId: string) => `/api/v1/access-control/users/${userId}/roles`,
  USER_PERMISSIONS: (userId: string) => `/api/v1/access-control/users/${userId}/permissions`,
} as const;

// ==========================================
// MULTI-FACTOR AUTHENTICATION (MFA)
// ==========================================
export const MFA_ENDPOINTS = {
  SETUP: `/api/v1/auth/mfa/setup`,
  VERIFY: `/api/v1/auth/mfa/verify`,
  ENABLE: `/api/v1/auth/mfa/enable`,
  DISABLE: `/api/v1/auth/mfa/disable`,
  BACKUP_CODES: `/api/v1/auth/mfa/backup-codes`,
  REGENERATE_CODES: `/api/v1/auth/mfa/regenerate-backup-codes`,
  VERIFY_BACKUP_CODE: `/api/v1/auth/mfa/verify-backup-code`,
  QR_CODE: `/api/v1/auth/mfa/qr-code`,
  STATUS: `/api/v1/auth/mfa/status`,
} as const;
