"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MIME_TYPES = exports.CRON_EXPRESSIONS = exports.REPORT_CONFIG = exports.ScheduleFrequency = exports.ReportStatus = exports.OutputFormat = exports.ReportType = void 0;
var ReportType;
(function (ReportType) {
    ReportType["HEALTH_TRENDS"] = "health_trends";
    ReportType["MEDICATION_USAGE"] = "medication_usage";
    ReportType["INCIDENT_STATISTICS"] = "incident_statistics";
    ReportType["ATTENDANCE_CORRELATION"] = "attendance_correlation";
    ReportType["COMPLIANCE"] = "compliance";
    ReportType["DASHBOARD"] = "dashboard";
    ReportType["PERFORMANCE"] = "performance";
    ReportType["CUSTOM"] = "custom";
})(ReportType || (exports.ReportType = ReportType = {}));
var OutputFormat;
(function (OutputFormat) {
    OutputFormat["PDF"] = "pdf";
    OutputFormat["EXCEL"] = "excel";
    OutputFormat["CSV"] = "csv";
    OutputFormat["JSON"] = "json";
})(OutputFormat || (exports.OutputFormat = OutputFormat = {}));
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["PENDING"] = "pending";
    ReportStatus["GENERATING"] = "generating";
    ReportStatus["COMPLETED"] = "completed";
    ReportStatus["FAILED"] = "failed";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
var ScheduleFrequency;
(function (ScheduleFrequency) {
    ScheduleFrequency["DAILY"] = "daily";
    ScheduleFrequency["WEEKLY"] = "weekly";
    ScheduleFrequency["MONTHLY"] = "monthly";
    ScheduleFrequency["QUARTERLY"] = "quarterly";
    ScheduleFrequency["CUSTOM"] = "custom";
})(ScheduleFrequency || (exports.ScheduleFrequency = ScheduleFrequency = {}));
exports.REPORT_CONFIG = {
    DEFAULT_PAGE_SIZE: 100,
    MAX_PAGE_SIZE: 1000,
    DASHBOARD_CACHE_TTL: 300,
    REPORT_CACHE_TTL: 3600,
    REPORT_OUTPUT_DIR: 'reports/generated',
    TEMP_DIR: 'reports/temp',
    CLEANUP_AFTER_DAYS: 7,
    MAX_RECORDS_PER_REPORT: 10000,
    LARGE_REPORT_THRESHOLD: 1000,
    ASYNC_GENERATION_THRESHOLD: 5000,
    DEFAULT_LOOKBACK_DAYS: 30,
    MAX_DATE_RANGE_DAYS: 365,
};
exports.CRON_EXPRESSIONS = {
    DAILY_MIDNIGHT: '0 0 * * *',
    WEEKLY_MONDAY: '0 0 * * 1',
    MONTHLY_FIRST: '0 0 1 * *',
    QUARTERLY: '0 0 1 */3 *',
};
exports.MIME_TYPES = {
    PDF: 'application/pdf',
    EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    CSV: 'text/csv',
    JSON: 'application/json',
};
//# sourceMappingURL=report.constants.js.map