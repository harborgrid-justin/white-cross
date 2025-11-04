/**
 * @fileoverview Compliance Requirement Card Component - Individual compliance item display
 * @module app/(dashboard)/compliance/_components/ComplianceRequirementCard
 * @category Compliance - Components
 */

'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Calendar,
  FileText,
  AlertTriangle,
  Eye,
  Download,
  CheckCircle
} from 'lucide-react';
import type { ComplianceRequirementCardProps } from './compliance.types';
import {
  getStatusBadgeVariant,
  getStatusIcon,
  getPriorityBadgeVariant,
  getRiskColor,
  getCategoryIcon,
  getProgressBarColor,
  formatStatus,
} from './compliance.utils';

/**
 * Compliance requirement card component
 * Displays detailed information about a single compliance requirement
 * with status, progress, requirements checklist, and action buttons
 *
 * @param item - Compliance item data
 * @param onView - Optional callback when view button is clicked
 * @param onDownload - Optional callback when download button is clicked
 */
export function ComplianceRequirementCard({
  item,
  onView,
  onDownload
}: ComplianceRequirementCardProps) {
  const StatusIcon = getStatusIcon(item.status);
  const CategoryIcon = getCategoryIcon(item.category);
  const progressBarColor = getProgressBarColor(item.progress);

  const handleView = () => {
    onView?.(item.id);
  };

  const handleDownload = () => {
    onDownload?.(item.id);
  };

  return (
    <div
      className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
      role="article"
      aria-labelledby={`compliance-title-${item.id}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header with title, status, and priority */}
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <CategoryIcon
              className="h-5 w-5 text-gray-600 flex-shrink-0"
              aria-label={`${item.category} compliance category`}
            />
            <h4
              id={`compliance-title-${item.id}`}
              className="text-lg font-medium text-gray-900"
            >
              {item.title}
            </h4>
            <Badge
              variant={getStatusBadgeVariant(item.status)}
              className="text-xs"
              aria-label={`Status: ${formatStatus(item.status)}`}
            >
              <StatusIcon className="h-3 w-3 mr-1" aria-hidden="true" />
              {formatStatus(item.status)}
            </Badge>
            <Badge
              variant={getPriorityBadgeVariant(item.priority)}
              className="text-xs"
              aria-label={`Priority: ${item.priority}`}
            >
              {item.priority}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3">{item.description}</p>

          {/* Metadata row */}
          <div className="flex items-center gap-6 text-sm text-gray-500 flex-wrap">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" aria-hidden="true" />
              <span>
                <span className="sr-only">Assignee:</span>
                {item.assignee}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <span>
                <span className="sr-only">Next Audit:</span>
                {new Date(item.nextAudit).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" aria-hidden="true" />
              <span>
                {item.documents} document{item.documents !== 1 ? 's' : ''}
              </span>
            </div>
            <div className={`flex items-center gap-1 ${getRiskColor(item.riskLevel)}`}>
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              <span>
                <span className="sr-only">Risk Level:</span>
                {item.riskLevel}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="text-gray-900 font-medium" aria-label={`${item.progress} percent complete`}>
                {item.progress}%
              </span>
            </div>
            <div
              className="w-full bg-gray-200 rounded-full h-2"
              role="progressbar"
              aria-valuenow={item.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={`h-2 rounded-full transition-all duration-300 ${progressBarColor}`}
                style={{ width: `${item.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Requirements Checklist */}
          <div className="mt-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">
              Key Requirements:
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {item.requirements.map((requirement, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle
                    className="h-3 w-3 text-green-600 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-gray-600">{requirement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 ml-4 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleView}
            aria-label={`View details for ${item.title}`}
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">View</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            aria-label={`Download documents for ${item.title}`}
          >
            <Download className="h-4 w-4" />
            <span className="sr-only">Download</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
