/**
 * @fileoverview Incident Reports List - Main incident management interface
 * @module components/features/incidents/IncidentReportsList
 * @version 1.0.0
 */

'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
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
  X,
  Trash2
} from 'lucide-react'
import { toast } from 'react-hot-toast'

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

export default function IncidentReportsList() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalReports, setTotalReports] = useState(0)

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

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true)
        setError(null)

        // Build query params
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '20'
        })

        if (filters.type !== 'all') params.append('type', filters.type)
        if (filters.severity !== 'all') params.append('severity', filters.severity)
        if (filters.status !== 'all') params.append('status', filters.status)
        if (filters.dateFrom) params.append('dateFrom', filters.dateFrom)
        if (filters.dateTo) params.append('dateTo', filters.dateTo)
        if (filters.followUpRequired !== null) params.append('followUpRequired', filters.followUpRequired.toString())
        if (filters.parentNotified !== null) params.append('parentNotified', filters.parentNotified.toString())

        const response = await fetch(`/api/proxy/v1/incidents?${params}`)
        if (!response.ok) throw new Error('Failed to load incident reports')

        const data = await response.json()
        setReports(data.reports || [])
        setTotalReports(data.pagination?.total || 0)
        setTotalPages(data.pagination?.pages || 1)
      } catch (err: any) {
        console.error('Error loading incident reports:', err)
        setError(err?.message || 'Failed to load incident reports')
        toast.error('Failed to load incident reports')
      } finally {
        setLoading(false)
      }
    }

    loadReports()
  }, [currentPage, filters])

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
    setCurrentPage(1)
  }

  const hasActiveFilters = filters.search || filters.type !== 'all' || filters.severity !== 'all' ||
    filters.status !== 'all' || filters.dateFrom || filters.dateTo ||
    filters.followUpRequired !== null || filters.parentNotified !== null

  const getSeverityColor = (severity: string) => {
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

  const getStatusColor = (status: string) => {
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
        <Link
          href="/incidents/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Report
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
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
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            </div>
          )}

          <div className="flex items-center text-sm text-gray-500">
            <FileText className="h-4 w-4 mr-2" />
            {totalReports} report{totalReports !== 1 ? 's' : ''} found
            {hasActiveFilters && ` (filtered)`}
          </div>
        </div>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No incident reports found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {hasActiveFilters
                ? 'Try adjusting your filters'
                : 'Get started by creating a new incident report'}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* TODO: Render incident rows */}
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Incident list rendering - implementation in progress
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
