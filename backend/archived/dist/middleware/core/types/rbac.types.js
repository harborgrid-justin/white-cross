"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_PERMISSIONS = exports.ROLE_HIERARCHY = exports.Permission = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["STUDENT"] = "student";
    UserRole["PARENT_GUARDIAN"] = "parent_guardian";
    UserRole["SCHOOL_NURSE"] = "school_nurse";
    UserRole["SCHOOL_ADMINISTRATOR"] = "school_administrator";
    UserRole["DISTRICT_NURSE"] = "district_nurse";
    UserRole["DISTRICT_ADMINISTRATOR"] = "district_administrator";
    UserRole["SYSTEM_ADMINISTRATOR"] = "system_administrator";
    UserRole["SUPER_ADMIN"] = "super_admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var Permission;
(function (Permission) {
    Permission["READ_STUDENT_BASIC"] = "read_student_basic";
    Permission["READ_STUDENT_HEALTH"] = "read_student_health";
    Permission["UPDATE_STUDENT_BASIC"] = "update_student_basic";
    Permission["UPDATE_STUDENT_HEALTH"] = "update_student_health";
    Permission["DELETE_STUDENT"] = "delete_student";
    Permission["READ_HEALTH_RECORDS"] = "read_health_records";
    Permission["CREATE_HEALTH_RECORDS"] = "create_health_records";
    Permission["UPDATE_HEALTH_RECORDS"] = "update_health_records";
    Permission["DELETE_HEALTH_RECORDS"] = "delete_health_records";
    Permission["READ_MEDICATIONS"] = "read_medications";
    Permission["ADMINISTER_MEDICATIONS"] = "administer_medications";
    Permission["MANAGE_MEDICATIONS"] = "manage_medications";
    Permission["SEND_MESSAGES"] = "send_messages";
    Permission["BROADCAST_MESSAGES"] = "broadcast_messages";
    Permission["MANAGE_COMMUNICATIONS"] = "manage_communications";
    Permission["CREATE_EMERGENCY_ALERT"] = "create_emergency_alert";
    Permission["MANAGE_EMERGENCY_RESPONSES"] = "manage_emergency_responses";
    Permission["MANAGE_USERS"] = "manage_users";
    Permission["MANAGE_SCHOOLS"] = "manage_schools";
    Permission["VIEW_REPORTS"] = "view_reports";
    Permission["EXPORT_DATA"] = "export_data";
    Permission["MANAGE_SYSTEM"] = "manage_system";
    Permission["VIEW_AUDIT_LOGS"] = "view_audit_logs";
    Permission["MANAGE_COMPLIANCE"] = "manage_compliance";
})(Permission || (exports.Permission = Permission = {}));
exports.ROLE_HIERARCHY = {
    [UserRole.STUDENT]: 0,
    [UserRole.PARENT_GUARDIAN]: 1,
    [UserRole.SCHOOL_NURSE]: 2,
    [UserRole.SCHOOL_ADMINISTRATOR]: 3,
    [UserRole.DISTRICT_NURSE]: 4,
    [UserRole.DISTRICT_ADMINISTRATOR]: 5,
    [UserRole.SYSTEM_ADMINISTRATOR]: 6,
    [UserRole.SUPER_ADMIN]: 7,
};
exports.ROLE_PERMISSIONS = {
    [UserRole.STUDENT]: [Permission.READ_STUDENT_BASIC, Permission.SEND_MESSAGES],
    [UserRole.PARENT_GUARDIAN]: [
        Permission.READ_STUDENT_BASIC,
        Permission.READ_STUDENT_HEALTH,
        Permission.SEND_MESSAGES,
    ],
    [UserRole.SCHOOL_NURSE]: [
        Permission.READ_STUDENT_BASIC,
        Permission.READ_STUDENT_HEALTH,
        Permission.UPDATE_STUDENT_HEALTH,
        Permission.READ_HEALTH_RECORDS,
        Permission.CREATE_HEALTH_RECORDS,
        Permission.UPDATE_HEALTH_RECORDS,
        Permission.READ_MEDICATIONS,
        Permission.ADMINISTER_MEDICATIONS,
        Permission.SEND_MESSAGES,
        Permission.CREATE_EMERGENCY_ALERT,
    ],
    [UserRole.SCHOOL_ADMINISTRATOR]: [
        Permission.READ_STUDENT_BASIC,
        Permission.UPDATE_STUDENT_BASIC,
        Permission.READ_HEALTH_RECORDS,
        Permission.SEND_MESSAGES,
        Permission.BROADCAST_MESSAGES,
        Permission.VIEW_REPORTS,
        Permission.MANAGE_EMERGENCY_RESPONSES,
    ],
    [UserRole.DISTRICT_NURSE]: [
        Permission.READ_STUDENT_BASIC,
        Permission.READ_STUDENT_HEALTH,
        Permission.UPDATE_STUDENT_HEALTH,
        Permission.READ_HEALTH_RECORDS,
        Permission.CREATE_HEALTH_RECORDS,
        Permission.UPDATE_HEALTH_RECORDS,
        Permission.READ_MEDICATIONS,
        Permission.ADMINISTER_MEDICATIONS,
        Permission.MANAGE_MEDICATIONS,
        Permission.SEND_MESSAGES,
        Permission.BROADCAST_MESSAGES,
        Permission.CREATE_EMERGENCY_ALERT,
        Permission.VIEW_REPORTS,
    ],
    [UserRole.DISTRICT_ADMINISTRATOR]: [
        Permission.READ_STUDENT_BASIC,
        Permission.UPDATE_STUDENT_BASIC,
        Permission.READ_HEALTH_RECORDS,
        Permission.SEND_MESSAGES,
        Permission.BROADCAST_MESSAGES,
        Permission.MANAGE_COMMUNICATIONS,
        Permission.MANAGE_EMERGENCY_RESPONSES,
        Permission.MANAGE_USERS,
        Permission.MANAGE_SCHOOLS,
        Permission.VIEW_REPORTS,
        Permission.EXPORT_DATA,
        Permission.VIEW_AUDIT_LOGS,
    ],
    [UserRole.SYSTEM_ADMINISTRATOR]: [
        Permission.READ_STUDENT_BASIC,
        Permission.READ_STUDENT_HEALTH,
        Permission.UPDATE_STUDENT_BASIC,
        Permission.UPDATE_STUDENT_HEALTH,
        Permission.DELETE_STUDENT,
        Permission.READ_HEALTH_RECORDS,
        Permission.CREATE_HEALTH_RECORDS,
        Permission.UPDATE_HEALTH_RECORDS,
        Permission.DELETE_HEALTH_RECORDS,
        Permission.READ_MEDICATIONS,
        Permission.MANAGE_MEDICATIONS,
        Permission.SEND_MESSAGES,
        Permission.BROADCAST_MESSAGES,
        Permission.MANAGE_COMMUNICATIONS,
        Permission.CREATE_EMERGENCY_ALERT,
        Permission.MANAGE_EMERGENCY_RESPONSES,
        Permission.MANAGE_USERS,
        Permission.MANAGE_SCHOOLS,
        Permission.VIEW_REPORTS,
        Permission.EXPORT_DATA,
        Permission.VIEW_AUDIT_LOGS,
        Permission.MANAGE_COMPLIANCE,
        Permission.MANAGE_SYSTEM,
    ],
    [UserRole.SUPER_ADMIN]: Object.values(Permission),
};
//# sourceMappingURL=rbac.types.js.map