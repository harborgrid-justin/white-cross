"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPaginationQuery = buildPaginationQuery;
exports.processPaginatedResult = processPaginatedResult;
exports.validatePaginationParams = validatePaginationParams;
function buildPaginationQuery(params, constraints = {}) {
    const { maxPageSize = 100, defaultPageSize = 20, maxOffset = 10000 } = constraints;
    let page = Math.max(1, params.page || 1);
    let limit = Math.min(maxPageSize, Math.max(1, params.limit || defaultPageSize));
    let offset = (page - 1) * limit;
    if (offset > maxOffset) {
        offset = maxOffset;
        page = Math.floor(offset / limit) + 1;
    }
    return { page, limit, offset };
}
function processPaginatedResult(result, page, limit) {
    const { rows, count } = result;
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const meta = {
        page,
        limit,
        total: count,
        pages: totalPages,
    };
    return {
        data: rows,
        meta,
    };
}
function validatePaginationParams(params, constraints = {}) {
    const errors = [];
    const { maxPageSize = 100, defaultPageSize = 20, maxOffset = 10000 } = constraints;
    if (params.page !== undefined) {
        if (!Number.isInteger(params.page) || params.page < 1) {
            errors.push('Page must be a positive integer');
        }
    }
    if (params.limit !== undefined) {
        if (!Number.isInteger(params.limit) || params.limit < 1) {
            errors.push('Limit must be a positive integer');
        }
        else if (params.limit > maxPageSize) {
            errors.push(`Limit cannot exceed ${maxPageSize}`);
        }
    }
    if (params.offset !== undefined) {
        if (!Number.isInteger(params.offset) || params.offset < 0) {
            errors.push('Offset must be a non-negative integer');
        }
        else if (params.offset > maxOffset) {
            errors.push(`Offset cannot exceed ${maxOffset}`);
        }
    }
    if (errors.length > 0) {
        return { isValid: false, errors };
    }
    const normalizedParams = buildPaginationQuery(params, constraints);
    return {
        isValid: true,
        normalizedParams,
    };
}
//# sourceMappingURL=pagination.js.map