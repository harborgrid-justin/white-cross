"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOffsetPagination = isOffsetPagination;
exports.isCursorPagination = isCursorPagination;
function isOffsetPagination(params) {
    return 'offset' in params || 'page' in params;
}
function isCursorPagination(params) {
    return 'after' in params || 'before' in params;
}
//# sourceMappingURL=pagination.js.map