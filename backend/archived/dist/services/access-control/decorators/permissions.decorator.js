"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permissions = exports.PERMISSIONS_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.PERMISSIONS_KEY = 'permissions';
const Permissions = (resource, action) => (0, common_1.SetMetadata)(exports.PERMISSIONS_KEY, { resource, action });
exports.Permissions = Permissions;
//# sourceMappingURL=permissions.decorator.js.map