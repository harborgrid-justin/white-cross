"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseNextWrapper = exports.BaseResponseWrapper = exports.BaseRequestWrapper = exports.BaseHttpAdapter = void 0;
const common_1 = require("@nestjs/common");
let BaseHttpAdapter = class BaseHttpAdapter {
    createMiddlewareContext(correlationId, framework = 'unknown') {
        return {
            startTime: Date.now(),
            correlationId: correlationId ||
                `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            framework,
            environment: process.env.NODE_ENV || 'development',
            metadata: {},
        };
    }
    initializeHealthcareContext(params, headers, body, user) {
        return {
            patientId: params.patientId || body?.patientId,
            facilityId: headers['x-facility-id'],
            providerId: user?.userId || user?.id,
            accessType: headers['x-access-type'],
            auditRequired: true,
            phiAccess: false,
            complianceFlags: [],
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
    getSecurityHeaders() {
        return {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
        };
    }
    extractUserContext(user, headers, sessionId) {
        return {
            id: user?.userId || user?.id,
            role: user?.role,
            permissions: user?.permissions || [],
            facilityId: user?.facilityId || headers['x-facility-id'],
            sessionId,
        };
    }
    extractCorrelationId(headers) {
        return (headers['x-correlation-id'] ||
            headers['x-request-id'] ||
            `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    }
};
exports.BaseHttpAdapter = BaseHttpAdapter;
exports.BaseHttpAdapter = BaseHttpAdapter = __decorate([
    (0, common_1.Injectable)()
], BaseHttpAdapter);
class BaseRequestWrapper {
    method;
    url;
    path;
    headers;
    query;
    params;
    body;
    ip;
    userAgent;
    correlationId;
    sessionId;
    user;
    metadata = {};
    constructor(method, url, path, headers, query, params, body, ip, userAgent, correlationId, sessionId, user) {
        this.method = method;
        this.url = url;
        this.path = path;
        this.headers = headers;
        this.query = query;
        this.params = params;
        this.body = body;
        this.ip = ip;
        this.userAgent = userAgent;
        this.correlationId = correlationId;
        this.sessionId = sessionId;
        this.user = user;
    }
    getHeader(name) {
        return this.headers[name.toLowerCase()];
    }
    setMetadata(key, value) {
        this.metadata[key] = value;
    }
    getMetadata(key) {
        return this.metadata[key];
    }
}
exports.BaseRequestWrapper = BaseRequestWrapper;
class BaseResponseWrapper {
    statusCode;
    headers = {};
    _headersSent = false;
    constructor(statusCode = 200) {
        this.statusCode = statusCode;
    }
    setStatus(code) {
        this.statusCode = code;
        return this;
    }
    setHeader(name, value) {
        this.headers[name] = value;
        return this;
    }
    getHeader(name) {
        return this.headers[name];
    }
    removeHeader(name) {
        delete this.headers[name];
        return this;
    }
    redirect(statusCodeOrUrl, url) {
        this._headersSent = true;
        this.setStatus(typeof statusCodeOrUrl === 'number' ? statusCodeOrUrl : 302);
        this.setHeader('Location', typeof statusCodeOrUrl === 'string' ? statusCodeOrUrl : url);
    }
    get headersSent() {
        return this._headersSent;
    }
}
exports.BaseResponseWrapper = BaseResponseWrapper;
class BaseNextWrapper {
}
exports.BaseNextWrapper = BaseNextWrapper;
//# sourceMappingURL=base-http.adapter.js.map