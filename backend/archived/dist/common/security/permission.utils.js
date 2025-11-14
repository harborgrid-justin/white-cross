"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPermission = hasPermission;
exports.requirePermission = requirePermission;
exports.canAccessStudent = canAccessStudent;
exports.requireStudentAccess = requireStudentAccess;
const Boom = __importStar(require("@hapi/boom"));
const enums_1 = require("../../common/enums");
const ROLE_PERMISSIONS = {
    ADMIN: [
        { resource: '*', action: 'manage' },
    ],
    NURSE: [
        { resource: 'students', action: 'read' },
        { resource: 'students', action: 'update' },
        { resource: 'students', action: 'create' },
        { resource: 'health-records', action: 'create' },
        { resource: 'health-records', action: 'read' },
        { resource: 'health-records', action: 'update' },
        { resource: 'health-records', action: 'delete' },
        { resource: 'medications', action: 'create' },
        { resource: 'medications', action: 'read' },
        { resource: 'medications', action: 'update' },
        { resource: 'medications', action: 'manage' },
        { resource: 'appointments', action: 'create' },
        { resource: 'appointments', action: 'read' },
        { resource: 'appointments', action: 'update' },
        { resource: 'appointments', action: 'delete' },
        { resource: 'incidents', action: 'create' },
        { resource: 'incidents', action: 'read' },
        { resource: 'incidents', action: 'update' },
        { resource: 'documents', action: 'create' },
        { resource: 'documents', action: 'read' },
        { resource: 'documents', action: 'update' },
        { resource: 'documents', action: 'delete' },
        { resource: 'emergency-contacts', action: 'read' },
        { resource: 'emergency-contacts', action: 'update' },
        { resource: 'communications', action: 'create' },
        { resource: 'communications', action: 'read' },
        { resource: 'inventory', action: 'read' },
        { resource: 'inventory', action: 'update' },
        { resource: 'reports', action: 'read' },
        { resource: 'reports', action: 'create' },
    ],
    SCHOOL_ADMIN: [
        { resource: 'students', action: 'manage' },
        { resource: 'health-records', action: 'manage' },
        { resource: 'medications', action: 'manage' },
        { resource: 'appointments', action: 'manage' },
        { resource: 'incidents', action: 'manage' },
        { resource: 'documents', action: 'manage' },
        { resource: 'emergency-contacts', action: 'manage' },
        { resource: 'communications', action: 'manage' },
        { resource: 'inventory', action: 'manage' },
        { resource: 'reports', action: 'manage' },
        { resource: 'users', action: 'read' },
    ],
    DISTRICT_ADMIN: [
        { resource: '*', action: 'manage' },
    ],
    VIEWER: [
        { resource: 'students', action: 'read' },
        { resource: 'health-records', action: 'read' },
        { resource: 'appointments', action: 'read' },
        { resource: 'documents', action: 'read' },
        { resource: 'communications', action: 'read' },
        { resource: 'reports', action: 'read' },
    ],
    COUNSELOR: [
        { resource: 'students', action: 'read' },
        { resource: 'health-records', action: 'read' },
        { resource: 'appointments', action: 'create' },
        { resource: 'appointments', action: 'read' },
        { resource: 'appointments', action: 'update' },
        { resource: 'incidents', action: 'read' },
        { resource: 'documents', action: 'read' },
        { resource: 'emergency-contacts', action: 'read' },
        { resource: 'communications', action: 'create' },
        { resource: 'communications', action: 'read' },
    ],
};
function hasPermission(userRole, resource, action) {
    const permissions = ROLE_PERMISSIONS[userRole] || [];
    if (permissions.some((p) => p.resource === '*' && p.action === 'manage')) {
        return true;
    }
    return permissions.some((p) => p.resource === resource && (p.action === action || p.action === 'manage'));
}
function requirePermission(resource, action) {
    return (request, h) => {
        const credentials = request.auth.credentials;
        const user = credentials?.user || credentials;
        if (!user) {
            throw Boom.unauthorized('Authentication required');
        }
        if (!hasPermission(user.role, resource, action)) {
            throw Boom.forbidden(`Insufficient permissions to ${action} ${resource}`);
        }
        return h.continue;
    };
}
async function canAccessStudent(_userId, userRole, _studentId) {
    if (userRole === enums_1.UserRole.ADMIN || userRole === enums_1.UserRole.DISTRICT_ADMIN) {
        return true;
    }
    if (userRole === enums_1.UserRole.SCHOOL_ADMIN) {
        return true;
    }
    if (userRole === enums_1.UserRole.NURSE) {
        return true;
    }
    if (userRole === enums_1.UserRole.COUNSELOR) {
        return true;
    }
    if (userRole === enums_1.UserRole.VIEWER) {
        return true;
    }
    return false;
}
function requireStudentAccess() {
    return async (request, h) => {
        const credentials = request.auth.credentials;
        const user = credentials?.user || credentials;
        const studentId = request.params.studentId || request.payload?.studentId;
        if (!user) {
            throw Boom.unauthorized('Authentication required');
        }
        if (!studentId) {
            throw Boom.badRequest('Student ID required');
        }
        const hasAccess = await canAccessStudent(user.id, user.role, studentId);
        if (!hasAccess) {
            throw Boom.forbidden('You do not have access to this student');
        }
        return h.continue;
    };
}
//# sourceMappingURL=permission.utils.js.map