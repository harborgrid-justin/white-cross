import React, { useState, useMemo } from 'react';
import { DataTable, DataTableColumn } from '../shared/DataTable';
import { BulkActionBar } from '../shared/BulkActionBar';
import { StudentCard } from './StudentCard';
import { StudentStatusBadge } from './StudentStatusBadge';
import { Badge } from '@/components/ui/display/Badge';
import { Button } from '@/components/ui/buttons/Button';
import { Eye, Edit, Trash2, LayoutGrid, LayoutList } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Student data type
 */
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  grade: string;
  school: string;
  status: 'active' | 'inactive' | 'transferred' | 'graduated';
  hasAllergies: boolean;
  hasMedications: boolean;
  hasChronicConditions: boolean;
  guardianName?: string;
  guardianPhone?: string;
  email?: string;
  photoUrl?: string;
  enrollmentDate?: string;
  lastVisit?: string;
}

/**
 * StudentList props
 */
export interface StudentListProps {
  /** Array of students */
  students: Student[];
  /** Loading state */
  loading?: boolean;
  /** View student handler */
  onView?: (student: Student) => void;
  /** Edit student handler */
  onEdit?: (student: Student) => void;
  /** Delete student handler */
  onDelete?: (student: Student) => void;
  /** Bulk delete handler */
  onBulkDelete?: (studentIds: string[]) => void;
  /** Bulk export handler */
  onBulkExport?: (studentIds: string[]) => void;
  /** Enable selection */
  selectable?: boolean;
  /** View mode */
  viewMode?: 'table' | 'grid';
  /** Allow view mode toggle */
  allowViewModeToggle?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * StudentList - Display students in table or grid view with actions
 *
 * @example
 * ```tsx
 * <StudentList
 *   students={students}
 *   loading={isLoading}
 *   onView={handleViewStudent}
 *   onEdit={handleEditStudent}
 *   onDelete={handleDeleteStudent}
 *   selectable
 * />
 * ```
 */
export const StudentList: React.FC<StudentListProps> = ({
  students,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onBulkDelete,
  onBulkExport,
  selectable = false,
  viewMode: controlledViewMode,
  allowViewModeToggle = true,
  className
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [internalViewMode, setInternalViewMode] = useState<'table' | 'grid'>('table');

  const viewMode = controlledViewMode ?? internalViewMode;

  // Calculate full name for sorting
  const studentsWithFullName = useMemo(() => {
    return students.map(student => ({
      ...student,
      fullName: `${student.lastName}, ${student.firstName}`
    }));
  }, [students]);

  // Define table columns
  const columns: DataTableColumn<Student & { fullName: string }>[] = [
    {
      id: 'name',
      header: 'Name',
      accessor: (row) => (
        <div className="flex items-center gap-3">
          {row.photoUrl ? (
            <img
              src={row.photoUrl}
              alt={`${row.firstName} ${row.lastName}`}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary-700 dark:text-primary-400">
                {row.firstName[0]}{row.lastName[0]}
              </span>
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {row.firstName} {row.lastName}
            </div>
            {row.email && (
              <div className="text-sm text-gray-500 dark:text-gray-400">{row.email}</div>
            )}
          </div>
        </div>
      ),
      sortable: true,
      sortFn: (a, b) => a.fullName.localeCompare(b.fullName)
    },
    {
      id: 'grade',
      header: 'Grade',
      accessor: (row) => (
        <Badge variant="secondary" size="sm">
          {row.grade}
        </Badge>
      ),
      sortable: true,
      sortFn: (a, b) => a.grade.localeCompare(b.grade),
      width: '100px'
    },
    {
      id: 'school',
      header: 'School',
      accessor: (row) => row.school,
      sortable: true,
      hideOnMobile: true
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row) => <StudentStatusBadge status={row.status} />,
      sortable: true,
      width: '120px'
    },
    {
      id: 'health',
      header: 'Health Alerts',
      accessor: (row) => (
        <div className="flex gap-1">
          {row.hasAllergies && (
            <Badge variant="warning" size="sm" title="Has allergies">
              A
            </Badge>
          )}
          {row.hasMedications && (
            <Badge variant="info" size="sm" title="Has medications">
              M
            </Badge>
          )}
          {row.hasChronicConditions && (
            <Badge variant="error" size="sm" title="Has chronic conditions">
              C
            </Badge>
          )}
          {!row.hasAllergies && !row.hasMedications && !row.hasChronicConditions && (
            <span className="text-sm text-gray-500 dark:text-gray-400">None</span>
          )}
        </div>
      ),
      width: '140px',
      hideOnMobile: true
    },
    {
      id: 'guardian',
      header: 'Guardian',
      accessor: (row) => (
        <div>
          {row.guardianName && (
            <div className="text-sm text-gray-900 dark:text-gray-100">{row.guardianName}</div>
          )}
          {row.guardianPhone && (
            <div className="text-sm text-gray-500 dark:text-gray-400">{row.guardianPhone}</div>
          )}
        </div>
      ),
      hideOnMobile: true
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-1">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onView(row);
              }}
              aria-label={`View ${row.firstName} ${row.lastName}`}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row);
              }}
              aria-label={`Edit ${row.firstName} ${row.lastName}`}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(row);
              }}
              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
              aria-label={`Delete ${row.firstName} ${row.lastName}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
      width: '120px',
      align: 'right'
    }
  ];

  // Bulk actions
  const bulkActions = [
    ...(onBulkExport
      ? [{
          id: 'export',
          label: 'Export',
          icon: undefined as any,
          onClick: () => {
            const ids = Array.from(selectedIds) as string[];
            onBulkExport(ids);
          }
        }]
      : []),
    ...(onBulkDelete
      ? [{
          id: 'delete',
          label: 'Delete',
          icon: Trash2,
          onClick: () => {
            const ids = Array.from(selectedIds) as string[];
            if (window.confirm(`Are you sure you want to delete ${ids.length} students?`)) {
              onBulkDelete(ids);
              setSelectedIds(new Set());
            }
          },
          variant: 'destructive' as const,
          confirmMessage: `Are you sure you want to delete ${selectedIds.size} students?`
        }]
      : [])
  ];

  return (
    <div className={cn('space-y-4', className)}>
      {/* View Mode Toggle */}
      {allowViewModeToggle && !controlledViewMode && (
        <div className="flex justify-end">
          <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 p-1">
            <button
              onClick={() => setInternalViewMode('table')}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150',
                viewMode === 'table'
                  ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              )}
              aria-label="Table view"
            >
              <LayoutList className="h-4 w-4" />
            </button>
            <button
              onClick={() => setInternalViewMode('grid')}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150',
                viewMode === 'grid'
                  ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bulk Action Bar */}
      {selectable && bulkActions.length > 0 && (
        <BulkActionBar
          selectedCount={selectedIds.size}
          totalCount={students.length}
          actions={bulkActions}
          onClearSelection={() => setSelectedIds(new Set())}
        />
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <DataTable
          data={studentsWithFullName}
          columns={columns}
          loading={loading}
          searchable
          searchPlaceholder="Search students..."
          paginated
          selectable={selectable}
          selectedRows={selectedIds}
          onSelectionChange={setSelectedIds}
          getRowId={(row) => row.id}
          onRowClick={onView}
          emptyTitle="No students found"
          emptyDescription="Add students to get started"
        />
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            ))
          ) : students.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="text-lg font-medium">No students found</p>
              <p className="text-sm">Add students to get started</p>
            </div>
          ) : (
            students.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                selectable={selectable}
                selected={selectedIds.has(student.id)}
                onSelect={(selected) => {
                  const newSelection = new Set(selectedIds);
                  if (selected) {
                    newSelection.add(student.id);
                  } else {
                    newSelection.delete(student.id);
                  }
                  setSelectedIds(newSelection);
                }}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

StudentList.displayName = 'StudentList';

export default React.memo(StudentList);
