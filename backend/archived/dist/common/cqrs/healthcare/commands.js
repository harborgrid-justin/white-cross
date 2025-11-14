"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateIncidentCommand = exports.ReportIncidentCommand = exports.CompleteAppointmentCommand = exports.CancelAppointmentCommand = exports.RescheduleAppointmentCommand = exports.ScheduleAppointmentCommand = exports.DiscontinueMedicationCommand = exports.PrescribeMedicationCommand = exports.AdministerMedicationCommand = exports.DischargePatientCommand = exports.AdmitPatientCommand = exports.UpdatePatientCommand = exports.CreatePatientCommand = void 0;
class CreatePatientCommand {
    patientData;
    createdBy;
    type = 'CreatePatient';
    constructor(patientData, createdBy) {
        this.patientData = patientData;
        this.createdBy = createdBy;
    }
}
exports.CreatePatientCommand = CreatePatientCommand;
class UpdatePatientCommand {
    patientId;
    updates;
    updatedBy;
    type = 'UpdatePatient';
    constructor(patientId, updates, updatedBy) {
        this.patientId = patientId;
        this.updates = updates;
        this.updatedBy = updatedBy;
    }
}
exports.UpdatePatientCommand = UpdatePatientCommand;
class AdmitPatientCommand {
    patientId;
    admissionData;
    admittedBy;
    type = 'AdmitPatient';
    constructor(patientId, admissionData, admittedBy) {
        this.patientId = patientId;
        this.admissionData = admissionData;
        this.admittedBy = admittedBy;
    }
}
exports.AdmitPatientCommand = AdmitPatientCommand;
class DischargePatientCommand {
    patientId;
    dischargeData;
    dischargedBy;
    type = 'DischargePatient';
    constructor(patientId, dischargeData, dischargedBy) {
        this.patientId = patientId;
        this.dischargeData = dischargeData;
        this.dischargedBy = dischargedBy;
    }
}
exports.DischargePatientCommand = DischargePatientCommand;
class AdministerMedicationCommand {
    patientId;
    medicationData;
    type = 'AdministerMedication';
    constructor(patientId, medicationData) {
        this.patientId = patientId;
        this.medicationData = medicationData;
    }
}
exports.AdministerMedicationCommand = AdministerMedicationCommand;
class PrescribeMedicationCommand {
    patientId;
    prescriptionData;
    type = 'PrescribeMedication';
    constructor(patientId, prescriptionData) {
        this.patientId = patientId;
        this.prescriptionData = prescriptionData;
    }
}
exports.PrescribeMedicationCommand = PrescribeMedicationCommand;
class DiscontinueMedicationCommand {
    patientId;
    medicationId;
    discontinuedBy;
    reason;
    discontinuedAt;
    type = 'DiscontinueMedication';
    constructor(patientId, medicationId, discontinuedBy, reason, discontinuedAt = new Date()) {
        this.patientId = patientId;
        this.medicationId = medicationId;
        this.discontinuedBy = discontinuedBy;
        this.reason = reason;
        this.discontinuedAt = discontinuedAt;
    }
}
exports.DiscontinueMedicationCommand = DiscontinueMedicationCommand;
class ScheduleAppointmentCommand {
    appointmentData;
    scheduledBy;
    type = 'ScheduleAppointment';
    constructor(appointmentData, scheduledBy) {
        this.appointmentData = appointmentData;
        this.scheduledBy = scheduledBy;
    }
}
exports.ScheduleAppointmentCommand = ScheduleAppointmentCommand;
class RescheduleAppointmentCommand {
    appointmentId;
    newDate;
    newDuration;
    rescheduledBy;
    reason;
    type = 'RescheduleAppointment';
    constructor(appointmentId, newDate, newDuration, rescheduledBy, reason) {
        this.appointmentId = appointmentId;
        this.newDate = newDate;
        this.newDuration = newDuration;
        this.rescheduledBy = rescheduledBy;
        this.reason = reason;
    }
}
exports.RescheduleAppointmentCommand = RescheduleAppointmentCommand;
class CancelAppointmentCommand {
    appointmentId;
    cancelledBy;
    reason;
    cancelledAt;
    type = 'CancelAppointment';
    constructor(appointmentId, cancelledBy, reason, cancelledAt = new Date()) {
        this.appointmentId = appointmentId;
        this.cancelledBy = cancelledBy;
        this.reason = reason;
        this.cancelledAt = cancelledAt;
    }
}
exports.CancelAppointmentCommand = CancelAppointmentCommand;
class CompleteAppointmentCommand {
    appointmentId;
    completionData;
    type = 'CompleteAppointment';
    constructor(appointmentId, completionData) {
        this.appointmentId = appointmentId;
        this.completionData = completionData;
    }
}
exports.CompleteAppointmentCommand = CompleteAppointmentCommand;
class ReportIncidentCommand {
    incidentData;
    type = 'ReportIncident';
    constructor(incidentData) {
        this.incidentData = incidentData;
    }
}
exports.ReportIncidentCommand = ReportIncidentCommand;
class UpdateIncidentCommand {
    incidentId;
    updates;
    updatedBy;
    type = 'UpdateIncident';
    constructor(incidentId, updates, updatedBy) {
        this.incidentId = incidentId;
        this.updates = updates;
        this.updatedBy = updatedBy;
    }
}
exports.UpdateIncidentCommand = UpdateIncidentCommand;
//# sourceMappingURL=commands.js.map