"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDefined = isDefined;
exports.isNull = isNull;
exports.isUndefined = isUndefined;
exports.isString = isString;
exports.isNumber = isNumber;
exports.isBoolean = isBoolean;
exports.isFunction = isFunction;
exports.isObject = isObject;
exports.isArray = isArray;
exports.isDate = isDate;
exports.isPromise = isPromise;
exports.isEmail = isEmail;
exports.isUUID = isUUID;
exports.isISODate = isISODate;
exports.isURL = isURL;
exports.isEmptyObject = isEmptyObject;
exports.isEmptyArray = isEmptyArray;
exports.hasKey = hasKey;
exports.hasKeys = hasKeys;
exports.isJSONString = isJSONString;
exports.isRecord = isRecord;
exports.isNullable = isNullable;
exports.isError = isError;
exports.isInstanceOf = isInstanceOf;
exports.createTypeGuard = createTypeGuard;
function isDefined(value) {
    return value !== null && value !== undefined;
}
function isNull(value) {
    return value === null;
}
function isUndefined(value) {
    return value === undefined;
}
function isString(value) {
    return typeof value === 'string';
}
function isNumber(value) {
    return typeof value === 'number' && !Number.isNaN(value);
}
function isBoolean(value) {
    return typeof value === 'boolean';
}
function isFunction(value) {
    return typeof value === 'function';
}
function isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function isArray(value) {
    return Array.isArray(value);
}
function isDate(value) {
    return value instanceof Date && !isNaN(value.getTime());
}
function isPromise(value) {
    return (value instanceof Promise ||
        (isObject(value) && isFunction(value.then)));
}
function isEmail(value) {
    if (!isString(value))
        return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
}
function isUUID(value) {
    if (!isString(value))
        return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
}
function isISODate(value) {
    if (!isString(value))
        return false;
    const date = new Date(value);
    return !isNaN(date.getTime()) && value === date.toISOString();
}
function isURL(value) {
    if (!isString(value))
        return false;
    try {
        new URL(value);
        return true;
    }
    catch {
        return false;
    }
}
function isEmptyObject(value) {
    return isObject(value) && Object.keys(value).length === 0;
}
function isEmptyArray(value) {
    return isArray(value) && value.length === 0;
}
function hasKey(obj, key) {
    return isObject(obj) && key in obj;
}
function hasKeys(obj, keys) {
    return isObject(obj) && keys.every((key) => key in obj);
}
function isJSONString(value) {
    if (!isString(value))
        return false;
    try {
        JSON.parse(value);
        return true;
    }
    catch {
        return false;
    }
}
function isRecord(value) {
    return isObject(value);
}
function isNullable(value) {
    return value === null || value === undefined;
}
function isError(value) {
    return value instanceof Error;
}
function isInstanceOf(value, constructor) {
    return value instanceof constructor;
}
function createTypeGuard(validator) {
    return (value) => validator(value);
}
//# sourceMappingURL=guards.js.map