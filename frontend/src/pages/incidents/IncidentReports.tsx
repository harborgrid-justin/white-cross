/**
 * Incident Reports Page - White Cross Healthcare Platform
 * Comprehensive incident management and reporting
 *
 * @fileoverview Main incident reports list page with search, filter, and management
 * @module pages/incidents/IncidentReports
 * @version 1.0.0
 */

import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  FileText,
  Calendar,
  Users,
  Clock,
  ChevronDown,
  X
} from 'lucide-react'
import { useAuthContext } from '../../contexts/AuthContext'

/**
 * Incident Report Interface
 */
export interface IncidentReport {
  id: string
  incidentNumber: string
  title: string
  description: string
  type: 'INJURY' | 'ILLNESS' | 'BEHAVIORAL' | 'SAFETY' | 'MEDICAL_EMERGENCY' | 'OTHER'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED'
  studentId: string
  studentName: string
  reportedBy: string
  reportedByRole: string
  incidentDate: string
  incidentTime: string
  location: string
  witnessCount: number
  actionsTaken: string
  followUpRequired: boolean
  parentNotified: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Filter State Interface
 */
interface FilterState {
  search: string
  type: string
  severity: string
  status: string
  dateFrom: string
  dateTo: string
  followUpRequired: boolean | null
  parentNotified: boolean | null
}

/**
 * Incident Reports Page Component
 *
 * Features:
 * - Comprehensive incident list with filtering
 * - Search across multiple fields
 * - Status and severity badges
 * - Pagination
 * - Export functionality
 * - Role-based permissions
 * - Responsive design
 * - Loading and error states
 */
const IncidentReports: React.FC = () => {
  const { user } = useAuthContext()
  const navigate = useNavigate()

  // State management
  const [reports, setReports] = useState<IncidentReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: 'all',
    severity: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: '',
    followUpRequired: null,
    parentNotified: null
  })

  // Mock data - TODO: Replace with actual API call
  const mockReports: IncidentReport[] = [
    {
      id: '1',
      incidentNumber: 'INC-2024-001',
      title: 'Playground Fall - Minor Injury',
      description: 'Student fell from swing set, sustained minor scrape on left knee',
      type: 'INJURY',
      severity: 'LOW',
      status: 'RESOLVED',
      studentId: 'STU-001',
      studentName: 'John Smith',
      reportedBy: 'Sarah Johnson',
      reportedByRole: 'Nurse',
      incidentDate: '2024-10-23',
      incidentTime: '10:30',
      location: 'Playground',
      witnessCount: 2,
      actionsTaken: 'Applied first aid, cleaned wound, applied bandage',
      followUpRequired: false,
      parentNotified: true,
      createdAt: '2024-10-23T10:35:00Z',
      updatedAt: '2024-10-23T11:00:00Z'
    },
    {
      id: '2',
      incidentNumber: 'INC-2024-002',
      title: 'Severe Allergic Reaction',
      description: 'Student had severe allergic reaction to peanuts in cafeteria',
      type: 'MEDICAL_EMERGENCY',
      severity: 'CRITICAL',
      status: 'UNDER_REVIEW',
      studentId: 'STU-002',
      studentName: 'Emily Davis',
      reportedBy: 'Maria Garcia',
      reportedByRole: 'Nurse',
      incidentDate: '2024-10-24',
      incidentTime: '12:15',
      location: 'Cafeteria',
      witnessCount: 5,
      actionsTaken: 'EpiPen administered, 911 called, student transported to hospital',
      followUpRequired: true,
      parentNotified: true,
      createdAt: '2024-10-24T12:20:00Z',
      updatedAt: '2024-10-24T12:45:00Z'
    },
    {
      id: '3',
      incidentNumber: 'INC-2024-003',
      title: 'Behavioral Incident - Classroom Disruption',
      description: 'Student exhibited disruptive behavior during class',
      type: 'BEHAVIORAL',
      severity: 'MEDIUM',
      status: 'SUBMITTED',
      studentId: 'STU-003',
      studentName: 'Michael Brown',
      reportedBy: 'Robert Wilson',
      reportedByRole: 'Teacher',
      incidentDate: '2024-10-24',
      incidentTime: '14:00',
      location: 'Room 205',
      witnessCount: 1,
      actionsTaken: 'Student removed from classroom, counselor notified',
      followUpRequired: true,
      parentNotified: false,
      createdAt: '2024-10-24T14:10:00Z',
      updatedAt: '2024-10-24T14:10:00Z'
    }
  ]

  // Load incident reports
  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true)
        setError(null)

        // TODO: Replace with actual API call
        // const response = await incidentApi.getAll()

        // Simulate API delay
        setTimeout(() => {
          setReports(mockReports)
          setLoading(false)
        }, 1000)
      } catch (err) {
        console.error('Error loading incident reports:', err)
        setError('Failed to load incident reports. Please try again.')
        setLoading(false)
      }
    }

    loadReports()
  }, [])

  // Filter reports
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          report.incidentNumber.toLowerCase().includes(searchLower) ||
          report.title.toLowerCase().includes(searchLower) ||
          report.studentName.toLowerCase().includes(searchLower) ||
          report.description.toLowerCase().includes(searchLower) ||
          report.location.toLowerCase().includes(searchLower)

        if (!matchesSearch) return false
      }

      // Type filter
      if (filters.type !== 'all' && report.type !== filters.type) return false

      // Severity filter
      if (filters.severity !== 'all' && report.severity !== filters.severity) return false

      // Status filter
      if (filters.status !== 'all' && report.status !== filters.status) return false

      // Date range filter
      if (filters.dateFrom && report.incidentDate < filters.dateFrom) return false
      if (filters.dateTo && report.incidentDate > filters.dateTo) return false

      // Follow-up filter
      if (filters.followUpRequired !== null && report.followUpRequired !== filters.followUpRequired) return false

      // Parent notification filter
      if (filters.parentNotified !== null && report.parentNotified !== filters.parentNotified) return false

      return true
    })
  }, [reports, filters])

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage)

  // Permission checks
  const canCreate = user?.role === 'ADMIN' || user?.role === 'NURSE' || user?.role === 'COUNSELOR'
  const canEdit = user?.role === 'ADMIN' || user?.role === 'NURSE'
  const canExport = user?.role === 'ADMIN' || user?.role === 'NURSE' || user?.role === 'SCHOOL_ADMIN'

  // Handlers
  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting incident reports...')
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      severity: 'all',
      status: 'all',
      dateFrom: '',
      dateTo: '',
      followUpRequired: null,
      parentNotified: null
    })
  }

  const hasActiveFilters = filters.search || filters.type !== 'all' || filters.severity !== 'all' ||
    filters.status !== 'all' || filters.dateFrom || filters.dateTo ||
    filters.followUpRequired !== null || filters.parentNotified !== null

  // Get severity badge color
  const getSeverityColor = (severity: IncidentReport['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Get status badge color
  const getStatusColor = (status: IncidentReport['status']) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'UNDER_REVIEW':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'RESOLVED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'CLOSED':
        return 'bg-slate-100 text-slate-800 border-slate-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-96 bg-gray-200 rounded"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded"></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
          <h3 className="text-lg font-medium text-red-800">Error Loading Incident Reports</h3>
        </div>
        <p className="mt-2 text-sm text-red-700">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Incident Reports</h1>
          <p className="mt-1 text-gray-600">
            Manage and track incident reports across your schools
          </p>
        </div>
        <div className="flex space-x-3">
          {canExport && (
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          )}
          {canCreate && (
            <Link
              to="/incident-reports/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Report
            </Link>
          )}
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by incident number, student name, description, or location..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium ${
                hasActiveFilters || showFilters
                  ? 'border-blue-500 text-blue-700 bg-blue-50'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="INJURY">Injury</option>
                  <option value="ILLNESS">Illness</option>
                  <option value="BEHAVIORAL">Behavioral</option>
                  <option value="SAFETY">Safety</option>
                  <option value="MEDICAL_EMERGENCY">Medical Emergency</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <select
                  value={filters.severity}
                  onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Severities</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="DRAFT">Draft</option>
                  <option value="SUBMITTED">Submitted</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Follow-Up Required</label>
                <select
                  value={filters.followUpRequired === null ? 'all' : filters.followUpRequired.toString()}
                  onChange={(e) => setFilters({
                    ...filters,
                    followUpRequired: e.target.value === 'all' ? null : e.target.value === 'true'
                  })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="flex items-center text-sm text-gray-500">
            <FileText className="h-4 w-4 mr-2" />
            {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''} found
            {hasActiveFilters && ` (filtered from ${reports.length})`}
          </div>
        </div>
      </div>

      {/* Reports List */}
      {paginatedReports.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No incident reports found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {hasActiveFilters
                ? 'Try adjusting your filters to find what you\'re looking for.'
                : 'Get started by creating a new incident report.'}
            </p>
            {canCreate && !hasActiveFilters && (
              <div className="mt-6">
                <Link
                  to="/incident-reports/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Report
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Incident
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Follow-Up
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{report.title}</div>
                        <div className="text-sm text-gray-500">{report.incidentNumber}</div>
                        <div className="text-xs text-gray-400 mt-1">{report.location}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{report.studentName}</div>
                      <div className="text-sm text-gray-500">Reported by: {report.reportedBy}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {report.type.replace(/_/g, ' ')}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(report.severity)}`}>
                          {report.severity}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                        {report.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {new Date(report.incidentDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        {report.incidentTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {report.followUpRequired && (
                          <div className="flex items-center text-xs text-orange-600">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Follow-up needed
                          </div>
                        )}
                        {report.parentNotified && (
                          <div className="flex items-center text-xs text-green-600">
                            <Users className="h-3 w-3 mr-1" />
                            Parent notified
                          </div>
                        )}
                        {report.witnessCount > 0 && (
                          <div className="text-xs text-gray-500">
                            {report.witnessCount} witness{report.witnessCount !== 1 ? 'es' : ''}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/incident-reports/${report.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        {canEdit && (
                          <Link
                            to={`/incident-reports/${report.id}/edit`}
                            className="text-gray-600 hover:text-gray-900"
                            title="Edit Report"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(startIndex + itemsPerPage, filteredReports.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredReports.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default IncidentReports
