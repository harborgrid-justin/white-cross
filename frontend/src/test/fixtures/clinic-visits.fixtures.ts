/**
 * Clinic Visit Tracking Test Fixtures
 * Synthetic test data for clinic visit management
 * NO REAL PHI DATA - All data is synthetic for testing only
 */

import type {
  ClinicVisit,
  CreateClinicVisitData,
  VisitReason,
  VisitStatistics,
} from '@/types/clinic-visit.types';

export const clinicVisitFixtures = {
  /**
   * Active clinic visit (student currently in clinic)
   */
  activeVisit: {
    id: 'visit-123',
    studentId: 'student-456',
    studentName: 'John Doe',
    grade: '8',
    checkInTime: '2025-10-26T09:15:00Z',
    checkOutTime: null,
    status: 'ACTIVE',
    visitReason: 'HEADACHE',
    symptoms: ['Headache', 'Mild nausea'],
    temperature: 98.6,
    bloodPressure: '110/70',
    pulseRate: 72,
    treatmentProvided: ['Administered acetaminophen 325mg', 'Rest in quiet room'],
    nurseNotes: 'Student reports headache started during math class. No recent head injury. Temperature and vital signs normal.',
    disposition: 'REST_IN_CLINIC',
    classTimeMissed: null, // Still in progress
    teacherNotified: true,
    parentNotified: false,
    nurseId: 'nurse-789',
    nurseName: 'Sarah Johnson, RN',
    createdAt: '2025-10-26T09:15:00Z',
    updatedAt: '2025-10-26T09:15:00Z',
  } as ClinicVisit,

  /**
   * Completed clinic visit
   */
  completedVisit: {
    id: 'visit-456',
    studentId: 'student-789',
    studentName: 'Jane Smith',
    grade: '6',
    checkInTime: '2025-10-26T08:30:00Z',
    checkOutTime: '2025-10-26T08:50:00Z',
    status: 'COMPLETED',
    visitReason: 'MEDICATION_ADMINISTRATION',
    symptoms: [],
    medicationAdministered: [
      {
        medicationId: 'med-123',
        medicationName: 'Albuterol Inhaler',
        dosage: '2 puffs',
        time: '2025-10-26T08:35:00Z',
      },
    ],
    treatmentProvided: ['Administered albuterol as prescribed'],
    nurseNotes: 'Scheduled asthma medication administered. Student tolerated well. No adverse effects.',
    disposition: 'RETURN_TO_CLASS',
    classTimeMissed: 20, // minutes
    teacherNotified: true,
    parentNotified: false,
    nurseId: 'nurse-789',
    nurseName: 'Sarah Johnson, RN',
    createdAt: '2025-10-26T08:30:00Z',
    updatedAt: '2025-10-26T08:50:00Z',
  } as ClinicVisit,

  /**
   * Emergency visit - sent home
   */
  emergencyVisit: {
    id: 'visit-789',
    studentId: 'student-1011',
    studentName: 'Michael Brown',
    grade: '10',
    checkInTime: '2025-10-26T10:00:00Z',
    checkOutTime: '2025-10-26T10:45:00Z',
    status: 'COMPLETED',
    visitReason: 'INJURY',
    symptoms: ['Ankle pain', 'Swelling', 'Difficulty walking'],
    injuryDetails: {
      location: 'Right ankle',
      howOccurred: 'Twisted ankle during PE class basketball game',
      witnessedBy: 'PE Teacher - Mr. Thompson',
    },
    temperature: 98.4,
    treatmentProvided: [
      'Applied ice pack',
      'Elevated leg',
      'Provided crutches',
    ],
    nurseNotes: 'Significant swelling and tenderness to right ankle. Unable to bear weight. Recommend x-ray to rule out fracture.',
    disposition: 'SENT_HOME',
    parentPickupTime: '2025-10-26T10:45:00Z',
    parentNotified: true,
    parentNotifiedTime: '2025-10-26T10:05:00Z',
    teacherNotified: true,
    classTimeMissed: 45,
    recommendedFollowUp: 'See physician for x-ray and evaluation',
    nurseId: 'nurse-789',
    nurseName: 'Sarah Johnson, RN',
    createdAt: '2025-10-26T10:00:00Z',
    updatedAt: '2025-10-26T10:45:00Z',
  } as ClinicVisit,

  /**
   * Create visit data for testing
   */
  createData: {
    studentId: 'student-456',
    visitReason: 'STOMACH_ACHE',
    symptoms: ['Abdominal pain', 'Nausea'],
    checkInTime: '2025-10-26T11:30:00Z',
  } as CreateClinicVisitData,

  /**
   * Visit reasons categorized
   */
  visitReasons: [
    {
      code: 'HEADACHE',
      label: 'Headache',
      category: 'ILLNESS',
      requiresTemperature: false,
      commonTreatments: ['Rest', 'Acetaminophen', 'Quiet room'],
    },
    {
      code: 'STOMACH_ACHE',
      label: 'Stomach Ache',
      category: 'ILLNESS',
      requiresTemperature: true,
      commonTreatments: ['Rest', 'Crackers', 'Small amount of water'],
    },
    {
      code: 'FEVER',
      label: 'Fever',
      category: 'ILLNESS',
      requiresTemperature: true,
      requiresParentNotification: true,
      commonTreatments: ['Acetaminophen', 'Rest', 'Monitor temperature'],
    },
    {
      code: 'INJURY',
      label: 'Injury',
      category: 'ACCIDENT',
      requiresIncidentReport: true,
      commonTreatments: ['First aid', 'Ice', 'Bandage'],
    },
    {
      code: 'MEDICATION_ADMINISTRATION',
      label: 'Scheduled Medication',
      category: 'MEDICATION',
      requiresMedicationLog: true,
    },
    {
      code: 'ASTHMA',
      label: 'Asthma/Breathing Difficulty',
      category: 'CHRONIC_CONDITION',
      requiresVitals: true,
      emergencyProtocol: 'Asthma Action Plan',
    },
    {
      code: 'DIABETIC_MANAGEMENT',
      label: 'Blood Sugar Check',
      category: 'CHRONIC_CONDITION',
      requiresGlucoseCheck: true,
    },
    {
      code: 'ALLERGIC_REACTION',
      label: 'Allergic Reaction',
      category: 'EMERGENCY',
      requiresEmergencyProtocol: true,
      requiresParentNotification: true,
    },
    {
      code: 'MENTAL_HEALTH',
      label: 'Mental Health/Anxiety',
      category: 'BEHAVIORAL',
      requiresCounselor: true,
    },
    {
      code: 'OTHER',
      label: 'Other',
      category: 'OTHER',
      requiresDescription: true,
    },
  ] as VisitReason[],

  /**
   * Multiple visits for list testing
   */
  multipleVisits: (count: number): ClinicVisit[] => {
    const reasons = [
      'HEADACHE',
      'STOMACH_ACHE',
      'INJURY',
      'MEDICATION_ADMINISTRATION',
      'FEVER',
    ];

    return Array.from({ length: count }, (_, i) => {
      const checkIn = new Date(2025, 9, 26, 8 + Math.floor(i / 2), (i % 2) * 30);
      const duration = 15 + Math.floor(Math.random() * 30); // 15-45 minutes
      const checkOut = new Date(checkIn.getTime() + duration * 60000);

      return {
        id: `visit-${i + 1}`,
        studentId: `student-${100 + i}`,
        studentName: `Student ${i + 1}`,
        grade: `${6 + (i % 7)}`,
        checkInTime: checkIn.toISOString(),
        checkOutTime: i < count / 2 ? checkOut.toISOString() : null,
        status: i < count / 2 ? 'COMPLETED' : 'ACTIVE',
        visitReason: reasons[i % reasons.length] as any,
        symptoms: ['Symptom A', 'Symptom B'],
        treatmentProvided: ['Treatment provided'],
        nurseNotes: `Visit note ${i + 1}`,
        disposition: 'RETURN_TO_CLASS',
        classTimeMissed: i < count / 2 ? duration : null,
        nurseId: 'nurse-789',
        nurseName: 'Sarah Johnson, RN',
        createdAt: checkIn.toISOString(),
        updatedAt: (i < count / 2 ? checkOut : checkIn).toISOString(),
      };
    });
  },

  /**
   * Visit statistics
   */
  statistics: {
    daily: {
      date: '2025-10-26',
      totalVisits: 24,
      activeVisits: 3,
      completedVisits: 21,
      averageDuration: 22, // minutes
      visitsByReason: {
        HEADACHE: 6,
        STOMACH_ACHE: 5,
        INJURY: 4,
        MEDICATION_ADMINISTRATION: 5,
        FEVER: 2,
        OTHER: 2,
      },
      visitsByGrade: {
        K: 2,
        '1': 3,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 3,
        '6': 2,
        '7': 2,
        '8': 1,
        '9': 1,
        '10': 0,
        '11': 1,
        '12': 0,
      },
      visitsByDisposition: {
        RETURN_TO_CLASS: 15,
        REST_IN_CLINIC: 3,
        SENT_HOME: 5,
        EMERGENCY_TRANSPORT: 1,
      },
      parentNotifications: 7,
      totalClassTimeMissed: 462, // minutes
    } as VisitStatistics,

    weekly: {
      weekStart: '2025-10-20',
      weekEnd: '2025-10-26',
      totalVisits: 142,
      averagePerDay: 20.3,
      peakDay: {
        date: '2025-10-22',
        visits: 31,
      },
      topReasons: [
        { reason: 'HEADACHE', count: 35 },
        { reason: 'STOMACH_ACHE', count: 28 },
        { reason: 'MEDICATION_ADMINISTRATION', count: 25 },
        { reason: 'INJURY', count: 20 },
        { reason: 'FEVER', count: 12 },
      ],
    },

    monthly: {
      month: '2025-10',
      totalVisits: 542,
      averagePerDay: 21.7,
      trends: {
        increasing: false,
        percentChange: -5.2, // 5.2% decrease from previous month
      },
      alerts: [
        {
          type: 'OUTBREAK_POSSIBLE',
          reason: 'STOMACH_ACHE',
          count: 15,
          within24Hours: true,
        },
      ],
    },
  },

  /**
   * Frequent visitor analysis
   */
  frequentVisitors: [
    {
      studentId: 'student-999',
      studentName: 'Sarah Wilson',
      grade: '7',
      visitsThisMonth: 8,
      visitsThisYear: 45,
      commonReasons: ['HEADACHE', 'STOMACH_ACHE'],
      averageDuration: 35,
      flaggedForReview: true,
      reviewReason: 'Exceeds threshold of 6 visits per month',
      lastVisit: '2025-10-25T14:30:00Z',
    },
    {
      studentId: 'student-888',
      studentName: 'Tommy Lee',
      grade: '5',
      visitsThisMonth: 7,
      visitsThisYear: 38,
      commonReasons: ['MEDICATION_ADMINISTRATION', 'ASTHMA'],
      averageDuration: 15,
      flaggedForReview: false,
      reviewReason: null,
      lastVisit: '2025-10-26T09:00:00Z',
      notes: 'Chronic condition - regular visits expected for scheduled medications',
    },
  ],

  /**
   * Invalid visit data for validation testing
   */
  invalidVisits: {
    missingStudentId: {
      visitReason: 'HEADACHE',
      checkInTime: '2025-10-26T10:00:00Z',
      // Missing studentId
    },
    futureCheckInTime: {
      studentId: 'student-456',
      visitReason: 'HEADACHE',
      checkInTime: '2099-12-31T10:00:00Z', // Future date
    },
    checkOutBeforeCheckIn: {
      studentId: 'student-456',
      visitReason: 'HEADACHE',
      checkInTime: '2025-10-26T10:00:00Z',
      checkOutTime: '2025-10-26T09:00:00Z', // Before check-in
    },
    missingRequiredVitals: {
      studentId: 'student-456',
      visitReason: 'FEVER', // Requires temperature
      checkInTime: '2025-10-26T10:00:00Z',
      // Missing temperature
    },
  },
};
