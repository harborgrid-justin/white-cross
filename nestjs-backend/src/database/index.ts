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
export * from './services/cache.service';
export * from './services/audit.service';

// Sample Repository (add more as migrated)
export * from './repositories/interfaces/student.repository.interface';
export * from './repositories/impl/student.repository';
