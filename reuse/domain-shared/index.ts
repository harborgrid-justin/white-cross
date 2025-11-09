/**
 * File: /reuse/domain-shared/index.ts
 * Purpose: Barrel export for domain-shared types and utilities
 *
 * Provides centralized exports of common types, interfaces, and utilities
 * used across construction, consulting, and engineer domain kits.
 *
 * @module DomainShared
 * @version 1.0.0
 *
 * @example
 * ```typescript
 * import {
 *   BaseEntity,
 *   CommonStatus,
 *   PaginatedResponse,
 *   BaseDTO,
 *   ListQueryDTO
 * } from '@domain-shared';
 * ```
 */

// Base entity types and interfaces
export * from './types/base-entity';

// Validation DTOs and base classes
export * from './types/validation-dtos';
