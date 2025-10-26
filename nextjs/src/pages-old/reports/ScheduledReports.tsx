/**
 * WF-RPT-002 | ScheduledReports.tsx - Scheduled reports management
 * Purpose: Manage automated report generation and scheduling
 * Upstream: ../services/modules/health/reportsApi | Dependencies: react
 * Downstream: Reports system | Called by: React router
 * Related: ReportsGenerate.tsx
 * Exports: default ScheduledReports component
 * Last Updated: 2025-10-21 | File Type: .tsx
 * Critical Path: View schedules → Manage schedules → Configure automation
 * LLM Context: Automated report scheduling and management interface
 */

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

interface ScheduledReport {
  id: string;
  name: string;
  reportType: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  format: 'PDF' | 'CSV' | 'XLSX';
  recipients: string[];
  lastRun?: string;
  nextRun: string;
  status: 'ACTIVE' | 'PAUSED' | 'ERROR';
  createdBy: string;
  createdAt: string;
}

const ScheduledReports: React.FC = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<ScheduledReport[]>([]);
  const [loading, setLoading] = useState(true);

  const mockSchedules: ScheduledReport[] = [
    {
      id: '1',
      name: 'Daily Health Summary',
      reportType: 'STUDENT_HEALTH_SUMMARY',
      frequency: 'DAILY',
      format: 'PDF',
      recipients: ['nurse@school.edu', 'admin@school.edu'],
      lastRun: '2025-10-21T06:00:00Z',
      nextRun: '2025-10-22T06:00:00Z',
      status: 'ACTIVE',
      createdBy: 'Admin User',
      createdAt: '2025-10-01T10:00:00Z',
    },
    {
      id: '2',
      name: 'Weekly Medication Report',
      reportType: 'MEDICATION_ADMINISTRATION',
      frequency: 'WEEKLY',
      format: 'XLSX',
      recipients: ['pharmacy@school.edu', 'supervisor@school.edu'],
      lastRun: '2025-10-14T08:00:00Z',
      nextRun: '2025-10-21T08:00:00Z',
      status: 'ACTIVE',
      createdBy: 'Nurse Manager',
      createdAt: '2025-09-15T14:30:00Z',
    },
    {
      id: '3',
      name: 'Monthly Incident Summary',
      reportType: 'INCIDENT_REPORTS',
      frequency: 'MONTHLY',
      format: 'PDF',
      recipients: ['principal@school.edu', 'safety@school.edu'],
      nextRun: '2025-11-01T09:00:00Z',
      status: 'PAUSED',
      createdBy: 'Safety Coordinator',
      createdAt: '2025-08-20T11:15:00Z',
    },
  ];

  useEffect(() => {
    const loadSchedules = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setSchedules(mockSchedules);
      setLoading(false);
    };
    loadSchedules();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800';
      case 'ERROR': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFrequencyBadge = (frequency: string) => {
    switch (frequency) {
      case 'DAILY': return 'bg-blue-100 text-blue-800';
      case 'WEEKLY': return 'bg-purple-100 text-purple-800';
      case 'MONTHLY': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleScheduleStatus = async (scheduleId: string, newStatus: 'ACTIVE' | 'PAUSED') => {
    try {
      // Mock API call
      console.log(`Setting schedule ${scheduleId} to ${newStatus}`);
      setSchedules(prev => prev.map(schedule =>
        schedule.id === scheduleId ? { ...schedule, status: newStatus } : schedule
      ));
    } catch (error) {
      console.error('Failed to update schedule status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading scheduled reports...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scheduled Reports</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage automated report generation and distribution
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Schedule
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Schedules</dt>
                  <dd className="text-lg font-medium text-gray-900">{schedules.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {schedules.filter(s => s.status === 'ACTIVE').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Paused</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {schedules.filter(s => s.status === 'PAUSED').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Next Due</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {schedules
                      .filter(s => s.status === 'ACTIVE')
                      .sort((a, b) => new Date(a.nextRun).getTime() - new Date(b.nextRun).getTime())[0]
                      ? format(new Date(schedules
                          .filter(s => s.status === 'ACTIVE')
                          .sort((a, b) => new Date(a.nextRun).getTime() - new Date(b.nextRun).getTime())[0].nextRun), 'MMM d')
                      : 'None'
                    }
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedules Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Schedule Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Frequency
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recipients
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last/Next Run
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schedules.map((schedule) => (
              <tr key={schedule.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {schedule.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {schedule.reportType.replace(/_/g, ' ')} • {schedule.format}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFrequencyBadge(schedule.frequency)}`}>
                    {schedule.frequency}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {schedule.recipients.length} recipient{schedule.recipients.length > 1 ? 's' : ''}
                  </div>
                  <div className="text-sm text-gray-500">
                    {schedule.recipients.slice(0, 2).join(', ')}
                    {schedule.recipients.length > 2 && ` +${schedule.recipients.length - 2} more`}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    {schedule.lastRun && (
                      <div className="text-gray-500">
                        Last: {format(new Date(schedule.lastRun), 'MMM d, h:mm a')}
                      </div>
                    )}
                    <div>
                      Next: {format(new Date(schedule.nextRun), 'MMM d, h:mm a')}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(schedule.status)}`}>
                    {schedule.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {schedule.status === 'ACTIVE' ? (
                    <button
                      onClick={() => toggleScheduleStatus(schedule.id, 'PAUSED')}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      Pause
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleScheduleStatus(schedule.id, 'ACTIVE')}
                      className="text-green-600 hover:text-green-900"
                    >
                      Resume
                    </button>
                  )}
                  <button className="text-blue-600 hover:text-blue-900">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {schedules.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No scheduled reports</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first automated report schedule.
            </p>
            <div className="mt-6">
              <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Schedule
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Report Activity</h3>
          <div className="flow-root">
            <ul className="-mb-8">
              <li>
                <div className="relative pb-8">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-gray-900">Daily Health Summary</span> completed successfully
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time>2 hours ago</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="relative pb-8">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-gray-900">Weekly Medication Report</span> scheduled for tomorrow at 8:00 AM
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time>1 day</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="relative">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-gray-900">Monthly Incident Summary</span> paused by Safety Coordinator
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time>3 days ago</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduledReports;
