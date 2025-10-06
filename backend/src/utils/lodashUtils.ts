import _ from 'lodash';

/**
 * Backend utility functions using lodash for common operations
 * Provides type-safe lodash wrappers for frequently used operations
 */

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
  flattenDeep: (array: any[]) => _.flattenDeep(array),
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
  pick: <T, K extends keyof T>(obj: T, keys: K[]) => _.pick(obj, keys),

  /**
   * Omits specific properties from object
   */
  omit: <T extends object, K extends keyof T>(obj: T, keys: K[]) => _.omit(obj, keys),

  /**
   * Checks if object has all specified keys
   */
  has: <T>(obj: T, keys: string[]) => _.has(obj, keys),

  /**
   * Gets nested property value safely
   */
  get: <T>(obj: T, path: string, defaultValue?: any) => _.get(obj, path, defaultValue),

  /**
   * Sets nested property value safely
   */
  set: <T extends object>(obj: T, path: string, value: unknown) => _.set(obj, path, value),

  /**
   * Checks if path exists in object
   */
  hasIn: <T>(obj: T, path: string) => _.hasIn(obj, path),
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
};

export default {
  arrayUtils,
  objectUtils,
  stringUtils,
  functionUtils,
  dateUtils,
  validationUtils,
  mathUtils,
  healthcareUtils,
};
