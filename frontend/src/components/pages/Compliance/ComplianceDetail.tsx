'use client';

import React, { useState } from 'react';
import { 
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  User,
  FileText,
  Download,
  Upload,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Eye,
  Share2,
  MessageSquare,
  History,
  Bell,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Paperclip,
  ExternalLink,
  Users,
  Settings,
  Flag,
  Target,
  Activity
} from 'lucide-react';
import { ComplianceRequirement, ComplianceStatus, ComplianceCategory, CompliancePriority } from './ComplianceCard';

/**
 * Tab types for detail view
 */
type DetailTab = 'overview' | 'tasks' | 'evidence' | 'history' | 'comments' | 'settings';

/**
 * Comment interface
 */
interface ComplianceComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  isSystem: boolean;
  mentions?: string[];
  attachments?: {
    id: string;
    name: string;
    type: string;
    size: number;
  }[];
}

/**
 * History entry interface
 */
interface ComplianceHistoryEntry {
  id: string;
  action: string;
  description: string;
  performedBy: string;
  performedByName: string;
  timestamp: string;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  metadata?: Record<string, unknown>;
}

/**
 * Props for the ComplianceDetail component
 */
interface ComplianceDetailProps {
  /** Compliance requirement data */
  requirement: ComplianceRequirement;
  /** Comments for the requirement */
  comments?: ComplianceComment[];
  /** History entries for the requirement */
  history?: ComplianceHistoryEntry[];
  /** Available users for assignment */
  users?: Array<{ id: string; name: string; email: string; avatar?: string }>;
  /** Loading state */
  loading?: boolean;
  /** Edit mode state */
  editMode?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Edit mode toggle handler */
  onEditModeToggle?: (editMode: boolean) => void;
  /** Save changes handler */
  onSaveChanges?: (changes: Partial<ComplianceRequirement>) => void;
  /** Task completion toggle handler */
  onToggleTask?: (taskId: string, completed: boolean) => void;
  /** Add task handler */
  onAddTask?: (title: string, dueDate?: string) => void;
  /** Delete task handler */
  onDeleteTask?: (taskId: string) => void;
  /** Upload evidence handler */
  onUploadEvidence?: (files: FileList) => void;
  /** Download evidence handler */
  onDownloadEvidence?: (evidenceId: string) => void;
  /** Delete evidence handler */
  onDeleteEvidence?: (evidenceId: string) => void;
  /** Add comment handler */
  onAddComment?: (content: string, mentions?: string[]) => void;
  /** Delete comment handler */
  onDeleteComment?: (commentId: string) => void;
  /** Share requirement handler */
  onShare?: () => void;
  /** Assignment change handler */
  onAssignmentChange?: (userId: string) => void;
  /** Status change handler */
  onStatusChange?: (status: ComplianceStatus) => void;
  /** Priority change handler */
  onPriorityChange?: (priority: CompliancePriority) => void;
}

/**
 * ComplianceDetail Component
 * 
 * A comprehensive detail view component for compliance requirements with tabs for
 * overview, tasks, evidence, history, comments, and settings. Features inline editing,
 * file uploads, task management, and collaboration tools.
 * 
 * @param props - ComplianceDetail component props
 * @returns JSX element representing the compliance requirement detail view
 */
const ComplianceDetail = ({
  requirement,
  comments = [],
  history = [],
  users = [],
  loading = false,
  editMode = false,
  className = '',
  onEditModeToggle,
  onSaveChanges,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onUploadEvidence,
  onDownloadEvidence,
  onDeleteEvidence,
  onAddComment,
  onDeleteComment,
  onShare,
  onAssignmentChange,
  onStatusChange,
  onPriorityChange
}: ComplianceDetailProps) => {
  // State
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    tasks: true,
    evidence: true,
    risk: true,
    regulations: true
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: requirement.title,
    description: requirement.description,
    dueDate: requirement.dueDate,
    priority: requirement.priority,
    assignedTo: requirement.assignedTo
  });

  /**
   * Gets status configuration
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
   * Gets category configuration
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
   * Gets priority configuration
   */
  const getPriorityConfig = (priority: CompliancePriority) => {
    const configs = {
      low: { color: 'text-gray-600', dot: 'bg-gray-400', label: 'Low' },
      medium: { color: 'text-yellow-600', dot: 'bg-yellow-400', label: 'Medium' },
      high: { color: 'text-orange-600', dot: 'bg-orange-400', label: 'High' },
      critical: { color: 'text-red-600', dot: 'bg-red-400', label: 'Critical' }
    };
    return configs[priority];
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
   * Handles task addition
   */
  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask?.(newTaskTitle.trim(), newTaskDueDate || undefined);
      setNewTaskTitle('');
      setNewTaskDueDate('');
      setShowAddTask(false);
    }
  };

  /**
   * Handles comment submission
   */
  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment?.(newComment.trim());
      setNewComment('');
    }
  };

  /**
   * Handles save changes
   */
  const handleSaveChanges = () => {
    onSaveChanges?.(editForm);
    onEditModeToggle?.(false);
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
  const completedTasks = requirement.tasks.filter(task => task.completed).length;
  const daysUntilDue = getDaysUntilDue(requirement.dueDate);

  if (loading) {
    return (
      <div className={`bg-white ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            {editMode ? (
              <input
                type="text"
                value={editForm.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setEditForm(prev => ({ ...prev, title: e.target.value }))}
                className="text-2xl font-bold text-gray-900 border-none outline-none bg-transparent w-full 
                         focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                placeholder="Requirement title"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{requirement.title}</h1>
            )}
            
            <div className="flex items-center space-x-4 mb-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryConfig.color}`}>
                {categoryConfig.label}
              </span>
              
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusConfig.label}
              </div>
              
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${priorityConfig.dot}`}></div>
                <span className={`text-sm font-medium ${priorityConfig.color}`}>
                  {priorityConfig.label} Priority
                </span>
              </div>
            </div>
            
            {editMode ? (
              <textarea
                value={editForm.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                  setEditForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full text-gray-600 border border-gray-300 rounded-md px-3 py-2 
                         focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Requirement description"
              />
            ) : (
              <p className="text-gray-600">{requirement.description}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-3 ml-6">
            {editMode ? (
              <>
                <button
                  onClick={() => {
                    setEditForm({
                      title: requirement.title,
                      description: requirement.description,
                      dueDate: requirement.dueDate,
                      priority: requirement.priority,
                      assignedTo: requirement.assignedTo
                    });
                    onEditModeToggle?.(false);
                  }}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                           bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-white 
                           bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onShare}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                           bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
                <button
                  onClick={() => onEditModeToggle?.(true)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-white 
                           bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </button>
              </>
            )}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-gray-900">{requirement.progress}%</p>
                <p className="text-xs text-gray-500">{completedTasks}/{requirement.tasks.length} tasks</p>
              </div>
              <Target className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Due Date</p>
                <p className="text-lg font-bold text-gray-900">
                  {new Date(requirement.dueDate).toLocaleDateString()}
                </p>
                <p className={`text-xs font-medium ${
                  daysUntilDue <= 0 ? 'text-red-600' :
                  daysUntilDue <= 7 ? 'text-orange-600' :
                  'text-gray-500'
                }`}>
                  {daysUntilDue <= 0 ? 'Overdue' : 
                   daysUntilDue === 1 ? '1 day left' :
                   `${daysUntilDue} days left`}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Risk Level</p>
                <p className={`text-lg font-bold capitalize ${
                  requirement.risk.level === 'critical' ? 'text-red-600' :
                  requirement.risk.level === 'high' ? 'text-orange-600' :
                  requirement.risk.level === 'medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {requirement.risk.level}
                </p>
              </div>
              <Flag className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Evidence</p>
                <p className="text-2xl font-bold text-gray-900">{requirement.evidence.length}</p>
                <p className="text-xs text-gray-500">files uploaded</p>
              </div>
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6 py-4">
          {[
            { id: 'overview' as DetailTab, label: 'Overview', icon: Eye },
            { id: 'tasks' as DetailTab, label: 'Tasks', icon: CheckCircle, count: requirement.tasks.length },
            { id: 'evidence' as DetailTab, label: 'Evidence', icon: FileText, count: requirement.evidence.length },
            { id: 'history' as DetailTab, label: 'History', icon: History, count: history.length },
            { id: 'comments' as DetailTab, label: 'Comments', icon: MessageSquare, count: comments.length },
            { id: 'settings' as DetailTab, label: 'Settings', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Assignment and Dates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Assignment</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Assigned To</span>
                    {editMode ? (
                      <select
                        value={editForm.assignedTo}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                          setEditForm(prev => ({ ...prev, assignedTo: e.target.value }))}
                        className="text-sm border border-gray-300 rounded px-2 py-1 
                                 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {users.map(user => (
                          <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{requirement.assignedToName}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Due Date</span>
                    {editMode ? (
                      <input
                        type="date"
                        value={editForm.dueDate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setEditForm(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="text-sm border border-gray-300 rounded px-2 py-1 
                                 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-900">
                        {new Date(requirement.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Priority</span>
                    {editMode ? (
                      <select
                        value={editForm.priority}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                          setEditForm(prev => ({ ...prev, priority: e.target.value as CompliancePriority }))}
                        className="text-sm border border-gray-300 rounded px-2 py-1 
                                 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${priorityConfig.dot}`}></div>
                        <span className="text-sm text-gray-900 capitalize">{requirement.priority}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Created</span>
                    <span className="text-sm text-gray-900">
                      {new Date(requirement.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Last Updated</span>
                    <span className="text-sm text-gray-900">
                      {new Date(requirement.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {requirement.lastReview && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Last Review</span>
                      <span className="text-sm text-gray-900">
                        {new Date(requirement.lastReview).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  {requirement.nextReview && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Next Review</span>
                      <span className="text-sm text-gray-900">
                        {new Date(requirement.nextReview).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="bg-gray-50 rounded-lg p-4">
              <button
                onClick={() => toggleSection('risk')}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-lg font-medium text-gray-900">Risk Assessment</h3>
                {expandedSections.risk ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {expandedSections.risk && (
                <div className="mt-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Shield className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">Risk Level:</span>
                    <span className={`text-sm font-bold capitalize ${
                      requirement.risk.level === 'critical' ? 'text-red-600' :
                      requirement.risk.level === 'high' ? 'text-orange-600' :
                      requirement.risk.level === 'medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {requirement.risk.level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{requirement.risk.description}</p>
                </div>
              )}
            </div>

            {/* Regulations */}
            {requirement.regulations.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <button
                  onClick={() => toggleSection('regulations')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h3 className="text-lg font-medium text-gray-900">Related Regulations</h3>
                  {expandedSections.regulations ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                {expandedSections.regulations && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {requirement.regulations.map((regulation) => (
                        <span
                          key={regulation}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {regulation}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Tasks ({completedTasks}/{requirement.tasks.length})
              </h3>
              <button
                onClick={() => setShowAddTask(true)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 
                         bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </button>
            </div>

            {showAddTask && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Task title"
                    value={newTaskTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTaskTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm 
                             focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTaskDueDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm 
                             focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleAddTask}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-white 
                               bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                    >
                      Add Task
                    </button>
                    <button
                      onClick={() => {
                        setShowAddTask(false);
                        setNewTaskTitle('');
                        setNewTaskDueDate('');
                      }}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                               bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {requirement.tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        onToggleTask?.(task.id, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className={`text-sm font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {task.title}
                      </p>
                      {task.dueDate && (
                        <p className="text-xs text-gray-500">
                          Due {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onDeleteTask?.(task.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                    aria-label="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {requirement.tasks.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks</h3>
                <p className="text-gray-600 mb-4">Add tasks to track progress on this requirement.</p>
                <button
                  onClick={() => setShowAddTask(true)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 
                           bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Task
                </button>
              </div>
            )}
          </div>
        )}

        {/* Evidence Tab */}
        {activeTab === 'evidence' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Evidence Files ({requirement.evidence.length})
              </h3>
              <label className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 
                              bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files) {
                      onUploadEvidence?.(e.target.files);
                    }
                  }}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {requirement.evidence.map((evidence) => (
                <div
                  key={evidence.id}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{evidence.name}</p>
                      <p className="text-xs text-gray-500">
                        {evidence.type} • Uploaded {new Date(evidence.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onDownloadEvidence?.(evidence.id)}
                      className="p-1 text-gray-400 hover:text-blue-600 rounded"
                      aria-label="Download evidence"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteEvidence?.(evidence.id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                      aria-label="Delete evidence"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {requirement.evidence.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Evidence Files</h3>
                <p className="text-gray-600 mb-4">Upload files to document compliance with this requirement.</p>
                <label className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 
                                bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Your First File
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.files) {
                        onUploadEvidence?.(e.target.files);
                      }
                    }}
                  />
                </label>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Activity History</h3>
            
            <div className="space-y-4">
              {history.map((entry) => (
                <div key={entry.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Activity className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{entry.action}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                    <p className="text-xs text-gray-500 mt-1">by {entry.performedByName}</p>
                  </div>
                </div>
              ))}
            </div>

            {history.length === 0 && (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Activity History</h3>
                <p className="text-gray-600">Activity will appear here as changes are made to this requirement.</p>
              </div>
            )}
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Comments</h3>
            
            {/* Add Comment */}
            <div className="bg-gray-50 rounded-lg p-4">
              <textarea
                value={newComment}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
                rows={3}
                placeholder="Add a comment..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm 
                         focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-white 
                           bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post Comment
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-4 p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900">{comment.authorName}</p>
                        {comment.isSystem && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            System
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                    
                    {comment.attachments && comment.attachments.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-2">
                          {comment.attachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className="flex items-center space-x-2 px-2 py-1 bg-gray-100 rounded text-xs"
                            >
                              <Paperclip className="w-3 h-3" />
                              <span>{attachment.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => onDeleteComment?.(comment.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                    aria-label="Delete comment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {comments.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Comments</h3>
                <p className="text-gray-600">Start a conversation about this requirement.</p>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Requirement Settings</h3>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-base font-medium text-gray-900 mb-4">Status Management</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Current Status</span>
                  <select
                    value={requirement.status}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                      onStatusChange?.(e.target.value as ComplianceStatus)}
                    className="text-sm border border-gray-300 rounded px-2 py-1 
                             focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="compliant">Compliant</option>
                    <option value="non-compliant">Non-Compliant</option>
                    <option value="warning">Warning</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-base font-medium text-gray-900 mb-4">Notifications</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Email reminders</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Status change notifications</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked={false}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Daily progress updates</span>
                </label>
              </div>
            </div>

            <div className="border-t border-red-200 bg-red-50 rounded-lg p-4">
              <h4 className="text-base font-medium text-red-900 mb-4">Danger Zone</h4>
              <p className="text-sm text-red-700 mb-4">
                Deleting this requirement will permanently remove all associated tasks, evidence, and comments.
              </p>
              <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 
                               bg-white border border-red-300 rounded-md hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Requirement
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplianceDetail;
