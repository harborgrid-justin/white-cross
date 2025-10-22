/**
 * MedicationsList Component
 * Purpose: Main list view for medications with filtering, sorting, and pagination
 * Features: Active/inactive status, student filtering, medication type filters
 */

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../stores/reduxStore';
import { fetchMedications, setMedicationFilters, setMedicationsPagination } from '../store/medicationsSlice';
import { MedicationCard } from './MedicationCard';
import { MedicationFilters } from './MedicationFilters';
import { MedicationsPagination } from './MedicationsPagination';

interface MedicationsListProps {
  studentId?: string;
  showActiveOnly?: boolean;
  className?: string;
}

export const MedicationsList: React.FC<MedicationsListProps> = ({
  studentId,
  showActiveOnly = false,
  className = ''
}) => {
  const dispatch = useDispatch();
  const {
    medications,
    loading,
    error,
    filters,
    pagination
  } = useSelector((state: RootState) => state.medications);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch medications on component mount
    dispatch(fetchMedications({ 
      studentId, 
      activeOnly: showActiveOnly,
      ...filters,
      ...pagination 
    }));
  }, [dispatch, studentId, showActiveOnly, filters, pagination]);

  const handleFilterChange = (newFilters: any) => {
    dispatch(setMedicationFilters(newFilters));
  };

  const handlePageChange = (page: number, limit: number) => {
    dispatch(setMedicationsPagination({ page, limit }));
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    dispatch(setMedicationFilters({ ...filters, searchTerm: term }));
  };

  if (loading) {
    return (
      <div className={`medications-list ${className}`}>
        <div className="loading-container">
          <div className="spinner" />
          <p>Loading medications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`medications-list ${className}`}>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Medications</h3>
          <p>{error}</p>
          <button 
            onClick={() => dispatch(fetchMedications({ studentId, activeOnly: showActiveOnly }))}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`medications-list ${className}`}>
      {/* Header */}
      <div className="medications-list-header">
        <div className="title-section">
          <h2>
            {studentId ? 'Student Medications' : 'All Medications'}
            {showActiveOnly && ' (Active Only)'}
          </h2>
          <div className="count-badge">
            {pagination.total} medication{pagination.total !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search medications by name, student, or prescriber..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="search-input"
            />
            <div className="search-icon">🔍</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <MedicationFilters
        filters={filters}
        onFiltersChange={handleFilterChange}
        studentId={studentId}
      />

      {/* Medications Grid */}
      <div className="medications-grid">
        {medications.length > 0 ? (
          medications.map((medication) => (
            <MedicationCard
              key={medication.id}
              medication={medication}
              showStudent={!studentId}
              onStatusChange={() => dispatch(fetchMedications({ studentId, activeOnly: showActiveOnly }))}
            />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">💊</div>
            <h3>No Medications Found</h3>
            <p>
              {searchTerm || Object.keys(filters).length > 0
                ? 'Try adjusting your search or filters'
                : studentId
                ? 'This student has no medications on record'
                : 'No medications have been added yet'
              }
            </p>
            {!studentId && (
              <button className="add-medication-button">
                Add First Medication
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <MedicationsPagination
          currentPage={pagination.page}
          pageSize={pagination.limit}
          totalCount={pagination.total}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default MedicationsList;
