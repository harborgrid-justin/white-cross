"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WsExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsExceptionFilter = exports.WsErrorType = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
var WsErrorType;
(function (WsErrorType) {
    WsErrorType["AUTHENTICATION_FAILED"] = "AUTHENTICATION_FAILED";
    WsErrorType["AUTHORIZATION_FAILED"] = "AUTHORIZATION_FAILED";
    WsErrorType["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    WsErrorType["RATE_LIMIT_EXCEEDED"] = "RATE_LIMIT_EXCEEDED";
    WsErrorType["RESOURCE_NOT_FOUND"] = "RESOURCE_NOT_FOUND";
    WsErrorType["CONFLICT"] = "CONFLICT";
    WsErrorType["INTERNAL_ERROR"] = "INTERNAL_ERROR";
    WsErrorType["BAD_REQUEST"] = "BAD_REQUEST";
    WsErrorType["SERVICE_UNAVAILABLE"] = "SERVICE_UNAVAILABLE";
})(WsErrorType || (exports.WsErrorType = WsErrorType = {}));
let WsExceptionFilter = WsExceptionFilter_1 = class WsExceptionFilter extends websockets_1.BaseWsExceptionFilter {
    logger = new common_1.Logger(WsExceptionFilter_1.name);
    catch(exception, host) {
        const client = host.switchToWs().getClient();
        const pattern = host.switchToWs().getPattern();
        const userId = client.user?.userId || 'anonymous';
        const organizationId = client.user?.organizationId || 'unknown';
        const errorResponse = this.buildErrorResponse(exception);
        this.logError(exception, {
            socketId: client.id,
            userId,
            organizationId,
            pattern,
            errorType: errorResponse.type,
        });
        client.emit('error', errorResponse);
        if (this.shouldDisconnect(exception)) {
            this.logger.warn(`Disconnecting client ${client.id} (user: ${userId}) due to critical error`);
            client.disconnect();
        }
    }
    buildErrorResponse(exception) {
        const timestamp = new Date().toISOString();
        if (exception instanceof websockets_1.WsException) {
            const error = exception.getError();
            if (typeof error === 'string') {
                return {
                    type: WsErrorType.BAD_REQUEST,
                    message: error,
                    timestamp,
                };
            }
            if (typeof error === 'object' && error !== null) {
                const errorObj = error;
                return {
                    type: errorObj.type || WsErrorType.BAD_REQUEST,
                    message: errorObj.message || 'An error occurred',
                    timestamp,
                    details: errorObj.details,
                };
            }
        }
        if (exception instanceof Error) {
            const errorType = this.mapErrorType(exception);
            const message = process.env.NODE_ENV === 'production'
                ? this.getSafeErrorMessage(errorType)
                : exception.message;
            return {
                type: errorType,
                message,
                timestamp,
            };
        }
        return {
            type: WsErrorType.INTERNAL_ERROR,
            message: process.env.NODE_ENV === 'production'
                ? 'An unexpected error occurred'
                : String(exception),
            timestamp,
        };
    }
    mapErrorType(error) {
        const message = error.message.toLowerCase();
        if (message.includes('authentication') || message.includes('token')) {
            return WsErrorType.AUTHENTICATION_FAILED;
        }
        if (message.includes('authorization') || message.includes('permission')) {
            return WsErrorType.AUTHORIZATION_FAILED;
        }
        if (message.includes('validation') || message.includes('invalid')) {
            return WsErrorType.VALIDATION_ERROR;
        }
        if (message.includes('rate limit')) {
            return WsErrorType.RATE_LIMIT_EXCEEDED;
        }
        if (message.includes('not found')) {
            return WsErrorType.RESOURCE_NOT_FOUND;
        }
        if (message.includes('conflict') || message.includes('already exists')) {
            return WsErrorType.CONFLICT;
        }
        if (message.includes('unavailable') || message.includes('timeout')) {
            return WsErrorType.SERVICE_UNAVAILABLE;
        }
        return WsErrorType.INTERNAL_ERROR;
    }
    getSafeErrorMessage(errorType) {
        const messages = {
            [WsErrorType.AUTHENTICATION_FAILED]: 'Authentication required',
            [WsErrorType.AUTHORIZATION_FAILED]: 'Access denied',
            [WsErrorType.VALIDATION_ERROR]: 'Invalid request data',
            [WsErrorType.RATE_LIMIT_EXCEEDED]: 'Too many requests. Please slow down',
            [WsErrorType.RESOURCE_NOT_FOUND]: 'Resource not found',
            [WsErrorType.CONFLICT]: 'Request conflicts with current state',
            [WsErrorType.INTERNAL_ERROR]: 'An unexpected error occurred',
            [WsErrorType.BAD_REQUEST]: 'Bad request',
            [WsErrorType.SERVICE_UNAVAILABLE]: 'Service temporarily unavailable',
        };
        return messages[errorType] || 'An error occurred';
    }
    logError(exception, context) {
        const logContext = {
            socketId: context.socketId,
            userId: context.userId,
            organizationId: context.organizationId,
            pattern: context.pattern,
            errorType: context.errorType,
        };
        if (exception instanceof Error) {
            this.logger.error(`WebSocket Error: ${exception.message}`, exception.stack, JSON.stringify(logContext));
        }
        else {
            this.logger.error(`WebSocket Error: ${String(exception)}`, JSON.stringify(logContext));
        }
        if (process.env.NODE_ENV === 'production') {
        }
    }
    shouldDisconnect(exception) {
        if (exception instanceof Error) {
            const message = exception.message.toLowerCase();
            if (message.includes('authentication') ||
                message.includes('invalid token') ||
                message.includes('token expired')) {
                return true;
            }
        }
        return false;
    }
};
exports.WsExceptionFilter = WsExceptionFilter;
exports.WsExceptionFilter = WsExceptionFilter = WsExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], WsExceptionFilter);
//# sourceMappingURL=ws-exception.filter.js.map