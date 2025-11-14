"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureFlag = exports.MonitoringLevel = exports.ProviderType = void 0;
var ProviderType;
(function (ProviderType) {
    ProviderType["EXPERIMENTAL"] = "experimental";
    ProviderType["ANALYTICS"] = "analytics";
    ProviderType["CACHEABLE"] = "cacheable";
    ProviderType["MONITORED"] = "monitored";
    ProviderType["RATE_LIMITED"] = "rate-limited";
    ProviderType["ALL"] = "all";
})(ProviderType || (exports.ProviderType = ProviderType = {}));
var MonitoringLevel;
(function (MonitoringLevel) {
    MonitoringLevel["BASIC"] = "basic";
    MonitoringLevel["DETAILED"] = "detailed";
})(MonitoringLevel || (exports.MonitoringLevel = MonitoringLevel = {}));
var FeatureFlag;
(function (FeatureFlag) {
    FeatureFlag["EXPERIMENTAL"] = "experimental";
    FeatureFlag["BETA"] = "beta";
    FeatureFlag["STABLE"] = "stable";
    FeatureFlag["DEPRECATED"] = "deprecated";
})(FeatureFlag || (exports.FeatureFlag = FeatureFlag = {}));
//# sourceMappingURL=provider-type.enum.js.map