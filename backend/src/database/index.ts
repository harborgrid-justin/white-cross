/**
 * Database Infrastructure Barrel Export
 * Central export point for all database components
 */

// Module
export * from './database.module';

// Types
export * from './types';

// Interfaces
export * from './interfaces/cache/cache-manager.interface';
export * from './interfaces/audit/audit-logger.interface';

// Base Repository
export * from './repositories/base/base.repository';
export * from './repositories/interfaces/repository.interface';

// Unit of Work
export * from './uow/unit-of-work.interface';
export * from './uow/sequelize-unit-of-work.service';

// Services
export * from '@/services/cache.service';
export { AuditService } from '@/services/audit.service';

// All Models (exported from centralized index to prevent circular dependencies)
export * from './models';

// Repository Interfaces
export type { IStudentRepository } from './repositories/interfaces/student.repository.interface';

// Repository Implementations (primary ones used by appointment system)
export { StudentRepository } from './repositories/impl/student.repository';
export { AppointmentRepository } from './repositories/impl/appointment.repository';
export { AppointmentReminderRepository } from './repositories/impl/appointment-reminder.repository';
export { AppointmentWaitlistRepository } from './repositories/impl/appointment-waitlist.repository';
