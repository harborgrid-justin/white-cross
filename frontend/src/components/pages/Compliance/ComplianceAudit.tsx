'use client';

import React, { useState } from 'react';
import { 
  Shield,
  Search,
  FileSearch,
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Download,
  Eye,
  Filter,
  Plus,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Users,
  Building,
  Award,
  Target,
  Activity,
  TrendingUp,
  BarChart3,
  PieChart,
  FileText,
  Bookmark,
  Star,
  Flag,
  Settings,
  RefreshCw,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Globe
} from 'lucide-react';

/**
 * Audit status types
 */
export type AuditStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'overdue';

/**
 * Audit type categories  
 */
export type AuditType = 'internal' | 'external' | 'regulatory' | 'certification' | 'compliance' | 'risk';

/**
 * Audit priority levels
 */
export type AuditPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Audit finding severity
 */
export type FindingSeverity = 'critical' | 'major' | 'minor' | 'observation';

/**
 * Audit interface
 */
export interface ComplianceAudit {
  id: string;
  title: string;
  description: string;
  type: AuditType;
  status: AuditStatus;
  priority: AuditPriority;
  auditor: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    organization?: string;
    avatar?: string;
  };
  scope: string[];
  scheduledDate: string;
  startDate?: string;
  endDate?: string;
  completedDate?: string;
  findings: AuditFinding[];
  requirements: string[];
  departments: string[];
  progress: number;
  score?: number;
  recommendations: string[];
  followUpActions: {
    id: string;
    description: string;
    assignedTo: string;
    dueDate: string;
    status: 'pending' | 'in-progress' | 'completed';
  }[];
  documents: {
    id: string;
    name: string;
    type: string;
    size: number;
    uploadDate: string;
  }[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

/**
 * Audit finding interface
 */
export interface AuditFinding {
  id: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  category: string;
  requirement: string;
  evidence: string;
  recommendation: string;
  assignedTo?: string;
  dueDate?: string;
  status: 'open' | 'in-progress' | 'resolved' | 'accepted-risk';
  createdAt: string;
}

/**
 * Props for the ComplianceAudit component
 */
interface ComplianceAuditProps {
  /** Array of audit records */
  audits?: ComplianceAudit[];
  /** Array of auditors */
  auditors?: Array<{ id: string; name: string; email: string; organization?: string }>;
  /** Array of departments */
  departments?: Array<{ id: string; name: string }>;
  /** Loading state */
  loading?: boolean;
  /** Current view mode */
  viewMode?: 'list' | 'grid' | 'calendar';
  /** Search term */
  searchTerm?: string;
  /** Active filters */
  activeFilters?: {
    status: AuditStatus[];
    type: AuditType[];
    priority: AuditPriority[];
    auditor: string[];
    department: string[];
  };
  /** Custom CSS classes */
  className?: string;
  /** Audit click handler */
  onAuditClick?: (audit: ComplianceAudit) => void;
  /** Create new audit handler */
  onCreateAudit?: () => void;
  /** Edit audit handler */
  onEditAudit?: (audit: ComplianceAudit) => void;
  /** Delete audit handler */
  onDeleteAudit?: (audit: ComplianceAudit) => void;
  /** View details handler */
  onViewDetails?: (audit: ComplianceAudit) => void;
  /** Download report handler */
  onDownloadReport?: (audit: ComplianceAudit) => void;
  /** Search change handler */
  onSearchChange?: (term: string) => void;
  /** Filter change handler */
  onFilterChange?: (filters: any) => void;
  /** View mode change handler */
  onViewModeChange?: (mode: 'list' | 'grid' | 'calendar') => void;
  /** Finding update handler */
  onUpdateFinding?: (auditId: string, findingId: string, updates: Partial<AuditFinding>) => void;
}

/**
 * ComplianceAudit Component
 * 
 * A comprehensive audit management component for tracking compliance audits,
 * findings, and follow-up actions. Features filtering, search, multiple view modes,
 * and detailed audit tracking with findings management.
 * 
 * @param props - ComplianceAudit component props
 * @returns JSX element representing the audit management interface
 */
const ComplianceAudit = ({
  audits = [],
  auditors = [],
  departments = [],
  loading = false,
  viewMode = 'grid',
  searchTerm = '',
  activeFilters = {
    status: [],
    type: [],
    priority: [],
    auditor: [],
    department: []
  },
  className = '',
  onAuditClick,
  onCreateAudit,
  onEditAudit,
  onDeleteAudit,
  onViewDetails,
  onDownloadReport,
  onSearchChange,
  onFilterChange,
  onViewModeChange,
  onUpdateFinding
}: ComplianceAuditProps) => {
  // State
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<ComplianceAudit | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    findings: true,
    actions: false
  });

  /**
   * Gets status configuration
   */
  const getStatusConfig = (status: AuditStatus) => {
    const configs = {
      scheduled: {
        color: 'text-blue-600 bg-blue-100 border-blue-200',
        icon: Calendar,
        label: 'Scheduled'
      },
      'in-progress': {
        color: 'text-yellow-600 bg-yellow-100 border-yellow-200',
        icon: Clock,
        label: 'In Progress'
      },
      completed: {
        color: 'text-green-600 bg-green-100 border-green-200',
        icon: CheckCircle,
        label: 'Completed'
      },
      cancelled: {
        color: 'text-gray-600 bg-gray-100 border-gray-200',
        icon: AlertCircle,
        label: 'Cancelled'
      },
      overdue: {
        color: 'text-red-600 bg-red-100 border-red-200',
        icon: AlertTriangle,
        label: 'Overdue'
      }
    };
    return configs[status];
  };

  /**
   * Gets type configuration
   */
  const getTypeConfig = (type: AuditType) => {
    const configs = {
      internal: { label: 'Internal', color: 'bg-blue-100 text-blue-800', icon: Building },
      external: { label: 'External', color: 'bg-purple-100 text-purple-800', icon: Globe },
      regulatory: { label: 'Regulatory', color: 'bg-red-100 text-red-800', icon: Shield },
      certification: { label: 'Certification', color: 'bg-green-100 text-green-800', icon: Award },
      compliance: { label: 'Compliance', color: 'bg-orange-100 text-orange-800', icon: Target },
      risk: { label: 'Risk', color: 'bg-yellow-100 text-yellow-800', icon: Flag }
    };
    return configs[type];
  };

  /**
   * Gets priority configuration
   */
  const getPriorityConfig = (priority: AuditPriority) => {
    const configs = {
      low: { color: 'text-gray-600', dot: 'bg-gray-400' },
      medium: { color: 'text-yellow-600', dot: 'bg-yellow-400' },
      high: { color: 'text-orange-600', dot: 'bg-orange-400' },
      critical: { color: 'text-red-600', dot: 'bg-red-400' }
    };
    return configs[priority];
  };

  /**
   * Gets finding severity configuration
   */
  const getFindingSeverityConfig = (severity: FindingSeverity) => {
    const configs = {
      critical: { color: 'text-red-600 bg-red-100', label: 'Critical', icon: AlertTriangle },
      major: { color: 'text-orange-600 bg-orange-100', label: 'Major', icon: AlertCircle },
      minor: { color: 'text-yellow-600 bg-yellow-100', label: 'Minor', icon: Flag },
      observation: { color: 'text-blue-600 bg-blue-100', label: 'Observation', icon: Eye }
    };
    return configs[severity];
  };

  /**
   * Calculates audit statistics
   */
  const getAuditStats = () => {
    const stats = {
      total: audits.length,
      scheduled: audits.filter(a => a.status === 'scheduled').length,
      inProgress: audits.filter(a => a.status === 'in-progress').length,
      completed: audits.filter(a => a.status === 'completed').length,
      overdue: audits.filter(a => a.status === 'overdue').length,
      totalFindings: audits.reduce((acc, audit) => acc + audit.findings.length, 0),
      openFindings: audits.reduce((acc, audit) => 
        acc + audit.findings.filter(f => f.status === 'open').length, 0),
      avgScore: audits.filter(a => a.score !== undefined).length > 0
        ? Math.round(audits.filter(a => a.score !== undefined)
            .reduce((acc, a) => acc + (a.score || 0), 0) / 
            audits.filter(a => a.score !== undefined).length)
        : 0
    };
    return stats;
  };

  /**
   * Toggles section expansion
   */
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  /**
   * Renders audit card
   */
  const renderAuditCard = (audit: ComplianceAudit) => {
    const statusConfig = getStatusConfig(audit.status);
    const typeConfig = getTypeConfig(audit.type);
    const priorityConfig = getPriorityConfig(audit.priority);
    const StatusIcon = statusConfig.icon;
    const TypeIcon = typeConfig.icon;

    const openFindings = audit.findings.filter(f => f.status === 'open').length;
    const criticalFindings = audit.findings.filter(f => f.severity === 'critical').length;

    return (
      <div
        key={audit.id}
        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onAuditClick?.(audit)}
        role="button"
        tabIndex={0}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onAuditClick?.(audit);
          }
        }}
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
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                // Handle more actions
              }}
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
              <span>Scheduled for {new Date(audit.scheduledDate).toLocaleDateString()}</span>
            ) : audit.status === 'completed' && audit.completedDate ? (
              <span>Completed {new Date(audit.completedDate).toLocaleDateString()}</span>
            ) : (
              <span>Updated {new Date(audit.updatedAt).toLocaleDateString()}</span>
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
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onViewDetails?.(audit);
              }}
              className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 
                       border border-blue-200 rounded hover:bg-blue-100"
              aria-label="View audit details"
            >
              <Eye className="w-3 h-3 mr-1" />
              View
            </button>
            
            {audit.status === 'completed' && (
              <button
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onDownloadReport?.(audit);
                }}
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

  const stats = getAuditStats();

  if (loading) {
    return (
      <div className={`bg-white ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-lg p-2">
              <FileSearch className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Compliance Audits</h1>
              <p className="text-gray-600">
                Track and manage compliance audits and findings
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {/* Handle refresh */}}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                       bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              aria-label="Refresh audits"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            
            <button
              onClick={onCreateAudit}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                       bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Audit
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Audits</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileSearch className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Findings</p>
                <p className="text-2xl font-bold text-red-600">{stats.openFindings}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-green-600">{stats.avgScore}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search audits..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange?.(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm 
                         focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                       bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center border border-gray-300 rounded-md">
            {[
              { mode: 'grid' as const, icon: BarChart3, label: 'Grid view' },
              { mode: 'list' as const, icon: FileText, label: 'List view' },
              { mode: 'calendar' as const, icon: Calendar, label: 'Calendar view' }
            ].map((view) => {
              const Icon = view.icon;
              return (
                <button
                  key={view.mode}
                  onClick={() => onViewModeChange?.(view.mode)}
                  className={`p-2 text-sm font-medium border-r border-gray-300 last:border-r-0 
                           hover:bg-gray-50 ${viewMode === view.mode 
                             ? 'bg-blue-50 text-blue-700' 
                             : 'text-gray-600'}`}
                  aria-label={view.label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {audits.length === 0 ? (
          <div className="text-center py-12">
            <FileSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Audits Found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 
                'No audits match your search criteria.' :
                'Get started by creating your first compliance audit.'
              }
            </p>
            <button
              onClick={onCreateAudit}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 
                       bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Audit
            </button>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {audits.map(renderAuditCard)}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {audits.map(renderAuditCard)}
              </div>
            )}

            {/* Calendar View */}
            {viewMode === 'calendar' && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View</h3>
                <p className="text-gray-600">Calendar view coming soon.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Filter Audits</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  aria-label="Close filters"
                >
                  <AlertCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="space-y-2">
                  {(['scheduled', 'in-progress', 'completed', 'cancelled', 'overdue'] as AuditStatus[]).map((status) => (
                    <label key={status} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={activeFilters.status.includes(status)}
                        onChange={() => {/* Handle filter change */}}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{status.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <div className="space-y-2">
                  {(['internal', 'external', 'regulatory', 'certification', 'compliance', 'risk'] as AuditType[]).map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={activeFilters.type.includes(type)}
                        onChange={() => {/* Handle filter change */}}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                         rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowFilters(false);
                  // Apply filters
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent 
                         rounded-md hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceAudit;
