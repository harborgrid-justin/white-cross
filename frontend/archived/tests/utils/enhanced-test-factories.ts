/**
 * Enhanced Test Data Factories
 * Extended factories for comprehensive testing scenarios
 */

import {
  createTestUser,
  createTestStudent,
  createTestMedication,
  type TestStudent,
  type TestMedication,
} from './test-factories';

/**
 * Health Record type for testing
 */
export interface TestHealthRecord {
  id: string;
  studentId: string;
  type: 'visit' | 'immunization' | 'screening' | 'injury' | 'allergy' | 'condition';
  date: string;
  description: string;
  diagnosis?: string;
  treatment?: string;
  provider?: string;
  followUpRequired: boolean;
  notes?: string;
  attachments?: string[];
}

/**
 * Appointment type for testing
 */
export interface TestAppointment {
  id: string;
  studentId: string;
  type: 'checkup' | 'vaccination' | 'screening' | 'consultation';
  scheduledDate: string;
  duration: number;
  provider: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  reason?: string;
  notes?: string;
}

/**
 * Emergency Contact type for testing
 */
export interface TestEmergencyContact {
  id: string;
  studentId: string;
  name: string;
  relationship: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  isPrimary: boolean;
  canPickup: boolean;
}

/**
 * Dashboard Stats type for testing
 */
export interface TestDashboardStats {
  totalStudents: number;
  activeStudents: number;
  pendingAppointments: number;
  overdueRecords: number;
  medicationsToday: number;
  healthAlerts: number;
}

/**
 * Creates a test health record
 */
export function createTestHealthRecord(
  overrides?: Partial<TestHealthRecord>
): TestHealthRecord {
  return {
    id: 'hr-001',
    studentId: 'student-001',
    type: 'visit',
    date: new Date().toISOString(),
    description: 'Annual checkup',
    diagnosis: 'Healthy',
    treatment: 'None required',
    provider: 'Dr. Smith',
    followUpRequired: false,
    notes: 'Patient in good health',
    attachments: [],
    ...overrides,
  };
}

/**
 * Creates a test appointment
 */
export function createTestAppointment(
  overrides?: Partial<TestAppointment>
): TestAppointment {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);

  return {
    id: 'apt-001',
    studentId: 'student-001',
    type: 'checkup',
    scheduledDate: futureDate.toISOString(),
    duration: 30,
    provider: 'Dr. Smith',
    status: 'scheduled',
    reason: 'Annual physical examination',
    notes: '',
    ...overrides,
  };
}

/**
 * Creates a test emergency contact
 */
export function createTestEmergencyContact(
  overrides?: Partial<TestEmergencyContact>
): TestEmergencyContact {
  return {
    id: 'ec-001',
    studentId: 'student-001',
    name: 'Jane Doe',
    relationship: 'Mother',
    phone: '555-0123',
    alternatePhone: '555-0124',
    email: 'jane.doe@example.com',
    isPrimary: true,
    canPickup: true,
    ...overrides,
  };
}

/**
 * Creates test dashboard stats
 */
export function createTestDashboardStats(
  overrides?: Partial<TestDashboardStats>
): TestDashboardStats {
  return {
    totalStudents: 150,
    activeStudents: 142,
    pendingAppointments: 12,
    overdueRecords: 3,
    medicationsToday: 8,
    healthAlerts: 5,
    ...overrides,
  };
}

/**
 * Creates a student with health alerts
 */
export function createStudentWithHealthAlerts(
  overrides?: Partial<TestStudent>
): TestStudent {
  return createTestStudent({
    hasAllergies: true,
    hasMedications: true,
    hasChronicConditions: true,
    ...overrides,
  });
}

/**
 * Creates an array of health records
 */
export function createTestHealthRecords(
  count: number,
  overrides?: Partial<TestHealthRecord> | ((index: number) => Partial<TestHealthRecord>)
): TestHealthRecord[] {
  return Array.from({ length: count }, (_, index) => {
    const override =
      typeof overrides === 'function' ? overrides(index) : overrides;
    return createTestHealthRecord({ ...override, id: `hr-${index + 1}` });
  });
}

/**
 * Creates an array of appointments
 */
export function createTestAppointments(
  count: number,
  overrides?: Partial<TestAppointment> | ((index: number) => Partial<TestAppointment>)
): TestAppointment[] {
  return Array.from({ length: count }, (_, index) => {
    const override =
      typeof overrides === 'function' ? overrides(index) : overrides;
    return createTestAppointment({ ...override, id: `apt-${index + 1}` });
  });
}

/**
 * Creates an array of emergency contacts
 */
export function createTestEmergencyContacts(
  count: number,
  overrides?: Partial<TestEmergencyContact> | ((index: number) => Partial<TestEmergencyContact>)
): TestEmergencyContact[] {
  return Array.from({ length: count }, (_, index) => {
    const override =
      typeof overrides === 'function' ? overrides(index) : overrides;
    return createTestEmergencyContact({
      ...override,
      id: `ec-${index + 1}`,
      isPrimary: index === 0,
    });
  });
}

/**
 * Creates a complete student profile with all related data
 */
export function createCompleteStudentProfile(studentId: string = 'student-001') {
  return {
    student: createTestStudent({ id: studentId }),
    healthRecords: createTestHealthRecords(5, (i) => ({
      studentId,
      type: ['visit', 'immunization', 'screening', 'injury', 'allergy'][i] as any,
    })),
    medications: [
      createTestMedication({ studentId }),
      createTestMedication({ studentId, id: 'med-002', name: 'Allergy Medication' }),
    ],
    emergencyContacts: createTestEmergencyContacts(2, { studentId }),
    appointments: createTestAppointments(3, { studentId }),
  };
}

/**
 * Medication interaction scenario
 */
export interface MedicationInteractionScenario {
  medication1: TestMedication;
  medication2: TestMedication;
  hasInteraction: boolean;
  severity?: 'mild' | 'moderate' | 'severe';
  description?: string;
}

/**
 * Creates a medication interaction scenario
 */
export function createMedicationInteractionScenario(
  overrides?: Partial<MedicationInteractionScenario>
): MedicationInteractionScenario {
  return {
    medication1: createTestMedication({ id: 'med-001', name: 'Medication A' }),
    medication2: createTestMedication({ id: 'med-002', name: 'Medication B' }),
    hasInteraction: true,
    severity: 'moderate',
    description: 'May cause increased drowsiness',
    ...overrides,
  };
}

/**
 * Creates a test workflow state
 */
export interface WorkflowState<T> {
  step: number;
  data: T;
  isComplete: boolean;
  errors: Record<string, string>;
}

export function createWorkflowState<T>(
  data: T,
  overrides?: Partial<WorkflowState<T>>
): WorkflowState<T> {
  return {
    step: 1,
    data,
    isComplete: false,
    errors: {},
    ...overrides,
  };
}

// Export convenience aliases
export {
  createTestUser as createUser,
  createTestStudent as createStudent,
  createTestMedication as createMedication,
  createTestHealthRecord as createHealthRecord,
  createTestAppointment as createAppointment,
  createTestEmergencyContact as createEmergencyContact,
  createTestDashboardStats as createDashboardStats,
};
