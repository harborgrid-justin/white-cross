/**
 * Dashboard Model Interfaces
 * Type definitions for Sequelize models used in dashboard services
 */

/**
 * Student model interface
 */
export interface StudentModel {
  id: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
  grade?: string;
  studentNumber?: string;
}

/**
 * Medication model interface
 */
export interface MedicationModel {
  id: string;
  name: string;
}

/**
 * User model interface (Nurse)
 */
export interface UserModel {
  id: string;
  firstName: string;
  lastName: string;
}

/**
 * Student Medication model interface
 */
export interface StudentMedicationModel {
  id: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  student?: StudentModel;
  medication?: MedicationModel;
}

/**
 * Medication Log model interface
 */
export interface MedicationLogModel {
  id: string;
  timeGiven: Date;
  studentMedication?: StudentMedicationModel;
  nurse?: UserModel;
}

/**
 * Incident Report model interface
 */
export interface IncidentReportModel {
  id: string;
  type: string;
  followUpRequired: boolean;
  occurredAt: Date;
  createdAt: Date;
  student?: StudentModel;
}

/**
 * Appointment model interface
 */
export interface AppointmentModel {
  id: string;
  type: string;
  status: string;
  scheduledAt: Date;
  createdAt: Date;
  student?: StudentModel;
}

/**
 * Allergy model interface
 */
export interface AllergyModel {
  id: string;
  severity: string;
  active: boolean;
  student?: StudentModel;
}

/**
 * Raw chart data from database query
 */
export interface ChartRawData {
  date: string;
  count: string | number;
}
