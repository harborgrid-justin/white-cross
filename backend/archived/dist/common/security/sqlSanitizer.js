"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlInjectionError = exports.ALLOWED_SORT_ORDERS = exports.ALLOWED_SORT_FIELDS = void 0;
exports.validateSortField = validateSortField;
exports.validateSortOrder = validateSortOrder;
exports.validatePagination = validatePagination;
exports.buildSafeLikePattern = buildSafeLikePattern;
const logger_1 = require("../logging/logger");
exports.ALLOWED_SORT_FIELDS = {
    inventory: [
        'name',
        'quantity',
        'category',
        'createdAt',
        'updatedAt',
        'expirationDate',
    ],
    healthRecords: ['date', 'type', 'createdAt', 'title', 'provider'],
    students: ['firstName', 'lastName', 'grade', 'studentNumber', 'createdAt'],
    medications: ['name', 'category', 'stockQuantity', 'expirationDate'],
    appointments: ['scheduledAt', 'status', 'type', 'createdAt'],
    users: ['firstName', 'lastName', 'email', 'role', 'createdAt'],
    reports: ['createdAt', 'type', 'status'],
};
exports.ALLOWED_SORT_ORDERS = ['ASC', 'DESC', 'asc', 'desc'];
class SqlInjectionError extends Error {
    attemptedValue;
    constructor(message, attemptedValue) {
        super(message);
        this.attemptedValue = attemptedValue;
        this.name = 'SqlInjectionError';
    }
}
exports.SqlInjectionError = SqlInjectionError;
function validateSortField(field, entityType) {
    const allowedFields = exports.ALLOWED_SORT_FIELDS[entityType];
    if (!allowedFields) {
        logger_1.logger.error('Invalid entity type for sort validation', { entityType });
        throw new SqlInjectionError(`Invalid entity type: ${entityType}`, entityType);
    }
    if (!allowedFields.includes(field)) {
        logger_1.logger.warn('SQL injection attempt detected - invalid sort field', {
            field,
            entityType,
            allowedFields,
        });
        throw new SqlInjectionError(`Invalid sort field: ${field}. Allowed fields: ${allowedFields.join(', ')}`, field);
    }
    return field;
}
function validateSortOrder(order) {
    const upperOrder = order.toUpperCase();
    if (!exports.ALLOWED_SORT_ORDERS.map((o) => o.toUpperCase()).includes(upperOrder)) {
        logger_1.logger.warn('SQL injection attempt detected - invalid sort order', {
            order,
        });
        throw new SqlInjectionError(`Invalid sort order: ${order}. Allowed: ASC, DESC`, order);
    }
    return upperOrder;
}
function validatePagination(page, limit, maxLimit = 1000) {
    const validatedPage = parseInt(String(page || 1), 10);
    const requestedLimit = parseInt(String(limit || 50), 10);
    if (isNaN(validatedPage) || validatedPage < 1) {
        throw new SqlInjectionError('Invalid page number', String(page));
    }
    if (isNaN(requestedLimit) || requestedLimit < 1) {
        throw new SqlInjectionError('Invalid limit value', String(limit));
    }
    const validatedLimit = Math.min(requestedLimit, maxLimit);
    if (requestedLimit > maxLimit) {
        logger_1.logger.warn('Pagination limit exceeded maximum', {
            requested: requestedLimit,
            enforced: maxLimit,
        });
    }
    return {
        page: validatedPage,
        limit: validatedLimit,
        offset: (validatedPage - 1) * validatedLimit,
    };
}
function buildSafeLikePattern(searchTerm, matchType = 'contains') {
    if (!searchTerm)
        return '%';
    const escaped = searchTerm
        .replace(/\\/g, '\\\\')
        .replace(/%/g, '\\%')
        .replace(/_/g, '\\_');
    switch (matchType) {
        case 'starts':
            return `${escaped}%`;
        case 'ends':
            return `%${escaped}`;
        case 'contains':
        default:
            return `%${escaped}%`;
    }
}
exports.default = {
    validateSortField,
    validateSortOrder,
    validatePagination,
    buildSafeLikePattern,
    SqlInjectionError,
};
//# sourceMappingURL=sqlSanitizer.js.map