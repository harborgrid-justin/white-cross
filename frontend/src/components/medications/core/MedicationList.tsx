'use client';

/**
 * WF-MED-001 | MedicationList.tsx - Medication List Component
 * Purpose: Display list of medications with filtering and sorting
 * Upstream: Medication API | Dependencies: React, Table components
 * Downstream: Medication pages | Called by: Medication management views
 * Related: MedicationDetails, MedicationForm
 * Exports: MedicationList component | Key Features: Filtering, sorting, pagination
 * Last Updated: 2025-10-27 | File Type: .tsx
 * Critical Path: Medication data → List display → User interaction
 * LLM Context: Core medication list component for White Cross healthcare platform
 */

import React, { useState, useMemo } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmptyState, TableLoadingState } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/inputs';

/**
 * Medication data interface
 *
 * @interface Medication
 * @property {string} id - Unique medication identifier
 * @property {string} name - Medication name (generic or brand)
 * @property {string} dosage - Dosage amount and unit
 * @property {string} frequency - Administration frequency
 * @property {string} route - Route of administration
 * @property {string} prescriber - Prescribing healthcare provider
 * @property {string} startDate - Treatment start date
 * @property {string} [endDate] - Treatment end date (optional)
 * @property {string} status - Current medication status
 * @property {boolean} isControlled - Controlled substance flag
 * @property {string} [studentId] - Associated student ID (optional)
 * @property {string} [studentName] - Associated student name (optional)
 */
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  prescriber: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'inactive' | 'discontinued' | 'pending';
  isControlled: boolean;
  studentId?: string;
  studentName?: string;
}

/**
 * MedicationList component props
 *
 * @interface MedicationListProps
 * @property {Medication[]} medications - Array of medications to display
 * @property {boolean} [isLoading] - Loading state indicator
 * @property {(medication: Medication) => void} [onSelect] - Callback when medication is selected
 * @property {(medicationId: string) => void} [onEdit] - Callback to edit medication
 * @property {(medicationId: string) => void} [onDelete] - Callback to delete medication
 * @property {boolean} [showStudent] - Show student information column
 * @property {boolean} [enableFiltering] - Enable search/filter functionality
 * @property {boolean} [enableSorting] - Enable column sorting
 */
export interface MedicationListProps {
  medications: Medication[];
  isLoading?: boolean;
  onSelect?: (medication: Medication) => void;
  onEdit?: (medicationId: string) => void;
  onDelete?: (medicationId: string) => void;
  showStudent?: boolean;
  enableFiltering?: boolean;
  enableSorting?: boolean;
}

/**
 * MedicationList component for displaying and managing medications
 *
 * A comprehensive medication list component with filtering, sorting, and action capabilities.
 * Designed for healthcare environments with HIPAA compliance in mind.
 *
 * **Features:**
 * - Search/filter medications by name, student, or prescriber
 * - Sortable columns (name, student, status, dates)
 * - Status indicators with color coding
 * - Controlled substance highlighting
 * - Row actions (view, edit, delete)
 * - Empty and loading states
 * - Responsive table layout
 *
 * **Accessibility:**
 * - Keyboard navigable table
 * - Screen reader friendly labels
 * - ARIA attributes for status
 * - Focus management
 *
 * @component
 * @param {MedicationListProps} props - Component props
 * @returns {JSX.Element} Rendered medication list
 *
 * @example
 * ```tsx
 * <MedicationList
 *   medications={medicationData}
 *   isLoading={false}
 *   onSelect={(med) => console.log('Selected:', med)}
 *   onEdit={(id) => openEditModal(id)}
 *   showStudent={true}
 *   enableFiltering={true}
 *   enableSorting={true}
 * />
 * ```
 */
export const MedicationList: React.FC<MedicationListProps> = ({
  medications,
  isLoading = false,
  onSelect,
  onEdit,
  onDelete,
  showStudent = false,
  enableFiltering = true,
  enableSorting = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Medication | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  /**
   * Handle column sort
   */
  const handleSort = (field: keyof Medication) => {
    if (!enableSorting) return;

    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  /**
   * Filter and sort medications
   */
  const filteredAndSortedMedications = useMemo(() => {
    let result = [...medications];

    // Apply search filter
    if (enableFiltering && searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (med) =>
          med.name.toLowerCase().includes(lowerSearch) ||
          med.prescriber.toLowerCase().includes(lowerSearch) ||
          med.studentName?.toLowerCase().includes(lowerSearch) ||
          med.dosage.toLowerCase().includes(lowerSearch)
      );
    }

    // Apply sorting
    if (enableSorting && sortField) {
      result.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue === undefined || bValue === undefined) return 0;

        let comparison = 0;
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          comparison = aValue.localeCompare(bValue);
        } else {
          comparison = aValue > bValue ? 1 : -1;
        }

        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [medications, searchTerm, sortField, sortDirection, enableFiltering, enableSorting]);

  /**
   * Get status badge color
   */
  const getStatusColor = (status: Medication['status']) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      discontinued: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || colors.inactive;
  };

  return (
    <div className="space-y-4">
      {/* Search/Filter Bar */}
      {enableFiltering && (
        <div className="flex items-center justify-between">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search medications, students, or prescribers..."
            className="max-w-md"
          />
          <div className="text-sm text-gray-600">
            Showing {filteredAndSortedMedications.length} of {medications.length} medications
          </div>
        </div>
      )}

      {/* Medications Table */}
      <Table variant="striped" size="md">
        <TableHeader>
          <TableRow>
            <TableHead
              sortable={enableSorting}
              sortDirection={sortField === 'name' ? sortDirection : null}
              onSort={() => handleSort('name')}
            >
              Medication
            </TableHead>
            <TableHead>Dosage</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Route</TableHead>
            {showStudent && (
              <TableHead
                sortable={enableSorting}
                sortDirection={sortField === 'studentName' ? sortDirection : null}
                onSort={() => handleSort('studentName')}
              >
                Student
              </TableHead>
            )}
            <TableHead>Prescriber</TableHead>
            <TableHead
              sortable={enableSorting}
              sortDirection={sortField === 'startDate' ? sortDirection : null}
              onSort={() => handleSort('startDate')}
            >
              Start Date
            </TableHead>
            <TableHead
              sortable={enableSorting}
              sortDirection={sortField === 'status' ? sortDirection : null}
              onSort={() => handleSort('status')}
            >
              Status
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableLoadingState rows={5} cols={showStudent ? 9 : 8} />
          ) : filteredAndSortedMedications.length === 0 ? (
            <TableEmptyState
              colSpan={showStudent ? 9 : 8}
              title="No medications found"
              description={searchTerm ? "Try adjusting your search criteria" : "No medications have been added yet"}
            />
          ) : (
            filteredAndSortedMedications.map((medication) => (
              <TableRow
                key={medication.id}
                clickable={!!onSelect}
                onClick={() => onSelect?.(medication)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {medication.name}
                    {medication.isControlled && (
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800"
                        title="Controlled Substance"
                      >
                        CS
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{medication.dosage}</TableCell>
                <TableCell>{medication.frequency}</TableCell>
                <TableCell>{medication.route}</TableCell>
                {showStudent && <TableCell>{medication.studentName || 'N/A'}</TableCell>}
                <TableCell>{medication.prescriber}</TableCell>
                <TableCell>{medication.startDate}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      medication.status
                    )}`}
                  >
                    {medication.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {onEdit && (
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(medication.id);
                        }}
                      >
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(medication.id);
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

MedicationList.displayName = 'MedicationList';

export default MedicationList;


