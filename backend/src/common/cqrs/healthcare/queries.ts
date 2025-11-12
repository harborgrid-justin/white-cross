/**
 * Healthcare Queries
 *
 * Query definitions for healthcare domain read operations in the White Cross platform.
 * Queries represent read operations that retrieve data without modifying state.
 */

import { IQuery } from '../interfaces';

// Patient Queries
export class GetPatientQuery implements IQuery {
  readonly type = 'GetPatient';

  constructor(
    public readonly patientId: string,
    public readonly includePHI: boolean = false,
    public readonly requestingUserId: string,
  ) {}
}

export class GetPatientsQuery implements IQuery {
  readonly type = 'GetPatients';

  constructor(
    public readonly filters?: {
      name?: string;
      dateOfBirth?: Date;
      gender?: 'M' | 'F' | 'O';
      admissionStatus?: 'admitted' | 'discharged' | 'outpatient';
      lastVisitAfter?: Date;
      lastVisitBefore?: Date;
    },
    public readonly pagination?: {
      page: number;
      limit: number;
    },
    public readonly sort?: {
      field: 'name' | 'dateOfBirth' | 'lastVisit' | 'admissionDate';
      order: 'asc' | 'desc';
    },
    public readonly requestingUserId: string,
  ) {}
}

export class GetPatientHistoryQuery implements IQuery {
  readonly type = 'GetPatientHistory';

  constructor(
    public readonly patientId: string,
    public readonly dateRange?: {
      start: Date;
      end: Date;
    },
    public readonly includeTypes?: ('admissions' | 'medications' | 'appointments' | 'incidents')[],
    public readonly requestingUserId: string,
  ) {}
}

export class GetPatientAlertsQuery implements IQuery {
  readonly type = 'GetPatientAlerts';

  constructor(
    public readonly patientId: string,
    public readonly alertTypes?: ('medication' | 'allergy' | 'appointment' | 'incident')[],
    public readonly requestingUserId: string,
  ) {}
}

// Medication Queries
export class GetPatientMedicationsQuery implements IQuery {
  readonly type = 'GetPatientMedications';

  constructor(
    public readonly patientId: string,
    public readonly filters?: {
      status?: 'active' | 'discontinued' | 'completed';
      medicationType?: string;
      prescribedAfter?: Date;
      prescribedBefore?: Date;
    },
    public readonly requestingUserId: string,
  ) {}
}

export class GetMedicationAdministrationHistoryQuery implements IQuery {
  readonly type = 'GetMedicationAdministrationHistory';

  constructor(
    public readonly patientId: string,
    public readonly medicationId?: string,
    public readonly dateRange?: {
      start: Date;
      end: Date;
    },
    public readonly requestingUserId: string,
  ) {}
}

export class GetMedicationAlertsQuery implements IQuery {
  readonly type = 'GetMedicationAlerts';

  constructor(
    public readonly patientId?: string,
    public readonly alertTypes?: ('overdue' | 'missed' | 'interaction' | 'allergy')[],
    public readonly requestingUserId: string,
  ) {}
}

// Appointment Queries
export class GetPatientAppointmentsQuery implements IQuery {
  readonly type = 'GetPatientAppointments';

  constructor(
    public readonly patientId: string,
    public readonly filters?: {
      status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
      appointmentType?: string;
      dateRange?: {
        start: Date;
        end: Date;
      };
    },
    public readonly requestingUserId: string,
  ) {}
}

export class GetProviderScheduleQuery implements IQuery {
  readonly type = 'GetProviderSchedule';

  constructor(
    public readonly providerId: string,
    public readonly dateRange: {
      start: Date;
      end: Date;
    },
    public readonly requestingUserId: string,
  ) {}
}

export class GetAppointmentConflictsQuery implements IQuery {
  readonly type = 'GetAppointmentConflicts';

  constructor(
    public readonly providerId: string,
    public readonly proposedTime: {
      start: Date;
      end: Date;
    },
    public readonly requestingUserId: string,
  ) {}
}

// Dashboard and Analytics Queries
export class GetDashboardMetricsQuery implements IQuery {
  readonly type = 'GetDashboardMetrics';

  constructor(
    public readonly dateRange: {
      start: Date;
      end: Date;
    },
    public readonly metrics: (
      | 'patient_count'
      | 'appointment_count'
      | 'medication_administered'
      | 'incident_count'
    )[],
    public readonly requestingUserId: string,
  ) {}
}

export class GetPatientCensusQuery implements IQuery {
  readonly type = 'GetPatientCensus';

  constructor(public readonly requestingUserId: string) {}
}

export class GetMedicationInventoryQuery implements IQuery {
  readonly type = 'GetMedicationInventory';

  constructor(
    public readonly filters?: {
      medicationType?: string;
      lowStock?: boolean;
      expired?: boolean;
    },
    public readonly requestingUserId: string,
  ) {}
}

// Incident and Safety Queries
export class GetIncidentsQuery implements IQuery {
  readonly type = 'GetIncidents';

  constructor(
    public readonly filters?: {
      incidentType?: string;
      severity?: 'low' | 'medium' | 'high' | 'critical';
      status?: 'investigating' | 'resolved' | 'closed';
      dateRange?: {
        start: Date;
        end: Date;
      };
      patientId?: string;
    },
    public readonly pagination?: {
      page: number;
      limit: number;
    },
    public readonly requestingUserId: string,
  ) {}
}

export class GetSafetyMetricsQuery implements IQuery {
  readonly type = 'GetSafetyMetrics';

  constructor(
    public readonly dateRange: {
      start: Date;
      end: Date;
    },
    public readonly requestingUserId: string,
  ) {}
}

// Reporting Queries
export class GetComplianceReportQuery implements IQuery {
  readonly type = 'GetComplianceReport';

  constructor(
    public readonly reportType: 'hipaa' | 'medication' | 'incident' | 'staffing',
    public readonly dateRange: {
      start: Date;
      end: Date;
    },
    public readonly requestingUserId: string,
  ) {}
}

export class GetAuditTrailQuery implements IQuery {
  readonly type = 'GetAuditTrail';

  constructor(
    public readonly filters: {
      userId?: string;
      action?: string;
      resourceType?: string;
      dateRange: {
        start: Date;
        end: Date;
      };
      containsPHI?: boolean;
    },
    public readonly pagination?: {
      page: number;
      limit: number;
    },
    public readonly requestingUserId: string,
  ) {}
}
