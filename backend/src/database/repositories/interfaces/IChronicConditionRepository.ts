/**
 * Chronic Condition Repository Interface
 */

import { IRepository } from './IRepository';

export interface ChronicCondition {
  id: string;
  studentId: string;
  condition: string;
  diagnosedDate: Date;
  status: string;
  severity?: string;
  notes?: string;
  carePlan?: string;
  medications: string[];
  restrictions: string[];
  triggers: string[];
  diagnosedBy?: string;
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateChronicConditionDTO {
  studentId: string;
  condition: string;
  diagnosedDate: Date;
  status?: string;
  severity?: string;
  notes?: string;
  carePlan?: string;
  medications?: string[];
  restrictions?: string[];
  triggers?: string[];
  diagnosedBy?: string;
  lastReviewDate?: Date;
  nextReviewDate?: Date;
}

export interface UpdateChronicConditionDTO {
  condition?: string;
  diagnosedDate?: Date;
  status?: string;
  severity?: string;
  notes?: string;
  carePlan?: string;
  medications?: string[];
  restrictions?: string[];
  triggers?: string[];
  diagnosedBy?: string;
  lastReviewDate?: Date;
  nextReviewDate?: Date;
}

export interface IChronicConditionRepository
  extends IRepository<ChronicCondition, CreateChronicConditionDTO, UpdateChronicConditionDTO> {
  findByStudentId(studentId: string, includeInactive?: boolean): Promise<ChronicCondition[]>;
  findDueForReview(daysThreshold: number): Promise<ChronicCondition[]>;
  findByStatus(status: string): Promise<ChronicCondition[]>;
}
