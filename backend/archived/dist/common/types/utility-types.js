"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSuccess = isSuccess;
exports.isError = isError;
exports.hasValue = hasValue;
exports.filterNullish = filterNullish;
exports.isJsonValue = isJsonValue;
exports.isRecord = isRecord;
exports.isTransformableValue = isTransformableValue;
exports.isRequestUser = isRequestUser;
function isSuccess(result) {
    return result.success === true;
}
function isError(result) {
    return result.success === false;
}
function hasValue(optional) {
    return optional.hasValue === true;
}
function filterNullish(array) {
    return array.filter((item) => item !== null && item !== undefined);
}
function isJsonValue(value) {
    if (value === null)
        return true;
    if (typeof value === 'string')
        return true;
    if (typeof value === 'number')
        return true;
    if (typeof value === 'boolean')
        return true;
    if (Array.isArray(value))
        return value.every(isJsonValue);
    if (typeof value === 'object') {
        return Object.values(value).every(isJsonValue);
    }
    return false;
}
function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function isTransformableValue(value) {
    if (value === null || value === undefined)
        return true;
    if (typeof value === 'string')
        return true;
    if (typeof value === 'number')
        return true;
    if (typeof value === 'boolean')
        return true;
    if (Array.isArray(value))
        return value.every(isTransformableValue);
    if (typeof value === 'object') {
        return Object.values(value).every(isTransformableValue);
    }
    return false;
}
function isRequestUser(value) {
    return (isRecord(value) &&
        typeof value.id === 'string' &&
        (value.email === undefined || typeof value.email === 'string') &&
        (value.organizationId === undefined || typeof value.organizationId === 'string'));
}
//# sourceMappingURL=utility-types.js.map