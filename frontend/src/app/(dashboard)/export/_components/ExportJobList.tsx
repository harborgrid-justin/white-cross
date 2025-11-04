/**
 * ExportJobList Component
 *
 * Displays and manages export jobs with:
 * - Job status indicators (pending, processing, completed, failed)
 * - Search and filter capabilities
 * - Download actions for completed exports
 * - HIPAA approval badges
 * - Job details and metadata
 *
 * @component ExportJobList
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Calendar,
  Pill,
  Shield,
  Eye,
  AlertTriangle,
  Search,
  MoreVertical,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export interface ExportJob {
  id: string;
  name: string;
  type: 'health-records' | 'medications' | 'appointments' | 'incidents' | 'compliance';
  format: 'csv' | 'xlsx' | 'pdf' | 'json';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created: string;
  completed?: string;
  fileSize?: string;
  recordCount: number;
  requestedBy: string;
  hipaaApproved: boolean;
}

interface ExportJobListProps {
  jobs: ExportJob[];
  onDownload?: (jobId: string) => void;
  onView?: (jobId: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const getTypeIcon = (type: ExportJob['type']) => {
  switch (type) {
    case 'health-records': return FileText;
    case 'medications': return Pill;
    case 'appointments': return Calendar;
    case 'incidents': return AlertTriangle;
    case 'compliance': return Shield;
    default: return FileText;
  }
};

const getFormatIcon = (format: ExportJob['format']) => {
  switch (format) {
    case 'xlsx':
    case 'csv':
      return FileSpreadsheet;
    case 'pdf':
    case 'json':
      return FileText;
    default:
      return FileText;
  }
};

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'completed', label: 'Completed' },
  { value: 'processing', label: 'Processing' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' }
] as const;

export default function ExportJobList({
  jobs,
  onDownload,
  onView,
  onLoadMore,
  hasMore = false
}: ExportJobListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter jobs based on search and status
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = searchQuery === '' ||
        job.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchQuery, statusFilter]);

  const handleDownload = (jobId: string) => {
    onDownload?.(jobId);
  };

  const handleView = (jobId: string) => {
    onView?.(jobId);
  };

  const getBadgeVariant = (status: ExportJob['status']) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'info';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Export Jobs</CardTitle>
          <div className="flex items-center space-x-2">
            {/* Search Input */}
            <div className="relative">
              <Search
                className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <Input
                placeholder="Search exports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
                aria-label="Search export jobs"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as string)}
              options={STATUS_OPTIONS}
              className="w-32"
              aria-label="Filter by status"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredJobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No export jobs found</p>
            {searchQuery && (
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredJobs.map((job) => {
              const TypeIcon = getTypeIcon(job.type);
              const FormatIcon = getFormatIcon(job.format);

              return (
                <div
                  key={job.id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {/* Type Icon */}
                  <div className="flex-shrink-0">
                    <TypeIcon className="h-8 w-8 text-gray-600" aria-hidden="true" />
                  </div>

                  {/* Job Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {job.name}
                      </h4>
                      <div className="flex items-center space-x-2">
                        {job.hipaaApproved && (
                          <Shield
                            className="h-4 w-4 text-green-600"
                            aria-label="HIPAA approved"
                            title="HIPAA approved"
                          />
                        )}
                        <Badge variant={getBadgeVariant(job.status)}>
                          {job.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <FormatIcon className="h-4 w-4" aria-hidden="true" />
                        <span>{job.format.toUpperCase()}</span>
                      </div>
                      <span>{job.recordCount} records</span>
                      {job.fileSize && <span>{job.fileSize}</span>}
                      <span>by {job.requestedBy}</span>
                    </div>

                    <div className="mt-2 text-xs text-gray-400">
                      Created: {new Date(job.created).toLocaleString()}
                      {job.completed && (
                        <> • Completed: {new Date(job.completed).toLocaleString()}</>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex-shrink-0 flex items-center space-x-1">
                    {job.status === 'completed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(job.id)}
                        aria-label={`Download ${job.name}`}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(job.id)}
                      aria-label={`View ${job.name} details`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`More options for ${job.name}`}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              className="w-full"
              onClick={onLoadMore}
            >
              Load More Export Jobs
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
