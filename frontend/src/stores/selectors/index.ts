/**
 * Selectors Index
 *
 * Central export for all memoized selectors.
 * Provides convenient imports for components.
 *
 * @module stores/selectors
 */

// Export selector utilities
export * from '../utils/selectors';
export * from '../utils/asyncState';

// Export domain selectors
export * from './studentsSelectors';
export * from './medicationsSelectors';
export * from './healthRecordsSelectors';

/**
 * Usage examples:
 *
 * @example
 * ```typescript
 * // In a component
 * import { useAppSelector } from '@/stores';
 * import { selectActiveStudents, selectMedicationsDueToday } from '@/stores/selectors';
 *
 * function MyComponent() {
 *   const activeStudents = useAppSelector(selectActiveStudents);
 *   const dueMedications = useAppSelector(selectMedicationsDueToday);
 *
 *   return (
 *     <div>
 *       <p>Active Students: {activeStudents.length}</p>
 *       <p>Medications Due: {dueMedications.length}</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Parameterized selectors
 * import { selectStudentsByGrade, selectMedicationsByStudent } from '@/stores/selectors';
 *
 * function GradeView({ grade }: { grade: number }) {
 *   const students = useAppSelector(state => selectStudentsByGrade(state, grade));
 *
 *   return <div>{students.length} students in grade {grade}</div>;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Complex filtered selectors
 * import { selectStudentsFiltered, selectMedicationsFiltered } from '@/stores/selectors';
 *
 * function FilteredStudentList() {
 *   const [filters, setFilters] = useState({
 *     grade: 5,
 *     hasAllergies: true,
 *     searchQuery: 'john'
 *   });
 *
 *   const filteredStudents = useAppSelector(state =>
 *     selectStudentsFiltered(state, filters)
 *   );
 *
 *   return <StudentList students={filteredStudents} />;
 * }
 * ```
 */
