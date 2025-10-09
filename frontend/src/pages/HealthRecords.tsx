import React, { useState, useEffect } from 'react'
import { FileText, AlertTriangle, Activity, Shield, Settings, BarChart3 } from 'lucide-react'
import { useAuthContext } from '../contexts/AuthContext'

// Import types
import type {
  TabType,
  Allergy,
  ChronicCondition,
  Vaccination
} from '../types/healthRecords'

// Import custom hooks
import { useHealthRecordsData } from '../hooks/useHealthRecordsData'

// Import constants
import { HEALTH_TABS } from '../constants/healthRecords'

// Import student selector
import { StudentSelector } from '../components/StudentSelector'

// Import shared components
import { StatsCard } from '../components/healthRecords/shared/StatsCard'
import { TabNavigation } from '../components/healthRecords/shared/TabNavigation'

// Import tab components
import { OverviewTab } from '../components/healthRecords/tabs/OverviewTab'
import { RecordsTab } from '../components/healthRecords/tabs/RecordsTab'
import { AllergiesTab } from '../components/healthRecords/tabs/AllergiesTab'
import { ChronicConditionsTab } from '../components/healthRecords/tabs/ChronicConditionsTab'
import { VaccinationsTab } from '../components/healthRecords/tabs/VaccinationsTab'
import { GrowthChartsTab } from '../components/healthRecords/tabs/GrowthChartsTab'
import { ScreeningsTab } from '../components/healthRecords/tabs/ScreeningsTab'
import { AnalyticsTab } from '../components/healthRecords/tabs/AnalyticsTab'

// Import modal components
import { SessionExpiredModal } from '../components/modals/SessionExpiredModal'
import { SensitiveRecordWarning } from '../components/modals/SensitiveRecordWarning'
import { HealthRecordModal } from '../components/modals/HealthRecordModal'

const HealthRecords: React.FC = () => {
  const { user, expireSession } = useAuthContext()
  
  // Custom hooks
  const {
    healthRecords,
    allergies,
    chronicConditions,
    vaccinations,
    growthMeasurements,
    screenings,
    loading,
    loadTabData
  } = useHealthRecordsData()

  // State management
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [vaccinationFilter, setVaccinationFilter] = useState('all')
  const [vaccinationSort, setVaccinationSort] = useState('date')
  const [selectedStudent, setSelectedStudent] = useState<any>(null)

  // Modal state
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false)
  const [showSensitiveRecordWarning, setShowSensitiveRecordWarning] = useState(false)
  const [sensitiveRecordContext, setSensitiveRecordContext] = useState<any>(null)
  const [showHealthRecordModal, setShowHealthRecordModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState<any>(null)

  const handleSaveHealthRecord = (data: any) => {
    console.log('Saving health record:', data)
    // Here you would normally make an API call to save the record
    setShowHealthRecordModal(false)
    setEditingRecord(null)
  }

  const handleTabChange = async (tabId: TabType) => {
    setActiveTab(tabId)
    if (tabId !== 'overview') {
      try {
        await loadTabData(tabId, '1', searchQuery)
      } catch (error: any) {
        if (error?.response?.status === 401 || !localStorage.getItem('authToken')) {
          setShowSessionExpiredModal(true)
        }
      }
    }
  }

  // Check for session expiration on component mount
  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setShowSessionExpiredModal(true)
      }
    }

    // Listen for storage changes (token removal)
    window.addEventListener('storage', checkSession)
    
    // Check session on tab clicks
    const handleTabClick = () => {
      setTimeout(() => {
        if (!localStorage.getItem('authToken')) {
          setShowSessionExpiredModal(true)
        }
      }, 100)
    }

    document.addEventListener('click', handleTabClick)

    return () => {
      window.removeEventListener('storage', checkSession)
      document.removeEventListener('click', handleTabClick)
    }
  }, [])

  return (
    <div className="space-y-6" data-testid="health-records-page">
      {/* Screen reader announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {loading ? 'Loading health records...' : 'Health records loaded'}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-8" data-testid="loading-indicator">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading health records...</span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Records Management</h1>
          <p className="text-gray-600">Comprehensive electronic health records system</p>
        </div>
        <div className="flex space-x-2">
          {user?.role !== 'READ_ONLY' && (
            <button
              className="btn-primary flex items-center"
              data-testid="new-record-button"
              onClick={() => {
                setEditingRecord(null)
                setShowHealthRecordModal(true)
              }}
              aria-label="Create new health record"
            >
              <FileText className="h-4 w-4 mr-2" aria-hidden="true" />
              New Record
            </button>
          )}
          {user?.role !== 'READ_ONLY' && (
            <button
              className="btn-secondary flex items-center"
              data-testid="import-button"
              onClick={() => console.log('Import')}
              aria-label="Import health records"
            >
              Import
            </button>
          )}
          <button
            className="btn-secondary flex items-center"
            data-testid="export-button"
            onClick={() => console.log('Export')}
            aria-label="Export health records"
          >
            Export
          </button>
          {user?.role === 'ADMIN' && (
            <>
              <button
                className="btn-secondary flex items-center"
                data-testid="admin-settings-button"
                onClick={() => console.log('Settings')}
                aria-label="Admin settings"
              >
                <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
                Admin Settings
              </button>
              <button
                className="btn-secondary flex items-center"
                data-testid="reports-button"
                onClick={() => console.log('Reports')}
                aria-label="View reports"
              >
                <BarChart3 className="h-4 w-4 mr-2" aria-hidden="true" />
                Reports
              </button>
            </>
          )}
        </div>
      </div>

      {/* Student Selector */}
      <div className="mb-6">
        <StudentSelector
          selectedStudentId={selectedStudent?.id || ''}
          onStudentSelect={(student) => setSelectedStudent(student)}
        />
      </div>

      {/* Overview Cards - Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center mb-4">
            <FileText className="h-8 w-8 text-blue-600 mr-3" aria-label="Electronic health records icon" />
            <h3 className="text-lg font-semibold text-gray-900">Electronic Health Records</h3>
          </div>
          <p className="text-gray-600 text-sm">Digital medical examination records and comprehensive health documentation system.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center mb-4">
            <Shield className="h-8 w-8 text-green-600 mr-3" aria-label="Vaccination tracking icon" />
            <h3 className="text-lg font-semibold text-gray-900">Vaccination Tracking</h3>
          </div>
          <p className="text-gray-600 text-sm">Compliance monitoring and vaccination schedule management for all students.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600 mr-3" aria-label="Allergy management icon" />
            <h3 className="text-lg font-semibold text-gray-900">Allergy Management</h3>
          </div>
          <p className="text-gray-600 text-sm">Comprehensive allergy management system with emergency response protocols.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center mb-4">
            <Activity className="h-8 w-8 text-orange-600 mr-3" aria-label="Chronic condition monitoring icon" />
            <h3 className="text-lg font-semibold text-gray-900">Chronic Condition Monitoring</h3>
          </div>
          <p className="text-gray-600 text-sm">Care plans and ongoing monitoring for students with chronic health conditions.</p>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard title="Total Records" value="247" trend="+12 this month" icon={FileText} iconColor="text-blue-600" />
        <StatsCard title="Active Allergies" value="18" trend="2 new" icon={AlertTriangle} iconColor="text-red-600" />
        <StatsCard title="Chronic Conditions" value="31" trend="Stable" icon={Activity} iconColor="text-orange-600" />
        <StatsCard title="Vaccinations Due" value="8" trend="Next 30 days" icon={Shield} iconColor="text-green-600" />
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6" data-testid="privacy-notice">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" aria-label="Security icon" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900">Protected Health Information</h3>
            <p className="text-sm text-blue-800 mt-1">
              This system contains protected health information (PHI) subject to HIPAA regulations.
              Access is restricted to authorized personnel only. All activities are logged and monitored.
            </p>
            <div className="flex items-center space-x-4 mt-3">
              <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
                Session: {user?.email}
              </span>
              <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
                Role: {user?.role}
              </span>
              <div className="flex items-center text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded" data-testid="hipaa-compliance-badge">
                <Shield className="h-3 w-3 mr-1" aria-label="HIPAA compliance icon" />
                HIPAA Compliant
              </div>
            </div>
            <div className="mt-3">
              <label className="flex items-center text-xs text-blue-800">
                <input 
                  type="checkbox" 
                  className="rounded border-blue-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mr-2" 
                  defaultChecked
                  data-testid="data-use-agreement"
                />
                I acknowledge that I will only access health information for legitimate medical purposes and in accordance with HIPAA regulations.
              </label>
            </div>
            {user?.role === 'ADMIN' && (
              <div className="mt-3">
                <button
                  className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded hover:bg-blue-200"
                  data-testid="view-sensitive-data"
                  onClick={() => setShowSensitiveRecordWarning(true)}
                >
                  View Sensitive PHI Data
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              className="btn-primary flex items-center justify-center py-3"
              onClick={() => {
                setEditingRecord(null)
                setShowHealthRecordModal(true)
              }}
              aria-label="Add new health record"
            >
              <FileText className="h-5 w-5 mr-2" aria-hidden="true" />
              Add New Record
            </button>
            <button
              className="btn-secondary flex items-center justify-center py-3"
              onClick={() => {
                handleTabChange('records')
              }}
              aria-label="View health records"
            >
              <FileText className="h-5 w-5 mr-2" aria-hidden="true" />
              View Records
            </button>
            <button
              className="btn-secondary flex items-center justify-center py-3"
              onClick={() => {
                handleTabChange('vaccinations')
              }}
              aria-label="View vaccination schedule"
            >
              <Shield className="h-5 w-5 mr-2" aria-hidden="true" />
              Vaccination Schedule
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow">
        <TabNavigation
          tabs={[
            ...HEALTH_TABS,
            ...(user?.role === 'ADMIN' ? [{ id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 }] : [])
          ]}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onTabLoad={(tab) => loadTabData(tab, '1', searchQuery)}
        />

        <div className="p-6">
          {/* Search and Filter Section */}
          {(activeTab === 'records' || activeTab === 'overview') && (
            <div className="mb-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search health records by student name..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    data-testid="health-records-search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <select 
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    data-testid="record-type-filter"
                  >
                    <option value="">All Record Types</option>
                    <option value="EXAMINATION">EXAMINATION</option>
                    <option value="VACCINATION">Vaccination</option>
                    <option value="ALLERGY">Allergy</option>
                    <option value="MEDICATION">Medication</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <input
                    type="date"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    data-testid="date-from"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <input
                    type="date"
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    data-testid="date-to"
                  />
                </div>
                <div className="flex items-end">
                  <button 
                    className="btn-primary px-6 py-2"
                    data-testid="apply-date-filter"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'overview' && (
            <OverviewTab onShowEditAllergyModal={() => console.log('Edit allergy')} />
          )}
          {activeTab === 'records' && (
            <RecordsTab
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              healthRecords={healthRecords}
              onViewDetails={() => console.log('View details')}
            />
          )}
          {activeTab === 'allergies' && (
            <AllergiesTab
              allergies={allergies}
              onAddAllergy={() => console.log('Add allergy')}
              onEditAllergy={(allergy) => console.log('Edit allergy:', allergy)}
              user={user}
            />
          )}
          {activeTab === 'chronic' && (
            <ChronicConditionsTab
              conditions={chronicConditions}
              onAddCondition={() => console.log('Add condition')}
              onViewCarePlan={(condition) => console.log('View care plan:', condition)}
              user={user}
            />
          )}
          {activeTab === 'vaccinations' && (
            <VaccinationsTab
              vaccinations={vaccinations}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              vaccinationFilter={vaccinationFilter}
              onFilterChange={setVaccinationFilter}
              vaccinationSort={vaccinationSort}
              onSortChange={setVaccinationSort}
              onRecordVaccination={() => console.log('Record vaccination')}
              onEditVaccination={(vaccination) => console.log('Edit vaccination:', vaccination)}
              onDeleteVaccination={(vaccination) => console.log('Delete vaccination:', vaccination)}
              onScheduleVaccination={() => console.log('Schedule vaccination')}
              user={user}
            />
          )}
          {activeTab === 'growth' && (
            <GrowthChartsTab
              measurements={growthMeasurements}
              onAddMeasurement={() => console.log('Add measurement')}
              user={user}
            />
          )}
          {activeTab === 'screenings' && (
            <ScreeningsTab
              screenings={screenings}
              onRecordScreening={() => console.log('Record screening')}
              user={user}
            />
          )}
          {activeTab === 'analytics' && user?.role === 'ADMIN' && (
            <AnalyticsTab />
          )}
        </div>
      </div>

      {/* Session Expired Modal */}
      <SessionExpiredModal
        isOpen={showSessionExpiredModal}
        onLoginAgain={() => {
          setShowSessionExpiredModal(false)
          expireSession()
          window.location.href = '/login'
        }}
        onClose={() => setShowSessionExpiredModal(false)}
      />

      {/* Sensitive Record Warning */}
      <SensitiveRecordWarning
        isOpen={showSensitiveRecordWarning}
        onConfirm={() => {
          setShowSensitiveRecordWarning(false)
          // Load the sensitive record
          if (sensitiveRecordContext?.callback) {
            sensitiveRecordContext.callback()
          }
        }}
        onCancel={() => {
          setShowSensitiveRecordWarning(false)
          setSensitiveRecordContext(null)
        }}
        studentName={sensitiveRecordContext?.studentName}
        recordType={sensitiveRecordContext?.recordType}
      />

      {/* Health Record Modal */}
      <HealthRecordModal
        isOpen={showHealthRecordModal}
        onClose={() => {
          setShowHealthRecordModal(false)
          setEditingRecord(null)
        }}
        onSave={handleSaveHealthRecord}
        initialData={editingRecord}
      />
    </div>
  )
}

export default HealthRecords
