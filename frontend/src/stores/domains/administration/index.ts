/**
 * Administration Domain Store
 * 
 * Handles administrative functionality including districts, schools, 
 * reporting, inventory, and system administration.
 * This domain represents the operational management aspects of the platform.
 * 
 * @domain administration
 */

// Re-export existing administration-related slices with domain organization
export {
  // Districts slice - district management and configuration
  districtsSlice,
  districtsActions,
  districtsThunks,
  districtsSelectors,
  selectActiveDistricts,
} from '../../slices/districtsSlice';

export {
  // Schools slice - school management and configuration
  schoolsSlice,
  schoolsActions,
  schoolsThunks,
  schoolsSelectors,
  selectSchoolsByDistrict,
  selectActiveSchools,
} from '../../slices/schoolsSlice';

export {
  // Reports slice - analytics and reporting
  reportsSlice,
  reportsActions,
  reportsThunks,
  reportsSelectors,
  selectReportsByType,
  selectRecentReports,
} from '../../slices/reportsSlice';

export {
  // Inventory slice - supply and equipment management
  inventorySlice,
  inventoryActions,
  inventoryThunks,
  inventorySelectors,
  selectLowStockItems,
  selectExpiringItems,
} from '../../slices/inventorySlice';

export {
  // Settings slice - system configuration (shared with core domain)
  settingsSlice,
  settingsActions,
  settingsThunks,
  settingsSelectors,
} from '../../slices/settingsSlice';

// Domain-specific selectors and hooks
export * from './selectors';
export * from './hooks';
export * from './types';

// Advanced analytics and reporting
export * from './analytics';