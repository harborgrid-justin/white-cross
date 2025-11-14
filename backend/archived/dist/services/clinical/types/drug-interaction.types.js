"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskLevel = exports.InteractionSeverity = void 0;
var InteractionSeverity;
(function (InteractionSeverity) {
    InteractionSeverity["CONTRAINDICATED"] = "CONTRAINDICATED";
    InteractionSeverity["MAJOR"] = "MAJOR";
    InteractionSeverity["MODERATE"] = "MODERATE";
    InteractionSeverity["MINOR"] = "MINOR";
})(InteractionSeverity || (exports.InteractionSeverity = InteractionSeverity = {}));
var RiskLevel;
(function (RiskLevel) {
    RiskLevel["NONE"] = "NONE";
    RiskLevel["LOW"] = "LOW";
    RiskLevel["MODERATE"] = "MODERATE";
    RiskLevel["HIGH"] = "HIGH";
    RiskLevel["CRITICAL"] = "CRITICAL";
})(RiskLevel || (exports.RiskLevel = RiskLevel = {}));
//# sourceMappingURL=drug-interaction.types.js.map