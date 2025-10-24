/**
 * Test Fixtures for White Cross Healthcare Management System
 * Contains test data, mock users, and healthcare-specific test data
 */

export interface User {
  email: string;
  password: string;
  name: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: string;
}

export type UserType = 'nurse' | 'admin' | 'doctor' | 'counselor' | 'viewer';

export const USERS: Record<UserType, User> = {
  nurse: {
    email: 'nurse@school.edu',
    password: 'NursePassword123!',
    name: 'Test Nurse',
    firstName: 'Test',
    lastName: 'Nurse',
    displayName: 'Test Nurse',
    role: 'NURSE'
  },
  admin: {
    email: 'admin@school.edu',
    password: 'AdminPassword123!',
    name: 'Test Administrator',
    firstName: 'Test',
    lastName: 'Administrator',
    displayName: 'Test Administrator',
    role: 'ADMIN'
  },
  doctor: {
    email: 'doctor@school.edu',
    password: 'DoctorPassword123!',
    name: 'Dr. Johnson',
    firstName: 'Test',
    lastName: 'Johnson',
    displayName: 'Dr. Johnson',
    role: 'DOCTOR'
  },
  counselor: {
    email: 'counselor@school.edu',
    password: 'CounselorPassword123!',
    name: 'Test Counselor',
    firstName: 'Test',
    lastName: 'Counselor',
    displayName: 'Test Counselor',
    role: 'SCHOOL_ADMIN'
  },
  viewer: {
    email: 'readonly@school.edu',
    password: 'ReadOnlyPassword123!',
    name: 'Test ReadOnly',
    firstName: 'Test',
    lastName: 'ReadOnly',
    displayName: 'Test ReadOnly',
    role: 'NURSE'
  }
};

/**
 * API Configuration
 */
export const API_CONFIG = {
  baseUrl: process.env.API_URL || 'http://localhost:3001',
  version: 'v1',
  timeout: 30000
} as const;

/**
 * Environment Configuration
 */
export const ENV_CONFIG = {
  // Feature Flags
  ENABLE_AUDIT_LOGGING: true,
  ENABLE_MEDICATION_SAFETY: true,
  ENABLE_HIPAA_COMPLIANCE: true,
  ENABLE_ACCESSIBILITY_CHECKS: true,

  // Performance Thresholds
  PERFORMANCE_THRESHOLD_MS: 2000,
  API_RESPONSE_THRESHOLD_MS: 1000,

  // Test Data Management
  USE_REAL_API: false,
  CLEANUP_TEST_DATA: true,

  // Security Testing
  CSRF_TOKEN_VALIDATION: true,
  SESSION_TIMEOUT_MINUTES: 30,

  // Healthcare Specific
  PHI_ACCESS_LOGGING: true,
  MEDICATION_BARCODE_SCANNING: true,
  FIVE_RIGHTS_VALIDATION: true
} as const;

/**
 * Mock Student Data
 */
export const MOCK_STUDENTS = [
  {
    id: 'student-001',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '2010-05-15',
    grade: '8',
    studentId: 'STU001',
    emergencyContact: {
      name: 'Jane Doe',
      phone: '555-0100',
      relationship: 'Mother'
    },
    allergies: ['Peanuts', 'Penicillin'],
    medications: ['Albuterol'],
    medicalConditions: ['Asthma']
  },
  {
    id: 'student-002',
    firstName: 'Emily',
    lastName: 'Smith',
    dateOfBirth: '2011-08-22',
    grade: '7',
    studentId: 'STU002',
    emergencyContact: {
      name: 'Robert Smith',
      phone: '555-0101',
      relationship: 'Father'
    },
    allergies: [],
    medications: [],
    medicalConditions: []
  },
  {
    id: 'student-003',
    firstName: 'Michael',
    lastName: 'Johnson',
    dateOfBirth: '2009-12-10',
    grade: '9',
    studentId: 'STU003',
    emergencyContact: {
      name: 'Sarah Johnson',
      phone: '555-0102',
      relationship: 'Mother'
    },
    allergies: ['Latex'],
    medications: ['EpiPen'],
    medicalConditions: ['Severe Allergies']
  }
] as const;

/**
 * Mock Appointment Data
 */
export const MOCK_APPOINTMENTS = [
  {
    id: 'appt-001',
    studentId: 'student-001',
    date: new Date().toISOString(),
    time: '09:00',
    type: 'Check-up',
    status: 'Scheduled',
    notes: 'Annual physical examination'
  },
  {
    id: 'appt-002',
    studentId: 'student-002',
    date: new Date().toISOString(),
    time: '10:30',
    type: 'Follow-up',
    status: 'Completed',
    notes: 'Follow-up on flu symptoms'
  }
] as const;

/**
 * Mock Medication Data
 */
export const MOCK_MEDICATIONS = [
  {
    id: 'med-001',
    name: 'Albuterol',
    dosage: '90 mcg',
    route: 'Inhalation',
    frequency: 'As needed',
    prescribedBy: 'Dr. Smith',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    instructions: 'Use inhaler as needed for asthma symptoms'
  },
  {
    id: 'med-002',
    name: 'Amoxicillin',
    dosage: '500 mg',
    route: 'Oral',
    frequency: 'Three times daily',
    prescribedBy: 'Dr. Johnson',
    startDate: '2024-10-01',
    endDate: '2024-10-14',
    instructions: 'Take with food'
  }
] as const;

/**
 * Test Timeouts and Delays
 */
export const TIMEOUTS = {
  SHORT: 2000,
  MEDIUM: 5000,
  LONG: 10000,
  EXTRA_LONG: 30000,
  PAGE_LOAD: 60000
} as const;

/**
 * Healthcare-Specific Test Constants
 */
export const HEALTHCARE_CONSTANTS = {
  // Medication Routes
  MEDICATION_ROUTES: [
    'Oral',
    'Inhalation',
    'Injection',
    'Topical',
    'Sublingual',
    'Rectal'
  ],

  // Appointment Types
  APPOINTMENT_TYPES: [
    'Check-up',
    'Follow-up',
    'Medication Administration',
    'Injury',
    'Illness',
    'Screening'
  ],

  // User Roles
  USER_ROLES: [
    'ADMIN',
    'NURSE',
    'DOCTOR',
    'SCHOOL_ADMIN',
    'COUNSELOR'
  ]
} as const;

/**
 * Error Messages for Testing
 */
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'An error occurred. Please try again.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.'
} as const;

/**
 * Navigation URLs
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  STUDENTS: '/students',
  APPOINTMENTS: '/appointments',
  MEDICATIONS: '/medications',
  HEALTH_RECORDS: '/health-records',
  AUDIT_LOG: '/audit-log',
  SETTINGS: '/settings',
  PROFILE: '/profile'
} as const;
