'use client';

import React from 'react';
import { Search, X, User } from 'lucide-react';
import type { Patient } from './types';

/**
 * Props for the PatientSelector component
 */
interface PatientSelectorProps {
  /** Available patients */
  patients: Patient[];
  /** Currently selected patient ID */
  selectedPatientId: string;
  /** Search query string */
  searchQuery: string;
  /** Search results */
  searchResults: Patient[];
  /** Whether to show search results dropdown */
  showResults: boolean;
  /** Handler for patient selection */
  onPatientSelect: (patientId: string, patientName: string) => void;
  /** Handler for search input changes */
  onSearchChange: (query: string) => void;
  /** Handler for search focus */
  onSearchFocus: () => void;
  /** Handler for clearing search */
  onClearSearch: () => void;
  /** Custom CSS classes */
  className?: string;
}

/**
 * PatientSelector Component
 *
 * Provides a search interface for selecting patients with
 * autocomplete functionality and selected patient display.
 *
 * @param props - PatientSelector component props
 * @returns JSX element representing the patient selector
 */
const PatientSelector: React.FC<PatientSelectorProps> = ({
  patients,
  selectedPatientId,
  searchQuery,
  searchResults,
  showResults,
  onPatientSelect,
  onSearchChange,
  onSearchFocus,
  onClearSearch,
  className = ''
}) => {
  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const displayResults = searchResults.length > 0 ? searchResults : patients.slice(0, 10);

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4" id="patient-selection-label">
        Patient
      </h3>

      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" aria-hidden="true" />
          <label htmlFor="patient-search-input" className="sr-only">
            Search for a patient
          </label>
          <input
            type="text"
            id="patient-search-input"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            onFocus={onSearchFocus}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md
                     focus:ring-blue-500 focus:border-blue-500 text-sm"
            aria-labelledby="patient-selection-label"
            aria-autocomplete="list"
            aria-controls="patient-search-results"
            aria-expanded={showResults && displayResults.length > 0}
          />
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              aria-label="Clear patient search"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Patient Search Results */}
        {showResults && displayResults.length > 0 && (
          <div
            id="patient-search-results"
            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
            role="listbox"
            aria-label="Patient search results"
          >
            {displayResults.map((patient) => (
              <button
                key={patient.id}
                onClick={() => onPatientSelect(patient.id, patient.name)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50
                         focus:outline-none border-b border-gray-100 last:border-b-0"
                role="option"
                aria-selected={selectedPatientId === patient.id}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    {patient.avatar ? (
                      <img
                        src={patient.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User size={16} className="text-blue-600" aria-hidden="true" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {patient.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Patient Display */}
      {selectedPatient && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              {selectedPatient.avatar ? (
                <img
                  src={selectedPatient.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <User size={20} className="text-blue-600" aria-hidden="true" />
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                {selectedPatient.name}
              </div>
              <div className="text-xs text-gray-600">
                DOB: {new Date(selectedPatient.dateOfBirth).toLocaleDateString()}
              </div>
              {selectedPatient.phone && (
                <div className="text-xs text-gray-600">
                  Phone: {selectedPatient.phone}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientSelector;
