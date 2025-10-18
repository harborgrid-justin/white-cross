/**
 * LOC: 38F4E7BD98
 * WC-IDX-107 | index.ts - Module exports and entry point
 *
 * UPSTREAM (imports from):
 *   - index.ts (database/repositories/index.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/repositories/index.ts)
 */

/**
 * WC-IDX-107 | index.ts - Module exports and entry point
 * Purpose: module exports and entry point
 * Upstream: Independent module | Dependencies: @/database/repositories
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: module exports and entry point, part of backend architecture
 */

/**
 * Repository Layer Index
 * Central export point for all repositories and interfaces
 *
 * Usage:
 * ```typescript
 * import { RepositoryFactory, createRepositoryFactory } from '@/database/repositories';
 *
 * const factory = createRepositoryFactory(auditLogger, cacheManager);
 * const studentRepo = factory.getStudentRepository();
 * const users = await studentRepo.findByGrade('10');
 * ```
 */

// ============ Base Repository ============
export { BaseRepository, RepositoryError } from './base/BaseRepository';

// ============ Repository Factory ============
export {
  RepositoryFactory,
  createRepositoryFactory,
  type IRepositoryFactory
} from './RepositoryFactory';

// ============ Repository Interfaces ============
export { type IRepository } from './interfaces/IRepository';

export {
  type IStudentRepository,
  type Student,
  type CreateStudentDTO,
  type UpdateStudentDTO
} from './interfaces/IStudentRepository';

export {
  type IHealthRecordRepository,
  type HealthRecord,
  type CreateHealthRecordDTO,
  type UpdateHealthRecordDTO,
  type HealthRecordType,
  type HealthRecordFilters,
  type DateRangeFilter,
  type SearchCriteria,
  type VitalSignsHistory,
  type HealthSummary,
  type VitalSigns
} from './interfaces/IHealthRecordRepository';

export {
  type IAllergyRepository,
  type Allergy,
  type CreateAllergyDTO,
  type UpdateAllergyDTO,
  type AllergySeverity
} from './interfaces/IAllergyRepository';

export {
  type IChronicConditionRepository
} from './interfaces/IChronicConditionRepository';

export {
  type IAuditLogRepository,
  type AuditLog,
  type CreateAuditLogDTO,
  type UpdateAuditLogDTO
} from './interfaces/IAuditLogRepository';

// ============ Repository Implementations ============
export { StudentRepository } from './impl/StudentRepository';
export { UserRepository } from './impl/UserRepository';
export { HealthRecordRepository } from './impl/HealthRecordRepository';
export { AllergyRepository } from './impl/AllergyRepository';
export { MedicationRepository } from './impl/MedicationRepository';
export { AuditLogRepository } from './impl/AuditLogRepository';
export { AppointmentRepository } from './impl/AppointmentRepository';
export { DistrictRepository } from './impl/DistrictRepository';
export { SchoolRepository } from './impl/SchoolRepository';
