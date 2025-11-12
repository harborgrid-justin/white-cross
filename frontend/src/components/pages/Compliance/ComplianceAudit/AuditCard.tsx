/**
 * AuditCard Component
 *
 * Displays a single audit as a card with key information including
 * status, type, priority, findings, and actions.
 *
 * @module ComplianceAudit/AuditCard
 */

'use client';

import React from 'react';
import {
  User,
  MoreVertical,
  AlertTriangle,
  Star,
  Eye,
  Download
} from 'lucide-react';
import { getStatusConfig, getTypeConfig, getPriorityConfig } from './configs';
import type { ComplianceAudit } from './types';

/**
 * Props for the AuditCard component
 */
export interface AuditCardProps {
  /** The audit data to display */
  audit: ComplianceAudit;
  /** Called when the card is clicked */
  onClick?: (audit: ComplianceAudit) => void;
  /** Called when view details button is clicked */
  onViewDetails?: (audit: ComplianceAudit) => void;
  /** Called when download report button is clicked */
  onDownloadReport?: (audit: ComplianceAudit) => void;
}

/**
 * AuditCard Component
 *
 * Renders a comprehensive audit card with all relevant information
 * including status, type, priority, auditor, progress, findings,
 * and available actions.
 *
 * @param props - AuditCard component props
 * @returns JSX element representing an audit card
 */
export const AuditCard: React.FC<AuditCardProps> = ({
  audit,
  onClick,
  onViewDetails,
  onDownloadReport
}) => {
  const statusConfig = getStatusConfig(audit.status);
  const typeConfig = getTypeConfig(audit.type);
  const priorityConfig = getPriorityConfig(audit.priority);
  const StatusIcon = statusConfig.icon;
  const TypeIcon = typeConfig.icon;

  const openFindings = audit.findings.filter(f => f.status === 'open').length;
  const criticalFindings = audit.findings.filter(f => f.severity === 'critical').length;

  /**
   * Handles card click event
   */
  const handleCardClick = () => {
    onClick?.(audit);
  };

  /**
   * Handles keyboard navigation
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(audit);
    }
  };

  /**
   * Handles view details button click
   */
  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails?.(audit);
  };

  /**
   * Handles download report button click
   */
  const handleDownloadReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownloadReport?.(audit);
  };

  /**
   * Handles more actions button click
   */
  const handleMoreActions = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle more actions menu
  };

  /**
   * Formats date for display
   */
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`Audit: ${audit.title}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <TypeIcon className="w-4 h-4 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {audit.title}
            </h3>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {audit.description}
          </p>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeConfig.color}`}>
              {typeConfig.label}
            </span>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig.label}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${priorityConfig.dot}`}></div>
            <span className={`text-xs font-medium capitalize ${priorityConfig.color}`}>
              {audit.priority}
            </span>
          </div>

          <button
            onClick={handleMoreActions}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
            aria-label="More actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Auditor */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-gray-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{audit.auditor.name}</p>
          <p className="text-xs text-gray-500">{audit.auditor.organization || audit.auditor.email}</p>
        </div>
      </div>

      {/* Progress Bar */}
      {audit.status === 'in-progress' && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">{audit.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${audit.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">{audit.findings.length}</p>
          <p className="text-xs text-gray-500">Total Findings</p>
        </div>

        <div className="text-center">
          <p className={`text-lg font-bold ${openFindings > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {openFindings}
          </p>
          <p className="text-xs text-gray-500">Open</p>
        </div>
      </div>

      {/* Critical Findings Alert */}
      {criticalFindings > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
            <span className="text-sm font-medium text-red-800">
              {criticalFindings} critical finding{criticalFindings !== 1 ? 's' : ''} require immediate attention
            </span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          {audit.status === 'scheduled' ? (
            <span>Scheduled for {formatDate(audit.scheduledDate)}</span>
          ) : audit.status === 'completed' && audit.completedDate ? (
            <span>Completed {formatDate(audit.completedDate)}</span>
          ) : (
            <span>Updated {formatDate(audit.updatedAt)}</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {audit.score !== undefined && (
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span className="text-xs font-medium text-gray-900">{audit.score}%</span>
            </div>
          )}

          <button
            onClick={handleViewDetails}
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50
                     border border-blue-200 rounded hover:bg-blue-100"
            aria-label="View audit details"
          >
            <Eye className="w-3 h-3 mr-1" />
            View
          </button>

          {audit.status === 'completed' && (
            <button
              onClick={handleDownloadReport}
              className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-50
                       border border-gray-200 rounded hover:bg-gray-100"
              aria-label="Download audit report"
            >
              <Download className="w-3 h-3 mr-1" />
              Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditCard;
