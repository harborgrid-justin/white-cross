/**
 * Route State Management Hooks
 *
 * Comprehensive route state hooks for managing URL-based application state including
 * filters, pagination, sorting, and navigation state. Provides persistent state
 * management synchronized with browser URL for better user experience and bookmarkability.
 *
 * @module hooks/useRouteState
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 *
 * @remarks
 * **Purpose**:
 * - URL-based state persistence for filters and pagination
 * - Browser history synchronization
 * - Bookmarkable application state
 * - Back/forward button support
 *
 * **Architecture**:
 * - Re-exports from canonical utilities location
 * - React Router integration
 * - Type-safe query parameter handling
 * - Automatic state serialization/deserialization
 *
 * **Hook Categories**:
 * - **useRouteState**: General-purpose route state management
 * - **usePersistedFilters**: Filter state synchronized with URL
 * - **useNavigationState**: Navigation history and state
 * - **usePageState**: Pagination state management
 * - **useSortState**: Sorting state with URL persistence
 *
 * **Key Features**:
 * - Automatic URL synchronization
 * - Type-safe state management
 * - Default value support
 * - Custom serialization options
 * - Browser history integration
 *
 * @example
 * ```typescript
 * // Example 1: Basic route state for search query
 * import { useRouteState } from '@/hooks/useRouteState';
 *
 * function SearchComponent() {
 *   const [search, setSearch] = useRouteState('search', '');
 *
 *   return (
 *     <input
 *       value={search}
 *       onChange={(e) => setSearch(e.target.value)}
 *       placeholder="Search students..."
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Example 2: Persisted filters with complex state
 * import { usePersistedFilters } from '@/hooks/useRouteState';
 *
 * interface StudentFilters {
 *   grade?: string;
 *   status?: 'active' | 'inactive';
 *   hasAllergies?: boolean;
 * }
 *
 * function StudentFilterPanel() {
 *   const [filters, setFilters] = usePersistedFilters<StudentFilters>({
 *     grade: undefined,
 *     status: 'active',
 *     hasAllergies: false
 *   });
 *
 *   return (
 *     <div>
 *       <select
 *         value={filters.grade || ''}
 *         onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
 *       >
 *         <option value="">All Grades</option>
 *         <option value="K">Kindergarten</option>
 *         <option value="1">Grade 1</option>
 *       </select>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Example 3: Pagination with URL state
 * import { usePageState } from '@/hooks/useRouteState';
 *
 * function PaginatedStudentList() {
 *   const { page, pageSize, setPage, setPageSize } = usePageState({
 *     defaultPage: 1,
 *     defaultPageSize: 20
 *   });
 *
 *   const { data, isLoading } = useStudents({ page, pageSize });
 *
 *   return (
 *     <div>
 *       <StudentList students={data?.items} />
 *       <Pagination
 *         current={page}
 *         pageSize={pageSize}
 *         total={data?.total}
 *         onChange={setPage}
 *         onShowSizeChange={(_, size) => setPageSize(size)}
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Example 4: Sorting with URL persistence
 * import { useSortState } from '@/hooks/useRouteState';
 *
 * function SortableStudentTable() {
 *   const { sortBy, sortDirection, setSort } = useSortState({
 *     defaultSortBy: 'lastName',
 *     defaultDirection: 'asc'
 *   });
 *
 *   const { data } = useStudents({ sortBy, sortDirection });
 *
 *   const handleSort = (field: string) => {
 *     const newDirection = sortBy === field && sortDirection === 'asc'
 *       ? 'desc'
 *       : 'asc';
 *     setSort(field, newDirection);
 *   };
 *
 *   return (
 *     <table>
 *       <thead>
 *         <tr>
 *           <th onClick={() => handleSort('lastName')}>Last Name</th>
 *           <th onClick={() => handleSort('grade')}>Grade</th>
 *         </tr>
 *       </thead>
 *     </table>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Example 5: Complete list view with all route state hooks
 * import {
 *   usePersistedFilters,
 *   usePageState,
 *   useSortState
 * } from '@/hooks/useRouteState';
 *
 * function StudentListView() {
 *   const [filters, setFilters] = usePersistedFilters({ status: 'active' });
 *   const { page, pageSize, setPage } = usePageState();
 *   const { sortBy, sortDirection, setSort } = useSortState();
 *
 *   const { data, isLoading } = useStudents({
 *     ...filters,
 *     page,
 *     pageSize,
 *     sortBy,
 *     sortDirection
 *   });
 *
 *   // All state is synchronized with URL:
 *   // /students?status=active&page=2&pageSize=20&sortBy=lastName&sortDirection=asc
 *
 *   return <StudentTable data={data} />;
 * }
 * ```
 *
 * @see {@link ./utilities/useRouteState} for canonical implementation
 * @see {@link react-router} for routing integration
 *
 * @since 1.0.0
 */

// Re-export all hooks from utilities
export {
  useRouteState,
  usePersistedFilters,
  useNavigationState,
  usePageState,
  useSortState,
} from './utilities/useRouteState';

// Re-export all types
export type {
  RouteStateOptions,
  FilterConfig,
  NavigationState,
  PaginationState,
  PaginationConfig,
  SortState,
  SortDirection,
  SortConfig,
} from './utilities/useRouteState';
