/**
 * LOC: BA2E757889
 * WC-GEN-110 | IChronicConditionRepository.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - IRepository.ts (database/repositories/interfaces/IRepository.ts)
 *
 * DOWNSTREAM (imported by):
 *   - IUnitOfWork.ts (database/uow/IUnitOfWork.ts)
 *   - SequelizeUnitOfWork.ts (database/uow/SequelizeUnitOfWork.ts)
 */

/**
 * WC-GEN-110 | IChronicConditionRepository.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ./IRepository | Dependencies: ./IRepository
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: interfaces | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

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
