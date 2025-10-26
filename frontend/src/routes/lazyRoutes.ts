/**
 * Lazy-Loaded Route Components
 *
 * This file contains all route components loaded lazily with retry logic
 * and preload capabilities for optimal performance.
 *
 * @module routes/lazyRoutes
 */

import { lazyWithRetry, lazyWithPreload } from '@/lib/performance';

/**
 * Critical routes - loaded with retry logic
 */
export const Dashboard = lazyWithRetry(
  () => import(/* webpackChunkName: "dashboard" */ '@/pages/dashboard/Dashboard')
);

export const Login = lazyWithRetry(
  () => import(/* webpackChunkName: "auth" */ '@/pages/auth/Login')
);

/**
 * Healthcare routes - with preload capability
 */
export const HealthRecords = lazyWithPreload(
  () => import(/* webpackChunkName: "health-records" */ '@/pages/health/HealthRecords')
);

/**
 * Appointment routes
 */
export const AppointmentSchedule = lazyWithPreload(
  () => import(/* webpackChunkName: "appointments" */ '@/pages/appointments/AppointmentSchedule')
);

/**
 * Inventory routes - loaded on demand
 */
export const InventoryItems = lazyWithRetry(
  () => import(/* webpackChunkName: "inventory" */ '@/pages/inventory/InventoryItems')
);

export const InventoryAlerts = lazyWithRetry(
  () => import(/* webpackChunkName: "inventory" */ '@/pages/inventory/InventoryAlerts')
);

export const InventoryTransactions = lazyWithRetry(
  () => import(/* webpackChunkName: "inventory" */ '@/pages/inventory/InventoryTransactions')
);

export const InventoryVendors = lazyWithRetry(
  () => import(/* webpackChunkName: "inventory" */ '@/pages/inventory/InventoryVendors')
);

/**
 * Reports routes
 */
export const ReportsGenerate = lazyWithRetry(
  () => import(/* webpackChunkName: "reports" */ '@/pages/reports/ReportsGenerate')
);

export const ScheduledReports = lazyWithRetry(
  () => import(/* webpackChunkName: "reports" */ '@/pages/reports/ScheduledReports')
);

/**
 * Admin routes - loaded on demand
 */
export const Users = lazyWithRetry(
  () => import(/* webpackChunkName: "admin" */ '@/pages/admin/Users')
);

export const Roles = lazyWithRetry(
  () => import(/* webpackChunkName: "admin" */ '@/pages/admin/Roles')
);

export const Permissions = lazyWithRetry(
  () => import(/* webpackChunkName: "admin" */ '@/pages/admin/Permissions')
);

/**
 * Budget routes
 */
export const BudgetOverview = lazyWithRetry(
  () => import(/* webpackChunkName: "budget" */ '@/pages/budget/BudgetOverview')
);

export const BudgetPlanning = lazyWithRetry(
  () => import(/* webpackChunkName: "budget" */ '@/pages/budget/BudgetPlanning')
);

export const BudgetTracking = lazyWithRetry(
  () => import(/* webpackChunkName: "budget" */ '@/pages/budget/BudgetTracking')
);

export const BudgetReports = lazyWithRetry(
  () => import(/* webpackChunkName: "budget" */ '@/pages/budget/BudgetReports')
);

/**
 * Access denied page
 */
export const AccessDenied = lazyWithRetry(
  () => import(/* webpackChunkName: "auth" */ '@/pages/auth/AccessDenied')
);

/**
 * Preload critical routes
 *
 * This function can be called after initial app load to preload
 * frequently accessed routes.
 */
export function preloadCriticalRoutes(): void {
  // Preload dashboard and health records (most common routes)
  if ('preload' in Dashboard) {
    (Dashboard as any).preload?.();
  }
  if ('preload' in HealthRecords) {
    (HealthRecords as any).preload?.();
  }
}

/**
 * Preload route by name
 */
export function preloadRoute(routeName: keyof typeof routes): void {
  const route = routes[routeName];
  if (route && 'preload' in route) {
    (route as any).preload?.();
  }
}

/**
 * All routes map for easy access
 */
export const routes = {
  Dashboard,
  Login,
  HealthRecords,
  AppointmentSchedule,
  InventoryItems,
  InventoryAlerts,
  InventoryTransactions,
  InventoryVendors,
  ReportsGenerate,
  ScheduledReports,
  Users,
  Roles,
  Permissions,
  BudgetOverview,
  BudgetPlanning,
  BudgetTracking,
  BudgetReports,
  AccessDenied,
};
