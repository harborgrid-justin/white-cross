/**
 * WF-AC-COMP-011 | AuditLog.tsx - Audit Log Component
 * Purpose: Display security audit log entries
 * Dependencies: react, redux, lucide-react
 * Exports: AuditLog component
 * Last Updated: 2025-10-24
 */

import React, { useState } from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { selectSecurityIncidents } from '../store';
import { FileText, Search, Calendar, User, Filter } from 'lucide-react';

/**
 * AuditLog Component
 *
 * Displays comprehensive audit log:
 * - All security events and actions
 * - Filtering and search capabilities
 * - Event details and timestamps
 * - User activity tracking
 *
 * @returns React component
 */
const AuditLog: React.FC = () => {
  const incidents = useAppSelector(selectSecurityIncidents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  // Convert incidents to audit log entries
  const auditEntries = incidents.map(incident => ({
    id: incident.id,
    timestamp: incident.createdAt,
    userId: incident.userId,
    action: incident.type,
    resource: 'Security Incident',
    details: incident.description,
    severity: incident.severity
  }));

  const filteredEntries = auditEntries.filter(entry => {
    const matchesSearch = searchTerm === '' ||
      entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === '' || entry.action === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
        </div>
        <p className="mt-2 text-gray-600">
          View and search security audit trail
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <h2 className="font-medium text-gray-900">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="inline h-4 w-4 mr-1" />
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search audit log..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Events</option>
              <option value="UNAUTHORIZED_ACCESS">Unauthorized Access</option>
              <option value="DATA_BREACH">Data Breach</option>
              <option value="FAILED_LOGIN_ATTEMPTS">Failed Login</option>
              <option value="SUSPICIOUS_ACTIVITY">Suspicious Activity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Entries */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b">
          <h2 className="font-medium text-gray-900">
            Audit Entries ({filteredEntries.length})
          </h2>
        </div>
        <div className="divide-y max-h-[600px] overflow-y-auto">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => (
              <div key={entry.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                        {entry.action}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        entry.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                        entry.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {entry.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 mb-2">{entry.details}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(entry.timestamp).toLocaleString()}</span>
                      </div>
                      {entry.userId && (
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>User: {entry.userId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No audit entries found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLog;
