/**
 * Student Hooks - Central Export Hub
 *
 * Convenient API for importing all student-related hooks.
 * Re-exports from the organized domain structure.
 */

// Re-export everything from the domains/students directory
export * from '../domains/students';

// Provide legacy compatibility
export { default } from '../domains/students/legacy-index';
