"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessException = void 0;
const common_1 = require("@nestjs/common");
const error_codes_1 = require("../constants/error-codes");
class BusinessException extends common_1.HttpException {
    errorCode;
    rule;
    context;
    isRetryable;
    timestamp;
    constructor(message, errorCode = error_codes_1.ErrorCodes.OPERATION_NOT_ALLOWED, context, rule, isRetryable = false) {
        const response = {
            success: false,
            error: 'Business Logic Error',
            message,
            errorCode,
            rule,
            context,
        };
        super(response, common_1.HttpStatus.BAD_REQUEST);
        this.errorCode = errorCode;
        this.rule = rule;
        this.context = context;
        this.isRetryable = isRetryable;
        this.timestamp = new Date();
        this.name = 'BusinessException';
    }
    static notFound(resource, identifier) {
        const message = identifier
            ? `${resource} with identifier '${identifier}' not found`
            : `${resource} not found`;
        return new BusinessException(message, error_codes_1.ErrorCodes.RESOURCE_NOT_FOUND, {
            resource,
            identifier,
        });
    }
    static alreadyExists(resource, identifier) {
        const message = identifier
            ? `${resource} with identifier '${identifier}' already exists`
            : `${resource} already exists`;
        return new BusinessException(message, error_codes_1.ErrorCodes.RESOURCE_ALREADY_EXISTS, {
            resource,
            identifier,
        });
    }
    static invalidStateTransition(resource, currentState, targetState) {
        return new BusinessException(`Cannot transition ${resource} from ${currentState} to ${targetState}`, error_codes_1.ErrorCodes.INVALID_STATE_TRANSITION, { resource, currentState, targetState });
    }
    static dependencyExists(resource, dependency, count) {
        const message = count
            ? `Cannot delete ${resource}: ${count} ${dependency} exist`
            : `Cannot delete ${resource}: ${dependency} exist`;
        return new BusinessException(message, error_codes_1.ErrorCodes.DEPENDENCY_EXISTS, {
            resource,
            dependency,
            count,
        });
    }
    static dependencyMissing(resource, dependency) {
        return new BusinessException(`Cannot create ${resource}: required ${dependency} not found`, error_codes_1.ErrorCodes.DEPENDENCY_MISSING, { resource, dependency });
    }
    static quotaExceeded(resource, limit, current) {
        return new BusinessException(`${resource} quota exceeded: ${current}/${limit}`, error_codes_1.ErrorCodes.QUOTA_EXCEEDED, { resource, limit, current });
    }
    static concurrentModification(resource) {
        return new BusinessException(`${resource} was modified by another user. Please refresh and try again.`, error_codes_1.ErrorCodes.CONCURRENT_MODIFICATION, { resource });
    }
}
exports.BusinessException = BusinessException;
//# sourceMappingURL=business.exception.js.map