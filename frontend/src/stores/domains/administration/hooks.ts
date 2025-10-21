/**
 * Administration Domain Hooks
 * 
 * Custom hooks for administrative functionality including
 * district/school management, reporting, and system oversight.
 */

import { useAppSelector } from '../../hooks/reduxHooks';
import {
  selectDistrictSchoolHierarchy,
  selectAdministrationStats,
  selectInventoryOverview,
  selectReportAnalytics,
} from './selectors';

// ==========================================
// ADMINISTRATION HOOKS
// ==========================================

/**
 * Hook for administration overview
 */
export const useAdministrationOverview = () => {
  const stats = useAppSelector(selectAdministrationStats);
  const hierarchy = useAppSelector(selectDistrictSchoolHierarchy);

  return {
    stats,
    hierarchy,
  };
};

/**
 * Hook for inventory management
 */
export const useInventoryManagement = () => {
  const overview = useAppSelector(selectInventoryOverview);

  return {
    overview,
    needsAttention: overview.lowStockItems > 0 || overview.expiringItems > 0,
  };
};

/**
 * Hook for report analytics
 */
export const useReportAnalytics = () => {
  const analytics = useAppSelector(selectReportAnalytics);

  return {
    analytics,
  };
};