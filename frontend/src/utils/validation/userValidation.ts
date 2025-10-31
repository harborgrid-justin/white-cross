/**
 * @fileoverview User validation utilities
 * @module utils/validation/userValidation
 */

/**
 * Validate email address
 */
export function validateEmail(email: string): boolean {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check for valid US phone number (10 or 11 digits)
  return cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith('1'));
}

/**
 * Validate required field
 */
export function validateRequired(value: string | number | boolean | null | undefined): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return !isNaN(value);
  if (typeof value === 'boolean') return true;
  return false;
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate name (first name, last name)
 */
export function validateName(name: string): boolean {
  if (!name) return false;
  
  // Allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  return nameRegex.test(name.trim()) && name.trim().length >= 2;
}

/**
 * Validate date of birth
 */
export function validateDateOfBirth(dob: string): {
  isValid: boolean;
  error?: string;
} {
  if (!dob) {
    return { isValid: false, error: 'Date of birth is required' };
  }
  
  const date = new Date(dob);
  const now = new Date();
  
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }
  
  if (date > now) {
    return { isValid: false, error: 'Date of birth cannot be in the future' };
  }
  
  // Check if age is reasonable (not older than 150 years)
  const age = now.getFullYear() - date.getFullYear();
  if (age > 150) {
    return { isValid: false, error: 'Date of birth is too far in the past' };
  }
  
  return { isValid: true };
}

/**
 * Validate ZIP code
 */
export function validateZipCode(zipCode: string): boolean {
  if (!zipCode) return false;
  
  // US ZIP code format: 12345 or 12345-6789
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode.trim());
}

/**
 * Validate social security number
 */
export function validateSSN(ssn: string): boolean {
  if (!ssn) return false;
  
  // Remove all non-digit characters
  const cleaned = ssn.replace(/\D/g, '');
  
  // Must be exactly 9 digits
  if (cleaned.length !== 9) return false;
  
  // Cannot be all zeros or certain invalid patterns
  if (cleaned === '000000000' || cleaned === '123456789') return false;
  
  return true;
}

/**
 * Validate emergency contact information
 */
export function validateEmergencyContact(contact: {
  name?: string;
  phone?: string;
  relationship?: string;
}): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  
  if (!contact.name || !validateName(contact.name)) {
    errors.name = 'Valid contact name is required';
  }
  
  if (!contact.phone || !validatePhone(contact.phone)) {
    errors.phone = 'Valid phone number is required';
  }
  
  if (!contact.relationship || contact.relationship.trim().length < 2) {
    errors.relationship = 'Relationship is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
