import React, { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Download, 
  Activity,
  Heart,
  AlertTriangle,
  Users,
  Pill,
  Calendar,
  Shield,
  RefreshCw,
  Filter,
  Settings
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { reportsApi } from '../services/reportsApi'
import toast from 'react-hot-toast'

type TabType = 'overview' | 'health' | 'medication' | 'incidents' | 'attendance' | 'dashboard' | 'compliance' | 'custom'

export default function Reports() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  const [showExportModal, setShowExportModal] = useState(false)
  const [customReportType, setCustomReportType] = useState('students')

  // Real-time dashboard query
  const { data: dashboardData, refetch: refetchDashboard } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => reportsApi.getDashboard(),
    refetchInterval: 30000, // Refresh every 30 seconds
    enabled: activeTab === 'dashboard' || activeTab === 'overview'
  })

  // Health trends query
  const { data: healthTrends, isLoading: healthLoading } = useQuery({
    queryKey: ['health-trends', dateRange],
    queryFn: () => reportsApi.getHealthTrends(dateRange),
    enabled: activeTab === 'health'
  })

  // Medication usage query
  const { data: medicationUsage, isLoading: medicationLoading } = useQuery({
    queryKey: ['medication-usage', dateRange],
    queryFn: () => reportsApi.getMedicationUsage(dateRange),
    enabled: activeTab === 'medication'
  })

  // Incident statistics query
  const { data: incidentStats, isLoading: incidentLoading } = useQuery({
    queryKey: ['incident-statistics', dateRange],
    queryFn: () => reportsApi.getIncidentStatistics(dateRange),
    enabled: activeTab === 'incidents'
  })

  // Attendance correlation query
  const { data: attendanceData, isLoading: attendanceLoading } = useQuery({
    queryKey: ['attendance-correlation', dateRange],
    queryFn: () => reportsApi.getAttendanceCorrelation(dateRange),
    enabled: activeTab === 'attendance'
  })

  // Compliance report query
  const { data: complianceData, isLoading: complianceLoading } = useQuery({
    queryKey: ['compliance-report', dateRange],
    queryFn: () => reportsApi.getComplianceReport(dateRange),
    enabled: activeTab === 'compliance'
  })

  const handleExportReport = async (format: 'csv' | 'pdf' | 'excel') => {
    try {
      await reportsApi.exportReport({
        reportType: customReportType,
        format,
        filters: dateRange
      })
      toast.success(`Report exported as ${format.toUpperCase()}`)
      setShowExportModal(false)
    } catch (error) {
      toast.error('Failed to export report')
    }
  }

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: Activity },
    { id: 'health' as TabType, label: 'Health Analytics', icon: Heart },
    { id: 'medication' as TabType, label: 'Medication Reports', icon: Pill },
    { id: 'incidents' as TabType, label: 'Incident Statistics', icon: AlertTriangle },
    { id: 'attendance' as TabType, label: 'Attendance Analysis', icon: Users },
    { id: 'dashboard' as TabType, label: 'Real-time Dashboard', icon: Activity },
    { id: 'compliance' as TabType, label: 'Compliance', icon: Shield },
    { id: 'custom' as TabType, label: 'Custom Reports', icon: Settings },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Health trends, compliance reports, and performance dashboards</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowExportModal(true)}
            className="btn-secondary flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button 
            onClick={() => refetchDashboard()}
            className="btn-primary flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Date Range Filter */}
      {activeTab !== 'overview' && activeTab !== 'custom' && (
        <div className="card p-4">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">From:</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">To:</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6">
              <TrendingUp className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Health Analytics</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Health trend analysis</li>
                <li>✓ Population health insights</li>
                <li>✓ Chronic condition tracking</li>
                <li>✓ Allergy monitoring</li>
              </ul>
            </div>

            <div className="card p-6">
              <Pill className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Medication Reports</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Usage tracking</li>
                <li>✓ Compliance monitoring</li>
                <li>✓ Adverse reactions</li>
                <li>✓ Administration logs</li>
              </ul>
            </div>

            <div className="card p-6">
              <AlertTriangle className="h-8 w-8 text-orange-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Incident Analytics</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Incident statistics</li>
                <li>✓ Safety analytics</li>
                <li>✓ Trend analysis</li>
                <li>✓ Compliance tracking</li>
              </ul>
            </div>

            <div className="card p-6">
              <Users className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Attendance Analysis</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Health visit correlation</li>
                <li>✓ Pattern identification</li>
                <li>✓ Chronic condition impact</li>
                <li>✓ Frequency analysis</li>
              </ul>
            </div>
          </div>

          {/* Real-time Dashboard Stats */}
          {dashboardData && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Real-time Performance Dashboard</h3>
                <span className="text-sm text-gray-500">
                  Last updated: {new Date(dashboardData.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{dashboardData.activeStudents}</p>
                  <p className="text-sm text-gray-600">Active Students</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{dashboardData.todaysAppointments}</p>
                  <p className="text-sm text-gray-600">Today's Appointments</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">{dashboardData.pendingMedications}</p>
                  <p className="text-sm text-gray-600">Pending Medications</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">{dashboardData.recentIncidents}</p>
                  <p className="text-sm text-gray-600">Recent Incidents</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600">{dashboardData.lowStockItems}</p>
                  <p className="text-sm text-gray-600">Low Stock Items</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-600">{dashboardData.activeAllergies}</p>
                  <p className="text-sm text-gray-600">Active Allergies</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-indigo-600">{dashboardData.chronicConditions}</p>
                  <p className="text-sm text-gray-600">Chronic Conditions</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6">
              <BarChart3 className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Performance Dashboards</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Real-time metrics monitoring</li>
                <li>✓ KPI tracking and analysis</li>
                <li>✓ Visual analytics and charts</li>
                <li>✓ Custom dashboard creation</li>
              </ul>
            </div>

            <div className="card p-6">
              <FileText className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Compliance & Export</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Regulatory compliance reports</li>
                <li>✓ HIPAA documentation</li>
                <li>✓ Custom report builder</li>
                <li>✓ Multiple export formats (CSV, PDF, Excel)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Health Analytics Tab */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          {healthLoading ? (
            <div className="card p-6 text-center text-gray-500">Loading health trends...</div>
          ) : healthTrends ? (
            <>
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Health Records by Type</h3>
                <div className="space-y-2">
                  {healthTrends.healthRecords?.map((record: any) => (
                    <div key={record.type} className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">{record.type}</span>
                      <span className="text-blue-600 font-semibold">{record._count.id}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">Top Chronic Conditions</h3>
                  <div className="space-y-2">
                    {healthTrends.chronicConditions?.slice(0, 5).map((condition: any, index: number) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b">
                        <span>{condition.condition}</span>
                        <span className="text-blue-600 font-semibold">{condition._count.id}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">Top Allergies by Severity</h3>
                  <div className="space-y-2">
                    {healthTrends.allergies?.slice(0, 5).map((allergy: any, index: number) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <span className="font-medium">{allergy.allergen}</span>
                          <span className="text-sm text-gray-500 ml-2">({allergy.severity})</span>
                        </div>
                        <span className="text-blue-600 font-semibold">{allergy._count.id}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Medication Reports Tab */}
      {activeTab === 'medication' && (
        <div className="space-y-6">
          {medicationLoading ? (
            <div className="card p-6 text-center text-gray-500">Loading medication reports...</div>
          ) : medicationUsage ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6">
                  <Pill className="h-8 w-8 text-blue-600 mb-2" />
                  <p className="text-sm text-gray-600">Total Scheduled</p>
                  <p className="text-2xl font-bold">{medicationUsage.totalScheduled}</p>
                </div>
                <div className="card p-6">
                  <AlertTriangle className="h-8 w-8 text-orange-600 mb-2" />
                  <p className="text-sm text-gray-600">Adverse Reactions</p>
                  <p className="text-2xl font-bold">{medicationUsage.adverseReactions?.length || 0}</p>
                </div>
                <div className="card p-6">
                  <Activity className="h-8 w-8 text-green-600 mb-2" />
                  <p className="text-sm text-gray-600">Administration Logs</p>
                  <p className="text-2xl font-bold">{medicationUsage.administrationLogs?.length || 0}</p>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Administration Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {medicationUsage.administrationStats?.map((stat: any) => (
                    <div key={stat.status} className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{stat._count.id}</p>
                      <p className="text-sm text-gray-600">{stat.status}</p>
                    </div>
                  ))}
                </div>
              </div>

              {medicationUsage.studentCompliance && medicationUsage.studentCompliance.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">Student Compliance Rates</h3>
                  <div className="space-y-2">
                    {medicationUsage.studentCompliance.slice(0, 10).map((student: any, index: number) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <span className="font-medium">{student.firstName} {student.lastName}</span>
                          <span className="text-sm text-gray-500 ml-2">({student.studentNumber})</span>
                        </div>
                        <div className="text-right">
                          <span className={`font-semibold ${
                            parseFloat(student.compliance_rate) >= 90 ? 'text-green-600' :
                            parseFloat(student.compliance_rate) >= 70 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {student.compliance_rate}%
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            ({student.administered}/{student.total})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      )}

      {/* Incident Statistics Tab */}
      {activeTab === 'incidents' && (
        <div className="space-y-6">
          {incidentLoading ? (
            <div className="card p-6 text-center text-gray-500">Loading incident statistics...</div>
          ) : incidentStats ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card p-6">
                  <AlertTriangle className="h-8 w-8 text-orange-600 mb-2" />
                  <p className="text-sm text-gray-600">Total Incidents</p>
                  <p className="text-2xl font-bold">{incidentStats.totalIncidents}</p>
                </div>
                <div className="card p-6">
                  <Shield className="h-8 w-8 text-blue-600 mb-2" />
                  <p className="text-sm text-gray-600">Parent Notified</p>
                  <p className="text-2xl font-bold">
                    {incidentStats.notificationStats?.find((s: any) => s.parentNotified)?.['_count']?.id || 0}
                  </p>
                </div>
                <div className="card p-6">
                  <FileText className="h-8 w-8 text-green-600 mb-2" />
                  <p className="text-sm text-gray-600">Compliant</p>
                  <p className="text-2xl font-bold">
                    {incidentStats.complianceStats?.find((s: any) => s.complianceStatus === 'COMPLIANT')?._count?.id || 0}
                  </p>
                </div>
                <div className="card p-6">
                  <Activity className="h-8 w-8 text-purple-600 mb-2" />
                  <p className="text-sm text-gray-600">Under Review</p>
                  <p className="text-2xl font-bold">
                    {incidentStats.complianceStats?.find((s: any) => s.complianceStatus === 'UNDER_REVIEW')?._count?.id || 0}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">Incidents by Type</h3>
                  <div className="space-y-2">
                    {incidentStats.incidentsByType?.map((type: any) => (
                      <div key={type.type} className="flex justify-between items-center py-2 border-b">
                        <span className="font-medium">{type.type}</span>
                        <span className="text-blue-600 font-semibold">{type._count.id}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">Incidents by Severity</h3>
                  <div className="space-y-2">
                    {incidentStats.incidentsBySeverity?.map((severity: any) => (
                      <div key={severity.severity} className="flex justify-between items-center py-2 border-b">
                        <span className={`font-medium ${
                          severity.severity === 'CRITICAL' ? 'text-red-600' :
                          severity.severity === 'HIGH' ? 'text-orange-600' :
                          severity.severity === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {severity.severity}
                        </span>
                        <span className="text-blue-600 font-semibold">{severity._count.id}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Attendance Correlation Tab */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          {attendanceLoading ? (
            <div className="card p-6 text-center text-gray-500">Loading attendance data...</div>
          ) : attendanceData ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6">
                  <Heart className="h-8 w-8 text-red-600 mb-2" />
                  <p className="text-sm text-gray-600">Students with Chronic Conditions</p>
                  <p className="text-2xl font-bold">{attendanceData.chronicStudents?.length || 0}</p>
                </div>
                <div className="card p-6">
                  <Activity className="h-8 w-8 text-blue-600 mb-2" />
                  <p className="text-sm text-gray-600">High Health Visit Frequency</p>
                  <p className="text-2xl font-bold">{attendanceData.healthVisits?.slice(0, 10).length || 0}</p>
                </div>
                <div className="card p-6">
                  <Calendar className="h-8 w-8 text-green-600 mb-2" />
                  <p className="text-sm text-gray-600">Appointment Frequency Tracked</p>
                  <p className="text-2xl font-bold">{attendanceData.appointmentFrequency?.slice(0, 10).length || 0}</p>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Top Students by Health Visits</h3>
                <div className="space-y-2">
                  {attendanceData.healthVisits?.slice(0, 10).map((visit: any, index: number) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <span>Student ID: {visit.studentId}</span>
                      <span className="text-blue-600 font-semibold">{visit._count.id} visits</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Real-time Dashboard Tab */}
      {activeTab === 'dashboard' && dashboardData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100">
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <p className="text-sm text-gray-600">Active Students</p>
              <p className="text-3xl font-bold text-blue-600">{dashboardData.activeStudents}</p>
            </div>
            <div className="card p-6 bg-gradient-to-br from-green-50 to-green-100">
              <Calendar className="h-8 w-8 text-green-600 mb-2" />
              <p className="text-sm text-gray-600">Today's Appointments</p>
              <p className="text-3xl font-bold text-green-600">{dashboardData.todaysAppointments}</p>
            </div>
            <div className="card p-6 bg-gradient-to-br from-purple-50 to-purple-100">
              <Pill className="h-8 w-8 text-purple-600 mb-2" />
              <p className="text-sm text-gray-600">Pending Medications</p>
              <p className="text-3xl font-bold text-purple-600">{dashboardData.pendingMedications}</p>
            </div>
            <div className="card p-6 bg-gradient-to-br from-orange-50 to-orange-100">
              <AlertTriangle className="h-8 w-8 text-orange-600 mb-2" />
              <p className="text-sm text-gray-600">Recent Incidents (24h)</p>
              <p className="text-3xl font-bold text-orange-600">{dashboardData.recentIncidents}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6 bg-gradient-to-br from-red-50 to-red-100">
              <AlertTriangle className="h-8 w-8 text-red-600 mb-2" />
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className="text-3xl font-bold text-red-600">{dashboardData.lowStockItems}</p>
            </div>
            <div className="card p-6 bg-gradient-to-br from-yellow-50 to-yellow-100">
              <Heart className="h-8 w-8 text-yellow-600 mb-2" />
              <p className="text-sm text-gray-600">Active Allergies</p>
              <p className="text-3xl font-bold text-yellow-600">{dashboardData.activeAllergies}</p>
            </div>
            <div className="card p-6 bg-gradient-to-br from-indigo-50 to-indigo-100">
              <Heart className="h-8 w-8 text-indigo-600 mb-2" />
              <p className="text-sm text-gray-600">Chronic Conditions</p>
              <p className="text-3xl font-bold text-indigo-600">{dashboardData.chronicConditions}</p>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">System Status</h3>
              <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                All Systems Operational
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Last updated: {new Date(dashboardData.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          {complianceLoading ? (
            <div className="card p-6 text-center text-gray-500">Loading compliance reports...</div>
          ) : complianceData ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6">
                  <Shield className="h-8 w-8 text-blue-600 mb-2" />
                  <p className="text-sm text-gray-600">HIPAA Audit Logs</p>
                  <p className="text-2xl font-bold">{complianceData.hipaaLogs?.length || 0}</p>
                </div>
                <div className="card p-6">
                  <Pill className="h-8 w-8 text-green-600 mb-2" />
                  <p className="text-sm text-gray-600">Total Medications</p>
                  <p className="text-2xl font-bold">
                    {complianceData.medicationCompliance?.reduce((acc: number, curr: any) => acc + curr._count.id, 0) || 0}
                  </p>
                </div>
                <div className="card p-6">
                  <FileText className="h-8 w-8 text-purple-600 mb-2" />
                  <p className="text-sm text-gray-600">Vaccination Records</p>
                  <p className="text-2xl font-bold">{complianceData.vaccinationRecords || 0}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">Medication Status</h3>
                  <div className="space-y-2">
                    {complianceData.medicationCompliance?.map((stat: any) => (
                      <div key={stat.isActive.toString()} className="flex justify-between items-center py-2 border-b">
                        <span className={`font-medium ${stat.isActive ? 'text-green-600' : 'text-gray-600'}`}>
                          {stat.isActive ? 'Active Medications' : 'Inactive Medications'}
                        </span>
                        <span className="text-blue-600 font-semibold">{stat._count.id}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-semibold mb-4">Incident Compliance Status</h3>
                  <div className="space-y-2">
                    {complianceData.incidentCompliance?.map((stat: any) => (
                      <div key={stat.legalComplianceStatus} className="flex justify-between items-center py-2 border-b">
                        <span className={`font-medium ${
                          stat.legalComplianceStatus === 'COMPLIANT' ? 'text-green-600' :
                          stat.legalComplianceStatus === 'NON_COMPLIANT' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {stat.legalComplianceStatus}
                        </span>
                        <span className="text-blue-600 font-semibold">{stat._count.id}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Recent HIPAA Audit Logs</h3>
                <div className="space-y-2">
                  {complianceData.hipaaLogs?.slice(0, 10).map((log: any, index: number) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b text-sm">
                      <div>
                        <span className="font-medium">{log.action}</span>
                        <span className="text-gray-500 ml-2">on {log.entityType}</span>
                        {log.entityId && <span className="text-gray-400 ml-1">#{log.entityId.substring(0, 8)}</span>}
                      </div>
                      <span className="text-gray-500">{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Custom Reports Tab */}
      {activeTab === 'custom' && (
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Custom Report Builder</h3>
            <p className="text-gray-600 mb-6">
              Build custom reports with drag-and-drop interface and export in multiple formats
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Report Type
                </label>
                <select
                  value={customReportType}
                  onChange={(e) => setCustomReportType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="students">Students Report</option>
                  <option value="medications">Medications Report</option>
                  <option value="incidents">Incidents Report</option>
                  <option value="appointments">Appointments Report</option>
                  <option value="inventory">Inventory Report</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleExportReport('csv')}
                  className="btn-secondary flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as CSV
                </button>
                <button
                  onClick={() => handleExportReport('pdf')}
                  className="btn-secondary flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as PDF
                </button>
                <button
                  onClick={() => handleExportReport('excel')}
                  className="btn-secondary flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as Excel
                </button>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Available Export Formats</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <FileText className="h-8 w-8 text-blue-600 mb-2" />
                <h4 className="font-semibold mb-1">CSV Format</h4>
                <p className="text-sm text-gray-600">Comma-separated values for spreadsheet applications</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <FileText className="h-8 w-8 text-red-600 mb-2" />
                <h4 className="font-semibold mb-1">PDF Format</h4>
                <p className="text-sm text-gray-600">Formatted documents for printing and sharing</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <FileText className="h-8 w-8 text-green-600 mb-2" />
                <h4 className="font-semibold mb-1">Excel Format</h4>
                <p className="text-sm text-gray-600">Microsoft Excel workbooks with formatting</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Export Report</h3>
            <p className="text-gray-600 mb-4">Choose a format to export the current report</p>
            <div className="space-y-2 mb-6">
              <button
                onClick={() => handleExportReport('csv')}
                className="w-full btn-secondary justify-center"
              >
                Export as CSV
              </button>
              <button
                onClick={() => handleExportReport('pdf')}
                className="w-full btn-secondary justify-center"
              >
                Export as PDF
              </button>
              <button
                onClick={() => handleExportReport('excel')}
                className="w-full btn-secondary justify-center"
              >
                Export as Excel
              </button>
            </div>
            <button
              onClick={() => setShowExportModal(false)}
              className="w-full btn-secondary justify-center"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}