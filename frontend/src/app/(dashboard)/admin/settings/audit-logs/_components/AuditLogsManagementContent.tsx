/**
 * Audit Logs Management Content Component - Client-side audit logs table
 *
 * @module app/admin/settings/audit-logs/_components/AuditLogsManagementContent
 * @since 2025-11-05
 */

'use client'

import { useState, useTransition } from 'react'
import { Search, Download, Calendar, Archive } from 'lucide-react'
import toast from 'react-hot-toast'
import { exportAuditLogs, archiveAuditLogs, type AuditLog } from '@/lib/actions/admin.audit-logs'
import { formatDateTime } from '@/lib/admin-utils'

interface AuditLogsManagementContentProps {
  initialLogs: AuditLog[]
  totalCount: number
  filterOptions: {
    actions: string[]
    resources: string[]
  }
}

export default function AuditLogsManagementContent({ 
  initialLogs, 
  totalCount,
  filterOptions 
}: AuditLogsManagementContentProps) {
  const [logs] = useState(initialLogs)
  const [searchQuery, setSearchQuery] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [resourceFilter, setResourceFilter] = useState('all')
  const [dateRange, setDateRange] = useState('7days')
  const [isPending, startTransition] = useTransition()

  const filteredLogs = logs.filter((log: AuditLog) =>
    (searchQuery === '' ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (actionFilter === 'all' || log.action.includes(actionFilter)) &&
    (resourceFilter === 'all' || log.resource === resourceFilter)
  )

  const handleExport = (format: 'csv' | 'json' | 'pdf' = 'csv') => {
    startTransition(async () => {
      try {
        const result = await exportAuditLogs({
          action: actionFilter !== 'all' ? actionFilter : undefined,
          resource: resourceFilter !== 'all' ? resourceFilter : undefined,
          dateRange: dateRange as '24hours' | '7days' | '30days' | '90days',
        }, format)
        
        if (result.success) {
          toast.success(result.message)
          if (result.url) {
            window.open(result.url, '_blank')
          }
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        console.error('Error exporting audit logs:', error)
        toast.error('Failed to export audit logs')
      }
    })
  }

  const handleArchive = () => {
    if (!confirm('Are you sure you want to archive audit logs older than 90 days? This action cannot be undone.')) {
      return
    }

    startTransition(async () => {
      try {
        const result = await archiveAuditLogs(90)
        
        if (result.success) {
          toast.success(result.message)
          // Refresh the page to show updated logs
          window.location.reload()
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        console.error('Error archiving audit logs:', error)
        toast.error('Failed to archive audit logs')
      }
    })
  }

  const getActionColor = (action: string) => {
    if (action.includes('CREATE')) return 'bg-green-100 text-green-800'
    if (action.includes('UPDATE')) return 'bg-blue-100 text-blue-800'
    if (action.includes('DELETE')) return 'bg-red-100 text-red-800'
    if (action.includes('VIEW')) return 'bg-gray-100 text-gray-800'
    if (action.includes('EXPORT')) return 'bg-purple-100 text-purple-800'
    return 'bg-orange-100 text-orange-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Audit Logs</h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredLogs.length} of {totalCount} log entries
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleArchive}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <Archive className="h-4 w-4" />
            Archive Old Logs
          </button>
          <div className="relative">
            <button
              onClick={() => handleExport('csv')}
              disabled={isPending}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {isPending ? 'Exporting...' : 'Export'}
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action Filter */}
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Actions</option>
            {filterOptions.actions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>

          {/* Date Range */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="24hours">Last 24 Hours</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLogs.map((log: AuditLog) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {formatDateTime(log.timestamp)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                    <div className="text-sm text-gray-500">{log.userRole}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{log.resource}</div>
                    {log.resourceId && (
                      <div className="text-sm text-gray-500">ID: {log.resourceId}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {log.ipAddress || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No audit logs found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or date range.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
