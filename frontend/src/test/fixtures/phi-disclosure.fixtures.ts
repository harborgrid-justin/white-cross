/**
 * PHI Disclosure Test Fixtures
 * Synthetic test data for PHI disclosure tracking
 * NO REAL PHI DATA - All data is synthetic for testing only
 */

import type { PhiDisclosure, CreatePhiDisclosureData } from '@/types/phi-disclosure.types';

export const phiDisclosureFixtures = {
  /**
   * Valid disclosure with written consent
   */
  validDisclosure: {
    id: 'disclosure-123',
    studentId: 'student-456',
    disclosedTo: 'Dr. Emily Johnson, Pediatrician',
    disclosedBy: 'nurse-789',
    disclosureDate: '2025-10-20',
    purpose: 'Treatment coordination',
    informationDisclosed: 'Current medications, recent allergy test results, visit summary',
    authorizationMethod: 'WRITTEN_CONSENT',
    authorizationDate: '2025-10-15',
    authorizationDocument: 'consent-form-2025-10-15.pdf',
    createdAt: '2025-10-20T14:30:00Z',
    updatedAt: '2025-10-20T14:30:00Z',
  } as PhiDisclosure,

  /**
   * Emergency disclosure without prior authorization
   */
  emergencyDisclosure: {
    id: 'disclosure-456',
    studentId: 'student-456',
    disclosedTo: 'Emergency Room, County Hospital',
    disclosedBy: 'nurse-789',
    disclosureDate: '2025-10-21',
    purpose: 'Emergency treatment',
    informationDisclosed: 'Complete medical history, allergies, current medications, emergency contacts',
    authorizationMethod: 'EMERGENCY',
    emergencyJustification: 'Student experienced severe allergic reaction requiring immediate hospitalization',
    createdAt: '2025-10-21T09:15:00Z',
    updatedAt: '2025-10-21T09:15:00Z',
  } as PhiDisclosure,

  /**
   * Verbal consent disclosure
   */
  verbalConsentDisclosure: {
    id: 'disclosure-789',
    studentId: 'student-456',
    disclosedTo: 'School Counselor, Sarah Martinez',
    disclosedBy: 'nurse-789',
    disclosureDate: '2025-10-22',
    purpose: 'Care coordination',
    informationDisclosed: 'Behavioral health notes, medication schedule',
    authorizationMethod: 'VERBAL_CONSENT',
    verbalConsentObtainedFrom: 'Guardian - Maria Doe (Mother)',
    witnessName: 'John Smith, Assistant Principal',
    createdAt: '2025-10-22T11:00:00Z',
    updatedAt: '2025-10-22T11:00:00Z',
  } as PhiDisclosure,

  /**
   * Court order disclosure
   */
  courtOrderDisclosure: {
    id: 'disclosure-1011',
    studentId: 'student-456',
    disclosedTo: 'Family Court of County',
    disclosedBy: 'nurse-789',
    disclosureDate: '2025-10-23',
    purpose: 'Legal proceeding',
    informationDisclosed: 'Complete medical and educational health records',
    authorizationMethod: 'COURT_ORDER',
    courtOrderNumber: 'CO-2025-12345',
    courtOrderDate: '2025-10-18',
    createdAt: '2025-10-23T13:45:00Z',
    updatedAt: '2025-10-23T13:45:00Z',
  } as PhiDisclosure,

  /**
   * Create disclosure data for testing form submission
   */
  createData: {
    studentId: 'student-456',
    disclosedTo: 'Dr. Michael Chen, Specialist',
    purpose: 'Referral consultation',
    informationDisclosed: 'Recent screening results, immunization records',
    authorizationMethod: 'WRITTEN_CONSENT',
    authorizationDate: '2025-10-25',
    authorizationDocument: 'consent-2025-10-25.pdf',
  } as CreatePhiDisclosureData,

  /**
   * Invalid disclosure data for validation testing
   */
  invalidDisclosures: {
    missingRequired: {
      studentId: 'student-456',
      // Missing required fields: disclosedTo, purpose, informationDisclosed, authorizationMethod
    },
    futurDisclosureDate: {
      studentId: 'student-456',
      disclosedTo: 'Dr. Smith',
      disclosureDate: '2099-12-31', // Future date
      purpose: 'Treatment',
      informationDisclosed: 'Medical records',
      authorizationMethod: 'WRITTEN_CONSENT',
    },
    shortInformationDisclosed: {
      studentId: 'student-456',
      disclosedTo: 'Dr. Smith',
      purpose: 'Treatment',
      informationDisclosed: 'abc', // Too short
      authorizationMethod: 'WRITTEN_CONSENT',
    },
    missingAuthorizationDocument: {
      studentId: 'student-456',
      disclosedTo: 'Dr. Smith',
      purpose: 'Treatment',
      informationDisclosed: 'Medical records and treatment history',
      authorizationMethod: 'WRITTEN_CONSENT',
      // Missing authorizationDocument for WRITTEN_CONSENT
    },
  },

  /**
   * Generate multiple disclosures for list testing
   */
  multipleDisclosures: (count: number): PhiDisclosure[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `disclosure-${i + 1}`,
      studentId: 'student-456',
      disclosedTo: `Provider ${i + 1}`,
      disclosedBy: 'nurse-789',
      disclosureDate: new Date(2025, 9, 20 + i).toISOString().split('T')[0],
      purpose: ['Treatment', 'Care Coordination', 'Legal', 'Research'][i % 4],
      informationDisclosed: `Medical information set ${i + 1}`,
      authorizationMethod: ['WRITTEN_CONSENT', 'VERBAL_CONSENT', 'EMERGENCY', 'COURT_ORDER'][i % 4] as any,
      createdAt: new Date(2025, 9, 20 + i, 14, 30).toISOString(),
      updatedAt: new Date(2025, 9, 20 + i, 14, 30).toISOString(),
    }));
  },

  /**
   * Disclosure report data
   */
  reportData: {
    reportUrl: 'https://reports.example.com/disclosure-report-123.pdf',
    generatedAt: '2025-10-26T10:00:00Z',
    disclosureCount: 5,
    dateRange: {
      start: '2025-01-01',
      end: '2025-10-26',
    },
    includedFields: [
      'disclosureDate',
      'disclosedTo',
      'purpose',
      'authorizationMethod',
    ],
  },

  /**
   * Audit log entries for disclosure actions
   */
  auditLogs: [
    {
      id: 'audit-1',
      action: 'PHI_DISCLOSURE_CREATED',
      resourceType: 'PHI_DISCLOSURE',
      resourceId: 'disclosure-123',
      userId: 'nurse-789',
      timestamp: '2025-10-20T14:30:00Z',
      metadata: {
        studentId: 'student-456',
        disclosedTo: 'Dr. Emily Johnson',
      },
    },
    {
      id: 'audit-2',
      action: 'PHI_DISCLOSURE_VIEWED',
      resourceType: 'PHI_DISCLOSURE',
      resourceId: 'disclosure-123',
      userId: 'privacy-officer-1',
      timestamp: '2025-10-21T09:00:00Z',
      metadata: {
        studentId: 'student-456',
      },
    },
    {
      id: 'audit-3',
      action: 'PHI_DISCLOSURE_REPORT_GENERATED',
      resourceType: 'PHI_DISCLOSURE',
      resourceId: 'student-456',
      userId: 'privacy-officer-1',
      timestamp: '2025-10-26T10:00:00Z',
      metadata: {
        reportFormat: 'PDF',
        disclosureCount: 5,
      },
    },
  ],
};
