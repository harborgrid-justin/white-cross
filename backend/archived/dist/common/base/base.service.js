"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const request_context_service_1 = require("../context/request-context.service");
const pagination_1 = require("../../database/pagination");
const commonValidators_1 = require("../validation/commonValidators");
const sequelize_1 = require("sequelize");
var ValidationErrorCode;
(function (ValidationErrorCode) {
    ValidationErrorCode["REQUIRED_FIELD"] = "REQUIRED_FIELD";
    ValidationErrorCode["INVALID_TYPE"] = "INVALID_TYPE";
    ValidationErrorCode["INVALID_VALUE"] = "INVALID_VALUE";
    ValidationErrorCode["TOO_SHORT"] = "TOO_SHORT";
    ValidationErrorCode["TOO_LONG"] = "TOO_LONG";
    ValidationErrorCode["TOO_SMALL"] = "TOO_SMALL";
    ValidationErrorCode["TOO_LARGE"] = "TOO_LARGE";
    ValidationErrorCode["INVALID_FORMAT"] = "INVALID_FORMAT";
    ValidationErrorCode["DUPLICATE_VALUE"] = "DUPLICATE_VALUE";
    ValidationErrorCode["INVALID_REFERENCE"] = "INVALID_REFERENCE";
    ValidationErrorCode["PERMISSION_DENIED"] = "PERMISSION_DENIED";
    ValidationErrorCode["BUSINESS_RULE_VIOLATION"] = "BUSINESS_RULE_VIOLATION";
})(ValidationErrorCode || (ValidationErrorCode = {}));
let BaseService = class BaseService {
    logger;
    options;
    serviceName;
    tableName;
    paginationConstraints;
    enableAuditLogging;
    requestContext;
    constructor(requestContextOrOptions, options) {
        if (typeof requestContextOrOptions === 'string') {
            this.options = {
                serviceName: requestContextOrOptions,
                autoLogErrors: true,
                includeStackTrace: true,
                paginationConstraints: {},
                enableAuditLogging: true,
                logger: undefined,
            };
        }
        else if (requestContextOrOptions instanceof request_context_service_1.RequestContextService) {
            this.requestContext = requestContextOrOptions;
            this.options = {
                serviceName: options?.serviceName || this.constructor.name,
                autoLogErrors: options?.autoLogErrors ?? true,
                includeStackTrace: options?.includeStackTrace ?? true,
                tableName: options?.tableName,
                paginationConstraints: options?.paginationConstraints || {},
                enableAuditLogging: options?.enableAuditLogging ?? true,
                logger: options?.logger,
            };
        }
        else if (requestContextOrOptions && typeof requestContextOrOptions === 'object' && 'logger' in requestContextOrOptions) {
            const config = requestContextOrOptions;
            this.options = {
                serviceName: config.serviceName,
                autoLogErrors: true,
                includeStackTrace: true,
                tableName: config.tableName,
                paginationConstraints: config.paginationConstraints || {},
                enableAuditLogging: config.enableAuditLogging ?? true,
                logger: config.logger,
            };
        }
        else {
            const opts = requestContextOrOptions;
            this.options = {
                serviceName: opts?.serviceName || this.constructor.name,
                autoLogErrors: opts?.autoLogErrors ?? true,
                includeStackTrace: opts?.includeStackTrace ?? true,
                tableName: opts?.tableName,
                paginationConstraints: opts?.paginationConstraints || {},
                enableAuditLogging: opts?.enableAuditLogging ?? true,
                logger: opts?.logger,
            };
        }
        this.serviceName = this.options.serviceName;
        this.tableName = this.options.tableName;
        this.paginationConstraints = this.options.paginationConstraints;
        this.enableAuditLogging = this.options.enableAuditLogging;
        if (this.options.logger) {
            this.logger = this.options.logger;
        }
        else {
            this.logger = new common_1.Logger(this.serviceName);
        }
    }
    logInfo(message, context) {
        if (this.logger instanceof common_1.Logger) {
            this.logger.log(message, context);
        }
        else {
            this.logger.log(`[${this.serviceName}] ${message}`, 'BaseService');
        }
    }
    logError(message, trace, context) {
        if (this.logger instanceof common_1.Logger) {
            this.logger.error(message, trace, context);
        }
        else {
            this.logger.error(`[${this.serviceName}] ${message}`, trace, 'BaseService');
        }
    }
    logWarning(message, context) {
        if (this.logger instanceof common_1.Logger) {
            this.logger.warn(message, context);
        }
        else {
            this.logger.warn(`[${this.serviceName}] ${message}`, 'BaseService');
        }
    }
    logDebug(message, context) {
        if (this.logger instanceof common_1.Logger) {
            this.logger.debug(message, context);
        }
        else {
            this.logger.debug(`[${this.serviceName}] ${message}`, 'BaseService');
        }
    }
    logVerbose(message, context) {
        if (this.logger instanceof common_1.Logger) {
            this.logger.verbose(message, context);
        }
        else {
            this.logger.debug(`[${this.serviceName}] ${message}`, 'BaseService');
        }
    }
    handleError(error, operation, context) {
        const errorMessage = `Failed to ${operation}: ${error instanceof Error ? error.message : String(error)}`;
        this.logError(errorMessage, error instanceof Error ? error.stack : undefined, context);
        throw error;
    }
    handleErrorHipaa(message, error) {
        const context = {
            ...(this.requestContext?.getLogContext() || {}),
            message,
            errorType: error instanceof Error ? error.constructor.name : 'Unknown',
        };
        if (this.options.autoLogErrors) {
            if (this.options.includeStackTrace && error instanceof Error && error.stack) {
                this.logError(`${message}: ${error.message}`, error.stack, JSON.stringify(context));
            }
            else {
                this.logError(`${message}: ${error instanceof Error ? error.message : String(error)}`, undefined, JSON.stringify(context));
            }
        }
        if (error instanceof common_1.BadRequestException ||
            error instanceof common_1.NotFoundException ||
            error instanceof common_1.InternalServerErrorException) {
            throw error;
        }
        throw new common_1.InternalServerErrorException(message || 'An unexpected error occurred');
    }
    handleErrorLegacy(operation, error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        this.logError(`Error in ${operation}`, error);
        let clientMessage = errorMessage;
        if (error && typeof error === 'object' && 'name' in error) {
            const errorName = error.name;
            if (errorName === 'SequelizeConnectionError') {
                clientMessage = 'Database connection error. Please try again later.';
            }
            else if (errorName === 'SequelizeValidationError') {
                const errors = error.errors;
                clientMessage = `Validation failed: ${errors?.map((e) => e.message).join(', ') || 'Unknown validation error'}`;
            }
            else if (errorName === 'SequelizeUniqueConstraintError') {
                clientMessage = 'A record with this information already exists.';
            }
        }
        return {
            success: false,
            error: clientMessage,
        };
    }
    validateRequired(params, operation) {
        const missing = Object.entries(params)
            .filter(([, value]) => value === undefined || value === null)
            .map(([key]) => key);
        if (missing.length > 0) {
            const error = new Error(`Missing required parameters for ${operation}: ${missing.join(', ')}`);
            this.handleError(error, operation);
        }
    }
    validateUUID(id, fieldName = 'ID') {
        if (!(0, uuid_1.validate)(id)) {
            throw new common_1.BadRequestException(`Invalid ${fieldName} format`);
        }
    }
    validateRequiredField(value, fieldName) {
        if (value === undefined || value === null || value === '') {
            throw new common_1.BadRequestException(`${fieldName} is required`);
        }
    }
    validateNotFuture(date, fieldName) {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        if (dateObj > new Date()) {
            throw new common_1.BadRequestException(`${fieldName} cannot be in the future`);
        }
    }
    validateNotPast(date, fieldName) {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        if (dateObj < new Date()) {
            throw new common_1.BadRequestException(`${fieldName} cannot be in the past`);
        }
    }
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new common_1.BadRequestException('Invalid email format');
        }
    }
    validatePhoneNumber(phone) {
        const phoneRegex = /^\+?1?\s*\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
        if (!phoneRegex.test(phone)) {
            throw new common_1.BadRequestException('Invalid phone number format. Expected: (123) 456-7890');
        }
    }
    validateId(id, fieldName = 'ID') {
        return (0, commonValidators_1.validateUUID)(id, fieldName);
    }
    validateFutureDate(date, fieldName) {
        const errors = [];
        const now = new Date();
        if (date <= now) {
            errors.push({
                field: fieldName,
                message: `${fieldName} must be in the future`,
                code: ValidationErrorCode.INVALID_VALUE,
            });
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings: [],
        };
    }
    validatePastDate(date, fieldName) {
        const errors = [];
        const now = new Date();
        if (date >= now) {
            errors.push({
                field: fieldName,
                message: `${fieldName} must be in the past`,
                code: ValidationErrorCode.INVALID_VALUE,
            });
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings: [],
        };
    }
    validateRequiredFields(data, requiredFields, fieldLabels) {
        const errors = [];
        for (const field of requiredFields) {
            const value = data[field];
            const label = fieldLabels?.[field] || field;
            if (value === undefined || value === null || value === '') {
                errors.push({
                    field,
                    message: `${label} is required`,
                    code: ValidationErrorCode.REQUIRED_FIELD,
                });
            }
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings: [],
        };
    }
    async executeWithLogging(operation, fn, context) {
        try {
            this.logDebug(`Starting ${operation}`, context);
            const result = await fn();
            this.logDebug(`Completed ${operation}`, context);
            return result;
        }
        catch (error) {
            this.handleError(error, operation, context);
            throw error;
        }
    }
    executeSync(operation, fn, context) {
        try {
            this.logDebug(`Starting ${operation}`, context);
            const result = fn();
            this.logDebug(`Completed ${operation}`, context);
            return result;
        }
        catch (error) {
            this.handleError(error, operation, context);
            throw error;
        }
    }
    validatePagination(params) {
        const validation = (0, pagination_1.validatePaginationParams)(params, this.paginationConstraints);
        if (!validation.isValid) {
            return validation;
        }
        const normalizedParams = (0, pagination_1.buildPaginationQuery)(params, this.paginationConstraints);
        return {
            ...validation,
            normalizedParams,
        };
    }
    createPaginatedResponse(result, page, limit) {
        return (0, pagination_1.processPaginatedResult)(result, page, limit);
    }
    async executeTransaction(operation, transactionCallback, sequelize) {
        const transaction = await sequelize.transaction();
        try {
            const result = await transactionCallback(transaction);
            await transaction.commit();
            return this.handleSuccess(operation, result);
        }
        catch (error) {
            await transaction.rollback();
            return this.handleErrorLegacy(operation, error);
        }
    }
    async executeBulkOperation(operation, items, processor) {
        const results = {
            processed: 0,
            successful: 0,
            failed: 0,
            errors: [],
        };
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            results.processed++;
            try {
                await processor(item, i);
                results.successful++;
            }
            catch (error) {
                results.failed++;
                results.errors.push(`Item ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
                this.logError(`Bulk operation ${operation} failed for item ${i + 1}`, error);
            }
        }
        this.logInfo(`Bulk operation ${operation} completed`);
        return results;
    }
    async checkEntityExists(model, id, entityName = 'Entity') {
        try {
            const entity = await model.findByPk(id);
            if (!entity) {
                return {
                    exists: false,
                    error: `${entityName} not found`,
                };
            }
            return {
                exists: true,
                entity,
            };
        }
        catch (error) {
            this.logError(`Error checking ${entityName} existence`, error);
            return {
                exists: false,
                error: `Error checking ${entityName} existence`,
            };
        }
    }
    buildSearchClause(searchTerm, searchFields) {
        if (!searchTerm || searchFields.length === 0) {
            return {};
        }
        return {
            [sequelize_1.Op.or]: searchFields.map((field) => ({
                [field]: { [sequelize_1.Op.iLike]: `%${searchTerm}%` },
            })),
        };
    }
    async findEntityOrFail(model, id, entityName = 'Entity', transaction) {
        const entity = await model.findByPk(id, { transaction });
        if (!entity) {
            throw new Error(`${entityName} not found: ${id}`);
        }
        return entity;
    }
    async createPaginatedQuery(model, options) {
        const { page = 1, limit = 20, where = {}, include = [], order = [], attributes } = options;
        const validation = this.validatePagination({ page, limit });
        if (!validation.isValid || !validation.normalizedParams) {
            throw new Error(validation.errors?.[0]?.message || 'Invalid pagination parameters');
        }
        const { offset } = validation.normalizedParams;
        const { rows, count } = await model.findAndCountAll({
            where: where,
            include: include,
            order: order,
            attributes,
            offset,
            limit,
            distinct: true,
        });
        return this.createPaginatedResponse({ rows, count }, page, limit);
    }
    async reloadWithStandardAssociations(entity, associations, transaction) {
        await entity.reload({
            include: associations,
            transaction,
        });
        return entity;
    }
    buildDateRangeClause(field, startDate, endDate) {
        const dateClause = {};
        if (startDate || endDate) {
            const rangeConditions = {};
            if (startDate) {
                rangeConditions[sequelize_1.Op.gte] = startDate;
            }
            if (endDate) {
                rangeConditions[sequelize_1.Op.lte] = endDate;
            }
            dateClause[field] = rangeConditions;
        }
        return dateClause;
    }
    async softDelete(model, id, userId) {
        try {
            const validation = this.validateId(id);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: validation.errors[0]?.message || 'Invalid ID',
                };
            }
            const entity = await model.findByPk(id);
            if (!entity) {
                return {
                    success: false,
                    error: 'Record not found',
                };
            }
            await entity.update({ isActive: false });
            await this.logAuditEvent('soft_delete', model.name, id, userId);
            return this.handleSuccess('soft delete', { success: true });
        }
        catch (error) {
            return this.handleErrorLegacy('soft delete', error);
        }
    }
    async reactivate(model, id, userId) {
        try {
            const validation = this.validateId(id);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: validation.errors[0]?.message || 'Invalid ID',
                };
            }
            const entity = await model.findByPk(id);
            if (!entity) {
                return {
                    success: false,
                    error: 'Record not found',
                };
            }
            await entity.update({ isActive: true });
            await this.logAuditEvent('reactivate', model.name, id, userId);
            return this.handleSuccess('reactivate', { success: true });
        }
        catch (error) {
            return this.handleErrorLegacy('reactivate', error);
        }
    }
    sanitizeInput(input, options = {}) {
        const { removeNull = true, removeUndefined = true, trimStrings = true, removeEmptyStrings = false, } = options;
        const sanitized = {};
        for (const [key, value] of Object.entries(input)) {
            let processedValue = value;
            if (removeNull && processedValue === null) {
                continue;
            }
            if (removeUndefined && processedValue === undefined) {
                continue;
            }
            if (trimStrings && typeof processedValue === 'string') {
                processedValue = processedValue.trim();
                if (removeEmptyStrings && processedValue === '') {
                    continue;
                }
            }
            if (processedValue && typeof processedValue === 'object' && !Array.isArray(processedValue)) {
                processedValue = this.sanitizeInput(processedValue, options);
            }
            sanitized[key] = processedValue;
        }
        return sanitized;
    }
    async logAuditEvent(action, entityType, entityId, userId, changes, metadata) {
        if (!this.enableAuditLogging) {
            return;
        }
        try {
            this.logInfo(`Audit entry: ${action} on ${entityType}`);
        }
        catch (error) {
            this.logError('Failed to create audit entry', error);
        }
    }
    requireUserId() {
        if (!this.requestContext) {
            throw new common_1.BadRequestException('Request context not available');
        }
        const userId = this.requestContext.userId;
        if (!userId) {
            throw new common_1.BadRequestException('User authentication required');
        }
        return userId;
    }
    requireRole(role) {
        if (!this.requestContext) {
            throw new common_1.BadRequestException('Request context not available');
        }
        if (!this.requestContext.hasRole(role)) {
            throw new common_1.BadRequestException(`Requires ${role} role`);
        }
    }
    requireAnyRole(roles) {
        if (!this.requestContext) {
            throw new common_1.BadRequestException('Request context not available');
        }
        if (!this.requestContext.hasAnyRole(roles)) {
            throw new common_1.BadRequestException(`Requires one of the following roles: ${roles.join(', ')}`);
        }
    }
    getAuditContext() {
        return this.requestContext?.getAuditContext() || {};
    }
    createAuditLog(action, resource, resourceId, details) {
        return {
            ...this.getAuditContext(),
            action,
            resource,
            resourceId,
            details,
        };
    }
    logInfo(message, context) {
        if (this.logger instanceof common_1.Logger) {
            this.logger.log(message, context || this.serviceName);
        }
        else {
            this.logger.log(message, context || this.serviceName);
        }
    }
    logError(message, error, context) {
        if (this.logger instanceof common_1.Logger) {
            this.logger.error(message, error?.stack || error, context || this.serviceName);
        }
        else {
            this.logger.error(message, error, context || this.serviceName);
        }
    }
    logDebug(message, context) {
        if (this.logger instanceof common_1.Logger) {
            this.logger.debug(message, context || this.serviceName);
        }
        else {
            this.logger.debug(message, context || this.serviceName);
        }
    }
    logWarning(message, context) {
        if (this.logger instanceof common_1.Logger) {
            this.logger.warn(message, context || this.serviceName);
        }
        else {
            this.logger.warn(message, context || this.serviceName);
        }
    }
    handleSuccess(operation, data, message) {
        this.logInfo(`${operation} completed successfully`);
        return {
            success: true,
            data,
            message,
        };
    }
};
exports.BaseService = BaseService;
exports.BaseService = BaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, Object])
], BaseService);
//# sourceMappingURL=base.service.js.map