import { ConsentFormStatus } from './enums';

export interface ConsentForm {
  id: string;
  studentId: string;
  formType: string;
  status: ConsentFormStatus;
  content: string;
  signedBy?: string;
  signedAt?: Date;
  expiresAt?: Date;
  createdAt?: Date;
  digitalSignature?: string;
  version?: string;
  metadata?: Record<string, string | number | boolean>;
  lastModifiedAt?: Date;
  lastModifiedBy?: string;
}

export interface ConsentFormTemplate {
  type: string;
  title: string;
  content: string;
  variables: string[];
  expirationDays: number;
  requiresSignature: boolean;
  legalReviewRequired: boolean;
}