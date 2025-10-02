import React, { useState } from 'react'
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Records Management</h1>
          <p className="text-gray-600">Comprehensive electronic health records system</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </button>
          <button className="btn-secondary flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button 
            className="btn-primary flex items-center"
            onClick={() => setShowNewRecordModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Record
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Allergies</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chronic Conditions</p>
              <p className="text-2xl font-bold text-gray-900">45</p>
            </div>
            <Heart className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vaccinations Due</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <Shield className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Electronic Health Records (EHR)</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                      <span>Complete digital health record system with comprehensive medical history</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                      <span>Medical examination records with vitals and provider notes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                      <span>Real-time vital signs tracking and monitoring</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Vaccination Tracking</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                      <span>Complete immunization records with compliance monitoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Calendar className="h-5 w-5 text-green-600 mt-0.5" />
                      <span>Automated reminders for upcoming vaccinations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FileText className="h-5 w-5 text-green-600 mt-0.5" />
                      <span>State reporting and compliance documentation</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Allergy Management</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <span>Comprehensive allergy tracking with severity levels</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Activity className="h-5 w-5 text-red-600 mt-0.5" />
                      <span>Reaction history and treatment documentation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="h-5 w-5 text-red-600 mt-0.5" />
                      <span>Medical verification and alert systems</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Chronic Conditions</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <Heart className="h-5 w-5 text-purple-600 mt-0.5" />
                      <span>Chronic condition monitoring with care plans</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FileText className="h-5 w-5 text-purple-600 mt-0.5" />
                      <span>Treatment protocols and medication tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                      <span>Regular review scheduling and progress monitoring</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Growth Chart Tracking</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                      <span>Height, weight, and BMI tracking over time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                      <span>Visual growth charts with percentile analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <span>Automatic alerts for concerning trends</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Vision/Hearing Screening</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <Eye className="h-5 w-5 text-indigo-600 mt-0.5" />
                      <span>Vision screening records with test results</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Ear className="h-5 w-5 text-indigo-600 mt-0.5" />
                      <span>Hearing screening documentation and follow-ups</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Calendar className="h-5 w-5 text-indigo-600 mt-0.5" />
                      <span>Scheduled screening reminders and compliance tracking</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Import/Export Capabilities</h3>
                <div className="flex gap-4">
                  <button className="btn-secondary flex items-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Health History (JSON/CSV)
                  </button>
                  <button className="btn-secondary flex items-center">
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
            <div className="space-y-4">
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
                  />
                </div>
                <button className="btn-secondary flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </button>
              </div>

              {/* Records List */}
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <Stethoscope className="h-5 w-5 text-blue-600 mt-1" />
                        <div>
                          <h4 className="font-semibold">Annual Physical Examination</h4>
                          <p className="text-sm text-gray-600">Dr. Sarah Johnson • October 15, 2024</p>
                          <p className="text-sm text-gray-500 mt-1">Complete physical exam with vitals and health assessment</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'allergies' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Student Allergies</h3>
                <button className="btn-primary flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Allergy
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { allergen: 'Peanuts', severity: 'LIFE_THREATENING', verified: true },
                  { allergen: 'Penicillin', severity: 'SEVERE', verified: true },
                  { allergen: 'Bee Stings', severity: 'MODERATE', verified: false },
                ].map((allergy, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <AlertCircle className={`h-5 w-5 mt-1 ${
                          allergy.severity === 'LIFE_THREATENING' ? 'text-red-600' :
                          allergy.severity === 'SEVERE' ? 'text-orange-600' :
                          'text-yellow-600'
                        }`} />
                        <div>
                          <h4 className="font-semibold">{allergy.allergen}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded ${
                              allergy.severity === 'LIFE_THREATENING' ? 'bg-red-100 text-red-700' :
                              allergy.severity === 'SEVERE' ? 'bg-orange-100 text-orange-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {allergy.severity}
                            </span>
                            {allergy.verified && (
                              <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                                Verified
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'chronic' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Chronic Conditions</h3>
                <button className="btn-primary flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Condition
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { condition: 'Asthma', status: 'ACTIVE', severity: 'MODERATE' },
                  { condition: 'Type 1 Diabetes', status: 'ACTIVE', severity: 'SEVERE' },
                ].map((condition, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <Heart className="h-5 w-5 text-purple-600 mt-1" />
                        <div>
                          <h4 className="font-semibold">{condition.condition}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                              {condition.status}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              condition.severity === 'SEVERE' ? 'bg-orange-100 text-orange-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {condition.severity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            Care plan active • Next review: Nov 15, 2024
                          </p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View Care Plan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'vaccinations' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Vaccination Records</h3>
                <button className="btn-primary flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Record Vaccination
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { vaccine: 'MMR (Measles, Mumps, Rubella)', date: '2023-08-15', status: 'Complete' },
                  { vaccine: 'DTaP (Diphtheria, Tetanus, Pertussis)', date: '2023-07-10', status: 'Complete' },
                  { vaccine: 'COVID-19 Booster', date: '2024-01-20', status: 'Complete' },
                  { vaccine: 'Flu Vaccine', date: null, status: 'Due' },
                ].map((vax, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <Shield className={`h-5 w-5 mt-1 ${
                          vax.status === 'Complete' ? 'text-green-600' : 'text-orange-600'
                        }`} />
                        <div>
                          <h4 className="font-semibold">{vax.vaccine}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded ${
                              vax.status === 'Complete' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                            }`}>
                              {vax.status}
                            </span>
                            {vax.date && (
                              <span className="text-sm text-gray-600">
                                Administered: {vax.date}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        {vax.status === 'Complete' ? 'View Record' : 'Schedule'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'growth' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Growth Chart Analysis</h3>
              <div className="border border-gray-200 rounded-lg p-8 text-center">
                <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Growth chart visualization with height, weight, and BMI trends</p>
                <p className="text-sm text-gray-500 mt-2">Visual charts showing growth patterns over time</p>
              </div>
            </div>
          )}

          {activeTab === 'screenings' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Vision & Hearing Screenings</h3>
                <button className="btn-primary flex items-center">
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
    </div>
  )
}