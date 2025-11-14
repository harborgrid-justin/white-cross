"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCategory = exports.ErrorSeverity = void 0;
var ErrorSeverity;
(function (ErrorSeverity) {
    ErrorSeverity["LOW"] = "low";
    ErrorSeverity["MEDIUM"] = "medium";
    ErrorSeverity["HIGH"] = "high";
    ErrorSeverity["CRITICAL"] = "critical";
})(ErrorSeverity || (exports.ErrorSeverity = ErrorSeverity = {}));
var ErrorCategory;
(function (ErrorCategory) {
    ErrorCategory["VALIDATION"] = "validation";
    ErrorCategory["BUSINESS"] = "business";
    ErrorCategory["HEALTHCARE"] = "healthcare";
    ErrorCategory["SECURITY"] = "security";
    ErrorCategory["SYSTEM"] = "system";
    ErrorCategory["NETWORK"] = "network";
    ErrorCategory["DATABASE"] = "database";
    ErrorCategory["EXTERNAL"] = "external";
})(ErrorCategory || (exports.ErrorCategory = ErrorCategory = {}));
//# sourceMappingURL=error-response.types.js.map