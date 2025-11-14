"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncStatus = exports.ConflictResolution = exports.SyncPriority = exports.SyncEntityType = exports.SyncActionType = void 0;
var SyncActionType;
(function (SyncActionType) {
    SyncActionType["CREATE"] = "CREATE";
    SyncActionType["UPDATE"] = "UPDATE";
    SyncActionType["DELETE"] = "DELETE";
    SyncActionType["READ"] = "READ";
})(SyncActionType || (exports.SyncActionType = SyncActionType = {}));
var SyncEntityType;
(function (SyncEntityType) {
    SyncEntityType["STUDENT"] = "STUDENT";
    SyncEntityType["HEALTH_RECORD"] = "HEALTH_RECORD";
    SyncEntityType["MEDICATION"] = "MEDICATION";
    SyncEntityType["INCIDENT"] = "INCIDENT";
    SyncEntityType["VACCINATION"] = "VACCINATION";
    SyncEntityType["APPOINTMENT"] = "APPOINTMENT";
    SyncEntityType["SCREENING"] = "SCREENING";
    SyncEntityType["ALLERGY"] = "ALLERGY";
    SyncEntityType["CHRONIC_CONDITION"] = "CHRONIC_CONDITION";
})(SyncEntityType || (exports.SyncEntityType = SyncEntityType = {}));
var SyncPriority;
(function (SyncPriority) {
    SyncPriority["HIGH"] = "HIGH";
    SyncPriority["NORMAL"] = "NORMAL";
    SyncPriority["LOW"] = "LOW";
})(SyncPriority || (exports.SyncPriority = SyncPriority = {}));
var ConflictResolution;
(function (ConflictResolution) {
    ConflictResolution["CLIENT_WINS"] = "CLIENT_WINS";
    ConflictResolution["SERVER_WINS"] = "SERVER_WINS";
    ConflictResolution["NEWEST_WINS"] = "NEWEST_WINS";
    ConflictResolution["MERGE"] = "MERGE";
    ConflictResolution["MANUAL"] = "MANUAL";
})(ConflictResolution || (exports.ConflictResolution = ConflictResolution = {}));
var SyncStatus;
(function (SyncStatus) {
    SyncStatus["PENDING"] = "PENDING";
    SyncStatus["RESOLVED"] = "RESOLVED";
    SyncStatus["DEFERRED"] = "DEFERRED";
})(SyncStatus || (exports.SyncStatus = SyncStatus = {}));
//# sourceMappingURL=sync.enum.js.map