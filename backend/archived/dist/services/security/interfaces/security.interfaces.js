"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PIIType = exports.ThreatSeverity = exports.ThreatType = exports.AuditCategory = void 0;
var AuditCategory;
(function (AuditCategory) {
    AuditCategory["AUTHENTICATION"] = "authentication";
    AuditCategory["AUTHORIZATION"] = "authorization";
    AuditCategory["DATA_ACCESS"] = "data_access";
    AuditCategory["DATA_MODIFICATION"] = "data_modification";
    AuditCategory["SECURITY_EVENT"] = "security_event";
    AuditCategory["SYSTEM_ADMINISTRATION"] = "system_administration";
    AuditCategory["CONFIGURATION_CHANGE"] = "configuration_change";
})(AuditCategory || (exports.AuditCategory = AuditCategory = {}));
var ThreatType;
(function (ThreatType) {
    ThreatType["BRUTE_FORCE"] = "brute_force";
    ThreatType["SQL_INJECTION"] = "sql_injection";
    ThreatType["XSS_ATTEMPT"] = "xss_attempt";
    ThreatType["CSRF_ATTEMPT"] = "csrf_attempt";
    ThreatType["UNAUTHORIZED_ACCESS"] = "unauthorized_access";
    ThreatType["DATA_EXFILTRATION"] = "data_exfiltration";
    ThreatType["PRIVILEGE_ESCALATION"] = "privilege_escalation";
    ThreatType["SUSPICIOUS_PATTERN"] = "suspicious_pattern";
})(ThreatType || (exports.ThreatType = ThreatType = {}));
var ThreatSeverity;
(function (ThreatSeverity) {
    ThreatSeverity["LOW"] = "low";
    ThreatSeverity["MEDIUM"] = "medium";
    ThreatSeverity["HIGH"] = "high";
    ThreatSeverity["CRITICAL"] = "critical";
})(ThreatSeverity || (exports.ThreatSeverity = ThreatSeverity = {}));
var PIIType;
(function (PIIType) {
    PIIType["SSN"] = "ssn";
    PIIType["EMAIL"] = "email";
    PIIType["PHONE"] = "phone";
    PIIType["CREDIT_CARD"] = "credit_card";
    PIIType["ADDRESS"] = "address";
    PIIType["NAME"] = "name";
    PIIType["DATE_OF_BIRTH"] = "date_of_birth";
    PIIType["MEDICAL_ID"] = "medical_id";
})(PIIType || (exports.PIIType = PIIType = {}));
//# sourceMappingURL=security.interfaces.js.map