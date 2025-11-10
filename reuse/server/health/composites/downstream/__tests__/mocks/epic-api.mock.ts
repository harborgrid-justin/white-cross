/**
 * EPIC API MOCK
 *
 * Mock implementation of Epic EHR API for testing
 */

export const mockEpicAPI = {
  // Patient operations
  getPatient: jest.fn().mockResolvedValue({
    resourceType: 'Patient',
    id: 'epic-patient-123',
    identifier: [{ system: 'epic-mrn', value: 'MRN-123456' }],
    name: [{ family: 'Test', given: ['Patient'] }],
    gender: 'male',
    birthDate: '1980-01-01',
  }),

  searchPatients: jest.fn().mockResolvedValue({
    resourceType: 'Bundle',
    type: 'searchset',
    total: 1,
    entry: [],
  }),

  createPatient: jest.fn().mockResolvedValue({
    resourceType: 'Patient',
    id: 'epic-patient-new',
  }),

  updatePatient: jest.fn().mockResolvedValue({
    resourceType: 'Patient',
    id: 'epic-patient-123',
  }),

  // Appointment operations
  getAppointment: jest.fn().mockResolvedValue({
    resourceType: 'Appointment',
    id: 'epic-appt-123',
    status: 'booked',
  }),

  searchAppointments: jest.fn().mockResolvedValue({
    resourceType: 'Bundle',
    type: 'searchset',
    total: 0,
    entry: [],
  }),

  bookAppointment: jest.fn().mockResolvedValue({
    resourceType: 'Appointment',
    id: 'epic-appt-new',
    status: 'booked',
  }),

  cancelAppointment: jest.fn().mockResolvedValue({
    resourceType: 'Appointment',
    id: 'epic-appt-123',
    status: 'cancelled',
  }),

  // Medication operations
  getMedicationRequest: jest.fn().mockResolvedValue({
    resourceType: 'MedicationRequest',
    id: 'epic-medrq-123',
    status: 'active',
  }),

  searchMedicationRequests: jest.fn().mockResolvedValue({
    resourceType: 'Bundle',
    type: 'searchset',
    total: 0,
    entry: [],
  }),

  createMedicationRequest: jest.fn().mockResolvedValue({
    resourceType: 'MedicationRequest',
    id: 'epic-medrq-new',
    status: 'active',
  }),

  // Observation operations
  getObservation: jest.fn().mockResolvedValue({
    resourceType: 'Observation',
    id: 'epic-obs-123',
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
    id: 'epic-cond-123',
    clinicalStatus: { coding: [{ code: 'active' }] },
  }),

  searchConditions: jest.fn().mockResolvedValue({
    resourceType: 'Bundle',
    type: 'searchset',
    total: 0,
    entry: [],
  }),

  // AllergyIntolerance operations
  getAllergyIntolerance: jest.fn().mockResolvedValue({
    resourceType: 'AllergyIntolerance',
    id: 'epic-allergy-123',
    clinicalStatus: { coding: [{ code: 'active' }] },
  }),

  searchAllergyIntolerances: jest.fn().mockResolvedValue({
    resourceType: 'Bundle',
    type: 'searchset',
    total: 0,
    entry: [],
  }),

  // Encounter operations
  getEncounter: jest.fn().mockResolvedValue({
    resourceType: 'Encounter',
    id: 'epic-enc-123',
    status: 'in-progress',
  }),

  createEncounter: jest.fn().mockResolvedValue({
    resourceType: 'Encounter',
    id: 'epic-enc-new',
    status: 'in-progress',
  }),

  // DocumentReference operations
  getDocumentReference: jest.fn().mockResolvedValue({
    resourceType: 'DocumentReference',
    id: 'epic-doc-123',
    status: 'current',
  }),

  createDocumentReference: jest.fn().mockResolvedValue({
    resourceType: 'DocumentReference',
    id: 'epic-doc-new',
    status: 'current',
  }),

  // Binary operations (for document content)
  getBinary: jest.fn().mockResolvedValue({
    resourceType: 'Binary',
    id: 'epic-bin-123',
    contentType: 'application/pdf',
    data: 'base64encodeddata',
  }),
};

export const mockEpicFHIRClient = {
  request: jest.fn().mockResolvedValue({}),
  create: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({}),
  search: jest.fn().mockResolvedValue({ entry: [] }),
};

export const mockEpicOAuth = {
  getAccessToken: jest.fn().mockResolvedValue({
    access_token: 'epic-token-123',
    token_type: 'Bearer',
    expires_in: 3600,
  }),

  refreshToken: jest.fn().mockResolvedValue({
    access_token: 'epic-token-456',
    token_type: 'Bearer',
    expires_in: 3600,
  }),

  validateToken: jest.fn().mockResolvedValue(true),
};

export function resetEpicMocks(): void {
  Object.values(mockEpicAPI).forEach(mock => {
    if (jest.isMockFunction(mock)) {
      mock.mockClear();
    }
  });
  Object.values(mockEpicFHIRClient).forEach(mock => {
    if (jest.isMockFunction(mock)) {
      mock.mockClear();
    }
  });
  Object.values(mockEpicOAuth).forEach(mock => {
    if (jest.isMockFunction(mock)) {
      mock.mockClear();
    }
  });
}
