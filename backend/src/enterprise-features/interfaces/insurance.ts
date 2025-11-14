import { InsuranceClaimStatus } from './enums';

export interface InsuranceClaim {
  id: string;
  incidentId: string;
  studentId: string;
  claimNumber: string;
  insuranceProvider: string;
  claimAmount: number;
  status: InsuranceClaimStatus;
  submittedAt?: Date;
  approvedAt?: Date;
  deniedAt?: Date;
  documents: string[];
  notes?: string;
}