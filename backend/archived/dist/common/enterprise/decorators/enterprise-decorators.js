"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicEndpoint = exports.AnalyticsEndpoint = exports.AuthEndpoint = exports.HealthRecordEndpoint = exports.DetailedPerformance = exports.BasicPerformance = exports.EnterprisePerformance = exports.ENTERPRISE_PERFORMANCE_KEY = exports.ComplianceAudit = exports.SecurityAudit = exports.BasicAudit = exports.EnterpriseAudit = exports.ENTERPRISE_AUDIT_KEY = exports.ComplianceMetricsDecorator = exports.SecurityMetricsDecorator = exports.BasicMetrics = exports.EnterpriseMetrics = exports.ENTERPRISE_METRICS_KEY = exports.CacheConfidential = exports.CacheRestricted = exports.CacheInternal = exports.CachePublic = exports.EnterpriseCache = exports.ENTERPRISE_CACHE_KEY = exports.PHIData = exports.HipaaCompliant = exports.ENTERPRISE_HIPAA_KEY = exports.ConfidentialAccess = exports.RestrictedAccess = exports.InternalAccess = exports.PublicAccess = exports.SecurityLevel = exports.ENTERPRISE_SECURITY_LEVEL_KEY = exports.EnterpriseRateLimit = exports.ENTERPRISE_RATE_LIMIT_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.ENTERPRISE_RATE_LIMIT_KEY = 'enterprise-rate-limit';
const EnterpriseRateLimit = (config) => (0, common_1.SetMetadata)(exports.ENTERPRISE_RATE_LIMIT_KEY, config);
exports.EnterpriseRateLimit = EnterpriseRateLimit;
exports.ENTERPRISE_SECURITY_LEVEL_KEY = 'enterprise-security-level';
const SecurityLevel = (level) => (0, common_1.SetMetadata)(exports.ENTERPRISE_SECURITY_LEVEL_KEY, level);
exports.SecurityLevel = SecurityLevel;
const PublicAccess = () => (0, exports.SecurityLevel)('public');
exports.PublicAccess = PublicAccess;
const InternalAccess = () => (0, exports.SecurityLevel)('internal');
exports.InternalAccess = InternalAccess;
const RestrictedAccess = () => (0, exports.SecurityLevel)('restricted');
exports.RestrictedAccess = RestrictedAccess;
const ConfidentialAccess = () => (0, exports.SecurityLevel)('confidential');
exports.ConfidentialAccess = ConfidentialAccess;
exports.ENTERPRISE_HIPAA_KEY = 'enterprise-hipaa';
const HipaaCompliant = (config) => (0, common_1.SetMetadata)(exports.ENTERPRISE_HIPAA_KEY, config);
exports.HipaaCompliant = HipaaCompliant;
const PHIData = (encryptionRequired = true) => (0, exports.HipaaCompliant)({
    requiresAudit: true,
    phiData: true,
    encryptionRequired,
    accessLevel: 'confidential',
    retentionPeriod: 2555,
});
exports.PHIData = PHIData;
exports.ENTERPRISE_CACHE_KEY = 'enterprise-cache';
const EnterpriseCache = (config) => (0, common_1.SetMetadata)(exports.ENTERPRISE_CACHE_KEY, config);
exports.EnterpriseCache = EnterpriseCache;
const CachePublic = (ttl = 300) => (0, exports.EnterpriseCache)({
    enabled: true,
    ttl,
    includeQuery: true,
    compliance: { hipaaCompliant: false, encryptKeys: false },
});
exports.CachePublic = CachePublic;
const CacheInternal = (ttl = 600) => (0, exports.EnterpriseCache)({
    enabled: true,
    ttl,
    includeQuery: true,
    includeUser: true,
    compliance: { hipaaCompliant: false, encryptKeys: true },
});
exports.CacheInternal = CacheInternal;
const CacheRestricted = (ttl = 300) => (0, exports.EnterpriseCache)({
    enabled: true,
    ttl,
    includeQuery: true,
    includeUser: true,
    includeParams: true,
    compliance: {
        hipaaCompliant: true,
        encryptKeys: true,
        maxRetentionTime: ttl,
    },
});
exports.CacheRestricted = CacheRestricted;
const CacheConfidential = (ttl = 60) => (0, exports.EnterpriseCache)({
    enabled: true,
    ttl,
    includeQuery: true,
    includeUser: true,
    includeParams: true,
    compliance: {
        hipaaCompliant: true,
        encryptKeys: true,
        maxRetentionTime: Math.min(ttl, 300),
    },
});
exports.CacheConfidential = CacheConfidential;
exports.ENTERPRISE_METRICS_KEY = 'enterprise-metrics';
const EnterpriseMetrics = (config) => (0, common_1.SetMetadata)(exports.ENTERPRISE_METRICS_KEY, config);
exports.EnterpriseMetrics = EnterpriseMetrics;
const BasicMetrics = () => (0, exports.EnterpriseMetrics)({
    enabled: true,
    trackPerformance: true,
    trackSecurity: false,
    trackCompliance: false,
    sampleRate: 1.0,
});
exports.BasicMetrics = BasicMetrics;
const SecurityMetricsDecorator = () => (0, exports.EnterpriseMetrics)({
    enabled: true,
    trackPerformance: true,
    trackSecurity: true,
    trackCompliance: false,
    sampleRate: 1.0,
});
exports.SecurityMetricsDecorator = SecurityMetricsDecorator;
const ComplianceMetricsDecorator = () => (0, exports.EnterpriseMetrics)({
    enabled: true,
    trackPerformance: true,
    trackSecurity: true,
    trackCompliance: true,
    sampleRate: 1.0,
});
exports.ComplianceMetricsDecorator = ComplianceMetricsDecorator;
exports.ENTERPRISE_AUDIT_KEY = 'enterprise-audit';
const EnterpriseAudit = (config) => (0, common_1.SetMetadata)(exports.ENTERPRISE_AUDIT_KEY, config);
exports.EnterpriseAudit = EnterpriseAudit;
const BasicAudit = () => (0, exports.EnterpriseAudit)({
    enabled: true,
    logRequest: true,
    logResponse: false,
    logHeaders: false,
    logBody: false,
});
exports.BasicAudit = BasicAudit;
const SecurityAudit = () => (0, exports.EnterpriseAudit)({
    enabled: true,
    logRequest: true,
    logResponse: true,
    logHeaders: true,
    logBody: false,
    retentionDays: 90,
});
exports.SecurityAudit = SecurityAudit;
const ComplianceAudit = () => (0, exports.EnterpriseAudit)({
    enabled: true,
    logRequest: true,
    logResponse: true,
    logHeaders: true,
    logBody: true,
    sensitiveFields: ['password', 'ssn', 'creditCard', 'medicalRecord'],
    retentionDays: 2555,
});
exports.ComplianceAudit = ComplianceAudit;
exports.ENTERPRISE_PERFORMANCE_KEY = 'enterprise-performance';
const EnterprisePerformance = (config) => (0, common_1.SetMetadata)(exports.ENTERPRISE_PERFORMANCE_KEY, config);
exports.EnterprisePerformance = EnterprisePerformance;
const BasicPerformance = () => (0, exports.EnterprisePerformance)({
    enabled: true,
    trackResponseTime: true,
    trackMemoryUsage: false,
    trackDatabaseQueries: false,
});
exports.BasicPerformance = BasicPerformance;
const DetailedPerformance = () => (0, exports.EnterprisePerformance)({
    enabled: true,
    trackResponseTime: true,
    trackMemoryUsage: true,
    trackDatabaseQueries: true,
    slowQueryThreshold: 1000,
    alertThreshold: 5000,
});
exports.DetailedPerformance = DetailedPerformance;
const HealthRecordEndpoint = () => [
    (0, exports.PHIData)(true),
    (0, exports.ComplianceMetricsDecorator)(),
    (0, exports.ComplianceAudit)(),
    (0, exports.CacheConfidential)(60),
    (0, exports.EnterpriseRateLimit)({ limit: 100, windowMs: 60000 }),
];
exports.HealthRecordEndpoint = HealthRecordEndpoint;
const AuthEndpoint = () => [
    (0, exports.SecurityLevel)('restricted'),
    (0, exports.SecurityMetricsDecorator)(),
    (0, exports.SecurityAudit)(),
    (0, exports.EnterpriseRateLimit)({ limit: 10, windowMs: 60000, blockDuration: 300000 }),
    (0, exports.DetailedPerformance)(),
];
exports.AuthEndpoint = AuthEndpoint;
const AnalyticsEndpoint = () => [
    (0, exports.SecurityLevel)('internal'),
    (0, exports.BasicMetrics)(),
    (0, exports.BasicAudit)(),
    (0, exports.CacheInternal)(300),
    (0, exports.EnterpriseRateLimit)({ limit: 50, windowMs: 60000 }),
    (0, exports.BasicPerformance)(),
];
exports.AnalyticsEndpoint = AnalyticsEndpoint;
const PublicEndpoint = () => [
    (0, exports.PublicAccess)(),
    (0, exports.BasicMetrics)(),
    (0, exports.CachePublic)(600),
    (0, exports.EnterpriseRateLimit)({ limit: 200, windowMs: 60000 }),
];
exports.PublicEndpoint = PublicEndpoint;
//# sourceMappingURL=enterprise-decorators.js.map