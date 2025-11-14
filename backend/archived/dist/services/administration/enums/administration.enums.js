"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingCategory = exports.LicenseStatus = exports.LicenseType = exports.MetricType = exports.BackupStatus = exports.BackupType = exports.ConfigScope = exports.ConfigValueType = exports.ConfigCategory = exports.AuditAction = void 0;
var AuditAction;
(function (AuditAction) {
    AuditAction["CREATE"] = "CREATE";
    AuditAction["READ"] = "READ";
    AuditAction["UPDATE"] = "UPDATE";
    AuditAction["DELETE"] = "DELETE";
    AuditAction["LOGIN"] = "LOGIN";
    AuditAction["LOGOUT"] = "LOGOUT";
    AuditAction["EXPORT"] = "EXPORT";
    AuditAction["IMPORT"] = "IMPORT";
    AuditAction["BACKUP"] = "BACKUP";
    AuditAction["RESTORE"] = "RESTORE";
    AuditAction["SECURITY_EVENT"] = "SECURITY_EVENT";
    AuditAction["ACCESS"] = "ACCESS";
    AuditAction["VIEW"] = "VIEW";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
var ConfigCategory;
(function (ConfigCategory) {
    ConfigCategory["GENERAL"] = "GENERAL";
    ConfigCategory["SECURITY"] = "SECURITY";
    ConfigCategory["NOTIFICATION"] = "NOTIFICATION";
    ConfigCategory["INTEGRATION"] = "INTEGRATION";
    ConfigCategory["BACKUP"] = "BACKUP";
    ConfigCategory["PERFORMANCE"] = "PERFORMANCE";
    ConfigCategory["HEALTHCARE"] = "HEALTHCARE";
    ConfigCategory["MEDICATION"] = "MEDICATION";
    ConfigCategory["APPOINTMENTS"] = "APPOINTMENTS";
    ConfigCategory["UI"] = "UI";
    ConfigCategory["QUERY"] = "QUERY";
    ConfigCategory["FILE_UPLOAD"] = "FILE_UPLOAD";
    ConfigCategory["RATE_LIMITING"] = "RATE_LIMITING";
    ConfigCategory["SESSION"] = "SESSION";
    ConfigCategory["EMAIL"] = "EMAIL";
})(ConfigCategory || (exports.ConfigCategory = ConfigCategory = {}));
var ConfigValueType;
(function (ConfigValueType) {
    ConfigValueType["STRING"] = "STRING";
    ConfigValueType["NUMBER"] = "NUMBER";
    ConfigValueType["BOOLEAN"] = "BOOLEAN";
    ConfigValueType["JSON"] = "JSON";
    ConfigValueType["ARRAY"] = "ARRAY";
    ConfigValueType["DATE"] = "DATE";
    ConfigValueType["TIME"] = "TIME";
    ConfigValueType["DATETIME"] = "DATETIME";
    ConfigValueType["EMAIL"] = "EMAIL";
    ConfigValueType["URL"] = "URL";
    ConfigValueType["COLOR"] = "COLOR";
    ConfigValueType["ENUM"] = "ENUM";
})(ConfigValueType || (exports.ConfigValueType = ConfigValueType = {}));
var ConfigScope;
(function (ConfigScope) {
    ConfigScope["SYSTEM"] = "SYSTEM";
    ConfigScope["DISTRICT"] = "DISTRICT";
    ConfigScope["SCHOOL"] = "SCHOOL";
    ConfigScope["USER"] = "USER";
})(ConfigScope || (exports.ConfigScope = ConfigScope = {}));
var BackupType;
(function (BackupType) {
    BackupType["AUTOMATIC"] = "AUTOMATIC";
    BackupType["MANUAL"] = "MANUAL";
    BackupType["SCHEDULED"] = "SCHEDULED";
})(BackupType || (exports.BackupType = BackupType = {}));
var BackupStatus;
(function (BackupStatus) {
    BackupStatus["IN_PROGRESS"] = "IN_PROGRESS";
    BackupStatus["COMPLETED"] = "COMPLETED";
    BackupStatus["FAILED"] = "FAILED";
})(BackupStatus || (exports.BackupStatus = BackupStatus = {}));
var MetricType;
(function (MetricType) {
    MetricType["CPU_USAGE"] = "CPU_USAGE";
    MetricType["MEMORY_USAGE"] = "MEMORY_USAGE";
    MetricType["DISK_USAGE"] = "DISK_USAGE";
    MetricType["API_RESPONSE_TIME"] = "API_RESPONSE_TIME";
    MetricType["DATABASE_QUERY_TIME"] = "DATABASE_QUERY_TIME";
    MetricType["ACTIVE_USERS"] = "ACTIVE_USERS";
    MetricType["ERROR_RATE"] = "ERROR_RATE";
    MetricType["REQUEST_COUNT"] = "REQUEST_COUNT";
})(MetricType || (exports.MetricType = MetricType = {}));
var LicenseType;
(function (LicenseType) {
    LicenseType["TRIAL"] = "TRIAL";
    LicenseType["BASIC"] = "BASIC";
    LicenseType["PROFESSIONAL"] = "PROFESSIONAL";
    LicenseType["ENTERPRISE"] = "ENTERPRISE";
})(LicenseType || (exports.LicenseType = LicenseType = {}));
var LicenseStatus;
(function (LicenseStatus) {
    LicenseStatus["ACTIVE"] = "ACTIVE";
    LicenseStatus["EXPIRED"] = "EXPIRED";
    LicenseStatus["SUSPENDED"] = "SUSPENDED";
    LicenseStatus["CANCELLED"] = "CANCELLED";
})(LicenseStatus || (exports.LicenseStatus = LicenseStatus = {}));
var TrainingCategory;
(function (TrainingCategory) {
    TrainingCategory["HIPAA_COMPLIANCE"] = "HIPAA_COMPLIANCE";
    TrainingCategory["MEDICATION_MANAGEMENT"] = "MEDICATION_MANAGEMENT";
    TrainingCategory["EMERGENCY_PROCEDURES"] = "EMERGENCY_PROCEDURES";
    TrainingCategory["SYSTEM_TRAINING"] = "SYSTEM_TRAINING";
    TrainingCategory["SAFETY_PROTOCOLS"] = "SAFETY_PROTOCOLS";
    TrainingCategory["DATA_SECURITY"] = "DATA_SECURITY";
})(TrainingCategory || (exports.TrainingCategory = TrainingCategory = {}));
//# sourceMappingURL=administration.enums.js.map