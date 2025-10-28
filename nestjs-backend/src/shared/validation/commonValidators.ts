/**
 * Common validation utilities used across multiple services
 */

import { ValidationResult, ValidationError, ValidationErrorCode } from '../security/validation.service';

/**
 * Validate UUID format
 */
export function validateUUID(value: string, fieldName: string = 'ID'): ValidationResult {
  const errors: ValidationError[] = [];
  
  if (!value) {
    errors.push({
      field: fieldName,
      message: `${fieldName} is required`,
      code: ValidationErrorCode.REQUIRED
    });
  } else if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
    errors.push({
      field: fieldName,
      message: `${fieldName} must be a valid UUID format`,
      code: ValidationErrorCode.INVALID_FORMAT,
      value
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}

/**
 * Validate required fields
 */
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): ValidationResult {
  const errors: ValidationError[] = [];

  for (const field of requiredFields) {
    const value = data[field];
    
    if (value === undefined || value === null || value === '') {
      errors.push({
        field,
        message: `${field} is required`,
        code: ValidationErrorCode.REQUIRED
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}

/**
 * Validate email format
 */
export function validateEmail(email: string, fieldName: string = 'email'): ValidationResult {
  const errors: ValidationError[] = [];
  
  if (!email) {
    errors.push({
      field: fieldName,
      message: `${fieldName} is required`,
      code: ValidationErrorCode.REQUIRED
    });
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push({
        field: fieldName,
        message: `${fieldName} must be a valid email address`,
        code: ValidationErrorCode.INVALID_FORMAT,
        value: email
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}

/**
 * Validate phone number format
 */
export function validatePhoneNumber(phone: string, fieldName: string = 'phone'): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  if (!phone) {
    errors.push({
      field: fieldName,
      message: `${fieldName} is required`,
      code: ValidationErrorCode.REQUIRED
    });
  } else {
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (digitsOnly.length < 10) {
      errors.push({
        field: fieldName,
        message: `${fieldName} must contain at least 10 digits`,
        code: ValidationErrorCode.TOO_SHORT,
        value: phone
      });
    } else if (digitsOnly.length > 15) {
      errors.push({
        field: fieldName,
        message: `${fieldName} cannot contain more than 15 digits`,
        code: ValidationErrorCode.TOO_LONG,
        value: phone
      });
    }

    // Warn about common formatting issues
    if (!/^[\d\s\-\(\)\+\.]+$/.test(phone)) {
      warnings.push({
        field: fieldName,
        message: `${fieldName} contains unusual characters`,
        code: ValidationErrorCode.UNUSUAL_FORMAT,
        value: phone
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate string length constraints
 */
export function validateStringLength(
  value: string,
  fieldName: string,
  constraints: { min?: number; max?: number }
): ValidationResult {
  const errors: ValidationError[] = [];
  const { min, max } = constraints;

  if (!value) {
    if (min && min > 0) {
      errors.push({
        field: fieldName,
        message: `${fieldName} is required`,
        code: ValidationErrorCode.REQUIRED
      });
    }
  } else {
    if (min !== undefined && value.length < min) {
      errors.push({
        field: fieldName,
        message: `${fieldName} must be at least ${min} characters long`,
        code: ValidationErrorCode.TOO_SHORT,
        value: value.length
      });
    }

    if (max !== undefined && value.length > max) {
      errors.push({
        field: fieldName,
        message: `${fieldName} cannot exceed ${max} characters`,
        code: ValidationErrorCode.TOO_LONG,
        value: value.length
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}

/**
 * Validate numeric range
 */
export function validateNumericRange(
  value: number,
  fieldName: string,
  constraints: { min?: number; max?: number; integer?: boolean }
): ValidationResult {
  const errors: ValidationError[] = [];
  const { min, max, integer } = constraints;

  if (value === undefined || value === null) {
    errors.push({
      field: fieldName,
      message: `${fieldName} is required`,
      code: ValidationErrorCode.REQUIRED
    });
  } else {
    if (typeof value !== 'number' || isNaN(value)) {
      errors.push({
        field: fieldName,
        message: `${fieldName} must be a valid number`,
        code: ValidationErrorCode.INVALID_TYPE,
        value
      });
    } else {
      if (integer && !Number.isInteger(value)) {
        errors.push({
          field: fieldName,
          message: `${fieldName} must be an integer`,
          code: ValidationErrorCode.NOT_INTEGER,
          value
        });
      }

      if (min !== undefined && value < min) {
        errors.push({
          field: fieldName,
          message: `${fieldName} must be at least ${min}`,
          code: ValidationErrorCode.TOO_SMALL,
          value
        });
      }

      if (max !== undefined && value > max) {
        errors.push({
          field: fieldName,
          message: `${fieldName} cannot exceed ${max}`,
          code: ValidationErrorCode.TOO_LARGE,
          value
        });
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}

/**
 * Validate enum value
 */
export function validateEnum<T extends string>(
  value: T,
  fieldName: string,
  allowedValues: readonly T[]
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!value) {
    errors.push({
      field: fieldName,
      message: `${fieldName} is required`,
      code: ValidationErrorCode.REQUIRED
    });
  } else if (!allowedValues.includes(value)) {
    errors.push({
      field: fieldName,
      message: `${fieldName} must be one of: ${allowedValues.join(', ')}`,
      code: ValidationErrorCode.INVALID_VALUE,
      value
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
}

/**
 * Validate array constraints
 */
export function validateArray(
  value: any[],
  fieldName: string,
  constraints: { 
    minLength?: number; 
    maxLength?: number; 
    uniqueItems?: boolean;
    itemValidator?: (item: any, index: number) => ValidationResult;
  }
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const { minLength, maxLength, uniqueItems, itemValidator } = constraints;

  if (!Array.isArray(value)) {
    errors.push({
      field: fieldName,
      message: `${fieldName} must be an array`,
      code: ValidationErrorCode.INVALID_TYPE,
      value
    });
    return { isValid: false, errors, warnings };
  }

  if (minLength !== undefined && value.length < minLength) {
    errors.push({
      field: fieldName,
      message: `${fieldName} must contain at least ${minLength} items`,
      code: ValidationErrorCode.TOO_SHORT,
      value: value.length
    });
  }

  if (maxLength !== undefined && value.length > maxLength) {
    errors.push({
      field: fieldName,
      message: `${fieldName} cannot contain more than ${maxLength} items`,
      code: ValidationErrorCode.TOO_LONG,
      value: value.length
    });
  }

  if (uniqueItems && value.length > 0) {
    const unique = new Set(value);
    if (unique.size !== value.length) {
      warnings.push({
        field: fieldName,
        message: `${fieldName} contains duplicate items`,
        code: ValidationErrorCode.DUPLICATE_ITEMS
      });
    }
  }

  // Validate individual items if validator provided
  if (itemValidator) {
    value.forEach((item, index) => {
      const itemResult = itemValidator(item, index);
      
      // Prefix field names with array index
      itemResult.errors.forEach(error => {
        errors.push({
          ...error,
          field: `${fieldName}[${index}].${error.field}`
        });
      });

      if (itemResult.warnings && itemResult.warnings.length > 0) {
        itemResult.warnings.forEach(warning => {
          warnings.push({
            ...warning,
            field: `${fieldName}[${index}].${warning.field}`
          });
        });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Combine multiple validation results
 */
export function combineValidationResults(...results: ValidationResult[]): ValidationResult {
  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationError[] = [];

  for (const result of results) {
    allErrors.push(...result.errors);
    if (result.warnings && result.warnings.length > 0) {
      allWarnings.push(...result.warnings);
    }
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
}

/**
 * Validate object against schema
 */
export function validateObject(
  data: Record<string, any>,
  schema: Record<string, (value: any) => ValidationResult>
): ValidationResult {
  const results: ValidationResult[] = [];

  for (const [field, validator] of Object.entries(schema)) {
    const value = data[field];
    const result = validator(value);
    results.push(result);
  }

  return combineValidationResults(...results);
}
