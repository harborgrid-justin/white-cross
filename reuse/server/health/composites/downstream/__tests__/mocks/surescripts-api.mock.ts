/**
 * SURESCRIPTS API MOCK
 *
 * Mock implementation of Surescripts E-Prescribing Network API for testing
 */

export const mockSurescriptsAPI = {
  // Prescription routing
  sendPrescription: jest.fn().mockResolvedValue({
    success: true,
    prescriptionId: 'ss-rx-123',
    status: 'SENT',
    timestamp: new Date(),
  }),

  sendEPCSPrescription: jest.fn().mockResolvedValue({
    success: true,
    prescriptionId: 'ss-epcs-123',
    status: 'SENT',
    epcsCompliant: true,
    timestamp: new Date(),
  }),

  cancelPrescription: jest.fn().mockResolvedValue({
    success: true,
    prescriptionId: 'ss-rx-123',
    status: 'CANCELLED',
  }),

  changePrescription: jest.fn().mockResolvedValue({
    success: true,
    prescriptionId: 'ss-rx-123',
    status: 'CHANGED',
  }),

  // Prescription status
  getPrescriptionStatus: jest.fn().mockResolvedValue({
    prescriptionId: 'ss-rx-123',
    status: 'DISPENSED',
    pharmacy: {
      ncpdpId: '1234567',
      name: 'Test Pharmacy',
    },
    dispensedDate: new Date(),
  }),

  // Medication history (RxHistory)
  getRxHistory: jest.fn().mockResolvedValue({
    patientId: 'patient-123',
    medications: [
      {
        medication: 'Lisinopril 10mg',
        prescriber: 'Dr. Smith',
        pharmacy: 'Test Pharmacy',
        fillDate: new Date('2024-01-01'),
        daysSupply: 30,
      },
    ],
    dataSource: 'PHARMACY_CLAIMS',
  }),

  // Pharmacy directory
  searchPharmacies: jest.fn().mockResolvedValue({
    pharmacies: [
      {
        ncpdpId: '1234567',
        name: 'Test Pharmacy',
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
        phone: '555-0100',
        fax: '555-0101',
        is24Hour: false,
      },
    ],
  }),

  getPharmacy: jest.fn().mockResolvedValue({
    ncpdpId: '1234567',
    name: 'Test Pharmacy',
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zip: '12345',
    phone: '555-0100',
    fax: '555-0101',
    is24Hour: false,
    acceptsEPCS: true,
  }),

  // Formulary and benefits
  checkFormulary: jest.fn().mockResolvedValue({
    medication: 'Lisinopril 10mg',
    covered: true,
    tier: 1,
    copay: 10,
    alternatives: [],
  }),

  checkBenefits: jest.fn().mockResolvedValue({
    eligible: true,
    planName: 'Test Insurance Plan',
    coverageLevel: 'ACTIVE',
    deductible: {
      individual: 1000,
      met: 500,
    },
  }),

  // Prior authorization
  submitPriorAuth: jest.fn().mockResolvedValue({
    requestId: 'pa-123',
    status: 'PENDING',
    submittedDate: new Date(),
  }),

  checkPriorAuthStatus: jest.fn().mockResolvedValue({
    requestId: 'pa-123',
    status: 'APPROVED',
    approvedDate: new Date(),
  }),

  // EPCS specific
  validateDEANumber: jest.fn().mockResolvedValue({
    valid: true,
    deaNumber: 'AB1234563',
    providerName: 'Dr. Test Provider',
    expirationDate: new Date('2025-12-31'),
  }),

  verifyEPCSCredentials: jest.fn().mockResolvedValue({
    verified: true,
    credentialId: 'epcs-cred-123',
    expiresAt: new Date('2025-12-31'),
  }),

  // Prescription messages (NCPDP SCRIPT)
  parseNCPDPMessage: jest.fn().mockResolvedValue({
    messageType: 'NEWRX',
    prescriptionId: 'ss-rx-123',
    data: {},
  }),

  generateNCPDPMessage: jest.fn().mockResolvedValue({
    message: '<NEWRX></NEWRX>',
    messageId: 'msg-123',
  }),

  // Error responses
  getErrorDetails: jest.fn().mockResolvedValue({
    errorCode: 'E001',
    errorMessage: 'Invalid pharmacy NCPDP ID',
    severity: 'ERROR',
  }),

  // Network status
  checkNetworkStatus: jest.fn().mockResolvedValue({
    available: true,
    lastCheck: new Date(),
    responseTime: 50,
  }),
};

export const mockSurescriptsClient = {
  authenticate: jest.fn().mockResolvedValue({
    authenticated: true,
    sessionId: 'ss-session-123',
    expiresAt: new Date(Date.now() + 3600000),
  }),

  sendMessage: jest.fn().mockResolvedValue({
    success: true,
    messageId: 'msg-123',
  }),

  receiveMessage: jest.fn().mockResolvedValue({
    messages: [],
  }),
};

export const mockPDMP = {
  // Prescription Drug Monitoring Program
  queryPDMP: jest.fn().mockResolvedValue({
    patientId: 'patient-123',
    controlledSubstances: [
      {
        medication: 'Oxycodone 5mg',
        prescriber: 'Dr. Smith',
        dispensedDate: new Date('2024-01-01'),
        quantity: 30,
        daysSupply: 30,
        pharmacy: 'Test Pharmacy',
      },
    ],
    queryDate: new Date(),
    dataSource: 'STATE_PDMP',
  }),

  checkOpioidRisk: jest.fn().mockResolvedValue({
    riskLevel: 'LOW',
    factors: [],
    mme: 15,
    recommendations: [],
  }),
};

export function resetSurescriptsMocks(): void {
  Object.values(mockSurescriptsAPI).forEach(mock => {
    if (jest.isMockFunction(mock)) {
      mock.mockClear();
    }
  });
  Object.values(mockSurescriptsClient).forEach(mock => {
    if (jest.isMockFunction(mock)) {
      mock.mockClear();
    }
  });
  Object.values(mockPDMP).forEach(mock => {
    if (jest.isMockFunction(mock)) {
      mock.mockClear();
    }
  });
}
