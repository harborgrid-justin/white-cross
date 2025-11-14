"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = requirePermission;
exports.checkUserPermission = checkUserPermission;
exports.assertUserPermission = assertUserPermission;
exports.getUserRole = getUserRole;
exports.getUserId = getUserId;
exports.hasAnyRole = hasAnyRole;
exports.hasAllRoles = hasAllRoles;
exports.requireRole = requireRole;
const Permission_1 = require("./Permission");
const errors_1 = require("../errors");
function requirePermission(options) {
    return async (request, h) => {
        const user = request.auth.credentials;
        if (!user || !user.id || !user.role) {
            throw errors_1.ErrorFactory.invalidToken({ path: request.path });
        }
        const context = {
            userId: user.id,
            userRole: user.role,
            resource: options.resource,
            action: options.action,
        };
        if (options.extractResourceId) {
            context.resourceId = options.extractResourceId(request);
        }
        if (options.extractResourceOwner) {
            context.resourceOwnerId = await options.extractResourceOwner(request);
        }
        if (options.allowSelf && context.resourceOwnerId === user.id) {
            return h.continue;
        }
        const result = (0, Permission_1.checkPermission)(context);
        if (!result.allowed) {
            throw errors_1.ErrorFactory.permissionDenied(options.action, options.resource, {
                userId: user.id,
                userRole: user.role,
                reason: result.reason,
                path: request.path,
            });
        }
        return h.continue;
    };
}
async function checkUserPermission(request, options) {
    const user = request.auth.credentials;
    if (!user || !user.id || !user.role) {
        return false;
    }
    const context = {
        userId: user.id,
        userRole: user.role,
        resource: options.resource,
        action: options.action,
        resourceId: options.resourceId,
        resourceOwnerId: options.resourceOwnerId,
    };
    const result = (0, Permission_1.checkPermission)(context);
    return result.allowed;
}
async function assertUserPermission(request, options) {
    const hasPermission = await checkUserPermission(request, options);
    if (!hasPermission) {
        const user = request.auth.credentials;
        throw errors_1.ErrorFactory.permissionDenied(options.action, options.resource, {
            userId: user?.id,
            userRole: user?.role,
            path: request.path,
        });
    }
}
function getUserRole(request) {
    const user = request.auth.credentials;
    return user?.role || null;
}
function getUserId(request) {
    const user = request.auth.credentials;
    return user?.id || null;
}
function hasAnyRole(request, roles) {
    const userRole = getUserRole(request);
    return userRole ? roles.includes(userRole) : false;
}
function hasAllRoles(request, roles) {
    const userRole = getUserRole(request);
    if (!userRole)
        return false;
    return roles.includes(userRole);
}
function requireRole(allowedRoles) {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    return (request, h) => {
        const userRole = getUserRole(request);
        if (!userRole || !roles.includes(userRole)) {
            throw errors_1.ErrorFactory.insufficientPermissions(`access this resource (requires: ${roles.join(' or ')})`, {
                userId: getUserId(request),
                userRole,
                requiredRoles: roles,
                path: request.path,
            });
        }
        return h.continue;
    };
}
exports.default = {
    requirePermission,
    checkUserPermission,
    assertUserPermission,
    getUserRole,
    getUserId,
    hasAnyRole,
    hasAllRoles,
    requireRole,
};
//# sourceMappingURL=middleware.js.map