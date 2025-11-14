"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerUtilities = void 0;
exports.ApiTagsAndAuth = ApiTagsAndAuth;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
class ControllerUtilities {
    static createControllerLogger(controllerName) {
        return new common_1.Logger(controllerName);
    }
    static createSuccessResponse(data, message, path) {
        return {
            success: true,
            data,
            message: message || 'Operation completed successfully',
            timestamp: new Date().toISOString(),
            path: path || '',
        };
    }
    static createErrorResponse(error, message, path) {
        return {
            success: false,
            error,
            message: message || 'Operation failed',
            timestamp: new Date().toISOString(),
            path: path || '',
        };
    }
    static handleControllerError(logger, error, operation, req) {
        const errorMessage = error.message || 'Unknown error occurred';
        const logMessage = `Error in ${operation}: ${errorMessage}`;
        logger.error(logMessage, error);
        return this.createErrorResponse(errorMessage, `Failed to ${operation}`, req.path);
    }
    static logControllerSuccess(logger, operation, additionalInfo) {
        const additional = additionalInfo
            ? ` - ${Object.entries(additionalInfo).map(([k, v]) => `${k}: ${v}`).join(', ')}`
            : '';
        logger.log(`Successfully completed ${operation}${additional}`);
    }
    static validatePaginationParams(params) {
        return {
            page: Math.max(1, params.page || 1),
            limit: Math.min(100, Math.max(1, params.limit || 10)),
            sortBy: params.sortBy,
            sortOrder: params.sortOrder === 'DESC' ? 'DESC' : 'ASC',
        };
    }
    static getSwaggerDecorators() {
        return {
            getAll: (entityName, description) => [
                (0, swagger_1.ApiOperation)({
                    summary: `Get all ${entityName}s`,
                    description: description || `Retrieve a paginated list of ${entityName}s`,
                }),
                (0, swagger_1.ApiResponse)({
                    status: 200,
                    description: `Successfully retrieved ${entityName}s`,
                }),
                (0, swagger_1.ApiResponse)({
                    status: 400,
                    description: 'Bad request - invalid parameters',
                }),
                (0, swagger_1.ApiResponse)({
                    status: 401,
                    description: 'Unauthorized - authentication required',
                }),
                (0, swagger_1.ApiResponse)({
                    status: 500,
                    description: 'Internal server error',
                }),
                (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number' }),
                (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page' }),
                (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, type: String, description: 'Sort field' }),
                (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Sort order' }),
                (0, swagger_1.ApiBearerAuth)(),
            ],
            getById: (entityName, description) => [
                (0, swagger_1.ApiOperation)({
                    summary: `Get ${entityName} by ID`,
                    description: description || `Retrieve a specific ${entityName} by its ID`,
                }),
                (0, swagger_1.ApiResponse)({
                    status: 200,
                    description: `Successfully retrieved ${entityName}`,
                }),
                (0, swagger_1.ApiResponse)({
                    status: 400,
                    description: 'Bad request - invalid ID format',
                }),
                (0, swagger_1.ApiResponse)({
                    status: 401,
                    description: 'Unauthorized - authentication required',
                }),
                (0, swagger_1.ApiResponse)({
                    status: 404,
                    description: `${entityName} not found`,
                }),
                (0, swagger_1.ApiResponse)({
                    status: 500,
                    description: 'Internal server error',
                }),
                (0, swagger_1.ApiParam)({ name: 'id', type: String, description: `${entityName} ID` }),
                (0, swagger_1.ApiBearerAuth)(),
            ],
            create: (entityName, dtoClass, description) => [
                (0, swagger_1.ApiOperation)({
                    summary: `Create ${entityName}`,
                    description: description || `Create a new ${entityName}`,
                }),
                (0, swagger_1.ApiResponse)({
                    status: 201,
                    description: `Successfully created ${entityName}`,
                }),
                (0, swagger_1.ApiResponse)({
                    status: 400,
                    description: 'Bad request - validation failed',
                }),
                (0, swagger_1.ApiResponse)({
                    status: 401,
                    description: 'Unauthorized - authentication required',
                }),
                (0, swagger_1.ApiResponse)({
                    status: 409,
                    description: 'Conflict - resource already exists',
                }),
                (0, swagger_1.ApiResponse)({
                    status: 500,
                    description: 'Internal server error',
                }),
                ...(dtoClass ? [(0, swagger_1.ApiBody)({ type: dtoClass })] : []),
                (0, swagger_1.ApiBearerAuth)(),
            ],
            update: (entityName, dtoClass, description) => [
                (0, swagger_1.ApiOperation)({
                    summary: `Update ${entityName}`,
                    description: description || `Update an existing ${entityName}`,
                }),
                (0, swagger_1.ApiResponse)({
                    status: 200,
                    description: `Successfully updated ${entityName}`,
                }),
                (0, swagger_1.ApiResponse)({
                    status: 400,
                    description: 'Bad request - validation failed',
                }),
                (0, swagger_1.ApiResponse)({
                    status: 401,
                    description: 'Unauthorized - authentication required',
                }),
                (0, swagger_1.ApiResponse)({
                    status: 404,
                    description: `${entityName} not found`,
                }),
                (0, swagger_1.ApiResponse)({
                    status: 500,
                    description: 'Internal server error',
                }),
                (0, swagger_1.ApiParam)({ name: 'id', type: String, description: `${entityName} ID` }),
                ...(dtoClass ? [(0, swagger_1.ApiBody)({ type: dtoClass })] : []),
                (0, swagger_1.ApiBearerAuth)(),
            ],
            delete: (entityName, description) => [
                (0, swagger_1.ApiOperation)({
                    summary: `Delete ${entityName}`,
                    description: description || `Delete a ${entityName} by ID`,
                }),
                (0, swagger_1.ApiResponse)({
                    status: 200,
                    description: `Successfully deleted ${entityName}`,
                }),
                (0, swagger_1.ApiResponse)({
                    status: 401,
                    description: 'Unauthorized - authentication required',
                }),
                (0, swagger_1.ApiResponse)({
                    status: 404,
                    description: `${entityName} not found`,
                }),
                (0, swagger_1.ApiResponse)({
                    status: 500,
                    description: 'Internal server error',
                }),
                (0, swagger_1.ApiParam)({ name: 'id', type: String, description: `${entityName} ID` }),
                (0, swagger_1.ApiBearerAuth)(),
            ],
        };
    }
    static async executeEndpoint(operation, logger, operationName, req) {
        try {
            logger.debug(`Starting ${operationName}`);
            const result = await operation();
            this.logControllerSuccess(logger, operationName);
            return this.createSuccessResponse(result, undefined, req.path);
        }
        catch (error) {
            return this.handleControllerError(logger, error, operationName, req);
        }
    }
    static validateUuidParam(id, paramName = 'id') {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            throw new Error(`Invalid ${paramName} format. Must be a valid UUID.`);
        }
    }
    static validateSearchParams(searchTerm, minLength = 2) {
        if (!searchTerm)
            return undefined;
        const trimmed = searchTerm.trim();
        if (trimmed.length < minLength) {
            throw new Error(`Search term must be at least ${minLength} characters long`);
        }
        return trimmed;
    }
    static validateDateRange(startDate, endDate) {
        const result = {};
        if (startDate) {
            result.startDate = new Date(startDate);
            if (isNaN(result.startDate.getTime())) {
                throw new Error('Invalid start date format');
            }
        }
        if (endDate) {
            result.endDate = new Date(endDate);
            if (isNaN(result.endDate.getTime())) {
                throw new Error('Invalid end date format');
            }
        }
        if (result.startDate && result.endDate && result.startDate > result.endDate) {
            throw new Error('Start date must be before end date');
        }
        return result;
    }
    static createHealthCheckResponse(serviceName, version) {
        return this.createSuccessResponse({
            service: serviceName,
            status: 'healthy',
            version: version || '1.0.0',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
        }, 'Service is healthy');
    }
    static setRateLimitHeaders(res, limit, remaining, resetTime) {
        res.setHeader('X-RateLimit-Limit', limit.toString());
        res.setHeader('X-RateLimit-Remaining', remaining.toString());
        res.setHeader('X-RateLimit-Reset', resetTime.toISOString());
    }
    static setCorsHeaders(res, allowedOrigins = ['*']) {
        const origin = allowedOrigins.includes('*') ? '*' : allowedOrigins.join(',');
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
}
exports.ControllerUtilities = ControllerUtilities;
function ApiTagsAndAuth(tags) {
    return function (constructor) {
        (0, swagger_1.ApiTags)(...tags)(constructor);
        (0, swagger_1.ApiBearerAuth)()(constructor);
        return constructor;
    };
}
//# sourceMappingURL=controller-utilities.js.map