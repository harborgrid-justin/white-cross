/**
 * CERNER API MOCK
 *
 * Mock implementation of Cerner Millennium API for testing
 */

export const mockCernerAPI = {
  // Patient operations
  getPatient: jest.fn().mockResolvedValue({
    resourceType: 'Patient',
    id: 'cerner-patient-123',
    identifier: [{ system: 'cerner-mrn', value: 'MRN-654321' }],
    name: [{ family: 'Test', given: ['Patient'] }],
    gender: 'female',
    birthDate: '1985-05-15',
  }),

  searchPatients: jest.fn().mockResolvedValue({
    resourceType: 'Bundle',
    type: 'searchset',
    total: 1,
    entry: [],
  }),

  createPatient: jest.fn().mockResolvedValue({
    resourceType: 'Patient',
    id: 'cerner-patient-new',
  }),

  updatePatient: jest.fn().mockResolvedValue({
    resourceType: 'Patient',
    id: 'cerner-patient-123',
  }),

  // Appointment operations
  getAppointment: jest.fn().mockResolvedValue({
    resourceType: 'Appointment',
    id: 'cerner-appt-123',
    status: 'booked',
  }),

  searchAppointments: jest.fn().mockResolvedValue({
    resourceType: 'Bundle',
    type: 'searchset',
    total: 0,
    entry: [],
  }),

  scheduleAppointment: jest.fn().mockResolvedValue({
    resourceType: 'Appointment',
    id: 'cerner-appt-new',
    status: 'booked',
  }),

  // Medication operations
  getMedicationOrder: jest.fn().mockResolvedValue({
    resourceType: 'MedicationRequest',
    id: 'cerner-medrq-123',
    status: 'active',
  }),

  searchMedicationOrders: jest.fn().mockResolvedValue({
    resourceType: 'Bundle',
    type: 'searchset',
    total: 0,
    entry: [],
  }),

  createMedicationOrder: jest.fn().mockResolvedValue({
    resourceType: 'MedicationRequest',
    id: 'cerner-medrq-new',
    status: 'active',
  }),

  // Observation operations
  getObservation: jest.fn().mockResolvedValue({
    resourceType: 'Observation',
    id: 'cerner-obs-123',
    status: 'final',
  }),

  searchObservations: jest.fn().mockResolvedValue({
    resourceType: 'Bundle',
    type: 'searchset',
    total: 0,
    entry: [],
  }),

  // Condition operations
  getCondition: jest.fn().mockResolvedValue({
    resourceType: 'Condition',
    id: 'cerner-cond-123',
    clinicalStatus: { coding: [{ code: 'active' }] },
  }),

  searchConditions: jest.fn().mockResolvedValue({
    resourceType: 'Bundle',
    type: 'searchset',
    total: 0,
    entry: [],
  }),

  // Encounter operations
  getEncounter: jest.fn().mockResolvedValue({
    resourceType: 'Encounter',
    id: 'cerner-enc-123',
    status: 'in-progress',
    class: {
      system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
      code: 'IMP',
      display: 'inpatient encounter',
    },
  }),

  // Immunization operations
  getImmunization: jest.fn().mockResolvedValue({
    resourceType: 'Immunization',
    id: 'cerner-imm-123',
    status: 'completed',
  }),

  searchImmunizations: jest.fn().mockResolvedValue({
    resourceType: 'Bundle',
    type: 'searchset',
    total: 0,
    entry: [],
  }),

  // Procedure operations
  getProcedure: jest.fn().mockResolvedValue({
    resourceType: 'Procedure',
    id: 'cerner-proc-123',
    status: 'completed',
  }),

  searchProcedures: jest.fn().mockResolvedValue({
    resourceType: 'Bundle',
    type: 'searchset',
    total: 0,
    entry: [],
  }),

  // DiagnosticReport operations
  getDiagnosticReport: jest.fn().mockResolvedValue({
    resourceType: 'DiagnosticReport',
    id: 'cerner-dr-123',
    status: 'final',
  }),

  searchDiagnosticReports: jest.fn().mockResolvedValue({
    resourceType: 'Bundle',
    type: 'searchset',
    total: 0,
    entry: [],
  }),
};

export const mockCernerFHIRClient = {
  request: jest.fn().mockResolvedValue({}),
  create: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({}),
  search: jest.fn().mockResolvedValue({ entry: [] }),
};

export const mockCernerOAuth = {
  getAccessToken: jest.fn().mockResolvedValue({
    access_token: 'cerner-token-123',
    token_type: 'Bearer',
    expires_in: 3600,
  }),

  refreshToken: jest.fn().mockResolvedValue({
    access_token: 'cerner-token-456',
    token_type: 'Bearer',
    expires_in: 3600,
  }),

  validateToken: jest.fn().mockResolvedValue(true),
};

export function resetCernerMocks(): void {
  Object.values(mockCernerAPI).forEach(mock => {
    if (jest.isMockFunction(mock)) {
      mock.mockClear();
    }
  });
  Object.values(mockCernerFHIRClient).forEach(mock => {
    if (jest.isMockFunction(mock)) {
      mock.mockClear();
    }
  });
  Object.values(mockCernerOAuth).forEach(mock => {
    if (jest.isMockFunction(mock)) {
      mock.mockClear();
    }
  });
}
