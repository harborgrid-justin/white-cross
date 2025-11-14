"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
exports.isUserRole = isUserRole;
exports.getUserRoleDisplayName = getUserRoleDisplayName;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["NURSE"] = "NURSE";
    UserRole["SCHOOL_ADMIN"] = "SCHOOL_ADMIN";
    UserRole["DISTRICT_ADMIN"] = "DISTRICT_ADMIN";
    UserRole["VIEWER"] = "VIEWER";
    UserRole["COUNSELOR"] = "COUNSELOR";
})(UserRole || (exports.UserRole = UserRole = {}));
function isUserRole(value) {
    return (typeof value === 'string' &&
        Object.values(UserRole).includes(value));
}
function getUserRoleDisplayName(role) {
    const displayNames = {
        [UserRole.ADMIN]: 'Administrator',
        [UserRole.NURSE]: 'Nurse',
        [UserRole.SCHOOL_ADMIN]: 'School Administrator',
        [UserRole.DISTRICT_ADMIN]: 'District Administrator',
        [UserRole.VIEWER]: 'Viewer',
        [UserRole.COUNSELOR]: 'Counselor',
    };
    return displayNames[role];
}
//# sourceMappingURL=user-role.enum.js.map