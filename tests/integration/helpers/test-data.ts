/**
 * Test Data Fixtures
 * Provides reusable test data for integration tests
 */

export const TEST_STUDENTS = {
  valid: {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '2010-05-15',
    grade: '8',
    schoolId: 'SCHOOL001',
    status: 'active',
    gender: 'male',
  },
  withAllergies: {
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: '2011-03-20',
    grade: '7',
    schoolId: 'SCHOOL001',
    status: 'active',
    gender: 'female',
    allergies: ['Peanuts', 'Penicillin'],
  },
  withConditions: {
    firstName: 'Bob',
    lastName: 'Wilson',
    dateOfBirth: '2009-11-10',
    grade: '9',
    schoolId: 'SCHOOL001',
    status: 'active',
    gender: 'male',
    medicalConditions: ['Asthma', 'Type 1 Diabetes'],
  },
};

export const TEST_MEDICATIONS = {
  daily: {
    medicationName: 'Amoxicillin',
    dosage: '250mg',
    frequency: 'twice_daily',
    route: 'oral',
    prescribedBy: 'Dr. Sarah Johnson',
    instructions: 'Take with food',
    startDate: new Date().toISOString(),
  },
  asNeeded: {
    medicationName: 'Ibuprofen',
    dosage: '200mg',
    frequency: 'as_needed',
    route: 'oral',
    prescribedBy: 'Dr. Michael Brown',
    instructions: 'For pain or fever',
    startDate: new Date().toISOString(),
  },
  insulin: {
    medicationName: 'Insulin NovoLog',
    dosage: '5 units',
    frequency: 'before_meals',
    route: 'subcutaneous',
    prescribedBy: 'Dr. Emily Chen',
    instructions: 'Check blood sugar before administration',
    startDate: new Date().toISOString(),
  },
};

export const TEST_APPOINTMENTS = {
  routine: {
    appointmentType: 'routine_checkup',
    duration: 30,
    notes: 'Annual physical examination',
  },
  followUp: {
    appointmentType: 'follow_up',
    duration: 15,
    notes: 'Follow up on previous injury',
  },
  vaccination: {
    appointmentType: 'vaccination',
    duration: 20,
    notes: 'Flu vaccine administration',
  },
};

export const TEST_HEALTH_RECORDS = {
  vitalSigns: {
    recordType: 'vital_signs',
    vitalSigns: {
      temperature: 98.6,
      heartRate: 72,
      bloodPressure: '120/80',
      respiratoryRate: 16,
      oxygenSaturation: 98,
    },
    notes: 'All vital signs normal',
  },
  immunization: {
    recordType: 'immunization',
    immunizationData: {
      vaccineName: 'Influenza',
      manufacturer: 'Sanofi Pasteur',
      lotNumber: 'LOT123456',
      expirationDate: '2025-12-31',
      site: 'left_arm',
      route: 'intramuscular',
    },
    notes: 'Flu vaccine administered',
  },
  injury: {
    recordType: 'injury',
    injuryData: {
      type: 'laceration',
      bodyPart: 'knee',
      severity: 'minor',
      treatment: 'Cleaned and bandaged',
    },
    notes: 'Minor scrape from playground',
  },
};

export const TEST_INCIDENTS = {
  minorInjury: {
    incidentType: 'minor_injury',
    location: 'Playground',
    description: 'Student fell off swing and scraped knee',
    severity: 'minor',
    treatmentProvided: 'Cleaned wound and applied bandage',
    parentNotified: true,
  },
  illness: {
    incidentType: 'illness',
    location: 'Classroom',
    description: 'Student complained of stomach ache and fever',
    severity: 'moderate',
    treatmentProvided: 'Temperature taken (100.4F), rest in health office',
    parentNotified: true,
    sentHome: true,
  },
  allergicReaction: {
    incidentType: 'allergic_reaction',
    location: 'Cafeteria',
    description: 'Student had allergic reaction to peanuts',
    severity: 'severe',
    treatmentProvided: 'EpiPen administered, 911 called',
    parentNotified: true,
    emergencyResponse: true,
  },
};

export const TEST_EMERGENCY_CONTACTS = {
  mother: {
    firstName: 'Sarah',
    lastName: 'Doe',
    relationship: 'mother',
    phoneNumber: '555-0101',
    email: 'sarah.doe@example.com',
    isPrimary: true,
    canPickUp: true,
  },
  father: {
    firstName: 'Michael',
    lastName: 'Doe',
    relationship: 'father',
    phoneNumber: '555-0102',
    email: 'michael.doe@example.com',
    isPrimary: true,
    canPickUp: true,
  },
  grandparent: {
    firstName: 'Mary',
    lastName: 'Johnson',
    relationship: 'grandmother',
    phoneNumber: '555-0103',
    email: 'mary.johnson@example.com',
    isPrimary: false,
    canPickUp: true,
  },
};

export const TEST_INVENTORY_ITEMS = {
  bandages: {
    itemName: 'Adhesive Bandages',
    category: 'first_aid',
    quantity: 100,
    unit: 'pieces',
    reorderLevel: 20,
    location: 'Cabinet A',
    expirationDate: '2026-12-31',
  },
  gloves: {
    itemName: 'Nitrile Gloves',
    category: 'ppe',
    quantity: 500,
    unit: 'pairs',
    reorderLevel: 100,
    location: 'Cabinet B',
  },
  thermometer: {
    itemName: 'Digital Thermometer',
    category: 'equipment',
    quantity: 5,
    unit: 'units',
    reorderLevel: 2,
    location: 'Drawer 1',
  },
};

export const TEST_MESSAGES = {
  broadcast: {
    subject: 'Health Alert',
    messageBody: 'Flu season reminder: Please ensure students wash hands frequently',
    messageType: 'broadcast',
    priority: 'normal',
  },
  urgent: {
    subject: 'Urgent: Medication Recall',
    messageBody: 'A medication has been recalled. Please check your inventory.',
    messageType: 'alert',
    priority: 'urgent',
  },
  reminder: {
    subject: 'Appointment Reminder',
    messageBody: 'You have an upcoming appointment tomorrow',
    messageType: 'reminder',
    priority: 'normal',
  },
};

export const TEST_DOCUMENTS = {
  consentForm: {
    documentType: 'consent_form',
    title: 'Medical Treatment Consent',
    description: 'Parent consent for medical treatment',
    category: 'consent',
  },
  healthPlan: {
    documentType: 'health_plan',
    title: 'Individual Health Plan',
    description: 'Comprehensive health plan for student',
    category: 'medical',
  },
  emergencyPlan: {
    documentType: 'emergency_action_plan',
    title: 'Anaphylaxis Emergency Plan',
    description: 'Action plan for allergic reactions',
    category: 'emergency',
  },
};

export const TEST_USERS = {
  nurse: {
    email: 'nurse@schooltest.com',
    password: 'TestPassword123!',
    role: 'nurse',
  },
  admin: {
    email: 'admin@schooltest.com',
    password: 'TestPassword123!',
    role: 'admin',
  },
  readonly: {
    email: 'readonly@schooltest.com',
    password: 'TestPassword123!',
    role: 'readonly',
  },
};

/**
 * Generate a future date (for appointments, medication end dates, etc.)
 */
export function getFutureDate(daysFromNow: number = 1): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
}

/**
 * Generate a past date (for historical records)
 */
export function getPastDate(daysAgo: number = 1): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

/**
 * Generate a scheduled date/time (for appointments)
 */
export function getScheduledDateTime(hoursFromNow: number = 1): string {
  const date = new Date();
  date.setHours(date.getHours() + hoursFromNow);
  return date.toISOString();
}

/**
 * Generate random test email
 */
export function generateTestEmail(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `test.user.${timestamp}.${random}@schooltest.com`;
}

/**
 * Generate random student ID
 */
export function generateStudentId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `STU${timestamp}${random}`;
}
