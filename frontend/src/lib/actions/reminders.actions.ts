/**
 * @fileoverview Reminder Management Server Actions - Next.js v14+ Compatible
 * @module app/reminders/actions
 *
 * HIPAA-compliant server actions for reminder management with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all reminder operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 */

'use server';

// ==========================================
// RE-EXPORTS FROM SPLIT MODULES
// ==========================================

// Types and constants
export * from './reminders.types';

// Cache functions
export * from './reminders.cache';

// CRUD actions
export * from './reminders.crud';

// Form handlers
export * from './reminders.forms';

// Utility functions
export * from './reminders.utils';
