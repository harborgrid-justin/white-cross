'use client';

import React from 'react';
import { Loader2, AlertCircle, Pill } from 'lucide-react';
import { MedicationCard } from './MedicationCard';

/**
 * Interface for medication data (imported from MedicationCard)
 */
interface Medication {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  route: string;
  status: 'active' | 'inactive' | 'discontinued' | 'on-hold';
  prescribedBy: string;
  prescribedDate: string;
  startDate: string;
  endDate?: string;
  nextDose?: string;
  indication: string;
  instructions?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  refillsRemaining?: number;
  pharmacy?: string;
  lastAdministered?: string;
  complianceRate?: number;
}

/**
 * Props for the MedicationList component
 */
interface MedicationListProps {
  /** Array of medications to display */
  medications?: Medication[];
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string | null;
  /** Selected medication IDs */
  selectedMedications?: string[];
  /** Callback when medication is clicked */
  onMedicationClick?: (medication: Medication) => void;
  /** Callback when medication is selected/deselected */
  onMedicationSelect?: (medicationId: string, selected: boolean) => void;
  /** View mode - compact or detailed */
  viewMode?: 'compact' | 'detailed';
  /** Custom empty state message */
  emptyMessage?: string;
  /** Custom empty state description */
  emptyDescription?: string;
  /** Show selection checkboxes */
  showSelection?: boolean;
  /** Custom CSS classes */
  className?: string;
}

/**
 * MedicationList Component
 * 
 * Displays a list of medications with support for loading states, error handling,
 * selection, and different view modes. Handles empty states gracefully.
 * 
 * @component
 * @example
 * ```tsx
 * <MedicationList 
 *   medications={medications}
 *   loading={isLoading}
 *   onMedicationClick={handleMedicationClick}
 *   viewMode="detailed"
 * />
 * ```
 */
export const MedicationList = ({
  medications = [],
  loading = false,
  error = null,
  selectedMedications = [],
  onMedicationClick,
  onMedicationSelect,
  viewMode = 'compact',
  emptyMessage = 'No medications found',
  emptyDescription = 'There are no medications matching your current filters.',
  showSelection = false,
  className = ''
}: MedicationListProps) => {
  // Loading state
  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading medications...</p>
          <p className="text-sm text-gray-500 mt-1">Please wait while we fetch the data</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Medications
          </h3>
          <p className="text-gray-600 mb-4 max-w-md">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!medications.length) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Pill className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {emptyMessage}
          </h3>
          <p className="text-gray-600 mb-4 max-w-md">{emptyDescription}</p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>Try adjusting your search terms or filters</p>
            <p>Or add a new medication to get started</p>
          </div>
        </div>
      </div>
    );
  }

  const handleMedicationClick = (medication: Medication) => {
    if (onMedicationClick) {
      onMedicationClick(medication);
    }
  };

  const handleSelectionChange = (medicationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const isSelected = selectedMedications.includes(medicationId);
    if (onMedicationSelect) {
      onMedicationSelect(medicationId, !isSelected);
    }
  };

  // Determine grid layout based on view mode
  const gridClasses = viewMode === 'detailed' 
    ? 'grid grid-cols-1 gap-4'
    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';

  return (
    <div className={`${className}`}>
      {/* Selection header */}
      {showSelection && selectedMedications.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold mr-3">
                {selectedMedications.length}
              </div>
              <span className="text-sm font-medium text-blue-900">
                {selectedMedications.length} medication{selectedMedications.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Bulk Actions
              </button>
              <button 
                onClick={() => onMedicationSelect && onMedicationSelect('', false)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Medications grid */}
      <div className={gridClasses} role="list" aria-label="Medications list">
        {medications.map((medication) => {
          const isSelected = selectedMedications.includes(medication.id);
          
          return (
            <div 
              key={medication.id} 
              className="relative"
              role="listitem"
            >
              {/* Selection checkbox */}
              {showSelection && (
                <div className="absolute top-2 left-2 z-10">
                  <button
                    onClick={(e: React.MouseEvent) => handleSelectionChange(medication.id, e)}
                    className={`
                      w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                      ${isSelected 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'bg-white border-gray-300 hover:border-gray-400'
                      }
                    `}
                    aria-label={`${isSelected ? 'Deselect' : 'Select'} ${medication.name}`}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              )}

              {/* Medication card */}
              <MedicationCard
                medication={medication}
                onClick={handleMedicationClick}
                selected={isSelected}
                detailed={viewMode === 'detailed'}
                className={showSelection ? 'pl-8' : ''}
              />
            </div>
          );
        })}
      </div>

      {/* Results summary */}
      <div className="mt-6 text-center text-sm text-gray-500">
        Showing {medications.length} medication{medications.length !== 1 ? 's' : ''}
        {viewMode === 'detailed' && medications.length > 0 && (
          <div className="mt-2 text-xs">
            Switch to compact view to see more medications at once
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationList;
