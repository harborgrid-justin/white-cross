"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SanitizationInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const base_interceptor_1 = require("./base.interceptor");
let SanitizationInterceptor = class SanitizationInterceptor extends base_interceptor_1.BaseInterceptor {
    dangerousPatterns = {
        xss: /<script|javascript:|onerror=|onclick=|onload=/i,
        sql: /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b)/i,
        path: /\.\.\//g,
    };
    constructor() {
        super();
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { handler, controller } = this.getHandlerInfo(context);
        if (request.body) {
            const originalBody = JSON.stringify(request.body);
            request.body = this.sanitizeObject(request.body);
            const sanitizedBody = JSON.stringify(request.body);
            if (originalBody !== sanitizedBody) {
                this.logRequest('warn', `Input sanitized in ${controller}.${handler}`, {
                    controller,
                    handler,
                    originalLength: originalBody.length,
                    sanitizedLength: sanitizedBody.length,
                });
            }
        }
        return next.handle().pipe((0, operators_1.map)((data) => {
            return data;
        }));
    }
    sanitizeObject(obj) {
        if (!obj || typeof obj !== 'object') {
            return this.sanitizeValue(obj);
        }
        if (Array.isArray(obj)) {
            return obj.map((item) => this.sanitizeObject(item));
        }
        const sanitized = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                sanitized[key] = this.sanitizeObject(obj[key]);
            }
        }
        return sanitized;
    }
    sanitizeValue(value) {
        if (typeof value !== 'string')
            return value;
        let sanitized = value.replace(this.dangerousPatterns.xss, '');
        sanitized = sanitized.replace(this.dangerousPatterns.path, '');
        sanitized = sanitized.trim();
        return sanitized;
    }
};
exports.SanitizationInterceptor = SanitizationInterceptor;
exports.SanitizationInterceptor = SanitizationInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SanitizationInterceptor);
//# sourceMappingURL=sanitization.interceptor.js.map