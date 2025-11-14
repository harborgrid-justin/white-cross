/**
 * Barrel file for api-key-auth module
 * Provides clean public API
 */

// Module files
export * from './api-key-auth.controller';
export * from './api-key-auth.module';
export * from './api-key-auth.service';

// Submodules
export * from './dto';
export { ApiKey } from '@/database/models';
export * from './guards';

