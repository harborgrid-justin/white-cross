import React, { useState, useEffect } from 'react'
import { 
  AlertTriangle, 
  Camera, 
  FileText, 
  Bell, 
  Plus, 
  Eye, 
  CheckCircle,
  Clock,
  Shield,
  FileSignature,
  Users,
  Download,
  Upload,
  Send
} from 'lucide-react'
import { incidentReportApi } from '../services/incidentReportApi'
import { IncidentReport } from '../types'
import toast from 'react-hot-toast'

export default function IncidentReports() {
  const [reports, setReports] = useState<IncidentReport[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'list' | 'details'>('overview')

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    try {
      setLoading(true)
      const data = await incidentReportApi.getAll(1, 20)
      setReports(data.reports)
    } catch (error) {
      console.error('Failed to load incident reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateReport = () => {
    setShowCreateModal(true)
  }

  const handleViewReport = async (reportId: string) => {
    try {
      const data = await incidentReportApi.getById(reportId)
      setSelectedReport(data.report)
      setActiveTab('details')
    } catch (error) {
      toast.error('Failed to load incident report')
    }
  }

  const handleGenerateDocument = async (reportId: string) => {
    try {
      const data = await incidentReportApi.generateDocument(reportId)
      toast.success('Document generated successfully')
      console.log('Generated document:', data.document)
    } catch (error) {
      toast.error('Failed to generate document')
    }
  }

  const handleNotifyParent = async (reportId: string, method: 'email' | 'sms' | 'voice') => {
    try {
      await incidentReportApi.notifyParent(reportId, method)
      toast.success(`Parent notified via ${method}`)
      loadReports()
    } catch (error) {
      toast.error('Failed to notify parent')
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-600 bg-red-100'
      case 'HIGH': return 'text-orange-600 bg-orange-100'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100'
      case 'LOW': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'COMPLIANT': return 'text-green-600 bg-green-100'
      case 'NON_COMPLIANT': return 'text-red-600 bg-red-100'
      case 'UNDER_REVIEW': return 'text-yellow-600 bg-yellow-100'
      case 'PENDING': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (activeTab === 'overview') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Incident Reporting</h1>
            <p className="text-gray-600">Comprehensive incident documentation, management, and compliance</p>
          </div>
          <button 
            onClick={handleCreateReport}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Report Incident
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <FileText className="h-8 w-8 text-red-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Documentation</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Incident documentation</li>
              <li>✓ Automated injury reports</li>
              <li>✓ Witness statements</li>
              <li>✓ Timeline tracking</li>
            </ul>
          </div>

          <div className="card p-6">
            <Camera className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Evidence Collection</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Photo/video upload</li>
              <li>✓ Document management</li>
              <li>✓ Evidence timestamping</li>
              <li>✓ Secure storage</li>
            </ul>
          </div>

          <div className="card p-6">
            <Bell className="h-8 w-8 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Notifications</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Parent notification automation</li>
              <li>✓ Staff alerts</li>
              <li>✓ Follow-up reminders</li>
              <li>✓ Multi-channel delivery</li>
            </ul>
          </div>

          <div className="card p-6">
            <Shield className="h-8 w-8 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Compliance</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Legal compliance tracking</li>
              <li>✓ Insurance claim integration</li>
              <li>✓ Regulatory reporting</li>
              <li>✓ Complete audit trail</li>
            </ul>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Incidents</h3>
            <button 
              onClick={() => setActiveTab('list')}
              className="text-blue-600 hover:text-blue-700"
            >
              View All →
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading incidents...</div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No incident reports found.</p>
              <button 
                onClick={handleCreateReport}
                className="mt-4 btn-primary"
              >
                Create First Report
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.slice(0, 5).map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(report.severity)}`}>
                          {report.severity}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{report.type}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Student: {report.student?.firstName} {report.student?.lastName}</span>
                        <span>Location: {report.location}</span>
                        <span>{new Date(report.occurredAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewReport(report.id)}
                      className="ml-4 text-blue-600 hover:text-blue-700"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (activeTab === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <button 
              onClick={() => setActiveTab('overview')}
              className="text-blue-600 hover:text-blue-700 mb-2"
            >
              ← Back to Overview
            </button>
            <h1 className="text-2xl font-bold text-gray-900">All Incident Reports</h1>
          </div>
          <button 
            onClick={handleCreateReport}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Report Incident
          </button>
        </div>

        <div className="card p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading incidents...</div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(report.severity)}`}>
                          {report.severity}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{report.type}</span>
                        {(report as any).legalComplianceStatus && (
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getComplianceColor((report as any).legalComplianceStatus)}`}>
                            {(report as any).legalComplianceStatus}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Student: {report.student?.firstName} {report.student?.lastName}</span>
                        <span>Location: {report.location}</span>
                        <span>{new Date(report.occurredAt).toLocaleDateString()}</span>
                        {report.parentNotified && <span className="text-green-600">✓ Parent Notified</span>}
                        {(report as any).insuranceClaimNumber && <span className="text-blue-600">Insurance: {(report as any).insuranceClaimNumber}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleGenerateDocument(report.id)}
                        className="text-purple-600 hover:text-purple-700"
                        title="Generate Document"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleViewReport(report.id)}
                        className="text-blue-600 hover:text-blue-700"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (activeTab === 'details' && selectedReport) {
    return (
      <div className="space-y-6">
        <div>
          <button 
            onClick={() => setActiveTab('list')}
            className="text-blue-600 hover:text-blue-700 mb-2"
          >
            ← Back to List
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Incident Report Details</h1>
              <p className="text-gray-600">Report ID: INC-{selectedReport.id.slice(-8).toUpperCase()}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleGenerateDocument(selectedReport.id)}
                className="btn-primary flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Incident Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <p className="text-gray-900">{selectedReport.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Severity</label>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getSeverityColor(selectedReport.severity)}`}>
                    {selectedReport.severity}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Student</label>
                  <p className="text-gray-900">{selectedReport.student?.firstName} {selectedReport.student?.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Occurred At</label>
                  <p className="text-gray-900">{new Date(selectedReport.occurredAt).toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <p className="text-gray-900">{selectedReport.location}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="text-gray-900">{selectedReport.description}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">Actions Taken</label>
                  <p className="text-gray-900">{selectedReport.actionsTaken}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Witness Statements
                </h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm">
                  + Add Statement
                </button>
              </div>
              {(selectedReport as any).witnessStatements && (selectedReport as any).witnessStatements.length > 0 ? (
                <div className="space-y-3">
                  {(selectedReport as any).witnessStatements.map((statement: any) => (
                    <div key={statement.id} className="border rounded p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{statement.witnessName}</p>
                          <p className="text-sm text-gray-600">{statement.witnessType}</p>
                        </div>
                        {statement.verified ? (
                          <span className="text-green-600 text-sm flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Verified
                          </span>
                        ) : (
                          <button className="text-blue-600 text-sm">Verify</button>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">{statement.statement}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No witness statements recorded</p>
              )}
            </div>

            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Evidence
                </h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm">
                  <Upload className="h-4 w-4 inline mr-1" />
                  Upload Evidence
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Photos ({selectedReport.evidencePhotos?.length || 0})</label>
                  <div className="text-gray-600">
                    {(selectedReport.evidencePhotos?.length || 0) > 0 ? 'Photos available' : 'No photos uploaded'}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Videos ({(selectedReport as any).evidenceVideos?.length || 0})</label>
                  <div className="text-gray-600">
                    {((selectedReport as any).evidenceVideos?.length || 0) > 0 ? 'Videos available' : 'No videos uploaded'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Parent Notification
              </h3>
              {selectedReport.parentNotified ? (
                <div className="space-y-2">
                  <p className="text-green-600 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Parent Notified
                  </p>
                  {selectedReport.parentNotificationMethod && (
                    <p className="text-sm text-gray-600">Via: {selectedReport.parentNotificationMethod}</p>
                  )}
                  {selectedReport.parentNotifiedAt && (
                    <p className="text-sm text-gray-600">
                      At: {new Date(selectedReport.parentNotifiedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-600 mb-3">Send notification to parent:</p>
                  <button
                    onClick={() => handleNotifyParent(selectedReport.id, 'email')}
                    className="w-full btn-primary text-sm"
                  >
                    <Send className="h-4 w-4 mr-2 inline" />
                    Send Email
                  </button>
                  <button
                    onClick={() => handleNotifyParent(selectedReport.id, 'sms')}
                    className="w-full btn-primary text-sm"
                  >
                    <Send className="h-4 w-4 mr-2 inline" />
                    Send SMS
                  </button>
                </div>
              )}
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Compliance & Insurance
              </h3>
              <div className="space-y-3">
                {(selectedReport as any).legalComplianceStatus && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Compliance Status</label>
                    <span className={`block mt-1 px-2 py-1 rounded text-xs font-medium ${getComplianceColor((selectedReport as any).legalComplianceStatus)}`}>
                      {(selectedReport as any).legalComplianceStatus}
                    </span>
                  </div>
                )}
                {(selectedReport as any).insuranceClaimNumber && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Insurance Claim</label>
                    <p className="text-gray-900">{(selectedReport as any).insuranceClaimNumber}</p>
                    {(selectedReport as any).insuranceClaimStatus && (
                      <p className="text-sm text-gray-600">Status: {(selectedReport as any).insuranceClaimStatus}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Follow-up Actions
              </h3>
              {(selectedReport as any).followUpActions && (selectedReport as any).followUpActions.length > 0 ? (
                <div className="space-y-2">
                  {(selectedReport as any).followUpActions.map((action: any) => (
                    <div key={action.id} className="border rounded p-2">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium">{action.action}</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          action.status === 'COMPLETED' ? 'bg-green-100 text-green-600' :
                          action.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {action.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Due: {new Date(action.dueDate).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No follow-up actions</p>
              )}
              <button className="mt-3 text-blue-600 hover:text-blue-700 text-sm w-full">
                + Add Follow-up Action
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}