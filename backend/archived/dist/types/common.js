"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSuccess = isSuccess;
exports.isFailure = isFailure;
exports.unwrapResult = unwrapResult;
function isSuccess(result) {
    return result.success === true;
}
function isFailure(result) {
    return result.success === false;
}
function unwrapResult(result) {
    if (isSuccess(result)) {
        return result.data;
    }
    throw result.error;
}
//# sourceMappingURL=common.js.map