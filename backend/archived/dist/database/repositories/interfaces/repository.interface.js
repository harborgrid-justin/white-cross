"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryError = void 0;
class RepositoryError extends Error {
    code;
    statusCode;
    details;
    constructor(message, code, statusCode = 400, details) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'RepositoryError';
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.RepositoryError = RepositoryError;
//# sourceMappingURL=repository.interface.js.map