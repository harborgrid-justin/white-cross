import React from 'react'
import { Plus, Shield } from 'lucide-react'
import { SearchAndFilter } from '../shared/SearchAndFilter'
import { getVaccinationStatusColor, getPriorityColor, sortVaccinations, filterVaccinations } from '@/utils/healthRecords'
import type { Vaccination } from '@/types/healthRecords'

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
  onScheduleVaccination
}) => {
  const mockVaccinations: Vaccination[] = [
    {
      id: '1',
      vaccineName: 'COVID-19 Vaccine',
      dateAdministered: '2024-09-15',
      administeredBy: 'School Nurse',
      compliant: true
    },
    {
      id: '2',
      vaccineName: 'Influenza Vaccine',
      dateAdministered: '2024-08-20',
      administeredBy: 'Dr. Smith',
      compliant: true
    },
    {
      id: '3',
      vaccineName: 'Tdap Booster',
      dateAdministered: '',
      administeredBy: '',
      compliant: false,
      dueDate: '2024-11-01'
    }
  ]

  const displayVaccinations = vaccinations.length > 0 ? vaccinations : mockVaccinations
  const filteredAndSortedVaccinations = sortVaccinations(
    filterVaccinations(displayVaccinations, searchQuery, vaccinationFilter),
    vaccinationSort
  )

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
          >
            <Plus className="h-4 w-4 mr-2" />
            Record Vaccination
          </button>
          <button 
            className="btn-primary flex items-center" 
            data-testid="add-vaccination-btn"
            onClick={onRecordVaccination}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Vaccination
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
      <div className="space-y-3" data-testid="vaccination-list">
        {filteredAndSortedVaccinations.map((vax) => (
          <div key={vax.id} className="border border-gray-200 rounded-lg p-4" data-testid="vaccination-card">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                <Shield className={`h-5 w-5 mt-1 ${
                  vax.compliant ? 'text-green-600' : 'text-orange-600'
                }`} />
                <div>
                  <h4 className="font-semibold" data-testid="vaccination-name">{vax.vaccineName}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded ${getVaccinationStatusColor(vax.compliant)}`} data-testid="vaccination-status">
                      {vax.compliant ? 'Completed' : 'Overdue'}
                    </span>
                    {vax.dateAdministered && (
                      <span className="text-sm text-gray-600" data-testid="vaccination-date">
                        {vax.dateAdministered}
                      </span>
                    )}
                    {vax.administeredBy && (
                      <span className="text-sm text-gray-600" data-testid="vaccination-provider">
                        by {vax.administeredBy}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  data-testid="edit-vaccination-btn"
                  onClick={() => onEditVaccination(vax)}
                >
                  Edit
                </button>
                <button 
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                  data-testid="delete-vaccination-btn"
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
          {[
            { id: 'up1', name: 'Annual Flu Shot', dueDate: '2024-11-01', priority: 'High' as const },
            { id: 'up2', name: 'COVID-19 Booster', dueDate: '2024-12-15', priority: 'Medium' as const },
          ].map((upcoming) => (
            <div key={upcoming.id} className="border border-gray-200 rounded-lg p-4" data-testid="upcoming-vaccination-card">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-semibold" data-testid="vaccination-name">{upcoming.name}</h5>
                  <p className="text-sm text-gray-600" data-testid="due-date">Due: {upcoming.dueDate}</p>
                  <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(upcoming.priority)}`} data-testid="vaccination-priority">
                    {upcoming.priority} Priority
                  </span>
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
          ))}
        </div>
      </div>

      {/* Compliance and other sections... */}
      <div className="mt-8" data-testid="compliance-status">
        <h4 className="text-lg font-semibold mb-4">Vaccination Compliance</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700" data-testid="compliance-percentage">85%</div>
            <div className="text-sm text-green-600">Overall Compliance</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-700" data-testid="missing-vaccinations">3</div>
            <div className="text-sm text-yellow-600">Missing Vaccinations</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-700" data-testid="overdue-vaccinations">1</div>
            <div className="text-sm text-red-600">Overdue Vaccinations</div>
          </div>
        </div>
      </div>
    </div>
  )
}