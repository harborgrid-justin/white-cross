"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsMetricType = exports.AnalyticsAggregationLevel = exports.AnalyticsReportType = exports.AnalyticsTimePeriod = void 0;
var AnalyticsTimePeriod;
(function (AnalyticsTimePeriod) {
    AnalyticsTimePeriod["DAILY"] = "DAILY";
    AnalyticsTimePeriod["WEEKLY"] = "WEEKLY";
    AnalyticsTimePeriod["MONTHLY"] = "MONTHLY";
    AnalyticsTimePeriod["QUARTERLY"] = "QUARTERLY";
    AnalyticsTimePeriod["YEARLY"] = "YEARLY";
})(AnalyticsTimePeriod || (exports.AnalyticsTimePeriod = AnalyticsTimePeriod = {}));
var AnalyticsReportType;
(function (AnalyticsReportType) {
    AnalyticsReportType["IMMUNIZATION_REPORT"] = "IMMUNIZATION_REPORT";
    AnalyticsReportType["COMPLIANCE_STATUS"] = "COMPLIANCE_STATUS";
    AnalyticsReportType["STUDENT_HEALTH_SUMMARY"] = "STUDENT_HEALTH_SUMMARY";
    AnalyticsReportType["HEALTH_METRICS"] = "HEALTH_METRICS";
})(AnalyticsReportType || (exports.AnalyticsReportType = AnalyticsReportType = {}));
var AnalyticsAggregationLevel;
(function (AnalyticsAggregationLevel) {
    AnalyticsAggregationLevel["STUDENT"] = "STUDENT";
    AnalyticsAggregationLevel["CLASS"] = "CLASS";
    AnalyticsAggregationLevel["SCHOOL"] = "SCHOOL";
    AnalyticsAggregationLevel["DISTRICT"] = "DISTRICT";
})(AnalyticsAggregationLevel || (exports.AnalyticsAggregationLevel = AnalyticsAggregationLevel = {}));
var AnalyticsMetricType;
(function (AnalyticsMetricType) {
    AnalyticsMetricType["HEALTH_VISITS"] = "HEALTH_VISITS";
    AnalyticsMetricType["MEDICATION_ADHERENCE"] = "MEDICATION_ADHERENCE";
    AnalyticsMetricType["INCIDENT_RATE"] = "INCIDENT_RATE";
    AnalyticsMetricType["IMMUNIZATION_COMPLIANCE"] = "IMMUNIZATION_COMPLIANCE";
    AnalyticsMetricType["APPOINTMENT_COMPLETION"] = "APPOINTMENT_COMPLETION";
})(AnalyticsMetricType || (exports.AnalyticsMetricType = AnalyticsMetricType = {}));
//# sourceMappingURL=analytics-interfaces.js.map