"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentAction = exports.DocumentAccessLevel = exports.DocumentStatus = exports.DocumentCategory = void 0;
var DocumentCategory;
(function (DocumentCategory) {
    DocumentCategory["MEDICAL_RECORD"] = "MEDICAL_RECORD";
    DocumentCategory["INCIDENT_REPORT"] = "INCIDENT_REPORT";
    DocumentCategory["CONSENT_FORM"] = "CONSENT_FORM";
    DocumentCategory["POLICY"] = "POLICY";
    DocumentCategory["TRAINING"] = "TRAINING";
    DocumentCategory["ADMINISTRATIVE"] = "ADMINISTRATIVE";
    DocumentCategory["STUDENT_FILE"] = "STUDENT_FILE";
    DocumentCategory["INSURANCE"] = "INSURANCE";
    DocumentCategory["OTHER"] = "OTHER";
})(DocumentCategory || (exports.DocumentCategory = DocumentCategory = {}));
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["DRAFT"] = "DRAFT";
    DocumentStatus["PENDING_REVIEW"] = "PENDING_REVIEW";
    DocumentStatus["APPROVED"] = "APPROVED";
    DocumentStatus["ARCHIVED"] = "ARCHIVED";
    DocumentStatus["EXPIRED"] = "EXPIRED";
})(DocumentStatus || (exports.DocumentStatus = DocumentStatus = {}));
var DocumentAccessLevel;
(function (DocumentAccessLevel) {
    DocumentAccessLevel["PUBLIC"] = "PUBLIC";
    DocumentAccessLevel["STAFF_ONLY"] = "STAFF_ONLY";
    DocumentAccessLevel["ADMIN_ONLY"] = "ADMIN_ONLY";
    DocumentAccessLevel["RESTRICTED"] = "RESTRICTED";
})(DocumentAccessLevel || (exports.DocumentAccessLevel = DocumentAccessLevel = {}));
var DocumentAction;
(function (DocumentAction) {
    DocumentAction["CREATED"] = "CREATED";
    DocumentAction["VIEWED"] = "VIEWED";
    DocumentAction["DOWNLOADED"] = "DOWNLOADED";
    DocumentAction["UPDATED"] = "UPDATED";
    DocumentAction["DELETED"] = "DELETED";
    DocumentAction["SHARED"] = "SHARED";
    DocumentAction["SIGNED"] = "SIGNED";
    DocumentAction["ARCHIVED"] = "ARCHIVED";
    DocumentAction["RESTORED"] = "RESTORED";
})(DocumentAction || (exports.DocumentAction = DocumentAction = {}));
//# sourceMappingURL=document.enums.js.map