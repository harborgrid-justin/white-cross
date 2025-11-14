"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedDiscoveryAccessException = exports.RateLimitExceededException = exports.InvalidProviderTypeException = exports.DiscoveryOperationException = exports.InvalidMetadataException = exports.ControllerNotFoundException = exports.ProviderNotFoundException = void 0;
const common_1 = require("@nestjs/common");
class ProviderNotFoundException extends common_1.HttpException {
    constructor(providerToken) {
        super({
            statusCode: common_1.HttpStatus.NOT_FOUND,
            error: 'Provider Not Found',
            message: `Provider with token '${providerToken}' was not found`,
            module: 'discovery',
            errorCode: 'PROVIDER_NOT_FOUND',
        }, common_1.HttpStatus.NOT_FOUND);
    }
}
exports.ProviderNotFoundException = ProviderNotFoundException;
class ControllerNotFoundException extends common_1.HttpException {
    constructor(controllerName) {
        super({
            statusCode: common_1.HttpStatus.NOT_FOUND,
            error: 'Controller Not Found',
            message: `Controller '${controllerName}' was not found`,
            module: 'discovery',
            errorCode: 'CONTROLLER_NOT_FOUND',
        }, common_1.HttpStatus.NOT_FOUND);
    }
}
exports.ControllerNotFoundException = ControllerNotFoundException;
class InvalidMetadataException extends common_1.HttpException {
    constructor(metadataKey) {
        super({
            statusCode: common_1.HttpStatus.BAD_REQUEST,
            error: 'Invalid Metadata',
            message: `Invalid metadata key '${metadataKey}' provided`,
            module: 'discovery',
            errorCode: 'INVALID_METADATA_KEY',
        }, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.InvalidMetadataException = InvalidMetadataException;
class DiscoveryOperationException extends common_1.HttpException {
    constructor(operation, reason) {
        super({
            statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Discovery Operation Failed',
            message: `Failed to ${operation}: ${reason}`,
            module: 'discovery',
            errorCode: 'DISCOVERY_OPERATION_FAILED',
        }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
exports.DiscoveryOperationException = DiscoveryOperationException;
class InvalidProviderTypeException extends common_1.HttpException {
    constructor(invalidType, validTypes) {
        super({
            statusCode: common_1.HttpStatus.BAD_REQUEST,
            error: 'Invalid Provider Type',
            message: `Invalid provider type '${invalidType}'. Valid types are: ${validTypes.join(', ')}`,
            module: 'discovery',
            errorCode: 'INVALID_PROVIDER_TYPE',
        }, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.InvalidProviderTypeException = InvalidProviderTypeException;
class RateLimitExceededException extends common_1.HttpException {
    constructor(limit, windowMs, identifier) {
        super({
            statusCode: common_1.HttpStatus.TOO_MANY_REQUESTS,
            error: 'Rate Limit Exceeded',
            message: `Rate limit of ${limit} requests per ${windowMs}ms exceeded for identifier: ${identifier}`,
            module: 'discovery',
            errorCode: 'RATE_LIMIT_EXCEEDED',
            retryAfter: windowMs,
        }, common_1.HttpStatus.TOO_MANY_REQUESTS);
    }
}
exports.RateLimitExceededException = RateLimitExceededException;
class UnauthorizedDiscoveryAccessException extends common_1.HttpException {
    constructor(endpoint, requiredRole) {
        super({
            statusCode: common_1.HttpStatus.FORBIDDEN,
            error: 'Unauthorized Access',
            message: `Access denied to discovery endpoint '${endpoint}'${requiredRole ? `. Required role: ${requiredRole}` : ''}`,
            module: 'discovery',
            errorCode: 'UNAUTHORIZED_DISCOVERY_ACCESS',
        }, common_1.HttpStatus.FORBIDDEN);
    }
}
exports.UnauthorizedDiscoveryAccessException = UnauthorizedDiscoveryAccessException;
//# sourceMappingURL=discovery.exceptions.js.map