/**
 * Audit Module Barrel Export
 * Provides centralized exports for the audit module
 */

// Module
export { AuditModule } from './audit.module';

// Service
export { AuditService } from './audit.service';

// Controller
export { AuditController } from './audit.controller';

// DTOs
export * from './dto';

// Entities (excluding conflicting enums)
export { AuditLog, ComplianceType, AuditSeverity } from './entities';

// Enums
export { AuditAction } from './entities';
export * from './enums';

// Interfaces
export * from './interfaces';

// Services
export * from './services';

// Interceptors
export * from './interceptors';
