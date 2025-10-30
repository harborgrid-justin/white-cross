'use client';

import React from 'react';
import { 
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Calendar,
  User,
  AlertCircle,
  Eye,
  Download,
  Edit3,
  MoreVertical
} from 'lucide-react';

/**
 * Compliance status types
 */
export type ComplianceStatus = 'compliant' | 'non-compliant' | 'pending' | 'expired' | 'warning';

/**
 * Compliance category types
 */
export type ComplianceCategory = 'hipaa' | 'ferpa' | 'clia' | 'osha' | 'state' | 'federal' | 'local' | 'internal';

/**
 * Compliance priority levels
 */
export type CompliancePriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Compliance requirement interface
 */
export interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  category: ComplianceCategory;
  status: ComplianceStatus;
  priority: CompliancePriority;
  dueDate: string;
  completedDate?: string;
  assignedTo: string;
  assignedToName: string;
  progress: number;
  tasks: {
    id: string;
    title: string;
    completed: boolean;
    dueDate?: string;
  }[];
  evidence: {
    id: string;
    name: string;
    type: string;
    uploadDate: string;
  }[];
  lastReview?: string;
  nextReview?: string;
  risk: {
    level: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  };
  regulations: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Props for the ComplianceCard component
 */
interface ComplianceCardProps {
  /** Compliance requirement data */
  requirement: ComplianceRequirement;
  /** Loading state */
  loading?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Click handler */
  onClick?: (requirement: ComplianceRequirement) => void;
  /** View details handler */
  onViewDetails?: (requirement: ComplianceRequirement) => void;
  /** Edit handler */
  onEdit?: (requirement: ComplianceRequirement) => void;
  /** Download evidence handler */
  onDownloadEvidence?: (requirement: ComplianceRequirement, evidenceId: string) => void;
  /** Actions menu handler */
  onActionsMenu?: (requirement: ComplianceRequirement) => void;
}

/**
 * ComplianceCard Component
 * 
 * A comprehensive card component for displaying compliance requirements with status,
 * progress tracking, evidence management, and risk assessment. Features interactive
 * elements and supports HIPAA, FERPA, CLIA, OSHA, and other regulatory standards.
 * 
 * @param props - ComplianceCard component props
 * @returns JSX element representing the compliance requirement card
 */
const ComplianceCard = ({
  requirement,
  loading = false,
  className = '',
  onClick,
  onViewDetails,
  onEdit,
  onDownloadEvidence,
  onActionsMenu
}: ComplianceCardProps) => {
  /**
   * Gets status color and icon configuration
   */
  const getStatusConfig = (status: ComplianceStatus) => {
    const configs = {
      compliant: {
        color: 'text-green-600 bg-green-100 border-green-200',
        icon: CheckCircle,
        label: 'Compliant'
      },
      'non-compliant': {
        color: 'text-red-600 bg-red-100 border-red-200',
        icon: AlertCircle,
        label: 'Non-Compliant'
      },
      pending: {
        color: 'text-yellow-600 bg-yellow-100 border-yellow-200',
        icon: Clock,
        label: 'Pending'
      },
      expired: {
        color: 'text-red-600 bg-red-100 border-red-200',
        icon: AlertTriangle,
        label: 'Expired'
      },
      warning: {
        color: 'text-orange-600 bg-orange-100 border-orange-200',
        icon: AlertTriangle,
        label: 'Warning'
      }
    };
    return configs[status];
  };

  /**
   * Gets category display information
   */
  const getCategoryConfig = (category: ComplianceCategory) => {
    const configs = {
      hipaa: { label: 'HIPAA', color: 'bg-blue-100 text-blue-800' },
      ferpa: { label: 'FERPA', color: 'bg-purple-100 text-purple-800' },
      clia: { label: 'CLIA', color: 'bg-green-100 text-green-800' },
      osha: { label: 'OSHA', color: 'bg-orange-100 text-orange-800' },
      state: { label: 'State', color: 'bg-indigo-100 text-indigo-800' },
      federal: { label: 'Federal', color: 'bg-red-100 text-red-800' },
      local: { label: 'Local', color: 'bg-gray-100 text-gray-800' },
      internal: { label: 'Internal', color: 'bg-teal-100 text-teal-800' }
    };
    return configs[category];
  };

  /**
   * Gets priority color configuration
   */
  const getPriorityConfig = (priority: CompliancePriority) => {
    const configs = {
      low: { color: 'text-gray-600', dot: 'bg-gray-400' },
      medium: { color: 'text-yellow-600', dot: 'bg-yellow-400' },
      high: { color: 'text-orange-600', dot: 'bg-orange-400' },
      critical: { color: 'text-red-600', dot: 'bg-red-400' }
    };
    return configs[priority];
  };

  /**
   * Calculates days until due date
   */
  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const statusConfig = getStatusConfig(requirement.status);
  const categoryConfig = getCategoryConfig(requirement.category);
  const priorityConfig = getPriorityConfig(requirement.priority);
  const StatusIcon = statusConfig.icon;
  const daysUntilDue = getDaysUntilDue(requirement.dueDate);
  const completedTasks = requirement.tasks.filter(task => task.completed).length;

  if (loading) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-6 animate-pulse ${className}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer ${className}`}
      onClick={() => onClick?.(requirement)}
      role="button"
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(requirement);
        }
      }}
      aria-label={`Compliance requirement: ${requirement.title}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {requirement.title}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryConfig.color}`}>
              {categoryConfig.label}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {requirement.description}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusConfig.label}
          </div>
          
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onActionsMenu?.(requirement);
            }}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
            aria-label="More actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Priority and Due Date */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${priorityConfig.dot}`}></div>
            <span className={`text-sm font-medium capitalize ${priorityConfig.color}`}>
              {requirement.priority} Priority
            </span>
          </div>
          
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Due {new Date(requirement.dueDate).toLocaleDateString()}</span>
            {daysUntilDue <= 7 && daysUntilDue > 0 && (
              <span className="text-orange-600 font-medium">
                ({daysUntilDue} days)
              </span>
            )}
            {daysUntilDue <= 0 && (
              <span className="text-red-600 font-medium">
                (Overdue)
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>{requirement.assignedToName}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">
            {completedTasks}/{requirement.tasks.length} tasks • {requirement.progress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${requirement.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Risk Level:</span>
            <span className={`text-sm font-medium capitalize ${
              requirement.risk.level === 'critical' ? 'text-red-600' :
              requirement.risk.level === 'high' ? 'text-orange-600' :
              requirement.risk.level === 'medium' ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {requirement.risk.level}
            </span>
          </div>
          
          <div className="text-sm text-gray-600">
            {requirement.evidence.length} evidence files
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
          {requirement.risk.description}
        </p>
      </div>

      {/* Regulations */}
      {requirement.regulations.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {requirement.regulations.slice(0, 3).map((regulation) => (
              <span
                key={regulation}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
              >
                {regulation}
              </span>
            ))}
            {requirement.regulations.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                +{requirement.regulations.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <span>Updated {new Date(requirement.updatedAt).toLocaleDateString()}</span>
          {requirement.nextReview && (
            <>
              <span>•</span>
              <span>Next review {new Date(requirement.nextReview).toLocaleDateString()}</span>
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onViewDetails?.(requirement);
            }}
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 
                     border border-blue-200 rounded hover:bg-blue-100"
            aria-label="View requirement details"
          >
            <Eye className="w-3 h-3 mr-1" />
            View
          </button>
          
          {requirement.evidence.length > 0 && (
            <button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onDownloadEvidence?.(requirement, requirement.evidence[0].id);
              }}
              className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-50 
                       border border-gray-200 rounded hover:bg-gray-100"
              aria-label="Download evidence"
            >
              <Download className="w-3 h-3 mr-1" />
              Evidence
            </button>
          )}
          
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onEdit?.(requirement);
            }}
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-50 
                     border border-gray-200 rounded hover:bg-gray-100"
            aria-label="Edit requirement"
          >
            <Edit3 className="w-3 h-3 mr-1" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceCard;
