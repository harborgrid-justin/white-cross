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
var SecurityHeadersMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityHeadersMiddleware = exports.DEFAULT_SECURITY_CONFIG = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
exports.DEFAULT_SECURITY_CONFIG = {
    contentSecurityPolicy: {
        directives: {
            'default-src': ["'self'"],
            'script-src': ["'self'"],
            'style-src': ["'self'", "'unsafe-inline'"],
            'img-src': ["'self'", 'data:', 'https:'],
            'font-src': ["'self'"],
            'connect-src': ["'self'"],
            'frame-ancestors': ["'none'"],
            'base-uri': ["'self'"],
            'form-action': ["'self'"],
            'object-src': ["'none'"],
            'media-src': ["'self'"],
            'manifest-src': ["'self'"],
        },
        reportOnly: false,
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
    frameOptions: 'DENY',
    noSniff: true,
    xssProtection: {
        enabled: true,
        mode: 'block',
    },
    referrerPolicy: 'strict-origin-when-cross-origin',
    permissionsPolicy: {
        geolocation: [],
        camera: [],
        microphone: [],
        payment: [],
        usb: [],
        magnetometer: [],
        accelerometer: [],
        gyroscope: [],
        fullscreen: ["'self'"],
        'display-capture': [],
    },
    additionalHeaders: {
        'X-Permitted-Cross-Domain-Policies': 'none',
        'X-Download-Options': 'noopen',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Resource-Policy': 'same-origin',
    },
};
let SecurityHeadersMiddleware = SecurityHeadersMiddleware_1 = class SecurityHeadersMiddleware {
    logger = new common_1.Logger(SecurityHeadersMiddleware_1.name);
    config;
    constructor() {
        const env = process.env.NODE_ENV || 'development';
        this.config =
            env === 'development'
                ? this.getDevelopmentConfig()
                : exports.DEFAULT_SECURITY_CONFIG;
        this.validateConfig();
    }
    use(_req, res, next) {
        try {
            const headers = this.applyHeaders({});
            if (headers.applied) {
                Object.entries(headers.headers).forEach(([key, value]) => {
                    res.setHeader(key, value);
                });
                this.logger.debug(`Security headers applied: ${Object.keys(headers.headers).length} headers`);
            }
            next();
        }
        catch (error) {
            this.logger.error('Security headers middleware error', error);
            next();
        }
    }
    getDevelopmentConfig() {
        return {
            ...exports.DEFAULT_SECURITY_CONFIG,
            contentSecurityPolicy: {
                directives: {
                    'default-src': ["'self'"],
                    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                    'style-src': ["'self'", "'unsafe-inline'"],
                    'img-src': ["'self'", 'data:', 'https:', 'http:'],
                    'font-src': ["'self'", 'data:'],
                    'connect-src': ["'self'", 'ws:', 'wss:', 'http:', 'https:'],
                    'frame-ancestors': ["'none'"],
                    'base-uri': ["'self'"],
                    'form-action': ["'self'"],
                },
                reportOnly: true,
            },
            hsts: {
                maxAge: 0,
                includeSubDomains: false,
                preload: false,
            },
        };
    }
    validateConfig() {
        if (this.config.hsts?.maxAge && this.config.hsts.maxAge < 0) {
            throw new Error('HSTS maxAge must be non-negative');
        }
        if (this.config.contentSecurityPolicy?.directives) {
            const directives = this.config.contentSecurityPolicy.directives;
            if (directives['default-src'] && directives['default-src'].length === 0) {
                this.logger.warn('CSP default-src is empty, this may block all resources');
            }
        }
    }
    generateNonce() {
        return crypto.randomBytes(16).toString('base64');
    }
    buildCSPHeader(directives, nonce) {
        const processedDirectives = { ...directives };
        if (nonce) {
            if (processedDirectives['script-src']) {
                processedDirectives['script-src'] = [
                    ...processedDirectives['script-src'].filter((src) => src !== "'unsafe-inline'"),
                    `'nonce-${nonce}'`,
                ];
            }
            if (processedDirectives['style-src']) {
                processedDirectives['style-src'] = [
                    ...processedDirectives['style-src'].filter((src) => src !== "'unsafe-inline'"),
                    `'nonce-${nonce}'`,
                ];
            }
        }
        return Object.entries(processedDirectives)
            .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
            .join('; ');
    }
    buildPermissionsPolicyHeader(permissions) {
        return Object.entries(permissions)
            .map(([feature, allowlist]) => {
            if (allowlist.length === 0) {
                return `${feature}=()`;
            }
            return `${feature}=(${allowlist.join(' ')})`;
        })
            .join(', ');
    }
    applyHeaders(existingHeaders = {}) {
        const headers = { ...existingHeaders };
        const warnings = [];
        try {
            if (this.config.contentSecurityPolicy?.directives) {
                const nonce = this.config.contentSecurityPolicy.nonce || this.generateNonce();
                const cspHeader = this.buildCSPHeader(this.config.contentSecurityPolicy.directives, nonce);
                const headerName = this.config.contentSecurityPolicy.reportOnly
                    ? 'Content-Security-Policy-Report-Only'
                    : 'Content-Security-Policy';
                headers[headerName] = cspHeader;
                headers._cspNonce = nonce;
            }
            if (this.config.hsts && this.config.hsts.maxAge !== 0) {
                const hstsValue = [
                    `max-age=${this.config.hsts.maxAge || 31536000}`,
                    this.config.hsts.includeSubDomains ? 'includeSubDomains' : '',
                    this.config.hsts.preload ? 'preload' : '',
                ]
                    .filter(Boolean)
                    .join('; ');
                headers['Strict-Transport-Security'] = hstsValue;
            }
            if (this.config.frameOptions) {
                headers['X-Frame-Options'] = this.config.frameOptions;
            }
            if (this.config.noSniff) {
                headers['X-Content-Type-Options'] = 'nosniff';
            }
            if (this.config.xssProtection) {
                const xssValue = this.config.xssProtection.enabled
                    ? this.config.xssProtection.mode === 'block'
                        ? '1; mode=block'
                        : '1'
                    : '0';
                headers['X-XSS-Protection'] = xssValue;
            }
            if (this.config.referrerPolicy) {
                headers['Referrer-Policy'] = this.config.referrerPolicy;
            }
            if (this.config.permissionsPolicy) {
                const permissionsValue = this.buildPermissionsPolicyHeader(this.config.permissionsPolicy);
                headers['Permissions-Policy'] = permissionsValue;
            }
            if (this.config.additionalHeaders) {
                Object.assign(headers, this.config.additionalHeaders);
            }
            return {
                applied: true,
                headers,
                warnings: warnings.length > 0 ? warnings : undefined,
            };
        }
        catch (error) {
            this.logger.error('Failed to apply security headers', error);
            return {
                applied: false,
                headers: existingHeaders,
                warnings: [`Failed to apply security headers: ${error}`],
            };
        }
    }
    applyDownloadHeaders(filename, contentType, existingHeaders = {}) {
        const result = this.applyHeaders(existingHeaders);
        if (result.applied) {
            result.headers['Content-Disposition'] =
                `attachment; filename="${encodeURIComponent(filename)}"`;
            result.headers['Content-Type'] = contentType;
            result.headers['Cache-Control'] =
                'no-store, no-cache, must-revalidate, private';
            result.headers['Pragma'] = 'no-cache';
            result.headers['Expires'] = '0';
        }
        return result;
    }
};
exports.SecurityHeadersMiddleware = SecurityHeadersMiddleware;
exports.SecurityHeadersMiddleware = SecurityHeadersMiddleware = SecurityHeadersMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SecurityHeadersMiddleware);
//# sourceMappingURL=security-headers.middleware.js.map