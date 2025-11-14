"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["STUDENT"] = "student";
    UserRole["SCHOOL_NURSE"] = "school_nurse";
    UserRole["ADMINISTRATOR"] = "administrator";
    UserRole["SYSTEM_ADMIN"] = "system_admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var Permission;
(function (Permission) {
    Permission["VIEW_OWN_HEALTH_RECORDS"] = "view_own_health_records";
    Permission["UPDATE_OWN_EMERGENCY_CONTACTS"] = "update_own_emergency_contacts";
    Permission["VIEW_STUDENT_HEALTH_RECORDS"] = "view_student_health_records";
    Permission["CREATE_HEALTH_RECORDS"] = "create_health_records";
    Permission["UPDATE_HEALTH_RECORDS"] = "update_health_records";
    Permission["ADMINISTER_MEDICATION"] = "administer_medication";
    Permission["VIEW_IMMUNIZATION_RECORDS"] = "view_immunization_records";
    Permission["CREATE_INCIDENT_REPORTS"] = "create_incident_reports";
    Permission["MANAGE_USERS"] = "manage_users";
    Permission["VIEW_REPORTS"] = "view_reports";
    Permission["EXPORT_DATA"] = "export_data";
    Permission["MANAGE_FACILITY_SETTINGS"] = "manage_facility_settings";
    Permission["SYSTEM_ADMINISTRATION"] = "system_administration";
    Permission["AUDIT_LOGS"] = "audit_logs";
    Permission["EMERGENCY_ACCESS"] = "emergency_access";
    Permission["BREAK_GLASS_ACCESS"] = "break_glass_access";
})(Permission || (exports.Permission = Permission = {}));
//# sourceMappingURL=middleware.types.js.map