import _ from 'lodash';
import { SEARCH_CONFIG, PAGINATION_CONFIG, VALIDATION_CONFIG } from '../constants/config';

/**
 * Frontend utility functions using lodash for common operations
 * Provides type-safe lodash wrappers for frequently used operations in React components
 * Enhanced with centralized configuration constants for consistency
 */

// Use the imported configuration constants
const DEFAULT_PAGE_SIZE = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE;
const DEFAULT_SEARCH_DELAY = SEARCH_CONFIG.SEARCH_DELAY;
const MAX_FIELD_LENGTH = VALIDATION_CONFIG.MAX_FIELD_LENGTH;

// Collection utilities
export const arrayUtils = {
  /**
   * Groups array of objects by a key
   */
  groupBy: <T>(array: T[], key: keyof T) => _.groupBy(array, key),

  /**
   * Removes duplicates from array of objects by a key
   */
  uniqBy: <T>(array: T[], key: keyof T) => _.uniqBy(array, key),

  /**
   * Chunks array into smaller arrays of specified size
   */
  chunk: <T>(array: T[], size: number) => _.chunk(array, size),

  /**
   * Finds intersection of multiple arrays
   */
  intersection: <T>(arrays: T[][]) => _.intersection(...arrays),

  /**
   * Removes falsy values from array
   */
  compact: <T>(array: (T | null | undefined | false | 0 | '')[]) => _.compact(array),

  /**
   * Flattens nested arrays
   */
  flatten: <T>(array: (T | T[])[]) => _.flatten(array),

  /**
   * Deep flattens nested arrays
   */
  flattenDeep: <T>(array: any[]) => _.flattenDeep(array),

  /**
   * Takes first N elements from array
   */
  take: <T>(array: T[], n: number) => _.take(array, n),

  /**
   * Takes elements from array while predicate returns true
   */
  takeWhile: <T>(array: T[], predicate: (value: T) => boolean) => _.takeWhile(array, predicate),

  /**
   * Drops first N elements from array
   */
  drop: <T>(array: T[], n: number) => _.drop(array, n),

  /**
   * Drops elements from array while predicate returns true
   */
  dropWhile: <T>(array: T[], predicate: (value: T) => boolean) => _.dropWhile(array, predicate),
};

// Object utilities
export const objectUtils = {
  /**
   * Deep clones an object
   */
  cloneDeep: <T>(obj: T) => _.cloneDeep(obj),

  /**
   * Merges objects deeply
   */
  merge: <T>(target: T, ...sources: Partial<T>[]) => _.merge(target, ...sources),

  /**
   * Picks specific properties from object
   */
  pick: <T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]) => _.pick(obj, keys),

  /**
   * Omits specific properties from object
   */
  omit: <T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]) => _.omit(obj, keys),

  /**
   * Checks if object has all specified keys
   */
  has: <T extends Record<string, any>>(obj: T, keys: string[]) => _.has(obj, keys),

  /**
   * Gets nested property value safely
   */
  get: <T extends Record<string, any>>(obj: T, path: string, defaultValue?: any) => _.get(obj, path, defaultValue),

  /**
   * Sets nested property value safely
   */
  set: <T extends Record<string, any>>(obj: T, path: string, value: any) => _.set(obj, path, value),

  /**
   * Checks if path exists in object
   */
  hasIn: <T extends Record<string, any>>(obj: T, path: string) => _.hasIn(obj, path),

  /**
   * Maps object values
   */
  mapValues: <T extends Record<string, any>, TResult>(obj: T, fn: (value: any) => TResult) => _.mapValues(obj, fn),

  /**
   * Maps object keys
   */
  mapKeys: <T extends Record<string, any>>(obj: T, fn: (value: any, key: string) => string) => _.mapKeys(obj, fn),
};

// String utilities
export const stringUtils = {
  /**
   * Capitalizes first letter of string
   */
  capitalize: (str: string) => _.capitalize(str),

  /**
   * Converts string to camelCase
   */
  camelCase: (str: string) => _.camelCase(str),

  /**
   * Converts string to kebab-case
   */
  kebabCase: (str: string) => _.kebabCase(str),

  /**
   * Converts string to snake_case
   */
  snakeCase: (str: string) => _.snakeCase(str),

  /**
   * Truncates string to specified length
   */
  truncate: (str: string, length: number) => _.truncate(str, { length }),

  /**
   * Pads string to specified length
   */
  padStart: (str: string, length: number, chars: string) => _.padStart(str, length, chars),

  /**
   * Removes leading and trailing whitespace
   */
  trim: (str: string) => _.trim(str),

  /**
   * Converts string to number
   */
  toNumber: (str: string) => _.toNumber(str),

  /**
   * Splits string by separator
   */
  split: (str: string, separator?: string | RegExp, limit?: number) => _.split(str, separator, limit),

  /**
   * Joins array of strings
   */
  join: (array: string[], separator?: string) => _.join(array, separator),

  /**
   * Replaces substring
   */
  replace: (str: string, pattern: string | RegExp, replacement: string) => _.replace(str, pattern, replacement),

  /**
   * Converts string to lowercase
   */
  toLower: (str: string) => _.toLower(str),

  /**
   * Converts string to uppercase
   */
  toUpper: (str: string) => _.toUpper(str),

  /**
   * Checks if string starts with substring
   */
  startsWith: (str: string, target: string, position?: number) => _.startsWith(str, target, position),

  /**
   * Checks if string ends with substring
   */
  endsWith: (str: string, target: string, position?: number) => _.endsWith(str, target, position),
};

// Function utilities
export const functionUtils = {
  /**
   * Debounces function calls
   */
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    options?: _.DebounceSettings
  ) => _.debounce(func, wait, options),

  /**
   * Throttles function calls
   */
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    options?: _.ThrottleSettings
  ) => _.throttle(func, wait, options),

  /**
   * Memoizes function results
   */
  memoize: <T extends (...args: any[]) => any>(func: T) => _.memoize(func),

  /**
   * Creates a function that negates the result of the predicate
   */
  negate: <T>(predicate: (...args: T[]) => boolean) => _.negate(predicate),

  /**
   * Creates a function that performs a partial deep comparison
   */
  matches: <T>(source: T) => (object: any) => _.matches(source),

  /**
   * Creates a function that checks if all predicates return truthy
   */
  overEvery: <T>(predicates: ((...args: T[]) => boolean)[]) => (...args: T[]) => _.overEvery(predicates),

  /**
   * Creates a function that checks if some predicates return truthy
   */
  overSome: <T>(predicates: ((...args: T[]) => boolean)[]) => (...args: T[]) => _.overSome(predicates),
};

// Date utilities
export const dateUtils = {
  /**
   * Checks if date is today
   */
  isToday: (date: Date | string) => {
    const today = new Date();
    const compareDate = new Date(date);
    return _.isEqual(
      { year: today.getFullYear(), month: today.getMonth(), date: today.getDate() },
      { year: compareDate.getFullYear(), month: compareDate.getMonth(), date: compareDate.getDate() }
    );
  },

  /**
   * Checks if date is within last N days
   */
  isWithinLastDays: (date: Date | string, days: number) => {
    const compareDate = new Date(date);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return compareDate >= cutoffDate;
  },

  /**
   * Groups dates by day/week/month
   */
  groupByPeriod: <T extends { date: Date | string }>(
    items: T[],
    period: 'day' | 'week' | 'month'
  ) => {
    return _.groupBy(items, (item: T) => {
      const date = new Date(item.date);
      switch (period) {
        case 'day':
          return date.toDateString();
        case 'week': {
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          return weekStart.toDateString();
        }
        case 'month':
          return `${date.getFullYear()}-${date.getMonth()}`;
        default:
          return date.toDateString();
      }
    });
  },

  /**
   * Formats date for display
   */
  formatDate: (date: Date | string, _format: string = 'MM/DD/YYYY') => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString();
  },

  /**
   * Gets relative time (e.g., "2 hours ago")
   */
  getRelativeTime: (date: Date | string) => {
    const now = new Date();
    const compareDate = new Date(date);
    const diffInMs = now.getTime() - compareDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

    return compareDate.toLocaleDateString();
  },
};

// Validation utilities
export const validationUtils = {
  /**
   * Checks if value is empty (null, undefined, empty string, empty array, empty object)
   */
  isEmpty: (value: any) => _.isEmpty(value),

  /**
   * Checks if value is not empty
   */
  isNotEmpty: (value: any) => !_.isEmpty(value),

  /**
   * Checks if all values in array are unique
   */
  isUnique: <T>(array: T[]) => _.uniq(array).length === array.length,

  /**
   * Validates email format
   */
  isValidEmail: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validates phone number format
   */
  isValidPhoneNumber: (phone: string) => {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    const digitsOnly = phone.replace(/\D/g, '');
    return phoneRegex.test(phone) && digitsOnly.length >= 10;
  },

  /**
   * Validates URL format
   */
  isValidUrl: (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Checks if string is alphanumeric
   */
  isAlphaNumeric: (str: string) => /^[a-zA-Z0-9]+$/.test(str),

  /**
   * Checks if string contains only letters
   */
  isAlpha: (str: string) => /^[a-zA-Z]+$/.test(str),

  /**
   * Checks if string contains only numbers
   */
  isNumeric: (str: string) => /^[0-9]+$/.test(str),
};

// Math utilities
export const mathUtils = {
  /**
   * Calculates sum of array of numbers
   */
  sum: (array: number[]) => _.sum(array),

  /**
   * Calculates average of array of numbers
   */
  mean: (array: number[]) => _.mean(array),

  /**
   * Finds minimum value in array
   */
  min: (array: number[]) => _.min(array),

  /**
   * Finds maximum value in array
   */
  max: (array: number[]) => _.max(array),

  /**
   * Rounds number to specified precision
   */
  round: (num: number, precision: number = 0) => _.round(num, precision),

  /**
   * Generates random number between min and max
   */
  random: (min: number = 0, max: number = 1) => _.random(min, max),

  /**
   * Clamps number between min and max
   */
  clamp: (num: number, min: number, max: number) => _.clamp(num, min, max),

  /**
   * Calculates percentage of a number
   */
  percentage: (num: number, total: number) => _.round((num / total) * 100, 2),

  /**
   * Formats number as currency
   */
  formatCurrency: (num: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(num);
  },

  /**
   * Formats number with commas
   */
  formatNumber: (num: number) => _.toNumber(num.toLocaleString()),
};

// React-specific utilities
export const reactUtils = {
  /**
   * Debounces search input changes
   */
  debounceSearch: <T extends (...args: any[]) => any>(
    func: T,
    wait: number = 300
  ) => _.debounce(func, wait),

  /**
   * Throttles scroll events
   */
  throttleScroll: <T extends (...args: any[]) => any>(
    func: T,
    wait: number = 100
  ) => _.throttle(func, wait),

  /**
   * Groups form data by field categories
   */
  groupFormFields: <T extends Record<string, any>>(data: T, groups: Record<string, string[]>) => {
    const grouped: Record<string, Record<string, any>> = {};

    Object.entries(groups).forEach(([groupName, fieldNames]) => {
      grouped[groupName] = _.pick(data, fieldNames);
    });

    return grouped;
  },

  /**
   * Filters out empty form fields
   */
  filterEmptyFields: <T extends Record<string, unknown>>(data: T) => {
    return _.pickBy(data, (value: unknown) => !_.isEmpty(value));
  },

  /**
   * Validates form data against schema
   */
  validateFormData: <T extends Record<string, any>>(
    data: T,
    schema: Record<keyof T, (value: any) => boolean>
  ) => {
    const errors: Partial<Record<keyof T, string>> = {};

    Object.entries(schema).forEach(([field, validator]) => {
      const value = _.get(data, field);
      if (!validator(value)) {
        errors[field as keyof T] = `${_.startCase(field)} is invalid`;
      }
    });

    return {
      isValid: _.isEmpty(errors),
      errors,
    };
  },

  /**
   * Transforms API data for component consumption
   */
  transformApiData: <T, R>(
    data: T[],
    transformer: (item: T) => R
  ) => data.map(transformer),

  /**
   * Sorts data for table display
   */
  sortTableData: <T extends Record<string, any>>(
    data: T[],
    sortBy: keyof T,
    sortOrder: 'asc' | 'desc' = 'asc'
  ) => _.orderBy(data, [sortBy], [sortOrder]),

  /**
   * Filters data for table display
   */
  filterTableData: <T extends Record<string, unknown>>(
    data: T[],
    filters: Record<string, unknown>
  ) => {
    return _.filter(data, (item: T) => {
      return Object.entries(filters).every(([key, value]) => {
        if (_.isEmpty(value)) return true;
        return _.get(item, key) === value;
      });
    });
  },

  /**
   * Paginates data for table display
   */
  paginateData: <T>(data: T[], page: number, pageSize: number) => {
    const startIndex = (page - 1) * pageSize;
    return {
      data: _.slice(data, startIndex, startIndex + pageSize),
      total: data.length,
      page,
      pageSize,
      totalPages: Math.ceil(data.length / pageSize),
    };
  },
};

// Healthcare-specific utilities
export const healthcareUtils = {
  /**
   * Groups medications by student
   */
  groupMedicationsByStudent: <T extends { studentId: string }>(medications: T[]) => {
    return _.groupBy(medications, 'studentId');
  },

  /**
   * Groups health records by type
   */
  groupHealthRecordsByType: <T extends { type: string }>(records: T[]) => {
    return _.groupBy(records, 'type');
  },

  /**
   * Filters active records only
   */
  filterActiveRecords: <T extends { isActive: boolean }>(records: T[]) => {
    return _.filter(records, 'isActive');
  },

  /**
   * Sorts records by date (newest first)
   */
  sortByDateDesc: <T extends { createdAt: string | Date }>(records: T[]) => {
    return _.orderBy(records, ['createdAt'], ['desc']);
  },

  /**
   * Sorts records by date (oldest first)
   */
  sortByDateAsc: <T extends { createdAt: string | Date }>(records: T[]) => {
    return _.orderBy(records, ['createdAt'], ['asc']);
  },

  /**
   * Groups appointments by nurse
   */
  groupAppointmentsByNurse: <T extends { nurseId: string }>(appointments: T[]) => {
    return _.groupBy(appointments, 'nurseId');
  },

  /**
   * Calculates age from date of birth
   */
  calculateAge: (dateOfBirth: Date | string) => {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  },

  /**
   * Groups students by grade
   */
  groupStudentsByGrade: <T extends { grade: string }>(students: T[]) => {
    return _.groupBy(students, 'grade');
  },

  /**
   * Filters emergency contacts by priority
   */
  filterEmergencyContactsByPriority: <T extends { priority: string }>(
    contacts: T[],
    priority: string
  ) => {
    return _.filter(contacts, { priority });
  },

  /**
   * Formats medication dosage for display
   */
  formatDosage: (dosage: string | number) => {
    if (typeof dosage === 'number') {
      return `${dosage}mg`;
    }
    return dosage;
  },

  /**
   * Categorizes health records by urgency
   */
  categorizeByUrgency: <T extends { severity?: string; priority?: string }>(records: T[]) => {
    return _.groupBy(records, (record: T) => {
      const severity = _.get(record, 'severity', 'low');
      const priority = _.get(record, 'priority', 'normal');

      if (severity === 'high' || priority === 'urgent') return 'high';
      if (severity === 'medium' || priority === 'high') return 'medium';
      return 'low';
    });
  },

  /**
   * Calculates BMI from height and weight
   */
  calculateBMI: (height: number, weight: number) => {
    // Height in cm, weight in kg
    const heightInMeters = height / 100;
    return _.round(weight / (heightInMeters * heightInMeters), 1);
  },

  /**
   * Categorizes BMI
   */
  categorizeBMI: (bmi: number) => {
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
  },
};

export default {
  arrayUtils,
  objectUtils,
  stringUtils,
  functionUtils,
  dateUtils,
  validationUtils,
  mathUtils,
  reactUtils,
  healthcareUtils,
};
