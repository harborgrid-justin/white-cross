/**
 * Healthcare Middleware System - Type Definitions
 * Framework-agnostic middleware interfaces and types for healthcare applications
 *
 * @fileoverview Core type definitions for healthcare middleware system with HIPAA compliance
 * @version 1.0.0
 * @author Healthcare Platform Team
 */

import { Request, Response } from 'express';

/**
 * Framework-agnostic request interface
 */
export interface IRequest {
  readonly method: string;
  readonly url: string;
  readonly path: string;
  readonly headers: Record<string, string | string[]>;
  readonly query: Record<string, any>;
  readonly params: Record<string, any>;
  readonly body: any;
  readonly ip: string;
  readonly userAgent?: string;
  readonly correlationId?: string;
  readonly sessionId?: string;
  readonly user?: any;
  readonly metadata: Record<string, any>;

  getHeader(name: string): string | string[] | undefined;
  setMetadata(key: string, value: any): void;
  getMetadata<T = any>(key: string): T | undefined;
  getRawRequest(): any;
}

/**
 * Framework-agnostic response interface
 */
export interface IResponse {
  statusCode: number;
  readonly headers: Record<string, string | string[]>;
  readonly headersSent: boolean;

  setStatus(code: number): this;
  setHeader(name: string, value: string | string[]): this;
  getHeader(name: string): string | string[] | undefined;
  removeHeader(name: string): this;
  json(data: any): void;
  send(data: any): void;
  end(data?: any): void;
  redirect(statusCode: number, url: string): void;
  redirect(url: string): void;
  getRawResponse(): any;
}

/**
 * Framework-agnostic next function interface
 */
export interface INextFunction {
  call(error?: Error): void;
  getRawNext(): any;
}

/**
 * Middleware execution context
 */
export interface MiddlewareContext {
  startTime: number;
  correlationId: string;
  framework: 'express' | 'hapi' | 'fastify' | 'koa';
  environment: string;
  metadata: Record<string, any>;
}

/**
 * Base middleware interface
 */
export interface IMiddleware {
  name: string;
  version: string;
  execute(
    request: IRequest,
    response: IResponse,
    next: INextFunction,
    context: MiddlewareContext
  ): Promise<void> | void;
}

/**
 * Healthcare-specific user context
 */
export interface HealthcareUser {
  userId: string;
  email: string;
  role: UserRole;
  permissions?: Permission[];
  facilityId?: string;
  npiNumber?: string;
  licenseNumber?: string;
  department?: string;
}

/**
 * Healthcare user roles
 */
export enum UserRole {
  STUDENT = 'student',
  SCHOOL_NURSE = 'school_nurse',
  ADMINISTRATOR = 'administrator',
  SYSTEM_ADMIN = 'system_admin'
}

/**
 * Healthcare permissions
 */
export enum Permission {
  // Student permissions
  VIEW_OWN_HEALTH_RECORDS = 'view_own_health_records',
  UPDATE_OWN_EMERGENCY_CONTACTS = 'update_own_emergency_contacts',

  // School Nurse permissions
  VIEW_STUDENT_HEALTH_RECORDS = 'view_student_health_records',
  CREATE_HEALTH_RECORDS = 'create_health_records',
  UPDATE_HEALTH_RECORDS = 'update_health_records',
  ADMINISTER_MEDICATION = 'administer_medication',
  VIEW_IMMUNIZATION_RECORDS = 'view_immunization_records',
  CREATE_INCIDENT_REPORTS = 'create_incident_reports',

  // Administrator permissions
  MANAGE_USERS = 'manage_users',
  VIEW_REPORTS = 'view_reports',
  EXPORT_DATA = 'export_data',
  MANAGE_FACILITY_SETTINGS = 'manage_facility_settings',

  // System Admin permissions
  SYSTEM_ADMINISTRATION = 'system_administration',
  AUDIT_LOGS = 'audit_logs',
  EMERGENCY_ACCESS = 'emergency_access',
  BREAK_GLASS_ACCESS = 'break_glass_access'
}

/**
 * Healthcare context for requests
 */
export interface HealthcareContext {
  patientId?: string;
  facilityId?: string;
  providerId?: string;
  accessType: 'routine' | 'emergency' | 'break_glass';
  auditRequired: boolean;
  phiAccess: boolean;
  complianceFlags: string[];
}

/**
 * Extended Express request with healthcare context
 */
export interface HealthcareRequest extends Request {
  user?: HealthcareUser;
  healthcareContext: HealthcareContext;
  correlationId?: string;
}

/**
 * Extended Express response with healthcare methods
 */
export interface HealthcareResponse extends Response {
  sendHipaaCompliant(data: any, options?: {
    logAccess?: boolean;
    patientId?: string;
    dataType?: string;
  }): Response;
  sanitizeResponse(data: any): any;
}

/**
 * Authentication configuration
 */
export interface AuthenticationConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  issuer: string;
  audience: string;
  algorithms: string[];
  clockTolerance: number;
  ignoreExpiration: boolean;
  maxAge: string;
  requireHTTPS: boolean;
  secureCookie: boolean;
}

/**
 * Session configuration
 */
export interface SessionConfig {
  secret: string;
  name: string;
  maxAge: number;
  secure: boolean;
  httpOnly: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  store?: 'memory' | 'redis';
  redis?: {
    host: string;
    port: number;
    password?: string;
    db: number;
  };
  concurrentSessions: number;
  timeoutWarningMinutes: number;
}

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  standardHeaders: boolean;
  legacyHeaders: boolean;
  store?: 'memory' | 'redis';
  keyGenerator?: (request: IRequest) => string;
  skip?: (request: IRequest) => boolean;
  onLimitReached?: (request: IRequest, response: IResponse) => void;
}

/**
 * Security headers configuration
 */
export interface SecurityHeadersConfig {
  contentTypeOptions: boolean;
  frameOptions: 'DENY' | 'SAMEORIGIN' | 'ALLOW-FROM';
  xssProtection: boolean;
  hsts: {
    maxAge: number;
    includeSubDomains: boolean;
    preload: boolean;
  };
  referrerPolicy: string;
  permissionsPolicy: Record<string, string[]>;
  csp: {
    directives: Record<string, string[]>;
    reportOnly: boolean;
  };
}

/**
 * Validation configuration
 */
export interface ValidationConfig {
  enablePhiDetection: boolean;
  enableSqlInjectionProtection: boolean;
  enableXssProtection: boolean;
  maxRequestSize: string;
  allowedFileTypes: string[];
  customValidators: Record<string, (value: any) => boolean>;
}

/**
 * Audit configuration
 */
export interface AuditConfig {
  enabled: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  retentionDays: number;
  includeRequestBody: boolean;
  includeResponseBody: boolean;
  excludeRoutes: string[];
  hipaaCompliant: boolean;
  storage: 'file' | 'database' | 'elasticsearch';
  batchSize: number;
  flushInterval: number;
}

/**
 * Performance monitoring configuration
 */
export interface PerformanceConfig {
  enabled: boolean;
  slowQueryThreshold: number;
  memoryThreshold: number;
  cpuThreshold: number;
  responseTimeThreshold: number;
  enableTracing: boolean;
  sampleRate: number;
  excludeRoutes: string[];
}

/**
 * Error handling configuration
 */
export interface ErrorHandlingConfig {
  logErrors: boolean;
  includeStackTrace: boolean;
  hipaaCompliant: boolean;
  customErrorMessages: Record<string, string>;
  notifyOnCriticalErrors: boolean;
  errorReportingService?: 'sentry' | 'rollbar' | 'custom';
}

/**
 * Middleware factory function type
 */
export type MiddlewareFactory<T = any> = (config: T) => IMiddleware;

/**
 * Framework adapter interface
 */
export interface IFrameworkAdapter {
  adapt(middleware: IMiddleware): any;
  createHealthcareMiddleware(factory: MiddlewareFactory, config: any): any;
  chain(...middlewares: IMiddleware[]): any[];
}

/**
 * Logger interface for middleware
 */
export interface IMiddlewareLogger {
  error(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  info(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
  audit(event: AuditEvent): void;
}

/**
 * Audit event structure
 */
export interface AuditEvent {
  timestamp: string;
  correlationId: string;
  userId?: string;
  userRole?: string;
  facilityId?: string;
  action: string;
  resource: string;
  outcome: 'success' | 'failure';
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  phiAccessed: boolean;
  complianceFlags: string[];
}

/**
 * Cache interface for middleware
 */
export interface IMiddlewareCache {
  get<T = any>(key: string): Promise<T | null>;
  set(key: string, value: any, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  exists(key: string): Promise<boolean>;
}

/**
 * Metrics interface for middleware
 */
export interface IMiddlewareMetrics {
  increment(metric: string, tags?: Record<string, string>): void;
  gauge(metric: string, value: number, tags?: Record<string, string>): void;
  histogram(metric: string, value: number, tags?: Record<string, string>): void;
  timing(metric: string, duration: number, tags?: Record<string, string>): void;
}

/**
 * Health check interface
 */
export interface IHealthCheck {
  name: string;
  check(): Promise<HealthCheckResult>;
}

/**
 * Health check result
 */
export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  duration: number;
  details?: Record<string, any>;
  error?: string;
}

/**
 * Middleware registry interface
 */
export interface IMiddlewareRegistry {
  register(name: string, middleware: IMiddleware): void;
  get(name: string): IMiddleware | undefined;
  has(name: string): boolean;
  list(): string[];
  remove(name: string): boolean;
}

// Export all types and interfaces for use in other modules
// Note: Interfaces and types cannot be exported as values in default export
