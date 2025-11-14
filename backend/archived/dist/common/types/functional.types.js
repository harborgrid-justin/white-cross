"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSuccess = isSuccess;
exports.isError = isError;
exports.hasValue = hasValue;
function isSuccess(result) {
    return result.success === true;
}
function isError(result) {
    return result.success === false;
}
function hasValue(optional) {
    return optional.hasValue === true;
}
//# sourceMappingURL=functional.types.js.map