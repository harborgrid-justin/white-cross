/**
 * WF-COMP-106 | errors.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, constants | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Centralized error constants and messages for the healthcare platform
 * Provides consistent error handling and user messaging across the application
 */

// Error Codes
export const ERROR_CODES = {
  // Network Errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  CONNECTION_LOST: 'CONNECTION_LOST',

  // Authentication Errors
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',

  // Validation Errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_PHONE: 'INVALID_PHONE',
  INVALID_DATE: 'INVALID_DATE',

  // Data Errors
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',
  DATA_INTEGRITY_ERROR: 'DATA_INTEGRITY_ERROR',

  // Server Errors
  SERVER_ERROR: 'SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  MAINTENANCE_MODE: 'MAINTENANCE_MODE',

  // Healthcare Specific
  PATIENT_NOT_FOUND: 'PATIENT_NOT_FOUND',
  MEDICATION_NOT_FOUND: 'MEDICATION_NOT_FOUND',
  INVALID_DOSAGE: 'INVALID_DOSAGE',
  ALLERGY_CONFLICT: 'ALLERGY_CONFLICT',
  AGE_RESTRICTION: 'AGE_RESTRICTION',
  INTERACTION_WARNING: 'INTERACTION_WARNING',
} as const;

// Error Messages for Developers
export const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.NETWORK_ERROR]: 'Network connection failed',
  [ERROR_CODES.TIMEOUT_ERROR]: 'Request timed out',
  [ERROR_CODES.CONNECTION_LOST]: 'Connection to server lost',

  [ERROR_CODES.AUTHENTICATION_ERROR]: 'Authentication failed',
  [ERROR_CODES.AUTHORIZATION_ERROR]: 'Access denied',
  [ERROR_CODES.SESSION_EXPIRED]: 'User session has expired',
  [ERROR_CODES.INVALID_CREDENTIALS]: 'Invalid username or password',
  [ERROR_CODES.ACCOUNT_LOCKED]: 'Account temporarily locked due to multiple failed attempts',

  [ERROR_CODES.VALIDATION_ERROR]: 'Input validation failed',
  [ERROR_CODES.REQUIRED_FIELD]: 'This field is required',
  [ERROR_CODES.INVALID_FORMAT]: 'Invalid format provided',
  [ERROR_CODES.INVALID_EMAIL]: 'Please enter a valid email address',
  [ERROR_CODES.INVALID_PHONE]: 'Please enter a valid phone number',
  [ERROR_CODES.INVALID_DATE]: 'Please enter a valid date',

  [ERROR_CODES.NOT_FOUND]: 'Requested resource not found',
  [ERROR_CODES.ALREADY_EXISTS]: 'Resource already exists',
  [ERROR_CODES.CONFLICT]: 'Data conflict detected',
  [ERROR_CODES.DATA_INTEGRITY_ERROR]: 'Data integrity constraint violation',

  [ERROR_CODES.SERVER_ERROR]: 'Internal server error',
  [ERROR_CODES.SERVICE_UNAVAILABLE]: 'Service temporarily unavailable',
  [ERROR_CODES.MAINTENANCE_MODE]: 'System is under maintenance',

  [ERROR_CODES.PATIENT_NOT_FOUND]: 'Patient record not found',
  [ERROR_CODES.MEDICATION_NOT_FOUND]: 'Medication not found',
  [ERROR_CODES.INVALID_DOSAGE]: 'Invalid dosage specified',
  [ERROR_CODES.ALLERGY_CONFLICT]: 'Medication conflicts with patient allergies',
  [ERROR_CODES.AGE_RESTRICTION]: 'Medication not appropriate for patient age',
  [ERROR_CODES.INTERACTION_WARNING]: 'Potential drug interaction detected',
} as const;

// User-Friendly Error Messages
export const USER_MESSAGES: Record<string, string> = {
  [ERROR_CODES.NETWORK_ERROR]: 'Unable to connect to the server. Please check your internet connection and try again.',
  [ERROR_CODES.TIMEOUT_ERROR]: 'The request took too long to complete. Please try again.',
  [ERROR_CODES.CONNECTION_LOST]: 'Connection lost. Please check your connection and refresh the page.',

  [ERROR_CODES.AUTHENTICATION_ERROR]: 'Your session has expired. Please log in again to continue.',
  [ERROR_CODES.AUTHORIZATION_ERROR]: 'You do not have permission to access this information.',
  [ERROR_CODES.SESSION_EXPIRED]: 'Your session has expired. Please log in again.',
  [ERROR_CODES.INVALID_CREDENTIALS]: 'Invalid username or password. Please try again.',
  [ERROR_CODES.ACCOUNT_LOCKED]: 'Your account has been temporarily locked. Please contact your administrator.',

  [ERROR_CODES.VALIDATION_ERROR]: 'Please check your input and try again.',
  [ERROR_CODES.REQUIRED_FIELD]: 'This field is required.',
  [ERROR_CODES.INVALID_FORMAT]: 'Please enter the information in the correct format.',
  [ERROR_CODES.INVALID_EMAIL]: 'Please enter a valid email address.',
  [ERROR_CODES.INVALID_PHONE]: 'Please enter a valid phone number.',
  [ERROR_CODES.INVALID_DATE]: 'Please enter a valid date.',

  [ERROR_CODES.NOT_FOUND]: 'The requested information was not found.',
  [ERROR_CODES.ALREADY_EXISTS]: 'This record already exists. Please check your information.',
  [ERROR_CODES.CONFLICT]: 'This action conflicts with existing data. Please refresh and try again.',
  [ERROR_CODES.DATA_INTEGRITY_ERROR]: 'Unable to save changes due to data constraints.',

  [ERROR_CODES.SERVER_ERROR]: 'The server is temporarily unavailable. Please try again in a few moments.',
  [ERROR_CODES.SERVICE_UNAVAILABLE]: 'The service is temporarily unavailable. Please try again later.',
  [ERROR_CODES.MAINTENANCE_MODE]: 'The system is currently under maintenance. Please try again later.',

  [ERROR_CODES.PATIENT_NOT_FOUND]: 'Patient record not found. Please check the information and try again.',
  [ERROR_CODES.MEDICATION_NOT_FOUND]: 'Medication not found. Please check the information and try again.',
  [ERROR_CODES.INVALID_DOSAGE]: 'The specified dosage is not valid for this medication.',
  [ERROR_CODES.ALLERGY_CONFLICT]: 'This medication may conflict with the patient\'s known allergies.',
  [ERROR_CODES.AGE_RESTRICTION]: 'This medication is not appropriate for the patient\'s age.',
  [ERROR_CODES.INTERACTION_WARNING]: 'This medication may interact with other medications the patient is taking.',
} as const;

// Error Titles for UI
export const ERROR_TITLES: Record<string, string> = {
  [ERROR_CODES.NETWORK_ERROR]: 'Connection Error',
  [ERROR_CODES.TIMEOUT_ERROR]: 'Request Timeout',
  [ERROR_CODES.CONNECTION_LOST]: 'Connection Lost',

  [ERROR_CODES.AUTHENTICATION_ERROR]: 'Authentication Required',
  [ERROR_CODES.AUTHORIZATION_ERROR]: 'Access Denied',
  [ERROR_CODES.SESSION_EXPIRED]: 'Session Expired',
  [ERROR_CODES.INVALID_CREDENTIALS]: 'Login Failed',
  [ERROR_CODES.ACCOUNT_LOCKED]: 'Account Locked',

  [ERROR_CODES.VALIDATION_ERROR]: 'Invalid Input',
  [ERROR_CODES.REQUIRED_FIELD]: 'Required Information',
  [ERROR_CODES.INVALID_FORMAT]: 'Invalid Format',
  [ERROR_CODES.INVALID_EMAIL]: 'Invalid Email',
  [ERROR_CODES.INVALID_PHONE]: 'Invalid Phone',
  [ERROR_CODES.INVALID_DATE]: 'Invalid Date',

  [ERROR_CODES.NOT_FOUND]: 'Not Found',
  [ERROR_CODES.ALREADY_EXISTS]: 'Already Exists',
  [ERROR_CODES.CONFLICT]: 'Data Conflict',
  [ERROR_CODES.DATA_INTEGRITY_ERROR]: 'Data Error',

  [ERROR_CODES.SERVER_ERROR]: 'Server Error',
  [ERROR_CODES.SERVICE_UNAVAILABLE]: 'Service Unavailable',
  [ERROR_CODES.MAINTENANCE_MODE]: 'Maintenance Mode',

  [ERROR_CODES.PATIENT_NOT_FOUND]: 'Patient Not Found',
  [ERROR_CODES.MEDICATION_NOT_FOUND]: 'Medication Not Found',
  [ERROR_CODES.INVALID_DOSAGE]: 'Invalid Dosage',
  [ERROR_CODES.ALLERGY_CONFLICT]: 'Allergy Alert',
  [ERROR_CODES.AGE_RESTRICTION]: 'Age Restriction',
  [ERROR_CODES.INTERACTION_WARNING]: 'Drug Interaction',
} as const;

// HTTP Status Code Mappings
export const HTTP_STATUS_MAPPING: Record<number, string> = {
  400: ERROR_CODES.VALIDATION_ERROR,
  401: ERROR_CODES.AUTHENTICATION_ERROR,
  403: ERROR_CODES.AUTHORIZATION_ERROR,
  404: ERROR_CODES.NOT_FOUND,
  408: ERROR_CODES.TIMEOUT_ERROR,
  409: ERROR_CODES.CONFLICT,
  422: ERROR_CODES.VALIDATION_ERROR,
  429: ERROR_CODES.SERVER_ERROR,
  500: ERROR_CODES.SERVER_ERROR,
  502: ERROR_CODES.SERVER_ERROR,
  503: ERROR_CODES.SERVICE_UNAVAILABLE,
  504: ERROR_CODES.TIMEOUT_ERROR,
} as const;

// Field-specific validation messages
export const FIELD_VALIDATION_MESSAGES = {
  email: {
    required: 'Email address is required',
    invalid: 'Please enter a valid email address',
    alreadyExists: 'This email address is already registered',
  },
  password: {
    required: 'Password is required',
    tooShort: 'Password must be at least 8 characters long',
    tooWeak: 'Password must contain uppercase, lowercase, number, and special character',
    mismatch: 'Passwords do not match',
  },
  phone: {
    required: 'Phone number is required',
    invalid: 'Please enter a valid phone number',
  },
  date: {
    required: 'Date is required',
    invalid: 'Please enter a valid date',
    future: 'Date cannot be in the future',
    past: 'Date cannot be in the past',
  },
  name: {
    required: 'Name is required',
    tooShort: 'Name must be at least 2 characters long',
    tooLong: 'Name cannot exceed 100 characters',
    invalid: 'Name contains invalid characters',
  },
  id: {
    required: 'ID is required',
    invalid: 'Please enter a valid ID',
    alreadyExists: 'This ID is already in use',
  },
} as const;

// Healthcare-specific error messages
export const HEALTHCARE_ERROR_MESSAGES = {
  medication: {
    notFound: 'Medication not found in database',
    invalidDosage: 'Dosage exceeds maximum recommended amount',
    frequencyError: 'Administration frequency is not appropriate',
    allergyConflict: 'Patient has known allergy to this medication',
    ageRestriction: 'Medication not approved for patient\'s age group',
    interaction: 'Potential interaction with current medications',
    expired: 'Medication has expired',
    outOfStock: 'Medication currently out of stock',
  },
  patient: {
    notFound: 'Patient record not found',
    duplicate: 'Patient with this information already exists',
    invalidData: 'Patient information contains invalid data',
    ageError: 'Patient age data is inconsistent',
  },
  record: {
    notFound: 'Health record not found',
    accessDenied: 'Access to this record is restricted',
    incomplete: 'Health record is incomplete',
    duplicate: 'Duplicate record detected',
  },
} as const;

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

// Error categories for logging and monitoring
export const ERROR_CATEGORIES = {
  USER_INPUT: 'user_input',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  DATA_ACCESS: 'data_access',
  SYSTEM_ERROR: 'system_error',
  NETWORK: 'network',
  VALIDATION: 'validation',
  HEALTHCARE: 'healthcare',
} as const;

// Utility functions for error handling
export const getErrorMessage = (code: string): string => {
  return ERROR_MESSAGES[code] || 'An unexpected error occurred';
};

export const getUserMessage = (code: string): string => {
  return USER_MESSAGES[code] || 'An unexpected error occurred. Please try again.';
};

export const getErrorTitle = (code: string): string => {
  return ERROR_TITLES[code] || 'Error';
};

export const getErrorSeverity = (code: string): string => {
  // Map error codes to severity levels
  if (code.includes('CRITICAL') || code.includes('INTERACTION') || code.includes('ALLERGY')) {
    return ERROR_SEVERITY.CRITICAL;
  }
  if (code.includes('AUTHORIZATION') || code.includes('NOT_FOUND') || code.includes('CONFLICT')) {
    return ERROR_SEVERITY.HIGH;
  }
  if (code.includes('VALIDATION') || code.includes('INVALID')) {
    return ERROR_SEVERITY.MEDIUM;
  }
  return ERROR_SEVERITY.LOW;
};

export const getErrorCategory = (code: string): string => {
  if (code.includes('AUTHENTICATION') || code.includes('AUTHORIZATION')) {
    return ERROR_CATEGORIES.AUTHENTICATION;
  }
  if (code.includes('NETWORK') || code.includes('TIMEOUT') || code.includes('CONNECTION')) {
    return ERROR_CATEGORIES.NETWORK;
  }
  if (code.includes('VALIDATION') || code.includes('INVALID') || code.includes('REQUIRED')) {
    return ERROR_CATEGORIES.VALIDATION;
  }
  if (code.includes('PATIENT') || code.includes('MEDICATION') || code.includes('HEALTH')) {
    return ERROR_CATEGORIES.HEALTHCARE;
  }
  if (code.includes('NOT_FOUND') || code.includes('ALREADY_EXISTS') || code.includes('CONFLICT')) {
    return ERROR_CATEGORIES.DATA_ACCESS;
  }
  return ERROR_CATEGORIES.SYSTEM_ERROR;
};

export default {
  CODES: ERROR_CODES,
  MESSAGES: ERROR_MESSAGES,
  USER_MESSAGES,
  TITLES: ERROR_TITLES,
  SEVERITY: ERROR_SEVERITY,
  CATEGORIES: ERROR_CATEGORIES,
  FIELD_VALIDATION: FIELD_VALIDATION_MESSAGES,
  HEALTHCARE: HEALTHCARE_ERROR_MESSAGES,
  HTTP_STATUS_MAPPING,
};
