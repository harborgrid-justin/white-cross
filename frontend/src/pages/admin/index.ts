/**
 * WF-COMP-274 | index.ts - Admin page exports
 * Purpose: Centralized exports for admin page module
 * Last Updated: 2025-10-21 | File Type: .ts
 */

// Store exports
export * from './store';

// Component exports
export { default as Users } from './Users';
export { default as Roles } from './Roles';
export { default as Permissions } from './Permissions';
export { default as Inventory } from './Inventory';
export { default as Reports } from './Reports';
export { default as Settings } from './Settings';

// Route exports
export { default as AdminRoutes } from './routes';
