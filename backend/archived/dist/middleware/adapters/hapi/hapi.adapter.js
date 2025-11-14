"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HapiMiddlewareAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HapiMiddlewareUtils = exports.HapiMiddlewareAdapter = exports.HapiNextWrapper = exports.HapiResponseWrapper = exports.HapiRequestWrapper = void 0;
const common_1 = require("@nestjs/common");
const base_http_adapter_1 = require("../base/base-http.adapter");
class HapiRequestWrapper extends base_http_adapter_1.BaseRequestWrapper {
    hapiRequest;
    constructor(hapiRequest) {
        super(hapiRequest.method.toUpperCase(), hapiRequest.url.href, hapiRequest.url.pathname, hapiRequest.headers, hapiRequest.query, hapiRequest.params, hapiRequest.payload, hapiRequest.info.remoteAddress, hapiRequest.headers['user-agent'], hapiRequest.headers['x-correlation-id'], hapiRequest.yar?.id, hapiRequest.auth?.credentials);
        this.hapiRequest = hapiRequest;
    }
    getRawRequest() {
        return this.hapiRequest;
    }
}
exports.HapiRequestWrapper = HapiRequestWrapper;
class HapiResponseWrapper extends base_http_adapter_1.BaseResponseWrapper {
    hapiToolkit;
    _responseData = null;
    constructor(hapiToolkit) {
        super(200);
        this.hapiToolkit = hapiToolkit;
    }
    setStatus(code) {
        super.setStatus(code);
        return this;
    }
    setHeader(name, value) {
        super.setHeader(name, value);
        return this;
    }
    getHeader(name) {
        return this.headers[name];
    }
    removeHeader(name) {
        super.removeHeader(name);
        return this;
    }
    json(data) {
        this._headersSent = true;
        this._responseData = this.hapiToolkit
            .response(data)
            .code(this.statusCode)
            .type('application/json');
        Object.entries(this.headers).forEach(([name, value]) => {
            this._responseData.header(name, value);
        });
    }
    send(data) {
        this._headersSent = true;
        this._responseData = this.hapiToolkit.response(data).code(this.statusCode);
        Object.entries(this.headers).forEach(([name, value]) => {
            this._responseData.header(name, value);
        });
    }
    end(data) {
        if (data !== undefined) {
            this.send(data);
        }
        else {
            this._headersSent = true;
            this._responseData = this.hapiToolkit.response().code(this.statusCode);
            Object.entries(this.headers).forEach(([name, value]) => {
                this._responseData.header(name, value);
            });
        }
    }
    redirect(statusCodeOrUrl, url) {
        this._headersSent = true;
        if (typeof statusCodeOrUrl === 'number' && url) {
            this._responseData = this.hapiToolkit.redirect(url).code(statusCodeOrUrl);
        }
        else if (typeof statusCodeOrUrl === 'string') {
            this._responseData = this.hapiToolkit.redirect(statusCodeOrUrl);
        }
    }
    getRawResponse() {
        return this.hapiToolkit;
    }
    getHapiResponse() {
        return this._responseData;
    }
}
exports.HapiResponseWrapper = HapiResponseWrapper;
class HapiNextWrapper extends base_http_adapter_1.BaseNextWrapper {
    continueFunc;
    constructor(continueFunc) {
        super();
        this.continueFunc = continueFunc;
    }
    call(error) {
        if (error) {
            throw error;
        }
        this.continueFunc();
    }
    getRawNext() {
        return this.continueFunc;
    }
}
exports.HapiNextWrapper = HapiNextWrapper;
let HapiMiddlewareAdapter = HapiMiddlewareAdapter_1 = class HapiMiddlewareAdapter extends base_http_adapter_1.BaseHttpAdapter {
    adaptAsExtension(middleware, point = 'onPreHandler') {
        return {
            type: point,
            method: async (request, h) => {
                const wrappedRequest = new HapiRequestWrapper(request);
                const wrappedResponse = new HapiResponseWrapper(h);
                let nextCalled = false;
                const wrappedNext = new HapiNextWrapper(() => {
                    nextCalled = true;
                });
                const context = {
                    startTime: Date.now(),
                    correlationId: wrappedRequest.correlationId ||
                        `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    framework: 'hapi',
                    environment: process.env.NODE_ENV || 'development',
                    metadata: {},
                };
                try {
                    await middleware.execute(wrappedRequest, wrappedResponse, wrappedNext, context);
                    if (wrappedResponse.headersSent) {
                        return wrappedResponse.getHapiResponse();
                    }
                    return h.continue;
                }
                catch (error) {
                    throw error;
                }
            },
        };
    }
    adaptAsPlugin(middleware, options) {
        const { name, version = '1.0.0', extensionPoint = 'onPreHandler', } = options;
        return {
            name,
            version,
            register: async (server) => {
                const extension = this.adaptAsExtension(middleware, extensionPoint);
                server.ext(extension);
            },
        };
    }
    createHealthcareEnhancerPlugin() {
        return {
            name: 'healthcare-enhancer',
            version: '1.0.0',
            register: async (server) => {
                server.ext({
                    type: 'onPreHandler',
                    method: (request, h) => {
                        const healthcareReq = request;
                        healthcareReq.healthcareContext = {
                            patientId: request.params.patientId || request.payload?.patientId,
                            facilityId: request.headers['x-facility-id'],
                            providerId: request.auth?.credentials?.userId ||
                                request.auth?.credentials?.id,
                            accessType: request.headers['x-access-type'],
                            auditRequired: true,
                            phiAccess: false,
                            complianceFlags: [],
                        };
                        return h.continue;
                    },
                });
                server.decorate('toolkit', 'sendHipaaCompliant', function (data, options = {}) {
                    const h = this;
                    if (options.logAccess && options.patientId) {
                    }
                    if (process.env.NODE_ENV !== 'development') {
                        data = HapiMiddlewareAdapter_1.sanitizeResponse(data);
                    }
                    return h.response(data).type('application/json');
                });
            },
        };
    }
    static sanitizeResponse(data) {
        return base_http_adapter_1.BaseHttpAdapter.sanitizeResponse(data);
    }
    createRouteWithMiddleware(routeConfig, middlewares, handler) {
        return {
            ...routeConfig,
            handler: async (request, h) => {
                for (const middleware of middlewares) {
                    const wrappedRequest = new HapiRequestWrapper(request);
                    const wrappedResponse = new HapiResponseWrapper(h);
                    let nextCalled = false;
                    const wrappedNext = new HapiNextWrapper(() => {
                        nextCalled = true;
                    });
                    const context = {
                        startTime: Date.now(),
                        correlationId: wrappedRequest.correlationId ||
                            `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        framework: 'hapi',
                        environment: process.env.NODE_ENV || 'development',
                        metadata: {},
                    };
                    try {
                        await middleware.execute(wrappedRequest, wrappedResponse, wrappedNext, context);
                        if (wrappedResponse.headersSent) {
                            return wrappedResponse.getHapiResponse();
                        }
                    }
                    catch (error) {
                        throw error;
                    }
                }
                return handler(request, h);
            },
        };
    }
};
exports.HapiMiddlewareAdapter = HapiMiddlewareAdapter;
exports.HapiMiddlewareAdapter = HapiMiddlewareAdapter = HapiMiddlewareAdapter_1 = __decorate([
    (0, common_1.Injectable)()
], HapiMiddlewareAdapter);
let HapiMiddlewareUtils = class HapiMiddlewareUtils extends base_http_adapter_1.BaseHttpAdapter {
    adapt(middleware) {
        const adapter = new HapiMiddlewareAdapter();
        return adapter.adaptAsExtension(middleware);
    }
    createHealthcareEnhancer() {
        const adapter = new HapiMiddlewareAdapter();
        return adapter.createHealthcareEnhancerPlugin();
    }
    getCorrelationId(request) {
        return this.extractCorrelationId(request.headers);
    }
    setSecurityHeaders(h, response) {
        const headers = this.getSecurityHeaders();
        let result = response;
        Object.entries(headers).forEach(([name, value]) => {
            result = result.header(name, value);
        });
        return result;
    }
    getUserContext(request) {
        const credentials = request.auth?.credentials;
        return this.extractUserContext(credentials, request.headers, request.yar?.id);
    }
    validateHealthcareContext(request) {
        const healthcareReq = request;
        return !!(healthcareReq.healthcareContext &&
            healthcareReq.healthcareContext.accessType &&
            healthcareReq.healthcareContext.auditRequired !== undefined);
    }
};
exports.HapiMiddlewareUtils = HapiMiddlewareUtils;
exports.HapiMiddlewareUtils = HapiMiddlewareUtils = __decorate([
    (0, common_1.Injectable)()
], HapiMiddlewareUtils);
//# sourceMappingURL=hapi.adapter.js.map