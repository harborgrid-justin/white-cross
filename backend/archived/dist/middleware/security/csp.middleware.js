"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CspMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CspMiddleware = exports.CSPViolationReporter = exports.CSPNonceGenerator = exports.HealthcareCSPPolicies = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
class HealthcareCSPPolicies {
    static getBaseDirectives() {
        return {
            'default-src': ["'self'"],
            'script-src': ["'self'", "'unsafe-inline'"],
            'style-src': [
                "'self'",
                "'unsafe-inline'",
                'https://fonts.googleapis.com',
            ],
            'img-src': ["'self'", 'data:', 'https:'],
            'connect-src': ["'self'"],
            'font-src': ["'self'", 'https://fonts.gstatic.com'],
            'object-src': ["'none'"],
            'media-src': ["'self'"],
            'frame-src': ["'none'"],
            'child-src': ["'none'"],
            'form-action': ["'self'"],
            'frame-ancestors': ["'none'"],
            'base-uri': ["'self'"],
            'manifest-src': ["'self'"],
            'worker-src': ["'self'"],
            'upgrade-insecure-requests': true,
            'block-all-mixed-content': true,
        };
    }
    static getStrictDirectives() {
        return {
            ...this.getBaseDirectives(),
            'script-src': ["'self'", "'strict-dynamic'"],
            'style-src': ["'self'", 'https://fonts.googleapis.com'],
            'connect-src': ["'self'"],
            'img-src': ["'self'", 'data:'],
        };
    }
    static isHealthcareCompliant(directive, value) {
        const riskyPatterns = [
            'unsafe-eval',
            '*.',
            'http:',
            'data:',
        ];
        if (directive === 'script-src' && value === 'data:') {
            return false;
        }
        return !riskyPatterns.some((pattern) => value.includes(pattern));
    }
}
exports.HealthcareCSPPolicies = HealthcareCSPPolicies;
class CSPNonceGenerator {
    static nonceCache = new Map();
    static NONCE_TTL = 300000;
    static generate(requestId) {
        const nonce = this.generateSecureNonce();
        if (requestId) {
            this.nonceCache.set(requestId, {
                nonce,
                timestamp: Date.now(),
            });
            this.cleanupExpiredNonces();
        }
        return nonce;
    }
    static getCached(requestId) {
        const cached = this.nonceCache.get(requestId);
        if (cached && Date.now() - cached.timestamp < this.NONCE_TTL) {
            return cached.nonce;
        }
        return null;
    }
    static generateSecureNonce() {
        return crypto.randomBytes(16).toString('base64');
    }
    static cleanupExpiredNonces() {
        const now = Date.now();
        for (const [key, value] of this.nonceCache.entries()) {
            if (now - value.timestamp >= this.NONCE_TTL) {
                this.nonceCache.delete(key);
            }
        }
    }
}
exports.CSPNonceGenerator = CSPNonceGenerator;
class CSPViolationReporter {
    static violations = [];
    static MAX_VIOLATIONS = 1000;
    static processViolation(report, clientIp) {
        const violation = {
            ...report,
            timestamp: new Date(),
            clientIp: this.sanitizeIp(clientIp),
            severity: this.assessViolationSeverity(report),
        };
        this.violations.push(violation);
        if (this.violations.length > this.MAX_VIOLATIONS) {
            this.violations.shift();
        }
        if (this.isHealthcareCritical(report)) {
            common_1.Logger.error(`[CSP-HEALTHCARE-VIOLATION] ${JSON.stringify({
                directive: report['csp-report']['violated-directive'],
                uri: report['csp-report']['document-uri'],
                blocked: report['csp-report']['blocked-uri'],
                timestamp: new Date().toISOString(),
            })}`, 'CSPViolationReporter');
        }
    }
    static getViolationStats() {
        const now = Date.now();
        const oneDayAgo = now - 24 * 60 * 60 * 1000;
        const byDirective = {};
        let healthcareCritical = 0;
        let last24Hours = 0;
        for (const violation of this.violations) {
            const directive = violation['csp-report']['violated-directive'];
            byDirective[directive] = (byDirective[directive] || 0) + 1;
            if (this.isHealthcareCritical(violation)) {
                healthcareCritical++;
            }
            if (violation.timestamp?.getTime() > oneDayAgo) {
                last24Hours++;
            }
        }
        return {
            total: this.violations.length,
            byDirective,
            healthcareCritical,
            last24Hours,
        };
    }
    static sanitizeIp(ip) {
        const parts = ip.split('.');
        if (parts.length === 4) {
            return `${parts[0]}.${parts[1]}.xxx.xxx`;
        }
        return 'xxx.xxx.xxx.xxx';
    }
    static assessViolationSeverity(report) {
        const directive = report['csp-report']['violated-directive'];
        const blockedUri = report['csp-report']['blocked-uri'];
        if (directive.includes('script-src') && blockedUri.includes('eval')) {
            return 'critical';
        }
        if (directive.includes('frame-ancestors')) {
            return 'high';
        }
        if (directive.includes('connect-src') && !blockedUri.startsWith('https:')) {
            return 'high';
        }
        return 'medium';
    }
    static isHealthcareCritical(report) {
        const directive = report['csp-report']['violated-directive'];
        const criticalDirectives = [
            'script-src',
            'frame-ancestors',
            'form-action',
            'connect-src',
        ];
        return criticalDirectives.some((critical) => directive.includes(critical));
    }
}
exports.CSPViolationReporter = CSPViolationReporter;
let CspMiddleware = CspMiddleware_1 = class CspMiddleware {
    logger = new common_1.Logger(CspMiddleware_1.name);
    config;
    metrics;
    constructor() {
        this.config = {
            reportOnly: false,
            reportUri: '/api/security/csp-violations',
            enableNonce: true,
            customDirectives: {},
            strictMode: process.env.NODE_ENV === 'production',
            healthcareCompliance: true,
        };
        this.metrics = {
            violationsCount: 0,
            policiesApplied: 0,
            noncesGenerated: 0,
            healthcareViolations: 0,
        };
    }
    use(req, res, next) {
        try {
            const startTime = Date.now();
            let nonce;
            if (this.config.enableNonce) {
                const requestId = req.correlationId ||
                    req.sessionId ||
                    `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                nonce = CSPNonceGenerator.generate(requestId);
                this.metrics.noncesGenerated++;
                req.cspNonce = nonce;
                res.locals.cspNonce = nonce;
            }
            const policy = this.buildCSPPolicy(nonce);
            const headerName = this.config.reportOnly
                ? 'Content-Security-Policy-Report-Only'
                : 'Content-Security-Policy';
            res.setHeader(headerName, policy);
            this.setAdditionalSecurityHeaders(res);
            this.metrics.policiesApplied++;
            this.auditLog(req, policy, Date.now() - startTime);
            next();
        }
        catch (error) {
            this.logger.error('CSP middleware error', error);
            res.setHeader('Content-Security-Policy', "default-src 'self'");
            next();
        }
    }
    handleViolationReport(req, res) {
        try {
            const report = req.body;
            const clientIp = req.ip || 'unknown';
            CSPViolationReporter.processViolation(report, clientIp);
            this.metrics.violationsCount++;
            if (this.isHealthcareViolation(report)) {
                this.metrics.healthcareViolations++;
            }
            res.status(204).send();
        }
        catch (error) {
            this.logger.error('CSP violation report error', error);
            res.status(400).json({ error: 'Invalid violation report' });
        }
    }
    getMetrics() {
        return {
            ...this.metrics,
            violationStats: CSPViolationReporter.getViolationStats(),
        };
    }
    buildCSPPolicy(nonce) {
        let directives;
        if (this.config.healthcareCompliance) {
            directives = this.config.strictMode
                ? HealthcareCSPPolicies.getStrictDirectives()
                : HealthcareCSPPolicies.getBaseDirectives();
        }
        else {
            directives = HealthcareCSPPolicies.getBaseDirectives();
        }
        Object.entries(this.config.customDirectives).forEach(([key, values]) => {
            directives[key] = values;
        });
        if (nonce) {
            if (directives['script-src']) {
                directives['script-src'] = [
                    ...directives['script-src'],
                    `'nonce-${nonce}'`,
                ];
            }
            if (directives['style-src']) {
                directives['style-src'] = [
                    ...directives['style-src'],
                    `'nonce-${nonce}'`,
                ];
            }
        }
        const policyParts = [];
        Object.entries(directives).forEach(([directive, value]) => {
            if (typeof value === 'boolean') {
                if (value) {
                    policyParts.push(directive);
                }
            }
            else if (Array.isArray(value)) {
                policyParts.push(`${directive} ${value.join(' ')}`);
            }
        });
        if (this.config.reportUri) {
            policyParts.push(`report-uri ${this.config.reportUri}`);
        }
        return policyParts.join('; ');
    }
    setAdditionalSecurityHeaders(res) {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()');
    }
    isHealthcareViolation(report) {
        const uri = report['csp-report']['document-uri'];
        const blockedUri = report['csp-report']['blocked-uri'];
        const healthcareKeywords = [
            'patient',
            'medical',
            'healthcare',
            'hipaa',
            'phi',
            'medication',
            'diagnosis',
            'treatment',
        ];
        return healthcareKeywords.some((keyword) => uri.toLowerCase().includes(keyword) ||
            blockedUri.toLowerCase().includes(keyword));
    }
    auditLog(req, policy, processingTime) {
        const auditEntry = {
            timestamp: new Date().toISOString(),
            event: 'csp_policy_applied',
            requestId: req.correlationId || req.sessionId || 'unknown',
            userAgent: req.headers?.['user-agent'],
            ip: req.ip,
            path: req.path,
            method: req.method,
            policyLength: policy.length,
            processingTime,
            healthcareCompliance: this.config.healthcareCompliance,
            strictMode: this.config.strictMode,
        };
        this.logger.debug(`[CSP-AUDIT] ${JSON.stringify(auditEntry)}`);
    }
};
exports.CspMiddleware = CspMiddleware;
exports.CspMiddleware = CspMiddleware = CspMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CspMiddleware);
//# sourceMappingURL=csp.middleware.js.map