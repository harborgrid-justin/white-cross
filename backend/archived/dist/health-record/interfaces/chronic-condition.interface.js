"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionSeverity = exports.ConditionStatus = void 0;
var ConditionStatus;
(function (ConditionStatus) {
    ConditionStatus["ACTIVE"] = "ACTIVE";
    ConditionStatus["MANAGED"] = "MANAGED";
    ConditionStatus["RESOLVED"] = "RESOLVED";
    ConditionStatus["MONITORING"] = "MONITORING";
})(ConditionStatus || (exports.ConditionStatus = ConditionStatus = {}));
var ConditionSeverity;
(function (ConditionSeverity) {
    ConditionSeverity["MILD"] = "MILD";
    ConditionSeverity["MODERATE"] = "MODERATE";
    ConditionSeverity["SEVERE"] = "SEVERE";
    ConditionSeverity["CRITICAL"] = "CRITICAL";
})(ConditionSeverity || (exports.ConditionSeverity = ConditionSeverity = {}));
//# sourceMappingURL=chronic-condition.interface.js.map