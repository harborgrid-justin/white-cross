/**
 * Healthcare Commands
 *
 * Command definitions for healthcare domain operations in the White Cross platform.
 * Commands represent write operations that change the state of the system.
 */

import { ICommand } from '../interfaces';

// Patient Management Commands
export class CreatePatientCommand implements ICommand {
  readonly type = 'CreatePatient';

  constructor(
    public readonly patientData: {
      firstName: string;
      lastName: string;
      dateOfBirth: Date;
      gender: 'M' | 'F' | 'O';
      emergencyContact: {
        name: string;
        phone: string;
        relationship: string;
      };
      medicalRecordNumber?: string;
    },
    public readonly createdBy: string
  ) {}
}

export class UpdatePatientCommand implements ICommand {
  readonly type = 'UpdatePatient';

  constructor(
    public readonly patientId: string,
    public readonly updates: Partial<{
      firstName: string;
      lastName: string;
      emergencyContact: {
        name: string;
        phone: string;
        relationship: string;
      };
    }>,
    public readonly updatedBy: string
  ) {}
}

export class AdmitPatientCommand implements ICommand {
  readonly type = 'AdmitPatient';

  constructor(
    public readonly patientId: string,
    public readonly admissionData: {
      reason: string;
      admittingPhysician: string;
      roomNumber?: string;
      admissionDate: Date;
    },
    public readonly admittedBy: string
  ) {}
}

export class DischargePatientCommand implements ICommand {
  readonly type = 'DischargePatient';

  constructor(
    public readonly patientId: string,
    public readonly dischargeData: {
      dischargeDate: Date;
      dischargeReason: string;
      dischargePhysician: string;
      followUpInstructions?: string;
    },
    public readonly dischargedBy: string
  ) {}
}

// Medication Commands
export class AdministerMedicationCommand implements ICommand {
  readonly type = 'AdministerMedication';

  constructor(
    public readonly patientId: string,
    public readonly medicationData: {
      medicationId: string;
      dosage: string;
      route: 'oral' | 'iv' | 'im' | 'topical' | 'inhaled';
      administeredAt: Date;
      administeredBy: string;
      notes?: string;
    }
  ) {}
}

export class PrescribeMedicationCommand implements ICommand {
  readonly type = 'PrescribeMedication';

  constructor(
    public readonly patientId: string,
    public readonly prescriptionData: {
      medicationId: string;
      dosage: string;
      frequency: string;
      duration: number; // in days
      prescribedBy: string;
      prescribedAt: Date;
      instructions?: string;
    }
  ) {}
}

export class DiscontinueMedicationCommand implements ICommand {
  readonly type = 'DiscontinueMedication';

  constructor(
    public readonly patientId: string,
    public readonly medicationId: string,
    public readonly discontinuedBy: string,
    public readonly reason: string,
    public readonly discontinuedAt: Date = new Date()
  ) {}
}

// Appointment Commands
export class ScheduleAppointmentCommand implements ICommand {
  readonly type = 'ScheduleAppointment';

  constructor(
    public readonly appointmentData: {
      patientId: string;
      providerId: string;
      appointmentType: string;
      scheduledDate: Date;
      duration: number; // in minutes
      reason: string;
      notes?: string;
    },
    public readonly scheduledBy: string
  ) {}
}

export class RescheduleAppointmentCommand implements ICommand {
  readonly type = 'RescheduleAppointment';

  constructor(
    public readonly appointmentId: string,
    public readonly newDate: Date,
    public readonly newDuration?: number,
    public readonly rescheduledBy: string,
    public readonly reason?: string
  ) {}
}

export class CancelAppointmentCommand implements ICommand {
  readonly type = 'CancelAppointment';

  constructor(
    public readonly appointmentId: string,
    public readonly cancelledBy: string,
    public readonly reason: string,
    public readonly cancelledAt: Date = new Date()
  ) {}
}

export class CompleteAppointmentCommand implements ICommand {
  readonly type = 'CompleteAppointment';

  constructor(
    public readonly appointmentId: string,
    public readonly completionData: {
      completedBy: string;
      completedAt: Date;
      notes?: string;
      followUpRequired?: boolean;
      followUpDate?: Date;
    }
  ) {}
}

// Incident Reporting Commands
export class ReportIncidentCommand implements ICommand {
  readonly type = 'ReportIncident';

  constructor(
    public readonly incidentData: {
      patientId?: string;
      incidentType: 'medication_error' | 'fall' | 'infection' | 'equipment_failure' | 'other';
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      location: string;
      occurredAt: Date;
      reportedBy: string;
      witnesses?: string[];
      immediateActions?: string;
    }
  ) {}
}

export class UpdateIncidentCommand implements ICommand {
  readonly type = 'UpdateIncident';

  constructor(
    public readonly incidentId: string,
    public readonly updates: Partial<{
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      investigationNotes: string;
      correctiveActions: string;
      status: 'investigating' | 'resolved' | 'closed';
    }>,
    public readonly updatedBy: string
  ) {}
}