"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityModule = void 0;
const common_1 = require("@nestjs/common");
const csp_middleware_1 = require("./csp.middleware");
const cors_middleware_1 = require("./cors.middleware");
const security_headers_middleware_1 = require("./security-headers.middleware");
const rate_limit_guard_1 = require("./rate-limit.guard");
const csrf_guard_1 = require("./csrf.guard");
let SecurityModule = class SecurityModule {
};
exports.SecurityModule = SecurityModule;
exports.SecurityModule = SecurityModule = __decorate([
    (0, common_1.Module)({
        providers: [
            csp_middleware_1.CspMiddleware,
            cors_middleware_1.CorsMiddleware,
            security_headers_middleware_1.SecurityHeadersMiddleware,
            rate_limit_guard_1.RateLimitGuard,
            csrf_guard_1.CsrfGuard,
        ],
        exports: [
            csp_middleware_1.CspMiddleware,
            cors_middleware_1.CorsMiddleware,
            security_headers_middleware_1.SecurityHeadersMiddleware,
            rate_limit_guard_1.RateLimitGuard,
            csrf_guard_1.CsrfGuard,
        ],
    })
], SecurityModule);
//# sourceMappingURL=security.module.js.map