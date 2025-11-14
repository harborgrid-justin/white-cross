"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCleanableProvider = isCleanableProvider;
exports.hasDestroyMethod = hasDestroyMethod;
function isCleanableProvider(obj) {
    return (typeof obj === 'object' &&
        obj !== null &&
        (typeof obj.cleanup === 'function' ||
            typeof obj.clearCache === 'function' ||
            typeof obj.dispose === 'function' ||
            typeof obj.destroy === 'function'));
}
function hasDestroyMethod(resource) {
    return (typeof resource === 'object' &&
        resource !== null &&
        typeof resource.destroy === 'function');
}
//# sourceMappingURL=resource.types.js.map