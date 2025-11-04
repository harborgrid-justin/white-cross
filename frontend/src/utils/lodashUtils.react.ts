/**
 * WF-COMP-343 | lodashUtils.react.ts - React and healthcare-specific utilities
 * Purpose: React component and healthcare domain utilities using lodash
 * Upstream: React, external libs | Dependencies: lodash
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: lodashUtils.ts, other utility modules
 * Exports: reactUtils, healthcareUtils | Key Features: forms, tables, healthcare data
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Component mount → Data processing → React/healthcare operations
 * LLM Context: React utilities module, part of refactored lodashUtils
 */

import _ from 'lodash';

/**
 * React-specific utility functions
 * Provides utilities for React components, forms, and tables
 */
export const reactUtils = {
  /**
   * Debounces search input changes
   */
  debounceSearch: <TFunc extends (...args: readonly unknown[]) => unknown>(
    func: TFunc,
    wait: number = 300
  ) => _.debounce(func, wait),

  /**
   * Throttles scroll events
   */
  throttleScroll: <TFunc extends (...args: readonly unknown[]) => unknown>(
    func: TFunc,
    wait: number = 100
  ) => _.throttle(func, wait),

  /**
   * Groups form data by field categories
   */
  groupFormFields: <T extends Record<string, unknown>>(data: T, groups: Record<string, string[]>) => {
    const grouped: Record<string, Record<string, unknown>> = {};

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
  validateFormData: <T extends Record<string, unknown>>(
    data: T,
    schema: Record<keyof T, (value: unknown) => boolean>
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
  sortTableData: <T extends Record<string, unknown>>(
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

/**
 * Healthcare-specific utility functions
 * Provides utilities for healthcare data processing and management
 */
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
