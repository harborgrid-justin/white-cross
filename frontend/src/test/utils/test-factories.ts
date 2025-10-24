/**
 * Test Data Factories
 * Helper functions to generate test data
 */

import { nanoid } from 'nanoid';

/**
 * User factory
 */
export function createMockUser(overrides = {}) {
  return {
    id: nanoid(),
    email: 'test@example.com',
    name: 'Test User',
    role: 'NURSE',
    firstName: 'Test',
    lastName: 'User',
    phone: '555-0123',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Student factory
 */
export function createMockStudent(overrides = {}) {
  return {
    id: nanoid(),
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '2010-01-15',
    grade: '5',
    studentId: `STU-${Math.floor(Math.random() * 10000)}`,
    gender: 'male',
    active: true,
    schoolId: nanoid(),
    districtId: nanoid(),
    emergencyContacts: [],
    allergies: [],
    medications: [],
    chronicConditions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Health Record factory
 */
export function createMockHealthRecord(overrides = {}) {
  return {
    id: nanoid(),
    studentId: nanoid(),
    type: 'VITALS',
    date: new Date().toISOString(),
    vitals: {
      height: 150,
      weight: 45,
      bmi: 20,
      temperature: 98.6,
      bloodPressure: '120/80',
      heartRate: 72,
    },
    notes: 'Regular checkup',
    recordedBy: nanoid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Allergy factory
 */
export function createMockAllergy(overrides = {}) {
  return {
    id: nanoid(),
    studentId: nanoid(),
    allergen: 'Peanuts',
    severity: 'SEVERE',
    reaction: 'Anaphylaxis',
    diagnosedDate: '2020-05-15',
    notes: 'Carries EpiPen',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Medication factory
 */
export function createMockMedication(overrides = {}) {
  return {
    id: nanoid(),
    studentId: nanoid(),
    name: 'Amoxicillin',
    dosage: '250mg',
    frequency: 'Twice daily',
    startDate: new Date().toISOString(),
    endDate: null,
    prescribedBy: 'Dr. Smith',
    notes: 'Take with food',
    active: true,
    administrationLog: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Appointment factory
 */
export function createMockAppointment(overrides = {}) {
  return {
    id: nanoid(),
    studentId: nanoid(),
    type: 'CHECKUP',
    date: new Date().toISOString(),
    time: '10:00 AM',
    duration: 30,
    status: 'SCHEDULED',
    provider: nanoid(),
    location: 'School Clinic',
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Incident Report factory
 */
export function createMockIncidentReport(overrides = {}) {
  return {
    id: nanoid(),
    studentId: nanoid(),
    type: 'INJURY',
    date: new Date().toISOString(),
    location: 'Playground',
    description: 'Student fell and scraped knee',
    severity: 'MINOR',
    firstAid: 'Cleaned and bandaged',
    reportedBy: nanoid(),
    status: 'OPEN',
    followUpRequired: false,
    parentNotified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Emergency Contact factory
 */
export function createMockEmergencyContact(overrides = {}) {
  return {
    id: nanoid(),
    studentId: nanoid(),
    name: 'Jane Doe',
    relationship: 'Mother',
    phone: '555-0123',
    alternatePhone: '555-0124',
    email: 'jane.doe@example.com',
    address: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
    isPrimary: true,
    canPickup: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Vaccination factory
 */
export function createMockVaccination(overrides = {}) {
  return {
    id: nanoid(),
    studentId: nanoid(),
    name: 'MMR',
    dateAdministered: '2020-03-15',
    doseNumber: 1,
    provider: 'Dr. Johnson',
    lotNumber: 'LOT-12345',
    expirationDate: '2025-03-15',
    site: 'Left arm',
    route: 'Intramuscular',
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Chronic Condition factory
 */
export function createMockChronicCondition(overrides = {}) {
  return {
    id: nanoid(),
    studentId: nanoid(),
    condition: 'Asthma',
    diagnosedDate: '2018-06-20',
    severity: 'MODERATE',
    treatment: 'Inhaler as needed',
    managementPlan: 'Use inhaler before exercise',
    physician: 'Dr. Williams',
    notes: 'Keep inhaler in office',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * School factory
 */
export function createMockSchool(overrides = {}) {
  return {
    id: nanoid(),
    name: 'Lincoln Elementary',
    districtId: nanoid(),
    address: '456 School St',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
    phone: '555-0200',
    principal: 'Principal Smith',
    studentCount: 500,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * District factory
 */
export function createMockDistrict(overrides = {}) {
  return {
    id: nanoid(),
    name: 'Springfield School District',
    code: 'SSDIST-001',
    superintendent: 'Dr. Brown',
    address: '789 District Ave',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
    phone: '555-0300',
    schoolCount: 12,
    studentCount: 6000,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Generate multiple items
 */
export function createMockList<T>(
  factory: (overrides?: any) => T,
  count: number,
  overridesArray: any[] = []
): T[] {
  return Array.from({ length: count }, (_, index) =>
    factory(overridesArray[index] || {})
  );
}

/**
 * Auth state factory
 */
export function createMockAuthState(overrides = {}) {
  return {
    user: createMockUser(),
    token: 'mock-jwt-token',
    isAuthenticated: true,
    isLoading: false,
    error: null,
    ...overrides,
  };
}

/**
 * Pagination factory
 */
export function createMockPagination(overrides = {}) {
  return {
    page: 1,
    limit: 10,
    total: 100,
    totalPages: 10,
    hasNextPage: true,
    hasPreviousPage: false,
    ...overrides,
  };
}

/**
 * API Response factory
 */
export function createMockApiResponse<T>(data: T, overrides = {}) {
  return {
    success: true,
    data,
    message: 'Success',
    ...overrides,
  };
}

/**
 * API Error factory
 */
export function createMockApiError(overrides = {}) {
  return {
    success: false,
    error: 'An error occurred',
    message: 'Something went wrong',
    statusCode: 500,
    ...overrides,
  };
}

/**
 * Query Result factory (React Query)
 */
export function createMockQueryResult<T>(data: T, overrides = {}) {
  return {
    data,
    isLoading: false,
    isError: false,
    isSuccess: true,
    error: null,
    refetch: vi.fn(),
    ...overrides,
  };
}

/**
 * Mutation Result factory (React Query)
 */
export function createMockMutationResult(overrides = {}) {
  return {
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isLoading: false,
    isError: false,
    isSuccess: false,
    error: null,
    data: null,
    reset: vi.fn(),
    ...overrides,
  };
}
