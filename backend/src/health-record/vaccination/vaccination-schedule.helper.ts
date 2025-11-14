/**
 * @fileoverview Vaccination Schedule Helper
 * @module health-record/vaccination
 * @description CDC vaccination schedules, dose scheduling, and next dose calculations
 *
 * CDC Compliance: Implements CDC Immunization Schedules for dose timing
 */

import { Injectable } from '@nestjs/common';

/**
 * Query parameters for CDC schedule lookup
 */
export interface CDCScheduleQuery {
  ageOrGrade?: string;
  vaccineType?: string;
}

/**
 * Dose information for a vaccine series
 */
export interface DoseInfo {
  dose: number;
  age: string;
  timing: string;
}

/**
 * Vaccine schedule information
 */
export interface VaccineSchedule {
  vaccine: string;
  cvxCode: string;
  doses: DoseInfo[];
}

/**
 * CDC schedule response
 */
export interface CDCScheduleResponse {
  source: string;
  lastUpdated: string;
  ageOrGrade: string;
  schedules: VaccineSchedule[];
}

/**
 * Dose schedule response
 */
export interface DoseScheduleResponse {
  vaccineType: string;
  totalDoses?: number;
  currentDose?: number;
  remainingDoses?: number;
  schedule?: DoseInfo[];
  message?: string;
}

@Injectable()
export class VaccinationScheduleHelper {
  /**
   * Calculate next dose due date based on vaccine type and current dose
   * @param administrationDate - Date of current dose
   * @param vaccineType - Type of vaccine
   * @param currentDose - Current dose number
   * @returns Calculated next due date
   */
  calculateNextDueDate(
    administrationDate: Date,
    vaccineType: string | null,
    currentDose: number,
  ): Date | null {
    if (!vaccineType) return null;

    const adminDate = new Date(administrationDate);
    let monthsToAdd = 0;

    // CDC recommended intervals (simplified)
    switch (vaccineType) {
      case 'HEPATITIS_B':
        monthsToAdd = currentDose === 1 ? 1 : currentDose === 2 ? 5 : 0;
        break;
      case 'DTAP':
      case 'POLIO':
      case 'HIB':
      case 'PNEUMOCOCCAL':
        monthsToAdd = currentDose < 3 ? 2 : currentDose === 3 ? 9 : 24;
        break;
      case 'MMR':
      case 'VARICELLA':
        monthsToAdd = currentDose === 1 ? 36 : 0; // 3 years between doses
        break;
      case 'FLU':
        monthsToAdd = 12; // Annual
        break;
      case 'COVID_19':
        monthsToAdd = currentDose === 1 ? 1 : 6; // Booster after 6 months
        break;
      default:
        monthsToAdd = 4; // Default 4-month interval
    }

    if (monthsToAdd === 0) return null;

    adminDate.setMonth(adminDate.getMonth() + monthsToAdd);
    return adminDate;
  }

  /**
   * Get dose schedule for a vaccine series
   * @param vaccineType - Type of vaccine
   * @param currentDose - Current dose number
   * @returns Recommended schedule for remaining doses
   */
  getDoseSchedule(
    vaccineType: string,
    currentDose: number,
  ): DoseScheduleResponse {
    // CDC recommended schedules (simplified)
    const schedules: Record<string, { totalDoses: number; intervals: DoseInfo[] }> = {
      HEPATITIS_B: {
        totalDoses: 3,
        intervals: [
          { dose: 1, age: 'Birth', timing: 'At birth' },
          { dose: 2, age: '1-2 months', timing: '1-2 months after dose 1' },
          { dose: 3, age: '6-18 months', timing: '6-18 months after dose 1' },
        ],
      },
      DTAP: {
        totalDoses: 5,
        intervals: [
          { dose: 1, age: '2 months', timing: 'At 2 months' },
          { dose: 2, age: '4 months', timing: 'At 4 months' },
          { dose: 3, age: '6 months', timing: 'At 6 months' },
          { dose: 4, age: '15-18 months', timing: 'At 15-18 months' },
          {
            dose: 5,
            age: '4-6 years',
            timing: 'At 4-6 years (before school entry)',
          },
        ],
      },
      POLIO: {
        totalDoses: 4,
        intervals: [
          { dose: 1, age: '2 months', timing: 'At 2 months' },
          { dose: 2, age: '4 months', timing: 'At 4 months' },
          { dose: 3, age: '6-18 months', timing: 'At 6-18 months' },
          {
            dose: 4,
            age: '4-6 years',
            timing: 'At 4-6 years (before school entry)',
          },
        ],
      },
      MMR: {
        totalDoses: 2,
        intervals: [
          { dose: 1, age: '12-15 months', timing: 'At 12-15 months' },
          {
            dose: 2,
            age: '4-6 years',
            timing: 'At 4-6 years (before school entry)',
          },
        ],
      },
      VARICELLA: {
        totalDoses: 2,
        intervals: [
          { dose: 1, age: '12-15 months', timing: 'At 12-15 months' },
          { dose: 2, age: '4-6 years', timing: 'At 4-6 years' },
        ],
      },
    };

    const schedule = schedules[vaccineType];
    if (!schedule) {
      return {
        vaccineType,
        message: 'Schedule not available for this vaccine type',
      };
    }

    return {
      vaccineType,
      totalDoses: schedule.totalDoses,
      currentDose,
      remainingDoses: schedule.totalDoses - currentDose,
      schedule: schedule.intervals.filter((i) => i.dose > currentDose),
    };
  }

  /**
   * Get CDC vaccination schedule
   * @param query - Query parameters for schedule lookup
   * @returns CDC vaccination schedule information
   */
  getCDCSchedule(query: CDCScheduleQuery): CDCScheduleResponse {
    const { ageOrGrade, vaccineType } = query;

    // CDC schedule data (simplified)
    const schedules: VaccineSchedule[] = [
      {
        vaccine: 'Hepatitis B',
        cvxCode: '08',
        doses: [
          { dose: 1, age: 'Birth', timing: 'At birth' },
          { dose: 2, age: '1-2 months', timing: '1-2 months after dose 1' },
          { dose: 3, age: '6-18 months', timing: '6-18 months after dose 1' },
        ],
      },
      {
        vaccine: 'DTaP',
        cvxCode: '20',
        doses: [
          { dose: 1, age: '2 months', timing: 'At 2 months' },
          { dose: 2, age: '4 months', timing: 'At 4 months' },
          { dose: 3, age: '6 months', timing: 'At 6 months' },
          { dose: 4, age: '15-18 months', timing: 'At 15-18 months' },
          {
            dose: 5,
            age: '4-6 years',
            timing: 'At 4-6 years (before school entry)',
          },
        ],
      },
      {
        vaccine: 'Polio (IPV)',
        cvxCode: '10',
        doses: [
          { dose: 1, age: '2 months', timing: 'At 2 months' },
          { dose: 2, age: '4 months', timing: 'At 4 months' },
          { dose: 3, age: '6-18 months', timing: 'At 6-18 months' },
          {
            dose: 4,
            age: '4-6 years',
            timing: 'At 4-6 years (before school entry)',
          },
        ],
      },
      {
        vaccine: 'MMR',
        cvxCode: '03',
        doses: [
          { dose: 1, age: '12-15 months', timing: 'At 12-15 months' },
          {
            dose: 2,
            age: '4-6 years',
            timing: 'At 4-6 years (before school entry)',
          },
        ],
      },
      {
        vaccine: 'Varicella',
        cvxCode: '21',
        doses: [
          { dose: 1, age: '12-15 months', timing: 'At 12-15 months' },
          { dose: 2, age: '4-6 years', timing: 'At 4-6 years' },
        ],
      },
    ];

    // Filter by vaccine type if specified
    const filteredSchedules = vaccineType
      ? schedules.filter((s) =>
          s.vaccine.toLowerCase().includes(vaccineType.toLowerCase()),
        )
      : schedules;

    return {
      source: 'CDC Immunization Schedule',
      lastUpdated: '2024-01-01',
      ageOrGrade: ageOrGrade || 'All ages',
      schedules: filteredSchedules,
    };
  }
}
