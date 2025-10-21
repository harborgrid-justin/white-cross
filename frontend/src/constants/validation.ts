/**
 * WF-COMP-112 | validation.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./config | Dependencies: ./config
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, constants | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Centralized validation constants and rules for the healthcare platform
 * Provides consistent validation patterns and messages across the application
 */

import { VALIDATION_CONFIG } from './config';

// Field validation patterns
export const VALIDATION_PATTERNS = {
  // Basic patterns
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[+]?[1-9][\d]{0,15}$/,
  ZIP_CODE: /^\d{5}(-\d{4})?$/,
  SSN: /^\d{3}-?\d{2}-?\d{4}$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/,
  TIME: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  DATETIME: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,

  // Healthcare specific patterns
  MEDICAL_RECORD_NUMBER: /^[A-Z0-9]{6,12}$/,
  STUDENT_ID: /^[A-Z0-9-]{5,15}$/,
  NURSE_LICENSE: /^[A-Z]{2}\d{6,8}$/,
  MEDICATION_ID: /^[A-Z0-9]{8,12}$/,

  // Name patterns (allowing international characters)
  FIRST_NAME: /^[a-zA-ZàáâäçèéêëìíîïñòóôöùúûüÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽž\s'-]{1,50}$/,
  LAST_NAME: /^[a-zA-ZàáâäçèéêëìíîïñòóôöùúûüÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽž\s'-]{1,50}$/,
  FULL_NAME: /^[a-zA-ZàáâäçèéêëìíîïñòóôöùúûüÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽž\s'-]{2,100}$/,

  // Address patterns
  ADDRESS_LINE: /^[a-zA-Z0-9\s,.-/#]{5,100}$/,
  CITY: /^[a-zA-Z\s'-]{2,50}$/,
  STATE: /^[A-Z]{2}$/,

  // Medical patterns
  DOSAGE: /^\d+(\.\d+)?\s?(mg|g|mcg|ml|l|units|IU|mEq|%|drops|tablets|capsules)$/i,
  FREQUENCY: /^(?:PRN|Once|Twice|BID|TID|QID|Q\w*|Every \d+ hours?|Daily|Weekly|Monthly)$/i,
  ICD_CODE: /^[A-Z]\d{2}(\.\d{1,2})?$/,
  CPT_CODE: /^\d{5}$/,

  // Security patterns
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  USERNAME: /^[a-zA-Z0-9_-]{3,30}$/,
} as const;

// Validation rules for different field types
export const VALIDATION_RULES = {
  // Basic field rules
  email: {
    required: true,
    pattern: VALIDATION_PATTERNS.EMAIL,
    minLength: 5,
    maxLength: 254,
    custom: (value: string) => {
      const localPart = value.split('@')[0];
      return localPart && localPart.length <= 64;
    },
  },

  password: {
    required: true,
    minLength: VALIDATION_CONFIG.MIN_PASSWORD_LENGTH,
    maxLength: 128,
    pattern: VALIDATION_PATTERNS.PASSWORD,
  },

  phone: {
    required: true,
    pattern: VALIDATION_PATTERNS.PHONE,
    custom: (value: string) => {
      const digits = value.replace(/\D/g, '');
      return digits.length >= 10 && digits.length <= 15;
    },
  },

  firstName: {
    required: true,
    pattern: VALIDATION_PATTERNS.FIRST_NAME,
    minLength: 1,
    maxLength: 50,
  },

  lastName: {
    required: true,
    pattern: VALIDATION_PATTERNS.LAST_NAME,
    minLength: 1,
    maxLength: 50,
  },

  // Healthcare specific rules
  medicalRecordNumber: {
    required: true,
    pattern: VALIDATION_PATTERNS.MEDICAL_RECORD_NUMBER,
    minLength: 6,
    maxLength: 12,
  },

  studentId: {
    required: true,
    pattern: VALIDATION_PATTERNS.STUDENT_ID,
    minLength: 5,
    maxLength: 15,
  },

  dateOfBirth: {
    required: true,
    pattern: VALIDATION_PATTERNS.DATE,
    custom: (value: string) => {
      const date = new Date(value);
      const now = new Date();
      const hundredYearsAgo = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
      return date >= hundredYearsAgo && date <= now;
    },
  },

  dosage: {
    required: true,
    pattern: VALIDATION_PATTERNS.DOSAGE,
    maxLength: 50,
  },

  frequency: {
    required: true,
    pattern: VALIDATION_PATTERNS.FREQUENCY,
    maxLength: 50,
  },

  // Address rules
  address: {
    required: true,
    pattern: VALIDATION_PATTERNS.ADDRESS_LINE,
    minLength: 5,
    maxLength: 100,
  },

  city: {
    required: true,
    pattern: VALIDATION_PATTERNS.CITY,
    minLength: 2,
    maxLength: 50,
  },

  state: {
    required: true,
    pattern: VALIDATION_PATTERNS.STATE,
    minLength: 2,
    maxLength: 2,
  },

  zipCode: {
    required: true,
    pattern: VALIDATION_PATTERNS.ZIP_CODE,
    minLength: 5,
    maxLength: 10,
  },
} as const;

// Field length limits
export const FIELD_LIMITS = {
  // Basic fields
  EMAIL: { min: 5, max: 254 },
  PASSWORD: { min: VALIDATION_CONFIG.MIN_PASSWORD_LENGTH, max: 128 },
  USERNAME: { min: 3, max: 30 },
  PHONE: { min: 10, max: 15 },

  // Name fields
  FIRST_NAME: { min: 1, max: 50 },
  LAST_NAME: { min: 1, max: 50 },
  FULL_NAME: { min: 2, max: 100 },

  // Healthcare fields
  MEDICAL_RECORD: { min: 6, max: 12 },
  STUDENT_ID: { min: 5, max: 15 },
  NURSE_LICENSE: { min: 8, max: 10 },
  MEDICATION_ID: { min: 8, max: 12 },

  // Medical data
  DOSAGE: { min: 1, max: 50 },
  FREQUENCY: { min: 1, max: 50 },
  ICD_CODE: { min: 3, max: 7 },
  CPT_CODE: { min: 5, max: 5 },

  // Address fields
  ADDRESS_LINE: { min: 5, max: 100 },
  CITY: { min: 2, max: 50 },
  STATE: { min: 2, max: 2 },
  ZIP_CODE: { min: 5, max: 10 },

  // Content fields
  NOTES: { min: 0, max: 2000 },
  DESCRIPTION: { min: 0, max: 1000 },
  COMMENTS: { min: 0, max: 500 },

  // Search and filters
  SEARCH_QUERY: { min: 0, max: 100 },
  FILTER_VALUE: { min: 0, max: 50 },
} as const;

// Validation error messages
export const VALIDATION_MESSAGES = {
  // Basic validation messages
  REQUIRED: 'This field is required',
  INVALID_FORMAT: 'Please enter a valid format',
  TOO_SHORT: (field: string, min: number) => `${field} must be at least ${min} characters`,
  TOO_LONG: (field: string, max: number) => `${field} cannot exceed ${max} characters`,
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_DATE: 'Please enter a valid date',

  // Healthcare specific messages
  INVALID_MEDICAL_RECORD: 'Please enter a valid medical record number',
  INVALID_STUDENT_ID: 'Please enter a valid student ID',
  INVALID_NURSE_LICENSE: 'Please enter a valid nurse license number',
  INVALID_DOSAGE: 'Please enter a valid dosage',
  INVALID_FREQUENCY: 'Please enter a valid administration frequency',
  INVALID_ICD_CODE: 'Please enter a valid ICD code',
  INVALID_CPT_CODE: 'Please enter a valid CPT code',

  // Date validation messages
  DATE_TOO_FAR_PAST: 'Date cannot be more than 100 years ago',
  DATE_IN_FUTURE: 'Date cannot be in the future',
  INVALID_DATE_RANGE: 'End date must be after start date',

  // Age validation messages
  AGE_TOO_YOUNG: 'Patient age is too young for this medication',
  AGE_TOO_OLD: 'Patient age is too old for this medication',
  AGE_RESTRICTION: 'This medication is not appropriate for the patient\'s age',

  // Security messages
  PASSWORD_TOO_WEAK: 'Password must contain uppercase, lowercase, number, and special character',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  INVALID_USERNAME: 'Username can only contain letters, numbers, underscores, and hyphens',

  // Business logic messages
  DUPLICATE_ENTRY: 'This entry already exists',
  CONFLICTING_DATA: 'This data conflicts with existing records',
  MISSING_REQUIRED_FIELDS: 'Please fill in all required fields',
} as const;

// Form validation schemas for different forms
export const FORM_SCHEMAS = {
  login: {
    email: VALIDATION_RULES.email,
    password: VALIDATION_RULES.password,
  },

  patient: {
    firstName: VALIDATION_RULES.firstName,
    lastName: VALIDATION_RULES.lastName,
    dateOfBirth: VALIDATION_RULES.dateOfBirth,
    medicalRecordNumber: VALIDATION_RULES.medicalRecordNumber,
    studentId: VALIDATION_RULES.studentId,
  },

  medication: {
    name: { required: true, minLength: 2, maxLength: 100 },
    dosage: VALIDATION_RULES.dosage,
    frequency: VALIDATION_RULES.frequency,
    instructions: { required: false, minLength: 0, maxLength: 500 },
  },

  address: {
    addressLine1: VALIDATION_RULES.address,
    addressLine2: { required: false, pattern: VALIDATION_PATTERNS.ADDRESS_LINE, minLength: 5, maxLength: 100 },
    city: VALIDATION_RULES.city,
    state: VALIDATION_RULES.state,
    zipCode: VALIDATION_RULES.zipCode,
  },

  emergencyContact: {
    name: { required: true, minLength: 2, maxLength: 100 },
    relationship: { required: true, minLength: 2, maxLength: 50 },
    phone: VALIDATION_RULES.phone,
    email: { required: false, pattern: VALIDATION_PATTERNS.EMAIL, minLength: 5, maxLength: 254 },
  },
} as const;

// Custom validation functions
export const CUSTOM_VALIDATORS = {
  // Date validators
  isValidDate: (value: string): boolean => {
    const date = new Date(value);
    return !Number.isNaN(date.getTime());
  },

  isDateInRange: (value: string, minDate?: Date, maxDate?: Date): boolean => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return false;

    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;

    return true;
  },

  isAdult: (dateOfBirth: string): boolean => {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1 >= 18;
    }

    return age >= 18;
  },

  // Healthcare validators
  isValidDosage: (dosage: string): boolean => {
    return VALIDATION_PATTERNS.DOSAGE.test(dosage);
  },

  isValidMedicalRecord: (record: string): boolean => {
    return VALIDATION_PATTERNS.MEDICAL_RECORD_NUMBER.test(record);
  },

  isValidStudentId: (studentId: string): boolean => {
    return VALIDATION_PATTERNS.STUDENT_ID.test(studentId);
  },

  // Security validators
  isStrongPassword: (password: string): boolean => {
    return VALIDATION_PATTERNS.PASSWORD.test(password);
  },

  isValidUsername: (username: string): boolean => {
    return VALIDATION_PATTERNS.USERNAME.test(username);
  },

  // Business logic validators
  hasUniqueEmail: async (email: string, excludeId?: string): Promise<boolean> => {
    try {
      // Make API call to check email uniqueness
      const queryParams = new URLSearchParams();
      queryParams.append('email', email);
      if (excludeId) {
        queryParams.append('excludeId', excludeId);
      }

      const response = await fetch(`/api/users/check-email?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add auth token if needed
          ...(localStorage.getItem('token') && {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          })
        }
      });

      if (!response.ok) {
        console.error('Failed to check email uniqueness:', response.statusText);
        // Return true to not block on API error
        return true;
      }

      const data = await response.json();
      return data.isUnique !== false; // Assume unique if not explicitly false
    } catch (error) {
      console.error('Error checking email uniqueness:', error);
      // Return true to not block on error
      return true;
    }
  },

  hasUniqueStudentId: async (studentId: string, excludeId?: string): Promise<boolean> => {
    try {
      // Make API call to check student ID uniqueness
      const queryParams = new URLSearchParams();
      queryParams.append('studentId', studentId);
      if (excludeId) {
        queryParams.append('excludeId', excludeId);
      }

      const response = await fetch(`/api/students/check-id?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') && {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          })
        }
      });

      if (!response.ok) {
        console.error('Failed to check student ID uniqueness:', response.statusText);
        // Return true to not block on API error
        return true;
      }

      const data = await response.json();
      return data.isUnique !== false; // Assume unique if not explicitly false
    } catch (error) {
      console.error('Error checking student ID uniqueness:', error);
      // Return true to not block on error
      return true;
    }
  },
} as const;

// Validation helper functions
export const validateField = (
  fieldName: string,
  value: any,
  rules: any
): { isValid: boolean; message?: string } => {
  // Check required
  if (rules.required && (!value || value.toString().trim() === '')) {
    return { isValid: false, message: VALIDATION_MESSAGES.REQUIRED };
  }

  // Skip other validations if field is empty and not required
  if (!value || value.toString().trim() === '') {
    return { isValid: true };
  }

  // Check pattern
  if (rules.pattern && !rules.pattern.test(value)) {
    const messageKey = `INVALID_${fieldName.toUpperCase()}` as keyof typeof VALIDATION_MESSAGES;
    const messageValue = VALIDATION_MESSAGES[messageKey];
    const message = typeof messageValue === 'function' ? messageValue(fieldName, 0) : (messageValue || VALIDATION_MESSAGES.INVALID_FORMAT);
    return { isValid: false, message };
  }

  // Check length
  const stringValue = value.toString();
  if (rules.minLength && stringValue.length < rules.minLength) {
    return { isValid: false, message: VALIDATION_MESSAGES.TOO_SHORT(fieldName, rules.minLength) };
  }

  if (rules.maxLength && stringValue.length > rules.maxLength) {
    return { isValid: false, message: VALIDATION_MESSAGES.TOO_LONG(fieldName, rules.maxLength) };
  }

  // Check custom validation
  if (rules.custom && !rules.custom(value)) {
    return { isValid: false, message: VALIDATION_MESSAGES.INVALID_FORMAT };
  }

  return { isValid: true };
};

export const validateForm = (
  formData: Record<string, any>,
  schema: Record<string, any>
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  Object.entries(schema).forEach(([fieldName, rules]) => {
    const result = validateField(fieldName, formData[fieldName], rules);
    if (!result.isValid && result.message) {
      errors[fieldName] = result.message;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  PATTERNS: VALIDATION_PATTERNS,
  RULES: VALIDATION_RULES,
  LIMITS: FIELD_LIMITS,
  MESSAGES: VALIDATION_MESSAGES,
  SCHEMAS: FORM_SCHEMAS,
  CUSTOM_VALIDATORS,
  validateField,
  validateForm,
};
