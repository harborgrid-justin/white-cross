"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequirePermission = exports.RequirePermissions = exports.PERMISSIONS_MODE_KEY = exports.PERMISSIONS_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.PERMISSIONS_KEY = 'permissions';
exports.PERMISSIONS_MODE_KEY = 'permissions_mode';
const RequirePermissions = (permissions, mode = 'all') => {
    return (target, propertyKey, descriptor) => {
        (0, common_1.SetMetadata)(exports.PERMISSIONS_KEY, permissions)(target, propertyKey, descriptor);
        (0, common_1.SetMetadata)(exports.PERMISSIONS_MODE_KEY, mode)(target, propertyKey, descriptor);
    };
};
exports.RequirePermissions = RequirePermissions;
const RequirePermission = (permission) => {
    return (0, exports.RequirePermissions)([permission], 'all');
};
exports.RequirePermission = RequirePermission;
//# sourceMappingURL=permissions.decorator.js.map