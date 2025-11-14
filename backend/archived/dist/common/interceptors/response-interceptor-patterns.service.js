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
var ResponseTimeInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHIMaskingInterceptor = exports.HIPAAAuditInterceptor = exports.PaginationLinksInterceptor = exports.SanitizeErrorInterceptor = exports.ErrorTransformInterceptor = exports.SecurityHeadersInterceptor = exports.ResponseTimeInterceptor = exports.LastModifiedInterceptor = exports.ETagInterceptor = exports.NoCacheInterceptor = exports.GzipInterceptor = exports.ExcludeNullInterceptor = exports.MinimalResponseInterceptor = exports.PaginationEnvelopeInterceptor = exports.ResponseEnvelopeInterceptor = void 0;
exports.SuccessResponseInterceptor = SuccessResponseInterceptor;
exports.TransformFieldNamesInterceptor = TransformFieldNamesInterceptor;
exports.MaskSensitiveDataInterceptor = MaskSensitiveDataInterceptor;
exports.SelectFieldsInterceptor = SelectFieldsInterceptor;
exports.OmitFieldsInterceptor = OmitFieldsInterceptor;
exports.CompressionInterceptor = CompressionInterceptor;
exports.CacheControlInterceptor = CacheControlInterceptor;
exports.LoggingInterceptor = LoggingInterceptor;
exports.TimeoutInterceptor = TimeoutInterceptor;
exports.RetryInterceptor = RetryInterceptor;
exports.AddHeadersInterceptor = AddHeadersInterceptor;
exports.CorsHeadersInterceptor = CorsHeadersInterceptor;
exports.RateLimitHeadersInterceptor = RateLimitHeadersInterceptor;
exports.HATEOASInterceptor = HATEOASInterceptor;
exports.ApiVersionInterceptor = ApiVersionInterceptor;
exports.DeprecationWarningInterceptor = DeprecationWarningInterceptor;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const zlib = __importStar(require("zlib"));
const util_1 = require("util");
const gzip = (0, util_1.promisify)(zlib.gzip);
const brotliCompress = (0, util_1.promisify)(zlib.brotliCompress);
let ResponseEnvelopeInterceptor = class ResponseEnvelopeInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        return next.handle().pipe((0, operators_1.map)((data) => ({
            success: true,
            statusCode: response.statusCode,
            data,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
        })));
    }
};
exports.ResponseEnvelopeInterceptor = ResponseEnvelopeInterceptor;
exports.ResponseEnvelopeInterceptor = ResponseEnvelopeInterceptor = __decorate([
    (0, common_1.Injectable)()
], ResponseEnvelopeInterceptor);
let PaginationEnvelopeInterceptor = class PaginationEnvelopeInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)((data) => {
            if (data && typeof data === 'object' && 'data' in data && 'meta' in data) {
                return data;
            }
            if (Array.isArray(data)) {
                return {
                    data,
                    meta: {
                        page: 1,
                        limit: data.length,
                        total: data.length,
                        totalPages: 1,
                        hasNextPage: false,
                        hasPreviousPage: false,
                    },
                };
            }
            return data;
        }));
    }
};
exports.PaginationEnvelopeInterceptor = PaginationEnvelopeInterceptor;
exports.PaginationEnvelopeInterceptor = PaginationEnvelopeInterceptor = __decorate([
    (0, common_1.Injectable)()
], PaginationEnvelopeInterceptor);
function SuccessResponseInterceptor(message) {
    let SuccessResponseInterceptorImpl = class SuccessResponseInterceptorImpl {
        intercept(context, next) {
            const response = context.switchToHttp().getResponse();
            return next.handle().pipe((0, operators_1.map)((data) => ({
                success: true,
                statusCode: response.statusCode,
                message: message || 'Operation completed successfully',
                data,
                timestamp: new Date().toISOString(),
            })));
        }
    };
    SuccessResponseInterceptorImpl = __decorate([
        (0, common_1.Injectable)()
    ], SuccessResponseInterceptorImpl);
    return SuccessResponseInterceptorImpl;
}
let MinimalResponseInterceptor = class MinimalResponseInterceptor {
    intercept(context, next) {
        return next.handle();
    }
};
exports.MinimalResponseInterceptor = MinimalResponseInterceptor;
exports.MinimalResponseInterceptor = MinimalResponseInterceptor = __decorate([
    (0, common_1.Injectable)()
], MinimalResponseInterceptor);
let ExcludeNullInterceptor = class ExcludeNullInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)((data) => this.removeNullValues(data)));
    }
    removeNullValues(obj) {
        if (obj === null || obj === undefined) {
            return undefined;
        }
        if (Array.isArray(obj)) {
            return obj.map((item) => this.removeNullValues(item)).filter((item) => item !== undefined);
        }
        if (typeof obj === 'object') {
            const result = {};
            for (const [key, value] of Object.entries(obj)) {
                const cleaned = this.removeNullValues(value);
                if (cleaned !== undefined) {
                    result[key] = cleaned;
                }
            }
            return result;
        }
        return obj;
    }
};
exports.ExcludeNullInterceptor = ExcludeNullInterceptor;
exports.ExcludeNullInterceptor = ExcludeNullInterceptor = __decorate([
    (0, common_1.Injectable)()
], ExcludeNullInterceptor);
function TransformFieldNamesInterceptor(transformFn) {
    let TransformFieldNamesInterceptorImpl = class TransformFieldNamesInterceptorImpl {
        intercept(context, next) {
            return next.handle().pipe((0, operators_1.map)((data) => this.transformKeys(data, transformFn)));
        }
        transformKeys(obj, fn) {
            if (Array.isArray(obj)) {
                return obj.map((item) => this.transformKeys(item, fn));
            }
            if (obj !== null && typeof obj === 'object') {
                return Object.keys(obj).reduce((result, key) => {
                    const newKey = fn(key);
                    result[newKey] = this.transformKeys(obj[key], fn);
                    return result;
                }, {});
            }
            return obj;
        }
    };
    TransformFieldNamesInterceptorImpl = __decorate([
        (0, common_1.Injectable)()
    ], TransformFieldNamesInterceptorImpl);
    return TransformFieldNamesInterceptorImpl;
}
function MaskSensitiveDataInterceptor(sensitiveFields, maskChar = '*', visibleChars = 4) {
    let MaskSensitiveDataInterceptorImpl = class MaskSensitiveDataInterceptorImpl {
        intercept(context, next) {
            return next.handle().pipe((0, operators_1.map)((data) => this.maskFields(data)));
        }
        maskFields(obj) {
            if (Array.isArray(obj)) {
                return obj.map((item) => this.maskFields(item));
            }
            if (obj !== null && typeof obj === 'object') {
                const result = {};
                for (const [key, value] of Object.entries(obj)) {
                    if (sensitiveFields.includes(key) && typeof value === 'string') {
                        result[key] = this.maskValue(value);
                    }
                    else {
                        result[key] = this.maskFields(value);
                    }
                }
                return result;
            }
            return obj;
        }
        maskValue(value) {
            if (value.length <= visibleChars) {
                return maskChar.repeat(value.length);
            }
            const masked = maskChar.repeat(value.length - visibleChars);
            return masked + value.slice(-visibleChars);
        }
    };
    MaskSensitiveDataInterceptorImpl = __decorate([
        (0, common_1.Injectable)()
    ], MaskSensitiveDataInterceptorImpl);
    return MaskSensitiveDataInterceptorImpl;
}
function SelectFieldsInterceptor(fields) {
    let SelectFieldsInterceptorImpl = class SelectFieldsInterceptorImpl {
        intercept(context, next) {
            return next.handle().pipe((0, operators_1.map)((data) => this.selectFields(data)));
        }
        selectFields(obj) {
            if (Array.isArray(obj)) {
                return obj.map((item) => this.selectFields(item));
            }
            if (obj !== null && typeof obj === 'object') {
                const result = {};
                fields.forEach((field) => {
                    if (field in obj) {
                        result[field] = obj[field];
                    }
                });
                return result;
            }
            return obj;
        }
    };
    SelectFieldsInterceptorImpl = __decorate([
        (0, common_1.Injectable)()
    ], SelectFieldsInterceptorImpl);
    return SelectFieldsInterceptorImpl;
}
function OmitFieldsInterceptor(fields) {
    let OmitFieldsInterceptorImpl = class OmitFieldsInterceptorImpl {
        intercept(context, next) {
            return next.handle().pipe((0, operators_1.map)((data) => this.omitFields(data)));
        }
        omitFields(obj) {
            if (Array.isArray(obj)) {
                return obj.map((item) => this.omitFields(item));
            }
            if (obj !== null && typeof obj === 'object') {
                const result = {};
                for (const [key, value] of Object.entries(obj)) {
                    if (!fields.includes(key)) {
                        result[key] = this.omitFields(value);
                    }
                }
                return result;
            }
            return obj;
        }
    };
    OmitFieldsInterceptorImpl = __decorate([
        (0, common_1.Injectable)()
    ], OmitFieldsInterceptorImpl);
    return OmitFieldsInterceptorImpl;
}
function CompressionInterceptor(options) {
    let CompressionInterceptorImpl = class CompressionInterceptorImpl {
        threshold = options?.threshold || 1024;
        algorithm = options?.algorithm || 'auto';
        level = options?.level || 6;
        async intercept(context, next) {
            const request = context.switchToHttp().getRequest();
            const response = context.switchToHttp().getResponse();
            return next.handle().pipe((0, operators_1.map)(async (data) => {
                const content = JSON.stringify(data);
                if (content.length < this.threshold) {
                    return data;
                }
                const acceptEncoding = request.headers['accept-encoding'] || '';
                let encoding = null;
                if (this.algorithm === 'auto') {
                    if (acceptEncoding.includes('br')) {
                        encoding = 'br';
                    }
                    else if (acceptEncoding.includes('gzip')) {
                        encoding = 'gzip';
                    }
                }
                else {
                    if ((this.algorithm === 'brotli' && acceptEncoding.includes('br')) ||
                        (this.algorithm === 'gzip' && acceptEncoding.includes('gzip'))) {
                        encoding = this.algorithm === 'brotli' ? 'br' : 'gzip';
                    }
                }
                if (encoding) {
                    let compressed;
                    if (encoding === 'br') {
                        compressed = await brotliCompress(content);
                    }
                    else {
                        compressed = await gzip(content, { level: this.level });
                    }
                    response.setHeader('Content-Encoding', encoding);
                    response.setHeader('Content-Length', compressed.length);
                    return compressed;
                }
                return data;
            }));
        }
    };
    CompressionInterceptorImpl = __decorate([
        (0, common_1.Injectable)()
    ], CompressionInterceptorImpl);
    return CompressionInterceptorImpl;
}
let GzipInterceptor = class GzipInterceptor {
    intercept(context, next) {
        const response = context.switchToHttp().getResponse();
        return next.handle().pipe((0, operators_1.tap)(() => {
            response.setHeader('Content-Encoding', 'gzip');
        }));
    }
};
exports.GzipInterceptor = GzipInterceptor;
exports.GzipInterceptor = GzipInterceptor = __decorate([
    (0, common_1.Injectable)()
], GzipInterceptor);
function CacheControlInterceptor(options) {
    let CacheControlInterceptorImpl = class CacheControlInterceptorImpl {
        intercept(context, next) {
            const response = context.switchToHttp().getResponse();
            return next.handle().pipe((0, operators_1.tap)(() => {
                const { ttl = 0, strategy = 'no-cache', vary = [], etag = false } = options;
                let cacheControl = strategy;
                if (ttl > 0) {
                    cacheControl += `, max-age=${ttl}`;
                }
                response.setHeader('Cache-Control', cacheControl);
                if (vary.length > 0) {
                    response.setHeader('Vary', vary.join(', '));
                }
                if (etag) {
                    const etagValue = this.generateETag(response);
                    response.setHeader('ETag', etagValue);
                }
            }));
        }
        generateETag(response) {
            const crypto = require('crypto');
            const hash = crypto.createHash('md5');
            hash.update(JSON.stringify(response));
            return `"${hash.digest('hex')}"`;
        }
    };
    CacheControlInterceptorImpl = __decorate([
        (0, common_1.Injectable)()
    ], CacheControlInterceptorImpl);
    return CacheControlInterceptorImpl;
}
let NoCacheInterceptor = class NoCacheInterceptor {
    intercept(context, next) {
        const response = context.switchToHttp().getResponse();
        return next.handle().pipe((0, operators_1.tap)(() => {
            response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            response.setHeader('Pragma', 'no-cache');
            response.setHeader('Expires', '0');
        }));
    }
};
exports.NoCacheInterceptor = NoCacheInterceptor;
exports.NoCacheInterceptor = NoCacheInterceptor = __decorate([
    (0, common_1.Injectable)()
], NoCacheInterceptor);
let ETagInterceptor = class ETagInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        return next.handle().pipe((0, operators_1.map)((data) => {
            const crypto = require('crypto');
            const hash = crypto.createHash('md5');
            hash.update(JSON.stringify(data));
            const etag = `"${hash.digest('hex')}"`;
            response.setHeader('ETag', etag);
            const clientETag = request.headers['if-none-match'];
            if (clientETag === etag) {
                response.status(common_1.HttpStatus.NOT_MODIFIED);
                return null;
            }
            return data;
        }));
    }
};
exports.ETagInterceptor = ETagInterceptor;
exports.ETagInterceptor = ETagInterceptor = __decorate([
    (0, common_1.Injectable)()
], ETagInterceptor);
let LastModifiedInterceptor = class LastModifiedInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        return next.handle().pipe((0, operators_1.map)((data) => {
            if (data && typeof data === 'object' && 'updatedAt' in data) {
                const lastModified = new Date(data.updatedAt).toUTCString();
                response.setHeader('Last-Modified', lastModified);
                const ifModifiedSince = request.headers['if-modified-since'];
                if (ifModifiedSince && new Date(ifModifiedSince) >= new Date(data.updatedAt)) {
                    response.status(common_1.HttpStatus.NOT_MODIFIED);
                    return null;
                }
            }
            return data;
        }));
    }
};
exports.LastModifiedInterceptor = LastModifiedInterceptor;
exports.LastModifiedInterceptor = LastModifiedInterceptor = __decorate([
    (0, common_1.Injectable)()
], LastModifiedInterceptor);
let ResponseTimeInterceptor = ResponseTimeInterceptor_1 = class ResponseTimeInterceptor {
    logger = new common_1.Logger(ResponseTimeInterceptor_1.name);
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const startTime = Date.now();
        return next.handle().pipe((0, operators_1.tap)(() => {
            const duration = Date.now() - startTime;
            response.setHeader('X-Response-Time', `${duration}ms`);
            this.logger.log(`${request.method} ${request.url} - ${duration}ms`);
        }));
    }
};
exports.ResponseTimeInterceptor = ResponseTimeInterceptor;
exports.ResponseTimeInterceptor = ResponseTimeInterceptor = ResponseTimeInterceptor_1 = __decorate([
    (0, common_1.Injectable)()
], ResponseTimeInterceptor);
function LoggingInterceptor(options) {
    let LoggingInterceptorImpl = class LoggingInterceptorImpl {
        logger = new common_1.Logger('HTTP');
        intercept(context, next) {
            const request = context.switchToHttp().getRequest();
            const response = context.switchToHttp().getResponse();
            const startTime = Date.now();
            const shouldLog = !options?.excludePaths?.some((path) => request.url.includes(path));
            if (shouldLog && options?.logRequest) {
                this.logRequest(request, options);
            }
            return next.handle().pipe((0, operators_1.tap)((data) => {
                if (shouldLog && options?.logResponse) {
                    const duration = Date.now() - startTime;
                    this.logResponse(request, response, data, duration, options);
                }
            }));
        }
        logRequest(request, options) {
            const logData = {
                method: request.method,
                url: request.url,
                ip: request.ip,
            };
            if (options?.logHeaders) {
                logData.headers = this.sanitizeData(request.headers, options.sensitiveFields);
            }
            if (options?.logBody && request.body) {
                logData.body = this.sanitizeData(request.body, options.sensitiveFields);
            }
            this.logger.log(`Request: ${JSON.stringify(logData)}`);
        }
        logResponse(request, response, data, duration, options) {
            const logData = {
                method: request.method,
                url: request.url,
                statusCode: response.statusCode,
                duration: `${duration}ms`,
            };
            if (options?.logBody) {
                logData.body = this.sanitizeData(data, options.sensitiveFields);
            }
            this.logger.log(`Response: ${JSON.stringify(logData)}`);
        }
        sanitizeData(data, sensitiveFields) {
            if (!sensitiveFields || sensitiveFields.length === 0) {
                return data;
            }
            if (typeof data !== 'object' || data === null) {
                return data;
            }
            const sanitized = Array.isArray(data) ? [...data] : { ...data };
            for (const field of sensitiveFields) {
                if (field in sanitized) {
                    sanitized[field] = '[REDACTED]';
                }
            }
            return sanitized;
        }
    };
    LoggingInterceptorImpl = __decorate([
        (0, common_1.Injectable)()
    ], LoggingInterceptorImpl);
    return LoggingInterceptorImpl;
}
function TimeoutInterceptor(timeoutMs) {
    let TimeoutInterceptorImpl = class TimeoutInterceptorImpl {
        intercept(context, next) {
            return next.handle().pipe((0, operators_1.timeout)(timeoutMs), (0, operators_1.catchError)((err) => {
                if (err.name === 'TimeoutError') {
                    return (0, rxjs_1.throwError)(() => ({
                        statusCode: common_1.HttpStatus.REQUEST_TIMEOUT,
                        message: `Request timeout after ${timeoutMs}ms`,
                    }));
                }
                return (0, rxjs_1.throwError)(() => err);
            }));
        }
    };
    TimeoutInterceptorImpl = __decorate([
        (0, common_1.Injectable)()
    ], TimeoutInterceptorImpl);
    return TimeoutInterceptorImpl;
}
function RetryInterceptor(retries = 3, delay = 1000) {
    let RetryInterceptorImpl = class RetryInterceptorImpl {
        logger = new common_1.Logger('RetryInterceptor');
        intercept(context, next) {
            return next.handle().pipe((0, operators_1.retry)({
                count: retries,
                delay: (error, retryCount) => {
                    this.logger.warn(`Retry attempt ${retryCount} after error: ${error.message}`);
                    return (0, rxjs_1.of)(null).pipe((0, operators_1.tap)(() => setTimeout(() => { }, delay)));
                },
            }));
        }
    };
    RetryInterceptorImpl = __decorate([
        (0, common_1.Injectable)()
    ], RetryInterceptorImpl);
    return RetryInterceptorImpl;
}
function AddHeadersInterceptor(headers) {
    let AddHeadersInterceptorImpl = class AddHeadersInterceptorImpl {
        intercept(context, next) {
            const response = context.switchToHttp().getResponse();
            return next.handle().pipe((0, operators_1.tap)(() => {
                Object.entries(headers).forEach(([key, value]) => {
                    response.setHeader(key, value);
                });
            }));
        }
    };
    AddHeadersInterceptorImpl = __decorate([
        (0, common_1.Injectable)()
    ], AddHeadersInterceptorImpl);
    return AddHeadersInterceptorImpl;
}
function CorsHeadersInterceptor(allowedOrigins, allowedMethods = ['GET', 'POST', 'PUT', 'DELETE']) {
    let CorsHeadersInterceptorImpl = class CorsHeadersInterceptorImpl {
        intercept(context, next) {
            const request = context.switchToHttp().getRequest();
            const response = context.switchToHttp().getResponse();
            return next.handle().pipe((0, operators_1.tap)(() => {
                const origin = request.headers.origin;
                if (origin && (allowedOrigins.includes('*') || allowedOrigins.includes(origin))) {
                    response.setHeader('Access-Control-Allow-Origin', origin);
                    response.setHeader('Access-Control-Allow-Methods', allowedMethods.join(', '));
                    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
                    response.setHeader('Access-Control-Allow-Credentials', 'true');
                }
            }));
        }
    };
    CorsHeadersInterceptorImpl = __decorate([
        (0, common_1.Injectable)()
    ], CorsHeadersInterceptorImpl);
    return CorsHeadersInterceptorImpl;
}
let SecurityHeadersInterceptor = class SecurityHeadersInterceptor {
    intercept(context, next) {
        const response = context.switchToHttp().getResponse();
        return next.handle().pipe((0, operators_1.tap)(() => {
            response.setHeader('X-Content-Type-Options', 'nosniff');
            response.setHeader('X-Frame-Options', 'DENY');
            response.setHeader('X-XSS-Protection', '1; mode=block');
            response.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
            response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
            response.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; object-src 'none'");
        }));
    }
};
exports.SecurityHeadersInterceptor = SecurityHeadersInterceptor;
exports.SecurityHeadersInterceptor = SecurityHeadersInterceptor = __decorate([
    (0, common_1.Injectable)()
], SecurityHeadersInterceptor);
function RateLimitHeadersInterceptor(limit, remaining, reset) {
    let RateLimitHeadersInterceptorImpl = class RateLimitHeadersInterceptorImpl {
        intercept(context, next) {
            const response = context.switchToHttp().getResponse();
            return next.handle().pipe((0, operators_1.tap)(() => {
                response.setHeader('X-RateLimit-Limit', limit.toString());
                response.setHeader('X-RateLimit-Remaining', remaining.toString());
                response.setHeader('X-RateLimit-Reset', reset.toString());
            }));
        }
    };
    RateLimitHeadersInterceptorImpl = __decorate([
        (0, common_1.Injectable)()
    ], RateLimitHeadersInterceptorImpl);
    return RateLimitHeadersInterceptorImpl;
}
let ErrorTransformInterceptor = class ErrorTransformInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.catchError)((error) => {
            const request = context.switchToHttp().getRequest();
            const errorResponse = {
                success: false,
                statusCode: error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: error.name || 'Error',
                message: error.message || 'An error occurred',
                timestamp: new Date().toISOString(),
                path: request.url,
            };
            if (process.env.NODE_ENV === 'development') {
                errorResponse.stack = error.stack;
            }
            return (0, rxjs_1.throwError)(() => errorResponse);
        }));
    }
};
exports.ErrorTransformInterceptor = ErrorTransformInterceptor;
exports.ErrorTransformInterceptor = ErrorTransformInterceptor = __decorate([
    (0, common_1.Injectable)()
], ErrorTransformInterceptor);
let SanitizeErrorInterceptor = class SanitizeErrorInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.catchError)((error) => {
            const sanitized = {
                statusCode: error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while processing your request',
                timestamp: new Date().toISOString(),
            };
            return (0, rxjs_1.throwError)(() => sanitized);
        }));
    }
};
exports.SanitizeErrorInterceptor = SanitizeErrorInterceptor;
exports.SanitizeErrorInterceptor = SanitizeErrorInterceptor = __decorate([
    (0, common_1.Injectable)()
], SanitizeErrorInterceptor);
function HATEOASInterceptor(linkGenerator) {
    let HATEOASInterceptorImpl = class HATEOASInterceptorImpl {
        intercept(context, next) {
            const request = context.switchToHttp().getRequest();
            return next.handle().pipe((0, operators_1.map)((data) => {
                if (!data)
                    return data;
                const links = linkGenerator(data, request);
                if (Array.isArray(data)) {
                    return {
                        data,
                        _links: links,
                    };
                }
                return {
                    ...data,
                    _links: links,
                };
            }));
        }
    };
    HATEOASInterceptorImpl = __decorate([
        (0, common_1.Injectable)()
    ], HATEOASInterceptorImpl);
    return HATEOASInterceptorImpl;
}
let PaginationLinksInterceptor = class PaginationLinksInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        return next.handle().pipe((0, operators_1.map)((data) => {
            if (!data || !data.meta)
                return data;
            const { page, limit, totalPages } = data.meta;
            const baseUrl = `${request.protocol}://${request.get('host')}${request.path}`;
            const links = {
                self: `${baseUrl}?page=${page}&limit=${limit}`,
            };
            if (page > 1) {
                links.first = `${baseUrl}?page=1&limit=${limit}`;
                links.prev = `${baseUrl}?page=${page - 1}&limit=${limit}`;
            }
            if (page < totalPages) {
                links.next = `${baseUrl}?page=${page + 1}&limit=${limit}`;
                links.last = `${baseUrl}?page=${totalPages}&limit=${limit}`;
            }
            return {
                ...data,
                _links: links,
            };
        }));
    }
};
exports.PaginationLinksInterceptor = PaginationLinksInterceptor;
exports.PaginationLinksInterceptor = PaginationLinksInterceptor = __decorate([
    (0, common_1.Injectable)()
], PaginationLinksInterceptor);
function ApiVersionInterceptor(version) {
    let ApiVersionInterceptorImpl = class ApiVersionInterceptorImpl {
        intercept(context, next) {
            const response = context.switchToHttp().getResponse();
            return next.handle().pipe((0, operators_1.tap)(() => {
                response.setHeader('X-API-Version', version);
            }));
        }
    };
    ApiVersionInterceptorImpl = __decorate([
        (0, common_1.Injectable)()
    ], ApiVersionInterceptorImpl);
    return ApiVersionInterceptorImpl;
}
function DeprecationWarningInterceptor(deprecatedSince, removeInVersion, migrateTo) {
    let DeprecationWarningInterceptorImpl = class DeprecationWarningInterceptorImpl {
        logger = new common_1.Logger('DeprecationWarning');
        intercept(context, next) {
            const request = context.switchToHttp().getRequest();
            const response = context.switchToHttp().getResponse();
            this.logger.warn(`Deprecated endpoint accessed: ${request.method} ${request.url}. ` +
                `Deprecated since ${deprecatedSince}, will be removed in ${removeInVersion}.` +
                (migrateTo ? ` Please migrate to ${migrateTo}` : ''));
            return next.handle().pipe((0, operators_1.tap)(() => {
                response.setHeader('X-API-Deprecated', 'true');
                response.setHeader('X-API-Deprecated-Since', deprecatedSince);
                response.setHeader('X-API-Remove-In', removeInVersion);
                if (migrateTo) {
                    response.setHeader('X-API-Migrate-To', migrateTo);
                }
            }));
        }
    };
    DeprecationWarningInterceptorImpl = __decorate([
        (0, common_1.Injectable)()
    ], DeprecationWarningInterceptorImpl);
    return DeprecationWarningInterceptorImpl;
}
let HIPAAAuditInterceptor = class HIPAAAuditInterceptor {
    logger = new common_1.Logger('HIPAAAudit');
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const auditLog = {
            timestamp: new Date().toISOString(),
            userId: user?.id || 'anonymous',
            action: `${request.method} ${request.url}`,
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
        };
        this.logger.log(`HIPAA Audit: ${JSON.stringify(auditLog)}`);
        return next.handle().pipe((0, operators_1.tap)(() => {
            this.logger.log(`HIPAA Audit Complete: ${JSON.stringify(auditLog)}`);
        }));
    }
};
exports.HIPAAAuditInterceptor = HIPAAAuditInterceptor;
exports.HIPAAAuditInterceptor = HIPAAAuditInterceptor = __decorate([
    (0, common_1.Injectable)()
], HIPAAAuditInterceptor);
let PHIMaskingInterceptor = class PHIMaskingInterceptor {
    phiFields = ['ssn', 'medicalRecordNumber', 'dateOfBirth', 'phone', 'email'];
    intercept(context, next) {
        const user = context.switchToHttp().getRequest().user;
        const hasFullAccess = user?.roles?.includes('doctor') || user?.roles?.includes('nurse');
        if (hasFullAccess) {
            return next.handle();
        }
        return next.handle().pipe((0, operators_1.map)((data) => this.maskPHI(data)));
    }
    maskPHI(obj) {
        if (Array.isArray(obj)) {
            return obj.map((item) => this.maskPHI(item));
        }
        if (obj !== null && typeof obj === 'object') {
            const result = {};
            for (const [key, value] of Object.entries(obj)) {
                if (this.phiFields.includes(key)) {
                    result[key] = '[PROTECTED]';
                }
                else {
                    result[key] = this.maskPHI(value);
                }
            }
            return result;
        }
        return obj;
    }
};
exports.PHIMaskingInterceptor = PHIMaskingInterceptor;
exports.PHIMaskingInterceptor = PHIMaskingInterceptor = __decorate([
    (0, common_1.Injectable)()
], PHIMaskingInterceptor);
//# sourceMappingURL=response-interceptor-patterns.service.js.map