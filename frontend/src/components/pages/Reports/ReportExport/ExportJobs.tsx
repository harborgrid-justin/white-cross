import React from 'react';
import { Clock, Download, X } from 'lucide-react';
import type { ExportJob, ExportFilters, ExportStatus, ExportFormat, ExportPriority } from './types';
import { getFormatIcon, getStatusDisplay, getPriorityColor, formatFileSize } from './utils';

interface ExportJobsProps {
  jobs: ExportJob[];
  filters: ExportFilters;
  onFiltersChange: (filters: ExportFilters) => void;
  onCancelJob: (jobId: string) => void;
  onDownloadFile: (jobId: string) => void;
}

export const ExportJobs: React.FC<ExportJobsProps> = ({
  jobs,
  filters,
  onFiltersChange,
  onCancelJob,
  onDownloadFile
}) => {
  // Filter jobs based on current filters
  const filteredJobs = jobs.filter(job => {
    if (filters.status !== 'all' && job.status !== filters.status) return false;
    if (filters.format !== 'all' && job.format !== filters.format) return false;
    if (filters.priority !== 'all' && job.priority !== filters.priority) return false;
    return true;
  });

  const handleFilterChange = (key: keyof ExportFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center space-x-4">
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value as ExportStatus | 'all')}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm 
                   focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Filter by status"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        
        <select
          value={filters.format}
          onChange={(e) => handleFilterChange('format', e.target.value as ExportFormat | 'all')}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm 
                   focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Filter by format"
        >
          <option value="all">All Formats</option>
          <option value="pdf">PDF</option>
          <option value="csv">CSV</option>
          <option value="xlsx">Excel</option>
          <option value="json">JSON</option>
        </select>
        
        <select
          value={filters.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value as ExportPriority | 'all')}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm 
                   focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Filter by priority"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Export Jobs</h3>
          <p className="text-gray-600">
            No export jobs match your current filters.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Export
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Started
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredJobs.map((job) => {
                  const FormatIcon = getFormatIcon(job.format);
                  const statusConfig = getStatusDisplay(job.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FormatIcon className="w-4 h-4 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{job.configName}</div>
                            <div className="text-sm text-gray-500">{job.reportName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <StatusIcon className={`w-3 h-3 mr-1 ${job.status === 'processing' ? 'animate-spin' : ''}`} />
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${
                                job.status === 'completed' ? 'bg-green-600' :
                                job.status === 'failed' ? 'bg-red-600' :
                                'bg-blue-600'
                              }`}
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{job.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(job.priority)}`}>
                          {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.fileSize ? formatFileSize(job.fileSize) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(job.startedAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {job.status === 'completed' && job.downloadUrl && (
                            <button
                              onClick={() => onDownloadFile(job.id)}
                              className="text-blue-600 hover:text-blue-900"
                              aria-label="Download file"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                          {(job.status === 'pending' || job.status === 'processing') && (
                            <button
                              onClick={() => onCancelJob(job.id)}
                              className="text-red-600 hover:text-red-900"
                              aria-label="Cancel job"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
