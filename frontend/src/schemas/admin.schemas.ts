/**
 * @fileoverview Barrel export for all admin validation schemas
 * @module schemas/admin
 *
 * Re-exports all admin-related Zod validation schemas from focused submodules.
 * Maintains backward compatibility by providing a single import point for all schemas.
 */

// API Key Management
export * from './admin.apikeys.schemas';

// Webhook Management
export * from './admin.webhooks.schemas';

// System Monitoring & Management
export * from './admin.system.schemas';

// Security & Access Control
export * from './admin.security.schemas';

// Operations & Settings
export * from './admin.operations.schemas';
