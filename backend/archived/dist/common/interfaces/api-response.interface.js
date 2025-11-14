"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isApiErrorResponse = isApiErrorResponse;
exports.isApiSuccessResponse = isApiSuccessResponse;
function isApiErrorResponse(response) {
    return response && response.success === false && 'statusCode' in response;
}
function isApiSuccessResponse(response) {
    return response && response.success === true && 'data' in response;
}
//# sourceMappingURL=api-response.interface.js.map