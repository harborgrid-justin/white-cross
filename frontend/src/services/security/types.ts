/**
 * Security Service Types
 *
 * Centralized type definitions for security functionality
 */

export interface CSPDirectives {
  'default-src': string[];
  'script-src': string[];
  'style-src': string[];
  'img-src': string[];
  'font-src': string[];
  'connect-src': string[];
  'frame-ancestors': string[];
  'base-uri': string[];
  'form-action': string[];
  'object-src': string[];
  'upgrade-insecure-requests': string[];
}

export interface SecurityHeaders {
  'X-Frame-Options': string;
  'X-XSS-Protection': string;
  'X-Content-Type-Options': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
  'Strict-Transport-Security': string;
  'Content-Security-Policy': string;
}

export interface CORSConfig {
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  credentials: boolean;
  maxAge: number;
}

export interface RateLimitConfig {
  general: { windowMs: number; max: number };
  auth: { windowMs: number; max: number };
  phi: { windowMs: number; max: number };
}

export interface SessionConfig {
  idleTimeout: number;
  warningTime: number;
  maxDuration: number;
  refreshInterval: number;
  activityCheckInterval: number;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  specialChars: string;
  maxLength: number;
  preventCommonPasswords: boolean;
  preventUserInfo: boolean;
}

export interface AuditConfig {
  enabled: boolean;
  retentionDays: number;
  batchSize: number;
  batchInterval: number;
  localStorageLimit: number;
  logPHIAccess: boolean;
  logAuth: boolean;
  logAuthz: boolean;
  logSystem: boolean;
}

export interface UploadConfig {
  maxFileSize: number;
  allowedTypes: string[];
  virusScanEnabled: boolean;
  encryptAtRest: boolean;
}

export interface PHIPatterns {
  ssn: RegExp;
  mrn: RegExp;
  dob: RegExp;
  phone: RegExp;
  email: RegExp;
}

export interface SanitizationOptions {
  allowHTML?: boolean;
  maxLength?: number;
  allowedChars?: RegExp;
}

export interface EncryptionOptions {
  algorithm?: 'AES-GCM' | 'AES-CBC';
  keyLength?: number;
  ivLength?: number;
}

export interface SecurityConfig {
  csrf?: {
    enabled?: boolean;
    tokenLength?: number;
    refreshInterval?: number;
  };
  tokens?: {
    accessTokenExpiry?: number;
    refreshTokenExpiry?: number;
    encryptionEnabled?: boolean;
  };
  sanitization?: {
    enabled?: boolean;
    strictMode?: boolean;
  };
  encryption?: {
    defaultAlgorithm?: string;
    keyRotationDays?: number;
  };
  phi?: {
    detectionEnabled?: boolean;
    redactionEnabled?: boolean;
    auditEnabled?: boolean;
  };
}