/**
 * @fileoverview Enterprise-grade Table component system for displaying tabular data in healthcare applications.
 *
 * This module provides a comprehensive set of table components with support for sorting, selection,
 * multiple visual variants, responsive sizing, and accessibility features. Designed specifically for
 * healthcare data presentation including student health records, medication schedules, appointment lists,
 * and compliance reporting.
 *
 * **Key Features:**
 * - Multiple visual variants (default, striped, bordered)
 * - Responsive sizing (small, medium, large)
 * - Sortable columns with keyboard navigation
 * - Row selection and interaction states
 * - Empty and loading state utilities
 * - Full ARIA support for accessibility
 * - HIPAA-compliant data presentation
 *
 * **Component Hierarchy:**
 * - `Table` - Main table wrapper with overflow handling
 * - `TableHeader` - Thead element for column headers
 * - `TableBody` - Tbody element for data rows
 * - `TableRow` - Tr element with selection and interaction states
 * - `TableHead` - Th element with sorting capabilities
 * - `TableCell` - Td element for data cells
 * - `TableCaption` - Accessible caption for table context
 * - `TableEmpty` - Utility component for empty data sets
 * - `TableLoading` - Skeleton loader for data fetching
 *
 * @module components/ui/data/Table
 * @since 1.0.0
 *
 * @example Basic Student List Table
 * ```tsx
 * import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
 *
 * function StudentList({ students }) {
 *   return (
 *     <Table variant="striped" size="md">
 *       <TableHeader>
 *         <TableRow>
 *           <TableHead>Student ID</TableHead>
 *           <TableHead>Name</TableHead>
 *           <TableHead>Grade</TableHead>
 *           <TableHead>Allergies</TableHead>
 *         </TableRow>
 *       </TableHeader>
 *       <TableBody>
 *         {students.map(student => (
 *           <TableRow key={student.id}>
 *             <TableCell>{student.id}</TableCell>
 *             <TableCell>{student.name}</TableCell>
 *             <TableCell>{student.grade}</TableCell>
 *             <TableCell>{student.allergies || 'None'}</TableCell>
 *           </TableRow>
 *         ))}
 *       </TableBody>
 *     </Table>
 *   );
 * }
 * ```
 *
 * @example Sortable Medication Schedule
 * ```tsx
 * function MedicationSchedule() {
 *   const [sortField, setSortField] = useState<'time' | 'medication' | null>(null);
 *   const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
 *
 *   const handleSort = (field: 'time' | 'medication') => {
 *     if (sortField === field) {
 *       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
 *     } else {
 *       setSortField(field);
 *       setSortDirection('asc');
 *     }
 *   };
 *
 *   return (
 *     <Table variant="bordered">
 *       <TableHeader>
 *         <TableRow>
 *           <TableHead
 *             sortable
 *             sortDirection={sortField === 'time' ? sortDirection : null}
 *             onSort={() => handleSort('time')}
 *           >
 *             Time
 *           </TableHead>
 *           <TableHead
 *             sortable
 *             sortDirection={sortField === 'medication' ? sortDirection : null}
 *             onSort={() => handleSort('medication')}
 *           >
 *             Medication
 *           </TableHead>
 *           <TableHead>Dosage</TableHead>
 *           <TableHead>Status</TableHead>
 *         </TableRow>
 *       </TableHeader>
 *       <TableBody>
 *         {medications.map(med => (
 *           <TableRow key={med.id}>
 *             <TableCell>{med.time}</TableCell>
 *             <TableCell>{med.name}</TableCell>
 *             <TableCell>{med.dosage}</TableCell>
 *             <TableCell>{med.status}</TableCell>
 *           </TableRow>
 *         ))}
 *       </TableBody>
 *     </Table>
 *   );
 * }
 * ```
 *
 * @example Interactive Appointment Table with Selection
 * ```tsx
 * function AppointmentTable() {
 *   const [selectedId, setSelectedId] = useState<string | null>(null);
 *
 *   return (
 *     <Table size="lg">
 *       <TableCaption>Upcoming appointments for this week</TableCaption>
 *       <TableHeader>
 *         <TableRow>
 *           <TableHead>Date</TableHead>
 *           <TableHead>Time</TableHead>
 *           <TableHead>Student</TableHead>
 *           <TableHead>Purpose</TableHead>
 *         </TableRow>
 *       </TableHeader>
 *       <TableBody>
 *         {appointments.map(apt => (
 *           <TableRow
 *             key={apt.id}
 *             clickable
 *             selected={selectedId === apt.id}
 *             onClick={() => setSelectedId(apt.id)}
 *           >
 *             <TableCell>{apt.date}</TableCell>
 *             <TableCell>{apt.time}</TableCell>
 *             <TableCell>{apt.studentName}</TableCell>
 *             <TableCell>{apt.purpose}</TableCell>
 *           </TableRow>
 *         ))}
 *       </TableBody>
 *     </Table>
 *   );
 * }
 * ```
 *
 * @example Table with Empty State
 * ```tsx
 * function HealthRecordTable({ records }) {
 *   return (
 *     <Table variant="striped">
 *       <TableHeader>
 *         <TableRow>
 *           <TableHead>Date</TableHead>
 *           <TableHead>Type</TableHead>
 *           <TableHead>Provider</TableHead>
 *           <TableHead>Notes</TableHead>
 *         </TableRow>
 *       </TableHeader>
 *       <TableBody>
 *         {records.length === 0 ? (
 *           <TableEmpty
 *             colSpan={4}
 *             title="No health records found"
 *             description="Add a health record to get started"
 *           />
 *         ) : (
 *           records.map(record => (
 *             <TableRow key={record.id}>
 *               <TableCell>{record.date}</TableCell>
 *               <TableCell>{record.type}</TableCell>
 *               <TableCell>{record.provider}</TableCell>
 *               <TableCell>{record.notes}</TableCell>
 *             </TableRow>
 *           ))
 *         )}
 *       </TableBody>
 *     </Table>
 *   );
 * }
 * ```
 *
 * @example Table with Loading State
 * ```tsx
 * function ImmunizationTable({ isLoading, immunizations }) {
 *   return (
 *     <Table>
 *       <TableHeader>
 *         <TableRow>
 *           <TableHead>Vaccine</TableHead>
 *           <TableHead>Date Given</TableHead>
 *           <TableHead>Lot Number</TableHead>
 *           <TableHead>Next Due</TableHead>
 *         </TableRow>
 *       </TableHeader>
 *       <TableBody>
 *         {isLoading ? (
 *           <TableLoading rows={5} cols={4} />
 *         ) : (
 *           immunizations.map(imm => (
 *             <TableRow key={imm.id}>
 *               <TableCell>{imm.vaccine}</TableCell>
 *               <TableCell>{imm.dateGiven}</TableCell>
 *               <TableCell>{imm.lotNumber}</TableCell>
 *               <TableCell>{imm.nextDue}</TableCell>
 *             </TableRow>
 *           ))
 *         )}
 *       </TableBody>
 *     </Table>
 *   );
 * }
 * ```
 *
 * @example Complex Healthcare Data Table
 * ```tsx
 * function HealthMetricsTable({ metrics }) {
 *   return (
 *     <Table variant="bordered" size="sm">
 *       <TableCaption>Health screening results for academic year 2024-2025</TableCaption>
 *       <TableHeader>
 *         <TableRow>
 *           <TableHead>Student</TableHead>
 *           <TableHead>Height (in)</TableHead>
 *           <TableHead>Weight (lbs)</TableHead>
 *           <TableHead>BMI</TableHead>
 *           <TableHead>Vision</TableHead>
 *           <TableHead>Hearing</TableHead>
 *           <TableHead>Status</TableHead>
 *         </TableRow>
 *       </TableHeader>
 *       <TableBody>
 *         {metrics.map(metric => (
 *           <TableRow key={metric.studentId}>
 *             <TableCell className="font-medium">{metric.studentName}</TableCell>
 *             <TableCell>{metric.height}</TableCell>
 *             <TableCell>{metric.weight}</TableCell>
 *             <TableCell>{metric.bmi}</TableCell>
 *             <TableCell>{metric.vision}</TableCell>
 *             <TableCell>{metric.hearing}</TableCell>
 *             <TableCell>
 *               <span className={metric.needsFollowup ? 'text-red-600' : 'text-green-600'}>
 *                 {metric.status}
 *               </span>
 *             </TableCell>
 *           </TableRow>
 *         ))}
 *       </TableBody>
 *     </Table>
 *   );
 * }
 * ```
 *
 * @accessibility
 * - Uses semantic HTML table elements (table, thead, tbody, tr, th, td)
 * - Table headers use scope="col" for proper column association
 * - Sortable columns are keyboard accessible (Enter/Space to sort)
 * - Sort direction announced via aria-sort attribute
 * - Clickable rows include aria-selected for selection state
 * - Caption provides context for screen readers
 * - Focus visible states for keyboard navigation
 *
 * @see {@link https://www.w3.org/WAI/ARIA/apg/patterns/table/} ARIA Table Pattern
 */

// Core Components
export { Table } from './Table';
export { TableHeader } from './TableHeader';
export { TableBody } from './TableBody';
export { TableRow } from './TableRow';
export { TableHead } from './TableHead';
export { TableCell } from './TableCell';
export { TableCaption } from './TableCaption';

// Utility Components
export { TableEmpty, TableEmptyState } from './TableEmpty';
export { TableLoading, TableLoadingState } from './TableLoading';

// Types
export type {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
  TableCaptionProps,
  TableEmptyProps,
  TableLoadingProps
} from './types';
