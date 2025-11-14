"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENTITY_CACHE_TTL = exports.SENSITIVE_FIELDS = exports.PHI_ENTITY_TYPES = exports.AuditAction = exports.CacheTTL = exports.CacheEvictionPolicy = exports.TransactionIsolationLevel = void 0;
exports.isPHIEntity = isPHIEntity;
exports.getCacheTTL = getCacheTTL;
var TransactionIsolationLevel;
(function (TransactionIsolationLevel) {
    TransactionIsolationLevel["ReadUncommitted"] = "ReadUncommitted";
    TransactionIsolationLevel["ReadCommitted"] = "ReadCommitted";
    TransactionIsolationLevel["RepeatableRead"] = "RepeatableRead";
    TransactionIsolationLevel["Serializable"] = "Serializable";
})(TransactionIsolationLevel || (exports.TransactionIsolationLevel = TransactionIsolationLevel = {}));
var CacheEvictionPolicy;
(function (CacheEvictionPolicy) {
    CacheEvictionPolicy["LRU"] = "LRU";
    CacheEvictionPolicy["LFU"] = "LFU";
    CacheEvictionPolicy["FIFO"] = "FIFO";
    CacheEvictionPolicy["TTL"] = "TTL";
})(CacheEvictionPolicy || (exports.CacheEvictionPolicy = CacheEvictionPolicy = {}));
var CacheTTL;
(function (CacheTTL) {
    CacheTTL[CacheTTL["SHORT"] = 300] = "SHORT";
    CacheTTL[CacheTTL["MEDIUM"] = 900] = "MEDIUM";
    CacheTTL[CacheTTL["LONG"] = 1800] = "LONG";
    CacheTTL[CacheTTL["HOUR"] = 3600] = "HOUR";
    CacheTTL[CacheTTL["DAY"] = 86400] = "DAY";
})(CacheTTL || (exports.CacheTTL = CacheTTL = {}));
var AuditAction;
(function (AuditAction) {
    AuditAction["CREATE"] = "CREATE";
    AuditAction["READ"] = "READ";
    AuditAction["UPDATE"] = "UPDATE";
    AuditAction["DELETE"] = "DELETE";
    AuditAction["VIEW"] = "VIEW";
    AuditAction["EXPORT"] = "EXPORT";
    AuditAction["PRINT"] = "PRINT";
    AuditAction["LOGIN"] = "LOGIN";
    AuditAction["LOGOUT"] = "LOGOUT";
    AuditAction["IMPORT"] = "IMPORT";
    AuditAction["BULK_DELETE"] = "BULK_DELETE";
    AuditAction["BULK_UPDATE"] = "BULK_UPDATE";
    AuditAction["TRANSACTION_COMMIT"] = "TRANSACTION_COMMIT";
    AuditAction["TRANSACTION_ROLLBACK"] = "TRANSACTION_ROLLBACK";
    AuditAction["CACHE_READ"] = "CACHE_READ";
    AuditAction["CACHE_WRITE"] = "CACHE_WRITE";
    AuditAction["CACHE_DELETE"] = "CACHE_DELETE";
    AuditAction["AUTHENTICATION_FAILED"] = "AUTHENTICATION_FAILED";
    AuditAction["AUTHORIZATION_FAILED"] = "AUTHORIZATION_FAILED";
    AuditAction["RATE_LIMIT_EXCEEDED"] = "RATE_LIMIT_EXCEEDED";
    AuditAction["SERVER_ERROR"] = "SERVER_ERROR";
    AuditAction["HEALTHCARE_ERROR"] = "HEALTHCARE_ERROR";
    AuditAction["COMPLIANCE_ERROR"] = "COMPLIANCE_ERROR";
    AuditAction["SECURITY_ERROR"] = "SECURITY_ERROR";
    AuditAction["APPLICATION_ERROR"] = "APPLICATION_ERROR";
})(AuditAction || (exports.AuditAction = AuditAction = {}));
exports.PHI_ENTITY_TYPES = [
    'HealthRecord',
    'Allergy',
    'ChronicCondition',
    'Student',
    'StudentMedication',
    'MedicationLog',
    'IncidentReport',
    'EmergencyContact',
    'Vaccination',
    'Screening',
    'VitalSigns',
    'GrowthMeasurement',
];
exports.SENSITIVE_FIELDS = [
    'password',
    'ssn',
    'socialSecurityNumber',
    'taxId',
    'creditCard',
    'bankAccount',
    'apiKey',
    'secret',
    'token',
];
exports.ENTITY_CACHE_TTL = {
    HealthRecord: CacheTTL.SHORT,
    Allergy: CacheTTL.LONG,
    ChronicCondition: CacheTTL.MEDIUM,
    Student: CacheTTL.LONG,
    StudentMedication: CacheTTL.SHORT,
    User: CacheTTL.LONG,
    Appointment: CacheTTL.SHORT,
    Vaccination: CacheTTL.MEDIUM,
    Screening: CacheTTL.MEDIUM,
    VitalSigns: CacheTTL.SHORT,
    District: CacheTTL.DAY,
    School: CacheTTL.DAY,
    Role: CacheTTL.DAY,
    Permission: CacheTTL.DAY,
};
function isPHIEntity(entityType) {
    return exports.PHI_ENTITY_TYPES.includes(entityType);
}
function getCacheTTL(entityType) {
    return exports.ENTITY_CACHE_TTL[entityType] || CacheTTL.MEDIUM;
}
//# sourceMappingURL=database.enums.js.map