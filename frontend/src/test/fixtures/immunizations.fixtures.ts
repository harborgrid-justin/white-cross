/**
 * Immunization Test Fixtures
 * Synthetic test data for immunization tracking and compliance
 * NO REAL PHI DATA - All data is synthetic for testing only
 */

import type {
  Immunization,
  VaccineSchedule,
  ImmunizationCompliance,
  StateRequirement,
} from '@/types/immunization.types';

export const immunizationFixtures = {
  /**
   * Sample immunization records
   */
  immunizations: {
    dtap: {
      id: 'imm-1',
      studentId: 'student-456',
      vaccineCode: 'DTaP',
      vaccineName: 'Diphtheria, Tetanus, Pertussis',
      doseNumber: 5,
      totalDosesRequired: 5,
      administrationDate: '2020-08-15',
      lotNumber: 'ABC123XYZ',
      manufacturer: 'Sanofi Pasteur',
      expirationDate: '2023-12-31',
      administeredBy: 'Dr. Sarah Johnson',
      site: 'Left deltoid',
      route: 'Intramuscular',
      visGiven: true,
      visPublicationDate: '2020-02-01',
      facility: 'County Health Department',
      reportedToRegistry: true,
      registryReportDate: '2020-08-16',
      createdAt: '2020-08-15T10:30:00Z',
      updatedAt: '2020-08-16T09:00:00Z',
    } as Immunization,

    mmr: {
      id: 'imm-2',
      studentId: 'student-456',
      vaccineCode: 'MMR',
      vaccineName: 'Measles, Mumps, Rubella',
      doseNumber: 2,
      totalDosesRequired: 2,
      administrationDate: '2019-05-20',
      lotNumber: 'MMR789DEF',
      manufacturer: 'Merck',
      expirationDate: '2022-06-30',
      administeredBy: 'Dr. Michael Chen',
      site: 'Right deltoid',
      route: 'Subcutaneous',
      visGiven: true,
      visPublicationDate: '2019-01-15',
      facility: 'Pediatric Associates',
      reportedToRegistry: true,
      registryReportDate: '2019-05-21',
      createdAt: '2019-05-20T14:00:00Z',
      updatedAt: '2019-05-21T08:30:00Z',
    } as Immunization,

    hpv: {
      id: 'imm-3',
      studentId: 'student-456',
      vaccineCode: 'HPV',
      vaccineName: 'Human Papillomavirus',
      doseNumber: 2,
      totalDosesRequired: 3,
      administrationDate: '2024-06-10',
      lotNumber: 'HPV456GHI',
      manufacturer: 'Merck',
      expirationDate: '2026-12-31',
      administeredBy: 'Nurse Sarah Williams, RN',
      site: 'Left deltoid',
      route: 'Intramuscular',
      visGiven: true,
      visPublicationDate: '2024-01-10',
      facility: 'School Health Clinic',
      reportedToRegistry: false,
      createdAt: '2024-06-10T11:00:00Z',
      updatedAt: '2024-06-10T11:00:00Z',
    } as Immunization,

    flu: {
      id: 'imm-4',
      studentId: 'student-456',
      vaccineCode: 'FLU',
      vaccineName: 'Influenza, seasonal',
      doseNumber: 1,
      totalDosesRequired: 1,
      administrationDate: '2025-10-15',
      lotNumber: 'FLU2025ABC',
      manufacturer: 'Sanofi Pasteur',
      expirationDate: '2026-06-30',
      administeredBy: 'Nurse Sarah Williams, RN',
      site: 'Left deltoid',
      route: 'Intramuscular',
      visGiven: true,
      visPublicationDate: '2025-08-01',
      facility: 'School Health Clinic',
      reportedToRegistry: false,
      createdAt: '2025-10-15T09:30:00Z',
      updatedAt: '2025-10-15T09:30:00Z',
    } as Immunization,
  },

  /**
   * Exemptions
   */
  exemptions: {
    medical: {
      id: 'exemption-1',
      studentId: 'student-789',
      exemptionType: 'MEDICAL',
      vaccines: ['MMR'],
      reason: 'Severe egg allergy - documented anaphylaxis',
      providerId: 'provider-123',
      providerName: 'Dr. Emily Rodriguez, MD',
      providerNPI: '1234567890',
      documentationFile: 'medical-exemption-2024.pdf',
      effectiveDate: '2024-01-01',
      expirationDate: null, // Permanent medical exemption
      approvedBy: 'School Nurse Sarah Williams',
      approvalDate: '2024-01-15',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },

    religious: {
      id: 'exemption-2',
      studentId: 'student-1011',
      exemptionType: 'RELIGIOUS',
      vaccines: ['ALL'],
      reason: 'Religious beliefs',
      parentSignature: true,
      signatureDate: '2024-08-20',
      documentationFile: 'religious-exemption-2024.pdf',
      effectiveDate: '2024-08-20',
      expirationDate: null, // Review annually
      approvedBy: 'School Administrator John Smith',
      approvalDate: '2024-08-25',
      createdAt: '2024-08-25T14:00:00Z',
      updatedAt: '2024-08-25T14:00:00Z',
    },

    temporary: {
      id: 'exemption-3',
      studentId: 'student-1213',
      exemptionType: 'TEMPORARY_MEDICAL',
      vaccines: ['FLU'],
      reason: 'Recent illness - defer vaccination for 2 weeks',
      providerId: 'provider-456',
      providerName: 'Dr. Thomas Anderson, MD',
      providerNPI: '0987654321',
      effectiveDate: '2025-10-20',
      expirationDate: '2025-11-03',
      approvedBy: 'School Nurse Sarah Williams',
      approvalDate: '2025-10-20',
      createdAt: '2025-10-20T09:00:00Z',
      updatedAt: '2025-10-20T09:00:00Z',
    },
  },

  /**
   * Vaccine schedules by age
   */
  schedules: {
    kindergarten: {
      grade: 'K',
      ageRange: '5-6 years',
      requiredVaccines: [
        {
          vaccineCode: 'DTaP',
          vaccineName: 'Diphtheria, Tetanus, Pertussis',
          requiredDoses: 5,
          ageRequirement: 'By age 5',
          notes: 'Last dose must be on or after 4th birthday',
        },
        {
          vaccineCode: 'IPV',
          vaccineName: 'Polio',
          requiredDoses: 4,
          ageRequirement: 'By age 5',
          notes: 'Last dose must be on or after 4th birthday',
        },
        {
          vaccineCode: 'MMR',
          vaccineName: 'Measles, Mumps, Rubella',
          requiredDoses: 2,
          ageRequirement: 'By age 5',
          notes: 'First dose at 12-15 months, second at 4-6 years',
        },
        {
          vaccineCode: 'VAR',
          vaccineName: 'Varicella (Chickenpox)',
          requiredDoses: 2,
          ageRequirement: 'By age 5',
          notes: 'Or history of disease',
        },
        {
          vaccineCode: 'HepB',
          vaccineName: 'Hepatitis B',
          requiredDoses: 3,
          ageRequirement: 'By kindergarten entry',
          notes: 'Birth series or catch-up',
        },
      ],
    } as VaccineSchedule,

    middleschool: {
      grade: '7',
      ageRange: '11-12 years',
      requiredVaccines: [
        {
          vaccineCode: 'Tdap',
          vaccineName: 'Tetanus, Diphtheria, Pertussis',
          requiredDoses: 1,
          ageRequirement: 'By 7th grade entry',
          notes: 'Booster dose',
        },
        {
          vaccineCode: 'MenACWY',
          vaccineName: 'Meningococcal',
          requiredDoses: 1,
          ageRequirement: 'By 7th grade entry',
          notes: 'Booster at age 16',
        },
      ],
    } as VaccineSchedule,

    recommended: {
      grade: 'ALL',
      ageRange: 'All ages',
      requiredVaccines: [
        {
          vaccineCode: 'FLU',
          vaccineName: 'Influenza, seasonal',
          requiredDoses: 1,
          ageRequirement: 'Annually',
          notes: 'Strongly recommended, not required',
        },
        {
          vaccineCode: 'COVID',
          vaccineName: 'COVID-19',
          requiredDoses: 2,
          ageRequirement: 'Age 6 months+',
          notes: 'Recommended, not required for school entry',
        },
      ],
    } as VaccineSchedule,
  },

  /**
   * Compliance calculations
   */
  compliance: {
    compliant: {
      studentId: 'student-456',
      grade: '8',
      overallStatus: 'COMPLIANT',
      lastUpdated: '2025-10-26T10:00:00Z',
      vaccineStatus: [
        {
          vaccineCode: 'DTaP',
          required: 5,
          received: 5,
          status: 'COMPLETE',
          nextDueDate: null,
        },
        {
          vaccineCode: 'MMR',
          required: 2,
          received: 2,
          status: 'COMPLETE',
          nextDueDate: null,
        },
        {
          vaccineCode: 'Tdap',
          required: 1,
          received: 1,
          status: 'COMPLETE',
          nextDueDate: null,
        },
        {
          vaccineCode: 'MenACWY',
          required: 1,
          received: 1,
          status: 'COMPLETE',
          nextDueDate: null,
        },
      ],
      exemptions: [],
      alerts: [],
    } as ImmunizationCompliance,

    overdue: {
      studentId: 'student-789',
      grade: '7',
      overallStatus: 'OVERDUE',
      lastUpdated: '2025-10-26T10:00:00Z',
      vaccineStatus: [
        {
          vaccineCode: 'DTaP',
          required: 5,
          received: 5,
          status: 'COMPLETE',
          nextDueDate: null,
        },
        {
          vaccineCode: 'MMR',
          required: 2,
          received: 1,
          status: 'OVERDUE',
          nextDueDate: '2025-09-01',
          daysOverdue: 55,
        },
        {
          vaccineCode: 'Tdap',
          required: 1,
          received: 0,
          status: 'OVERDUE',
          nextDueDate: '2025-08-15',
          daysOverdue: 72,
        },
        {
          vaccineCode: 'MenACWY',
          required: 1,
          received: 0,
          status: 'OVERDUE',
          nextDueDate: '2025-08-15',
          daysOverdue: 72,
        },
      ],
      exemptions: [],
      alerts: [
        {
          type: 'OVERDUE',
          message: '3 vaccines overdue - student may be excluded from school',
          severity: 'HIGH',
        },
      ],
    } as ImmunizationCompliance,

    inProgress: {
      studentId: 'student-1011',
      grade: '6',
      overallStatus: 'IN_PROGRESS',
      lastUpdated: '2025-10-26T10:00:00Z',
      vaccineStatus: [
        {
          vaccineCode: 'HPV',
          required: 3,
          received: 2,
          status: 'IN_PROGRESS',
          nextDueDate: '2025-12-10',
          daysUntilDue: 45,
        },
        {
          vaccineCode: 'HepA',
          required: 2,
          received: 1,
          status: 'IN_PROGRESS',
          nextDueDate: '2025-11-15',
          daysUntilDue: 20,
        },
      ],
      exemptions: [],
      alerts: [
        {
          type: 'REMINDER',
          message: 'HPV dose 3 due in 45 days',
          severity: 'LOW',
        },
      ],
    } as ImmunizationCompliance,

    exempt: {
      studentId: 'student-1213',
      grade: '5',
      overallStatus: 'EXEMPT',
      lastUpdated: '2025-10-26T10:00:00Z',
      vaccineStatus: [
        {
          vaccineCode: 'MMR',
          required: 2,
          received: 0,
          status: 'EXEMPT',
          exemptionType: 'MEDICAL',
          exemptionReason: 'Severe egg allergy',
        },
      ],
      exemptions: [immunizationFixtures.exemptions.medical],
      alerts: [],
    } as ImmunizationCompliance,
  },

  /**
   * State requirements (example: California)
   */
  stateRequirements: {
    california: {
      state: 'CA',
      lastUpdated: '2025-01-01',
      kindergartenRequirements: [
        'DTaP (5 doses)',
        'IPV (4 doses)',
        'MMR (2 doses)',
        'Varicella (2 doses)',
        'Hepatitis B (3 doses)',
      ],
      seventhGradeRequirements: [
        'Tdap (1 dose)',
        'Varicella (2 doses)',
      ],
      exemptionsAllowed: ['MEDICAL'],
      personalBeliefExemptionAllowed: false,
      religiousExemptionAllowed: false,
      provisionalEnrollmentPeriod: 30, // days
      registryReportingRequired: true,
      registryName: 'CAIR (California Immunization Registry)',
    } as StateRequirement,

    texas: {
      state: 'TX',
      lastUpdated: '2025-01-01',
      kindergartenRequirements: [
        'DTaP (5 doses)',
        'IPV (4 doses)',
        'MMR (2 doses)',
        'Varicella (2 doses)',
        'Hepatitis B (3 doses)',
        'Hepatitis A (2 doses)',
      ],
      seventhGradeRequirements: [
        'Tdap (1 dose)',
        'MenACWY (1 dose)',
        'Varicella (2 doses)',
      ],
      exemptionsAllowed: ['MEDICAL', 'RELIGIOUS', 'PERSONAL'],
      personalBeliefExemptionAllowed: true,
      religiousExemptionAllowed: true,
      provisionalEnrollmentPeriod: 30, // days
      registryReportingRequired: true,
      registryName: 'ImmTrac2',
    } as StateRequirement,
  },

  /**
   * Dashboard statistics
   */
  dashboardStats: {
    schoolWide: {
      totalStudents: 850,
      compliant: 782,
      inProgress: 45,
      overdue: 18,
      exempt: 5,
      complianceRate: 92.0, // percentage
      trends: {
        lastMonth: 90.5,
        percentChange: +1.5,
      },
      byGrade: {
        K: { total: 100, compliant: 95, complianceRate: 95.0 },
        '1': { total: 105, compliant: 98, complianceRate: 93.3 },
        '2': { total: 98, compliant: 92, complianceRate: 93.9 },
        '3': { total: 102, compliant: 96, complianceRate: 94.1 },
        '4': { total: 95, compliant: 88, complianceRate: 92.6 },
        '5': { total: 90, compliant: 82, complianceRate: 91.1 },
        '6': { total: 85, compliant: 78, complianceRate: 91.8 },
        '7': { total: 88, compliant: 75, complianceRate: 85.2 }, // Lower due to 7th grade requirements
        '8': { total: 87, compliant: 78, complianceRate: 89.7 },
      },
      upcomingDue: {
        next7Days: 12,
        next30Days: 34,
        next90Days: 67,
      },
      alerts: [
        {
          type: 'LOW_COMPLIANCE',
          grade: '7',
          complianceRate: 85.2,
          threshold: 90.0,
          message: 'Grade 7 compliance below 90% threshold',
        },
      ],
    },

    overdueStudents: [
      {
        studentId: 'student-789',
        studentName: 'Jane Smith',
        grade: '7',
        overdueVaccines: ['MMR (2nd dose)', 'Tdap', 'MenACWY'],
        daysOverdue: 72,
        parentNotified: true,
        lastNotificationDate: '2025-10-01',
      },
      {
        studentId: 'student-1011',
        studentName: 'Michael Johnson',
        grade: '6',
        overdueVaccines: ['Varicella (2nd dose)'],
        daysOverdue: 15,
        parentNotified: true,
        lastNotificationDate: '2025-10-15',
      },
    ],
  },

  /**
   * Registry submission data
   */
  registrySubmissions: {
    successful: {
      submissionId: 'sub-123',
      submissionDate: '2025-10-26T10:00:00Z',
      registry: 'State Immunization Registry',
      immunizationId: 'imm-4',
      studentId: 'student-456',
      vaccineCode: 'FLU',
      status: 'SUBMITTED',
      confirmationNumber: 'CONF-2025-10-26-123',
      acknowledgedAt: '2025-10-26T10:05:00Z',
    },

    pending: {
      submissionId: 'sub-456',
      submissionDate: '2025-10-26T11:00:00Z',
      registry: 'State Immunization Registry',
      immunizationId: 'imm-3',
      studentId: 'student-456',
      vaccineCode: 'HPV',
      status: 'PENDING',
    },

    failed: {
      submissionId: 'sub-789',
      submissionDate: '2025-10-25T14:00:00Z',
      registry: 'State Immunization Registry',
      immunizationId: 'imm-2',
      studentId: 'student-456',
      vaccineCode: 'MMR',
      status: 'FAILED',
      errorMessage: 'Student not found in registry',
      retryCount: 2,
      lastRetryAt: '2025-10-26T09:00:00Z',
    },
  },
};
