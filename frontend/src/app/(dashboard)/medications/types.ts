/**
 * Medications Types - Legacy Export
 *
 * @description This file maintains backward compatibility by re-exporting from the modular types structure.
 * @deprecated Import directly from '@/app/(dashboard)/medications/types' instead
 *
 * New structure:
 * - types/core.types.ts - Base types, enums, core medication entity
 * - types/administration.types.ts - Administration records and scheduling
 * - types/api.types.ts - Filters, search, and query types
 * - types/display.types.ts - Display utilities and formatters
 * - types/mock.types.ts - Mock data for development
 * - types/index.ts - Barrel export
 */

// Re-export everything from the modular structure
export * from './types';
