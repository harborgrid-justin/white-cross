"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
class BaseController {
    logger;
    constructor(context) {
        this.logger = new common_1.Logger(context || this.constructor.name);
    }
    logInfo(message, context) {
        this.logger.log(message, context);
    }
    logError(message, error, context) {
        this.logger.error(message, error?.stack || error, context);
    }
    logWarning(message, context) {
        this.logger.warn(message, context);
    }
    static getStandardApiResponses() {
        return [
            (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Authentication required' }),
            (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Insufficient permissions' }),
            (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
        ];
    }
    static getNotFoundApiResponse(entityName = 'Resource') {
        return (0, swagger_1.ApiResponse)({ status: 404, description: `${entityName} not found` });
    }
    static getValidationErrorApiResponse() {
        return (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Validation error' });
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=base-controller.js.map