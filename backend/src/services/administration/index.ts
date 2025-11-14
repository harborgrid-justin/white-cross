/**
 * Barrel file for administration module
 * Provides clean public API
 */

// Module files
export * from './administration.controller';
export * from './administration.module';

// Submodules
export * from './dto';
export {
  District,
  School,
  License,
  SystemConfig,
  ConfigurationHistory,
  AuditLog,
  BackupLog,
  PerformanceMetric,
  TrainingModule,
} from '@/database/models';
export * from './enums';
export * from './interfaces';
export * from './services';

