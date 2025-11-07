/**
 * Growth Tracking Repository Interface
 * HIPAA-compliant data access for growth tracking records
 */

import { IRepository } from '../../../database/repositories/interfaces/repository.interface';
import { QueryOptions } from '../../../database/types';

export interface GrowthTrackingAttributes {
  id: string;
  studentId: string;
  measurementDate: Date;
  height: number;
  heightUnit: string; // inches or cm
  weight: number;
  weightUnit: string; // lbs or kg
  bmi: number;
  bmiPercentile?: number;
  heightPercentile?: number;
  weightPercentile?: number;
  headCircumference?: number;
  headCircumferenceUnit?: string;
  headCircumferencePercentile?: number;
  ageInMonths: number;
  measuredBy?: string;
  notes?: string;
  isAbnormal: boolean;
  abnormalFlags?: string[]; // underweight, overweight, obese, stunted growth, etc.
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGrowthTrackingDTO {
  studentId: string;
  measurementDate: Date;
  height: number;
  heightUnit: string;
  weight: number;
  weightUnit: string;
  bmi?: number;
  bmiPercentile?: number;
  heightPercentile?: number;
  weightPercentile?: number;
  headCircumference?: number;
  headCircumferenceUnit?: string;
  headCircumferencePercentile?: number;
  ageInMonths: number;
  measuredBy?: string;
  notes?: string;
  isAbnormal?: boolean;
  abnormalFlags?: string[];
}

export interface UpdateGrowthTrackingDTO {
  measurementDate?: Date;
  height?: number;
  heightUnit?: string;
  weight?: number;
  weightUnit?: string;
  bmi?: number;
  bmiPercentile?: number;
  heightPercentile?: number;
  weightPercentile?: number;
  headCircumference?: number;
  headCircumferenceUnit?: string;
  headCircumferencePercentile?: number;
  ageInMonths?: number;
  measuredBy?: string;
  notes?: string;
  isAbnormal?: boolean;
  abnormalFlags?: string[];
}

export interface GrowthPercentiles {
  bmi?: number;
  height?: number;
  weight?: number;
  headCircumference?: number;
}

export interface GrowthTrend {
  studentId: string;
  measurements: GrowthTrackingAttributes[];
  averageGrowthRate: {
    height: number;
    weight: number;
  };
  projectedNextMeasurement?: {
    height: number;
    weight: number;
    bmi: number;
  };
}

export interface IGrowthTrackingRepository
  extends IRepository<
    GrowthTrackingAttributes,
    CreateGrowthTrackingDTO,
    UpdateGrowthTrackingDTO
  > {
  findByStudent(
    studentId: string,
    options?: QueryOptions,
  ): Promise<GrowthTrackingAttributes[]>;
  findLatestByStudent(
    studentId: string,
  ): Promise<GrowthTrackingAttributes | null>;
  findByDateRange(
    studentId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<GrowthTrackingAttributes[]>;
  calculateBMI(
    height: number,
    heightUnit: string,
    weight: number,
    weightUnit: string,
  ): number;
  getGrowthPercentiles(studentId: string): Promise<GrowthPercentiles>;
  getGrowthTrend(studentId: string, months?: number): Promise<GrowthTrend>;
  findByAgeRange(
    minAge: number,
    maxAge: number,
    options?: QueryOptions,
  ): Promise<GrowthTrackingAttributes[]>;
}
