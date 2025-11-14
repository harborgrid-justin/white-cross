"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdapterUtilities = void 0;
class AdapterUtilities {
    static generateCorrelationId(existingId) {
        return (existingId ||
            `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    }
    static createMiddlewareContext(framework, correlationId) {
        return {
            startTime: Date.now(),
            correlationId: this.generateCorrelationId(correlationId),
            framework,
            environment: process.env.NODE_ENV || 'development',
            metadata: {},
        };
    }
    static getSecurityHeaders() {
        return {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
        };
    }
    static getUserContext(request) {
        const user = request.user;
        return {
            id: user?.userId || user?.id,
            role: user?.role,
            permissions: user?.permissions || [],
            facilityId: user?.facilityId || request.getHeader('x-facility-id'),
            sessionId: request.sessionId,
        };
    }
    static sanitizeResponse(data) {
        if (!data)
            return data;
        const sensitiveFields = [
            'ssn',
            'socialSecurityNumber',
            'password',
            'token',
        ];
        if (typeof data === 'object') {
            const sanitized = { ...data };
            sensitiveFields.forEach((field) => {
                if (sanitized[field]) {
                    delete sanitized[field];
                }
            });
            return sanitized;
        }
        return data;
    }
    static createHealthcareContext(request, user) {
        return {
            patientId: request.params?.patientId || request.body?.patientId,
            facilityId: request.getHeader('x-facility-id'),
            providerId: user?.userId || user?.id,
            accessType: request.getHeader('x-access-type'),
            auditRequired: true,
            phiAccess: false,
            complianceFlags: [],
        };
    }
}
exports.AdapterUtilities = AdapterUtilities;
//# sourceMappingURL=adapter-utilities.js.map