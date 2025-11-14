"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestContextMiddleware = exports.requestContextStorage = void 0;
exports.getRequestContext = getRequestContext;
exports.getRequestId = getRequestId;
exports.getCurrentUserId = getCurrentUserId;
exports.getCurrentOrganizationId = getCurrentOrganizationId;
const common_1 = require("@nestjs/common");
const async_hooks_1 = require("async_hooks");
const uuid_1 = require("uuid");
exports.requestContextStorage = new async_hooks_1.AsyncLocalStorage();
let RequestContextMiddleware = class RequestContextMiddleware {
    use(req, res, next) {
        const requestId = this.extractRequestId(req);
        const userId = req.user?.id;
        const organizationId = req.user?.organizationId;
        const ipAddress = this.getClientIp(req);
        const userAgent = req.headers['user-agent'];
        const context = {
            requestId,
            userId,
            organizationId,
            ipAddress,
            userAgent,
            timestamp: new Date(),
        };
        res.setHeader('X-Request-ID', requestId);
        exports.requestContextStorage.run(context, () => {
            next();
        });
    }
    extractRequestId(req) {
        const headerRequestId = req.headers['x-request-id'] ||
            req.headers['x-correlation-id'] ||
            req.headers['x-trace-id'];
        if (headerRequestId) {
            return Array.isArray(headerRequestId)
                ? headerRequestId[0]
                : headerRequestId;
        }
        return (0, uuid_1.v4)();
    }
    getClientIp(req) {
        return (req.headers['x-forwarded-for']?.split(',')[0] ||
            req.headers['x-real-ip'] ||
            req.socket.remoteAddress ||
            'unknown');
    }
};
exports.RequestContextMiddleware = RequestContextMiddleware;
exports.RequestContextMiddleware = RequestContextMiddleware = __decorate([
    (0, common_1.Injectable)()
], RequestContextMiddleware);
function getRequestContext() {
    return exports.requestContextStorage.getStore();
}
function getRequestId() {
    return getRequestContext()?.requestId;
}
function getCurrentUserId() {
    return getRequestContext()?.userId;
}
function getCurrentOrganizationId() {
    return getRequestContext()?.organizationId;
}
//# sourceMappingURL=request-context.middleware.js.map