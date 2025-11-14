"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthcareMetricCategory = exports.MetricType = void 0;
var MetricType;
(function (MetricType) {
    MetricType["COUNTER"] = "counter";
    MetricType["GAUGE"] = "gauge";
    MetricType["HISTOGRAM"] = "histogram";
    MetricType["TIMER"] = "timer";
    MetricType["RATE"] = "rate";
})(MetricType || (exports.MetricType = MetricType = {}));
var HealthcareMetricCategory;
(function (HealthcareMetricCategory) {
    HealthcareMetricCategory["PATIENT_ACCESS"] = "patient_access";
    HealthcareMetricCategory["PHI_ACCESS"] = "phi_access";
    HealthcareMetricCategory["MEDICATION_ADMIN"] = "medication_administration";
    HealthcareMetricCategory["EMERGENCY_ACCESS"] = "emergency_access";
    HealthcareMetricCategory["AUDIT_EVENTS"] = "audit_events";
    HealthcareMetricCategory["COMPLIANCE"] = "compliance";
    HealthcareMetricCategory["SECURITY"] = "security";
    HealthcareMetricCategory["PERFORMANCE"] = "performance";
    HealthcareMetricCategory["USAGE"] = "usage";
})(HealthcareMetricCategory || (exports.HealthcareMetricCategory = HealthcareMetricCategory = {}));
//# sourceMappingURL=metrics.types.js.map