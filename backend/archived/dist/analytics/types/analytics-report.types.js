"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsTimePeriod = exports.AnalyticsReportType = void 0;
var AnalyticsReportType;
(function (AnalyticsReportType) {
    AnalyticsReportType["HEALTH_OVERVIEW"] = "HEALTH_OVERVIEW";
    AnalyticsReportType["MEDICATION_SUMMARY"] = "MEDICATION_SUMMARY";
    AnalyticsReportType["STUDENT_HEALTH_SUMMARY"] = "STUDENT_HEALTH_SUMMARY";
    AnalyticsReportType["COMPLIANCE_REPORT"] = "COMPLIANCE_REPORT";
    AnalyticsReportType["DASHBOARD_SUMMARY"] = "DASHBOARD_SUMMARY";
    AnalyticsReportType["INCIDENT_ANALYSIS"] = "INCIDENT_ANALYSIS";
    AnalyticsReportType["APPOINTMENT_ANALYTICS"] = "APPOINTMENT_ANALYTICS";
})(AnalyticsReportType || (exports.AnalyticsReportType = AnalyticsReportType = {}));
var AnalyticsTimePeriod;
(function (AnalyticsTimePeriod) {
    AnalyticsTimePeriod["LAST_7_DAYS"] = "LAST_7_DAYS";
    AnalyticsTimePeriod["LAST_30_DAYS"] = "LAST_30_DAYS";
    AnalyticsTimePeriod["LAST_90_DAYS"] = "LAST_90_DAYS";
    AnalyticsTimePeriod["LAST_6_MONTHS"] = "LAST_6_MONTHS";
    AnalyticsTimePeriod["LAST_YEAR"] = "LAST_YEAR";
    AnalyticsTimePeriod["CUSTOM"] = "CUSTOM";
})(AnalyticsTimePeriod || (exports.AnalyticsTimePeriod = AnalyticsTimePeriod = {}));
//# sourceMappingURL=analytics-report.types.js.map