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
