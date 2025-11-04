/**
 * Unit Tests for Validation Utility Functions
 *
 * Tests all validation utilities including:
 * - Email, phone, ZIP code validation
 * - Healthcare-specific validations (NPI, ICD-10, NDC)
 * - PHI detection
 * - Password validation
 * - General validations
 *
 * @module lib/utils/validation.test
 */

import {
  isValidEmail,
  isValidPhoneNumber,
  isValidZipCode,
  isValidSSN,
  isValidNPI,
  isValidICD10,
  isValidNDC,
  isValidMRN,
  containsPHI,
  validatePassword,
  isValidDateOfBirth,
  isValidURL,
  isValidDosage,
  isRequired,
  isInRange,
  isOneOf,
} from './validation';

describe('isValidEmail', () => {
  it('should return true for valid emails', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('test.user@example.co.uk')).toBe(true);
    expect(isValidEmail('user+tag@example.com')).toBe(true);
  });

  it('should return false for invalid emails', () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('user example.com')).toBe(false);
  });
});

describe('isValidPhoneNumber', () => {
  it('should return true for valid phone numbers', () => {
    expect(isValidPhoneNumber('1234567890')).toBe(true);
    expect(isValidPhoneNumber('(123) 456-7890')).toBe(true);
    expect(isValidPhoneNumber('123-456-7890')).toBe(true);
    expect(isValidPhoneNumber('11234567890')).toBe(true);
  });

  it('should return false for invalid phone numbers', () => {
    expect(isValidPhoneNumber('123')).toBe(false);
    expect(isValidPhoneNumber('abcdefghij')).toBe(false);
  });
});

describe('isValidZipCode', () => {
  it('should return true for valid ZIP codes', () => {
    expect(isValidZipCode('12345')).toBe(true);
    expect(isValidZipCode('12345-6789')).toBe(true);
  });

  it('should return false for invalid ZIP codes', () => {
    expect(isValidZipCode('1234')).toBe(false);
    expect(isValidZipCode('123456')).toBe(false);
    expect(isValidZipCode('abcde')).toBe(false);
  });
});

describe('isValidSSN', () => {
  it('should return true for valid SSN formats', () => {
    expect(isValidSSN('123-45-6789')).toBe(true);
    expect(isValidSSN('123456789')).toBe(true);
  });

  it('should return false for invalid SSNs', () => {
    expect(isValidSSN('000-00-0000')).toBe(false);
    expect(isValidSSN('123-45-6789'.replace('123', '000'))).toBe(false);
    expect(isValidSSN('666-45-6789')).toBe(false);
    expect(isValidSSN('923-45-6789')).toBe(false);
    expect(isValidSSN('123')).toBe(false);
    expect(isValidSSN('123456789').replace('123456789', '123456789')).toBe(true);
  });
});

describe('isValidNPI', () => {
  it('should return true for valid NPI with Luhn check', () => {
    // Valid NPI that passes Luhn algorithm
    expect(isValidNPI('1234567893')).toBe(true);
  });

  it('should return false for invalid length', () => {
    expect(isValidNPI('123')).toBe(false);
    expect(isValidNPI('12345678901')).toBe(false);
  });

  it('should return false for invalid Luhn check', () => {
    expect(isValidNPI('1234567890')).toBe(false);
  });
});

describe('isValidICD10', () => {
  it('should return true for valid ICD-10 codes', () => {
    expect(isValidICD10('A00.0')).toBe(true);
    expect(isValidICD10('Z99.89')).toBe(true);
    expect(isValidICD10('M54.5')).toBe(true);
    expect(isValidICD10('E11')).toBe(true);
  });

  it('should return false for invalid ICD-10 codes', () => {
    expect(isValidICD10('123')).toBe(false);
    expect(isValidICD10('ABC')).toBe(false);
    expect(isValidICD10('A')).toBe(false);
  });

  it('should handle lowercase input', () => {
    expect(isValidICD10('a00.0')).toBe(true);
  });
});

describe('isValidNDC', () => {
  it('should return true for valid NDC formats', () => {
    expect(isValidNDC('12345-6789-01')).toBe(true);
    expect(isValidNDC('1234-5678-90')).toBe(true);
    expect(isValidNDC('12345678901')).toBe(true);
  });

  it('should return false for invalid NDC formats', () => {
    expect(isValidNDC('123')).toBe(false);
    expect(isValidNDC('12345-678-01')).toBe(false);
  });
});

describe('isValidMRN', () => {
  it('should return true for valid MRNs', () => {
    expect(isValidMRN('MRN123456')).toBe(true);
    expect(isValidMRN('123456')).toBe(true);
    expect(isValidMRN('MRN-123456')).toBe(true);
  });

  it('should return false for too short MRNs', () => {
    expect(isValidMRN('12345')).toBe(false);
  });

  it('should return false for too long MRNs', () => {
    expect(isValidMRN('123456789012345678901')).toBe(false);
  });

  it('should return false for MRN without digits', () => {
    expect(isValidMRN('ABCDEFGH')).toBe(false);
  });

  it('should respect custom length parameters', () => {
    expect(isValidMRN('1234', 4, 6)).toBe(true);
    expect(isValidMRN('123', 4, 6)).toBe(false);
  });
});

describe('containsPHI', () => {
  it('should detect SSN patterns', () => {
    expect(containsPHI('Patient SSN: 123-45-6789')).toBe(true);
    expect(containsPHI('SSN 123456789')).toBe(true);
  });

  it('should detect phone numbers', () => {
    expect(containsPHI('Call me at (555) 123-4567')).toBe(true);
    expect(containsPHI('Phone: 555-123-4567')).toBe(true);
  });

  it('should detect email addresses', () => {
    expect(containsPHI('Contact: patient@example.com')).toBe(true);
  });

  it('should detect date patterns', () => {
    expect(containsPHI('DOB: 01/15/1990')).toBe(true);
    expect(containsPHI('Born: 1990-01-15')).toBe(true);
  });

  it('should detect MRN patterns', () => {
    expect(containsPHI('MRN: 123456')).toBe(true);
    expect(containsPHI('MRN-123456')).toBe(true);
  });

  it('should detect ID numbers', () => {
    expect(containsPHI('ID: 123456789')).toBe(true);
  });

  it('should return false for general text', () => {
    expect(containsPHI('General information')).toBe(false);
    expect(containsPHI('Patient has flu')).toBe(false);
  });
});

describe('validatePassword', () => {
  it('should validate strong password', () => {
    const result = validatePassword('Test123!');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should detect too short password', () => {
    const result = validatePassword('Test1!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters');
  });

  it('should detect missing uppercase', () => {
    const result = validatePassword('test123!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one uppercase letter');
  });

  it('should detect missing lowercase', () => {
    const result = validatePassword('TEST123!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one lowercase letter');
  });

  it('should detect missing digit', () => {
    const result = validatePassword('TestTest!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one digit');
  });

  it('should detect missing special character', () => {
    const result = validatePassword('Test1234');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one special character');
  });

  it('should handle custom minimum length', () => {
    const result = validatePassword('Test123!', 10);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 10 characters');
  });
});

describe('isValidDateOfBirth', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-11-04'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should return true for valid date of birth', () => {
    expect(isValidDateOfBirth('2010-01-01')).toBe(true);
    expect(isValidDateOfBirth(new Date('2010-01-01'))).toBe(true);
  });

  it('should return false for invalid date', () => {
    expect(isValidDateOfBirth('invalid')).toBe(false);
  });

  it('should respect minimum age', () => {
    expect(isValidDateOfBirth('2024-01-01', 5)).toBe(false);
    expect(isValidDateOfBirth('2015-01-01', 5)).toBe(true);
  });

  it('should respect maximum age', () => {
    expect(isValidDateOfBirth('1900-01-01', 0, 120)).toBe(false);
    expect(isValidDateOfBirth('1950-01-01', 0, 120)).toBe(true);
  });
});

describe('isValidURL', () => {
  it('should return true for valid URLs', () => {
    expect(isValidURL('https://example.com')).toBe(true);
    expect(isValidURL('http://example.com')).toBe(true);
    expect(isValidURL('https://example.com/path?query=1')).toBe(true);
  });

  it('should return false for invalid URLs', () => {
    expect(isValidURL('not a url')).toBe(false);
    expect(isValidURL('example.com')).toBe(false);
  });
});

describe('isValidDosage', () => {
  it('should return true for valid dosage formats', () => {
    expect(isValidDosage('10mg')).toBe(true);
    expect(isValidDosage('5ml')).toBe(true);
    expect(isValidDosage('2 tablets')).toBe(true);
    expect(isValidDosage('1 capsule')).toBe(true);
    expect(isValidDosage('3 drops')).toBe(true);
    expect(isValidDosage('500mcg')).toBe(true);
  });

  it('should handle decimal dosages', () => {
    expect(isValidDosage('2.5mg')).toBe(true);
    expect(isValidDosage('1.5 tablets')).toBe(true);
  });

  it('should return false for invalid dosages', () => {
    expect(isValidDosage('invalid')).toBe(false);
    expect(isValidDosage('abc')).toBe(false);
  });
});

describe('isRequired', () => {
  it('should return true for non-empty values', () => {
    expect(isRequired('value')).toBe(true);
    expect(isRequired('0')).toBe(true);
    expect(isRequired([1, 2, 3])).toBe(true);
    expect(isRequired(0)).toBe(true);
  });

  it('should return false for empty values', () => {
    expect(isRequired('')).toBe(false);
    expect(isRequired('   ')).toBe(false);
    expect(isRequired(null)).toBe(false);
    expect(isRequired(undefined)).toBe(false);
    expect(isRequired([])).toBe(false);
  });
});

describe('isInRange', () => {
  it('should return true for values in range', () => {
    expect(isInRange(5, 1, 10)).toBe(true);
    expect(isInRange(1, 1, 10)).toBe(true);
    expect(isInRange(10, 1, 10)).toBe(true);
  });

  it('should return false for values out of range', () => {
    expect(isInRange(0, 1, 10)).toBe(false);
    expect(isInRange(11, 1, 10)).toBe(false);
    expect(isInRange(-5, 1, 10)).toBe(false);
  });
});

describe('isOneOf', () => {
  it('should return true for allowed values', () => {
    expect(isOneOf('active', ['active', 'inactive'])).toBe(true);
    expect(isOneOf(1, [1, 2, 3])).toBe(true);
  });

  it('should return false for disallowed values', () => {
    expect(isOneOf('pending', ['active', 'inactive'])).toBe(false);
    expect(isOneOf(4, [1, 2, 3])).toBe(false);
  });

  it('should work with different types', () => {
    expect(isOneOf('admin', ['admin', 'nurse', 'doctor'])).toBe(true);
  });
});
