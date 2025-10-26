'use client';

/**
 * WF-COMP-035 | VaccinationsTab.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../shared/SearchAndFilter | Dependencies: react, lucide-react, ../shared/SearchAndFilter
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: useMemo, functional component, arrow component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import React from 'react'
import { Plus, Shield } from 'lucide-react'
import { SearchAndFilter } from '../shared/SearchAndFilter'
import { getVaccinationStatusColor, getPriorityColor, sortVaccinations, filterVaccinations } from '@/utils/healthRecords'
import type { Vaccination } from '@/types/healthRecords'
import type { User } from '@/types'

interface VaccinationsTabProps {
  vaccinations: Vaccination[]
  searchQuery: string
  onSearchChange: (query: string) => void
  vaccinationFilter: string
  onFilterChange: (filter: string) => void
  vaccinationSort: string
  onSortChange: (sort: string) => void
  onRecordVaccination: () => void
  onEditVaccination: (vaccination: Vaccination) => void
  onDeleteVaccination: (vaccination: Vaccination) => void
  onScheduleVaccination: () => void
  user?: User | null
}

export const VaccinationsTab: React.FC<VaccinationsTabProps> = ({
  vaccinations,
  searchQuery,
  onSearchChange,
  vaccinationFilter,
  onFilterChange,
  vaccinationSort,
  onSortChange,
  onRecordVaccination,
  onEditVaccination,
  onDeleteVaccination,
  onScheduleVaccination,
  user
}) => {
  const canModify = user?.role !== 'READ_ONLY' && user?.role !== 'VIEWER'

  // Helper to check if vaccination is compliant
  const isCompliant = (vax: Vaccination) => vax.complianceStatus === 'COMPLIANT'

  const filteredAndSortedVaccinations = sortVaccinations(
    filterVaccinations(vaccinations, searchQuery, vaccinationFilter),
    vaccinationSort
  )

  // Derive upcoming vaccinations from the vaccinations list
  // These are vaccinations that are overdue or scheduled for the future
  const upcomingVaccinations = React.useMemo(() => {
    return vaccinations
      .filter(vax => !isCompliant(vax) && vax.nextDueDate) // Not compliant and has a due date
      .sort((a, b) => {
        // Sort by due date (earliest first)
        const dateA = new Date(a.nextDueDate || '').getTime()
        const dateB = new Date(b.nextDueDate || '').getTime()
        return dateA - dateB
      })
      .slice(0, 5) // Show only the top 5 upcoming
  }, [vaccinations])

  const filterOptions = [
    { value: '', label: 'All Status' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Overdue', label: 'Overdue' },
    { value: 'Scheduled', label: 'Scheduled' },
  ]

  const sortOptions = [
    { value: 'date-desc', label: 'Date (Newest First)' },
    { value: 'date-asc', label: 'Date (Oldest First)' },
    { value: 'name', label: 'Name' },
    { value: 'status', label: 'Status' },
  ]

  return (
    <div className="space-y-4" data-testid="vaccinations-content">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Vaccination Records</h3>
        <div className="flex gap-2">
          <button
            className="btn-primary flex items-center"
            data-testid="record-vaccination-button"
            onClick={onRecordVaccination}
            disabled={!canModify}
          >
            <Plus className="h-4 w-4 mr-2" />
            Record Vaccination
          </button>
          <button
            className="btn-secondary flex items-center"
            data-testid="schedule-vaccination-button"
            onClick={onScheduleVaccination}
            disabled={!canModify}
          >
            <Shield className="h-4 w-4 mr-2" />
            Schedule
          </button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        filterOptions={filterOptions}
        filterValue={vaccinationFilter}
        onFilterChange={onFilterChange}
        sortOptions={sortOptions}
        sortValue={vaccinationSort}
        onSortChange={onSortChange}
        searchPlaceholder="Search vaccinations..."
        testIds={{
          search: 'vaccination-search',
          filter: 'vaccination-filter',
          sort: 'vaccination-sort'
        }}
      />

      {/* Vaccinations List */}
      <div className="space-y-3" data-testid="vaccinations-table">
        {filteredAndSortedVaccinations.map((vax) => (
          <div key={vax.id} className="border border-gray-200 rounded-lg p-4" data-testid="vaccination-row">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                <Shield className={`h-5 w-5 mt-1 ${
                  isCompliant(vax) ? 'text-green-600' : 'text-orange-600'
                }`} />
                <div>
                  <h4 className="font-semibold" data-testid="vaccine-name">{vax.vaccineName}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded ${getVaccinationStatusColor(isCompliant(vax))}`} data-testid="compliance-badge">
                      {isCompliant(vax) ? 'Compliant' : 'Overdue'}
                    </span>
                    {vax.administrationDate && (
                      <span className="text-sm text-gray-600" data-testid="administered-date">
                        Administered: {vax.administrationDate}
                      </span>
                    )}
                    {vax.nextDueDate && !isCompliant(vax) && (
                      <span className="text-sm text-gray-600" data-testid="due-date">
                        Due: {vax.nextDueDate}
                      </span>
                    )}
                    {/* Priority badge disabled - priority property not in Vaccination type
                    {vax.priority && (
                      <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(vax.priority)}`} data-testid="priority-badge">
                        {vax.priority}
                      </span>
                    )}
                    */}
                  </div>
                </div>
              </div>
              <div className="flex gap-2" data-testid="vaccination-actions">
                <button
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  data-testid="edit-vaccination"
                  onClick={() => onEditVaccination(vax)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                  data-testid="delete-vaccination"
                  onClick={() => onDeleteVaccination(vax)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Vaccinations */}
      <div className="mt-8" data-testid="upcoming-vaccinations">
        <h4 className="text-lg font-semibold mb-4">Upcoming Vaccinations</h4>
        <div className="space-y-3">
          {upcomingVaccinations.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p>No upcoming vaccinations at this time.</p>
            </div>
          ) : (
            upcomingVaccinations.map((upcoming) => (
              <div key={upcoming.id} className="border border-gray-200 rounded-lg p-4" data-testid="upcoming-vaccination-card">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold" data-testid="vaccination-name">{upcoming.vaccineName}</h5>
                    <p className="text-sm text-gray-600" data-testid="due-date">Due: {upcoming.nextDueDate}</p>
                    {/* Priority badge disabled - priority property not in Vaccination type
                    {upcoming.priority && (
                      <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(upcoming.priority)}`} data-testid="vaccination-priority">
                        {upcoming.priority} Priority
                      </span>
                    )}
                    */}
                  </div>
                  <button
                    className="btn-primary"
                    data-testid="schedule-vaccination-btn"
                    onClick={onScheduleVaccination}
                  >
                    Schedule
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Compliance and other sections... */}
      <div className="mt-8" data-testid="compliance-status">
        <h4 className="text-lg font-semibold mb-4">Vaccination Compliance</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700" data-testid="compliance-percentage">
              {vaccinations.length > 0
                ? Math.round((vaccinations.filter(v => isCompliant(v)).length / vaccinations.length) * 100)
                : 0}%
            </div>
            <div className="text-sm text-green-600">Overall Compliance</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-700" data-testid="missing-vaccinations">
              {vaccinations.filter(v => !isCompliant(v) && !v.administeredDate).length}
            </div>
            <div className="text-sm text-yellow-600">Missing Vaccinations</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-700" data-testid="overdue-vaccinations">
              {vaccinations.filter(v => !isCompliant(v) && v.nextDueDate && new Date(v.nextDueDate) < new Date()).length}
            </div>
            <div className="text-sm text-red-600">Overdue Vaccinations</div>
          </div>
        </div>
      </div>
    </div>
  )
}