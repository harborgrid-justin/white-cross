"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIELD_AUTH_KEY = void 0;
exports.FieldAuthorization = FieldAuthorization;
exports.PHIField = PHIField;
exports.AdminOnlyField = AdminOnlyField;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../database");
exports.FIELD_AUTH_KEY = 'field_auth_roles';
function FieldAuthorization(roles) {
    return (target, propertyKey, descriptor) => {
        (0, common_1.SetMetadata)(exports.FIELD_AUTH_KEY, roles)(target, propertyKey, descriptor);
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const context = args[2];
            if (!context || !context.req || !context.req.user) {
                console.warn('Field authorization: No authenticated user', {
                    field: propertyKey,
                    timestamp: new Date().toISOString(),
                });
                return null;
            }
            const user = context.req.user;
            const hasPermission = roles.includes(user.role);
            if (!hasPermission) {
                console.warn('Field authorization denied', {
                    userId: user.id,
                    userRole: user.role,
                    field: propertyKey,
                    requiredRoles: roles,
                    timestamp: new Date().toISOString(),
                });
                return null;
            }
            console.log('Field authorization granted', {
                userId: user.id,
                userRole: user.role,
                field: propertyKey,
                timestamp: new Date().toISOString(),
            });
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}
function PHIField() {
    return FieldAuthorization([
        database_1.UserRole.ADMIN,
        database_1.UserRole.SCHOOL_ADMIN,
        database_1.UserRole.DISTRICT_ADMIN,
        database_1.UserRole.NURSE,
    ]);
}
function AdminOnlyField() {
    return FieldAuthorization([database_1.UserRole.ADMIN]);
}
//# sourceMappingURL=field-authorization.guard.js.map