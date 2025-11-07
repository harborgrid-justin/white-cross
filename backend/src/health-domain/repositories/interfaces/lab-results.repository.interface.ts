/**
 * Lab Results Repository Interface
 * HIPAA-compliant data access for laboratory results
 */

import { IRepository } from '../../../database/repositories/interfaces/repository.interface';
import { ExecutionContext, QueryOptions } from '../../../database/types';

export interface LabResultsAttributes {
  id: string;
  studentId: string;
  testType: string; // blood_test, urinalysis, culture, etc.
  testName: string;
  testCode?: string; // LOINC code
  orderedDate: Date;
  collectionDate?: Date;
  resultDate?: Date;
  result: string;
  resultValue?: number;
  resultUnit?: string;
  referenceRange?: string;
  isAbnormal: boolean;
  abnormalFlags?: string[]; // high, low, critical, etc.
  interpretation?: string;
  status: string; // pending, completed, reviewed, cancelled
  orderedBy?: string;
  performedBy?: string;
  reviewedBy?: string;
  reviewedDate?: Date;
  labName?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLabResultsDTO {
  studentId: string;
  testType: string;
  testName: string;
  testCode?: string;
  orderedDate: Date;
  collectionDate?: Date;
  resultDate?: Date;
  result: string;
  resultValue?: number;
  resultUnit?: string;
  referenceRange?: string;
  isAbnormal?: boolean;
  abnormalFlags?: string[];
  interpretation?: string;
  status?: string;
  orderedBy?: string;
  performedBy?: string;
  reviewedBy?: string;
  reviewedDate?: Date;
  labName?: string;
  notes?: string;
}

export interface UpdateLabResultsDTO {
  testType?: string;
  testName?: string;
  testCode?: string;
  orderedDate?: Date;
  collectionDate?: Date;
  resultDate?: Date;
  result?: string;
  resultValue?: number;
  resultUnit?: string;
  referenceRange?: string;
  isAbnormal?: boolean;
  abnormalFlags?: string[];
  interpretation?: string;
  status?: string;
  orderedBy?: string;
  performedBy?: string;
  reviewedBy?: string;
  reviewedDate?: Date;
  labName?: string;
  notes?: string;
}

export interface LabResultTrend {
  testName: string;
  testType: string;
  results: Array<{
    date: Date;
    value: number;
    unit: string;
    isAbnormal: boolean;
  }>;
  trend: 'increasing' | 'decreasing' | 'stable';
  averageValue: number;
}

export interface ILabResultsRepository
  extends IRepository<
    LabResultsAttributes,
    CreateLabResultsDTO,
    UpdateLabResultsDTO
  > {
  findByStudent(
    studentId: string,
    options?: QueryOptions,
  ): Promise<LabResultsAttributes[]>;
  findByTestType(
    testType: string,
    options?: QueryOptions,
  ): Promise<LabResultsAttributes[]>;
  findByDateRange(
    studentId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<LabResultsAttributes[]>;
  findAbnormalResults(
    studentId?: string,
    options?: QueryOptions,
  ): Promise<LabResultsAttributes[]>;
  findPendingResults(options?: QueryOptions): Promise<LabResultsAttributes[]>;
  getResultTrends(
    studentId: string,
    testType: string,
    months?: number,
  ): Promise<LabResultTrend>;
  compareResults(
    studentId: string,
    testType: string,
  ): Promise<LabResultsAttributes[]>;
}
