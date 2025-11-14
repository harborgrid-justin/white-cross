/**
 * Barrel file for document module
 * Provides clean public API
 */

// Module files
export * from './document.controller';
export * from './document.module';
export * from './document.service';

// Submodules
export * from './dto';
export { Document, DocumentSignature, DocumentAuditTrail } from '@/database/models';
export * from './enums';

