"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceLevel = exports.CacheTier = void 0;
var CacheTier;
(function (CacheTier) {
    CacheTier["L1"] = "L1";
    CacheTier["L2"] = "L2";
    CacheTier["L3"] = "L3";
})(CacheTier || (exports.CacheTier = CacheTier = {}));
var ComplianceLevel;
(function (ComplianceLevel) {
    ComplianceLevel["PUBLIC"] = "PUBLIC";
    ComplianceLevel["INTERNAL"] = "INTERNAL";
    ComplianceLevel["SENSITIVE"] = "SENSITIVE";
    ComplianceLevel["PHI"] = "PHI";
    ComplianceLevel["SENSITIVE_PHI"] = "SENSITIVE_PHI";
})(ComplianceLevel || (exports.ComplianceLevel = ComplianceLevel = {}));
//# sourceMappingURL=cache-interfaces.js.map