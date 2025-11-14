"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAuditTrailQuery = exports.GetComplianceReportQuery = exports.GetSafetyMetricsQuery = exports.GetIncidentsQuery = exports.GetMedicationInventoryQuery = exports.GetPatientCensusQuery = exports.GetDashboardMetricsQuery = exports.GetAppointmentConflictsQuery = exports.GetProviderScheduleQuery = exports.GetPatientAppointmentsQuery = exports.GetMedicationAlertsQuery = exports.GetMedicationAdministrationHistoryQuery = exports.GetPatientMedicationsQuery = exports.GetPatientAlertsQuery = exports.GetPatientHistoryQuery = exports.GetPatientsQuery = exports.GetPatientQuery = void 0;
class GetPatientQuery {
    patientId;
    includePHI;
    requestingUserId;
    type = 'GetPatient';
    constructor(patientId, includePHI = false, requestingUserId) {
        this.patientId = patientId;
        this.includePHI = includePHI;
        this.requestingUserId = requestingUserId;
    }
}
exports.GetPatientQuery = GetPatientQuery;
class GetPatientsQuery {
    filters;
    pagination;
    sort;
    requestingUserId;
    type = 'GetPatients';
    constructor(filters, pagination, sort, requestingUserId) {
        this.filters = filters;
        this.pagination = pagination;
        this.sort = sort;
        this.requestingUserId = requestingUserId;
    }
}
exports.GetPatientsQuery = GetPatientsQuery;
class GetPatientHistoryQuery {
    patientId;
    dateRange;
    includeTypes;
    requestingUserId;
    type = 'GetPatientHistory';
    constructor(patientId, dateRange, includeTypes, requestingUserId) {
        this.patientId = patientId;
        this.dateRange = dateRange;
        this.includeTypes = includeTypes;
        this.requestingUserId = requestingUserId;
    }
}
exports.GetPatientHistoryQuery = GetPatientHistoryQuery;
class GetPatientAlertsQuery {
    patientId;
    alertTypes;
    requestingUserId;
    type = 'GetPatientAlerts';
    constructor(patientId, alertTypes, requestingUserId) {
        this.patientId = patientId;
        this.alertTypes = alertTypes;
        this.requestingUserId = requestingUserId;
    }
}
exports.GetPatientAlertsQuery = GetPatientAlertsQuery;
class GetPatientMedicationsQuery {
    patientId;
    filters;
    requestingUserId;
    type = 'GetPatientMedications';
    constructor(patientId, filters, requestingUserId) {
        this.patientId = patientId;
        this.filters = filters;
        this.requestingUserId = requestingUserId;
    }
}
exports.GetPatientMedicationsQuery = GetPatientMedicationsQuery;
class GetMedicationAdministrationHistoryQuery {
    patientId;
    medicationId;
    dateRange;
    requestingUserId;
    type = 'GetMedicationAdministrationHistory';
    constructor(patientId, medicationId, dateRange, requestingUserId) {
        this.patientId = patientId;
        this.medicationId = medicationId;
        this.dateRange = dateRange;
        this.requestingUserId = requestingUserId;
    }
}
exports.GetMedicationAdministrationHistoryQuery = GetMedicationAdministrationHistoryQuery;
class GetMedicationAlertsQuery {
    patientId;
    alertTypes;
    requestingUserId;
    type = 'GetMedicationAlerts';
    constructor(patientId, alertTypes, requestingUserId) {
        this.patientId = patientId;
        this.alertTypes = alertTypes;
        this.requestingUserId = requestingUserId;
    }
}
exports.GetMedicationAlertsQuery = GetMedicationAlertsQuery;
class GetPatientAppointmentsQuery {
    patientId;
    filters;
    requestingUserId;
    type = 'GetPatientAppointments';
    constructor(patientId, filters, requestingUserId) {
        this.patientId = patientId;
        this.filters = filters;
        this.requestingUserId = requestingUserId;
    }
}
exports.GetPatientAppointmentsQuery = GetPatientAppointmentsQuery;
class GetProviderScheduleQuery {
    providerId;
    dateRange;
    requestingUserId;
    type = 'GetProviderSchedule';
    constructor(providerId, dateRange, requestingUserId) {
        this.providerId = providerId;
        this.dateRange = dateRange;
        this.requestingUserId = requestingUserId;
    }
}
exports.GetProviderScheduleQuery = GetProviderScheduleQuery;
class GetAppointmentConflictsQuery {
    providerId;
    proposedTime;
    requestingUserId;
    type = 'GetAppointmentConflicts';
    constructor(providerId, proposedTime, requestingUserId) {
        this.providerId = providerId;
        this.proposedTime = proposedTime;
        this.requestingUserId = requestingUserId;
    }
}
exports.GetAppointmentConflictsQuery = GetAppointmentConflictsQuery;
class GetDashboardMetricsQuery {
    dateRange;
    metrics;
    requestingUserId;
    type = 'GetDashboardMetrics';
    constructor(dateRange, metrics, requestingUserId) {
        this.dateRange = dateRange;
        this.metrics = metrics;
        this.requestingUserId = requestingUserId;
    }
}
exports.GetDashboardMetricsQuery = GetDashboardMetricsQuery;
class GetPatientCensusQuery {
    requestingUserId;
    type = 'GetPatientCensus';
    constructor(requestingUserId) {
        this.requestingUserId = requestingUserId;
    }
}
exports.GetPatientCensusQuery = GetPatientCensusQuery;
class GetMedicationInventoryQuery {
    filters;
    requestingUserId;
    type = 'GetMedicationInventory';
    constructor(filters, requestingUserId) {
        this.filters = filters;
        this.requestingUserId = requestingUserId;
    }
}
exports.GetMedicationInventoryQuery = GetMedicationInventoryQuery;
class GetIncidentsQuery {
    filters;
    pagination;
    requestingUserId;
    type = 'GetIncidents';
    constructor(filters, pagination, requestingUserId) {
        this.filters = filters;
        this.pagination = pagination;
        this.requestingUserId = requestingUserId;
    }
}
exports.GetIncidentsQuery = GetIncidentsQuery;
class GetSafetyMetricsQuery {
    dateRange;
    requestingUserId;
    type = 'GetSafetyMetrics';
    constructor(dateRange, requestingUserId) {
        this.dateRange = dateRange;
        this.requestingUserId = requestingUserId;
    }
}
exports.GetSafetyMetricsQuery = GetSafetyMetricsQuery;
class GetComplianceReportQuery {
    reportType;
    dateRange;
    requestingUserId;
    type = 'GetComplianceReport';
    constructor(reportType, dateRange, requestingUserId) {
        this.reportType = reportType;
        this.dateRange = dateRange;
        this.requestingUserId = requestingUserId;
    }
}
exports.GetComplianceReportQuery = GetComplianceReportQuery;
class GetAuditTrailQuery {
    filters;
    pagination;
    requestingUserId;
    type = 'GetAuditTrail';
    constructor(filters, pagination, requestingUserId) {
        this.filters = filters;
        this.pagination = pagination;
        this.requestingUserId = requestingUserId;
    }
}
exports.GetAuditTrailQuery = GetAuditTrailQuery;
//# sourceMappingURL=queries.js.map