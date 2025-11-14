"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsTransformInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const base_interceptor_1 = require("../../../common/interceptors/base.interceptor");
const SENSITIVE_FIELDS = [
    'password',
    'token',
    'secret',
    'apiKey',
    'privateKey',
    'sessionId',
];
let WsTransformInterceptor = class WsTransformInterceptor extends base_interceptor_1.BaseInterceptor {
    intercept(_context, next) {
        return next.handle().pipe((0, operators_1.map)((data) => {
            if (data === null || data === undefined) {
                return data;
            }
            return this.transformResponse(data);
        }));
    }
    transformResponse(data) {
        if (typeof data?.toPayload === 'function') {
            return data.toPayload();
        }
        if (typeof data === 'object' && data !== null) {
            return this.sanitizeObject(data);
        }
        return data;
    }
    sanitizeObject(obj) {
        if (Array.isArray(obj)) {
            return obj.map((item) => this.sanitizeObject(item));
        }
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            if (SENSITIVE_FIELDS.some((field) => key.toLowerCase().includes(field))) {
                continue;
            }
            if (typeof value === 'object' && value !== null) {
                sanitized[key] = this.sanitizeObject(value);
            }
            else {
                sanitized[key] = value;
            }
        }
        return sanitized;
    }
};
exports.WsTransformInterceptor = WsTransformInterceptor;
exports.WsTransformInterceptor = WsTransformInterceptor = __decorate([
    (0, common_1.Injectable)()
], WsTransformInterceptor);
//# sourceMappingURL=ws-transform.interceptor.js.map