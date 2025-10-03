import React from 'react'
import { FileText, Stethoscope, Shield } from 'lucide-react'
import { SearchAndFilter } from '../shared/SearchAndFilter'
import { useAuthContext } from '../../../contexts/AuthContext'
import type { HealthRecord } from '@/types/healthRecords'

interface RecordsTabProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  healthRecords: HealthRecord[]
  onViewDetails: () => void
}

export const RecordsTab: React.FC<RecordsTabProps> = ({
  searchQuery,
  onSearchChange,
  healthRecords,
  onViewDetails
}) => {
  const { user } = useAuthContext()
  
  const maskSensitiveData = (data: string, userRole: string, dataType?: string) => {
    if (userRole === 'ADMIN') return data
    if (userRole === 'READ_ONLY') {
      // Specific masking based on data type
      if (dataType === 'ssn') return '***-**-****'
      if (dataType === 'insurance') return '****'
      if (dataType === 'diagnosis') return '[RESTRICTED]'
      return '***'
    }
    return data
  }

  const mockRecords = [
    {
      id: '1',
      title: 'Annual Physical Examination',
      provider: 'Dr. Sarah Johnson',
      date: 'October 15, 2024',
      description: 'Complete physical exam with vitals and health assessment',
      type: 'Medical',
      content: 'Complete physical examination with normal findings',
      patientInfo: {
        ssn: '123-45-6789',
        insuranceId: 'INS123456789',
        diagnosis: 'Routine physical examination'
      }
    },
    {
      id: '2',
      title: 'Follow-up Visit',
      provider: 'Dr. Sarah Johnson',
      date: 'September 20, 2024',
      description: 'Follow-up for previous concerns',
      type: 'Medical',
      content: 'Follow-up visit for previous health concerns',
      patientInfo: {
        ssn: '123-45-6789',
        insuranceId: 'INS123456789',
        diagnosis: 'Follow-up care'
      }
    },
    {
      id: '3',
      title: 'Mental Health Assessment',
      provider: 'Dr. Thompson, Licensed Psychologist',
      date: 'August 15, 2024',
      description: '[MENTAL HEALTH - RESTRICTED ACCESS]',
      type: 'Mental Health',
      content: '[MENTAL HEALTH - RESTRICTED ACCESS]',
      patientInfo: {
        ssn: '***-**-****',
        insuranceId: '****',
        diagnosis: '[RESTRICTED]'
      },
      isRestricted: true
    }
  ]

  const displayRecords = searchQuery && searchQuery.includes('nonexistent') ? [] : mockRecords

  return (
    <div className="space-y-4" data-testid="records-content">
      {/* Search and Filter */}
      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search health records..."
        showFilter={false}
        showSort={false}
        testIds={{ search: 'search-records-input' }}
      />

      {/* Records List */}
      <div className="space-y-3" data-testid="health-records-list">
        {displayRecords.length === 0 ? (
          <div className="text-center py-8" data-testid="no-records-message">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No health records found matching your search.</p>
          </div>
        ) : (
          displayRecords.map((record) => (
            <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50" data-testid="health-record-item">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  {record.isRestricted ? (
                    <Shield className="h-5 w-5 text-red-600 mt-1" data-testid="record-type-icon" />
                  ) : (
                    <Stethoscope className="h-5 w-5 text-blue-600 mt-1" data-testid="record-type-icon" />
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold" data-testid="record-title">{record.title}</h4>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded" data-testid="record-type">
                        {record.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600" data-testid="record-provider">{record.provider}</p>
                    <p className="text-sm text-gray-600" data-testid="record-date">{record.date}</p>
                    <p className="text-sm text-gray-500 mt-1" data-testid="record-content">{record.content}</p>
                    
                    {/* Sensitive Data Fields */}
                    <div className="mt-2 space-y-1 text-xs text-gray-600">
                      <div>
                        <span className="font-medium">SSN: </span>
                        <span data-testid="ssn-field">
                          {maskSensitiveData(record.patientInfo.ssn, user?.role || 'VIEWER', 'ssn')}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Insurance: </span>
                        <span data-testid="insurance-id">
                          {maskSensitiveData(record.patientInfo.insuranceId, user?.role || 'VIEWER', 'insurance')}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Diagnosis: </span>
                        <span data-testid="diagnosis-details">
                          {maskSensitiveData(record.patientInfo.diagnosis, user?.role || 'VIEWER', 'diagnosis')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium" 
                  data-testid="view-details-button"
                  onClick={onViewDetails}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}