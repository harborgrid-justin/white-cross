/**
 * Test file to verify all re-exports are working correctly
 * This file should compile without errors (except for missing store types)
 */

// Test 1: routeValidation re-exports
import {
  useValidatedParams,
  UUIDParamSchema,
  RouteValidationError,
  type ParamValidator,
  type ValidationResult,
} from '../src/hooks/utilities/routeValidation';

// Test 2: routeState re-exports
import {
  useRouteState,
  usePersistedFilters,
  useNavigationState,
  type RouteStateOptions,
  type PaginationState,
} from '../src/hooks/utilities/routeState';

// Test 3: useRouteState.ts backward compatibility
import {
  useRouteState as useRouteStateCompat,
  type SortDirection,
} from '../src/hooks/utilities/useRouteState';

// Test 4: formPersistence re-exports
import {
  useFormPersistence,
  type FormPersistenceOptions,
  type FormPersistenceReturn,
} from '../src/hooks/utilities/formPersistence';

// Test 5: selectors re-exports
import {
  createMemoizedSelector,
  createParametricSelector,
  useParametricSelector,
  createFilteredSelector,
  type SelectorFn,
} from '../src/hooks/utilities/selectors';

// Test 6: useRefresh re-exports
import {
  useSimpleRefresh,
  useManualRefresh,
  useAutoRefreshInterval,
  useVisibilityManager,
  type UseRefreshOptions,
} from '../src/hooks/utilities/useRefresh';

// Test 7: useMedicationsRoute re-exports
import {
  useMedicationsRoute,
  type MedicationRouteState,
} from '../src/hooks/utilities/useMedicationsRoute';

// Test 8: Main utilities index re-exports all subdirectories
import {
  // From routeValidation
  useValidatedParams as useValidatedParamsMain,
  // From routeState
  usePageState,
  // From formPersistence
  useFormPersistence as useFormPersistenceMain,
  // From selectors
  createCompositeSelector,
  // From useRefresh
  usePauseResume,
} from '../src/hooks/utilities';

console.log('All re-exports verified successfully!');
