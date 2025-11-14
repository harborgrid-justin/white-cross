/**
 * Barrel file for integration module
 * Provides clean public API
 */

// Module files
export * from './integration.controller';
export * from './integration.module';

// Submodules
export * from './api-clients';
export * from './dto';
export {
  IntegrationConfig,
  IntegrationType,
  IntegrationStatus,
  IntegrationLog,
  SyncSession,
  SyncStatus,
  SyncDirection,
  SyncConflict,
} from '@/database/models';
export type { ConflictVersion } from '@/database/models';
export * from './interfaces';
export * from './services';
export * from './webhooks';

