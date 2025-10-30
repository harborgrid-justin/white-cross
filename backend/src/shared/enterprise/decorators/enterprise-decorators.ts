import { SetMetadata } from '@nestjs/common';
import { EnterpriseCacheConfig } from '../services/enterprise-cache.service';

/**
 * Shared Enterprise Decorators
 * Reusable across all modules for consistent configuration
 */

// Rate Limiting
export interface EnterpriseRateLimitConfig {
  limit: number;
  windowMs: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  blockDuration?: number; // How long to block after limit exceeded
  skipIf?: (req: any) => boolean;
}

export const ENTERPRISE_RATE_LIMIT_KEY = 'enterprise-rate-limit';
export const EnterpriseRateLimit = (config: EnterpriseRateLimitConfig) => 
  SetMetadata(ENTERPRISE_RATE_LIMIT_KEY, config);

// Security Decorators
export const ENTERPRISE_SECURITY_LEVEL_KEY = 'enterprise-security-level';
export type SecurityLevel = 'public' | 'internal' | 'restricted' | 'confidential';

export const SecurityLevel = (level: SecurityLevel) => 
  SetMetadata(ENTERPRISE_SECURITY_LEVEL_KEY, level);

export const PublicAccess = () => SecurityLevel('public');
export const InternalAccess = () => SecurityLevel('internal');
export const RestrictedAccess = () => SecurityLevel('restricted');
export const ConfidentialAccess = () => SecurityLevel('confidential');

// HIPAA Compliance
export const ENTERPRISE_HIPAA_KEY = 'enterprise-hipaa';
export interface HipaaConfig {
  requiresAudit: boolean;
  phiData: boolean;
  encryptionRequired: boolean;
  accessLevel: SecurityLevel;
  retentionPeriod?: number; // In days
}

export const HipaaCompliant = (config: HipaaConfig) => 
  SetMetadata(ENTERPRISE_HIPAA_KEY, config);

export const PHIData = (encryptionRequired: boolean = true) => 
  HipaaCompliant({
    requiresAudit: true,
    phiData: true,
    encryptionRequired,
    accessLevel: 'confidential',
    retentionPeriod: 2555, // 7 years in days
  });

// Cache Configuration
export const ENTERPRISE_CACHE_KEY = 'enterprise-cache';
export const EnterpriseCache = (config: EnterpriseCacheConfig) => 
  SetMetadata(ENTERPRISE_CACHE_KEY, config);

// Predefined cache configurations
export const CachePublic = (ttl: number = 300) => EnterpriseCache({
  enabled: true,
  ttl,
  includeQuery: true,
  compliance: { hipaaCompliant: false, encryptKeys: false },
});

export const CacheInternal = (ttl: number = 600) => EnterpriseCache({
  enabled: true,
  ttl,
  includeQuery: true,
  includeUser: true,
  compliance: { hipaaCompliant: false, encryptKeys: true },
});

export const CacheRestricted = (ttl: number = 300) => EnterpriseCache({
  enabled: true,
  ttl,
  includeQuery: true,
  includeUser: true,
  includeParams: true,
  compliance: { hipaaCompliant: true, encryptKeys: true, maxRetentionTime: ttl },
});

export const CacheConfidential = (ttl: number = 60) => EnterpriseCache({
  enabled: true,
  ttl,
  includeQuery: true,
  includeUser: true,
  includeParams: true,
  compliance: { 
    hipaaCompliant: true, 
    encryptKeys: true, 
    maxRetentionTime: Math.min(ttl, 300) // Max 5 minutes for confidential data
  },
});

// Metrics Configuration
export const ENTERPRISE_METRICS_KEY = 'enterprise-metrics';
export interface MetricsConfig {
  enabled: boolean;
  trackPerformance: boolean;
  trackSecurity: boolean;
  trackCompliance: boolean;
  sampleRate?: number; // 0-1, for performance sampling
}

export const EnterpriseMetrics = (config: MetricsConfig) => 
  SetMetadata(ENTERPRISE_METRICS_KEY, config);

export const BasicMetrics = () => EnterpriseMetrics({
  enabled: true,
  trackPerformance: true,
  trackSecurity: false,
  trackCompliance: false,
  sampleRate: 1.0,
});

export const SecurityMetrics = () => EnterpriseMetrics({
  enabled: true,
  trackPerformance: true,
  trackSecurity: true,
  trackCompliance: false,
  sampleRate: 1.0,
});

export const ComplianceMetrics = () => EnterpriseMetrics({
  enabled: true,
  trackPerformance: true,
  trackSecurity: true,
  trackCompliance: true,
  sampleRate: 1.0,
});

// Audit Logging
export const ENTERPRISE_AUDIT_KEY = 'enterprise-audit';
export interface AuditConfig {
  enabled: boolean;
  logRequest: boolean;
  logResponse: boolean;
  logHeaders: boolean;
  logBody: boolean;
  sensitiveFields?: string[]; // Fields to mask in logs
  retentionDays?: number;
}

export const EnterpriseAudit = (config: AuditConfig) => 
  SetMetadata(ENTERPRISE_AUDIT_KEY, config);

export const BasicAudit = () => EnterpriseAudit({
  enabled: true,
  logRequest: true,
  logResponse: false,
  logHeaders: false,
  logBody: false,
});

export const SecurityAudit = () => EnterpriseAudit({
  enabled: true,
  logRequest: true,
  logResponse: true,
  logHeaders: true,
  logBody: false,
  retentionDays: 90,
});

export const ComplianceAudit = () => EnterpriseAudit({
  enabled: true,
  logRequest: true,
  logResponse: true,
  logHeaders: true,
  logBody: true,
  sensitiveFields: ['password', 'ssn', 'creditCard', 'medicalRecord'],
  retentionDays: 2555, // 7 years
});

// Performance Monitoring
export const ENTERPRISE_PERFORMANCE_KEY = 'enterprise-performance';
export interface PerformanceConfig {
  enabled: boolean;
  trackResponseTime: boolean;
  trackMemoryUsage: boolean;
  trackDatabaseQueries: boolean;
  slowQueryThreshold?: number; // milliseconds
  alertThreshold?: number; // milliseconds
}

export const EnterprisePerformance = (config: PerformanceConfig) => 
  SetMetadata(ENTERPRISE_PERFORMANCE_KEY, config);

export const BasicPerformance = () => EnterprisePerformance({
  enabled: true,
  trackResponseTime: true,
  trackMemoryUsage: false,
  trackDatabaseQueries: false,
});

export const DetailedPerformance = () => EnterprisePerformance({
  enabled: true,
  trackResponseTime: true,
  trackMemoryUsage: true,
  trackDatabaseQueries: true,
  slowQueryThreshold: 1000,
  alertThreshold: 5000,
});

// Convenience Decorators for Common Patterns
export const HealthRecordEndpoint = () => [
  PHIData(true),
  ComplianceMetrics(),
  ComplianceAudit(),
  CacheConfidential(60),
  EnterpriseRateLimit({ limit: 100, windowMs: 60000 }),
];

export const AuthEndpoint = () => [
  SecurityLevel('restricted'),
  SecurityMetrics(),
  SecurityAudit(),
  EnterpriseRateLimit({ limit: 10, windowMs: 60000, blockDuration: 300000 }),
  DetailedPerformance(),
];

export const AnalyticsEndpoint = () => [
  SecurityLevel('internal'),
  BasicMetrics(),
  BasicAudit(),
  CacheInternal(300),
  EnterpriseRateLimit({ limit: 50, windowMs: 60000 }),
  BasicPerformance(),
];

export const PublicEndpoint = () => [
  PublicAccess(),
  BasicMetrics(),
  CachePublic(600),
  EnterpriseRateLimit({ limit: 200, windowMs: 60000 }),
];
