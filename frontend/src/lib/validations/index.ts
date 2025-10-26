/**
 * Central Validation Schema Exports
 *
 * Import all Zod schemas from this file for consistent usage across the application.
 *
 * Usage:
 * ```typescript
 * import { createStudentSchema, loginSchema } from '@/lib/validations';
 * ```
 */

// Common schemas
export * from './common/address.schemas';
export * from './common/phone.schemas';
export * from './common/email.schemas';
export * from './common/date.schemas';
export * from './common/file.schemas';

// Entity schemas
export * from './entities/student.schemas';
export * from './entities/medication.schemas';
export * from './entities/health-record.schemas';
export * from './entities/incident.schemas';
export * from './entities/appointment.schemas';
export * from './entities/auth.schemas';
export * from './entities/admin.schemas';

// Re-export Zod for convenience
export { z } from 'zod';
export { zodResolver } from '@hookform/resolvers/zod';
