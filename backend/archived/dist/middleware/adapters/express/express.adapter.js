"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ExpressMiddlewareAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressMiddlewareUtils = exports.ExpressMiddlewareAdapter = exports.ExpressNextWrapper = exports.ExpressResponseWrapper = exports.ExpressRequestWrapper = void 0;
const common_1 = require("@nestjs/common");
const base_http_adapter_1 = require("../base/base-http.adapter");
class ExpressRequestWrapper extends base_http_adapter_1.BaseRequestWrapper {
    expressRequest;
    constructor(expressRequest) {
        super(expressRequest.method, expressRequest.url, expressRequest.path, expressRequest.headers, expressRequest.query, expressRequest.params, expressRequest.body, expressRequest.ip || expressRequest.connection?.remoteAddress || 'unknown', expressRequest.get('User-Agent'), expressRequest.get('X-Correlation-ID'), expressRequest.sessionID, expressRequest.user);
        this.expressRequest = expressRequest;
    }
    getRawRequest() {
        return this.expressRequest;
    }
}
exports.ExpressRequestWrapper = ExpressRequestWrapper;
class ExpressResponseWrapper extends base_http_adapter_1.BaseResponseWrapper {
    expressResponse;
    constructor(expressResponse) {
        super(expressResponse.statusCode);
        this.expressResponse = expressResponse;
    }
    setStatus(code) {
        super.setStatus(code);
        this.expressResponse.status(code);
        return this;
    }
    setHeader(name, value) {
        super.setHeader(name, value);
        this.expressResponse.setHeader(name, value);
        return this;
    }
    getHeader(name) {
        return this.expressResponse.getHeader(name);
    }
    removeHeader(name) {
        super.removeHeader(name);
        this.expressResponse.removeHeader(name);
        return this;
    }
    json(data) {
        this._headersSent = true;
        this.expressResponse.json(data);
    }
    send(data) {
        this._headersSent = true;
        this.expressResponse.send(data);
    }
    end(data) {
        this._headersSent = true;
        if (data !== undefined) {
            this.expressResponse.end(data);
        }
        else {
            this.expressResponse.end();
        }
    }
    redirect(statusCodeOrUrl, url) {
        this._headersSent = true;
        if (typeof statusCodeOrUrl === 'number' && url) {
            this.expressResponse.redirect(statusCodeOrUrl, url);
        }
        else if (typeof statusCodeOrUrl === 'string') {
            this.expressResponse.redirect(statusCodeOrUrl);
        }
    }
    get headersSent() {
        return this._headersSent || this.expressResponse.headersSent;
    }
    getRawResponse() {
        return this.expressResponse;
    }
}
exports.ExpressResponseWrapper = ExpressResponseWrapper;
class ExpressNextWrapper extends base_http_adapter_1.BaseNextWrapper {
    expressNext;
    constructor(expressNext) {
        super();
        this.expressNext = expressNext;
    }
    call(error) {
        this.expressNext(error);
    }
    getRawNext() {
        return this.expressNext;
    }
}
exports.ExpressNextWrapper = ExpressNextWrapper;
let ExpressMiddlewareAdapter = ExpressMiddlewareAdapter_1 = class ExpressMiddlewareAdapter extends base_http_adapter_1.BaseHttpAdapter {
    adapt(middleware) {
        return (req, res, next) => {
            const wrappedRequest = new ExpressRequestWrapper(req);
            const wrappedResponse = new ExpressResponseWrapper(res);
            const wrappedNext = new ExpressNextWrapper(next);
            const context = {
                startTime: Date.now(),
                correlationId: wrappedRequest.correlationId ||
                    `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                framework: 'express',
                environment: process.env.NODE_ENV || 'development',
                metadata: {},
            };
            middleware.execute(wrappedRequest, wrappedResponse, wrappedNext, context);
        };
    }
    createHealthcareMiddleware(middlewareFactory, config = {}) {
        const middleware = middlewareFactory(config);
        return this.adapt(middleware);
    }
    chain(...middlewares) {
        return middlewares.map((middleware) => this.adapt(middleware));
    }
    createErrorHandler(errorHandler) {
        return (err, req, res, next) => {
            const wrappedRequest = new ExpressRequestWrapper(req);
            const wrappedResponse = new ExpressResponseWrapper(res);
            const context = {
                startTime: Date.now(),
                correlationId: wrappedRequest.correlationId ||
                    `err-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                framework: 'express',
                environment: process.env.NODE_ENV || 'development',
                metadata: { error: true },
            };
            try {
                errorHandler(err, wrappedRequest, wrappedResponse, context);
            }
            catch (handlerError) {
                next(handlerError);
            }
        };
    }
    createHealthcareEnhancer() {
        return (req, res, next) => {
            const healthcareReq = req;
            healthcareReq.healthcareContext = {
                patientId: req.params.patientId || req.body?.patientId,
                facilityId: req.headers['x-facility-id'],
                providerId: req.user?.userId || req.user?.id,
                accessType: req.headers['x-access-type'],
                auditRequired: true,
                phiAccess: false,
                complianceFlags: [],
            };
            const healthcareRes = res;
            healthcareRes.sendHipaaCompliant = function (data, options = {}) {
                if (options.logAccess && options.patientId) {
                    healthcareReq.healthcareContext.phiAccess = true;
                }
                if (process.env.NODE_ENV !== 'development') {
                    data = this.sanitizeResponse(data);
                }
                return this.json(data);
            };
            healthcareRes.sanitizeResponse = function (data) {
                return ExpressMiddlewareAdapter_1.sanitizeResponse(data);
            };
            next();
        };
    }
};
exports.ExpressMiddlewareAdapter = ExpressMiddlewareAdapter;
exports.ExpressMiddlewareAdapter = ExpressMiddlewareAdapter = ExpressMiddlewareAdapter_1 = __decorate([
    (0, common_1.Injectable)()
], ExpressMiddlewareAdapter);
(function (ExpressMiddlewareAdapter) {
    function sanitizeResponse(data) {
        return base_http_adapter_1.BaseHttpAdapter.sanitizeResponse(data);
    }
    ExpressMiddlewareAdapter.sanitizeResponse = sanitizeResponse;
})(ExpressMiddlewareAdapter || (exports.ExpressMiddlewareAdapter = ExpressMiddlewareAdapter = {}));
let ExpressMiddlewareUtils = class ExpressMiddlewareUtils extends base_http_adapter_1.BaseHttpAdapter {
    adapt(middleware) {
        const adapter = new ExpressMiddlewareAdapter();
        return adapter.adapt(middleware);
    }
    createHealthcareEnhancer() {
        const adapter = new ExpressMiddlewareAdapter();
        return adapter.createHealthcareEnhancer();
    }
    getCorrelationId(req) {
        return this.extractCorrelationId(req.headers);
    }
    setSecurityHeaders(res) {
        const headers = this.getSecurityHeaders();
        Object.entries(headers).forEach(([name, value]) => {
            res.setHeader(name, value);
        });
    }
    getUserContext(req) {
        const user = req.user;
        return this.extractUserContext(user, req.headers, req.sessionID);
    }
};
exports.ExpressMiddlewareUtils = ExpressMiddlewareUtils;
exports.ExpressMiddlewareUtils = ExpressMiddlewareUtils = __decorate([
    (0, common_1.Injectable)()
], ExpressMiddlewareUtils);
//# sourceMappingURL=express.adapter.js.map