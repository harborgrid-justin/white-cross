'use client';

/**
 * Force dynamic rendering for real-time reports
 */


import React, { useState, useEffect } from 'react';
import { fetchReportsDashboardData } from './data';
import { type ReportHistory } from '@/types/reports';
import { useToast } from '@/hooks/use-toast';
import { FileText, Download, Search, Filter, Plus, Calendar, BarChart3 } from 'lucide-react';

/**
 * Reports Main Page
 * 
 * Comprehensive reporting dashboard for generating and managing
 * health and compliance reports.
 */
export default function ReportsPage() {
  const [reports, setReports] = useState<ReportHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const { toast } = useToast();

  /**
   * Load reports data from API
   */
  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      
      try {
        const filters = {
          search: searchTerm.trim() || undefined,
          type: selectedType || undefined,
          status: selectedStatus || undefined
        };
        
        const { reports: reportsData, error } = 
          await fetchReportsDashboardData(filters);
        
        setReports(reportsData);
        
        if (error) {
          toast({
            title: 'Error',
            description: error,
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Failed to load reports:', error);
        toast({
          title: 'Error',
          description: 'Failed to load reports. Please try again.',
          variant: 'destructive',
        });
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [searchTerm, selectedType, selectedStatus, toast]);

  const handleCreateReport = () => {
    window.location.href = '/dashboard/reports/new';
  };

  const handleViewReport = (report: ReportHistory) => {
    window.location.href = `/dashboard/reports/${report.id}`;
  };

  const handleDownloadReport = async (report: ReportHistory) => {
    try {
      if (report.fileUrl) {
        const link = document.createElement('a');
        link.href = report.fileUrl;
        link.download = `${report.title}.pdf`;
        link.click();
        
        toast({
          title: 'Success',
          description: 'Report downloaded successfully.',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Report file not available for download.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to download report:', error);
      toast({
        title: 'Error',
        description: 'Failed to download report. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      draft: 'bg-gray-100 text-gray-800',
      generating: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      scheduled: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles] || statusStyles.draft}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeStyles = {
      'health-summary': 'bg-blue-100 text-blue-800',
      'immunization-status': 'bg-green-100 text-green-800',
      'medication-compliance': 'bg-purple-100 text-purple-800',
      'incident-report': 'bg-red-100 text-red-800',
      'attendance-health': 'bg-yellow-100 text-yellow-800',
      'annual-summary': 'bg-indigo-100 text-indigo-800',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeStyles[type as keyof typeof typeStyles] || typeStyles['health-summary']}`}>
        {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </span>
    );
  };

  const getRecentReports = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return reports.filter(report => 
      new Date(report.createdAt) >= sevenDaysAgo
    ).length;
  };

  const getCompletedReports = () => {
    return reports.filter(report => report.fileUrl).length;
  };

  const getPendingReports = () => {
    return reports.filter(report => !report.fileUrl).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
              <p className="text-gray-600 mt-2">Generate and manage health and compliance reports</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCreateReport}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-700">Recent Reports</h3>
            <p className="text-2xl font-bold text-blue-600">{getRecentReports()}</p>
            <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-700">Completed</h3>
            <p className="text-2xl font-bold text-green-600">{getCompletedReports()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-700">Pending</h3>
            <p className="text-2xl font-bold text-yellow-600">{getPendingReports()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-700">Total Reports</h3>
            <p className="text-2xl font-bold text-gray-600">{reports.length}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-medium text-gray-900">Health Summary</h3>
                <p className="text-sm text-gray-600">Generate comprehensive health overview</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-medium text-gray-900">Immunization Report</h3>
                <p className="text-sm text-gray-600">Track vaccination compliance</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-purple-600" />
              <div>
                <h3 className="font-medium text-gray-900">Incident Reports</h3>
                <p className="text-sm text-gray-600">Review health incidents</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Search Reports
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                placeholder="Search by title, type..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Report Type
              </label>
              <select
                id="type"
                value={selectedType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="health-summary">Health Summary</option>
                <option value="immunization-status">Immunization Status</option>
                <option value="medication-compliance">Medication Compliance</option>
                <option value="incident-report">Incident Report</option>
                <option value="attendance-health">Attendance Health</option>
                <option value="annual-summary">Annual Summary</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="generating">Generating</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by generating your first report or adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                            onClick={() => handleViewReport(report)}>
                          {report.title}
                        </h3>
                        {getTypeBadge(report.reportType)}
                        {report.fileUrl ? getStatusBadge('completed') : getStatusBadge('pending')}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Created: {formatDate(report.createdAt)}
                        </div>
                        {report.lastAccessedAt && (
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Last accessed: {formatDate(report.lastAccessedAt)}
                          </div>
                        )}
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          {report.generatedBy}
                        </div>
                      </div>
                      {report.fileSize && (
                        <p className="text-sm text-gray-500 mt-2">
                          Size: {Math.round(report.fileSize / 1024)} KB
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {report.fileUrl && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadReport(report);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </button>
                      )}
                      <button
                        onClick={() => handleViewReport(report)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
