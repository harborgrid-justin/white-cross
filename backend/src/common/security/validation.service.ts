/**
 * Validation Service Types and Interfaces
 */

export interface ValidationError {
  field: string;
  message: string;
  code: ValidationErrorCode;
  value?: any;
}

export enum ValidationErrorCode {
  REQUIRED = 'REQUIRED',
  INVALID_FORMAT = 'INVALID_FORMAT',
  INVALID_TYPE = 'INVALID_TYPE',
  TOO_SHORT = 'TOO_SHORT',
  TOO_LONG = 'TOO_LONG',
  TOO_SMALL = 'TOO_SMALL',
  TOO_LARGE = 'TOO_LARGE',
  NOT_INTEGER = 'NOT_INTEGER',
  INVALID_VALUE = 'INVALID_VALUE',
  DUPLICATE_ITEMS = 'DUPLICATE_ITEMS',
  UNUSUAL_FORMAT = 'UNUSUAL_FORMAT',
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings?: ValidationError[];
}
