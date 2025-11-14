"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthRecordStatus = exports.HealthRecordType = void 0;
var HealthRecordType;
(function (HealthRecordType) {
    HealthRecordType["VITAL_SIGNS"] = "VITAL_SIGNS";
    HealthRecordType["PHYSICAL_EXAM"] = "PHYSICAL_EXAM";
    HealthRecordType["IMMUNIZATION"] = "IMMUNIZATION";
    HealthRecordType["SCREENING"] = "SCREENING";
    HealthRecordType["INJURY"] = "INJURY";
    HealthRecordType["ILLNESS"] = "ILLNESS";
    HealthRecordType["MEDICATION_ADMIN"] = "MEDICATION_ADMIN";
    HealthRecordType["ALLERGY_REACTION"] = "ALLERGY_REACTION";
    HealthRecordType["MENTAL_HEALTH"] = "MENTAL_HEALTH";
    HealthRecordType["DENTAL"] = "DENTAL";
    HealthRecordType["VISION"] = "VISION";
    HealthRecordType["HEARING"] = "HEARING";
    HealthRecordType["NUTRITION"] = "NUTRITION";
    HealthRecordType["SLEEP"] = "SLEEP";
    HealthRecordType["DEVELOPMENT"] = "DEVELOPMENT";
    HealthRecordType["OTHER"] = "OTHER";
})(HealthRecordType || (exports.HealthRecordType = HealthRecordType = {}));
var HealthRecordStatus;
(function (HealthRecordStatus) {
    HealthRecordStatus["ACTIVE"] = "ACTIVE";
    HealthRecordStatus["ARCHIVED"] = "ARCHIVED";
    HealthRecordStatus["DELETED"] = "DELETED";
})(HealthRecordStatus || (exports.HealthRecordStatus = HealthRecordStatus = {}));
//# sourceMappingURL=health-record.repository.interface.js.map