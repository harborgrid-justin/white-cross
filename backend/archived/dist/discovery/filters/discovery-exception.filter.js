"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DiscoveryExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoveryExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let DiscoveryExceptionFilter = DiscoveryExceptionFilter_1 = class DiscoveryExceptionFilter {
    logger = new common_1.Logger(DiscoveryExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status;
        let errorResponse;
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (status === common_1.HttpStatus.BAD_REQUEST &&
                this.isValidationError(exceptionResponse)) {
                errorResponse = this.createValidationErrorResponse(exceptionResponse, request);
            }
            else {
                errorResponse = this.createHttpExceptionResponse(exceptionResponse, request);
            }
        }
        else {
            status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            errorResponse = this.createInternalServerErrorResponse(exception, request);
        }
        this.logError(exception, request, status);
        if (status === common_1.HttpStatus.TOO_MANY_REQUESTS && errorResponse.retryAfter) {
            response.setHeader('Retry-After', Math.ceil(errorResponse.retryAfter / 1000));
            response.setHeader('X-RateLimit-Reset', Date.now() + errorResponse.retryAfter);
        }
        response.status(status).json(errorResponse);
    }
    isValidationError(exceptionResponse) {
        return (typeof exceptionResponse === 'object' &&
            exceptionResponse.message &&
            Array.isArray(exceptionResponse.message));
    }
    createValidationErrorResponse(exceptionResponse, request) {
        return {
            statusCode: common_1.HttpStatus.BAD_REQUEST,
            error: 'Validation Failed',
            message: 'Input validation failed',
            module: 'discovery',
            timestamp: new Date().toISOString(),
            path: request.url,
            correlationId: this.getCorrelationId(request),
            errorCode: 'VALIDATION_FAILED',
            validationErrors: Array.isArray(exceptionResponse.message)
                ? exceptionResponse.message
                : [exceptionResponse.message],
        };
    }
    createHttpExceptionResponse(exceptionResponse, request) {
        if (typeof exceptionResponse === 'object') {
            return {
                ...exceptionResponse,
                timestamp: new Date().toISOString(),
                path: request.url,
                correlationId: this.getCorrelationId(request),
            };
        }
        return {
            statusCode: common_1.HttpStatus.BAD_REQUEST,
            error: 'Bad Request',
            message: exceptionResponse,
            module: 'discovery',
            timestamp: new Date().toISOString(),
            path: request.url,
            correlationId: this.getCorrelationId(request),
        };
    }
    createInternalServerErrorResponse(exception, request) {
        return {
            statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal Server Error',
            message: 'An unexpected error occurred during discovery operation',
            module: 'discovery',
            timestamp: new Date().toISOString(),
            path: request.url,
            correlationId: this.getCorrelationId(request),
            errorCode: 'INTERNAL_SERVER_ERROR',
        };
    }
    getCorrelationId(request) {
        return (request.headers['x-correlation-id'] ||
            request.headers['x-request-id'] ||
            `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    }
    logError(exception, request, status) {
        const { method, url, ip, headers } = request;
        const userAgent = headers['user-agent'] || 'Unknown';
        const correlationId = this.getCorrelationId(request);
        const logContext = {
            method,
            url,
            ip,
            userAgent,
            correlationId,
            statusCode: status,
        };
        if (status >= 500) {
            this.logger.error(`Discovery API Server Error: ${method} ${url}`, exception instanceof Error ? exception.stack : exception, logContext);
        }
        else if (status >= 400) {
            this.logger.warn(`Discovery API Client Error: ${method} ${url}`, exception instanceof Error ? exception.message : exception, logContext);
        }
    }
};
exports.DiscoveryExceptionFilter = DiscoveryExceptionFilter;
exports.DiscoveryExceptionFilter = DiscoveryExceptionFilter = DiscoveryExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], DiscoveryExceptionFilter);
//# sourceMappingURL=discovery-exception.filter.js.map