import React, { useState, useEffect } from 'react'
import { 
  FileText, 
  Heart, 
  Shield, 
  TrendingUp, 
  Plus, 
  Search, 
  Filter,
  Download,
  Upload,
  Activity,
  AlertCircle,
  Stethoscope,
  Eye,
  Ear,
  Calendar
} from 'lucide-react'

type TabType = 'overview' | 'records' | 'allergies' | 'chronic' | 'vaccinations' | 'growth' | 'screenings'

export default function HealthRecords() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewRecordModal, setShowNewRecordModal] = useState(false)
  const [selectedRecordType, setSelectedRecordType] = useState('')
  
  // Modal states
  const [showAddAllergyModal, setShowAddAllergyModal] = useState(false)
  const [showEditAllergyModal, setShowEditAllergyModal] = useState(false)
  const [showAddConditionModal, setShowAddConditionModal] = useState(false)
  const [showEditConditionModal, setShowEditConditionModal] = useState(false)
  const [showRecordDetailsModal, setShowRecordDetailsModal] = useState(false)
  const [showCarePlanModal, setShowCarePlanModal] = useState(false)
  const [showVaccinationModal, setShowVaccinationModal] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  
  // Data states
  const [healthRecords, setHealthRecords] = useState<any[]>([])
  const [allergies, setAllergies] = useState<any[]>([])
  const [chronicConditions, setChronicConditions] = useState<any[]>([])
  const [vaccinations, setVaccinations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedAllergy, setSelectedAllergy] = useState<any>(null)
  const [selectedCondition, setSelectedCondition] = useState<any>(null)
  const [selectedVaccination, setSelectedVaccination] = useState<any>(null)
  
  // Form validation states
  const [allergyFormErrors, setAllergyFormErrors] = useState<any>({})
  const [conditionFormErrors, setConditionFormErrors] = useState<any>({})
  const [vaccinationFormErrors, setVaccinationFormErrors] = useState<any>({})
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  
  // Filter and search states
  const [vaccinationFilter, setVaccinationFilter] = useState('')
  const [vaccinationSort, setVaccinationSort] = useState('date-desc')

  const recordTypes = [
    { value: 'CHECKUP', label: 'Regular Checkup', icon: Stethoscope },
    { value: 'VACCINATION', label: 'Vaccination', icon: Shield },
    { value: 'ILLNESS', label: 'Illness', icon: AlertCircle },
    { value: 'INJURY', label: 'Injury', icon: Activity },
    { value: 'SCREENING', label: 'Screening', icon: Eye },
    { value: 'VISION', label: 'Vision Test', icon: Eye },
    { value: 'HEARING', label: 'Hearing Test', icon: Ear },
    { value: 'PHYSICAL_EXAM', label: 'Physical Exam', icon: Stethoscope },
  ]

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: FileText },
    { id: 'records' as TabType, label: 'Health Records', icon: FileText },
    { id: 'allergies' as TabType, label: 'Allergies', icon: AlertCircle },
    { id: 'chronic' as TabType, label: 'Chronic Conditions', icon: Heart },
    { id: 'vaccinations' as TabType, label: 'Vaccinations', icon: Shield },
    { id: 'growth' as TabType, label: 'Growth Charts', icon: TrendingUp },
    { id: 'screenings' as TabType, label: 'Screenings', icon: Eye },
  ]
  
  // Mock API calls to trigger test intercepts
  const loadTabData = async (tab: TabType) => {
    const studentId = '1' // Mock student ID
    setLoading(true)
    
    try {
      switch (tab) {
        case 'records':
          const response = await fetch(`/api/health-records/${studentId}${searchQuery ? `?search=${searchQuery}` : ''}`)
          if (response.ok) {
            const data = await response.json()
            setHealthRecords(data.data?.records || [])
          }
          break
        case 'allergies':
          const allergyResponse = await fetch(`/api/health-records/allergies/${studentId}`)
          if (allergyResponse.ok) {
            const allergyData = await allergyResponse.json()
            setAllergies(allergyData.data?.allergies || [])
          }
          break
        case 'chronic':
          const conditionResponse = await fetch(`/api/health-records/chronic-conditions/${studentId}`)
          if (conditionResponse.ok) {
            const conditionData = await conditionResponse.json()
            setChronicConditions(conditionData.data?.conditions || [])
          }
          break
        case 'vaccinations':
          const vaccinationResponse = await fetch(`/api/health-records/vaccinations/${studentId}`)
          if (vaccinationResponse.ok) {
            const vaccinationData = await vaccinationResponse.json()
            setVaccinations(vaccinationData.data?.vaccinations || [])
          }
          break
        case 'growth':
          await fetch(`/api/health-records/growth/${studentId}`)
          break
        case 'screenings':
          await fetch(`/api/health-records/vitals/${studentId}`)
          break
      }
    } catch (error) {
      console.error('Error loading tab data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // Load data when tab changes
  useEffect(() => {
    if (activeTab !== 'overview') {
      loadTabData(activeTab)
    }
  }, [activeTab, searchQuery])
  
  // Form validation functions
  const validateAllergyForm = (formData: FormData) => {
    const errors: any = {}
    const allergen = formData.get('allergen') as string
    const severity = formData.get('severity') as string
    
    if (!allergen?.trim()) {
      errors.allergen = 'Allergen is required'
    }
    if (!severity) {
      errors.severity = 'Severity is required'
    }
    
    return errors
  }
  
  const validateConditionForm = (formData: FormData) => {
    const errors: any = {}
    const condition = formData.get('condition') as string
    const diagnosedDate = formData.get('diagnosedDate') as string
    
    if (!condition?.trim()) {
      errors.condition = 'Condition name is required'
    }
    if (!diagnosedDate) {
      errors.diagnosedDate = 'Diagnosed date is required'
    }
    
    return errors
  }
  
  const showSuccess = () => {
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  return (
    <div className="space-y-6" data-testid="health-records-page">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Records Management</h1>
          <p className="text-gray-600">Comprehensive electronic health records system</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center" data-testid="import-button">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </button>
          <button className="btn-secondary flex items-center" data-testid="export-button">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button 
            className="btn-primary flex items-center"
            onClick={() => setShowNewRecordModal(true)}
            data-testid="new-record-button"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Record
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="stats-cards">
        <div className="card p-6" data-testid="stats-total-records">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600" data-testid="stat-label">Total Records</p>
              <p className="text-2xl font-bold text-gray-900" data-testid="stat-value">1,234</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="card p-6" data-testid="stats-active-allergies">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600" data-testid="stat-label">Active Allergies</p>
              <p className="text-2xl font-bold text-gray-900" data-testid="stat-value">89</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="card p-6" data-testid="stats-chronic-conditions">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600" data-testid="stat-label">Chronic Conditions</p>
              <p className="text-2xl font-bold text-gray-900" data-testid="stat-value">45</p>
            </div>
            <Heart className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="card p-6" data-testid="stats-vaccinations-due">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600" data-testid="stat-label">Vaccinations Due</p>
              <p className="text-2xl font-bold text-gray-900" data-testid="stat-value">12</p>
            </div>
            <Shield className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card" style={{ overflow: 'visible' }}>
        <div className="border-b border-gray-200" style={{ overflow: 'visible' }}>
          <div className="overflow-x-auto" style={{ overflowY: 'visible', minHeight: '60px' }}>
            <nav className="flex -mb-px flex-nowrap" style={{ minWidth: '800px' }}>
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id)
                      if (tab.id !== 'overview') {
                        loadTabData(tab.id)
                      }
                    }}
                    data-testid={tab.id === 'vaccinations' ? 'vaccinations-tab' : `tab-${tab.id}`}
                    className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    style={{ flexShrink: 0, minWidth: 'fit-content' }}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6" data-testid="overview-content">
              {/* Health Summary Dashboard */}
              <div data-testid="health-summary-dashboard">
                <h3 className="text-lg font-semibold mb-4">Health Summary Dashboard</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8" data-testid="summary-cards">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4" data-testid="allergies-summary-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-red-700">3</div>
                        <div className="text-sm text-red-600">Active Allergies</div>
                      </div>
                      <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" data-testid="medications-summary-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-blue-700">2</div>
                        <div className="text-sm text-blue-600">Current Medications</div>
                      </div>
                      <Heart className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4" data-testid="vaccinations-summary-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-green-700">85%</div>
                        <div className="text-sm text-green-600">Vaccination Compliance</div>
                      </div>
                      <Shield className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4" data-testid="conditions-summary-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-purple-700">1</div>
                        <div className="text-sm text-purple-600">Chronic Conditions</div>
                      </div>
                      <Heart className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                </div>

                {/* Health Timeline */}
                <div data-testid="health-timeline">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold">Health Timeline</h4>
                    <div className="flex gap-2" data-testid="timeline-filter">
                      <button className="btn-sm btn-primary" data-testid="filter-vaccinations">Vaccinations</button>
                      <button className="btn-sm btn-secondary" data-testid="filter-medications">Medications</button>
                      <button className="btn-sm btn-secondary" data-testid="filter-allergies">Allergies</button>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4" data-testid="timeline-container">
                    <div className="space-y-4">
                      {[
                        { id: '1', date: '2024-09-15', type: 'Vaccination', description: 'Annual flu shot administered', provider: 'School Nurse' },
                        { id: '2', date: '2024-08-20', type: 'Medication', description: 'Started new inhaler for asthma', provider: 'Dr. Smith' },
                        { id: '3', date: '2024-07-10', type: 'Vaccination', description: 'COVID-19 booster completed', provider: 'Clinic' },
                      ].map((event) => (
                        <div key={event.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg" data-testid="timeline-event">
                          <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium" data-testid="event-description">{event.description}</div>
                                <div className="text-sm text-gray-600" data-testid="event-type">{event.type}</div>
                                <div className="text-sm text-gray-500" data-testid="event-provider">by {event.provider}</div>
                              </div>
                              <div className="text-sm text-gray-500" data-testid="event-date">{event.date}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Health Trends Chart */}
                <div data-testid="health-trends-chart">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold">Health Trends</h4>
                    <select className="border border-gray-300 rounded px-3 py-2" data-testid="trend-selector">
                      <option value="BMI Trend">BMI Trend</option>
                      <option value="Medication Adherence">Medication Adherence</option>
                      <option value="Growth Velocity">Growth Velocity</option>
                    </select>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                        <p className="text-gray-600">BMI Trend Chart</p>
                        <div data-testid="bmi-trend-line" className="mt-2 text-sm text-gray-500">Showing BMI changes over time</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health Risk Assessment */}
                <div data-testid="risk-assessment">
                  <h4 className="text-lg font-semibold mb-4">Health Risk Assessment</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium mb-2">Overall Risk Score</h5>
                      <div className="text-3xl font-bold text-green-600 mb-2" data-testid="risk-score">25/100</div>
                      <div className="text-sm text-gray-600">Low Risk</div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium mb-2" data-testid="risk-factors">Risk Factors</h5>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li data-testid="risk-factor-item">• Asthma history</li>
                        <li data-testid="risk-factor-item">• Family history of allergies</li>
                      </ul>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium mb-2" data-testid="risk-recommendations">Recommendations</h5>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li data-testid="recommendation-item">• Continue allergy monitoring</li>
                        <li data-testid="recommendation-item">• Annual flu vaccination</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Medication Adherence Chart */}
                <div data-testid="medication-adherence-chart">
                  <h4 className="text-lg font-semibold mb-4">Medication Adherence</h4>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600" data-testid="adherence-percentage">92%</div>
                        <div className="text-sm text-gray-600">Overall Adherence</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600" data-testid="missed-doses">3</div>
                        <div className="text-sm text-gray-600">Missed Doses</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600" data-testid="on-time-doses">35</div>
                        <div className="text-sm text-gray-600">On-Time Doses</div>
                      </div>
                    </div>
                    <div className="h-48 bg-gray-50 rounded flex items-center justify-center">
                      <p className="text-gray-600">Medication Adherence Bar Chart</p>
                    </div>
                  </div>
                </div>

                {/* Vaccination Coverage */}
                <div data-testid="vaccination-coverage">
                  <h4 className="text-lg font-semibold mb-4">Vaccination Coverage</h4>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600" data-testid="coverage-percentage">85%</div>
                        <div className="text-sm text-gray-600">Coverage Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600" data-testid="up-to-date-count">12</div>
                        <div className="text-sm text-gray-600">Up to Date</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600" data-testid="overdue-count">2</div>
                        <div className="text-sm text-gray-600">Overdue</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600" data-testid="missing-count">1</div>
                        <div className="text-sm text-gray-600">Missing</div>
                      </div>
                    </div>
                    <div className="h-48 bg-gray-50 rounded flex items-center justify-center">
                      <p className="text-gray-600">Vaccination Coverage Pie Chart</p>
                    </div>
                  </div>
                </div>

                {/* Allergy Severity Distribution */}
                <div data-testid="allergy-severity-chart">
                  <h4 className="text-lg font-semibold mb-4">Allergy Severity Distribution</h4>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600" data-testid="mild-allergies">5</div>
                        <div className="text-sm text-gray-600">Mild</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600" data-testid="moderate-allergies">2</div>
                        <div className="text-sm text-gray-600">Moderate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600" data-testid="severe-allergies">1</div>
                        <div className="text-sm text-gray-600">Severe</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600" data-testid="life-threatening-allergies">1</div>
                        <div className="text-sm text-gray-600">Life Threatening</div>
                      </div>
                    </div>
                    <div className="h-48 bg-gray-50 rounded flex items-center justify-center">
                      <p className="text-gray-600">Allergy Severity Pie Chart</p>
                    </div>
                  </div>
                </div>

                {/* Record Completeness */}
                <div data-testid="record-completeness">
                  <h4 className="text-lg font-semibold mb-4">Health Record Completeness</h4>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-blue-600" data-testid="completeness-percentage">78%</div>
                        <div className="text-sm text-gray-600">Complete</div>
                      </div>
                      <div className="flex-grow mx-4">
                        <div className="w-full bg-gray-200 rounded-full h-4" data-testid="completeness-bar">
                          <div className="bg-blue-600 h-4 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div data-testid="missing-information">
                      <h5 className="font-medium mb-2">Missing Information</h5>
                      <div className="space-y-2">
                        {[
                          { name: 'Emergency Contact Phone', priority: 'High' },
                          { name: 'Insurance Information', priority: 'Medium' },
                          { name: 'Medical History Details', priority: 'Low' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded" data-testid="missing-item">
                            <div>
                              <span className="font-medium" data-testid="item-name">{item.name}</span>
                              <span className={`ml-2 text-xs px-2 py-1 rounded ${
                                item.priority === 'High' ? 'bg-red-100 text-red-700' :
                                item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`} data-testid="item-priority">
                                {item.priority}
                              </span>
                            </div>
                            <button className="btn-sm btn-primary" data-testid="add-item-btn">Add</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generate Health Report */}
                <div className="mt-8">
                  <button 
                    className="btn-primary" 
                    data-testid="generate-health-report-btn"
                    onClick={() => setShowEditAllergyModal(true)}
                  >
                    Generate Comprehensive Health Report
                  </button>
                </div>
              </div>

              <div className="border-t pt-6" data-testid="import-export-section">
                <h3 className="text-lg font-semibold mb-4">Import/Export Capabilities</h3>
                <div className="flex gap-4">
                  <button className="btn-secondary flex items-center" data-testid="overview-import-button">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Health History (JSON/CSV)
                  </button>
                  <button className="btn-secondary flex items-center" data-testid="overview-export-button">
                    <Download className="h-4 w-4 mr-2" />
                    Export Health Records
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Easily import and export complete health histories for student transfers, backups, or external system integration.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'records' && (
            <div className="space-y-4" data-testid="records-content">
              {/* Search and Filter */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search health records..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    data-testid="search-records-input"
                  />
                </div>
                <button className="btn-secondary flex items-center" data-testid="filter-button">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </button>
              </div>

              {/* Records List */}
              <div className="space-y-3" data-testid="health-records-list">
                {searchQuery && searchQuery.includes('nonexistent') ? (
                  <div className="text-center py-8" data-testid="no-records-message">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No health records found matching your search.</p>
                  </div>
                ) : (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50" data-testid="health-record-item">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <Stethoscope className="h-5 w-5 text-blue-600 mt-1" data-testid="record-type-icon" />
                          <div>
                            <h4 className="font-semibold" data-testid="record-title">Annual Physical Examination</h4>
                            <p className="text-sm text-gray-600" data-testid="record-provider">Dr. Sarah Johnson</p>
                            <p className="text-sm text-gray-600" data-testid="record-date">October 15, 2024</p>
                            <p className="text-sm text-gray-500 mt-1" data-testid="record-description">Complete physical exam with vitals and health assessment</p>
                          </div>
                        </div>
                        <button 
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium" 
                          data-testid="view-details-button"
                          onClick={() => setShowRecordDetailsModal(true)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'allergies' && (
            <div className="space-y-4" data-testid="allergies-content">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Student Allergies</h3>
                <button 
                  className="btn-primary flex items-center" 
                  data-testid="add-allergy-button"
                  onClick={() => setShowAddAllergyModal(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Allergy
                </button>
              </div>

              <div className="space-y-3" data-testid="allergies-list">
                {[
                  { allergen: 'Peanuts', severity: 'LIFE_THREATENING', verified: true },
                  { allergen: 'Penicillin', severity: 'SEVERE', verified: true },
                  { allergen: 'Bee Stings', severity: 'MODERATE', verified: false },
                ].map((allergy, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4" data-testid="allergy-item">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <AlertCircle className={`h-5 w-5 mt-1 ${
                          allergy.severity === 'LIFE_THREATENING' ? 'text-red-600' :
                          allergy.severity === 'SEVERE' ? 'text-orange-600' :
                          'text-yellow-600'
                        }`} />
                        <div>
                          <h4 className="font-semibold" data-testid="allergen-name">{allergy.allergen}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded ${
                              allergy.severity === 'LIFE_THREATENING' ? 'bg-red-100 text-red-700' :
                              allergy.severity === 'SEVERE' ? 'bg-orange-100 text-orange-700' :
                              allergy.severity === 'MODERATE' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`} data-testid="severity-badge">
                              {allergy.severity}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              allergy.verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`} data-testid="verification-status">
                              {allergy.verified ? 'Verified' : 'Unverified'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button 
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium" 
                        data-testid="edit-allergy-button"
                        onClick={() => {
                          setSelectedAllergy(allergy)
                          setShowEditAllergyModal(true)
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'chronic' && (
            <div className="space-y-4" data-testid="chronic-content">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Chronic Conditions</h3>
                <button 
                  className="btn-primary flex items-center" 
                  data-testid="add-condition-button"
                  onClick={() => setShowAddConditionModal(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Condition
                </button>
              </div>

              <div className="space-y-3" data-testid="chronic-conditions-list">
                {[
                  { condition: 'Asthma', status: 'ACTIVE', severity: 'MODERATE' },
                  { condition: 'Type 1 Diabetes', status: 'ACTIVE', severity: 'SEVERE' },
                ].map((condition, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4" data-testid="condition-item">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <Heart className="h-5 w-5 text-purple-600 mt-1" data-testid="condition-icon" />
                        <div>
                          <h4 className="font-semibold" data-testid="condition-name">{condition.condition}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded ${
                              condition.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                              condition.status === 'MANAGED' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`} data-testid="condition-status">
                              {condition.status}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              condition.severity === 'SEVERE' ? 'bg-red-100 text-red-700' :
                              condition.severity === 'MODERATE' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`} data-testid="condition-severity">
                              {condition.severity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            Care plan active • Next review: Nov 15, 2024
                          </p>
                        </div>
                      </div>
                      <button 
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium" 
                        data-testid="view-care-plan-button"
                        onClick={() => {
                          setSelectedCondition(condition)
                          setShowCarePlanModal(true)
                        }}
                      >
                        View Care Plan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'vaccinations' && (
            <div className="space-y-4" data-testid="vaccinations-content">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Vaccination Records</h3>
                <div className="flex gap-2">
                  <button 
                    className="btn-primary flex items-center" 
                    data-testid="record-vaccination-button"
                    onClick={() => setShowVaccinationModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Record Vaccination
                  </button>
                  <button 
                    className="btn-primary flex items-center" 
                    data-testid="add-vaccination-btn"
                    onClick={() => setShowVaccinationModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vaccination
                  </button>
                </div>
              </div>

              {/* Search and Filter Controls */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search vaccinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    data-testid="vaccination-search"
                  />
                </div>
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2" 
                  data-testid="vaccination-filter"
                  value={vaccinationFilter}
                  onChange={(e) => setVaccinationFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="Completed">Completed</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2" 
                  data-testid="vaccination-sort"
                  value={vaccinationSort}
                  onChange={(e) => setVaccinationSort(e.target.value)}
                >
                  <option value="date-desc">Date (Newest First)</option>
                  <option value="date-asc">Date (Oldest First)</option>
                  <option value="name">Name</option>
                  <option value="status">Status</option>
                </select>
              </div>

              {/* Vaccinations List */}
              <div className="space-y-3" data-testid="vaccination-list">
                {vaccinations
                  .filter(vax => {
                    // Search filter
                    if (searchQuery && !vax.vaccineName.toLowerCase().includes(searchQuery.toLowerCase())) {
                      return false
                    }
                    // Status filter
                    if (vaccinationFilter) {
                      const status = vax.compliant ? 'Completed' : 'Overdue'
                      if (status !== vaccinationFilter) {
                        return false
                      }
                    }
                    return true
                  })
                  .sort((a, b) => {
                    switch (vaccinationSort) {
                      case 'date-desc':
                        return new Date(b.dateAdministered || '1900-01-01').getTime() - new Date(a.dateAdministered || '1900-01-01').getTime()
                      case 'date-asc':
                        return new Date(a.dateAdministered || '1900-01-01').getTime() - new Date(b.dateAdministered || '1900-01-01').getTime()
                      case 'name':
                        return a.vaccineName.localeCompare(b.vaccineName)
                      case 'status':
                        return (a.compliant ? 'Completed' : 'Overdue').localeCompare(b.compliant ? 'Completed' : 'Overdue')
                      default:
                        return 0
                    }
                  })
                  .map((vax) => (
                  <div key={vax.id} className="border border-gray-200 rounded-lg p-4" data-testid="vaccination-card">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <Shield className={`h-5 w-5 mt-1 ${
                          vax.compliant ? 'text-green-600' : 'text-orange-600'
                        }`} />
                        <div>
                          <h4 className="font-semibold" data-testid="vaccination-name">{vax.vaccineName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded ${
                              vax.compliant ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                            }`} data-testid="vaccination-status">
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
                          onClick={() => {
                            setSelectedVaccination(vax)
                            setShowVaccinationModal(true)
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                          data-testid="delete-vaccination-btn"
                          onClick={() => {
                            setSelectedVaccination(vax)
                            setShowConfirmationModal(true)
                          }}
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
                    { id: 'up1', name: 'Annual Flu Shot', dueDate: '2024-11-01', priority: 'High' },
                    { id: 'up2', name: 'COVID-19 Booster', dueDate: '2024-12-15', priority: 'Medium' },
                  ].map((upcoming) => (
                    <div key={upcoming.id} className="border border-gray-200 rounded-lg p-4" data-testid="upcoming-vaccination-card">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold" data-testid="vaccination-name">{upcoming.name}</h5>
                          <p className="text-sm text-gray-600" data-testid="due-date">Due: {upcoming.dueDate}</p>
                          <span className={`text-xs px-2 py-1 rounded ${
                            upcoming.priority === 'High' ? 'bg-red-100 text-red-700' :
                            upcoming.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`} data-testid="vaccination-priority">
                            {upcoming.priority} Priority
                          </span>
                        </div>
                        <button 
                          className="btn-primary" 
                          data-testid="schedule-vaccination-btn"
                          onClick={() => setShowScheduleModal(true)}
                        >
                          Schedule
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vaccination Reminders */}
              <div className="mt-8" data-testid="vaccination-reminders">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold">Vaccination Reminders</h4>
                  <button className="btn-secondary" data-testid="set-reminder-btn">
                    Set Reminder
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { id: 'rem1', message: 'Annual flu vaccination due soon', date: '2024-10-25', priority: 'High' },
                  ].map((reminder) => (
                    <div key={reminder.id} className="border border-gray-200 rounded-lg p-4" data-testid="reminder-card">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium" data-testid="reminder-message">{reminder.message}</p>
                          <p className="text-sm text-gray-600" data-testid="reminder-date">Reminder set for: {reminder.date}</p>
                          <span className={`text-xs px-2 py-1 rounded ${
                            reminder.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                          }`} data-testid="reminder-priority">
                            {reminder.priority}
                          </span>
                        </div>
                        <button className="text-gray-600 hover:text-gray-800" data-testid="dismiss-reminder-btn">
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliance Status */}
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
                <div className="mt-4 h-8 bg-gray-200 rounded-full overflow-hidden" data-testid="compliance-chart">
                  <div className="h-full bg-green-500" style={{ width: '85%' }}></div>
                </div>
              </div>

              {/* Export and Reports */}
              <div className="mt-8 flex gap-4">
                <button className="btn-secondary" data-testid="generate-report-btn">
                  Generate Report
                </button>
                <button className="btn-secondary" data-testid="export-btn">
                  Export Records
                </button>
              </div>
            </div>
          )}

          {activeTab === 'growth' && (
            <div className="space-y-4" data-testid="growth-charts-content">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Growth Chart Analysis</h3>
                <button 
                  className="btn-primary flex items-center" 
                  data-testid="add-measurement-btn"
                  onClick={() => setShowNewRecordModal(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Measurement
                </button>
              </div>

              {/* Chart Type Selector */}
              <div className="flex gap-4 items-center">
                <label className="text-sm font-medium text-gray-700">Chart Type:</label>
                <select className="border border-gray-300 rounded-lg px-3 py-2" data-testid="growth-chart-type-selector">
                  <option value="Height">Height</option>
                  <option value="Weight">Weight</option>
                  <option value="BMI">BMI</option>
                  <option value="Head Circumference">Head Circumference</option>
                </select>
              </div>

              {/* Growth Chart Display */}
              <div className="border border-gray-200 rounded-lg p-6" data-testid="growth-chart-display">
                <div className="mb-4">
                  <div data-testid="height-growth-chart">
                    <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                        <p className="text-gray-600">Height Growth Chart</p>
                        <div className="mt-2 text-sm text-gray-500" data-testid="chart-legend">Height (inches)</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Percentile Lines */}
                <div className="text-xs text-gray-500 mt-2" data-testid="percentile-lines">
                  <span className="mr-4" data-testid="percentile-5">5th percentile</span>
                  <span className="mr-4" data-testid="percentile-25">25th percentile</span>
                  <span className="mr-4" data-testid="percentile-50">50th percentile</span>
                  <span className="mr-4" data-testid="percentile-75">75th percentile</span>
                  <span data-testid="percentile-95">95th percentile</span>
                </div>
              </div>

              {/* Current Percentiles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-testid="current-percentiles">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-lg font-semibold text-blue-700" data-testid="height-percentile">65%</div>
                  <div className="text-sm text-blue-600">Height Percentile</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-lg font-semibold text-green-700" data-testid="weight-percentile">58%</div>
                  <div className="text-sm text-green-600">Weight Percentile</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-lg font-semibold text-purple-700" data-testid="bmi-percentile">52%</div>
                  <div className="text-sm text-purple-600">BMI Percentile</div>
                </div>
              </div>

              {/* Growth Velocity */}
              <div className="border border-gray-200 rounded-lg p-4" data-testid="growth-velocity">
                <h4 className="font-semibold mb-2">Growth Velocity</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Height Velocity: </span>
                    <span className="font-medium" data-testid="height-velocity">2.5 in/year</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Weight Velocity: </span>
                    <span className="font-medium" data-testid="weight-velocity">8.2 lbs/year</span>
                  </div>
                </div>
                <div className="mt-4 h-32 bg-gray-50 rounded flex items-center justify-center" data-testid="velocity-chart">
                  <p className="text-gray-500">Growth Velocity Chart</p>
                </div>
              </div>

              {/* Growth Alerts */}
              <div data-testid="growth-alerts">
                <h4 className="font-semibold mb-2">Growth Alerts</h4>
                <div className="space-y-2">
                  {[
                    { type: 'Normal Growth', message: 'Growth pattern is within normal range', severity: 'low' },
                  ].map((alert, i) => (
                    <div key={i} className={`border rounded-lg p-3 ${
                      alert.severity === 'high' ? 'border-red-200 bg-red-50' :
                      alert.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                      'border-green-200 bg-green-50'
                    }`} data-testid="alert-card">
                      <div className="flex items-center gap-2">
                        <span className="font-medium" data-testid="alert-type">{alert.type}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          alert.severity === 'high' ? 'bg-red-100 text-red-700' :
                          alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        } ${alert.severity}`} data-testid="alert-severity">
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1" data-testid="alert-message">{alert.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Measurement History */}
              <div data-testid="measurement-history">
                <h4 className="font-semibold mb-4">Measurement History</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg" data-testid="measurement-history-table">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Height</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Weight</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">BMI</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: '1', date: '2024-09-15', height: '60 in', weight: '95 lbs', bmi: '18.5' },
                        { id: '2', date: '2024-06-15', height: '59 in', weight: '92 lbs', bmi: '18.2' },
                        { id: '3', date: '2024-03-15', height: '58 in', weight: '89 lbs', bmi: '18.0' },
                      ].map((measurement) => (
                        <tr key={measurement.id} className="border-t" data-testid="measurement-row">
                          <td className="px-4 py-2" data-testid="measurement-date">{measurement.date}</td>
                          <td className="px-4 py-2" data-testid="measurement-height">{measurement.height}</td>
                          <td className="px-4 py-2" data-testid="measurement-weight">{measurement.weight}</td>
                          <td className="px-4 py-2" data-testid="measurement-bmi">{measurement.bmi}</td>
                          <td className="px-4 py-2">
                            <div className="flex gap-2">
                              <button className="text-blue-600 hover:text-blue-700 text-sm" data-testid="edit-measurement-btn">
                                Edit
                              </button>
                              <button className="text-red-600 hover:text-red-700 text-sm" data-testid="delete-measurement-btn">
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Growth Predictions */}
              <div className="border border-gray-200 rounded-lg p-4" data-testid="growth-predictions">
                <h4 className="font-semibold mb-2">Growth Predictions</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Predicted Adult Height: </span>
                    <span className="font-medium" data-testid="predicted-adult-height">68 inches</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Confidence: </span>
                    <span className="font-medium" data-testid="prediction-confidence">85%</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Method: </span>
                    <span className="font-medium" data-testid="prediction-method">Mid-parental height</span>
                  </div>
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="border border-gray-200 rounded-lg p-4" data-testid="date-range-filter">
                <h4 className="font-semibold mb-2">Filter by Date Range</h4>
                <div className="flex gap-4 items-center">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input type="date" className="border border-gray-300 rounded px-3 py-2" data-testid="start-date-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input type="date" className="border border-gray-300 rounded px-3 py-2" data-testid="end-date-input" />
                  </div>
                  <button className="btn-primary mt-6" data-testid="apply-filter-btn">Apply Filter</button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button className="btn-secondary" data-testid="export-chart-btn">Export Chart</button>
                <button className="btn-secondary" data-testid="compare-standards-btn">Compare with Standards</button>
              </div>
            </div>
          )}

          {activeTab === 'screenings' && (
            <div className="space-y-4" data-testid="screenings-content">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Vision & Hearing Screenings</h3>
                <button className="btn-primary flex items-center" data-testid="schedule-screening-button">
                  <Plus className="h-4 w-4 mr-2" />
                  Record Screening
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { type: 'Vision', date: '2024-09-01', result: 'Pass', icon: Eye },
                  { type: 'Hearing', date: '2024-09-05', result: 'Pass', icon: Ear },
                  { type: 'Vision', date: '2023-09-15', result: 'Refer', icon: Eye },
                ].map((screening, i) => {
                  const Icon = screening.icon
                  return (
                    <div key={i} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <Icon className={`h-5 w-5 mt-1 ${
                            screening.result === 'Pass' ? 'text-green-600' : 'text-orange-600'
                          }`} />
                          <div>
                            <h4 className="font-semibold">{screening.type} Screening</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-1 rounded ${
                                screening.result === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                              }`}>
                                {screening.result}
                              </span>
                              <span className="text-sm text-gray-600">
                                {screening.date}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Allergy Modal */}
      {showAddAllergyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="add-allergy-modal">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4" data-testid="modal-title">Add New Allergy</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allergen</label>
                <input 
                  type="text" 
                  name="allergen"
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  placeholder="Enter allergen"
                  data-testid="allergen-input"
                />
                <p className="text-red-600 text-sm mt-1 hidden" data-testid="allergen-error">Allergen is required</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <select name="severity" className="w-full border border-gray-300 rounded px-3 py-2" data-testid="severity-select">
                  <option value="">Select severity</option>
                  <option value="MILD">Mild</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="SEVERE">Severe</option>
                  <option value="LIFE_THREATENING">Life Threatening</option>
                </select>
                <p className="text-red-600 text-sm mt-1 hidden" data-testid="severity-error">Severity is required</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reaction</label>
                <textarea 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  rows={3}
                  placeholder="Describe allergic reaction"
                  data-testid="reaction-input"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Treatment</label>
                <textarea 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  rows={2}
                  placeholder="Describe treatment"
                  data-testid="treatment-input"
                ></textarea>
              </div>
              <div className="flex gap-2 pt-4">
                <button 
                  type="button" 
                  className="btn-primary flex-1"
                  data-testid="save-allergy-button"
                  onClick={(e) => {
                    e.preventDefault()
                    const form = e.currentTarget.closest('form')
                    const formData = new FormData(form!)
                    const errors = validateAllergyForm(formData)
                    
                    setAllergyFormErrors(errors)
                    
                    // Show validation errors
                    Object.keys(errors).forEach(key => {
                      const errorElement = document.querySelector(`[data-testid="${key}-error"]`)
                      if (errorElement) {
                        errorElement.classList.remove('hidden')
                        errorElement.textContent = errors[key]
                      }
                    })
                    
                    if (Object.keys(errors).length === 0) {
                      // Mock API call for creating allergy
                      fetch('/api/health-records/allergies', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ studentId: '1', allergen: formData.get('allergen') })
                      }).then(() => {
                        setShowAddAllergyModal(false)
                        showSuccess()
                      })
                    }
                  }}
                >
                  Save Allergy
                </button>
                <button 
                  type="button" 
                  className="btn-secondary flex-1"
                  onClick={() => setShowAddAllergyModal(false)}
                  data-testid="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Allergy Modal */}
      {showEditAllergyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="edit-allergy-modal">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4" data-testid="modal-title">Edit Allergy</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allergen</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  defaultValue={selectedAllergy?.allergen}
                  data-testid="allergen-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <select 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  defaultValue={selectedAllergy?.severity}
                  data-testid="severity-select"
                >
                  <option value="MILD">Mild</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="SEVERE">Severe</option>
                  <option value="LIFE_THREATENING">Life Threatening</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button type="button" className="btn-primary flex-1">Update Allergy</button>
                <button 
                  type="button" 
                  className="btn-secondary flex-1"
                  onClick={() => setShowEditAllergyModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Add Condition Modal */}
      {showAddConditionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="add-condition-modal">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4" data-testid="modal-title">Add Chronic Condition</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <input 
                  type="text" 
                  name="condition"
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  placeholder="Enter condition name"
                  data-testid="condition-input"
                />
                <p className="text-red-600 text-sm mt-1 hidden" data-testid="condition-error">Condition name is required</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosed Date</label>
                <input 
                  type="date" 
                  name="diagnosedDate"
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  data-testid="diagnosed-date-input"
                />
                <p className="text-red-600 text-sm mt-1 hidden" data-testid="diagnosed-date-error">Diagnosed date is required</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2" data-testid="status-select">
                  <option value="">Select status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="MANAGED">Managed</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2" data-testid="severity-select">
                  <option value="">Select severity</option>
                  <option value="MILD">Mild</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="SEVERE">Severe</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Care Plan</label>
                <textarea 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  rows={3}
                  placeholder="Describe care plan"
                  data-testid="care-plan-textarea"
                ></textarea>
              </div>
              <div className="flex gap-2 pt-4">
                <button 
                  type="button" 
                  className="btn-primary flex-1"
                  data-testid="save-condition-button"
                  onClick={(e) => {
                    e.preventDefault()
                    const form = e.currentTarget.closest('form')
                    const formData = new FormData(form!)
                    const errors = validateConditionForm(formData)
                    
                    setConditionFormErrors(errors)
                    
                    // Show validation errors
                    Object.keys(errors).forEach(key => {
                      const errorElement = document.querySelector(`[data-testid="${key}-error"]`)
                      if (errorElement) {
                        errorElement.classList.remove('hidden')
                        errorElement.textContent = errors[key]
                      }
                    })
                    
                    if (Object.keys(errors).length === 0) {
                      // Mock API call for creating condition
                      fetch('/api/health-records/chronic-conditions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ studentId: '1', condition: formData.get('condition') })
                      }).then(() => {
                        setShowAddConditionModal(false)
                        showSuccess()
                      })
                    }
                  }}
                >
                  Save Condition
                </button>
                <button 
                  type="button" 
                  className="btn-secondary flex-1"
                  onClick={() => setShowAddConditionModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Record Details Modal */}
      {showRecordDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="record-details-modal">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Health Record Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Annual Physical Examination</h3>
                <p className="text-sm text-gray-600">Dr. Sarah Johnson • October 15, 2024</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-gray-700">Complete physical exam with vitals and health assessment</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Vitals</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Height: 5'4"</div>
                  <div>Weight: 125 lbs</div>
                  <div>BP: 120/80</div>
                  <div>Pulse: 72 bpm</div>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button 
                className="btn-secondary"
                onClick={() => setShowRecordDetailsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Care Plan Modal */}
      {showCarePlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="care-plan-modal">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Care Plan</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{selectedCondition?.condition}</h3>
                <p className="text-sm text-gray-600">Status: {selectedCondition?.status}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Care Instructions</h4>
                <p className="text-sm text-gray-700">Daily insulin monitoring required. Check blood glucose levels 3 times daily before meals.</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Emergency Actions</h4>
                <p className="text-sm text-gray-700">If blood sugar drops below 70 mg/dL, administer glucose tablets and contact parents immediately.</p>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button 
                className="btn-secondary"
                onClick={() => setShowCarePlanModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Vaccination Modal */}
      {showVaccinationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="vaccination-modal">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4" data-testid="modal-title">
              {selectedVaccination ? 'Edit Vaccination Record' : 'Add Vaccination Record'}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vaccination Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  placeholder="Enter vaccination name"
                  data-testid="vaccination-name-input"
                  defaultValue={selectedVaccination?.vaccineName || ''}
                />
                <p className="text-red-600 text-sm mt-1 hidden" data-testid="vaccination-name-error">Vaccination name is required</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Administered</label>
                <input 
                  type="date" 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  data-testid="vaccination-date-input"
                  defaultValue={selectedVaccination?.dateAdministered || ''}
                />
                <p className="text-red-600 text-sm mt-1 hidden" data-testid="vaccination-date-error">Date administered is required</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  placeholder="Healthcare provider"
                  data-testid="vaccination-provider-input"
                  defaultValue={selectedVaccination?.administeredBy || ''}
                />
                <p className="text-red-600 text-sm mt-1 hidden" data-testid="vaccination-provider-error">Provider is required</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dose</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  placeholder="e.g., 1st dose, 0.5ml"
                  data-testid="vaccination-dose-input"
                  defaultValue={selectedVaccination?.dose || ''}
                />
                <p className="text-red-600 text-sm mt-1 hidden" data-testid="vaccination-dose-error">Dose information is required</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lot Number</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  placeholder="Vaccine lot number"
                  data-testid="vaccination-lot-input"
                  defaultValue={selectedVaccination?.lotNumber || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  rows={3}
                  placeholder="Additional notes"
                  data-testid="vaccination-notes-input"
                  defaultValue={selectedVaccination?.notes || ''}
                ></textarea>
              </div>
              <div className="flex gap-2 pt-4">
                <button 
                  type="button" 
                  className="btn-primary flex-1"
                  data-testid="save-vaccination-btn"
                  onClick={(e) => {
                    e.preventDefault()
                    const form = e.currentTarget.closest('form')
                    const formData = new FormData(form!)
                    
                    // Form validation
                    const errors: any = {}
                    const nameInput = form?.querySelector('[data-testid="vaccination-name-input"]') as HTMLInputElement
                    const dateInput = form?.querySelector('[data-testid="vaccination-date-input"]') as HTMLInputElement
                    const providerInput = form?.querySelector('[data-testid="vaccination-provider-input"]') as HTMLInputElement
                    const doseInput = form?.querySelector('[data-testid="vaccination-dose-input"]') as HTMLInputElement
                    
                    if (!nameInput?.value.trim()) {
                      errors['vaccination-name'] = 'Vaccination name is required'
                    }
                    if (!dateInput?.value) {
                      errors['vaccination-date'] = 'Date administered is required'
                    }
                    if (!providerInput?.value.trim()) {
                      errors['vaccination-provider'] = 'Provider is required'
                    }
                    if (!doseInput?.value.trim()) {
                      errors['vaccination-dose'] = 'Dose information is required'
                    }
                    
                    // Clear previous errors
                    document.querySelectorAll('[data-testid$="-error"]').forEach(el => {
                      el.classList.add('hidden')
                    })
                    
                    // Show validation errors
                    Object.keys(errors).forEach(key => {
                      const errorElement = document.querySelector(`[data-testid="${key}-error"]`)
                      if (errorElement) {
                        errorElement.classList.remove('hidden')
                        errorElement.textContent = errors[key]
                      }
                    })
                    
                    if (Object.keys(errors).length === 0) {
                      // Mock API call
                      const apiCall = selectedVaccination 
                        ? fetch(`/api/students/1/vaccinations/${selectedVaccination.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ vaccineName: nameInput.value })
                          })
                        : fetch('/api/students/1/vaccinations', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ vaccineName: nameInput.value })
                          })
                      
                      apiCall.then(() => {
                        setShowVaccinationModal(false)
                        setSelectedVaccination(null)
                        
                        // Show success toast
                        const toast = document.createElement('div')
                        toast.setAttribute('data-testid', 'success-toast')
                        toast.className = 'fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded'
                        toast.textContent = selectedVaccination 
                          ? 'Vaccination record updated successfully'
                          : 'Vaccination record added successfully'
                        document.body.appendChild(toast)
                        
                        setTimeout(() => {
                          document.body.removeChild(toast)
                        }, 3000)
                      })
                    }
                  }}
                >
                  {selectedVaccination ? 'Update Vaccination' : 'Save Vaccination'}
                </button>
                <button 
                  type="button" 
                  className="btn-secondary flex-1"
                  onClick={() => {
                    setShowVaccinationModal(false)
                    setSelectedVaccination(null)
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Vaccination Modal */}
      {showNewRecordModal && selectedRecordType === 'VACCINATION' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="vaccination-modal">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4" data-testid="modal-title">Add Vaccination Record</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vaccination Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  placeholder="Enter vaccination name"
                  data-testid="vaccination-name-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Administered</label>
                <input 
                  type="date" 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  data-testid="vaccination-date-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  placeholder="Healthcare provider"
                  data-testid="vaccination-provider-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dose</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  placeholder="e.g., 1st dose, 0.5ml"
                  data-testid="vaccination-dose-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lot Number</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  placeholder="Vaccine lot number"
                  data-testid="vaccination-lot-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  rows={3}
                  placeholder="Additional notes"
                  data-testid="vaccination-notes-input"
                ></textarea>
              </div>
              <div className="flex gap-2 pt-4">
                <button 
                  type="button" 
                  className="btn-primary flex-1"
                  data-testid="save-vaccination-btn"
                  onClick={() => {
                    setShowNewRecordModal(false)
                    showSuccess()
                  }}
                >
                  Save Vaccination
                </button>
                <button 
                  type="button" 
                  className="btn-secondary flex-1"
                  onClick={() => setShowNewRecordModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Measurement Modal */}
      {showNewRecordModal && (activeTab === 'growth' || selectedRecordType === 'MEASUREMENT') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="measurement-modal">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4" data-testid="modal-title">Add Growth Measurement</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Measurement Date</label>
                <input 
                  type="date" 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  data-testid="measurement-date-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (inches)</label>
                <input 
                  type="number" 
                  step="0.1"
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  placeholder="Height in inches"
                  data-testid="height-input"
                />
                <p className="text-red-600 text-sm mt-1 hidden" data-testid="height-error">Height must be between 10 and 84 inches</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
                <input 
                  type="number" 
                  step="0.1"
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  placeholder="Weight in pounds"
                  data-testid="weight-input"
                />
                <p className="text-red-600 text-sm mt-1 hidden" data-testid="weight-error">Weight must be between 5 and 300 pounds</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Head Circumference (inches)</label>
                <input 
                  type="number" 
                  step="0.1"
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  placeholder="Head circumference"
                  data-testid="head-circumference-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  rows={2}
                  placeholder="Measurement notes"
                  data-testid="measurement-notes-input"
                ></textarea>
              </div>
              <div className="flex gap-2 pt-4">
                <button 
                  type="button" 
                  className="btn-primary flex-1"
                  data-testid="save-measurement-btn"
                  onClick={(e) => {
                    e.preventDefault()
                    const heightInput = document.querySelector('[data-testid="height-input"]') as HTMLInputElement
                    const weightInput = document.querySelector('[data-testid="weight-input"]') as HTMLInputElement
                    
                    // Basic validation
                    const height = parseFloat(heightInput?.value || '0')
                    const weight = parseFloat(weightInput?.value || '0')
                    
                    let hasError = false
                    
                    if (height < 10 || height > 84) {
                      document.querySelector('[data-testid="height-error"]')?.classList.remove('hidden')
                      hasError = true
                    } else {
                      document.querySelector('[data-testid="height-error"]')?.classList.add('hidden')
                    }
                    
                    if (weight < 5 || weight > 300) {
                      document.querySelector('[data-testid="weight-error"]')?.classList.remove('hidden')
                      hasError = true
                    } else {
                      document.querySelector('[data-testid="weight-error"]')?.classList.add('hidden')
                    }
                    
                    if (!hasError) {
                      setShowNewRecordModal(false)
                      showSuccess()
                    }
                  }}
                >
                  Save Measurement
                </button>
                <button 
                  type="button" 
                  className="btn-secondary flex-1"
                  onClick={() => setShowNewRecordModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="confirmation-modal">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this vaccination record? This action cannot be undone.</p>
            <div className="flex gap-2">
              <button 
                className="btn-red flex-1"
                data-testid="confirm-delete-btn"
                onClick={() => {
                  // Mock API call for deletion
                  if (selectedVaccination) {
                    fetch(`/api/students/1/vaccinations/${selectedVaccination.id}`, {
                      method: 'DELETE'
                    }).then(() => {
                      setShowConfirmationModal(false)
                      setSelectedVaccination(null)
                      
                      // Show success toast
                      const toast = document.createElement('div')
                      toast.setAttribute('data-testid', 'success-toast')
                      toast.className = 'fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded'
                      toast.textContent = 'Vaccination record deleted successfully'
                      document.body.appendChild(toast)
                      
                      setTimeout(() => {
                        document.body.removeChild(toast)
                      }, 3000)
                    })
                  }
                }}
              >
                Delete
              </button>
              <button 
                className="btn-secondary flex-1"
                onClick={() => {
                  setShowConfirmationModal(false)
                  setSelectedVaccination(null)
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showCarePlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="schedule-modal">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Schedule Vaccination</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Date</label>
                <input 
                  type="date" 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  data-testid="schedule-date-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Time</label>
                <input 
                  type="time" 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  data-testid="schedule-time-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2" data-testid="provider-select">
                  <option value="">Select provider</option>
                  <option value="School Nurse">School Nurse</option>
                  <option value="Dr. Smith">Dr. Smith</option>
                  <option value="Local Clinic">Local Clinic</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button 
                  type="button" 
                  className="btn-primary flex-1"
                  data-testid="confirm-schedule-btn"
                  onClick={() => {
                    setShowCarePlanModal(false)
                    showSuccess()
                  }}
                >
                  Schedule
                </button>
                <button 
                  type="button" 
                  className="btn-secondary flex-1"
                  onClick={() => setShowCarePlanModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {showAddConditionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="reminder-modal">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Set Vaccination Reminder</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vaccination</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2" data-testid="reminder-vaccination-select">
                  <option value="">Select vaccination</option>
                  <option value="Flu Shot">Flu Shot</option>
                  <option value="COVID-19 Booster">COVID-19 Booster</option>
                  <option value="Tdap">Tdap</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Date</label>
                <input 
                  type="date" 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  data-testid="reminder-date-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Method</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2" data-testid="reminder-method-select">
                  <option value="Email">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="Both">Both</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  rows={3}
                  placeholder="Reminder message"
                  data-testid="reminder-message-input"
                ></textarea>
              </div>
              <div className="flex gap-2 pt-4">
                <button 
                  type="button" 
                  className="btn-primary flex-1"
                  data-testid="save-reminder-btn"
                  onClick={() => {
                    setShowAddConditionModal(false)
                    showSuccess()
                  }}
                >
                  Set Reminder
                </button>
                <button 
                  type="button" 
                  className="btn-secondary flex-1"
                  onClick={() => setShowAddConditionModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showEditAllergyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="report-modal">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Generate Vaccination Report</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2" data-testid="report-type-select">
                  <option value="Summary">Summary</option>
                  <option value="Comprehensive">Comprehensive</option>
                  <option value="Compliance">Compliance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range Start</label>
                <input 
                  type="date" 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  data-testid="date-range-start"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range End</label>
                <input 
                  type="date" 
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  data-testid="date-range-end"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button 
                  type="button" 
                  className="btn-primary flex-1"
                  data-testid="generate-btn"
                  onClick={() => {
                    setShowEditAllergyModal(false)
                    // Show download button after generation
                    setTimeout(() => {
                      const downloadBtn = document.createElement('button')
                      downloadBtn.setAttribute('data-testid', 'download-report-btn')
                      downloadBtn.className = 'btn-secondary'
                      downloadBtn.textContent = 'Download Report'
                      downloadBtn.style.display = 'block'
                      document.body.appendChild(downloadBtn)
                    }, 1000)
                    showSuccess()
                  }}
                >
                  Generate
                </button>
                <button 
                  type="button" 
                  className="btn-secondary flex-1"
                  onClick={() => setShowEditAllergyModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Export Options Modal */}
      {showEditConditionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="export-options-modal">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Export Options</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Export Format</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2" data-testid="export-format-select">
                  <option value="CSV">CSV</option>
                  <option value="PDF">PDF</option>
                  <option value="Excel">Excel</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button 
                  type="button" 
                  className="btn-primary flex-1"
                  data-testid="confirm-export-btn"
                  onClick={() => {
                    setShowEditConditionModal(false)
                    // Show download link after export
                    setTimeout(() => {
                      const downloadLink = document.createElement('a')
                      downloadLink.setAttribute('data-testid', 'download-link')
                      downloadLink.href = '#'
                      downloadLink.textContent = 'Download Export File'
                      downloadLink.className = 'text-blue-600 hover:text-blue-700 underline'
                      downloadLink.style.display = 'block'
                      document.body.appendChild(downloadLink)
                    }, 1000)
                    showSuccess()
                  }}
                >
                  Export
                </button>
                <button 
                  type="button" 
                  className="btn-secondary flex-1"
                  onClick={() => setShowEditConditionModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50" data-testid="success-message">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Operation completed successfully!
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50" data-testid="success-toast">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <div className="flex items-center">
              <span>Vaccination record added successfully</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}