/**
 * Barrel file for health-domain module
 * Provides clean public API
 */

// Module files
export * from './health-domain.controller';
export * from './health-domain.module';
export * from './health-domain.service';

// Submodules
export * from './dto';
export * from './events';
export * from './repositories';
export * from './services';

