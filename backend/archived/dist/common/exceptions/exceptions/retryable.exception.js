"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalServiceException = exports.TimeoutException = exports.DatabaseException = exports.RetryableException = void 0;
exports.isRetryable = isRetryable;
const common_1 = require("@nestjs/common");
const error_codes_1 = require("../constants/error-codes");
class RetryableException extends common_1.HttpException {
    errorCode;
    context;
    isRetryable = true;
    timestamp;
    innerError;
    constructor(message, errorCode = error_codes_1.SystemErrorCodes.INTERNAL_SERVER_ERROR, context = {}, statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR, innerError) {
        const response = {
            success: false,
            error: 'Retryable Error',
            message,
            errorCode,
            context,
            isRetryable: true,
        };
        super(response, statusCode);
        this.errorCode = errorCode;
        this.context = context;
        this.timestamp = new Date();
        this.innerError = innerError;
        this.name = 'RetryableException';
    }
    toJSON() {
        return {
            name: this.name,
            errorCode: this.errorCode,
            message: this.message,
            context: this.context,
            isRetryable: this.isRetryable,
            timestamp: this.timestamp.toISOString(),
            innerError: this.innerError
                ? {
                    name: this.innerError.name,
                    message: this.innerError.message,
                }
                : undefined,
            stack: process.env.NODE_ENV === 'development' ? this.stack : undefined,
        };
    }
}
exports.RetryableException = RetryableException;
class DatabaseException extends RetryableException {
    operation;
    originalError;
    constructor(operation, originalError, context = {}) {
        const message = `Database error during ${operation}`;
        const fullContext = {
            operation,
            originalError: originalError.message,
            originalErrorName: originalError.name,
            ...context,
        };
        super(message, error_codes_1.SystemErrorCodes.DATABASE_ERROR, fullContext, common_1.HttpStatus.INTERNAL_SERVER_ERROR, originalError);
        this.operation = operation;
        this.originalError = originalError;
        this.name = 'DatabaseException';
    }
    isConnectionError() {
        const errorName = this.originalError.name.toLowerCase();
        return (errorName.includes('connection') ||
            errorName.includes('econnrefused') ||
            errorName.includes('enotfound'));
    }
    isTimeoutError() {
        const errorName = this.originalError.name.toLowerCase();
        const errorMsg = this.originalError.message.toLowerCase();
        return (errorName.includes('timeout') ||
            errorMsg.includes('timeout') ||
            errorMsg.includes('timed out'));
    }
    isLockError() {
        const errorMsg = this.originalError.message.toLowerCase();
        return (errorMsg.includes('lock') ||
            errorMsg.includes('deadlock') ||
            errorMsg.includes('could not obtain lock'));
    }
}
exports.DatabaseException = DatabaseException;
class TimeoutException extends RetryableException {
    operation;
    timeout;
    constructor(operation, timeout, context = {}) {
        const message = `Operation '${operation}' timed out after ${timeout}ms`;
        const fullContext = { operation, timeout, ...context };
        super(message, error_codes_1.SystemErrorCodes.TIMEOUT, fullContext, common_1.HttpStatus.REQUEST_TIMEOUT);
        this.operation = operation;
        this.timeout = timeout;
        this.name = 'TimeoutException';
    }
}
exports.TimeoutException = TimeoutException;
class ExternalServiceException extends RetryableException {
    service;
    endpoint;
    constructor(service, message, context = {}, endpoint) {
        const fullContext = { service, endpoint, ...context };
        super(message, error_codes_1.SystemErrorCodes.EXTERNAL_SERVICE_ERROR, fullContext, common_1.HttpStatus.BAD_GATEWAY);
        this.service = service;
        this.endpoint = endpoint;
        this.name = 'ExternalServiceException';
    }
}
exports.ExternalServiceException = ExternalServiceException;
function isRetryable(error) {
    if (error instanceof RetryableException) {
        return error.isRetryable;
    }
    if (error instanceof common_1.HttpException) {
        const response = error.getResponse();
        if (typeof response === 'object' && 'isRetryable' in response) {
            return response.isRetryable === true;
        }
    }
    return false;
}
//# sourceMappingURL=retryable.exception.js.map